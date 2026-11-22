"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MapPin,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import type { ServiceabilityResult } from "@/lib/shiprocket-utils";

interface PincodeCheckerProps {
  productSlug?: string;
  quantity?: number;
  weightKg?: number;
  /** When provided (e.g. from Checkout address), auto-checks whenever a valid 6-digit PIN is entered/selected. */
  autoPincode?: string;
  compact?: boolean;
  onResult?: (result: ServiceabilityResult | null) => void;
}

export default function PincodeChecker({
  productSlug,
  quantity = 1,
  weightKg,
  autoPincode,
  compact = false,
  onResult,
}: PincodeCheckerProps) {
  const [pincode, setPincode] = useState(autoPincode ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ServiceabilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastCheckedRef = useRef<string>("");

  const checkPincode = useCallback(
    async (rawPin: string) => {
      const clean = rawPin.trim();
      if (!/^[1-9][0-9]{5}$/.test(clean)) {
        setError("Enter a valid 6-digit Indian PIN code.");
        setResult(null);
        onResult?.(null);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ pincode: clean });
        if (productSlug) params.set("slug", productSlug);
        if (quantity > 1) params.set("quantity", String(quantity));
        if (weightKg && weightKg > 0) params.set("weight", String(weightKg));

        const res = await fetch(`/api/shipping/serviceability?${params.toString()}`);
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error?.message ?? "Could not check delivery for this PIN code.");
        }
        setResult(data as ServiceabilityResult);
        lastCheckedRef.current = `${clean}|${productSlug ?? ""}|${quantity}|${weightKg ?? ""}`;
        onResult?.(data as ServiceabilityResult);
      } catch (err) {
        setResult(null);
        onResult?.(null);
        setError(err instanceof Error ? err.message : "Could not check delivery right now.");
      } finally {
        setLoading(false);
      }
    },
    [productSlug, quantity, weightKg, onResult],
  );

  const displayPincode = autoPincode !== undefined ? autoPincode.trim() : pincode;
  const hasValidAutoPin = autoPincode === undefined || /^[1-9][0-9]{5}$/.test(displayPincode);
  const activeResult = hasValidAutoPin ? result : null;
  const activeError = hasValidAutoPin ? error : null;

  useEffect(() => {
    if (autoPincode === undefined) return;
    const clean = autoPincode.trim();
    const cacheKey = `${clean}|${productSlug ?? ""}|${quantity}|${weightKg ?? ""}`;
    if (!/^[1-9][0-9]{5}$/.test(clean)) {
      lastCheckedRef.current = "";
      onResult?.(null);
      return;
    }
    if (cacheKey === lastCheckedRef.current) return;

    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) {
        void checkPincode(clean);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [autoPincode, productSlug, quantity, weightKg, checkPincode, onResult]);

  const etaFormatted =
    activeResult?.estimatedDeliveryDate && Number.isFinite(Date.parse(activeResult.estimatedDeliveryDate))
      ? new Date(activeResult.estimatedDeliveryDate).toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      : null;

  return (
    <div
      className={
        compact
          ? "rounded-xl border border-charcoal/10 bg-ivory p-4"
          : "rounded-2xl border border-charcoal/10 bg-[#fdfbf7] p-5 shadow-[0_1px_2px_rgba(28,25,23,0.05)]"
      }
    >
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-medium text-charcoal">
          <Truck className="h-4 w-4 text-warmgray" strokeWidth={1.5} />
          Delivery availability
        </p>
        <span className="font-mono text-xs text-warmgray">Shiprocket</span>
      </div>

      {autoPincode === undefined ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void checkPincode(pincode);
          }}
          className="mt-3 flex gap-2"
        >
          <div className="relative flex-1">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-warmgray" strokeWidth={1.5} />
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={pincode}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
                setPincode(digits);
                if (error) setError(null);
              }}
              placeholder="6-digit PIN code"
              aria-label="Delivery PIN code"
              className="h-11 w-full rounded-lg border border-charcoal/12 bg-white pl-10 pr-3 font-mono text-sm tabular-nums text-charcoal outline-none transition-colors duration-150 placeholder:font-sans placeholder:text-warmgray/60 focus:border-charcoal/40 focus:ring-2 focus:ring-charcoal/10"
            />
          </div>
          <button
            type="submit"
            disabled={loading || pincode.length < 6}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} /> : null}
            Check
          </button>
        </form>
      ) : loading ? (
        <p className="mt-2.5 flex items-center gap-2 text-xs text-warmgray">
          <Loader2 className="h-4 w-4 animate-spin text-warmgray" strokeWidth={1.5} />
          Checking delivery for <span className="font-mono tabular-nums">{displayPincode}</span>
        </p>
      ) : !activeResult && !activeError ? (
        <p className="mt-2 text-xs text-warmgray">
          Enter a 6-digit Indian PIN code to check delivery estimate.
        </p>
      ) : null}

      {activeError ? (
        <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-primary" role="alert">
          <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.5} />
          {activeError}
        </p>
      ) : null}

      {activeResult ? (
        <div className="mt-3 space-y-2.5 border-t border-charcoal/10 pt-3 text-xs">
          {activeResult.serviceable ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-medium text-[#16a34a]">
                  <CheckCircle2 className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  Deliverable to <span className="font-mono tabular-nums">{activeResult.pincode}</span>
                </span>
                {etaFormatted ? (
                  <span className="font-mono tabular-nums text-charcoal">
                    Est. {etaFormatted}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-warmgray">
                <span className="inline-flex items-center gap-1.5">
                  <PackageCheck className="h-4 w-4 text-warmgray" strokeWidth={1.5} />
                  {activeResult.freeShipping ? "Free insured shipping" : "Standard shipping"}
                </span>
                {activeResult.recommendedCourier ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Truck className="h-4 w-4 text-warmgray" strokeWidth={1.5} />
                    {activeResult.recommendedCourier.courierName} ({activeResult.recommendedCourier.mode})
                    {activeResult.recommendedCourier.rating ? ` · ${activeResult.recommendedCourier.rating}` : ""}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 tabular-nums">
                    <ShieldCheck className="h-4 w-4 text-warmgray" strokeWidth={1.5} />
                    {activeResult.estimatedDaysMin}–{activeResult.estimatedDaysMax} business days
                  </span>
                )}
              </div>

              {!compact && activeResult.live && activeResult.couriers.length > 1 ? (
                <div className="mt-2 rounded-lg border border-charcoal/8 bg-white p-3">
                  <p className="text-xs font-medium text-charcoal">
                    Available couriers ({activeResult.couriers.length})
                  </p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {activeResult.couriers.slice(0, 4).map((c) => (
                      <div
                        key={c.courierCompanyId}
                        className="flex items-center justify-between gap-2 rounded-md border border-charcoal/8 bg-ivory px-2.5 py-1.5 text-xs"
                      >
                        <span className="truncate font-medium text-charcoal">
                          {c.courierName}
                          {c.isRecommended ? (
                            <span className="ml-1 font-normal text-primary">· Best</span>
                          ) : null}
                        </span>
                        <span className="shrink-0 font-mono tabular-nums text-warmgray">
                          {c.estimatedDeliveryDays ? `${c.estimatedDeliveryDays}d` : c.mode}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary-soft p-3 text-primary">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
              <p className="leading-5">{activeResult.message}</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
