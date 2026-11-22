import { apiError, apiSuccess, readJsonObject, requestId } from "@/lib/api";
import { isShiprocketConfigured } from "@/lib/env";
import { isSameOriginRequest } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  assignAwbAndUpdateShipment,
  cancelShiprocketOrder,
  checkShiprocketServiceability,
  ensureShipmentRecord,
  generateShiprocketInvoice,
  generateShiprocketLabel,
  generateShiprocketManifest,
  notifyCustomerShipmentMilestone,
  pushOrderToShiprocket,
  schedulePickupAndUpdateShipment,
  syncShipmentLiveTracking,
} from "@/lib/shiprocket";
import { mapShiprocketStatus, shiprocketTrackingUrl } from "@/lib/shiprocket-utils";

export const runtime = "nodejs";

const ALLOWED_STAFF_ROLES = ["owner", "admin", "catalog_manager", "support"];

async function authorizeStaff() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: apiError("UNAUTHORIZED", "Please sign in.", 401) };

  const admin = createAdminClient();
  const { data: staff } = await admin.from("staff_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (!staff || !ALLOWED_STAFF_ROLES.includes(staff.role)) {
    return { error: apiError("FORBIDDEN", "Staff access required.", 403) };
  }

  const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance?.currentLevel !== "aal2") {
    return { error: apiError("FORBIDDEN", "Two-factor authentication is required.", 403) };
  }

  return { user, role: staff.role, admin };
}

/**
 * GET /api/admin/shipments/[orderId]
 * Fetches live serviceable Shiprocket couriers & rates for this order's destination PIN code.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const traceId = requestId(request);
  try {
    const auth = await authorizeStaff();
    if ("error" in auth) return auth.error;
    const { orderId } = await params;

    const { data: order } = await auth.admin
      .from("orders")
      .select("id,address_id")
      .eq("id", orderId)
      .maybeSingle();
    if (!order) return apiError("NOT_FOUND", "Order not found.", 404);
    if (!order.address_id) return apiError("BAD_REQUEST", "Order has no delivery address.", 422);

    const [{ data: address }, shipment] = await Promise.all([
      auth.admin.from("addresses").select("postal_code,city,state").eq("id", order.address_id).maybeSingle(),
      ensureShipmentRecord(auth.admin, orderId),
    ]);

    if (!address?.postal_code) return apiError("BAD_REQUEST", "Address is missing a PIN code.", 422);

    const serviceability = await checkShiprocketServiceability({
      deliveryPostcode: address.postal_code,
      weightKg: Number(shipment.weight_kg ?? 0.5),
      cod: false,
    });

    return apiSuccess({ serviceability, shipment });
  } catch (error) {
    console.error("[admin:shipments:get]", { traceId, error });
    return apiError(
      "INTERNAL_ERROR",
      error instanceof Error ? error.message : "Could not load courier options.",
      500,
      { traceId },
    );
  }
}

/**
 * POST /api/admin/shipments/[orderId]
 * Staff shipping actions:
 * - push: Push order to Shiprocket (with optional parcel dimensions & autoAssignAwb)
 * - assign_awb: Assign courier & generate AWB
 * - schedule_pickup: Request courier pickup
 * - generate_label: Generate Shiprocket PDF shipping label
 * - generate_manifest: Generate Shiprocket PDF pickup manifest
 * - generate_invoice: Generate Shiprocket PDF invoice
 * - sync_tracking: Pull live tracking scans from Shiprocket
 * - manual_update: Manually record carrier / AWB / status (works even without Shiprocket API)
 * - cancel: Cancel order in Shiprocket & mark shipment cancelled
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const traceId = requestId(request);
  try {
    if (!isSameOriginRequest(request)) {
      return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
    }
    const auth = await authorizeStaff();
    if ("error" in auth) return auth.error;

    const { orderId } = await params;
    const body = await readJsonObject(request);
    const action = typeof body.action === "string" ? body.action.trim() : "";

    const { data: order } = await auth.admin
      .from("orders")
      .select("id,item_type,status")
      .eq("id", orderId)
      .maybeSingle();
    if (!order) return apiError("NOT_FOUND", "Order not found.", 404);

    const shipment = await ensureShipmentRecord(auth.admin, orderId);
    const now = new Date().toISOString();

    if (action === "push") {
      if (!isShiprocketConfigured()) {
        return apiError("NOT_CONFIGURED", "Add SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in .env.local first.", 503);
      }
      const weightKg = Number(body.weightKg);
      const lengthCm = Number(body.lengthCm);
      const breadthCm = Number(body.breadthCm);
      const heightCm = Number(body.heightCm);
      const courierId = Number(body.courierId);
      const updated = await pushOrderToShiprocket(auth.admin, orderId, {
        parcel: {
          ...(Number.isFinite(weightKg) && weightKg > 0 ? { weightKg } : {}),
          ...(Number.isFinite(lengthCm) && lengthCm > 0 ? { lengthCm } : {}),
          ...(Number.isFinite(breadthCm) && breadthCm > 0 ? { breadthCm } : {}),
          ...(Number.isFinite(heightCm) && heightCm > 0 ? { heightCm } : {}),
        },
        pickupLocation: typeof body.pickupLocation === "string" ? body.pickupLocation : undefined,
        autoAssignAwb: body.autoAssignAwb === true,
        courierId: Number.isInteger(courierId) && courierId > 0 ? courierId : null,
      });
      await auth.admin.from("audit_logs").insert({
        actor_user_id: auth.user.id,
        action: "shipment.shiprocket_pushed",
        entity_type: "shipment",
        entity_id: updated.id,
        metadata: { orderId, shiprocketOrderId: updated.shiprocket_order_id, awb: updated.awb_code },
      });
      return apiSuccess({ shipment: updated });
    }

    if (action === "assign_awb") {
      if (!isShiprocketConfigured()) {
        return apiError("NOT_CONFIGURED", "Shiprocket is not configured.", 503);
      }
      const courierId = Number(body.courierId);
      const updated = await assignAwbAndUpdateShipment(
        auth.admin,
        orderId,
        Number.isInteger(courierId) && courierId > 0 ? courierId : null,
      );
      await auth.admin.from("audit_logs").insert({
        actor_user_id: auth.user.id,
        action: "shipment.awb_assigned",
        entity_type: "shipment",
        entity_id: updated.id,
        metadata: { orderId, awb: updated.awb_code, carrier: updated.carrier },
      });
      return apiSuccess({ shipment: updated });
    }

    if (action === "schedule_pickup") {
      if (!isShiprocketConfigured()) {
        return apiError("NOT_CONFIGURED", "Shiprocket is not configured.", 503);
      }
      const updated = await schedulePickupAndUpdateShipment(auth.admin, orderId);
      await auth.admin.from("audit_logs").insert({
        actor_user_id: auth.user.id,
        action: "shipment.pickup_scheduled",
        entity_type: "shipment",
        entity_id: updated.id,
        metadata: { orderId, pickupDate: updated.pickup_scheduled_date },
      });
      return apiSuccess({ shipment: updated });
    }

    if (action === "generate_label") {
      if (!isShiprocketConfigured() || !shipment.shiprocket_shipment_id) {
        return apiError("BAD_REQUEST", "Shipment must be pushed to Shiprocket first.", 422);
      }
      const res = await generateShiprocketLabel(shipment.shiprocket_shipment_id);
      if (!res.label_url) return apiError("BAD_GATEWAY", "Shiprocket did not return a label URL.", 502);
      const { data: updated } = await auth.admin
        .from("shipments")
        .update({ label_url: res.label_url, updated_at: now })
        .eq("id", shipment.id)
        .select("*")
        .single();
      return apiSuccess({ shipment: updated, url: res.label_url });
    }

    if (action === "generate_manifest") {
      if (!isShiprocketConfigured() || !shipment.shiprocket_shipment_id) {
        return apiError("BAD_REQUEST", "Shipment must be pushed to Shiprocket first.", 422);
      }
      const res = await generateShiprocketManifest(shipment.shiprocket_shipment_id);
      if (!res.manifest_url) return apiError("BAD_GATEWAY", "Shiprocket did not return a manifest URL.", 502);
      const { data: updated } = await auth.admin
        .from("shipments")
        .update({ manifest_url: res.manifest_url, updated_at: now })
        .eq("id", shipment.id)
        .select("*")
        .single();
      return apiSuccess({ shipment: updated, url: res.manifest_url });
    }

    if (action === "generate_invoice") {
      if (!isShiprocketConfigured() || !shipment.shiprocket_order_id) {
        return apiError("BAD_REQUEST", "Shipment must be pushed to Shiprocket first.", 422);
      }
      const res = await generateShiprocketInvoice(shipment.shiprocket_order_id);
      if (!res.invoice_url) return apiError("BAD_GATEWAY", "Shiprocket did not return an invoice URL.", 502);
      const { data: updated } = await auth.admin
        .from("shipments")
        .update({ invoice_url: res.invoice_url, updated_at: now })
        .eq("id", shipment.id)
        .select("*")
        .single();
      return apiSuccess({ shipment: updated, url: res.invoice_url });
    }

    if (action === "sync_tracking") {
      if (!isShiprocketConfigured()) {
        return apiError("NOT_CONFIGURED", "Shiprocket is not configured.", 503);
      }
      const updated = await syncShipmentLiveTracking(auth.admin, shipment.id);
      return apiSuccess({ shipment: updated });
    }

    if (action === "manual_update") {
      const carrier = typeof body.carrier === "string" ? body.carrier.trim().slice(0, 80) : shipment.carrier;
      const awb = typeof body.awbCode === "string" ? body.awbCode.trim().slice(0, 60) : shipment.awb_code;
      const customUrl = typeof body.trackingUrl === "string" && /^https?:\/\//i.test(body.trackingUrl.trim())
        ? body.trackingUrl.trim().slice(0, 300)
        : null;
      const rawStatus = typeof body.status === "string" ? body.status.trim() : shipment.status;
      const mapped = mapShiprocketStatus(null, rawStatus);
      const validDirectStatuses = [
        "pending", "created", "awb_assigned", "pickup_scheduled", "packed",
        "shipped", "in_transit", "out_for_delivery", "delivered", "rto_initiated", "returned", "cancelled", "exception",
      ];
      const nextStatus = validDirectStatuses.includes(rawStatus) ? rawStatus : mapped.shipmentStatus;
      const location = typeof body.location === "string" ? body.location.trim().slice(0, 120) : null;
      const note = typeof body.note === "string" ? body.note.trim().slice(0, 240) : null;
      const etdRaw = typeof body.etd === "string" && body.etd.trim() && Number.isFinite(Date.parse(body.etd))
        ? new Date(body.etd).toISOString()
        : shipment.etd;

      const existingScans = Array.isArray(shipment.tracking_events) ? shipment.tracking_events : [];
      const nextScans = note || location || nextStatus !== shipment.status
        ? [
            {
              date: now,
              status: nextStatus.replaceAll("_", " ").toUpperCase(),
              activity: note || `Shipment status updated to ${nextStatus.replaceAll("_", " ")}`,
              location: location || "Dispatch Desk",
            },
            ...existingScans,
          ]
        : existingScans;

      const finalTrackUrl = customUrl ?? shiprocketTrackingUrl(awb) ?? shipment.tracking_url;

      const { data: updated, error } = await auth.admin
        .from("shipments")
        .update({
          carrier: carrier || null,
          awb_code: awb || null,
          tracking_number: awb || null,
          tracking_url: finalTrackUrl,
          status: nextStatus,
          current_status: note || nextStatus.replaceAll("_", " "),
          etd: etdRaw,
          last_location: location ?? shipment.last_location,
          shipped_at: ["shipped", "in_transit", "out_for_delivery", "delivered"].includes(nextStatus)
            ? (shipment.shipped_at ?? now)
            : shipment.shipped_at,
          delivered_at: nextStatus === "delivered" ? (shipment.delivered_at ?? now) : shipment.delivered_at,
          cancelled_at: nextStatus === "cancelled" ? (shipment.cancelled_at ?? now) : shipment.cancelled_at,
          tracking_events: nextScans as unknown as never,
          last_synced_at: now,
          updated_at: now,
        })
        .eq("id", shipment.id)
        .select("*")
        .single();

      if (error) throw error;

      const orderFulfillment =
        nextStatus === "delivered"
          ? "delivered"
          : ["shipped", "in_transit", "out_for_delivery"].includes(nextStatus)
            ? "shipped"
            : nextStatus === "cancelled" || nextStatus === "returned"
              ? "cancelled"
              : "processing";

      await auth.admin
        .from("orders")
        .update({
          fulfillment_status: orderFulfillment,
          ...(nextStatus === "delivered" ? { status: "completed" } : {}),
          updated_at: now,
        })
        .eq("id", orderId);

      await notifyCustomerShipmentMilestone(auth.admin, orderId, shipment.status, nextStatus, {
        awbCode: updated.awb_code,
        carrier: updated.carrier,
        etd: updated.etd,
        trackingUrl: updated.tracking_url,
      });

      await auth.admin.from("audit_logs").insert({
        actor_user_id: auth.user.id,
        action: "shipment.manual_updated",
        entity_type: "shipment",
        entity_id: updated.id,
        metadata: { orderId, status: nextStatus, awb: updated.awb_code, carrier: updated.carrier },
      });

      return apiSuccess({ shipment: updated });
    }

    if (action === "cancel") {
      if (shipment.shiprocket_order_id && isShiprocketConfigured()) {
        await cancelShiprocketOrder(shipment.shiprocket_order_id);
      }
      const { data: updated, error } = await auth.admin
        .from("shipments")
        .update({
          status: "cancelled",
          current_status: "Cancelled by Operations",
          cancelled_at: now,
          updated_at: now,
        })
        .eq("id", shipment.id)
        .select("*")
        .single();
      if (error) throw error;

      await auth.admin
        .from("orders")
        .update({ fulfillment_status: "cancelled", updated_at: now })
        .eq("id", orderId);

      await auth.admin.from("audit_logs").insert({
        actor_user_id: auth.user.id,
        action: "shipment.cancelled",
        entity_type: "shipment",
        entity_id: updated.id,
        metadata: { orderId, shiprocketOrderId: shipment.shiprocket_order_id },
      });

      return apiSuccess({ shipment: updated });
    }

    return apiError("BAD_REQUEST", `Unsupported shipment action: ${action || "none"}`, 422);
  } catch (error) {
    console.error("[admin:shipments:post]", { traceId, error });
    return apiError(
      "INTERNAL_ERROR",
      error instanceof Error ? error.message : "Could not process shipping action.",
      500,
      { traceId },
    );
  }
}
