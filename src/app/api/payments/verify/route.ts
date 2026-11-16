import { apiError, apiSuccess, readJsonObject, requestId } from "@/lib/api";
import { consumeRateLimit } from "@/lib/rate-limit";
import { fetchRazorpayPayment, verifyCheckoutSignature } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSameOriginRequest } from "@/lib/security";
import { DISTANCE_HEALING_SLUG } from "@/lib/distance-healing";
import { activateOrderFulfilment } from "@/lib/fulfillment";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const traceId = requestId(request);
  try {
    if (!isSameOriginRequest(request)) return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError("UNAUTHORIZED", "Please sign in to continue.", 401);
    if (!(await consumeRateLimit(request, "payment-verify", 12, 600, user.id))) {
      return apiError("RATE_LIMITED", "Too many verification attempts.", 429);
    }
    const body = await readJsonObject(request);
    const internalOrderId = typeof body.internalOrderId === "string" ? body.internalOrderId : "";
    const razorpayOrderId = typeof body.razorpayOrderId === "string" ? body.razorpayOrderId : "";
    const paymentId = typeof body.paymentId === "string" ? body.paymentId : "";
    const signature = typeof body.signature === "string" ? body.signature : "";
    if (![internalOrderId, razorpayOrderId, paymentId, signature].every((v) => v.length >= 8)) {
      return apiError("BAD_REQUEST", "Invalid payment response.", 422);
    }

    const admin = createAdminClient();
    const { data: order } = await admin.from("orders").select("id,user_id,gateway_order_id,amount_subunits,amount,currency,item_type,item_slug,item_title,guest_email,guest_name").eq("id", internalOrderId).eq("user_id", user.id).maybeSingle();
    if (!order || order.gateway_order_id !== razorpayOrderId) return apiError("NOT_FOUND", "Order not found.", 404);
    if (!verifyCheckoutSignature(order.gateway_order_id, paymentId, signature)) {
      return apiError("BAD_REQUEST", "Payment verification failed.", 400);
    }

    const remote = await fetchRazorpayPayment(paymentId);
    if (remote.order_id !== order.gateway_order_id || remote.amount !== order.amount_subunits || remote.currency !== order.currency) {
      return apiError("BAD_REQUEST", "Payment details do not match the order.", 400);
    }
    const paid = remote.status === "captured";
    await admin.from("payments").update({
      provider_payment_id: remote.id,
      status: paid ? "captured" : remote.status,
      method: remote.method ?? null,
      captured_at: paid ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }).eq("provider_order_id", order.gateway_order_id);
    await admin.from("orders").update({
      payment_status: paid ? "paid" : "authorized",
      status: paid ? "confirmed" : "pending",
      updated_at: new Date().toISOString(),
    }).eq("id", order.id);

    if (paid) {
      await activateOrderFulfilment(admin, {
        ...order,
        guest_email: order.guest_email ?? user.email ?? null,
        guest_name: order.guest_name ?? user.user_metadata?.name ?? null,
      });
    }

    const isDistanceHealing = paid && order.item_type === "healing" && order.item_slug === DISTANCE_HEALING_SLUG;

    return apiSuccess({
      orderId: order.id,
      paymentStatus: paid ? "paid" : "authorized",
      learningUrl: paid && order.item_type === "course" ? `/learn/${order.item_slug}` : null,
      healingUrl: isDistanceHealing ? `/distance-healing/${order.id}` : null,
    });
  } catch (error) {
    console.error("[payments:verify]", { traceId, error });
    return apiError("INTERNAL_ERROR", "Could not verify payment.", 500, { traceId });
  }
}
