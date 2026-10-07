import { apiError, apiSuccess } from "@/lib/api";
import { isServerConfigured } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isServerConfigured()) return apiError("INTERNAL_ERROR", "Service is not configured.", 503);
  try {
    const admin = createAdminClient();
    const { error } = await admin.from("products").select("id", { count: "exact", head: true });
    if (error) throw error;
    return apiSuccess({ status: "ready", database: "reachable" });
  } catch (error) {
    console.error("[readyz]", error);
    return apiError("INTERNAL_ERROR", "Service is not ready.", 503);
  }
}
