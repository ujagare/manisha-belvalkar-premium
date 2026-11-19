"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Gift,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
} from "lucide-react";
import { useCart } from "./CartProvider";
import AddToCartButton from "./AddToCartButton";
import { formatINR } from "@/lib/utils";
import { cartState, MAX_CART_QUANTITY, type CartItem } from "@/lib/cart";

export interface CartSuggestion {
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  badge?: string;
  image: string;
}

const EASE_OUT = [0.32, 0.72, 0, 1] as const;
const DECK_STAGE_BG =
  "bg-[radial-gradient(60%_55%_at_50%_46%,rgba(240,208,96,0.28),transparent_70%),radial-gradient(120%_100%_at_50%_40%,#8b0f0f,#6b0b0b_44%,#210b0a)]";

function productFrameBg(slug: string) {
  return slug === "shakti-oracle-deck" ? DECK_STAGE_BG : "bg-[#f7f0e3]";
}

export default function CartPageClient({
  suggestions = [],
}: {
  suggestions?: CartSuggestion[];
}) {
  const { items, ready, subtotal, itemCount, updateQuantity, removeItem, addItem } =
    useCart();
  const reduceMotion = useReducedMotion();
  const [recentlyRemoved, setRecentlyRemoved] = useState<CartItem | null>(null);

  const handleRemove = (item: CartItem) => {
    setRecentlyRemoved(item);
    removeItem(item.slug);
  };

  const handleUndoRemove = () => {
    if (!recentlyRemoved) return;
    addItem(
      {
        slug: recentlyRemoved.slug,
        title: recentlyRemoved.title,
        image: recentlyRemoved.image,
        price: recentlyRemoved.price,
      },
      recentlyRemoved.quantity,
    );
    setRecentlyRemoved(null);
  };

  /* Layout-matched structural skeleton while localStorage hydrates */
  if (!ready) {
    return (
      <div
        className="mt-8 grid items-start gap-8 lg:mt-11 lg:grid-cols-[minmax(0,1fr)_24.5rem] lg:gap-12"
        aria-busy="true"
        aria-label="Loading your bag"
      >
        <div className="rounded-[1.75rem] bg-[#f7f0e3] p-1.5 ring-1 ring-[#efe5d2]">
          <div className="divide-y divide-[#efe5d2] rounded-[calc(1.75rem-0.375rem)] bg-white p-4 sm:p-6">
            {[0, 1].map((row) => (
              <div
                key={row}
                className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 py-5 first:pt-1 last:pb-1 sm:grid-cols-[7.5rem_minmax(0,1fr)_6rem] sm:gap-6"
              >
                <div className="aspect-[4/5] rounded-2xl bg-[#f7f0e3]" />
                <div className="space-y-3 py-1">
                  <div className="h-3 w-20 rounded bg-[#efe5d2]" />
                  <div className="h-6 w-48 max-w-full rounded bg-[#f7f0e3]" />
                  <div className="h-10 w-32 rounded-full bg-[#f7f0e3]" />
                </div>
                <div className="hidden h-6 w-20 justify-self-end rounded bg-[#f7f0e3] sm:block" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[1.75rem] bg-[#efe5d2]/75 p-1.5 ring-1 ring-[#a8871a]/25">
          <div className="h-[24rem] rounded-[calc(1.75rem-0.375rem)] bg-[#210b0a]/90" />
        </div>
      </div>
    );
  }

  const companionItems = suggestions
    .filter((candidate) => !items.some((inCart) => inCart.slug === candidate.slug))
    .slice(0, 3);

  /* Asymmetric Editorial Empty State */
  if (cartState(items) === "empty") {
    return (
      <div className="mt-8 space-y-12 sm:mt-11 sm:space-y-16">
        <AnimatePresence>
          {recentlyRemoved ? (
            <motion.div
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              role="status"
              aria-live="polite"
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#ddb829]/45 bg-[#faf3dc] px-4 py-3 text-sm text-[#292524]"
            >
              <span>
                Removed <strong className="font-semibold">{recentlyRemoved.title}</strong> from your bag.
              </span>
              <button
                type="button"
                onClick={handleUndoRemove}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[#210b0a] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#f0d060] transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#6b0b0b] active:scale-[0.98]"
              >
                <RotateCcw className="size-3.5" strokeWidth={1.6} />
                Undo
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <section
          aria-label="Empty bag"
          className="rounded-[1.75rem] bg-[#efe5d2]/75 p-1.5 ring-1 ring-[#a8871a]/25"
        >
          <div className="grid overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)] lg:grid-cols-[1.05fr_0.95fr]">
            <div className="flex flex-col justify-between bg-[#210b0a] p-7 text-[#fdf8f0] sm:p-10 lg:p-12">
              <div>
                <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-[#ddb829]/30 bg-[#6b0b0b]/45 text-[#f0d060]">
                  <ShoppingBag className="size-5" strokeWidth={1.5} />
                </span>
                <h2 className="mt-6 text-balance font-display text-3xl font-medium leading-[1.08] tracking-[-0.02em] sm:text-4xl">
                  Your bag is currently <em className="italic text-[#f0d060]">empty</em>
                </h2>
                <p className="mt-4 max-w-md text-pretty text-sm leading-6 text-[#fdf8f0]/75 sm:text-base sm:leading-7">
                  Browse the Shakti Oracle Deck, companion guidebook, and handcrafted ritual tools created by Dr. Manisha Belvalkar.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="group inline-flex min-h-12 items-center justify-between gap-4 whitespace-nowrap rounded-full bg-[#ddb829] py-2 pl-6 pr-2 text-xs font-bold uppercase tracking-[0.14em] text-[#210b0a] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060]"
                >
                  <span>Browse collection</span>
                  <span className="grid size-8 place-items-center rounded-full bg-[#210b0a]/12 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                    <ArrowRight className="size-4" strokeWidth={1.6} />
                  </span>
                </Link>
                <Link
                  href="/shakti"
                  className="inline-flex min-h-12 items-center border-b border-[#ddb829]/55 px-1 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#fdf8f0]/85 transition-colors hover:border-[#f0d060] hover:text-[#f0d060]"
                >
                  About Shakti
                </Link>
              </div>
            </div>

            <div className="relative flex flex-col justify-between bg-[#f7f0e3] p-7 sm:p-10 lg:p-12">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[#efe5d2] bg-white">
                <Image
                  src="/images/products-reference/hero.webp"
                  alt="Shakti Oracle Deck and companion guidebook"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover object-center"
                />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#efe5d2] pt-5 text-xs text-[#57534e]">
                <div className="flex items-start gap-2.5">
                  <Truck className="mt-0.5 size-4 shrink-0 text-[#b41414]" strokeWidth={1.5} />
                  <span>Insured dispatch across India</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Gift className="mt-0.5 size-4 shrink-0 text-[#b41414]" strokeWidth={1.5} />
                  <span>Gift-ready sacred wrapping</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {companionItems.length > 0 ? (
          <section aria-labelledby="empty-curated-heading">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#efe5d2] pb-4">
              <h2
                id="empty-curated-heading"
                className="font-display text-2xl font-medium tracking-[-0.02em] text-[#210b0a] sm:text-3xl"
              >
                Signature offerings
              </h2>
              <Link
                href="/products"
                className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#b41414] transition-colors hover:text-[#6b0b0b]"
              >
                View full collection
                <ArrowRight className="size-3.5" strokeWidth={1.6} />
              </Link>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {companionItems.map((product) => (
                <article
                  key={product.slug}
                  className="group flex flex-col justify-between rounded-2xl border border-[#efe5d2] bg-white p-4 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1 hover:border-[#ddb829]/65"
                >
                  <div>
                    <Link
                      href={`/products/${product.slug}`}
                      className={`relative block aspect-[4/5] overflow-hidden rounded-xl ${productFrameBg(product.slug)}`}
                    >
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className={`transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04] ${
                          product.slug === "shakti-oracle-deck"
                            ? "object-contain p-5 drop-shadow-[0_18px_24px_rgba(0,0,0,0.45)]"
                            : "object-cover object-center"
                        }`}
                      />
                    </Link>
                    <div className="mt-4">
                      <h3 className="font-display text-xl font-medium text-[#210b0a]">
                        <Link href={`/products/${product.slug}`} className="hover:text-[#b41414]">
                          {product.title}
                        </Link>
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#57534e]">
                        {product.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#efe5d2] pt-4">
                    <span className="font-display text-lg font-medium tabular-nums text-[#210b0a]">
                      {formatINR(product.price)}
                    </span>
                    <AddToCartButton
                      product={{
                        slug: product.slug,
                        title: product.title,
                        image: product.image,
                        price: product.price,
                      }}
                      compact
                      className="min-h-11 rounded-full border-[#210b0a]/25 px-4 text-xs text-[#210b0a] hover:border-[#210b0a] hover:bg-[#210b0a] hover:text-[#fdf8f0]"
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    );
  }

  /* Active Bag — Editorial Atelier Ledger + Double-Bezel Sticky Night Folio */
  return (
    <div className="mt-8 space-y-12 sm:mt-11">
      <AnimatePresence>
        {recentlyRemoved ? (
          <motion.div
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            role="status"
            aria-live="polite"
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#ddb829]/45 bg-[#faf3dc] px-4 py-3 text-sm text-[#292524]"
          >
            <span>
              Removed <strong className="font-semibold">{recentlyRemoved.title}</strong> from your bag.
            </span>
            <button
              type="button"
              onClick={handleUndoRemove}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#210b0a] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#f0d060] transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#6b0b0b] active:scale-[0.98]"
            >
              <RotateCcw className="size-3.5" strokeWidth={1.6} />
              Undo
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_24.5rem] lg:gap-12">
        {/* Left: Item Ledger */}
        <section aria-labelledby="cart-items-heading">
          <div className="mb-3.5 flex items-baseline justify-between gap-4 px-1">
            <h2
              id="cart-items-heading"
              className="font-display text-2xl font-medium tracking-[-0.015em] text-[#210b0a]"
            >
              Selected pieces
            </h2>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#57534e]">
              <span className="tabular-nums text-[#210b0a]">{itemCount}</span>{" "}
              {itemCount === 1 ? "piece" : "pieces"}
            </p>
          </div>

          {/* Double-Bezel Line Item Container */}
          <div className="rounded-[1.75rem] bg-[#f7f0e3] p-1.5 ring-1 ring-[#efe5d2]">
            <div className="overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
              {/* Desktop Ledger Column Headers */}
              <div
                aria-hidden="true"
                className="hidden grid-cols-[7.5rem_minmax(0,1fr)_7.5rem] gap-6 border-b border-[#efe5d2] bg-[#fdf8f0]/70 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#57534e] sm:grid"
              >
                <span>Piece</span>
                <span>Details &amp; quantity</span>
                <span className="text-right">Line total</span>
              </div>

              <AnimatePresence initial={false}>
                {items.map((item, index) => (
                  <motion.article
                    key={item.slug}
                    layout={!reduceMotion}
                    initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: EASE_OUT }}
                    className={`group grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[7.5rem_minmax(0,1fr)_7.5rem] sm:gap-6 sm:p-6 ${
                      index > 0 ? "border-t border-[#efe5d2]" : ""
                    }`}
                  >
                    {/* Framed Thumbnail */}
                    <Link
                      href={`/products/${item.slug}`}
                      aria-label={`View ${item.title}`}
                      className={`relative aspect-[4/5] overflow-hidden rounded-2xl border border-[#efe5d2] ${productFrameBg(item.slug)}`}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 88px, 120px"
                        className={`transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04] ${
                          item.slug === "shakti-oracle-deck"
                            ? "object-contain p-2.5"
                            : "object-cover object-center"
                        }`}
                      />
                    </Link>

                    {/* Title, Unit Price, Tactile 44px Stepper & Remove */}
                    <div className="flex min-w-0 flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a8871a]">
                          <span className="font-serif text-xs italic tabular-nums">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span aria-hidden="true" className="h-px w-4 bg-[#ddb829]/60" />
                          <span>Shakti collection</span>
                        </div>

                        <Link
                          href={`/products/${item.slug}`}
                          className="mt-1.5 block text-pretty font-display text-lg font-medium leading-snug text-[#210b0a] transition-colors duration-300 hover:text-[#b41414] sm:text-2xl"
                        >
                          {item.title}
                        </Link>

                        <p className="mt-1 text-xs font-medium tabular-nums text-[#57534e] sm:text-sm">
                          {formatINR(item.price)} <span className="text-[#57534e]/80">per piece</span>
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-5">
                        <div
                          role="group"
                          aria-label={`Quantity for ${item.title}`}
                          className="inline-grid grid-cols-[2.75rem_2.75rem_2.75rem] items-center overflow-hidden rounded-full border border-[#efe5d2] bg-[#fdf8f0]"
                        >
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                            aria-label={`Decrease ${item.title} quantity`}
                            className="grid h-11 w-11 place-items-center text-[#57534e] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white hover:text-[#b41414] active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#a8871a]"
                          >
                            <Minus className="size-3.5" strokeWidth={1.75} />
                          </button>

                          <span
                            aria-live="polite"
                            className="grid h-6 place-items-center border-x border-[#efe5d2] text-sm font-semibold tabular-nums text-[#210b0a]"
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                            disabled={item.quantity >= MAX_CART_QUANTITY}
                            aria-label={`Increase ${item.title} quantity`}
                            className="grid h-11 w-11 place-items-center text-[#57534e] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white hover:text-[#b41414] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#a8871a]"
                          >
                            <Plus className="size-3.5" strokeWidth={1.75} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          aria-label={`Remove ${item.title}`}
                          className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-[#57534e] transition-colors duration-300 hover:bg-[#fbecec] hover:text-[#b41414] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8871a]"
                        >
                          <Trash2 className="size-3.5" strokeWidth={1.5} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                    {/* Line Subtotal */}
                    <div className="col-span-2 flex items-center justify-between border-t border-[#efe5d2] pt-3 sm:col-span-1 sm:flex-col sm:items-end sm:justify-start sm:border-0 sm:pt-1 sm:text-right">
                      <span className="text-xs font-medium text-[#57534e] sm:hidden">
                        Line total
                      </span>
                      <p className="font-display text-xl font-medium tabular-nums text-[#210b0a] sm:text-2xl">
                        {formatINR(item.price * item.quantity)}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Editorial Atelier Assurances (Hairline Strip, not generic cards) */}
          <div className="mt-6 grid divide-y divide-[#efe5d2] border-y border-[#efe5d2] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="flex items-start gap-3.5 py-4 sm:pr-6">
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#ddb829]/45 bg-[#faf3dc] text-[#6b0b0b]">
                <PackageCheck className="size-4" strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="font-display text-base font-medium text-[#210b0a]">
                  Checked &amp; blessed before dispatch
                </h3>
                <p className="mt-0.5 text-xs leading-5 text-[#57534e]">
                  Every deck, book, and ritual piece is inspected and carefully wrapped in protective packaging.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 py-4 sm:pl-6">
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#ddb829]/45 bg-[#faf3dc] text-[#6b0b0b]">
                <Sparkles className="size-4" strokeWidth={1.5} />
              </span>
              <div>
                <h3 className="font-display text-base font-medium text-[#210b0a]">
                  Personal order desk
                </h3>
                <p className="mt-0.5 text-xs leading-5 text-[#57534e]">
                  Shipping and final confirmation are shared directly on WhatsApp after your delivery details.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Double-Bezel Sticky Night-Maroon Folio */}
        <aside
          aria-labelledby="order-summary-heading"
          className="rounded-[1.75rem] bg-[#efe5d2]/80 p-1.5 ring-1 ring-[#a8871a]/25 lg:sticky lg:top-24"
        >
          <div className="overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-[#210b0a] text-[#fdf8f0] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
            <div className="p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4 border-b border-[#ddb829]/20 pb-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f0d060]">
                    Order folio
                  </p>
                  <h2
                    id="order-summary-heading"
                    className="mt-1.5 font-display text-2xl font-medium tracking-[-0.015em]"
                  >
                    Summary
                  </h2>
                </div>
                <span className="rounded-full border border-[#ddb829]/30 bg-[#6b0b0b]/50 px-3 py-1 font-serif text-xs tabular-nums text-[#f0d060]">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>

              <dl className="mt-6 space-y-3.5 border-b border-[#ddb829]/20 pb-6 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#fdf8f0]/65">Items subtotal</dt>
                  <dd className="font-medium tabular-nums text-[#fdf8f0]">
                    {formatINR(subtotal)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#fdf8f0]/65">Taxes</dt>
                  <dd className="text-[#fdf8f0]/85">Included</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-[#fdf8f0]/65">Shipping</dt>
                  <dd className="text-right text-[#fdf8f0]/85">
                    Confirmed at next step
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex items-baseline justify-between gap-4">
                <span className="text-sm font-medium text-[#fdf8f0]/85">
                  Estimated total
                </span>
                <span className="font-display text-3xl font-medium tabular-nums text-[#f0d060]">
                  {formatINR(subtotal)}
                </span>
              </div>
              <p className="mt-2.5 text-xs leading-5 text-[#fdf8f0]/55">
                Enter your delivery address next to review the final parcel total before confirmation.
              </p>

              {/* Button-in-Button Trailing Icon CTA */}
              <Link
                href="/checkout/cart"
                className="group mt-7 inline-flex min-h-12 w-full items-center justify-between gap-3 whitespace-nowrap rounded-full bg-[#ddb829] py-2 pl-6 pr-2 text-xs font-bold uppercase tracking-[0.14em] text-[#210b0a] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060]"
              >
                <span>Proceed to checkout</span>
                <span className="grid size-8 place-items-center rounded-full bg-[#210b0a]/12 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                  <ArrowRight className="size-4" strokeWidth={1.6} />
                </span>
              </Link>

              <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-[#fdf8f0]/65">
                <Check className="size-3.5 shrink-0 text-[#f0d060]" strokeWidth={1.75} />
                <span>No online card charge until confirmed</span>
              </p>
            </div>

            <Link
              href="/products"
              className="flex min-h-12 items-center justify-center border-t border-[#ddb829]/18 bg-[#180706] px-6 text-xs font-semibold uppercase tracking-[0.15em] text-[#fdf8f0]/70 transition-colors duration-300 hover:bg-[#6b0b0b]/35 hover:text-[#f0d060]"
            >
              Add another offering
            </Link>
          </div>
        </aside>
      </div>

      {/* Curated Companion Offerings */}
      {companionItems.length > 0 ? (
        <section aria-labelledby="companion-offerings-heading" className="border-t border-[#efe5d2] pt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2
              id="companion-offerings-heading"
              className="font-display text-2xl font-medium tracking-[-0.02em] text-[#210b0a] sm:text-3xl"
            >
              Often paired together
            </h2>
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#b41414] transition-colors hover:text-[#6b0b0b]"
            >
              Explore full shop
              <ArrowRight className="size-3.5" strokeWidth={1.6} />
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {companionItems.map((product) => (
              <article
                key={product.slug}
                className="group flex items-center gap-4 rounded-2xl border border-[#efe5d2] bg-white p-3.5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[#ddb829]/65"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className={`relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-[#efe5d2] ${productFrameBg(product.slug)}`}
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="80px"
                    className={`transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.05] ${
                      product.slug === "shakti-oracle-deck"
                        ? "object-contain p-2"
                        : "object-cover object-center"
                    }`}
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                  <div>
                    <h3 className="truncate font-display text-lg font-medium text-[#210b0a]">
                      <Link href={`/products/${product.slug}`} className="hover:text-[#b41414]">
                        {product.title}
                      </Link>
                    </h3>
                    <p className="mt-0.5 text-xs font-semibold tabular-nums text-[#57534e]">
                      {formatINR(product.price)}
                    </p>
                  </div>

                  <AddToCartButton
                    product={{
                      slug: product.slug,
                      title: product.title,
                      image: product.image,
                      price: product.price,
                    }}
                    compact
                    className="min-h-11 w-fit rounded-full border-[#210b0a]/25 px-3.5 py-2 text-[11px] text-[#210b0a] hover:border-[#210b0a] hover:bg-[#210b0a] hover:text-[#fdf8f0]"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
