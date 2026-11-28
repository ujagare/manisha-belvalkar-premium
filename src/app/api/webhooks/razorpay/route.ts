import { apiError, apiSuccess } from "@/lib/api";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  activateOrderFulfilment,
  releasePendingSessionBooking,
  revokeOrderFulfilment,
  releaseReservedInventory,
} from "@/lib/fulfillment";
import {
  assertDatabaseSuccess,
  evaluateWebhookPaymentTransition,
  resolveWebhookEventId,
} from "@/lib/payment-safety";
import { paymentDisputeAdminEmail, sendEmail } from "@/lib/resend";
import { brand } from "@/lib/data";
import { formatCurrencySubunits, normalizeCurrency } from "@/lib/currency";

export const runtime = "nodejs";

type RazorpayEntity = {
  id?: string;
  order_id?: string;
  payment_id?: string;
  status?: string;
  amount?: number;
  currency?: string;
  method?: string;
  reason_code?: string;
};

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  if (!signature || !verifyWebhookSignature(raw, signature)) {
    return apiError("FORBIDDEN", "Invalid webhook signature.", 403);
  }

  let payload: Record<string, unknown>;
  try { payload = JSON.parse(raw) as Record<string, unknown>; }
  catch { return apiError("BAD_REQUEST", "Invalid webhook payload.", 400); }

  const eventType = typeof payload.event === "string" && payload.event.trim() ? payload.event.trim() : "";
  const eventId = resolveWebhookEventId(payload, request.headers.get("x-razorpay-event-id"));
  if (!eventType || !eventId) {
    return apiError("BAD_REQUEST", "Missing webhook event identifier.", 400);
  }
  const admin = createAdminClient();
  const { error: eventError } = await admin.from("payment_events").insert({
    provider: "razorpay", event_id: eventId, event_type: eventType, payload,
  });
  if (eventError?.code === "23505") {
    const existingEvent = await admin.from("payment_events").select("processed_at").eq("provider", "razorpay").eq("event_id", eventId).maybeSingle();
    assertDatabaseSuccess(existingEvent, "Webhook event retry lookup");
    if (existingEvent.data?.processed_at) return apiSuccess({ received: true, duplicate: true });
  }
  if (eventError && eventError.code !== "23505") {
    console.error("[razorpay:webhook:event]", eventError);
    return apiError("INTERNAL_ERROR", "Webhook could not be recorded.", 500);
  }

  try {
    const root = payload.payload as {
      payment?: { entity?: RazorpayEntity };
      refund?: { entity?: RazorpayEntity };
      dispute?: { entity?: RazorpayEntity };
    } | undefined;
    const payment = root?.payment?.entity;
    if (payment?.order_id) {
      const status = eventType === "payment.captured" ? "captured" : eventType === "payment.failed" ? "failed" : payment.status;
      if (status && ["authorized", "captured", "failed"].includes(status)) {
        const paymentRecord = await admin.from("payments").select("status,amount_subunits,currency").eq("provider_order_id", payment.order_id).maybeSingle();
        assertDatabaseSuccess(paymentRecord, "Webhook payment lookup");
        const transition = evaluateWebhookPaymentTransition({
          existing: paymentRecord.data,
          incomingStatus: status,
          incomingAmount: payment.amount,
          incomingCurrency: payment.currency,
        });
        if (transition === "missing" || transition === "mismatch") {
          throw new Error("Webhook payment amount or currency does not match the order.");
        }
        if (transition === "apply") {
          const paymentUpdate = await admin.from("payments").update({
            provider_payment_id: payment.id ?? null,
            status,
            method: payment.method ?? null,
            captured_at: status === "captured" ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          }).eq("provider_order_id", payment.order_id);
          assertDatabaseSuccess(paymentUpdate, "Webhook payment update");
          const orderUpdate = await admin.from("orders").update({
            payment_status: status === "captured" ? "paid" : status,
            status: status === "captured" ? "confirmed" : status === "failed" ? "cancelled" : "pending",
            updated_at: new Date().toISOString(),
          }).eq("gateway_order_id", payment.order_id);
          assertDatabaseSuccess(orderUpdate, "Webhook order update");

          const { data: order } = await admin
            .from("orders")
            .select("id,user_id,item_type,item_slug,item_title,amount,amount_subunits,currency,guest_email,guest_name")
            .eq("gateway_order_id", payment.order_id)
            .maybeSingle();

          if (order) {
            if (status === "captured") {
              await activateOrderFulfilment(admin, order);
            } else if (status === "failed") {
              await releaseReservedInventory(admin, order.id);
              await releasePendingSessionBooking(admin, order.id);
            }
          }
        }
      }
    }
    if (eventType === "refund.processed") {
      const refund = root?.refund?.entity;
      const paymentId = refund?.payment_id;
      if (paymentId) {
        await admin.from("payments").update({ status: "refunded", updated_at: new Date().toISOString() }).eq("provider_payment_id", paymentId);
        const { data: pay } = await admin.from("payments").select("order_id").eq("provider_payment_id", paymentId).maybeSingle();
        if (pay?.order_id) {
          await revokeOrderFulfilment(admin, pay.order_id, refund?.id);
        }
      }
    }
    if (eventType === "payment.dispute.created") {
      const dispute = root?.dispute?.entity;
      if (dispute?.id && dispute.payment_id) {
        const { data: pay } = await admin
          .from("payments")
          .select("order_id,amount_subunits,currency")
          .eq("provider_payment_id", dispute.payment_id)
          .maybeSingle();
        const alert = paymentDisputeAdminEmail({
          disputeId: dispute.id,
          paymentId: dispute.payment_id,
          orderId: pay?.order_id ?? "unknown",
          amountLabel: formatCurrencySubunits(
            dispute.amount ?? pay?.amount_subunits ?? 0,
            normalizeCurrency(dispute.currency ?? pay?.currency),
          ),
          reason: dispute.reason_code ?? "unspecified",
        });
        await sendEmail({ to: brand.email, subject: alert.subject, html: alert.html });
      }
    }
    const processed = await admin.from("payment_events").update({ processed_at: new Date().toISOString(), error: null }).eq("provider", "razorpay").eq("event_id", eventId);
    assertDatabaseSuccess(processed, "Webhook completion update");
    return apiSuccess({ received: true });
  } catch (error) {
    console.error("[razorpay:webhook:process]", error);
    await admin.from("payment_events").update({ error: "Processing failed" }).eq("provider", "razorpay").eq("event_id", eventId);
    return apiError("INTERNAL_ERROR", "Webhook processing failed.", 500);
  }
}
