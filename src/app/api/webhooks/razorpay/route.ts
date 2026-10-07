import { createHash } from "node:crypto";
import { apiError, apiSuccess } from "@/lib/api";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type RazorpayEntity = { id?: string; order_id?: string; payment_id?: string; status?: string; amount?: number; currency?: string; method?: string };

async function activateFulfilment(admin: ReturnType<typeof createAdminClient>, providerOrderId: string) {
  const { data: order } = await admin.from("orders").select("id,user_id,item_type,item_slug").eq("gateway_order_id", providerOrderId).maybeSingle();
  if (!order) return;
  if (order.item_type === "service" || order.item_type === "healing") {
    await admin.from("bookings").upsert({
      user_id: order.user_id, order_id: order.id, offering_type: order.item_type,
      offering_slug: order.item_slug, format: "online", timezone: "Asia/Kolkata", status: "requested",
    }, { onConflict: "order_id" });
  }
  if (order.item_type === "course") {
    await admin.from("course_enrollments").upsert({
      user_id: order.user_id, order_id: order.id, course_slug: order.item_slug,
      status: "active", enrolled_at: new Date().toISOString(),
    }, { onConflict: "order_id" });
  }
}

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  if (!signature || !verifyWebhookSignature(raw, signature)) {
    return apiError("FORBIDDEN", "Invalid webhook signature.", 403);
  }

  let payload: Record<string, unknown>;
  try { payload = JSON.parse(raw) as Record<string, unknown>; }
  catch { return apiError("BAD_REQUEST", "Invalid webhook payload.", 400); }

  const eventType = typeof payload.event === "string" ? payload.event : "unknown";
  const eventId = request.headers.get("x-razorpay-event-id") ?? createHash("sha256").update(raw).digest("hex");
  const admin = createAdminClient();
  const { error: eventError } = await admin.from("payment_events").insert({
    provider: "razorpay", event_id: eventId, event_type: eventType, payload,
  });
  if (eventError?.code === "23505") return apiSuccess({ received: true, duplicate: true });
  if (eventError) {
    console.error("[razorpay:webhook:event]", eventError);
    return apiError("INTERNAL_ERROR", "Webhook could not be recorded.", 500);
  }

  try {
    const root = payload.payload as { payment?: { entity?: RazorpayEntity }; refund?: { entity?: RazorpayEntity } } | undefined;
    const payment = root?.payment?.entity;
    if (payment?.order_id) {
      const status = eventType === "payment.captured" ? "captured" : eventType === "payment.failed" ? "failed" : payment.status;
      if (status && ["authorized", "captured", "failed"].includes(status)) {
        await admin.from("payments").update({
          provider_payment_id: payment.id ?? null,
          status,
          method: payment.method ?? null,
          captured_at: status === "captured" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        }).eq("provider_order_id", payment.order_id);
        await admin.from("orders").update({
          payment_status: status === "captured" ? "paid" : status,
          status: status === "captured" ? "confirmed" : "pending",
          updated_at: new Date().toISOString(),
        }).eq("gateway_order_id", payment.order_id);
        if (status === "captured") await activateFulfilment(admin, payment.order_id);
      }
    }
    if (eventType === "refund.processed") {
      const refund = root?.refund?.entity;
      const paymentId = refund?.payment_id;
      if (paymentId) await admin.from("payments").update({ status: "refunded", updated_at: new Date().toISOString() }).eq("provider_payment_id", paymentId);
    }
    await admin.from("payment_events").update({ processed_at: new Date().toISOString() }).eq("provider", "razorpay").eq("event_id", eventId);
    return apiSuccess({ received: true });
  } catch (error) {
    console.error("[razorpay:webhook:process]", error);
    await admin.from("payment_events").update({ error: "Processing failed" }).eq("provider", "razorpay").eq("event_id", eventId);
    return apiError("INTERNAL_ERROR", "Webhook processing failed.", 500);
  }
}
