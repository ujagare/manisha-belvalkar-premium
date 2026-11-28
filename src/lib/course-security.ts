import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const COURSE_VIDEO_BUCKET = "course-videos-private";
export const STREAM_TOKEN_TTL_SECONDS = 120;
export const PLAYBACK_SESSION_TTL_SECONDS = 90;

export interface StreamTokenPayload {
  /** Playback session UUID (or "preview" for unauthenticated free lessons). */
  sid: string;
  /** Authenticated user UUID (or "preview" for unauthenticated free lessons). */
  uid: string;
  /** Course slug. */
  c: string;
  /** Lesson slug / id. */
  l: string;
  /** SHA-256 hash prefix of client IP (optional when local/unavailable). */
  iph: string | null;
  /** SHA-256 hash of learner device fingerprint. */
  dvh: string;
  /** Whether this token authorizes a free preview lesson. */
  free: boolean;
  /** Issued-at Unix timestamp in seconds. */
  iat: number;
  /** Expiration Unix timestamp in seconds. */
  exp: number;
}

export type VerifyStreamTokenResult =
  | { valid: true; payload: StreamTokenPayload }
  | { valid: false; reason: string };

export function hashIdentifier(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export function extractClientIpHash(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = headers.get("x-real-ip")?.trim();
  const cfIp = headers.get("cf-connecting-ip")?.trim();
  const raw = cfIp || forwarded || realIp;
  if (!raw) return null;
  return hashIdentifier(raw).slice(0, 24);
}

function hmacBase64Url(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function signCourseStreamToken(
  payload: StreamTokenPayload,
  secret: string,
): string {
  if (!secret || secret.length < 16) {
    throw new Error("COURSE_STREAM_SECRET must be at least 16 characters.");
  }
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const signature = hmacBase64Url(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export function verifyCourseStreamToken(
  token: string,
  secret: string,
  context: {
    userId: string | null;
    ipHash: string | null;
    nowSec?: number;
  },
): VerifyStreamTokenResult {
  if (!token || !secret || secret.length < 16) {
    return { valid: false, reason: "INVALID_SECRET_OR_TOKEN" };
  }
  const dotIndex = token.indexOf(".");
  if (dotIndex <= 0 || dotIndex !== token.lastIndexOf(".")) {
    return { valid: false, reason: "MALFORMED_TOKEN" };
  }
  const encodedPayload = token.slice(0, dotIndex);
  const providedSig = token.slice(dotIndex + 1);
  const expectedSig = hmacBase64Url(encodedPayload, secret);

  const providedBuf = Buffer.from(providedSig, "utf8");
  const expectedBuf = Buffer.from(expectedSig, "utf8");
  if (
    providedBuf.length !== expectedBuf.length ||
    !timingSafeEqual(providedBuf, expectedBuf)
  ) {
    return { valid: false, reason: "SIGNATURE_MISMATCH" };
  }

  let payload: StreamTokenPayload;
  try {
    payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as StreamTokenPayload;
  } catch {
    return { valid: false, reason: "CORRUPT_PAYLOAD" };
  }

  if (
    typeof payload?.sid !== "string" ||
    typeof payload?.uid !== "string" ||
    typeof payload?.c !== "string" ||
    typeof payload?.l !== "string" ||
    typeof payload?.dvh !== "string" ||
    typeof payload?.exp !== "number"
  ) {
    return { valid: false, reason: "MISSING_CLAIMS" };
  }

  const nowSec = context.nowSec ?? Math.floor(Date.now() / 1000);
  if (payload.exp <= nowSec) {
    return { valid: false, reason: "TOKEN_EXPIRED" };
  }

  // Enrolled lessons strictly require the same signed-in user cookie.
  if (!payload.free) {
    if (!context.userId || payload.uid !== context.userId) {
      return { valid: false, reason: "USER_MISMATCH" };
    }
  } else if (payload.uid !== "preview" && context.userId !== payload.uid) {
    return { valid: false, reason: "USER_MISMATCH" };
  }

  // Bind stream token to client IP hash when both issue & stream see a client IP.
  if (payload.iph && context.ipHash && payload.iph !== context.ipHash) {
    return { valid: false, reason: "IP_MISMATCH" };
  }

  return { valid: true, payload };
}

/**
 * Rejects direct URL-bar navigation, download managers, and cross-site embeds
 * on the protected `/api/courses/stream/[token]` media endpoint.
 */
export function isSecFetchAllowedForStream(headers: Headers): boolean {
  const fetchSite = headers.get("sec-fetch-site")?.toLowerCase();
  const fetchDest = headers.get("sec-fetch-dest")?.toLowerCase();
  const fetchMode = headers.get("sec-fetch-mode")?.toLowerCase();

  // Modern browsers always send Sec-Fetch-* on HTTPS/localhost media requests.
  if (fetchSite && !["same-origin", "same-site"].includes(fetchSite)) {
    return false;
  }
  if (fetchDest && !["video", "audio", "empty"].includes(fetchDest)) {
    return false;
  }
  if (fetchMode === "navigate") {
    return false;
  }
  // Require a non-empty browser User-Agent (blocks naive curl/wget/python-requests).
  const ua = headers.get("user-agent")?.trim() ?? "";
  if (ua.length < 12 || /^(curl|wget|python-requests|go-http-client|aria2|idm|lavf|ffmpeg|yt-dlp)/i.test(ua)) {
    return false;
  }
  return true;
}

export function maskPhoneForWatermark(phone?: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return null;
  return `+${digits.slice(0, 2)}••••${digits.slice(-4)}`;
}

export interface WatermarkSpec {
  primaryText: string;
  secondaryText: string;
  fingerprintCode: string;
  vdocipherAnnotations: Array<Record<string, string>>;
}

/**
 * Generates both client overlay strings and VdoCipher server-baked moving
 * DRM watermark annotations (`type: "rtext"`).
 */
export function buildWatermarkSpec(input: {
  fullName?: string | null;
  email?: string | null;
  phone?: string | null;
  userId?: string | null;
  ipHash?: string | null;
}): WatermarkSpec {
  const emailLabel = input.email?.trim() || "Protected Preview";
  const maskedPhone = maskPhoneForWatermark(input.phone);
  const shortUser = input.userId
    ? input.userId.replaceAll("-", "").slice(0, 8).toUpperCase()
    : (input.ipHash?.slice(0, 8).toUpperCase() ?? "PREVIEW");

  const primaryText = [emailLabel, maskedPhone].filter(Boolean).join(" · ");
  const secondaryText = [
    input.fullName?.trim() || null,
    `UID:${shortUser}`,
  ]
    .filter(Boolean)
    .join(" · ");

  const vdocipherText = `${emailLabel}${maskedPhone ? ` ${maskedPhone}` : ""} [${shortUser}]`;

  return {
    primaryText,
    secondaryText,
    fingerprintCode: shortUser,
    vdocipherAnnotations: [
      {
        type: "rtext",
        text: vdocipherText,
        alpha: "0.42",
        color: "0xFFFFFF",
        size: "15",
        interval: "5000",
      },
    ],
  };
}

/**
 * Generates a Bunny Stream token-authenticated embed URL:
 * token = SHA256_HEX(signingKey + videoId + expiresUnix)
 */
export function signBunnyEmbedUrl(input: {
  libraryId: string;
  videoId: string;
  signingKey?: string | null;
  expiresUnix: number;
}): string {
  const base = `https://iframe.mediadelivery.net/embed/${encodeURIComponent(input.libraryId)}/${encodeURIComponent(input.videoId)}`;
  const params = new URLSearchParams({
    autoplay: "false",
    loop: "false",
    muted: "false",
    preload: "true",
    responsive: "true",
  });
  if (input.signingKey) {
    const token = createHash("sha256")
      .update(`${input.signingKey}${input.videoId}${input.expiresUnix}`)
      .digest("hex");
    params.set("token", token);
    params.set("expires", String(input.expiresUnix));
  }
  return `${base}?${params.toString()}`;
}

export type DeviceAccessDecision =
  | "ALLOWED_EXISTING"
  | "REGISTER_NEW"
  | "DEVICE_BLOCKED"
  | "DEVICE_LIMIT_REACHED";

export function evaluateDeviceAccess(
  existingDevices: Array<{ device_id_hash: string; is_blocked: boolean }>,
  incomingDeviceHash: string,
  maxDevices: number,
): DeviceAccessDecision {
  const found = existingDevices.find(
    (d) => d.device_id_hash === incomingDeviceHash,
  );
  if (found) {
    return found.is_blocked ? "DEVICE_BLOCKED" : "ALLOWED_EXISTING";
  }
  if (existingDevices.length >= maxDevices) {
    return "DEVICE_LIMIT_REACHED";
  }
  return "REGISTER_NEW";
}

export function isModuleUnlockedByDrip(
  unlockOffsetDays: number | undefined,
  enrolledAtIso: string | null | undefined,
  nowMs = Date.now(),
): { unlocked: boolean; unlocksAtIso: string | null } {
  const offset = unlockOffsetDays ?? 0;
  if (offset <= 0 || !enrolledAtIso) {
    return { unlocked: true, unlocksAtIso: null };
  }
  const enrolledMs = Date.parse(enrolledAtIso);
  if (Number.isNaN(enrolledMs)) {
    return { unlocked: true, unlocksAtIso: null };
  }
  const unlockMs = enrolledMs + offset * 24 * 60 * 60 * 1000;
  return {
    unlocked: nowMs >= unlockMs,
    unlocksAtIso: new Date(unlockMs).toISOString(),
  };
}
