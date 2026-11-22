import { apiError, apiSuccess, readJsonObject, requestId } from "@/lib/api";
import { isShiprocketConfigured, isServerConfigured } from "@/lib/env";
import { consumeRateLimit } from "@/lib/rate-limit";
import { isSameOriginRequest } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  fetchShiprocketTrackingByAwb,
  syncShipmentLiveTracking,
} from "@/lib/shiprocket";
import {
  mapShiprocketStatus,
  normalizeTrackingScans,
  shiprocketTrackingUrl,
  type TrackingScanEvent,
} from "@/lib/shiprocket-utils";

export const runtime = "nodejs";

interface TrackingPayload {
  orderRef: string;
  itemTitle: string;
  orderStatus: string;
  orderCreatedAt: string | null;
  destinationCity: string | null;
  destinationState: string | null;
  destinationPincode: string | null;
  shipment: {
    status: string;
    statusLabel: string;
    currentStatus: string | null;
    carrier: string | null;
    awbCode: string | null;
    trackingUrl: string | null;
    etd: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
    pickupScheduledDate: string | null;
    lastLocation: string | null;
    lastSyncedAt: string | null;
    rtoReason: string | null;
    scans: TrackingScanEvent[];
  };
}

function isStale(iso: string | null | undefined, maxMinutes = 10): boolean {
  if (!iso) return true;
  const ms = Date.parse(iso);
  return !Number.isFinite(ms) || Date.now() - ms > maxMinutes * 60 * 1000;
}

/**
 * POST /api/shipping/track
 * Track by AWB number OR by Order Reference (with email match or signed-in owner check).
 */
export async function POST(request: Request) {
  const traceId = requestId(request);
  try {
    if (!isSameOriginRequest(request)) {
      return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
    }
    if (!(await consumeRateLimit(request, "shipping-track", 20, 60))) {
      return apiError("RATE_LIMITED", "Too many tracking requests. Please wait a minute.", 429);
    }

    const body = await readJsonObject(request);
    const awb = typeof body.awb === "string" ? body.awb.trim().slice(0, 60) : "";
    const rawOrderRef = typeof body.orderRef === "string" ? body.orderRef.trim().slice(0, 64) : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 320) : "";
    const forceSync = body.sync === true;

    if (!awb && !rawOrderRef) {
      return apiError("BAD_REQUEST", "Enter an AWB / tracking number or an Order Reference.", 422);
    }

    const admin = isServerConfigured() ? createAdminClient() : null;

    // ------------------------------------------------------------------
    // Mode A: Track directly by AWB number
    // ------------------------------------------------------------------
    if (awb) {
      if (!/^[A-Za-z0-9_-]{5,50}$/.test(awb)) {
        return apiError("BAD_REQUEST", "Enter a valid AWB / tracking number.", 422);
      }

      if (admin) {
        const { data: shipmentRow } = await admin
          .from("shipments")
          .select("*")
          .or(`awb_code.eq.${awb},tracking_number.eq.${awb}`)
          .maybeSingle();

        if (shipmentRow) {
          let activeShipment = shipmentRow;
          if (isShiprocketConfigured() && (forceSync || isStale(shipmentRow.last_synced_at))) {
            activeShipment = await syncShipmentLiveTracking(admin, shipmentRow.id).catch(() => shipmentRow);
          }

          const [{ data: order }, { data: addr }] = await Promise.all([
            admin.from("orders").select("id,item_title,status,created_at").eq("id", activeShipment.order_id).maybeSingle(),
            activeShipment.address_id
              ? admin.from("addresses").select("city,state,postal_code").eq("id", activeShipment.address_id).maybeSingle()
              : Promise.resolve({ data: null }),
          ]);

          const mapped = mapShiprocketStatus(activeShipment.current_status_id, activeShipment.current_status ?? activeShipment.status);
          const payload: TrackingPayload = {
            orderRef: order ? order.id.slice(0, 8).toUpperCase() : "PARCEL",
            itemTitle: order?.item_title ?? "Physical Order",
            orderStatus: order?.status ?? "confirmed",
            orderCreatedAt: order?.created_at ?? activeShipment.created_at,
            destinationCity: addr?.city ?? null,
            destinationState: addr?.state ?? null,
            destinationPincode: addr?.postal_code ?? null,
            shipment: {
              status: activeShipment.status,
              statusLabel: mapped.label,
              currentStatus: activeShipment.current_status,
              carrier: activeShipment.carrier,
              awbCode: activeShipment.awb_code ?? activeShipment.tracking_number,
              trackingUrl: activeShipment.tracking_url ?? shiprocketTrackingUrl(activeShipment.awb_code ?? activeShipment.tracking_number),
              etd: activeShipment.etd,
              shippedAt: activeShipment.shipped_at,
              deliveredAt: activeShipment.delivered_at,
              pickupScheduledDate: activeShipment.pickup_scheduled_date,
              lastLocation: activeShipment.last_location,
              lastSyncedAt: activeShipment.last_synced_at,
              rtoReason: activeShipment.rto_reason,
              scans: normalizeTrackingScans(activeShipment.tracking_events),
            },
          };

          return apiSuccess({ tracking: payload });
        }
      }

      // Fallback: live lookup directly against Shiprocket API for AWBs created directly in Shiprocket panel
      if (isShiprocketConfigured()) {
        const live = await fetchShiprocketTrackingByAwb(awb);
        if (live) {
          const mapped = mapShiprocketStatus(live.currentStatusId, live.currentStatus);
          const payload: TrackingPayload = {
            orderRef: awb,
            itemTitle: "Shiprocket Shipment",
            orderStatus: mapped.shipmentStatus === "delivered" ? "completed" : "confirmed",
            orderCreatedAt: null,
            destinationCity: null,
            destinationState: null,
            destinationPincode: null,
            shipment: {
              status: mapped.shipmentStatus,
              statusLabel: mapped.label,
              currentStatus: live.currentStatus,
              carrier: live.courierName,
              awbCode: live.awbCode,
              trackingUrl: live.trackUrl,
              etd: live.etd,
              shippedAt: null,
              deliveredAt: live.deliveredAt,
              pickupScheduledDate: null,
              lastLocation: live.lastLocation,
              lastSyncedAt: new Date().toISOString(),
              rtoReason: null,
              scans: live.scans,
            },
          };
          return apiSuccess({ tracking: payload });
        }
      }

      return apiError(
        "NOT_FOUND",
        "No shipment found for that AWB number. Please verify the number or try tracking with your Order Reference + Email.",
        404,
      );
    }

    // ------------------------------------------------------------------
    // Mode B: Track by Order Reference (requires signed-in owner OR matching email)
    // ------------------------------------------------------------------
    if (!admin) {
      return apiError("SERVICE_UNAVAILABLE", "Order lookup is not configured yet.", 503);
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const cleanedRef = rawOrderRef.replace(/^#/, "").replace(/^MB-/i, "").trim().toLowerCase();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanedRef);
    const isShortRef = /^[0-9a-f]{8}$/i.test(cleanedRef);

    if (!isUuid && !isShortRef) {
      return apiError("BAD_REQUEST", "Enter a valid 8-character Order Reference (e.g. A1B2C3D4) or full Order ID.", 422);
    }

    let order: {
      id: string;
      user_id: string | null;
      item_type: string;
      item_title: string;
      status: string;
      payment_status: string;
      fulfillment_status: string;
      address_id: string | null;
      guest_email: string | null;
      created_at: string;
    } | null = null;

    if (isUuid) {
      const { data } = await admin
        .from("orders")
        .select("id,user_id,item_type,item_title,status,payment_status,fulfillment_status,address_id,guest_email,created_at")
        .eq("id", cleanedRef)
        .maybeSingle();
      order = data;
    } else {
      // Search recent orders matching the 8-hex-char prefix (UUID range query)
      const lowerBound = `${cleanedRef}-0000-0000-0000-000000000000`;
      const upperBound = `${cleanedRef}-ffff-ffff-ffff-ffffffffffff`;
      const { data } = await admin
        .from("orders")
        .select("id,user_id,item_type,item_title,status,payment_status,fulfillment_status,address_id,guest_email,created_at")
        .gte("id", lowerBound)
        .lte("id", upperBound)
        .limit(1)
        .maybeSingle();
      order = data;
    }

    if (!order) {
      return apiError("NOT_FOUND", "No order found matching that reference.", 404);
    }

    // Ownership verification: either signed-in owner, staff, or email matches order/profile email
    let authorized = Boolean(user && order.user_id && user.id === order.user_id);
    if (!authorized && user) {
      const { data: staff } = await admin.from("staff_roles").select("role").eq("user_id", user.id).maybeSingle();
      if (staff) authorized = true;
    }
    if (!authorized) {
      if (!email) {
        return apiError("UNAUTHORIZED", "Please enter the email address used for this order to view tracking.", 401);
      }
      let orderEmail = order.guest_email?.trim().toLowerCase() ?? null;
      if (!orderEmail && order.user_id) {
        const { data: profile } = await admin.from("profiles").select("email").eq("id", order.user_id).maybeSingle();
        orderEmail = profile?.email?.trim().toLowerCase() ?? null;
      }
      if (!orderEmail || orderEmail !== email) {
        return apiError("NOT_FOUND", "Order reference and email address do not match our records.", 404);
      }
    }

    const [{ data: shipmentRow }, { data: addr }] = await Promise.all([
      admin.from("shipments").select("*").eq("order_id", order.id).maybeSingle(),
      order.address_id
        ? admin.from("addresses").select("city,state,postal_code").eq("id", order.address_id).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    let activeShipment = shipmentRow;
    if (
      activeShipment &&
      (activeShipment.awb_code || activeShipment.tracking_number) &&
      isShiprocketConfigured() &&
      (forceSync || isStale(activeShipment.last_synced_at))
    ) {
      activeShipment = await syncShipmentLiveTracking(admin, activeShipment.id).catch(() => activeShipment);
    }

    const status = activeShipment?.status ?? (order.status === "cancelled" ? "cancelled" : "pending");
    const mapped = mapShiprocketStatus(activeShipment?.current_status_id, activeShipment?.current_status ?? status);

    const payload: TrackingPayload = {
      orderRef: order.id.slice(0, 8).toUpperCase(),
      itemTitle: order.item_title,
      orderStatus: order.status,
      orderCreatedAt: order.created_at,
      destinationCity: addr?.city ?? null,
      destinationState: addr?.state ?? null,
      destinationPincode: addr?.postal_code ?? null,
      shipment: {
        status,
        statusLabel: mapped.label,
        currentStatus: activeShipment?.current_status ?? "Order Confirmed — Preparing Dispatch",
        carrier: activeShipment?.carrier ?? null,
        awbCode: activeShipment?.awb_code ?? activeShipment?.tracking_number ?? null,
        trackingUrl: activeShipment?.tracking_url ?? shiprocketTrackingUrl(activeShipment?.awb_code ?? activeShipment?.tracking_number),
        etd: activeShipment?.etd ?? null,
        shippedAt: activeShipment?.shipped_at ?? null,
        deliveredAt: activeShipment?.delivered_at ?? null,
        pickupScheduledDate: activeShipment?.pickup_scheduled_date ?? null,
        lastLocation: activeShipment?.last_location ?? null,
        lastSyncedAt: activeShipment?.last_synced_at ?? null,
        rtoReason: activeShipment?.rto_reason ?? null,
        scans: normalizeTrackingScans(activeShipment?.tracking_events),
      },
    };

    return apiSuccess({ tracking: payload });
  } catch (error) {
    console.error("[shipping:track]", { traceId, error });
    return apiError("INTERNAL_ERROR", "Could not retrieve tracking details right now.", 500, { traceId });
  }
}
