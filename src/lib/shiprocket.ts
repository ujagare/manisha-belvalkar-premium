import "server-only";
import { isShiprocketConfigured, serverEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { getHsnSacAndRate } from "@/lib/gst";
import { getSiteUrl } from "@/lib/site-url";
import {
  sendEmail,
  shipmentDeliveredEmail,
  shipmentDispatchedEmail,
  shipmentOutForDeliveryEmail,
} from "@/lib/resend";
import {
  calculateParcelSpec,
  estimateFallbackDelivery,
  formatShiprocketOrderDate,
  mapShiprocketStatus,
  normalizeTrackingScans,
  parseCourierOptions,
  shiprocketTrackingUrl,
  type CourierOption,
  type ParcelSpec,
  type ServiceabilityResult,
  type TrackingScanEvent,
} from "@/lib/shiprocket-utils";

const SHIPROCKET_API = "https://apiv2.shiprocket.in/v1/external";

type AdminClient = ReturnType<typeof createAdminClient>;

let cachedToken: { token: string; expiresAtMs: number } | null = null;

/**
 * Obtains a valid Shiprocket Bearer JWT token.
 * - Uses in-memory cache first, then Supabase `shiprocket_tokens` cache.
 * - Refreshes via `POST /auth/login` when missing or within 24h of expiry (Shiprocket TTL = 10 days).
 */
export async function getShiprocketToken(forceRefresh = false): Promise<string> {
  const email = serverEnv.shiprocketEmail();
  const password = serverEnv.shiprocketPassword();
  if (!email || !password) {
    throw new Error("Shiprocket credentials are not configured.");
  }

  const now = Date.now();
  if (!forceRefresh && cachedToken && cachedToken.expiresAtMs > now + 60 * 60 * 1000) {
    return cachedToken.token;
  }

  let admin: AdminClient | null = null;
  try {
    admin = createAdminClient();
    if (!forceRefresh) {
      const { data } = await admin
        .from("shiprocket_tokens")
        .select("token,expires_at")
        .eq("id", "default")
        .maybeSingle();
      if (data?.token && data.expires_at) {
        const expMs = Date.parse(data.expires_at);
        if (Number.isFinite(expMs) && expMs > now + 60 * 60 * 1000) {
          cachedToken = { token: data.token, expiresAtMs: expMs };
          return data.token;
        }
      }
    }
  } catch (err) {
    console.warn("[shiprocket:token-cache-read]", err);
  }

  const response = await fetch(`${SHIPROCKET_API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Shiprocket auth failed (${response.status}): ${text.slice(0, 200)}`);
  }

  const data = (await response.json()) as { token?: string };
  if (!data.token) throw new Error("Shiprocket auth response missing token.");

  // Shiprocket tokens last 10 days (240h); cache safely for 9 days.
  const expiresAtMs = now + 9 * 24 * 60 * 60 * 1000;
  cachedToken = { token: data.token, expiresAtMs };

  if (admin) {
    await admin
      .from("shiprocket_tokens")
      .upsert({
        id: "default",
        token: data.token,
        expires_at: new Date(expiresAtMs).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .then(({ error }) => {
        if (error) console.warn("[shiprocket:token-cache-write]", error.message);
      });
  }

  return data.token;
}

async function shiprocketRequest<T>(
  path: string,
  init: { method?: "GET" | "POST"; body?: Record<string, unknown>; query?: Record<string, string | number> } = {},
  retried = false,
): Promise<T> {
  const token = await getShiprocketToken(retried);
  const url = new URL(`${SHIPROCKET_API}${path}`);
  if (init.query) {
    for (const [key, val] of Object.entries(init.query)) {
      url.searchParams.set(key, String(val));
    }
  }

  const response = await fetch(url.toString(), {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    signal: AbortSignal.timeout(12_000),
    cache: "no-store",
  });

  if (response.status === 401 && !retried) {
    cachedToken = null;
    return shiprocketRequest<T>(path, init, true);
  }

  const text = await response.text().catch(() => "");
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!response.ok) {
    const errMsg =
      json && typeof json === "object" && "message" in json && typeof (json as { message?: unknown }).message === "string"
        ? (json as { message: string }).message
        : text.slice(0, 220);
    throw new Error(`Shiprocket ${path} failed (${response.status}): ${errMsg}`);
  }

  return json as T;
}

/* ============================================================================
   1. Courier Serviceability & Rate Estimator
   ============================================================================ */

export async function checkShiprocketServiceability(input: {
  deliveryPostcode: string;
  weightKg?: number;
  cod?: boolean;
  pickupPostcode?: string;
}): Promise<ServiceabilityResult> {
  const deliveryPostcode = input.deliveryPostcode.trim();
  if (!isShiprocketConfigured()) {
    return estimateFallbackDelivery(deliveryPostcode);
  }

  const pickupPostcode = input.pickupPostcode?.trim() || serverEnv.shiprocketPickupPincode();
  const weight = Number((input.weightKg ?? 0.5).toFixed(2));
  const codFlag = input.cod ? 1 : 0;

  const raw = await shiprocketRequest<{
    status?: number;
    data?: {
      available_courier_companies?: unknown[];
      recommended_courier_company_id?: number | null;
    };
  }>("/courier/serviceability/", {
    method: "GET",
    query: {
      pickup_postcode: pickupPostcode,
      delivery_postcode: deliveryPostcode,
      weight,
      cod: codFlag,
    },
  });

  const parsed = parseCourierOptions(
    raw?.data?.available_courier_companies ?? [],
    raw?.data?.recommended_courier_company_id ?? null,
  );

  if (!parsed.couriers.length) {
    return {
      serviceable: false,
      pincode: deliveryPostcode,
      live: true,
      estimatedDeliveryDate: null,
      estimatedDaysMin: 0,
      estimatedDaysMax: 0,
      freeShipping: true,
      codAvailable: false,
      recommendedCourier: null,
      fastestCourier: null,
      cheapestCourier: null,
      couriers: [],
      message: "Currently this PIN code is not serviceable by our courier partners. Contact us on WhatsApp for special dispatch.",
    };
  }

  const best = parsed.recommendedCourier ?? parsed.couriers[0];
  const minDays = parsed.fastestCourier?.estimatedDeliveryDays ?? best.estimatedDeliveryDays ?? 4;
  const maxDays = Math.max(minDays + 1, best.estimatedDeliveryDays ?? minDays + 2);
  const etdIso = best.etd && Number.isFinite(Date.parse(best.etd))
    ? new Date(best.etd).toISOString()
    : new Date(Date.now() + maxDays * 24 * 60 * 60 * 1000).toISOString();

  return {
    serviceable: true,
    pincode: deliveryPostcode,
    live: true,
    estimatedDeliveryDate: etdIso,
    estimatedDaysMin: minDays,
    estimatedDaysMax: maxDays,
    freeShipping: true,
    codAvailable: parsed.couriers.some((c) => c.codAvailable),
    recommendedCourier: parsed.recommendedCourier,
    fastestCourier: parsed.fastestCourier,
    cheapestCourier: parsed.cheapestCourier,
    couriers: parsed.couriers.slice(0, 8),
    message: `Delivery available via ${best.courierName} (${minDays}–${maxDays} days).`,
  };
}

/* ============================================================================
   2. Core Shiprocket Order / AWB / Pickup / Label / Manifest / Track / Cancel APIs
   ============================================================================ */

export async function createShiprocketAdhocOrder(payload: Record<string, unknown>) {
  return shiprocketRequest<{
    order_id: number;
    shipment_id: number;
    status: string;
    status_code: number;
    awb_code?: string | null;
    courier_company_id?: number | null;
    courier_name?: string | null;
  }>("/orders/create/adhoc", { method: "POST", body: payload });
}

export async function assignShiprocketAwb(shipmentId: number, courierId?: number | null) {
  const body: Record<string, unknown> = { shipment_id: shipmentId };
  if (courierId && Number.isInteger(courierId) && courierId > 0) {
    body.courier_id = courierId;
  }
  return shiprocketRequest<{
    awb_assign_status?: number;
    response?: {
      data?: {
        awb_code?: string;
        courier_company_id?: number;
        courier_name?: string;
        freight_charges?: number;
        etd?: string;
      };
    };
  }>("/courier/assign/awb", { method: "POST", body });
}

export async function generateShiprocketPickup(shipmentId: number) {
  return shiprocketRequest<{
    pickup_status?: number;
    response?: {
      pickup_scheduled_date?: string;
      pickup_token_number?: string;
      status?: number;
      data?: string;
    };
  }>("/courier/generate/pickup", {
    method: "POST",
    body: { shipment_id: [shipmentId] },
  });
}

export async function generateShiprocketLabel(shipmentId: number) {
  return shiprocketRequest<{
    label_created?: number;
    label_url?: string;
    response?: string;
  }>("/courier/generate/label", {
    method: "POST",
    body: { shipment_id: [shipmentId] },
  });
}

export async function generateShiprocketManifest(shipmentId: number) {
  return shiprocketRequest<{
    status?: number;
    manifest_url?: string;
    message?: string;
  }>("/manifests/generate", {
    method: "POST",
    body: { shipment_id: [shipmentId] },
  });
}

export async function generateShiprocketInvoice(shiprocketOrderId: number) {
  return shiprocketRequest<{
    is_invoice_created?: boolean;
    invoice_url?: string;
  }>("/orders/print/invoice", {
    method: "POST",
    body: { ids: [shiprocketOrderId] },
  });
}

export async function cancelShiprocketOrder(shiprocketOrderId: number) {
  return shiprocketRequest<{
    status?: number;
    message?: string;
  }>("/orders/cancel", {
    method: "POST",
    body: { ids: [shiprocketOrderId] },
  });
}

export interface LiveTrackingResponse {
  awbCode: string;
  courierName: string | null;
  currentStatus: string;
  currentStatusId: number | null;
  etd: string | null;
  trackUrl: string | null;
  deliveredAt: string | null;
  lastLocation: string | null;
  scans: TrackingScanEvent[];
}

export async function fetchShiprocketTrackingByAwb(awbCode: string): Promise<LiveTrackingResponse | null> {
  const clean = awbCode.trim();
  if (!clean) return null;

  const raw = await shiprocketRequest<{
    tracking_data?: {
      track_status?: number;
      shipment_status?: number;
      shipment_track?: Array<{
        awb_code?: string;
        courier_name?: string;
        current_status?: string;
        delivered_date?: string | null;
        edd?: string | null;
        destination?: string | null;
      }>;
      shipment_track_activities?: unknown[];
      track_url?: string;
      etd?: string | null;
    };
  }>(`/courier/track/awb/${encodeURIComponent(clean)}`, { method: "GET" });

  const td = raw?.tracking_data;
  if (!td || td.track_status === 0) return null;

  const summary = td.shipment_track?.[0];
  const scans = normalizeTrackingScans(td.shipment_track_activities ?? td.shipment_track ?? []);
  const currentStatus =
    summary?.current_status?.trim() ||
    scans[0]?.status ||
    "In Transit";

  return {
    awbCode: summary?.awb_code?.trim() || clean,
    courierName: summary?.courier_name?.trim() || null,
    currentStatus,
    currentStatusId: typeof td.shipment_status === "number" ? td.shipment_status : null,
    etd: td.etd || summary?.edd || null,
    trackUrl: td.track_url || shiprocketTrackingUrl(clean),
    deliveredAt: summary?.delivered_date || null,
    lastLocation: scans[0]?.location || summary?.destination || null,
    scans,
  };
}

/* ============================================================================
   3. High-Level Fulfilment & Notification Orchestrators
   ============================================================================ */

/**
 * Ensures a `public.shipments` row exists for any physical product order,
 * with calculated parcel dimensions and linked delivery address.
 */
export async function ensureShipmentRecord(admin: AdminClient, orderId: string) {
  const { data: existing } = await admin
    .from("shipments")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();
  if (existing) return existing;

  const [{ data: order }, { data: items }] = await Promise.all([
    admin.from("orders").select("id,address_id,item_type").eq("id", orderId).maybeSingle(),
    admin.from("order_items").select("item_slug,quantity").eq("order_id", orderId).eq("item_type", "product"),
  ]);

  if (!order) throw new Error("Order not found.");

  const parcel = calculateParcelSpec(
    (items ?? []).map((i) => ({ slug: i.item_slug, quantity: i.quantity })),
  );

  const { data: created, error } = await admin
    .from("shipments")
    .insert({
      order_id: order.id,
      address_id: order.address_id,
      provider: "shiprocket",
      pickup_location: serverEnv.shiprocketPickupLocation(),
      weight_kg: parcel.weightKg,
      length_cm: parcel.lengthCm,
      breadth_cm: parcel.breadthCm,
      height_cm: parcel.heightCm,
      status: "pending",
      current_status: "Order Confirmed — Preparing Dispatch",
    })
    .select("*")
    .single();

  if (error || !created) {
    throw new Error(`Could not create shipment row: ${error?.message ?? "unknown"}`);
  }
  return created;
}

/**
 * Pushes a paid physical product order into Shiprocket (`POST /orders/create/adhoc`)
 * and records `shiprocket_order_id` + `shiprocket_shipment_id` in `public.shipments`.
 */
export async function pushOrderToShiprocket(
  admin: AdminClient,
  orderId: string,
  overrides?: {
    parcel?: Partial<ParcelSpec>;
    pickupLocation?: string;
    autoAssignAwb?: boolean;
    courierId?: number | null;
  },
) {
  if (!isShiprocketConfigured()) {
    throw new Error("Shiprocket credentials are not configured.");
  }

  const shipment = await ensureShipmentRecord(admin, orderId);

  const [{ data: order }, { data: items }] = await Promise.all([
    admin
      .from("orders")
      .select("id,user_id,address_id,amount,amount_subunits,currency,guest_email,guest_name,created_at")
      .eq("id", orderId)
      .maybeSingle(),
    admin
      .from("order_items")
      .select("item_slug,title,quantity,unit_amount_subunits")
      .eq("order_id", orderId)
      .eq("item_type", "product"),
  ]);

  if (!order) throw new Error("Order not found.");
  if (!order.address_id) throw new Error("Order is missing a delivery address.");

  const { data: address } = await admin
    .from("addresses")
    .select("*")
    .eq("id", order.address_id)
    .maybeSingle();

  if (!address) throw new Error("Delivery address not found.");

  let customerEmail = order.guest_email ?? null;
  if (!customerEmail && order.user_id) {
    const { data: profile } = await admin
      .from("profiles")
      .select("email")
      .eq("id", order.user_id)
      .maybeSingle();
    customerEmail = profile?.email ?? null;
  }

  const computed = calculateParcelSpec(
    (items ?? []).map((i) => ({ slug: i.item_slug, quantity: i.quantity })),
  );
  const weightKg = overrides?.parcel?.weightKg ?? Number(shipment.weight_kg ?? computed.weightKg);
  const lengthCm = overrides?.parcel?.lengthCm ?? Number(shipment.length_cm ?? computed.lengthCm);
  const breadthCm = overrides?.parcel?.breadthCm ?? Number(shipment.breadth_cm ?? computed.breadthCm);
  const heightCm = overrides?.parcel?.heightCm ?? Number(shipment.height_cm ?? computed.heightCm);
  const pickupLocation = overrides?.pickupLocation?.trim() || shipment.pickup_location || serverEnv.shiprocketPickupLocation();

  // If already created in Shiprocket, skip creation and optionally assign AWB.
  let shiprocketOrderId = shipment.shiprocket_order_id;
  let shiprocketShipmentId = shipment.shiprocket_shipment_id;

  if (!shiprocketOrderId || !shiprocketShipmentId) {
    const nameParts = address.recipient_name.trim().split(/\s+/);
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || ".";
    const cleanPhone = address.phone.replace(/\D/g, "").slice(-10) || "9999999999";

    const orderItems = (items && items.length > 0 ? items : [{ item_slug: "product", title: "Sacred Product", quantity: 1, unit_amount_subunits: order.amount_subunits ?? 0 }]).map((item) => {
      const unitInr = item.unit_amount_subunits != null ? Number((item.unit_amount_subunits / 100).toFixed(2)) : Number((order.amount ?? 0).toFixed(2));
      const { hsnSacCode } = getHsnSacAndRate("product", item.item_slug);
      return {
        name: item.title.slice(0, 120),
        sku: item.item_slug.toUpperCase().slice(0, 48),
        units: item.quantity,
        selling_price: unitInr,
        discount: 0,
        tax: 0,
        hsn: hsnSacCode,
      };
    });

    const subTotal = orderItems.reduce((sum, item) => sum + item.selling_price * item.units, 0);
    const channelId = serverEnv.shiprocketChannelId();
    const channelOrderId = `MB-${order.id.slice(0, 8).toUpperCase()}`;

    const srRes = await createShiprocketAdhocOrder({
      order_id: channelOrderId,
      order_date: formatShiprocketOrderDate(order.created_at),
      pickup_location: pickupLocation,
      ...(channelId ? { channel_id: channelId } : {}),
      comment: "Manisha Belvalkar Sacred Store — Handle with care",
      billing_customer_name: firstName,
      billing_last_name: lastName,
      billing_address: address.line1,
      billing_address_2: address.line2 ?? "",
      billing_city: address.city,
      billing_pincode: address.postal_code,
      billing_state: address.state,
      billing_country: address.country_code === "IN" ? "India" : address.country_code,
      billing_email: customerEmail ?? "orders@manishabelvalkar.com",
      billing_phone: cleanPhone,
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: "Prepaid",
      sub_total: Number(subTotal.toFixed(2)),
      length: lengthCm,
      breadth: breadthCm,
      height: heightCm,
      weight: weightKg,
    });

    shiprocketOrderId = srRes.order_id;
    shiprocketShipmentId = srRes.shipment_id;

    const now = new Date().toISOString();
    await admin
      .from("shipments")
      .update({
        shiprocket_order_id: shiprocketOrderId,
        shiprocket_shipment_id: shiprocketShipmentId,
        pickup_location: pickupLocation,
        weight_kg: weightKg,
        length_cm: lengthCm,
        breadth_cm: breadthCm,
        height_cm: heightCm,
        status: srRes.awb_code ? "awb_assigned" : "created",
        awb_code: srRes.awb_code ?? shipment.awb_code,
        tracking_number: srRes.awb_code ?? shipment.tracking_number,
        tracking_url: srRes.awb_code ? shiprocketTrackingUrl(srRes.awb_code) : shipment.tracking_url,
        carrier: srRes.courier_name ?? shipment.carrier,
        courier_company_id: srRes.courier_company_id ?? shipment.courier_company_id,
        current_status: srRes.status || "NEW",
        current_status_id: srRes.status_code ?? 1,
        last_synced_at: now,
        updated_at: now,
      })
      .eq("id", shipment.id);

    await admin
      .from("orders")
      .update({ fulfillment_status: "processing", updated_at: now })
      .eq("id", order.id);
  }

  if (overrides?.autoAssignAwb && shiprocketShipmentId) {
    return assignAwbAndUpdateShipment(admin, orderId, overrides.courierId);
  }

  const { data: updated } = await admin.from("shipments").select("*").eq("order_id", orderId).single();
  return updated;
}

export async function assignAwbAndUpdateShipment(
  admin: AdminClient,
  orderId: string,
  courierId?: number | null,
) {
  const { data: shipment } = await admin.from("shipments").select("*").eq("order_id", orderId).maybeSingle();
  if (!shipment?.shiprocket_shipment_id) {
    throw new Error("Push the order to Shiprocket before assigning an AWB.");
  }

  const res = await assignShiprocketAwb(shipment.shiprocket_shipment_id, courierId);
  const data = res?.response?.data;
  if (!data?.awb_code) {
    throw new Error("Shiprocket could not assign an AWB for this shipment. Check Shiprocket wallet balance or courier selection.");
  }

  const now = new Date().toISOString();
  const trackUrl = shiprocketTrackingUrl(data.awb_code);
  const etdIso = data.etd && Number.isFinite(Date.parse(data.etd)) ? new Date(data.etd).toISOString() : shipment.etd;

  const { data: updated, error } = await admin
    .from("shipments")
    .update({
      awb_code: data.awb_code,
      tracking_number: data.awb_code,
      tracking_url: trackUrl,
      carrier: data.courier_name ?? shipment.carrier,
      courier_company_id: data.courier_company_id ?? shipment.courier_company_id,
      shipping_charge_subunits: data.freight_charges != null ? Math.round(data.freight_charges * 100) : shipment.shipping_charge_subunits,
      etd: etdIso,
      status: "awb_assigned",
      current_status: "AWB Assigned — Ready to Ship",
      current_status_id: 2,
      last_synced_at: now,
      updated_at: now,
    })
    .eq("id", shipment.id)
    .select("*")
    .single();

  if (error) throw error;
  return updated;
}

export async function schedulePickupAndUpdateShipment(admin: AdminClient, orderId: string) {
  const { data: shipment } = await admin.from("shipments").select("*").eq("order_id", orderId).maybeSingle();
  if (!shipment?.shiprocket_shipment_id || !shipment.awb_code) {
    throw new Error("Assign an AWB before scheduling courier pickup.");
  }

  const res = await generateShiprocketPickup(shipment.shiprocket_shipment_id);
  const now = new Date().toISOString();
  const pickupDate = res?.response?.pickup_scheduled_date && Number.isFinite(Date.parse(res.response.pickup_scheduled_date))
    ? new Date(res.response.pickup_scheduled_date).toISOString()
    : now;

  const { data: updated, error } = await admin
    .from("shipments")
    .update({
      pickup_scheduled_date: pickupDate,
      pickup_token_number: res?.response?.pickup_token_number ?? shipment.pickup_token_number,
      status: "pickup_scheduled",
      current_status: "Pickup Scheduled",
      current_status_id: 3,
      last_synced_at: now,
      updated_at: now,
    })
    .eq("id", shipment.id)
    .select("*")
    .single();

  if (error) throw error;
  return updated;
}

/**
 * Sends customer milestone notifications when shipment transitions to
 * `shipped`, `out_for_delivery`, or `delivered`. Best-effort (never throws).
 */
export async function notifyCustomerShipmentMilestone(
  admin: AdminClient,
  orderId: string,
  previousStatus: string,
  nextStatus: string,
  details: {
    awbCode: string | null;
    carrier: string | null;
    etd: string | null;
    trackingUrl: string | null;
  },
) {
  if (previousStatus === nextStatus) return;
  if (!["shipped", "out_for_delivery", "delivered"].includes(nextStatus)) return;

  try {
    const { data: order } = await admin
      .from("orders")
      .select("id,user_id,item_title,guest_email,guest_name")
      .eq("id", orderId)
      .maybeSingle();
    if (!order) return;

    let email = order.guest_email ?? null;
    let name = order.guest_name ?? null;
    if (!email && order.user_id) {
      const { data: profile } = await admin
        .from("profiles")
        .select("email,full_name")
        .eq("id", order.user_id)
        .maybeSingle();
      email = profile?.email ?? null;
      name = name ?? profile?.full_name ?? null;
    }
    if (!email) return;

    const siteUrl = getSiteUrl();
    const orderRef = order.id.slice(0, 8).toUpperCase();
    const trackPageUrl = details.awbCode
      ? `${siteUrl}/track-order?awb=${encodeURIComponent(details.awbCode)}`
      : `${siteUrl}/account/orders/${order.id}`;

    const etdLabel = details.etd && Number.isFinite(Date.parse(details.etd))
      ? new Date(details.etd).toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : null;

    if (nextStatus === "shipped") {
      const mail = shipmentDispatchedEmail({
        name: name ?? email.split("@")[0],
        orderRef,
        items: order.item_title,
        carrier: details.carrier ?? "Courier Partner",
        awbCode: details.awbCode ?? "Pending",
        etdLabel,
        trackUrl: trackPageUrl,
      });
      await sendEmail({ to: email, subject: mail.subject, html: mail.html });
    } else if (nextStatus === "out_for_delivery") {
      const mail = shipmentOutForDeliveryEmail({
        name: name ?? email.split("@")[0],
        orderRef,
        items: order.item_title,
        carrier: details.carrier ?? "Courier Partner",
        awbCode: details.awbCode ?? "—",
        trackUrl: trackPageUrl,
      });
      await sendEmail({ to: email, subject: mail.subject, html: mail.html });
    } else if (nextStatus === "delivered") {
      const mail = shipmentDeliveredEmail({
        name: name ?? email.split("@")[0],
        orderRef,
        items: order.item_title,
        awbCode: details.awbCode ?? "—",
        orderUrl: `${siteUrl}/account/orders/${order.id}`,
      });
      await sendEmail({ to: email, subject: mail.subject, html: mail.html });
    }
  } catch (err) {
    console.warn("[shiprocket:notify-email]", orderId, err);
  }
}

/**
 * Syncs live tracking scans from Shiprocket for a given shipment row and updates DB + order status.
 */
export async function syncShipmentLiveTracking(admin: AdminClient, shipmentId: string) {
  const { data: shipment } = await admin.from("shipments").select("*").eq("id", shipmentId).maybeSingle();
  if (!shipment) throw new Error("Shipment not found.");
  const awb = shipment.awb_code ?? shipment.tracking_number;
  if (!awb || !isShiprocketConfigured()) return shipment;

  const live = await fetchShiprocketTrackingByAwb(awb);
  if (!live) return shipment;

  const mapped = mapShiprocketStatus(live.currentStatusId, live.currentStatus);
  const now = new Date().toISOString();
  const etdIso = live.etd && Number.isFinite(Date.parse(live.etd)) ? new Date(live.etd).toISOString() : shipment.etd;
  const deliveredIso =
    mapped.shipmentStatus === "delivered"
      ? (live.deliveredAt && Number.isFinite(Date.parse(live.deliveredAt)) ? new Date(live.deliveredAt).toISOString() : shipment.delivered_at ?? now)
      : shipment.delivered_at;
  const shippedIso =
    ["shipped", "in_transit", "out_for_delivery", "delivered"].includes(mapped.shipmentStatus)
      ? (shipment.shipped_at ?? now)
      : shipment.shipped_at;

  const { data: updated, error } = await admin
    .from("shipments")
    .update({
      carrier: live.courierName ?? shipment.carrier,
      tracking_url: live.trackUrl ?? shipment.tracking_url ?? shiprocketTrackingUrl(awb),
      status: mapped.shipmentStatus,
      current_status: live.currentStatus,
      current_status_id: live.currentStatusId ?? shipment.current_status_id,
      last_location: live.lastLocation ?? shipment.last_location,
      etd: etdIso,
      shipped_at: shippedIso,
      delivered_at: deliveredIso,
      tracking_events: live.scans as unknown as never,
      last_synced_at: now,
      updated_at: now,
    })
    .eq("id", shipment.id)
    .select("*")
    .single();

  if (error) throw error;

  await admin
    .from("orders")
    .update({
      fulfillment_status: mapped.fulfillmentStatus,
      status: mapped.shipmentStatus === "delivered" ? "completed" : undefined,
      updated_at: now,
    })
    .eq("id", shipment.order_id);

  await notifyCustomerShipmentMilestone(admin, shipment.order_id, shipment.status, mapped.shipmentStatus, {
    awbCode: awb,
    carrier: updated.carrier,
    etd: updated.etd,
    trackingUrl: updated.tracking_url,
  });

  return updated;
}

export type { CourierOption };
