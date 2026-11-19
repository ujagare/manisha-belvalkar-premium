"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw } from "lucide-react";

export default function ReconcilePaymentButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function checkStatus() {
    setChecking(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/reconcile`, {
        method: "POST",
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.paymentStatus === "paid") {
        router.push(data.healingUrl ?? `/thank-you?order=${encodeURIComponent(orderId)}`);
        return;
      }
      if (res.ok && data?.paymentStatus === "authorized") {
        setMessage("Payment is authorized by your bank and awaiting capture. Please check again in 1–2 minutes.");
        return;
      }
      setMessage(data?.error?.message ?? "No captured payment found for this attempt yet. If money was deducted, Razorpay auto-refunds uncaptured attempts within 5–7 business days.");
    } catch {
      setMessage("Could not reach server. Please retry in a moment.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={checkStatus}
        disabled={checking}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-gold bg-gold-soft/55 px-5 py-2.5 text-sm font-semibold text-gold-deep transition hover:bg-gold-soft disabled:opacity-60"
      >
        {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        {checking ? "Checking with Razorpay…" : "Money deducted? Verify payment status"}
      </button>
      {message ? <p className="mt-3 text-xs leading-5 text-warmgray">{message}</p> : null}
    </div>
  );
}
