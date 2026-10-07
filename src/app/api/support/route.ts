import { apiError, apiSuccess, readJsonObject } from "@/lib/api";
import { consumeRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSameOriginRequest } from "@/lib/security";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return apiError("UNAUTHORIZED", "Please sign in to contact support.", 401);
  if (!(await consumeRateLimit(request, "support", 5, 3600, user.id))) return apiError("RATE_LIMITED", "Too many support requests.", 429);
  try {
    const body = await readJsonObject(request);
    const subject = typeof body.subject === "string" ? body.subject.trim().slice(0, 160) : "";
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 4000) : "";
    const orderId = typeof body.orderId === "string" ? body.orderId : null;
    if (!subject || !message) return apiError("BAD_REQUEST", "Subject and message are required.", 422);
    const admin = createAdminClient();
    if (orderId) {
      const { data: order } = await admin.from("orders").select("id").eq("id", orderId).eq("user_id", user.id).maybeSingle();
      if (!order) return apiError("NOT_FOUND", "Order not found.", 404);
    }
    const { data, error } = await admin.from("support_tickets").insert({ user_id: user.id, order_id: orderId, subject, message }).select("id,status").single();
    if (error) throw error;
    return apiSuccess({ ticket: data }, 201);
  } catch (error) {
    console.error("[support:create]", error);
    return apiError("INTERNAL_ERROR", "Could not create support request.", 500);
  }
}
