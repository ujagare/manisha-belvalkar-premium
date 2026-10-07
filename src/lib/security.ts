import { timingSafeEqual } from "node:crypto";

/**
 * Cookie-authenticated mutations must originate from this site. Browsers send
 * Origin for fetch/POST requests; Sec-Fetch-Site is retained as a defence in
 * depth signal for same-origin navigations.
 */
export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return request.headers.get("sec-fetch-site") === "same-origin";

  try {
    return new URL(origin).host.toLowerCase() === host.split(",")[0].trim().toLowerCase();
  } catch {
    return false;
  }
}

export function constantTimeEqualHex(left: string, right: string) {
  if (!/^[a-f0-9]+$/i.test(left) || !/^[a-f0-9]+$/i.test(right) || left.length !== right.length) return false;
  const a = Buffer.from(left, "hex");
  const b = Buffer.from(right, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
