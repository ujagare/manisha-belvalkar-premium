import { apiError, apiSuccess } from "@/lib/api";
import { consumeRateLimit } from "@/lib/rate-limit";
import { fetchRazorpayOrderPayments } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSameOriginRequest } from "@/lib/security";
import { activateOrderFulfilment } from "@/lib/fulfillment";
import { DISTANCE_HEALING_SLUG } from "@/lib/distance-healing";
import { assertDatabaseSuccess, successfulPaymentStatus } from "@/lib/payment-safety";

export const runtime = "nodejs";

/**
 * Stuck-payment reconciliation endpoint.
 * If a customer's mobile network dropped after Razorpay debited their bank/UPI
 * before browser verification ran, this checks Razorpay directly and activates
 * fulfillment idempotently when a matching captured payment exists.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ orderId: string }> },
) {
  try {
    if (!isSameOriginRequest(request)) return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
    const { orderId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError("UNAUTHORIZED", "Please sign in to verify your order.", 401);

    if (!(await consumeRateLimit(request, "order-reconcile", 10, 600, user.id))) {
      return apiError("RATE_LIMITED", "Too many verification checks. Please wait a minute.", 429);
    }

    const admin = createAdminClient();
    const { data: order } = await admin
      .from("orders")
      .select("id,user_id,gateway_order_id,amount_subunits,amount,currency,item_type,item_slug,item_title,payment_status,guest_email,guest_name")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!order) return apiError("NOT_FOUND", "Order not found.", 404);

    if (order.payment_status === "paid") {
      return apiSuccess({
        orderId: order.id,
        paymentStatus: "paid",
        healingUrl: order.item_type === "healing" && order.item_slug === DISTANCE_HEALING_SLUG
          ? `/distance-healing/${order.id}`
          : null,
      });
    }

    if (!order.gateway_order_id) {
      return apiSuccess({ orderId: order.id, paymentStatus: order.payment_status });
    }

    const remotePayments = await fetchRazorpayOrderPayments(order.gateway_order_id);
    const captured = remotePayments.find(
      (p) =>
        successfulPaymentStatus(p.status) &&
        p.order_id === order.gateway_order_id &&
        p.amount === order.amount_subunits &&
        p.currency === order.currency,
    );

    if (!captured) {
      const authorized = remotePayments.find((p) => p.status === "authorized");
      return apiSuccess({
        orderId: order.id,
        paymentStatus: authorized ? "authorized" : order.payment_status,
      });
    }

    const nowIso = new Date().toISOString();
    const payUpdate = await admin
      .from("payments")
      .update({
        provider_payment_id: captured.id,
        status: "captured",
        method: captured.method ?? null,
        captured_at: nowIso,
        updated_at: nowIso,
      })
      .eq("provider_order_id", order.gateway_order_id);
    assertDatabaseSuccess(payUpdate, "Reconcile payment update");

    const orderUpdate = await admin
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
        updated_at: nowIso,
      })
      .eq("id", order.id);
    assertDatabaseSuccess(orderUpdate, "Reconcile order update");

    await activateOrderFulfilment(admin, {
      ...order,
      guest_email: order.guest_email ?? user.email ?? null,
      guest_name: order.guest_name ?? (user.user_metadata?.name as string | undefined) ?? null,
    });

    return apiSuccess({
      orderId: order.id,
      paymentStatus: "paid",
      healingUrl: order.item_type === "healing" && order.item_slug === DISTANCE_HEALING_SLUG
        ? `/distance-healing/${order.id}`
        : null,
    });
  } catch (error) {
    console.error("[orders:reconcile]", error);
    return apiError("INTERNAL_ERROR", "Could not verify payment status right now.", 500);
  }
}
