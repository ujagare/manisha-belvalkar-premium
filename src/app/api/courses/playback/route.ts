import { apiError, apiSuccess, readJsonObject, requestId } from "@/lib/api";
import {
  buildWatermarkSpec,
  evaluateDeviceAccess,
  extractClientIpHash,
  hashIdentifier,
  isModuleUnlockedByDrip,
  PLAYBACK_SESSION_TTL_SECONDS,
  signBunnyEmbedUrl,
  signCourseStreamToken,
  STREAM_TOKEN_TTL_SECONDS,
} from "@/lib/course-security";
import { courses as staticCourses } from "@/lib/data";
import { isServerConfigured, serverEnv } from "@/lib/env";
import { consumeRateLimit } from "@/lib/rate-limit";
import { isSameOriginRequest } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCourseBySlug } from "@/lib/supabase/courses";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const traceId = requestId(request);
  try {
    if (!isSameOriginRequest(request)) {
      return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
    }

    const body = await readJsonObject(request);
    const courseSlug =
      typeof body.courseSlug === "string" ? body.courseSlug.trim() : "";
    const lessonId =
      typeof body.lessonId === "string" ? body.lessonId.trim() : "";
    const rawDeviceId =
      typeof body.deviceId === "string" && body.deviceId.trim().length >= 8
        ? body.deviceId.trim().slice(0, 128)
        : "browser-default-device";
    const deviceLabel =
      typeof body.deviceLabel === "string"
        ? body.deviceLabel.trim().slice(0, 120)
        : null;

    if (!courseSlug || !lessonId) {
      return apiError("BAD_REQUEST", "Course and lesson are required.", 422);
    }

    const course = await getCourseBySlug(courseSlug);
    if (!course) {
      return apiError("NOT_FOUND", "Course not found.", 404);
    }

    const parentModule = course.curriculum?.find((mod) =>
      mod.lessons.some((l) => l.id === lessonId),
    );
    const lesson = parentModule?.lessons.find((l) => l.id === lessonId);
    if (!lesson || !parentModule) {
      return apiError("NOT_FOUND", "Lesson not found in this course.", 404);
    }

    const ipHash = extractClientIpHash(request.headers);
    const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 280) || null;
    const serverReady = isServerConfigured();

    let user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null = null;
    if (serverReady) {
      const supabase = await createClient();
      const authRes = await supabase.auth.getUser();
      user = authRes.data.user;
    }

    if (serverReady) {
      const rateKey = user?.id ?? ipHash ?? "anon-preview";
      const allowed = await consumeRateLimit(
        request,
        "course-playback",
        40,
        600,
        rateKey,
      );
      if (!allowed) {
        return apiError(
          "RATE_LIMITED",
          "Too many playback requests. Please wait a moment.",
          429,
        );
      }
    }

    const isFreePreview = Boolean(lesson.free);
    if (!isFreePreview && !user) {
      return apiError(
        "UNAUTHORIZED",
        "Please sign in with your enrolled account to watch this lecture.",
        401,
      );
    }

    const admin = serverReady ? createAdminClient() : null;
    let enrolledAtIso: string | null = null;
    let profile: { full_name: string | null; email: string | null; phone: string | null } | null = null;
    let sessionId = "preview";
    const deviceHash = hashIdentifier(`${user?.id ?? "preview"}|${rawDeviceId}`);

    if (admin && user) {
      const [enrollmentRes, profileRes] = await Promise.all([
        admin
          .from("course_enrollments")
          .select("id,status,enrolled_at,created_at")
          .eq("user_id", user.id)
          .eq("course_slug", courseSlug)
          .in("status", ["active", "completed"])
          .limit(1)
          .maybeSingle(),
        admin
          .from("profiles")
          .select("full_name,email,phone")
          .eq("id", user.id)
          .maybeSingle(),
      ]);

      profile = profileRes.data ?? null;
      const enrollment = enrollmentRes.data;

      if (!isFreePreview && !enrollment) {
        return apiError(
          "FORBIDDEN",
          "Active enrollment is required to unlock this lecture.",
          403,
        );
      }

      enrolledAtIso = enrollment?.enrolled_at ?? enrollment?.created_at ?? null;

      if (!isFreePreview && enrollment) {
        const drip = isModuleUnlockedByDrip(
          parentModule.unlockOffsetDays,
          enrolledAtIso,
        );
        if (!drip.unlocked) {
          return apiError(
            "FORBIDDEN",
            "This module unlocks on schedule as part of your guided cohort pace.",
            403,
            { code: "DRIP_LOCKED", unlocksAt: drip.unlocksAtIso },
          );
        }

        // 1. Enforce per-student registered device cap (prevents Telegram/group credential sharing)
        const { data: existingDevices } = await admin
          .from("course_registered_devices")
          .select("device_id_hash,is_blocked")
          .eq("user_id", user.id);

        const maxDevices = serverEnv.courseMaxDevices();
        const decision = evaluateDeviceAccess(
          existingDevices ?? [],
          deviceHash,
          maxDevices,
        );

        if (decision === "DEVICE_BLOCKED") {
          await admin.from("course_security_events").insert({
            user_id: user.id,
            course_slug: courseSlug,
            lesson_id: lessonId,
            event_type: "blocked_device_attempt",
            severity: "critical",
            ip_hash: ipHash,
            device_id_hash: deviceHash,
            user_agent: userAgent,
            metadata: { deviceLabel },
          });
          return apiError(
            "FORBIDDEN",
            "Playback is restricted on this device due to a security violation. Please contact support.",
            403,
            { code: "DEVICE_BLOCKED" },
          );
        }

        if (decision === "DEVICE_LIMIT_REACHED") {
          await admin.from("course_security_events").insert({
            user_id: user.id,
            course_slug: courseSlug,
            lesson_id: lessonId,
            event_type: "device_limit_reached",
            severity: "warning",
            ip_hash: ipHash,
            device_id_hash: deviceHash,
            user_agent: userAgent,
            metadata: { maxDevices, deviceLabel },
          });
          return apiError(
            "FORBIDDEN",
            `Your account is already linked to ${maxDevices} devices (maximum allowed). Please watch on your registered device or ask support to reset your device list.`,
            403,
            { code: "DEVICE_LIMIT_REACHED", maxDevices },
          );
        }

        const nowIso = new Date().toISOString();
        if (decision === "REGISTER_NEW") {
          await admin.from("course_registered_devices").insert({
            user_id: user.id,
            device_id_hash: deviceHash,
            device_label: deviceLabel,
            ip_hash: ipHash,
            first_seen_at: nowIso,
            last_seen_at: nowIso,
          });
        } else {
          await admin
            .from("course_registered_devices")
            .update({ last_seen_at: nowIso, ip_hash: ipHash })
            .eq("user_id", user.id)
            .eq("device_id_hash", deviceHash);
        }

        // 2. Enforce Single Concurrent Stream: supersede any active stream on another device
        await admin
          .from("course_playback_sessions")
          .update({
            revoked_at: nowIso,
            revoke_reason: "SUPERSEDED_BY_OTHER_DEVICE",
          })
          .eq("user_id", user.id)
          .neq("device_id_hash", deviceHash)
          .is("revoked_at", null)
          .gt("expires_at", nowIso);

        const expiresIso = new Date(
          Date.now() + PLAYBACK_SESSION_TTL_SECONDS * 1000,
        ).toISOString();

        const { data: createdSession } = await admin
          .from("course_playback_sessions")
          .insert({
            user_id: user.id,
            course_slug: courseSlug,
            lesson_id: lessonId,
            device_id_hash: deviceHash,
            ip_hash: ipHash,
            user_agent: userAgent,
            started_at: nowIso,
            last_heartbeat_at: nowIso,
            expires_at: expiresIso,
          })
          .select("id")
          .single();

        if (createdSession?.id) {
          sessionId = createdSession.id;
        }
      }
    }

    const watermark = buildWatermarkSpec({
      fullName:
        profile?.full_name ??
        (typeof user?.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name
          : null),
      email: profile?.email ?? user?.email ?? null,
      phone: profile?.phone ?? null,
      userId: user?.id ?? null,
      ipHash,
    });

    // Resolve private media credentials (DB vault first, static fallback second)
    let mediaRow: {
      video_provider: string;
      storage_path: string | null;
      vdocipher_video_id: string | null;
      bunny_library_id: string | null;
      bunny_video_id: string | null;
      external_source_url: string | null;
    } | null = null;

    if (admin) {
      const { data } = await admin
        .from("course_lesson_media")
        .select(
          "video_provider,storage_path,vdocipher_video_id,bunny_library_id,bunny_video_id,external_source_url",
        )
        .eq("course_slug", courseSlug)
        .eq("lesson_slug", lessonId)
        .maybeSingle();
      mediaRow = data ?? null;
    }

    const staticFallbackUrl = staticCourses
      .find((c) => c.slug === courseSlug)
      ?.curriculum?.flatMap((m) => m.lessons)
      .find((l) => l.id === lessonId)?.videoUrl;

    const provider = mediaRow?.video_provider ?? lesson.videoProvider ?? "supabase_private";
    const hasVaultSource = Boolean(
      (provider === "vdocipher" && mediaRow?.vdocipher_video_id) ||
        (provider === "bunny" && mediaRow?.bunny_library_id && mediaRow?.bunny_video_id) ||
        (provider === "supabase_private" && mediaRow?.storage_path) ||
        (provider === "external_signed" && mediaRow?.external_source_url) ||
        staticFallbackUrl,
    );

    if (!hasVaultSource) {
      return apiSuccess({
        ready: false,
        sessionId,
        watermark,
      });
    }

    // Mode A: VdoCipher Hardware DRM (Widevine + FairPlay + server-baked moving watermark)
    if (provider === "vdocipher" && mediaRow?.vdocipher_video_id) {
      const vdoSecret = serverEnv.vdocipherApiSecret();
      if (!vdoSecret) {
        return apiError(
          "SERVICE_UNAVAILABLE",
          "VdoCipher DRM secret is not configured on the server yet.",
          503,
        );
      }

      const otpResponse = await fetch(
        `https://dev.vdocipher.com/api/videos/${encodeURIComponent(mediaRow.vdocipher_video_id)}/otp`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Apisecret ${vdoSecret}`,
          },
          body: JSON.stringify({
            ttl: 300,
            annotate: JSON.stringify(watermark.vdocipherAnnotations),
          }),
          cache: "no-store",
        },
      );

      const otpData = (await otpResponse.json().catch(() => null)) as
        | { otp?: string; playbackInfo?: string; message?: string }
        | null;

      if (!otpResponse.ok || !otpData?.otp || !otpData?.playbackInfo) {
        console.error("[courses:vdocipher]", { traceId, status: otpResponse.status, otpData });
        return apiError(
          "BAD_GATEWAY",
          "Could not initialize encrypted DRM stream. Please retry.",
          502,
        );
      }

      return apiSuccess({
        ready: true,
        mode: "vdocipher",
        otp: otpData.otp,
        playbackInfo: otpData.playbackInfo,
        sessionId,
        watermark,
        tokenExpiresAt: Math.floor(Date.now() / 1000) + 280,
      });
    }

    // Mode B: Bunny Stream Token-Authenticated HLS Embed
    if (
      provider === "bunny" &&
      mediaRow?.bunny_library_id &&
      mediaRow?.bunny_video_id
    ) {
      const expiresUnix = Math.floor(Date.now() / 1000) + 600;
      const embedUrl = signBunnyEmbedUrl({
        libraryId: mediaRow.bunny_library_id,
        videoId: mediaRow.bunny_video_id,
        signingKey: serverEnv.bunnyStreamSigningKey(),
        expiresUnix,
      });

      return apiSuccess({
        ready: true,
        mode: "bunny",
        embedUrl,
        sessionId,
        watermark,
        tokenExpiresAt: expiresUnix,
      });
    }

    // Mode C: Private Vault Byte-Range Stream Proxy (HMAC-bound to user + session + IP + 120s TTL)
    const secret =
      serverEnv.courseStreamSecret() ??
      "local-dev-fallback-course-stream-secret-key";
    const nowSec = Math.floor(Date.now() / 1000);
    const expSec = nowSec + STREAM_TOKEN_TTL_SECONDS;

    const streamToken = signCourseStreamToken(
      {
        sid: sessionId,
        uid: user?.id ?? "preview",
        c: courseSlug,
        l: lessonId,
        iph: ipHash,
        dvh: deviceHash,
        free: isFreePreview && !user,
        iat: nowSec,
        exp: expSec,
      },
      secret,
    );

    return apiSuccess({
      ready: true,
      mode: "vault_stream",
      streamUrl: `/api/courses/stream/${streamToken}`,
      sessionId,
      watermark,
      tokenExpiresAt: expSec,
    });
  } catch (error) {
    console.error("[courses:playback]", { traceId, error });
    return apiError(
      "INTERNAL_ERROR",
      "Could not authorize lecture playback.",
      500,
      { traceId },
    );
  }
}
