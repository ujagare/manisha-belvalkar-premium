import Link from "next/link";
import { ArrowUpRight, BookOpen, Sparkles, Gem } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

/** Category chip icon + label. */
export function categoryMeta(category: ProductCategory) {
  switch (category) {
    case "oracle":
      return { icon: Sparkles, label: "Oracle & Tarot" };
    case "ritual":
      return { icon: Gem, label: "Sacred Rituals" };
    case "book":
      return { icon: BookOpen, label: "Books" };
  }
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

/** Premium product card for the Products storefront grid. */
export default function ProductCard({ product, className }: ProductCardProps) {
  const meta = categoryMeta(product.category);
  const discount =
    product.salePrice && product.salePrice > product.price
      ? Math.round(((product.salePrice - product.price) / product.salePrice) * 100)
      : 0;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-2 hover:border-gold/50 hover:shadow-[0_35px_80px_-30px_rgba(221,184,41,0.45)]",
        className,
      )}
    >
      {/* ============ Image — compact, whole product fits ============ */}
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-gradient-to-b from-ivory to-cream"
        aria-label={product.title}
      >
        <div
          className="h-full w-full bg-contain bg-center bg-no-repeat p-10 transition-transform duration-1000 ease-out group-hover:scale-[1.06] sm:p-12"
          style={{ backgroundImage: `url('${product.image}')` }}
        />
        {/* Warm gold aura that blooms on hover */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,rgba(221,184,41,0.35),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        {/* Bottom fade into the card body */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white/80 to-transparent" />

        {product.badge ? (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-gold-dark px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-deeper shadow-lg shadow-gold/40">
            ✦ {product.badge}
          </span>
        ) : null}

        {discount > 0 ? (
          <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg shadow-primary/40">
            {discount}% off
          </span>
        ) : null}

        {/* Category glass chip */}
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-charcoal/45 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
          <meta.icon className="h-3 w-3 text-gold-light" />
          {meta.label}
        </span>

        {/* Hover view pill */}
        <span className="pointer-events-none absolute bottom-4 right-4 inline-flex translate-y-3 items-center gap-1.5 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-primary opacity-0 shadow-lg backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          View
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </Link>

      {/* ============ Body ============ */}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="font-display text-xl font-bold leading-snug text-charcoal transition-colors duration-300 group-hover:text-primary sm:text-[1.4rem]">
            {product.title}
          </h3>
        </Link>
        <p className="mt-1.5 font-serif text-[15px] italic leading-snug text-warmgray">
          {product.subtitle}
        </p>

        {/* Ornamental divider */}
        <div className="mt-4 flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/40" />
          <span className="font-serif text-sm text-gold">✦</span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-gold/40" />
        </div>

        <div className="mt-4 flex items-baseline gap-2.5">
          <span className="font-display text-2xl font-bold text-primary">
            {formatINR(product.price)}
          </span>
          {product.salePrice ? (
            <span className="text-sm text-warmgray/80 line-through">
              {formatINR(product.salePrice)}
            </span>
          ) : null}
          <span className="ml-auto text-[10px] font-medium uppercase tracking-[0.12em] text-warmgray/70">
            incl. all taxes
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2.5 border-t border-parchment/70 pt-5">
          <Link
            href={`/checkout/product/${product.slug}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-dark px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110"
          >
            <Sparkles className="h-4 w-4 text-gold-light" />
            Buy Now
          </Link>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center gap-1 rounded-full border border-parchment bg-white px-4 py-3 text-sm font-semibold text-charcoal transition-all duration-300 hover:border-gold hover:text-primary"
            aria-label={`View ${product.title}`}
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
