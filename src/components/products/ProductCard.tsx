import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BookOpen, Sparkles, Gem } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";
import AddToCartButton from "@/components/cart/AddToCartButton";

/** Category chip icon + label. */
export function categoryMeta(category: ProductCategory) {
  switch (category) {
    case "oracle":
      return { icon: Sparkles, label: "Decks" };
    case "ritual":
      return { icon: Gem, label: "Rituals & Tools" };
    case "book":
      return { icon: BookOpen, label: "Books & Workshops" };
  }
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

/** Premium product card for the Products storefront grid. */
export default function ProductCard({ product, className }: ProductCardProps) {
  const meta = categoryMeta(product.category);

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
        className="relative block aspect-[4/5] overflow-hidden bg-gradient-to-b from-ivory to-cream"
        aria-label={product.title}
      >
        <Image
          src={product.image}
          alt=""
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 30vw"
          className="scale-110 object-cover opacity-35 blur-xl"
          aria-hidden="true"
        />
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 44vw, 30vw"
          className="object-contain p-2 transition-transform duration-1000 ease-out group-hover:scale-[1.03] sm:p-3"
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
          <span className="ml-auto text-[10px] font-medium uppercase tracking-[0.12em] text-warmgray/70">
            incl. all taxes
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-parchment/70 pt-4 sm:gap-2.5 sm:pt-5">
          <Link
            href={`/checkout/product/${product.slug}`}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-dark px-3 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-primary/25 transition-all duration-300 hover:shadow-lg active:scale-95 sm:py-3"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold-light" />
            Buy Now
          </Link>
          <AddToCartButton
            compact
            product={{ slug: product.slug, title: product.title, image: product.image, price: product.price }}
            className="w-full text-xs sm:text-sm py-2.5 sm:py-3"
          />
        </div>
      </div>
    </article>
  );
}
