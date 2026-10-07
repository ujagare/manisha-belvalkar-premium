import { apiError, apiSuccess, readJsonObject } from "@/lib/api";
import { consumeRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSameOriginRequest } from "@/lib/security";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return apiError("UNAUTHORIZED", "Please sign in to request a refund.", 401);
  if (!(await consumeRateLimit(request, "refund-request", 3, 86400, user.id))) return apiError("RATE_LIMITED", "Too many refund requests.", 429);
  try {
    const body = await readJsonObject(request);
    const orderId = typeof body.orderId === "string" ? body.orderId : "";
    const reason = typeof body.reason === "string" ? body.reason.trim().slice(0, 1500) : "";
    const admin = createAdminClient();
    const { data: order } = await admin.from("orders").select("id,user_id,amount_subunits,payment_status").eq("id", orderId).eq("user_id", user.id).maybeSingle();
    if (!order) return apiError("NOT_FOUND", "Order not found.", 404);
    if (!order.amount_subunits || !["paid", "partially_refunded"].includes(order.payment_status)) return apiError("CONFLICT", "This order is not eligible for an online refund request.", 409);
    const { data: payment } = await admin.from("payments").select("id").eq("order_id", order.id).in("status", ["captured", "partially_refunded"]).maybeSingle();
    const { data, error } = await admin.from("refunds").insert({
      order_id: order.id, payment_id: payment?.id ?? null, amount_subunits: order.amount_subunits,
      reason: reason || null, status: "requested", requested_by: user.id,
    }).select("id,status").single();
    if (error) throw error;
    return apiSuccess({ refund: data }, 201);
  } catch (error) {
    console.error("[refunds:request]", error);
    return apiError("INTERNAL_ERROR", "Could not create refund request.", 500);
  }
}
