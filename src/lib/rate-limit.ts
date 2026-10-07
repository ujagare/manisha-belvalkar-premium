import "server-only";
import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

function clientAddress(request: Request) {
  return (
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export async function consumeRateLimit(
  request: Request,
  scope: string,
  limit: number,
  windowSeconds: number,
  userId?: string,
) {
  const identity = userId ?? clientAddress(request);
  const digest = createHash("sha256").update(`${scope}:${identity}`).digest("hex");
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("consume_api_rate_limit", {
    p_bucket_key: `${scope}:${digest}`,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error("[rate-limit]", { scope, message: error.message });
    return false;
  }
  return data === true;
}

