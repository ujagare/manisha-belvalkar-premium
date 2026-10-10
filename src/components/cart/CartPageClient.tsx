"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useCart } from "./CartProvider";
import { formatINR } from "@/lib/utils";
import { cartState } from "@/lib/cart";

export default function CartPageClient() {
  const { items, ready, subtotal, itemCount, updateQuantity, removeItem } = useCart();

  if (!ready) {
    return (
      <div className="mt-10 grid animate-pulse gap-10 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="space-y-1 overflow-hidden rounded-[1.75rem] bg-white/70 p-3 ring-1 ring-parchment">
          {[0, 1].map((item) => <div key={item} className="h-44 rounded-2xl bg-parchment/55" />)}
        </div>
        <div className="h-96 rounded-[1.75rem] bg-charcoal/10" />
      </div>
    );
  }

  if (cartState(items) === "empty") {
    return (
      <section className="relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-[2rem] bg-charcoal px-6 py-16 text-center text-white shadow-[0_35px_90px_-45px_rgba(62,38,25,0.75)] sm:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(221,184,41,0.22),transparent_42%)]" />
        <svg viewBox="0 0 240 240" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 text-gold opacity-10" aria-hidden="true"><circle cx="120" cy="120" r="92" fill="none" stroke="currentColor" /><circle cx="120" cy="120" r="61" fill="none" stroke="currentColor" /><path d="m120 28 80 138H40Z" fill="none" stroke="currentColor" /></svg>
        <div className="relative">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gold/12 ring-1 ring-gold/30"><ShoppingBag className="h-7 w-7 text-gold-light" /></span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-gold-light">Your collection is empty</p>
          <h2 className="mx-auto mt-3 max-w-lg text-balance font-display text-4xl font-semibold leading-tight">Find the piece that speaks to you.</h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/60">Explore oracle decks, books and thoughtfully created ritual tools from the Shakti collection.</p>
          <Link href="/products" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold text-primary-deeper transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0">Explore the collection <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    );
  }

  return (
    <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14">
      <section aria-labelledby="cart-items-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="cart-items-heading" className="font-display text-2xl font-semibold text-charcoal">Your pieces</h2>
          <p className="text-xs font-medium text-warmgray"><span className="tabular-nums text-charcoal">{itemCount}</span> {itemCount === 1 ? "item" : "items"}</p>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] bg-white/80 shadow-[0_24px_70px_-46px_rgba(62,38,25,0.42)] ring-1 ring-parchment backdrop-blur-sm">
          {items.map((item, index) => (
            <article key={item.slug} className={`group relative grid grid-cols-[6.5rem_minmax(0,1fr)] gap-5 p-4 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:gap-7 sm:p-6 ${index ? "border-t border-parchment" : ""}`}>
              <Link href={`/products/${item.slug}`} className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem] bg-ivory ring-1 ring-parchment/70" aria-label={`View ${item.title}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(221,184,41,0.12),transparent_60%)]" />
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 104px, 136px" className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]" />
              </Link>

              <div className="min-w-0 py-1 sm:py-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-deep">Shakti collection</p>
                <Link href={`/products/${item.slug}`} className="mt-2 block text-pretty font-display text-xl font-semibold leading-tight text-charcoal transition-colors hover:text-primary sm:text-2xl">{item.title}</Link>
                <p className="mt-2 text-sm font-semibold tabular-nums text-primary">{formatINR(item.price)} <span className="text-[11px] font-normal text-warmgray">each</span></p>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <div className="inline-grid grid-cols-[2.6rem_2.8rem_2.6rem] items-center overflow-hidden rounded-full bg-ivory/70 ring-1 ring-parchment" aria-label={`Quantity for ${item.title}`}>
                    <button type="button" onClick={() => updateQuantity(item.slug, item.quantity - 1)} className="grid h-10 place-items-center text-warmgray transition hover:bg-white hover:text-primary active:scale-95" aria-label={`Reduce ${item.title} quantity`}><Minus className="h-3.5 w-3.5" /></button>
                    <span className="grid h-6 place-items-center border-x border-parchment text-sm font-semibold tabular-nums text-charcoal" aria-live="polite">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="grid h-10 place-items-center text-warmgray transition hover:bg-white hover:text-primary active:scale-95" aria-label={`Increase ${item.title} quantity`}><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <button type="button" onClick={() => removeItem(item.slug)} className="inline-flex items-center gap-1.5 text-xs font-medium text-warmgray transition hover:text-primary" aria-label={`Remove ${item.title}`}><Trash2 className="h-3.5 w-3.5" /> Remove</button>
                </div>
              </div>

              <div className="col-span-2 flex items-center justify-between border-t border-parchment pt-4 sm:col-span-1 sm:block sm:border-0 sm:py-2 sm:text-right">
                <span className="text-xs text-warmgray sm:hidden">Item total</span>
                <p className="font-display text-xl font-semibold tabular-nums text-charcoal sm:text-2xl">{formatINR(item.price * item.quantity)}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 rounded-[1.5rem] bg-white/45 p-5 ring-1 ring-parchment/70 sm:grid-cols-2 sm:p-6">
          <div className="flex gap-3"><PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><h3 className="text-sm font-semibold text-charcoal">Packed with care</h3><p className="mt-1 text-xs leading-5 text-warmgray">Every order is checked before dispatch.</p></div></div>
          <div className="flex gap-3"><RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-primary" /><div><h3 className="text-sm font-semibold text-charcoal">Clear support</h3><p className="mt-1 text-xs leading-5 text-warmgray">Order assistance is available by WhatsApp.</p></div></div>
        </div>
      </section>

      <aside className="overflow-hidden rounded-[1.75rem] bg-charcoal text-white shadow-[0_30px_80px_-40px_rgba(62,38,25,0.7)] lg:sticky lg:top-28">
        <div className="h-1 bg-gradient-to-r from-primary via-gold to-primary" />
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-light">Order summary</p><h2 className="mt-2 font-display text-2xl font-semibold">Ready when you are.</h2></div>
            <Sparkles className="h-5 w-5 shrink-0 text-gold" />
          </div>

          <dl className="mt-7 space-y-4 border-b border-white/12 pb-6 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-white/55">Subtotal · {itemCount} {itemCount === 1 ? "item" : "items"}</dt><dd className="font-medium tabular-nums">{formatINR(subtotal)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-white/55">Taxes</dt><dd className="text-white/75">Included</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-white/55">Shipping</dt><dd className="text-right text-white/75">Calculated at checkout</dd></div>
          </dl>

          <div className="mt-6 flex items-end justify-between gap-4"><span className="text-sm font-medium">Estimated total</span><span className="font-display text-3xl font-semibold tabular-nums text-gold-light">{formatINR(subtotal)}</span></div>
          <p className="mt-3 text-[11px] leading-5 text-white/48">The final total is shown before payment after you enter the delivery address.</p>

          <Link href="/checkout/cart" className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-bold text-primary-deeper shadow-lg shadow-gold/10 transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0">Continue to checkout <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></Link>
          <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/55"><Check className="h-3.5 w-3.5 text-gold-light" /> WhatsApp confirmation · No online payment required</p>
        </div>
        <Link href="/products" className="block border-t border-white/10 px-7 py-4 text-center text-xs font-medium text-white/55 transition hover:bg-white/[0.04] hover:text-gold-light">Continue browsing the collection</Link>
      </aside>
    </div>
  );
}
