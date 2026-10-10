import { apiError, apiSuccess, readJsonObject } from "@/lib/api";
import { isSameOriginRequest } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return apiError("UNAUTHORIZED", "Please sign in.", 401);
  const admin = createAdminClient();
  const { data: staff } = await admin.from("staff_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (!staff || !["owner", "admin"].includes(staff.role)) return apiError("FORBIDDEN", "Admin access required.", 403);
  const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance?.currentLevel !== "aal2") return apiError("FORBIDDEN", "Two-factor authentication is required.", 403);
  const body = await readJsonObject(request);
  const price = typeof body.price === "number" ? body.price : 0;
  if (!Number.isInteger(price) || price < 1 || price > 1_000_000) return apiError("BAD_REQUEST", "Enter a valid whole-rupee price.", 422);
  const { error } = await admin.from("offerings").upsert({ type: "healing", slug: "distance-healing", title: "Distance Healing", description: "Payment-gated private Distance Healing workflow", amount_subunits: price * 100, currency: "INR", payment_mode: "full", formats: ["online"], is_active: true }, { onConflict: "type,slug" });
  if (error) return apiError("INTERNAL_ERROR", "Price could not be saved.", 500);
  return apiSuccess({ price });
}
