"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, MessageCircle } from "lucide-react";
import { brand } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { OrderItemType } from "@/lib/supabase/database.types";

/**
 * Checkout confirmation — creates the order (requires the session the
 * server already verified), then hands off to WhatsApp for payment/
 * scheduling details, matching the site's existing booking model.
 */
export default function CheckoutForm({
  type,
  slug,
  itemTitle,
  priceLabel,
  userEmail,
  userName,
}: {
  type: OrderItemType;
  slug: string;
  itemTitle: string;
  priceLabel: string;
  userEmail: string;
  userName: string | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ id: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.order?.id) {
        setError(data?.error ?? "Could not create the order. Please try again.");
        return;
      }
      setCreated(data.order);
    });
  }

  // Hand off to WhatsApp with order context (existing booking model).
  const whatsappUrl = created
    ? `https://wa.me/919922246111?text=${encodeURIComponent(
        `Namaste Manisha ji, I would like to confirm my order:\n\nOrder ID: ${created.id.slice(0, 8)}\nItem: ${itemTitle}\nPrice: ${priceLabel}\n\nName: ${userName ?? "—"}\nEmail: ${userEmail}\n\nPlease share the next steps.`,
      )}`
    : brand.whatsappHref;

  if (created) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark shadow-lg shadow-gold/40 ring-4 ring-gold/20">
          <ShieldCheck className="h-8 w-8 text-primary-deeper" />
        </div>
        <h3 className="font-display text-2xl font-bold text-charcoal">
          Order {created.id.slice(0, 8)} — noted
        </h3>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-warmgray">
          Your request has been recorded. Complete your booking on WhatsApp —
          Manisha&apos;s team will confirm the next steps personally.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark px-7 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110"
        >
          <MessageCircle className="h-4 w-4" />
          Continue on WhatsApp
        </a>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => router.push("/account")}
            className="text-sm font-medium text-warmgray underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            View my orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <div className="mb-5 rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm text-primary">
          {error}
        </div>
      ) : null}

      <div className="rounded-[20px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-6 shadow-[0_6px_24px_-16px_rgba(28,25,23,0.18)]">
        <div className="flex items-center justify-between border-b border-parchment pb-4">
          <span className="text-sm font-medium text-warmgray">Signed in as</span>
          <span className="max-w-[60%] truncate text-sm font-semibold text-charcoal">
            {userEmail}
          </span>
        </div>
        <div className="flex items-center justify-between pt-4 text-sm">
          <span className="text-warmgray">Order type</span>
          <span className="font-semibold text-charcoal capitalize">{type}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-warmgray">Total</span>
          <span className="font-display text-lg font-bold text-primary">{priceLabel}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleConfirm}
        disabled={isPending}
        className={cn(
          "mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300",
          "hover:shadow-xl hover:shadow-primary/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating order…
          </>
        ) : (
          "Confirm booking"
        )}
      </button>
      <p className="mt-4 text-center text-xs leading-relaxed text-warmgray">
        You&apos;ll be handed over to WhatsApp to complete scheduling &amp; payment.
        No charges are taken here.
      </p>
    </div>
  );
}
