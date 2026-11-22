import { timingSafeEqual } from "node:crypto";

export type ShipmentStatus =
  | "pending"
  | "created"
  | "awb_assigned"
  | "pickup_scheduled"
  | "packed"
  | "shipped"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "rto_initiated"
  | "returned"
  | "cancelled"
  | "exception";

export type OrderFulfillmentStatus =
  | "unfulfilled"
  | "scheduled"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled";

export interface TrackingScanEvent {
  date: string;
  status: string;
  activity: string;
  location: string;
}

export interface ParcelSpec {
  weightKg: number;
  lengthCm: number;
  breadthCm: number;
  heightCm: number;
}

export interface CourierOption {
  courierCompanyId: number;
  courierName: string;
  rate: number;
  codCharges: number;
  codAvailable: boolean;
  etd: string | null;
  estimatedDeliveryDays: number | null;
  mode: "Air" | "Surface";
  rating: number | null;
  isRecommended: boolean;
}

export interface ServiceabilityResult {
  serviceable: boolean;
  pincode: string;
  live: boolean;
  estimatedDeliveryDate: string | null;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  freeShipping: boolean;
  codAvailable: boolean;
  recommendedCourier: CourierOption | null;
  fastestCourier: CourierOption | null;
  cheapestCourier: CourierOption | null;
  couriers: CourierOption[];
  message: string;
}

const DEFAULT_PARCEL_SPECS: Record<string, ParcelSpec> = {
  "shakti-oracle-deck": { weightKg: 0.45, lengthCm: 16, breadthCm: 12, heightCm: 5 },
  "shakti-deck-guidebook": { weightKg: 0.65, lengthCm: 22, breadthCm: 16, heightCm: 6 },
  "shakti-combo-pack": { weightKg: 0.85, lengthCm: 24, breadthCm: 18, heightCm: 8 },
  "sacred-salt-frame": { weightKg: 1.2, lengthCm: 26, breadthCm: 22, heightCm: 10 },
};

const FALLBACK_PARCEL: ParcelSpec = { weightKg: 0.5, lengthCm: 20, breadthCm: 15, heightCm: 6 };

export function isValidIndianPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

/**
 * Calculates combined parcel weight & volumetric box dimensions for one or more physical items.
 */
export function calculateParcelSpec(
  items: Array<{ slug: string; quantity: number }>,
): ParcelSpec {
  if (!items.length) return { ...FALLBACK_PARCEL };
  let totalWeight = 0;
  let maxLength = 0;
  let maxBreadth = 0;
  let stackedHeight = 0;

  for (const item of items) {
    const qty = Math.max(1, Math.min(20, Math.floor(item.quantity || 1)));
    const spec = DEFAULT_PARCEL_SPECS[item.slug] ?? FALLBACK_PARCEL;
    totalWeight += spec.weightKg * qty;
    maxLength = Math.max(maxLength, spec.lengthCm);
    maxBreadth = Math.max(maxBreadth, spec.breadthCm);
    stackedHeight += spec.heightCm * qty;
  }

  return {
    weightKg: Number(Math.max(0.2, totalWeight).toFixed(2)),
    lengthCm: Math.max(12, Math.round(maxLength)),
    breadthCm: Math.max(10, Math.round(maxBreadth)),
    heightCm: Math.max(4, Math.min(60, Math.round(stackedHeight))),
  };
}

export function shiprocketTrackingUrl(awbCode: string | null | undefined): string | null {
  const clean = awbCode?.trim();
  if (!clean) return null;
  return `https://shiprocket.co/tracking/${encodeURIComponent(clean)}`;
}

/**
 * Maps Shiprocket's numeric status_id and textual status label into our normalized
 * internal shipment status and order fulfillment status.
 *
 * Reference Shiprocket status IDs:
 * 1-5: New / AWB Assigned / Pickup Scheduled / Pickup Queued / Manifest Generated
 * 6: Shipped
 * 7: Delivered
 * 8: Cancelled
 * 9: RTO Initiated
 * 10: RTO Delivered
 * 12: Lost
 * 13: Pickup Error
 * 14: RTO Acknowledged
 * 15: Pickup Rescheduled
 * 16: Cancellation Requested
 * 17: Out For Delivery
 * 18: In Transit
 * 19: Out For Pickup
 * 20: Pickup Exception
 * 21: Undelivered
 * 22: Delayed
 * 38: Reached at Destination Hub
 * 42: Picked Up
 */
export function mapShiprocketStatus(
  statusId?: number | null,
  rawStatus?: string | null,
): { shipmentStatus: ShipmentStatus; fulfillmentStatus: OrderFulfillmentStatus; label: string } {
  const text = (rawStatus ?? "").trim().toLowerCase();

  // Check explicit numeric codes first where unambiguous
  if (statusId === 7 || text === "delivered") {
    return { shipmentStatus: "delivered", fulfillmentStatus: "delivered", label: "Delivered" };
  }
  if (statusId === 17 || text.includes("out for delivery")) {
    return { shipmentStatus: "out_for_delivery", fulfillmentStatus: "shipped", label: "Out for Delivery" };
  }
  if (statusId === 10 || text.includes("rto delivered") || text === "returned") {
    return { shipmentStatus: "returned", fulfillmentStatus: "cancelled", label: "Returned to Origin" };
  }
  if (statusId === 9 || statusId === 14 || text.includes("rto")) {
    return { shipmentStatus: "rto_initiated", fulfillmentStatus: "shipped", label: "Return to Origin Initiated" };
  }
  if (statusId === 8 || statusId === 16 || text.includes("cancel")) {
    return { shipmentStatus: "cancelled", fulfillmentStatus: "cancelled", label: "Cancelled" };
  }
  if (
    statusId === 12 ||
    statusId === 13 ||
    statusId === 20 ||
    statusId === 21 ||
    text.includes("undelivered") ||
    text.includes("lost") ||
    text.includes("damaged") ||
    text.includes("exception") ||
    text.includes("pickup error")
  ) {
    return {
      shipmentStatus: "exception",
      fulfillmentStatus: "shipped",
      label: rawStatus?.trim() || "Delivery Exception",
    };
  }
  if (
    statusId === 18 ||
    statusId === 22 ||
    statusId === 38 ||
    text.includes("in transit") ||
    text.includes("reached at destination") ||
    text.includes("dispatched") ||
    text.includes("delayed")
  ) {
    return { shipmentStatus: "in_transit", fulfillmentStatus: "shipped", label: rawStatus?.trim() || "In Transit" };
  }
  if (statusId === 6 || statusId === 42 || text.includes("shipped") || text.includes("picked up")) {
    return { shipmentStatus: "shipped", fulfillmentStatus: "shipped", label: "Shipped" };
  }
  if (
    statusId === 3 ||
    statusId === 4 ||
    statusId === 5 ||
    statusId === 15 ||
    statusId === 19 ||
    text.includes("pickup") ||
    text.includes("manifest")
  ) {
    return { shipmentStatus: "pickup_scheduled", fulfillmentStatus: "processing", label: "Pickup Scheduled" };
  }
  if (statusId === 2 || text.includes("awb") || text.includes("ready to ship") || text.includes("packed")) {
    return { shipmentStatus: "awb_assigned", fulfillmentStatus: "processing", label: "Packed & Ready to Ship" };
  }
  if (statusId === 1 || text === "new" || text === "created") {
    return { shipmentStatus: "created", fulfillmentStatus: "processing", label: "Order Synced" };
  }

  return {
    shipmentStatus: "pending",
    fulfillmentStatus: "processing",
    label: rawStatus?.trim() || "Preparing Dispatch",
  };
}

export const TRACKING_MILESTONES = [
  { key: "confirmed", title: "Order Confirmed", subtitle: "Order verified & queued" },
  { key: "packed", title: "Packed & Ready", subtitle: "AWB assigned & pickup scheduled" },
  { key: "shipped", title: "Shipped", subtitle: "Handed over to courier partner" },
  { key: "in_transit", title: "In Transit", subtitle: "Moving through courier hubs" },
  { key: "out_for_delivery", title: "Out for Delivery", subtitle: "Courier arriving at your address" },
  { key: "delivered", title: "Delivered", subtitle: "Parcel delivered safely" },
] as const;

export function shipmentMilestoneIndex(status: string): number {
  switch (status) {
    case "pending":
    case "created":
      return 0;
    case "awb_assigned":
    case "pickup_scheduled":
    case "packed":
      return 1;
    case "shipped":
      return 2;
    case "in_transit":
      return 3;
    case "out_for_delivery":
      return 4;
    case "delivered":
      return 5;
    default:
      return -1;
  }
}

export function normalizeTrackingScans(raw: unknown): TrackingScanEvent[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const events: TrackingScanEvent[] = [];

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;
    const obj = entry as Record<string, unknown>;
    const date = String(obj.date ?? obj.timestamp ?? obj.created_at ?? "").trim();
    const activity = String(obj.activity ?? obj["sr-status-label"] ?? obj.status ?? "").trim();
    const status = String(obj["sr-status-label"] ?? obj.status ?? activity).trim();
    const location = String(obj.location ?? obj.city ?? "").trim();
    if (!date && !activity) continue;
    const dedupeKey = `${date}|${activity}|${location}`.toLowerCase();
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    events.push({ date, status: status || activity, activity: activity || status, location });
  }

  return events.sort((a, b) => {
    const aMs = Date.parse(a.date);
    const bMs = Date.parse(b.date);
    if (Number.isFinite(aMs) && Number.isFinite(bMs)) return bMs - aMs;
    return 0;
  });
}

export function parseCourierOptions(
  rawCouriers: unknown,
  recommendedId?: number | null,
): {
  couriers: CourierOption[];
  recommendedCourier: CourierOption | null;
  fastestCourier: CourierOption | null;
  cheapestCourier: CourierOption | null;
} {
  if (!Array.isArray(rawCouriers)) {
    return { couriers: [], recommendedCourier: null, fastestCourier: null, cheapestCourier: null };
  }

  const couriers: CourierOption[] = [];
  for (const item of rawCouriers) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const id = Number(obj.courier_company_id ?? obj.id);
    const name = String(obj.courier_name ?? obj.name ?? "").trim();
    const rate = Number(obj.rate ?? obj.freight_charge ?? 0);
    if (!Number.isFinite(id) || id <= 0 || !name) continue;

    const rawDays = Number(obj.estimated_delivery_days);
    const estimatedDeliveryDays = Number.isFinite(rawDays) && rawDays > 0 ? Math.round(rawDays) : null;
    const rawRating = Number(obj.rating);
    const rating = Number.isFinite(rawRating) && rawRating > 0 ? Number(rawRating.toFixed(1)) : null;
    const modeVal = String(obj.mode ?? "").toLowerCase();
    const isAir = modeVal === "1" || modeVal === "air" || name.toLowerCase().includes("air");

    couriers.push({
      courierCompanyId: id,
      courierName: name,
      rate: Number.isFinite(rate) ? Math.round(rate) : 0,
      codCharges: Number.isFinite(Number(obj.cod_charges)) ? Math.round(Number(obj.cod_charges)) : 0,
      codAvailable: Number(obj.cod) === 1,
      etd: typeof obj.etd === "string" && obj.etd.trim() ? obj.etd.trim() : null,
      estimatedDeliveryDays,
      mode: isAir ? "Air" : "Surface",
      rating,
      isRecommended: recommendedId != null && id === recommendedId,
    });
  }

  couriers.sort((a, b) => {
    if (a.isRecommended !== b.isRecommended) return a.isRecommended ? -1 : 1;
    return a.rate - b.rate;
  });

  const recommendedCourier =
    couriers.find((c) => c.isRecommended) ?? couriers[0] ?? null;

  const cheapestCourier =
    couriers.length > 0
      ? couriers.reduce((best, cur) => (cur.rate < best.rate ? cur : best), couriers[0])
      : null;

  const withDays = couriers.filter((c) => c.estimatedDeliveryDays != null);
  const fastestCourier =
    withDays.length > 0
      ? withDays.reduce(
          (best, cur) =>
            (cur.estimatedDeliveryDays ?? 99) < (best.estimatedDeliveryDays ?? 99) ? cur : best,
          withDays[0],
        )
      : recommendedCourier;

  return { couriers, recommendedCourier, fastestCourier, cheapestCourier };
}

/**
 * Fallback delivery estimate used when Shiprocket credentials are not configured yet,
 * based on Indian postal zone distance from Maharashtra (40xxxx-44xxxx).
 */
export function estimateFallbackDelivery(pincode: string, now = new Date()): ServiceabilityResult {
  const clean = pincode.trim();
  const firstTwo = Number(clean.slice(0, 2));
  const isMaharashtra = firstTwo >= 40 && firstTwo <= 44;
  const isMetroWestSouth =
    (firstTwo >= 36 && firstTwo <= 39) ||
    (firstTwo >= 50 && firstTwo <= 56) ||
    (firstTwo >= 60 && firstTwo <= 64);

  const minDays = isMaharashtra ? 2 : isMetroWestSouth ? 4 : 5;
  const maxDays = isMaharashtra ? 4 : isMetroWestSouth ? 6 : 8;

  const eta = new Date(now.getTime() + maxDays * 24 * 60 * 60 * 1000);
  return {
    serviceable: true,
    pincode: clean,
    live: false,
    estimatedDeliveryDate: eta.toISOString(),
    estimatedDaysMin: minDays,
    estimatedDaysMax: maxDays,
    freeShipping: true,
    codAvailable: false,
    recommendedCourier: null,
    fastestCourier: null,
    cheapestCourier: null,
    couriers: [],
    message: `Standard insured delivery in ${minDays}–${maxDays} business days across India.`,
  };
}

/** Constant-time verification of Shiprocket's `x-api-key` webhook security token. */
export function verifyShiprocketWebhookToken(
  incomingToken: string | null | undefined,
  expectedToken: string | null | undefined,
): boolean {
  if (!incomingToken || !expectedToken) return false;
  const a = Buffer.from(incomingToken.trim(), "utf8");
  const b = Buffer.from(expectedToken.trim(), "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function formatShiprocketOrderDate(isoOrDate: string | Date = new Date()): string {
  const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${ist.getUTCFullYear()}-${pad(ist.getUTCMonth() + 1)}-${pad(ist.getUTCDate())} ${pad(ist.getUTCHours())}:${pad(ist.getUTCMinutes())}`;
}
