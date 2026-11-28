import { apiError, apiSuccess, readJsonObject, requestId } from "@/lib/api";
import { flattenLessons } from "@/lib/course-content";
import {
  extractClientIpHash,
  hashIdentifier,
  PLAYBACK_SESSION_TTL_SECONDS,
  signCourseStreamToken,
  STREAM_TOKEN_TTL_SECONDS,
} from "@/lib/course-security";
import { isServerConfigured, serverEnv } from "@/lib/env";
import { isSameOriginRequest } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCourseBySlug } from "@/lib/supabase/courses";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const ALLOWED_EVENTS = new Set([
  "devtools_detected",
  "watermark_tampered",
  "capture_shortcut_blocked",
  "context_menu_blocked",
  "pip_or_cast_blocked",
  "focus_capture_shield",
]);

export async function POST(request: Request) {
  const traceId = requestId(request);
  try {
    if (!isSameOriginRequest(request)) {
      return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
    }

    const body = await readJsonObject(request);
    const action = typeof body.action === "string" ? body.action : "";
    const courseSlug =
      typeof body.courseSlug === "string" ? body.courseSlug.trim() : "";
    const lessonId =
      typeof body.lessonId === "string" ? body.lessonId.trim() : "";

    if (!courseSlug) {
      return apiError("BAD_REQUEST", "Course slug is required.", 422);
    }

    if (!isServerConfigured()) {
      return apiSuccess({ ok: true, offlineFallback: true });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const admin = createAdminClient();
    const ipHash = extractClientIpHash(request.headers);
    const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 280) || null;

    // 1. Security Telemetry (works for both preview and enrolled sessions)
    if (action === "security_event") {
      const rawType = typeof body.eventType === "string" ? body.eventType : "";
      const eventType = ALLOWED_EVENTS.has(rawType) ? rawType : "client_tamper_alert";
      const severity =
        eventType === "watermark_tampered" || eventType === "devtools_detected"
          ? "critical"
          : "warning";
      const rawDeviceId =
        typeof body.deviceId === "string" ? body.deviceId.trim().slice(0, 128) : "unknown";

      await admin.from("course_security_events").insert({
        user_id: user?.id ?? null,
        course_slug: courseSlug,
        lesson_id: lessonId || null,
        event_type: eventType,
        severity,
        ip_hash: ipHash,
        device_id_hash: hashIdentifier(`${user?.id ?? "preview"}|${rawDeviceId}`),
        user_agent: userAgent,
        metadata:
          body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
            ? (body.metadata as Record<string, string | number | boolean | null>)
            : {},
      });

      return apiSuccess({ logged: true });
    }

    if (!user) {
      return apiError("UNAUTHORIZED", "Please sign in.", 401);
    }

    // 2. Student Personal Notes (Save or Load)
    if (action === "save_note") {
      if (!lessonId) return apiError("BAD_REQUEST", "Lesson ID required.", 422);
      const content =
        typeof body.content === "string" ? body.content.slice(0, 8000) : "";

      const { error } = await supabase.from("course_lesson_notes").upsert(
        {
          user_id: user.id,
          course_slug: courseSlug,
          lesson_id: lessonId,
          content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_slug,lesson_id" },
      );

      if (error) {
        return apiError("FORBIDDEN", "Could not save note. Verify active enrollment.", 403);
      }
      return apiSuccess({ saved: true });
    }

    // 3. Live Playback Heartbeat + Progress Position Sync + Token Rotation
    if (action === "heartbeat") {
      const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
      const rawDeviceId =
        typeof body.deviceId === "string" ? body.deviceId.trim().slice(0, 128) : "browser-default-device";
      const watchedSeconds =
        typeof body.watchedSeconds === "number"
          ? Math.max(0, Math.min(86400, Math.floor(body.watchedSeconds)))
          : 0;
      const autoCompleted = body.completed === true;
      const refreshStream = body.refreshStream === true;

      if (sessionId && sessionId !== "preview") {
        const { data: session } = await admin
          .from("course_playback_sessions")
          .select("id,revoked_at,revoke_reason")
          .eq("id", sessionId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (!session || session.revoked_at) {
          return apiSuccess({
            active: false,
            reason: session?.revoke_reason ?? "SESSION_EXPIRED",
          });
        }

        const nowIso = new Date().toISOString();
        const nextExpiresIso = new Date(
          Date.now() + PLAYBACK_SESSION_TTL_SECONDS * 1000,
        ).toISOString();

        await admin
          .from("course_playback_sessions")
          .update({
            lesson_id: lessonId || undefined,
            last_heartbeat_at: nowIso,
            expires_at: nextExpiresIso,
          })
          .eq("id", sessionId);
      }

      // Sync watched_seconds & optional auto-completion
      if (lessonId) {
        const course = await getCourseBySlug(courseSlug);
        if (course && flattenLessons(course).some((l) => l.id === lessonId)) {
          const { data: existingProg } = await supabase
            .from("course_lesson_progress")
            .select("completed,completed_at,watched_seconds")
            .eq("user_id", user.id)
            .eq("course_slug", courseSlug)
            .eq("lesson_id", lessonId)
            .maybeSingle();

          const nowIso = new Date().toISOString();
          const finalCompleted = Boolean(existingProg?.completed || autoCompleted);
          const bestWatched = Math.max(existingProg?.watched_seconds ?? 0, watchedSeconds);

          await supabase.from("course_lesson_progress").upsert(
            {
              user_id: user.id,
              course_slug: courseSlug,
              lesson_id: lessonId,
              completed: finalCompleted,
              watched_seconds: bestWatched,
              last_watched_at: nowIso,
              completed_at: finalCompleted
                ? (existingProg?.completed_at ?? nowIso)
                : null,
            },
            { onConflict: "user_id,course_slug,lesson_id" },
          );
        }
      }

      let nextStreamUrl: string | null = null;
      let nextTokenExpiresAt: number | null = null;

      if (refreshStream && lessonId) {
        const secret =
          serverEnv.courseStreamSecret() ??
          "local-dev-fallback-course-stream-secret-key";
        const nowSec = Math.floor(Date.now() / 1000);
        const expSec = nowSec + STREAM_TOKEN_TTL_SECONDS;
        const deviceHash = hashIdentifier(`${user.id}|${rawDeviceId}`);

        const rotatedToken = signCourseStreamToken(
          {
            sid: sessionId || "preview",
            uid: user.id,
            c: courseSlug,
            l: lessonId,
            iph: ipHash,
            dvh: deviceHash,
            free: false,
            iat: nowSec,
            exp: expSec,
          },
          secret,
        );
        nextStreamUrl = `/api/courses/stream/${rotatedToken}`;
        nextTokenExpiresAt = expSec;
      }

      return apiSuccess({
        active: true,
        streamUrl: nextStreamUrl,
        tokenExpiresAt: nextTokenExpiresAt,
      });
    }

    return apiError("BAD_REQUEST", "Unsupported classroom action.", 422);
  } catch (error) {
    console.error("[courses:classroom]", { traceId, error });
    return apiError("INTERNAL_ERROR", "Classroom sync failed.", 500, { traceId });
  }
}
