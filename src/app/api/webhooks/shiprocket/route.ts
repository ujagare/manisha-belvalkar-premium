import { createHash } from "node:crypto";
import { apiError, apiSuccess } from "@/lib/api";
import { serverEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { notifyCustomerShipmentMilestone } from "@/lib/shiprocket";
import {
  mapShiprocketStatus,
  normalizeTrackingScans,
  shiprocketTrackingUrl,
  verifyShiprocketWebhookToken,
} from "@/lib/shiprocket-utils";

export const runtime = "nodejs";

/**
 * POST /api/webhooks/shiprocket
 * Real-time courier scan & delivery webhook endpoint configured in:
 * Shiprocket Panel -> Settings -> API -> Webhooks
 *
 * Security: Verifies `x-api-key` header against `SHIPROCKET_WEBHOOK_TOKEN`
 * using constant-time comparison.
 */
export async function POST(request: Request) {
  const expectedToken = serverEnv.shiprocketWebhookToken();
  const incomingToken = request.headers.get("x-api-key");

  if (!expectedToken || !verifyShiprocketWebhookToken(incomingToken, expectedToken)) {
    return apiError("FORBIDDEN", "Invalid Shiprocket webhook token.", 403);
  }

  const raw = await request.text();
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return apiError("BAD_REQUEST", "Invalid JSON payload.", 400);
  }

  const awb = typeof payload.awb === "string" ? payload.awb.trim() : null;
  const srOrderId = Number(payload.sr_order_id ?? payload.order_id);
  const srShipmentId = Number(payload.shipment_id);
  const channelOrderId = typeof payload.order_id === "string" ? payload.order_id.trim() : null;
  const statusId = Number.isFinite(Number(payload.current_status_id)) ? Number(payload.current_status_id) : null;
  const rawStatus =
    typeof payload.current_status === "string" && payload.current_status.trim()
      ? payload.current_status.trim()
      : typeof payload.shipment_status === "string"
        ? payload.shipment_status.trim()
        : typeof payload.status === "string"
          ? payload.status.trim()
          : null;
  const courierName =
    typeof payload.courier_name === "string" && payload.courier_name.trim()
      ? payload.courier_name.trim()
      : null;

  const eventKey = createHash("sha256").update(raw).digest("hex");
  const admin = createAdminClient();

  const { error: eventErr } = await admin.from("shipment_events").insert({
    provider: "shiprocket",
    event_key: eventKey,
    awb_code: awb,
    shiprocket_order_id: Number.isFinite(srOrderId) && srOrderId > 0 ? srOrderId : null,
    status_code: statusId,
    status_label: rawStatus,
    payload: payload as never,
  });

  if (eventErr?.code === "23505") {
    return apiSuccess({ received: true, duplicate: true });
  }
  if (eventErr) {
    console.error("[shiprocket:webhook:insert]", eventErr);
    return apiError("INTERNAL_ERROR", "Could not record webhook event.", 500);
  }

  try {
    // Locate shipment row by AWB, Shiprocket shipment_id, Shiprocket order_id, or channel order ref
    let shipment = null;

    if (awb) {
      const { data } = await admin.from("shipments").select("*").eq("awb_code", awb).maybeSingle();
      shipment = data;
    }
    if (!shipment && Number.isFinite(srShipmentId) && srShipmentId > 0) {
      const { data } = await admin.from("shipments").select("*").eq("shiprocket_shipment_id", srShipmentId).maybeSingle();
      shipment = data;
    }
    if (!shipment && Number.isFinite(srOrderId) && srOrderId > 0) {
      const { data } = await admin.from("shipments").select("*").eq("shiprocket_order_id", srOrderId).maybeSingle();
      shipment = data;
    }
    if (!shipment && channelOrderId) {
      const prefix = channelOrderId.replace(/^MB-/i, "").trim().toLowerCase();
      if (/^[0-9a-f]{8}$/.test(prefix)) {
        const { data: order } = await admin
          .from("orders")
          .select("id")
          .gte("id", `${prefix}-0000-0000-0000-000000000000`)
          .lte("id", `${prefix}-ffff-ffff-ffff-ffffffffffff`)
          .limit(1)
          .maybeSingle();
        if (order) {
          const { data } = await admin.from("shipments").select("*").eq("order_id", order.id).maybeSingle();
          shipment = data;
        }
      }
    }

    if (!shipment) {
      await admin
        .from("shipment_events")
        .update({ processed_at: new Date().toISOString(), error: "No matching shipment found" })
        .eq("provider", "shiprocket")
        .eq("event_key", eventKey);
      // Always return 200 OK to Shiprocket so unrelated channel webhooks don't cause retry storms.
      return apiSuccess({ received: true, matched: false });
    }

    const mapped = mapShiprocketStatus(statusId, rawStatus);
    const incomingScans = normalizeTrackingScans(payload.scans ?? payload.history ?? []);
    const existingScans = normalizeTrackingScans(shipment.tracking_events);
    const mergedScans = incomingScans.length > 0 ? incomingScans : existingScans;

    const now = new Date().toISOString();
    const rawEdd = typeof payload.etd === "string" ? payload.etd : typeof payload.edd === "string" ? payload.edd : null;
    const etdIso = rawEdd && Number.isFinite(Date.parse(rawEdd)) ? new Date(rawEdd).toISOString() : shipment.etd;

    const shippedAt =
      ["shipped", "in_transit", "out_for_delivery", "delivered"].includes(mapped.shipmentStatus)
        ? (shipment.shipped_at ?? now)
        : shipment.shipped_at;
    const deliveredAt =
      mapped.shipmentStatus === "delivered"
        ? (shipment.delivered_at ?? now)
        : shipment.delivered_at;
    const cancelledAt =
      mapped.shipmentStatus === "cancelled"
        ? (shipment.cancelled_at ?? now)
        : shipment.cancelled_at;
    const rtoReason =
      typeof payload.rto_reason === "string" && payload.rto_reason.trim()
        ? payload.rto_reason.trim().slice(0, 300)
        : shipment.rto_reason;
    const lastLocation =
      mergedScans[0]?.location ||
      (typeof payload.current_location === "string" ? payload.current_location.trim() : null) ||
      shipment.last_location;

    const activeAwb = awb || shipment.awb_code || shipment.tracking_number;
    const trackUrl = shipment.tracking_url || shiprocketTrackingUrl(activeAwb);

    await admin
      .from("shipments")
      .update({
        awb_code: activeAwb,
        tracking_number: activeAwb,
        tracking_url: trackUrl,
        carrier: courierName ?? shipment.carrier,
        status: mapped.shipmentStatus,
        current_status: rawStatus ?? mapped.label,
        current_status_id: statusId ?? shipment.current_status_id,
        etd: etdIso,
        shipped_at: shippedAt,
        delivered_at: deliveredAt,
        cancelled_at: cancelledAt,
        rto_reason: rtoReason,
        last_location: lastLocation,
        tracking_events: mergedScans as unknown as never,
        last_synced_at: now,
        updated_at: now,
      })
      .eq("id", shipment.id);

    await admin
      .from("orders")
      .update({
        fulfillment_status: mapped.fulfillmentStatus,
        ...(mapped.shipmentStatus === "delivered" ? { status: "completed" } : {}),
        updated_at: now,
      })
      .eq("id", shipment.order_id);

    await notifyCustomerShipmentMilestone(admin, shipment.order_id, shipment.status, mapped.shipmentStatus, {
      awbCode: activeAwb,
      carrier: courierName ?? shipment.carrier,
      etd: etdIso,
      trackingUrl: trackUrl,
    });

    await admin
      .from("shipment_events")
      .update({ processed_at: now, error: null })
      .eq("provider", "shiprocket")
      .eq("event_key", eventKey);

    return apiSuccess({ received: true, matched: true, status: mapped.shipmentStatus });
  } catch (error) {
    console.error("[shiprocket:webhook:process]", error);
    await admin
      .from("shipment_events")
      .update({ error: error instanceof Error ? error.message.slice(0, 300) : "Processing failed" })
      .eq("provider", "shiprocket")
      .eq("event_key", eventKey);
    return apiError("INTERNAL_ERROR", "Webhook processing failed.", 500);
  }
}
