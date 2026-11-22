"use client";

import { useState, useTransition } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Download,
  Loader2,
  Package,
  Pencil,
  RefreshCw,
  Send,
  Truck,
  X,
} from "lucide-react";
import type { CourierOption } from "@/lib/shiprocket-utils";

export interface AdminOrderShipmentRow {
  orderId: string;
  orderRef: string;
  itemTitle: string;
  amount: number | null;
  currency: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  addressText: string;
  pincode: string | null;
  shipment: {
    id: string;
    status: string;
    currentStatus: string | null;
    shiprocketOrderId: number | null;
    shiprocketShipmentId: number | null;
    carrier: string | null;
    awbCode: string | null;
    trackingUrl: string | null;
    pickupLocation: string | null;
    pickupScheduledDate: string | null;
    etd: string | null;
    weightKg: number;
    lengthCm: number;
    breadthCm: number;
    heightCm: number;
    labelUrl: string | null;
    manifestUrl: string | null;
    invoiceUrl: string | null;
    lastLocation: string | null;
  } | null;
}

export default function ShipmentControlCard({
  row,
  shiprocketReady,
}: {
  row: AdminOrderShipmentRow;
  shiprocketReady: boolean;
}) {
  const [shipment, setShipment] = useState(row.shipment);
  const [weightKg, setWeightKg] = useState(String(row.shipment?.weightKg ?? 0.5));
  const [lengthCm, setLengthCm] = useState(String(row.shipment?.lengthCm ?? 20));
  const [breadthCm, setBreadthCm] = useState(String(row.shipment?.breadthCm ?? 15));
  const [heightCm, setHeightCm] = useState(String(row.shipment?.heightCm ?? 6));

  const [couriers, setCouriers] = useState<CourierOption[]>([]);
  const [selectedCourierId, setSelectedCourierId] = useState<string>("");
  const [loadingCouriers, setLoadingCouriers] = useState(false);

  const [showManual, setShowManual] = useState(false);
  const [manualCarrier, setManualCarrier] = useState(row.shipment?.carrier ?? "");
  const [manualAwb, setManualAwb] = useState(row.shipment?.awbCode ?? "");
  const [manualStatus, setManualStatus] = useState(row.shipment?.status ?? "shipped");
  const [manualLocation, setManualLocation] = useState(row.shipment?.lastLocation ?? "");
  const [manualNote, setManualNote] = useState("");

  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function syncFromResponse(s: Record<string, unknown> | undefined) {
    if (!s) return;
    setShipment({
      id: String(s.id ?? shipment?.id ?? ""),
      status: String(s.status ?? "pending"),
      currentStatus: (s.current_status as string | null) ?? null,
      shiprocketOrderId: (s.shiprocket_order_id as number | null) ?? null,
      shiprocketShipmentId: (s.shiprocket_shipment_id as number | null) ?? null,
      carrier: (s.carrier as string | null) ?? null,
      awbCode: (s.awb_code as string | null) ?? (s.tracking_number as string | null) ?? null,
      trackingUrl: (s.tracking_url as string | null) ?? null,
      pickupLocation: (s.pickup_location as string | null) ?? null,
      pickupScheduledDate: (s.pickup_scheduled_date as string | null) ?? null,
      etd: (s.etd as string | null) ?? null,
      weightKg: Number(s.weight_kg ?? weightKg),
      lengthCm: Number(s.length_cm ?? lengthCm),
      breadthCm: Number(s.breadth_cm ?? breadthCm),
      heightCm: Number(s.height_cm ?? heightCm),
      labelUrl: (s.label_url as string | null) ?? null,
      manifestUrl: (s.manifest_url as string | null) ?? null,
      invoiceUrl: (s.invoice_url as string | null) ?? null,
      lastLocation: (s.last_location as string | null) ?? null,
    });
  }

  function runAction(action: string, extra?: Record<string, unknown>, openUrl?: boolean) {
    setFeedback(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/shipments/${row.orderId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, ...extra }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error?.message ?? "Action failed.");
        }
        syncFromResponse(data?.shipment);
        if (openUrl && typeof data?.url === "string") {
          window.open(data.url, "_blank", "noopener,noreferrer");
        }
        setFeedback({ kind: "ok", text: `Updated (${action.replaceAll("_", " ")})` });
      } catch (err) {
        setFeedback({
          kind: "err",
          text: err instanceof Error ? err.message : "Could not complete action.",
        });
      }
    });
  }

  async function loadCouriers() {
    setLoadingCouriers(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/shipments/${row.orderId}`);
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error?.message ?? "Could not fetch couriers.");
      const list = (data?.serviceability?.couriers ?? []) as CourierOption[];
      setCouriers(list);
      if (data?.serviceability?.recommendedCourier) {
        setSelectedCourierId(String(data.serviceability.recommendedCourier.courierCompanyId));
      }
      if (!list.length) {
        setFeedback({
          kind: "err",
          text: data?.serviceability?.message ?? "No live couriers returned.",
        });
      }
    } catch (err) {
      setFeedback({ kind: "err", text: err instanceof Error ? err.message : "Courier check failed." });
    } finally {
      setLoadingCouriers(false);
    }
  }

  const status = shipment?.status ?? "pending";
  const isFinal = ["delivered", "cancelled", "returned"].includes(status);

  return (
    <article className="rounded-2xl sm:rounded-3xl border border-parchment bg-white p-5 sm:p-6 shadow-[0_12px_36px_-26px_rgba(28,25,23,0.22)]">
      {/* Top Order Row */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-parchment pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal">
              #{row.orderRef}
            </span>
            <span className="rounded-full bg-ivory px-2.5 py-0.5 text-[11px] font-semibold capitalize text-warmgray ring-1 ring-parchment">
              Pay: {row.paymentStatus}
            </span>
            {shipment?.shiprocketOrderId ? (
              <span className="rounded-full bg-gold-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold text-gold-deep">
                SR #{shipment.shiprocketOrderId}
              </span>
            ) : null}
          </div>
          <h2 className="mt-2 font-display text-lg sm:text-xl font-bold text-charcoal">
            {row.itemTitle}
          </h2>
          <p className="mt-1 text-xs text-warmgray">
            {row.customerName} · {row.customerEmail} ·{" "}
            {new Date(row.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
            status === "delivered"
              ? "bg-green-100 text-green-800"
              : status === "cancelled" || status === "returned"
                ? "bg-ink/10 text-warmgray"
                : status === "exception" || status === "rto_initiated"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-primary-soft text-primary"
          }`}
        >
          {status.replaceAll("_", " ")}
        </span>
      </div>

      {/* Address & Current Tracking Summary */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
        <div className="rounded-xl bg-ivory/75 p-3.5">
          <p className="font-semibold uppercase tracking-wider text-[10px] text-warmgray">Delivery Address</p>
          <p className="mt-1 leading-5 text-charcoal">{row.addressText || "No address linked"}</p>
        </div>
        <div className="rounded-xl bg-ivory/75 p-3.5">
          <p className="font-semibold uppercase tracking-wider text-[10px] text-warmgray">Courier &amp; AWB</p>
          <p className="mt-1 font-semibold text-charcoal">
            {shipment?.carrier ?? "Not assigned yet"}
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-warmgray">
            AWB: {shipment?.awbCode ?? "—"}
          </p>
          {shipment?.lastLocation ? (
            <p className="mt-0.5 text-[11px] text-warmgray">Hub: {shipment.lastLocation}</p>
          ) : null}
        </div>
      </div>

      {/* Step 1: Parcel Dimensions & Push to Shiprocket */}
      {!shipment?.shiprocketOrderId && !isFinal ? (
        <div className="mt-4 rounded-xl border border-parchment bg-ivory/40 p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal">
            Parcel Specs (kg / cm)
          </p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {[
              ["Wt (kg)", weightKg, setWeightKg],
              ["L (cm)", lengthCm, setLengthCm],
              ["B (cm)", breadthCm, setBreadthCm],
              ["H (cm)", heightCm, setHeightCm],
            ].map(([label, val, setter]) => (
              <label key={label as string} className="block text-[10px] text-warmgray">
                {label as string}
                <input
                  type="number"
                  step="0.05"
                  value={val as string}
                  onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-parchment bg-white px-2 text-xs font-semibold text-charcoal"
                />
              </label>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={pending || !shiprocketReady}
              onClick={() =>
                runAction("push", {
                  weightKg: Number(weightKg),
                  lengthCm: Number(lengthCm),
                  breadthCm: Number(breadthCm),
                  heightCm: Number(heightCm),
                  autoAssignAwb: false,
                })
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50"
            >
              {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Package className="h-3.5 w-3.5" />}
              Push to Shiprocket
            </button>
            <button
              type="button"
              disabled={pending || !shiprocketReady}
              onClick={() =>
                runAction("push", {
                  weightKg: Number(weightKg),
                  lengthCm: Number(lengthCm),
                  breadthCm: Number(breadthCm),
                  heightCm: Number(heightCm),
                  autoAssignAwb: true,
                })
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gold bg-gold-soft px-4 text-xs font-semibold text-gold-deep transition hover:bg-gold/30 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              Push + Auto-Assign AWB
            </button>
          </div>
        </div>
      ) : null}

      {/* Step 2: Courier Selection & AWB Assignment */}
      {shipment?.shiprocketOrderId && !shipment.awbCode && !isFinal ? (
        <div className="mt-4 rounded-xl border border-gold/40 bg-gold-soft/40 p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-charcoal">Assign Courier &amp; Generate AWB</p>
            <button
              type="button"
              onClick={loadCouriers}
              disabled={loadingCouriers || !shiprocketReady}
              className="inline-flex h-8 items-center gap-1 rounded-full bg-white px-3 text-[11px] font-semibold text-primary ring-1 ring-parchment hover:border-gold disabled:opacity-50"
            >
              {loadingCouriers ? <Loader2 className="h-3 w-3 animate-spin" /> : <Truck className="h-3 w-3" />}
              Check Live Rates
            </button>
          </div>

          {couriers.length > 0 ? (
            <select
              value={selectedCourierId}
              onChange={(e) => setSelectedCourierId(e.target.value)}
              className="mt-2.5 h-10 w-full rounded-xl border border-parchment bg-white px-3 text-xs font-medium text-charcoal"
            >
              <option value="">Shiprocket Auto-Recommended Courier</option>
              {couriers.map((c) => (
                <option key={c.courierCompanyId} value={c.courierCompanyId}>
                  {c.courierName} · ₹{c.rate} · {c.estimatedDeliveryDays ? `${c.estimatedDeliveryDays}d` : c.mode}
                  {c.rating ? ` · ${c.rating}★` : ""}
                  {c.isRecommended ? " (Recommended)" : ""}
                </option>
              ))}
            </select>
          ) : null}

          <button
            type="button"
            disabled={pending || !shiprocketReady}
            onClick={() =>
              runAction("assign_awb", {
                courierId: selectedCourierId ? Number(selectedCourierId) : null,
              })
            }
            className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
            Generate AWB Now
          </button>
        </div>
      ) : null}

      {/* Step 3: Post-AWB Operations (Pickup, Label, Manifest, Invoice, Sync, Cancel) */}
      <div className="mt-4 flex flex-wrap gap-2">
        {shipment?.awbCode && status === "awb_assigned" && shiprocketReady ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => runAction("schedule_pickup")}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            <Truck className="h-3.5 w-3.5" />
            Schedule Pickup
          </button>
        ) : null}

        {shipment?.shiprocketShipmentId && shipment.awbCode && shiprocketReady ? (
          <>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                shipment.labelUrl
                  ? window.open(shipment.labelUrl, "_blank", "noopener,noreferrer")
                  : runAction("generate_label", undefined, true)
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-parchment bg-ivory px-3.5 text-xs font-semibold text-charcoal hover:border-gold hover:text-primary"
            >
              <Download className="h-3.5 w-3.5" />
              Label PDF
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                shipment.manifestUrl
                  ? window.open(shipment.manifestUrl, "_blank", "noopener,noreferrer")
                  : runAction("generate_manifest", undefined, true)
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-parchment bg-ivory px-3.5 text-xs font-semibold text-charcoal hover:border-gold hover:text-primary"
            >
              <Download className="h-3.5 w-3.5" />
              Manifest PDF
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                shipment.invoiceUrl
                  ? window.open(shipment.invoiceUrl, "_blank", "noopener,noreferrer")
                  : runAction("generate_invoice", undefined, true)
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-parchment bg-ivory px-3.5 text-xs font-semibold text-charcoal hover:border-gold hover:text-primary"
            >
              <Download className="h-3.5 w-3.5" />
              SR Invoice
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => runAction("sync_tracking")}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-parchment bg-ivory px-3.5 text-xs font-semibold text-charcoal hover:border-gold hover:text-primary"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${pending ? "animate-spin" : ""}`} />
              Sync Tracking
            </button>
          </>
        ) : null}

        {shipment?.trackingUrl ? (
          <a
            href={shipment.trackingUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-gold/40 bg-gold-soft/50 px-3.5 text-xs font-semibold text-gold-deep hover:bg-gold-soft"
          >
            Live Track
            <ArrowUpRight className="h-3 w-3" />
          </a>
        ) : null}

        <button
          type="button"
          onClick={() => setShowManual((v) => !v)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-parchment bg-white px-3.5 text-xs font-semibold text-warmgray hover:border-gold hover:text-charcoal"
        >
          <Pencil className="h-3.5 w-3.5" />
          {showManual ? "Hide Manual Update" : "Manual / Status Update"}
        </button>

        {!isFinal ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (window.confirm(`Cancel shipment for order #${row.orderRef}?`)) {
                runAction("cancel");
              }
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-primary/20 bg-primary-soft/60 px-3.5 text-xs font-semibold text-primary hover:bg-primary-soft"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
        ) : null}
      </div>

      {/* Manual Override Form (also works before Shiprocket API keys are configured) */}
      {showManual ? (
        <div className="mt-4 grid gap-3 rounded-2xl border border-parchment bg-ivory/50 p-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-charcoal">Courier Partner</label>
            <input
              value={manualCarrier}
              onChange={(e) => setManualCarrier(e.target.value)}
              placeholder="e.g. Blue Dart Air / Delhivery"
              className="h-10 w-full rounded-xl border border-parchment bg-white px-3 text-xs"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-charcoal">AWB / Tracking No.</label>
            <input
              value={manualAwb}
              onChange={(e) => setManualAwb(e.target.value)}
              placeholder="e.g. 19041234567890"
              className="h-10 w-full rounded-xl border border-parchment bg-white px-3 font-mono text-xs"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-charcoal">Shipment Status</label>
            <select
              value={manualStatus}
              onChange={(e) => setManualStatus(e.target.value)}
              className="h-10 w-full rounded-xl border border-parchment bg-white px-3 text-xs"
            >
              <option value="pending">Pending</option>
              <option value="packed">Packed &amp; Ready</option>
              <option value="awb_assigned">AWB Assigned</option>
              <option value="pickup_scheduled">Pickup Scheduled</option>
              <option value="shipped">Shipped (sends dispatch email)</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery (sends OFD email)</option>
              <option value="delivered">Delivered (sends delivery email)</option>
              <option value="rto_initiated">RTO Initiated</option>
              <option value="returned">Returned</option>
              <option value="exception">Exception</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold text-charcoal">Current Hub / City</label>
            <input
              value={manualLocation}
              onChange={(e) => setManualLocation(e.target.value)}
              placeholder="e.g. Pune Hub / Mumbai"
              className="h-10 w-full rounded-xl border border-parchment bg-white px-3 text-xs"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-[11px] font-semibold text-charcoal">Scan Note (shown in customer timeline)</label>
            <input
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              placeholder="e.g. Dispatched via Blue Dart from Pune studio"
              className="h-10 w-full rounded-xl border border-parchment bg-white px-3 text-xs"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                runAction("manual_update", {
                  carrier: manualCarrier,
                  awbCode: manualAwb,
                  status: manualStatus,
                  location: manualLocation,
                  note: manualNote,
                })
              }
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-xs font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Save Tracking Update
            </button>
          </div>
        </div>
      ) : null}

      {feedback ? (
        <p
          className={`mt-3 rounded-xl px-3.5 py-2 text-xs font-medium ${
            feedback.kind === "ok"
              ? "bg-green-50 text-green-800"
              : "bg-primary-soft text-primary"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}
    </article>
  );
}
