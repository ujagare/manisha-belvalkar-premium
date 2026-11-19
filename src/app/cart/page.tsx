import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import CartPageClient, { type CartSuggestion } from "@/components/cart/CartPageClient";
import { getProducts } from "@/lib/supabase/products";

export const metadata: Metadata = {
  title: "Your Sacred Bag",
  description: "Review your selected books, oracle decks and sacred tools before confirmation.",
  robots: { index: false, follow: false },
};

const PRODUCT_IMAGE_MAP: Record<string, string> = {
  "shakti-oracle-deck": "/images/products-reference/deck.webp",
  "shakti-deck-guidebook": "/images/products-reference/book.webp",
  "sacred-salt-frame": "/images/products-reference/salt.webp",
  "vastu-healing-frames": "/images/products-reference/vastu.webp",
  "abundance-rituals": "/images/products-reference/abundance.webp",
  "good-luck-rituals": "/images/products-reference/luck.webp",
  "good-health-rituals": "/images/products-reference/health.webp",
  "protection-rituals": "/images/products-reference/protection.webp",
  "tarot-reading": "/images/products-reference/tarot.webp",
};

const CURATED_SLUGS = [
  "shakti-oracle-deck",
  "shakti-deck-guidebook",
  "sacred-salt-frame",
  "vastu-healing-frames",
  "abundance-rituals",
];

export default async function CartPage() {
  const products = await getProducts();
  const suggestions: CartSuggestion[] = CURATED_SLUGS.map((slug) =>
    products.find((product) => product.slug === slug),
  )
    .filter((product): product is NonNullable<typeof product> => Boolean(product))
    .map((product) => ({
      slug: product.slug,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      badge: product.badge,
      image: PRODUCT_IMAGE_MAP[product.slug] ?? product.image,
    }));

  return (
    <main className="relative min-h-[100dvh] overflow-x-clip bg-[#fdf8f0] pb-24 pt-20 text-[#292524] sm:pt-24 lg:pb-32">
      {/* Subtle warm ambient washes matching the Sacred Shop canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(60%_55%_at_85%_8%,rgba(221,184,41,0.14),transparent_70%),radial-gradient(50%_45%_at_8%_16%,rgba(107,11,11,0.06),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-8 lg:px-10">
        {/* Top Navigation & Checkout Step Context */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#efe5d2] pb-4 sm:pb-5">
          <Link
            href="/products"
            className="group inline-flex min-h-11 items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#57534e] transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-[#b41414] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8871a]"
          >
            <span className="grid size-7 place-items-center rounded-full border border-[#efe5d2] bg-[#f7f0e3] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-x-0.5 group-hover:border-[#ddb829]/60">
              <ArrowLeft className="size-3.5" strokeWidth={1.5} />
            </span>
            <span>Back to sacred shop</span>
          </Link>

          <nav aria-label="Order progress" className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em]">
            <span className="inline-flex items-center gap-2 text-[#210b0a]">
              <span className="grid size-5 place-items-center rounded-full bg-[#210b0a] font-serif text-[10px] tabular-nums text-[#f0d060]">
                1
              </span>
              Selection
            </span>
            <span className="h-px w-6 bg-[#ddb829]/45" aria-hidden="true" />
            <span className="inline-flex items-center gap-2 text-[#57534e]">
              <span className="grid size-5 place-items-center rounded-full border border-[#efe5d2] bg-[#f7f0e3] font-serif text-[10px] tabular-nums text-[#57534e]">
                2
              </span>
              Delivery &amp; Confirm
            </span>
          </nav>
        </div>

        {/* Asymmetric Editorial Page Header */}
        <header className="mt-7 grid gap-5 border-b border-[#efe5d2] pb-8 sm:mt-10 sm:pb-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:gap-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a8871a]">
              Sacred shop · Bag
            </p>
            <h1 className="mt-2.5 text-balance font-display text-[2.25rem] font-medium leading-[1.04] tracking-[-0.025em] text-[#210b0a] sm:text-5xl lg:text-[3.5rem]">
              Your selected <em className="italic text-[#b41414]">offerings</em>
            </h1>
          </div>

          <div className="flex items-start gap-3 border-l-2 border-[#ddb829]/50 pl-4 lg:justify-self-end">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#a8871a]" strokeWidth={1.5} />
            <p className="max-w-sm text-pretty text-sm leading-6 text-[#57534e]">
              Every piece is personally checked, wrapped, and blessed by Dr. Manisha&apos;s desk before dispatch across India.
            </p>
          </div>
        </header>

        <CartPageClient suggestions={suggestions} />
      </div>
    </main>
  );
}
