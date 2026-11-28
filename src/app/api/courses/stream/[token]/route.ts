import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { join, normalize } from "node:path";
import { Readable } from "node:stream";
import {
  COURSE_VIDEO_BUCKET,
  extractClientIpHash,
  isSecFetchAllowedForStream,
  verifyCourseStreamToken,
} from "@/lib/course-security";
import { courses as staticCourses } from "@/lib/data";
import { isServerConfigured, serverEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const SECURITY_HEADERS: Record<string, string> = {
  "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  "X-Content-Type-Options": "nosniff",
  "Content-Disposition": "inline",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Referrer-Policy": "no-referrer",
};

function forbiddenResponse(reason: string, status = 403) {
  return new Response(JSON.stringify({ ok: false, error: reason }), {
    status,
    headers: {
      ...SECURITY_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export async function GET(
  request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const ipHash = extractClientIpHash(request.headers);
  const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 280) || null;
  const serverReady = isServerConfigured();
  const admin = serverReady ? createAdminClient() : null;

  // 1. Block direct browser tab navigation, download managers (IDM/yt-dlp/curl), and cross-site hotlinks
  if (!isSecFetchAllowedForStream(request.headers)) {
    if (admin) {
      void admin.from("course_security_events").insert({
        course_slug: "unknown",
        event_type: "direct_stream_scrape_blocked",
        severity: "critical",
        ip_hash: ipHash,
        user_agent: userAgent,
        metadata: {
          secFetchDest: request.headers.get("sec-fetch-dest"),
          secFetchMode: request.headers.get("sec-fetch-mode"),
          secFetchSite: request.headers.get("sec-fetch-site"),
        },
      });
    }
    return forbiddenResponse("Direct media access or external downloaders are prohibited.");
  }

  // 2. Authenticate viewer cookie when Supabase is configured
  let userId: string | null = null;
  if (serverReady) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  }

  // 3. Verify HMAC stream token signature, expiry, user binding, and IP hash
  const secret =
    serverEnv.courseStreamSecret() ??
    "local-dev-fallback-course-stream-secret-key";
  const verification = verifyCourseStreamToken(token, secret, {
    userId,
    ipHash,
  });

  if (!verification.valid) {
    if (admin && verification.reason !== "TOKEN_EXPIRED") {
      void admin.from("course_security_events").insert({
        user_id: userId,
        course_slug: "unknown",
        event_type: `stream_token_${verification.reason.toLowerCase()}`,
        severity: "warning",
        ip_hash: ipHash,
        user_agent: userAgent,
        metadata: { reason: verification.reason },
      });
    }
    return forbiddenResponse(
      verification.reason === "TOKEN_EXPIRED"
        ? "Stream token expired. Refreshing secure session."
        : "Invalid or unauthorized playback token.",
      verification.reason === "TOKEN_EXPIRED" ? 401 : 403,
    );
  }

  const { payload } = verification;

  // 4. Verify live enrollment + non-revoked single-stream playback session
  if (admin && !payload.free && payload.uid !== "preview") {
    const [enrollmentRes, sessionRes] = await Promise.all([
      admin
        .from("course_enrollments")
        .select("id")
        .eq("user_id", payload.uid)
        .eq("course_slug", payload.c)
        .in("status", ["active", "completed"])
        .limit(1)
        .maybeSingle(),
      payload.sid !== "preview"
        ? admin
            .from("course_playback_sessions")
            .select("id,revoked_at,revoke_reason,expires_at")
            .eq("id", payload.sid)
            .eq("user_id", payload.uid)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    if (!enrollmentRes.data) {
      return forbiddenResponse("Course access has been revoked or expired.");
    }

    if (
      sessionRes.data?.revoked_at ||
      (sessionRes.data?.expires_at &&
        Date.parse(sessionRes.data.expires_at) < Date.now())
    ) {
      return forbiddenResponse(
        sessionRes.data?.revoke_reason === "SUPERSEDED_BY_OTHER_DEVICE"
          ? "Account started streaming on another device."
          : "Playback session expired.",
        409,
      );
    }
  }

  // 5. Resolve upstream private video URL (never revealed to client)
  let upstreamUrl: string | null = null;
  let localPublicFile: string | null = null;

  if (admin) {
    const { data: media } = await admin
      .from("course_lesson_media")
      .select("video_provider,storage_path,external_source_url")
      .eq("course_slug", payload.c)
      .eq("lesson_slug", payload.l)
      .maybeSingle();

    if (media?.video_provider === "supabase_private" && media.storage_path) {
      const { data: signed, error } = await admin.storage
        .from(COURSE_VIDEO_BUCKET)
        .createSignedUrl(media.storage_path, 60);
      if (error || !signed?.signedUrl) {
        return forbiddenResponse("Private video object could not be opened.", 404);
      }
      upstreamUrl = signed.signedUrl;
    } else if (media?.external_source_url) {
      if (media.external_source_url.startsWith("/")) {
        localPublicFile = media.external_source_url;
      } else {
        upstreamUrl = media.external_source_url;
      }
    }
  }

  if (!upstreamUrl && !localPublicFile) {
    const fallback = staticCourses
      .find((c) => c.slug === payload.c)
      ?.curriculum?.flatMap((m) => m.lessons)
      .find((l) => l.id === payload.l)?.videoUrl;
    if (fallback) {
      if (fallback.startsWith("/")) localPublicFile = fallback;
      else upstreamUrl = fallback;
    }
  }

  const rangeHeader = request.headers.get("range");

  // 6a. Local file byte-range streaming (for local dev / self-hosted files)
  if (localPublicFile) {
    const safeRel = normalize(localPublicFile).replace(/^(\.\.(\/|\\|$))+/, "").replace(/^[/\\]+/, "");
    const absPath = join(process.cwd(), "public", safeRel);
    try {
      const fileStat = await stat(absPath);
      const totalSize = fileStat.size;
      const contentType = absPath.endsWith(".webm") ? "video/webm" : "video/mp4";

      if (rangeHeader) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
        if (!match) {
          return new Response(null, {
            status: 416,
            headers: { ...SECURITY_HEADERS, "Content-Range": `bytes */${totalSize}` },
          });
        }
        const start = match[1] ? Number.parseInt(match[1], 10) : 0;
        const end = match[2]
          ? Math.min(Number.parseInt(match[2], 10), totalSize - 1)
          : Math.min(start + 2 * 1024 * 1024 - 1, totalSize - 1);

        if (start >= totalSize || start > end) {
          return new Response(null, {
            status: 416,
            headers: { ...SECURITY_HEADERS, "Content-Range": `bytes */${totalSize}` },
          });
        }

        const chunkLength = end - start + 1;
        const webStream = Readable.toWeb(
          createReadStream(absPath, { start, end }),
        ) as ReadableStream;

        return new Response(webStream, {
          status: 206,
          headers: {
            ...SECURITY_HEADERS,
            "Content-Type": contentType,
            "Accept-Ranges": "bytes",
            "Content-Range": `bytes ${start}-${end}/${totalSize}`,
            "Content-Length": String(chunkLength),
          },
        });
      }

      const webStream = Readable.toWeb(createReadStream(absPath)) as ReadableStream;
      return new Response(webStream, {
        status: 200,
        headers: {
          ...SECURITY_HEADERS,
          "Content-Type": contentType,
          "Accept-Ranges": "bytes",
          "Content-Length": String(totalSize),
        },
      });
    } catch {
      return forbiddenResponse("Video file not found.", 404);
    }
  }

  if (!upstreamUrl) {
    return forbiddenResponse("No video source configured for this lesson.", 404);
  }

  // 6b. Remote Private Storage / CDN Byte-Range Proxy (streams chunks directly without buffering RAM)
  const upstreamHeaders = new Headers();
  if (rangeHeader) {
    upstreamHeaders.set("Range", rangeHeader);
  }

  const upstream = await fetch(upstreamUrl, {
    method: "GET",
    headers: upstreamHeaders,
    cache: "no-store",
  });

  if (!upstream.ok && upstream.status !== 206) {
    return forbiddenResponse("Upstream media storage unavailable.", 502);
  }

  const responseHeaders = new Headers(SECURITY_HEADERS);
  responseHeaders.set(
    "Content-Type",
    upstream.headers.get("content-type") ?? "video/mp4",
  );
  responseHeaders.set(
    "Accept-Ranges",
    upstream.headers.get("accept-ranges") ?? "bytes",
  );
  const contentRange = upstream.headers.get("content-range");
  if (contentRange) responseHeaders.set("Content-Range", contentRange);
  const contentLength = upstream.headers.get("content-length");
  if (contentLength) responseHeaders.set("Content-Length", contentLength);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
