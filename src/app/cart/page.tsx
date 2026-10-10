import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import CartPageClient from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your selected books, oracle decks and sacred tools before WhatsApp confirmation.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f3e9] pb-24 pt-28 lg:pb-32 lg:pt-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_82%_8%,rgba(221,184,41,0.18),transparent_32%),radial-gradient(circle_at_5%_20%,rgba(180,20,20,0.07),transparent_28%)]" />
      <div className="pointer-events-none absolute right-[-12rem] top-48 h-96 w-96 rounded-full border border-gold/10" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/products" className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-warmgray transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Continue shopping
          </Link>
          <p className="flex items-center gap-2 text-xs font-medium text-warmgray"><LockKeyhole className="h-3.5 w-3.5 text-gold-deep" /> Personal WhatsApp confirmation</p>
        </div>

        <header className="mt-9 grid gap-6 border-b border-gold/20 pb-9 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-deep">Sacred shop · Your selection</p>
            <h1 className="mt-3 text-balance font-display text-5xl font-semibold leading-[0.98] tracking-[-0.035em] text-charcoal sm:text-6xl">A considered collection,<br className="hidden sm:block" /> chosen by you.</h1>
          </div>
          <p className="max-w-sm text-pretty text-sm leading-6 text-warmgray sm:text-right">Review each piece and quantity. Add delivery details, then the team confirms availability, shipping and final amount on WhatsApp.</p>
        </header>

        <CartPageClient />
      </div>
    </div>
  );
}
