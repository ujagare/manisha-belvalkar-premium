"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Loader2,
  MessageCircle,
  Package,
  Search,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { brand } from "@/lib/data";
import ShipmentTracker, { type ShipmentViewModel } from "@/components/shipping/ShipmentTracker";

interface TrackOrderClientProps {
  initialAwb?: string;
  initialOrderRef?: string;
}

export default function TrackOrderClient({
  initialAwb = "",
  initialOrderRef = "",
}: TrackOrderClientProps) {
  const [mode, setMode] = useState<"awb" | "order">(initialOrderRef && !initialAwb ? "order" : "awb");
  const [awb, setAwb] = useState(initialAwb);
  const [orderRef, setOrderRef] = useState(initialOrderRef);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShipmentViewModel | null>(null);

  const runSearch = useCallback(
    async (payload: { awb?: string; orderRef?: string; email?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/shipping/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.tracking?.shipment) {
          throw new Error(data?.error?.message ?? "Could not locate shipment details.");
        }
        const t = data.tracking;
        const destinationLabel = [t.destinationCity, t.destinationState, t.destinationPincode]
          .filter(Boolean)
          .join(", ");
        setResult({
          orderRef: t.orderRef,
          itemTitle: t.itemTitle,
          status: t.shipment.status,
          statusLabel: t.shipment.statusLabel,
          currentStatus: t.shipment.currentStatus,
          carrier: t.shipment.carrier,
          awbCode: t.shipment.awbCode,
          trackingUrl: t.shipment.trackingUrl,
          etd: t.shipment.etd,
          shippedAt: t.shipment.shippedAt,
          deliveredAt: t.shipment.deliveredAt,
          pickupScheduledDate: t.shipment.pickupScheduledDate,
          lastLocation: t.shipment.lastLocation,
          lastSyncedAt: t.shipment.lastSyncedAt,
          rtoReason: t.shipment.rtoReason,
          destinationLabel: destinationLabel || null,
          scans: t.shipment.scans ?? [],
        });
      } catch (err) {
        setResult(null);
        setError(err instanceof Error ? err.message : "Could not track order.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!initialAwb) return;
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        void runSearch({ awb: initialAwb });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [initialAwb, runSearch]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "awb") {
      if (!awb.trim()) {
        setError("Enter your AWB tracking number.");
        return;
      }
      void runSearch({ awb: awb.trim() });
    } else {
      if (!orderRef.trim()) {
        setError("Enter your 8-character order reference.");
        return;
      }
      void runSearch({ orderRef: orderRef.trim(), email: email.trim() || undefined });
    }
  }

  const supportHref = `${brand.whatsappHref.split("?")[0]}?text=${encodeURIComponent(
    `Namaste Manisha ji, I need tracking help for ${result?.awbCode ? `AWB ${result.awbCode}` : result?.orderRef ? `Order #${result.orderRef}` : "my order"}.`,
  )}`;

  const inputClass =
    "h-11 w-full rounded-lg border border-charcoal/12 bg-white px-3.5 text-sm text-charcoal outline-none transition-colors duration-150 placeholder:text-warmgray/60 focus:border-charcoal/40 focus:ring-2 focus:ring-charcoal/10";

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Lookup panel */}
      <div className="rounded-xl border border-charcoal/10 bg-[#fdfbf7] p-4 shadow-[0_1px_2px_rgba(28,25,23,0.05)] sm:rounded-2xl sm:p-6">
        {/* Segmented control */}
        <div className="inline-flex rounded-lg border border-charcoal/10 bg-ivory p-1">
          <button
            type="button"
            onClick={() => {
              setMode("awb");
              setError(null);
            }}
            className={`h-8 rounded-md px-3.5 text-sm font-medium transition-colors duration-150 ${
              mode === "awb"
                ? "bg-white text-charcoal shadow-[0_1px_2px_rgba(28,25,23,0.06)]"
                : "text-warmgray hover:text-charcoal"
            }`}
          >
            AWB number
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("order");
              setError(null);
            }}
            className={`h-8 rounded-md px-3.5 text-sm font-medium transition-colors duration-150 ${
              mode === "order"
                ? "bg-white text-charcoal shadow-[0_1px_2px_rgba(28,25,23,0.06)]"
                : "text-warmgray hover:text-charcoal"
            }`}
          >
            Order reference
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          {mode === "awb" ? (
            <div>
              <label htmlFor="track-awb" className="mb-2 block text-sm font-medium text-charcoal">
                AWB tracking number
              </label>
              <input
                id="track-awb"
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
                placeholder="19041234567890"
                className={`${inputClass} font-mono tabular-nums`}
              />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="track-order-ref" className="mb-2 block text-sm font-medium text-charcoal">
                  Order reference
                </label>
                <input
                  id="track-order-ref"
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  placeholder="A1B2C3D4"
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label htmlFor="track-email" className="mb-2 block text-sm font-medium text-charcoal">
                  Order email
                </label>
                <input
                  id="track-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
            ) : (
              <Search className="h-4 w-4" strokeWidth={1.5} />
            )}
            {loading ? "Checking" : "Track parcel"}
          </button>
        </form>

        {error ? (
          <div
            role="alert"
            className="mt-4 flex items-start gap-2.5 rounded-lg border border-primary/20 bg-primary-soft px-4 py-3 text-sm text-primary"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span>{error}</span>
          </div>
        ) : null}

        <p className="mt-4 text-sm text-warmgray">
          Have an account? View all orders inside{" "}
          <Link href="/account" className="font-medium text-charcoal underline underline-offset-4 hover:text-primary">
            My account
          </Link>
        </p>
      </div>

      {/* Live tracking result or quiet assurances */}
      {result ? (
        <div className="space-y-4">
          {result.itemTitle ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-charcoal/10 bg-[#fdfbf7] px-5 py-3.5 text-sm">
              <div className="flex items-center gap-2.5">
                <Package className="h-4 w-4 text-warmgray" strokeWidth={1.5} />
                <span className="font-medium text-charcoal">{result.itemTitle}</span>
              </div>
              <a
                href={supportHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-warmgray transition-colors duration-150 hover:text-primary"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                WhatsApp delivery help
              </a>
            </div>
          ) : null}
          <ShipmentTracker shipment={result} />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          <div className="rounded-xl border border-charcoal/10 bg-[#fdfbf7] p-4 sm:rounded-2xl sm:p-6">
            <Truck className="h-4 w-4 text-warmgray" strokeWidth={1.5} />
            <h2 className="mt-2.5 text-sm font-medium text-charcoal sm:mt-4 sm:text-base">Shiprocket network</h2>
            <p className="mt-1 text-xs leading-5 text-warmgray sm:mt-2 sm:text-sm sm:leading-6">
              Dispatched through Blue Dart, Delhivery, Xpressbees, and DTDC with hub-by-hub scan timestamps.
            </p>
          </div>
          <div className="rounded-xl border border-charcoal/10 bg-[#fdfbf7] p-4 sm:rounded-2xl sm:p-6">
            <ShieldCheck className="h-4 w-4 text-warmgray" strokeWidth={1.5} />
            <h2 className="mt-2.5 text-sm font-medium text-charcoal sm:mt-4 sm:text-base">Milestone updates</h2>
            <p className="mt-1 text-xs leading-5 text-warmgray sm:mt-2 sm:text-sm sm:leading-6">
              Automatic email notifications when your parcel is dispatched, out for delivery, and delivered.
            </p>
          </div>
          <div className="rounded-xl border border-charcoal/10 bg-[#fdfbf7] p-4 sm:rounded-2xl sm:p-6">
            <MessageCircle className="h-4 w-4 text-warmgray" strokeWidth={1.5} />
            <h2 className="mt-2.5 text-sm font-medium text-charcoal sm:mt-4 sm:text-base">Direct support</h2>
            <p className="mt-1 text-xs leading-5 text-warmgray sm:mt-2 sm:text-sm sm:leading-6">
              Need an address correction or transit check? Reach our dispatch desk on{" "}
              <a href={supportHref} target="_blank" rel="noreferrer" className="font-medium text-charcoal underline underline-offset-4 hover:text-primary">
                WhatsApp
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
