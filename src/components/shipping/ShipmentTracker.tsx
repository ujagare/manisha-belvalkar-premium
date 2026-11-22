"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  Clock3,
  MapPin,
  Package,
  RefreshCw,
  RotateCcw,
  Truck,
  X,
} from "lucide-react";
import {
  TRACKING_MILESTONES,
  shipmentMilestoneIndex,
  type TrackingScanEvent,
} from "@/lib/shiprocket-utils";

export interface ShipmentViewModel {
  orderRef: string;
  itemTitle?: string;
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
  destinationLabel?: string | null;
  scans: TrackingScanEvent[];
}

function formatIstDateTime(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const ms = Date.parse(raw);
  if (!Number.isFinite(ms)) return raw;
  return new Date(ms).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatIstDate(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const ms = Date.parse(raw);
  if (!Number.isFinite(ms)) return raw;
  return new Date(ms).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ShipmentTracker({
  shipment: initialShipment,
  canRefresh = true,
}: {
  shipment: ShipmentViewModel;
  canRefresh?: boolean;
}) {
  const [shipment, setShipment] = useState<ShipmentViewModel>(initialShipment);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const milestoneIdx = shipmentMilestoneIndex(shipment.status);
  const isSpecialState = ["rto_initiated", "returned", "cancelled", "exception"].includes(shipment.status);
  const etdLabel = formatIstDate(shipment.etd);
  const deliveredLabel = formatIstDateTime(shipment.deliveredAt);

  async function copyAwb() {
    if (!shipment.awbCode) return;
    try {
      await navigator.clipboard.writeText(shipment.awbCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable
    }
  }

  async function refreshLive() {
    if (!shipment.awbCode && !shipment.orderRef) return;
    setRefreshing(true);
    setRefreshError(null);
    try {
      const res = await fetch("/api/shipping/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          shipment.awbCode
            ? { awb: shipment.awbCode, sync: true }
            : { orderRef: shipment.orderRef, sync: true },
        ),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.tracking?.shipment) {
        throw new Error(data?.error?.message ?? "Could not refresh tracking right now.");
      }
      const next = data.tracking;
      setShipment({
        ...shipment,
        status: next.shipment.status,
        statusLabel: next.shipment.statusLabel,
        currentStatus: next.shipment.currentStatus,
        carrier: next.shipment.carrier,
        awbCode: next.shipment.awbCode,
        trackingUrl: next.shipment.trackingUrl,
        etd: next.shipment.etd,
        shippedAt: next.shipment.shippedAt,
        deliveredAt: next.shipment.deliveredAt,
        pickupScheduledDate: next.shipment.pickupScheduledDate,
        lastLocation: next.shipment.lastLocation,
        lastSyncedAt: next.shipment.lastSyncedAt,
        rtoReason: next.shipment.rtoReason,
        scans: next.shipment.scans ?? [],
      });
    } catch (err) {
      setRefreshError(err instanceof Error ? err.message : "Refresh failed.");
    } finally {
      setRefreshing(false);
    }
  }

  const statusTone =
    shipment.status === "delivered"
      ? "text-[#16a34a]"
      : shipment.status === "cancelled" || shipment.status === "returned"
        ? "text-warmgray"
        : shipment.status === "exception" || shipment.status === "rto_initiated"
          ? "text-[#b45309]"
          : "text-primary";

  const statusDot =
    shipment.status === "delivered"
      ? "bg-[#16a34a]"
      : shipment.status === "cancelled" || shipment.status === "returned"
        ? "bg-warmgray/60"
        : shipment.status === "exception" || shipment.status === "rto_initiated"
          ? "bg-[#b45309]"
          : "bg-primary";

  return (
    <div className="overflow-hidden rounded-xl border border-charcoal/10 bg-[#fdfbf7] shadow-[0_1px_2px_rgba(28,25,23,0.05)] sm:rounded-2xl">
      {/* Header summary */}
      <div className="border-b border-charcoal/10 bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div>
            <p className="font-mono text-xs tabular-nums text-warmgray">
              Order #{shipment.orderRef}
            </p>
            <h2 className="mt-1 font-display text-xl font-medium tracking-[-0.015em] text-charcoal sm:mt-1.5 sm:text-3xl">
              {shipment.statusLabel}
            </h2>
            {shipment.currentStatus && shipment.currentStatus.toLowerCase() !== shipment.statusLabel.toLowerCase() ? (
              <p className="mt-1 text-xs text-warmgray sm:text-sm">{shipment.currentStatus}</p>
            ) : null}
          </div>

          <span className={`inline-flex items-center gap-1.5 text-xs font-medium capitalize sm:gap-2 sm:text-sm ${statusTone}`}>
            <span className={`h-2 w-2 rounded-full ${statusDot}`} />
            {shipment.status.replaceAll("_", " ")}
          </span>
        </div>

        {/* Key logistics metrics — compact 2-col on mobile, 3-col on desktop */}
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-charcoal/8 pt-4 sm:mt-6 sm:grid-cols-3 sm:gap-4 sm:pt-5">
          <div>
            <p className="text-[11px] text-warmgray sm:text-xs">
              {shipment.status === "delivered" ? "Delivered on" : "Estimated delivery"}
            </p>
            <p className="mt-0.5 text-xs font-medium tabular-nums text-charcoal sm:mt-1 sm:text-sm">
              {shipment.status === "delivered"
                ? deliveredLabel ?? "Delivered"
                : etdLabel ?? "Confirmed at dispatch"}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-warmgray sm:text-xs">Courier partner</p>
            <p className="mt-0.5 text-xs font-medium text-charcoal sm:mt-1 sm:text-sm">
              {shipment.carrier ?? "Assigning via Shiprocket"}
            </p>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-[11px] text-warmgray sm:text-xs">AWB tracking number</p>
            {shipment.awbCode ? (
              <div className="mt-0.5 flex items-center gap-2 sm:mt-1">
                <span className="truncate font-mono text-xs font-medium tabular-nums text-charcoal sm:text-sm">
                  {shipment.awbCode}
                </span>
                <button
                  type="button"
                  onClick={copyAwb}
                  aria-label="Copy AWB number"
                  className="inline-flex h-6 items-center justify-center rounded border border-charcoal/12 bg-ivory px-2 text-xs font-medium text-charcoal transition-colors duration-150 hover:bg-parchment"
                >
                  {copied ? <Check className="h-3.5 w-3.5" strokeWidth={1.5} /> : "Copy"}
                </button>
              </div>
            ) : (
              <p className="mt-0.5 text-xs text-warmgray sm:mt-1 sm:text-sm">Generated at dispatch</p>
            )}
          </div>
        </div>

        {shipment.lastLocation || shipment.destinationLabel ? (
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-charcoal/8 pt-4 text-sm text-warmgray">
            {shipment.lastLocation ? (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-warmgray" strokeWidth={1.5} />
                Latest hub: <span className="font-medium text-charcoal">{shipment.lastLocation}</span>
              </span>
            ) : null}
            {shipment.destinationLabel ? (
              <span className="inline-flex items-center gap-2">
                <Truck className="h-4 w-4 text-warmgray" strokeWidth={1.5} />
                Destination: <span className="font-medium text-charcoal">{shipment.destinationLabel}</span>
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Special alert states */}
      {isSpecialState ? (
        <div className="border-b border-charcoal/10 bg-[#faf3dc]/60 px-6 py-4">
          <div className="flex items-start gap-3">
            {shipment.status === "cancelled" ? (
              <X className="mt-0.5 h-4 w-4 shrink-0 text-warmgray" strokeWidth={1.5} />
            ) : shipment.status === "returned" || shipment.status === "rto_initiated" ? (
              <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-charcoal" strokeWidth={1.5} />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
            )}
            <div className="text-sm">
              <p className="font-medium text-charcoal">{shipment.statusLabel}</p>
              <p className="mt-1 text-sm leading-6 text-warmgray">
                {shipment.rtoReason
                  ? `Courier note: ${shipment.rtoReason}`
                  : shipment.status === "cancelled"
                    ? "This shipment was cancelled. Contact our team on WhatsApp if you need assistance."
                    : "The courier reported a delivery exception or return-to-origin event. Our team can help arrange redelivery."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Signature vermilion-ink 6-stage delivery route rail */
        <div className="border-b border-charcoal/10 px-4 py-4 sm:px-6 sm:py-6">
          <p className="text-xs font-medium text-charcoal sm:text-sm">Delivery route</p>
          <ol className="mt-4 grid gap-2.5 sm:mt-5 sm:grid-cols-6 sm:gap-2">
            {TRACKING_MILESTONES.map((step, index) => {
              const complete = milestoneIdx >= index;
              const active = milestoneIdx === index;
              return (
                <li
                  key={step.key}
                  className="relative flex items-start gap-3 sm:flex-col sm:items-center sm:text-center"
                >
                  {index < TRACKING_MILESTONES.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className={`hidden sm:block absolute left-[calc(50%+1rem)] right-[calc(-50%+1rem)] top-3.5 h-px ${
                        milestoneIdx > index ? "bg-primary" : "bg-charcoal/15"
                      }`}
                    />
                  ) : null}
                  <span
                    className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-mono tabular-nums transition-colors duration-150 ${
                      active
                        ? "border-primary bg-primary text-white"
                        : complete
                          ? "border-primary bg-white text-primary"
                          : "border-charcoal/15 bg-ivory text-warmgray"
                    }`}
                  >
                    {complete ? <Check className="h-3.5 w-3.5" strokeWidth={1.75} /> : index + 1}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`text-xs ${
                        active
                          ? "font-medium text-primary"
                          : complete
                            ? "font-medium text-charcoal"
                            : "text-warmgray"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs text-warmgray sm:hidden">{step.subtitle}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* Activity scan history */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-medium text-charcoal">Courier scan history</h3>
            {shipment.lastSyncedAt ? (
              <p className="mt-0.5 font-mono text-xs tabular-nums text-warmgray">
                Synced {formatIstDateTime(shipment.lastSyncedAt)} IST
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {canRefresh && (shipment.awbCode || shipment.orderRef) ? (
              <button
                type="button"
                onClick={refreshLive}
                disabled={refreshing}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-charcoal/12 bg-white px-3.5 text-sm font-medium text-charcoal transition-colors duration-150 hover:bg-ivory active:scale-[0.98] disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} strokeWidth={1.5} />
                {refreshing ? "Syncing" : "Refresh"}
              </button>
            ) : null}
            {shipment.trackingUrl ? (
              <a
                href={shipment.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-dark"
              >
                Shiprocket page
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
              </a>
            ) : null}
          </div>
        </div>

        {refreshError ? (
          <p
            className="mt-4 rounded-lg border border-primary/20 bg-primary-soft px-3.5 py-2.5 text-sm text-primary"
            role="alert"
          >
            {refreshError}
          </p>
        ) : null}

        {shipment.scans.length > 0 ? (
          <ol className="mt-5 space-y-0">
            {shipment.scans.map((scan, idx) => (
              <li key={`${scan.date}-${idx}`} className="grid grid-cols-[1.25rem_1fr] gap-3">
                <div className="flex flex-col items-center">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 rounded-full ${
                      idx === 0 ? "bg-primary" : "bg-charcoal/25"
                    }`}
                  />
                  {idx < shipment.scans.length - 1 ? (
                    <span className="my-1 w-px flex-1 bg-charcoal/12" />
                  ) : null}
                </div>
                <div className="pb-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className={`text-sm ${idx === 0 ? "font-medium text-charcoal" : "text-ink"}`}>
                      {scan.activity}
                    </p>
                    <span className="font-mono text-xs tabular-nums text-warmgray">
                      {formatIstDateTime(scan.date) ?? scan.date}
                    </span>
                  </div>
                  {scan.location ? (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-warmgray">
                      <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                      {scan.location}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-charcoal/8 bg-ivory p-4 text-sm leading-6 text-warmgray">
            {shipment.awbCode ? (
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-warmgray" strokeWidth={1.5} />
            ) : (
              <Package className="mt-0.5 h-4 w-4 shrink-0 text-warmgray" strokeWidth={1.5} />
            )}
            <p>
              {shipment.awbCode
                ? "AWB assigned. Detailed hub scans appear here once the courier scans the parcel at pickup."
                : "Order confirmed and being prepared at our studio. AWB and courier scans will appear here once dispatch is scheduled."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
