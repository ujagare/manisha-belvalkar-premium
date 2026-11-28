import { apiError, apiSuccess, readJsonObject, requestId } from "@/lib/api";
import { isSameOriginRequest } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_STATUSES = ["pending", "approved", "waitlisted", "declined"] as const;
const ALLOWED_ROLES = ["owner", "admin", "booking_manager", "support"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const traceId = requestId(request);
  try {
    if (!isSameOriginRequest(request)) {
      return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
    }
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return apiError("UNAUTHORIZED", "Please sign in.", 401);

    const admin = createAdminClient();
    const { data: staff } = await admin
      .from("staff_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!staff || !ALLOWED_ROLES.includes(staff.role)) {
      return apiError("FORBIDDEN", "Staff access required.", 403);
    }

    const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assurance?.currentLevel !== "aal2") {
      return apiError("FORBIDDEN", "Two-factor authentication is required.", 403);
    }

    const body = await readJsonObject(request, 2048);
    const status = typeof body.status === "string" ? body.status.trim() : "";
    if (!ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
      return apiError("BAD_REQUEST", "Invalid application status.", 422);
    }

    const { data, error } = await admin
      .from("community_applications")
      .update({ status })
      .eq("id", id)
      .select("id, status")
      .maybeSingle();
    if (error) throw error;
    if (!data) return apiError("NOT_FOUND", "Application not found.", 404);

    await admin.from("audit_logs").insert({
      actor_user_id: user.id,
      action: "community_application.updated",
      entity_type: "community_application",
      entity_id: id,
      metadata: { status },
    });

    return apiSuccess({ application: data });
  } catch (error) {
    console.error("[admin:community]", { traceId, error });
    return apiError("INTERNAL_ERROR", "Could not update community application.", 500, { traceId });
  }
}
