import type { Metadata } from "next";
import CartPageClient from "@/components/cart/CartPageClient";

export const metadata: Metadata = { title: "Your Cart", robots: { index: false, follow: false } };

export default function CartPage() {
  return <section className="bg-ivory px-6 pb-24 pt-32 lg:px-10 lg:pt-40">
    <div className="mx-auto max-w-6xl">
      <p className="eyebrow text-gold-dark">Sacred shop</p>
      <h1 className="mt-4 font-display text-5xl font-bold text-charcoal sm:text-6xl">Your cart</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-warmgray">Review quantities before continuing to secure payment.</p>
      <CartPageClient />
    </div>
  </section>;
}
