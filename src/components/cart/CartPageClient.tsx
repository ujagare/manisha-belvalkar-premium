"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "./CartProvider";
import { formatINR } from "@/lib/utils";

export default function CartPageClient() {
  const { items, ready, subtotal, itemCount, updateQuantity, removeItem } = useCart();

  if (!ready) return <div className="mx-auto mt-12 h-44 max-w-5xl animate-pulse rounded-3xl bg-parchment/60" />;

  if (!items.length) {
    return <div className="mx-auto mt-12 max-w-2xl rounded-[28px] border border-parchment bg-white p-10 text-center">
      <ShoppingBag className="mx-auto h-12 w-12 text-gold-dark" />
      <h2 className="mt-5 font-display text-3xl font-bold text-charcoal">Your cart is waiting</h2>
      <p className="mt-3 text-warmgray">Add a sacred tool or book from the shop to begin.</p>
      <Link href="/products" className="mt-7 inline-flex rounded-full bg-primary px-7 py-3 font-semibold text-white">Explore the shop</Link>
    </div>;
  }

  return <div className="mx-auto mt-12 grid max-w-6xl gap-10 lg:grid-cols-[1fr_22rem]">
    <div className="space-y-4">
      {items.map((item) => <article key={item.slug} className="grid grid-cols-[5.5rem_1fr] gap-5 rounded-[24px] border border-parchment bg-white p-5 sm:grid-cols-[7rem_1fr_auto] sm:items-center">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-ivory">
          <Image src={item.image} alt={item.title} fill sizes="112px" className="object-contain p-2" />
        </div>
        <div>
          <Link href={`/products/${item.slug}`} className="font-display text-xl font-bold text-charcoal hover:text-primary">{item.title}</Link>
          <p className="mt-2 font-semibold text-primary">{formatINR(item.price)}</p>
          <div className="mt-4 inline-flex items-center rounded-full border border-parchment">
            <button type="button" onClick={() => updateQuantity(item.slug, item.quantity - 1)} className="p-2.5" aria-label={`Reduce ${item.title} quantity`}><Minus className="h-4 w-4" /></button>
            <span className="min-w-8 text-center text-sm font-semibold" aria-live="polite">{item.quantity}</span>
            <button type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="p-2.5" aria-label={`Increase ${item.title} quantity`}><Plus className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="col-span-2 flex items-center justify-between border-t border-parchment pt-4 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-right">
          <p className="font-display text-xl font-bold text-charcoal">{formatINR(item.price * item.quantity)}</p>
          <button type="button" onClick={() => removeItem(item.slug)} className="mt-0 inline-flex items-center gap-1 text-sm text-warmgray hover:text-primary sm:mt-4" aria-label={`Remove ${item.title}`}><Trash2 className="h-4 w-4" />Remove</button>
        </div>
      </article>)}
    </div>
    <aside className="h-fit rounded-[28px] bg-charcoal p-7 text-white lg:sticky lg:top-28">
      <p className="eyebrow text-gold-light">Order summary</p>
      <div className="mt-6 flex justify-between border-b border-white/15 pb-5"><span className="text-white/65">{itemCount} item{itemCount === 1 ? "" : "s"}</span><span className="font-semibold">{formatINR(subtotal)}</span></div>
      <div className="mt-5 flex justify-between text-lg"><span>Total</span><span className="font-display text-2xl font-bold text-gold-light">{formatINR(subtotal)}</span></div>
      <p className="mt-3 text-xs leading-5 text-white/55">Taxes included. Shipping details are confirmed after payment where applicable.</p>
      <Link href="/checkout/cart" className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-gold px-6 py-3.5 font-bold text-primary-deeper">Proceed to secure payment</Link>
      <Link href="/products" className="mt-4 block text-center text-sm text-white/65 hover:text-gold-light">Continue shopping</Link>
    </aside>
  </div>;
}
