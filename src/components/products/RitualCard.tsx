"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";
import type { Product } from "@/lib/data";
import { formatINR, cn } from "@/lib/utils";
import AddToCartButton from "@/components/cart/AddToCartButton";

interface RitualCardProps {
  product: Product;
  className?: string;
}

export default function RitualCard({ product, className }: RitualCardProps) {
  const isWorkshop = product.slug === "whatsapp-workshops";

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl sm:rounded-[2rem] p-1.5 sm:p-2.5",
        "bg-gradient-to-b from-[#f8f1e6] via-[#fdfaf5] to-[#f4e8d8]",
        "border border-gold/35 shadow-[0_8px_30px_-12px_rgba(107,11,11,0.12)]",
        "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        "hover:-translate-y-1.5 hover:border-gold/70 hover:shadow-[0_24px_60px_-16px_rgba(221,184,41,0.35)]",
        className,
      )}
    >
      {/* Inner Core (Double-Bezel Architecture) */}
      <div className="flex h-full flex-col rounded-[calc(1rem+4px)] sm:rounded-[calc(2rem-0.625rem)] border border-gold/15 bg-gradient-to-b from-white via-[#fffdfa] to-[#fcf9f4] p-4 sm:p-6 shadow-[inset_0_1px_2px_rgba(255,255,255,0.95)]">
        
        {/* ============ Elevated Media Window ============ */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-[16/10] overflow-hidden rounded-xl sm:rounded-[1.25rem] bg-gradient-to-b from-ivory to-cream ring-1 ring-gold/25 shadow-sm"
          aria-label={product.title}
        >
          <Image
            src={product.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="scale-110 object-cover opacity-35 blur-xl"
            aria-hidden="true"
          />
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-1.5 transition-transform duration-700 ease-out group-hover:scale-[1.03] sm:p-2"
          />

          {/* Golden radial ambient aura blooming on hover */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_100%,rgba(221,184,41,0.32),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          
          {/* Subtle bottom gradient */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />

          {/* Top-left: Sacred Badge */}
          <span className="absolute left-2.5 top-2.5 sm:left-3.5 sm:top-3.5 inline-flex items-center gap-1.5 rounded-full border border-gold/45 bg-charcoal/70 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-gold-light shadow-md backdrop-blur-md">
            <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gold" />
            {isWorkshop ? "Guided Workshop" : "Sacred Ritual"}
          </span>

          {/* Bottom-right: Interactive View Pill */}
          <span className="pointer-events-none absolute bottom-2.5 right-2.5 hidden sm:inline-flex translate-y-2 items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-primary opacity-0 shadow-lg backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            Details
            <ArrowUpRight className="h-3 w-3" />
          </span>
        </Link>

        {/* ============ Card Content ============ */}
        <div className="mt-4 sm:mt-5 flex flex-1 flex-col">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-gold-dark">
            <span className="h-px w-5 sm:w-6 bg-gold/60" />
            <span>{isWorkshop ? "Interactive Learning" : "Energy Healing"}</span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="mt-1.5 sm:mt-2 block">
            <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight text-charcoal transition-colors duration-300 group-hover:text-primary sm:text-[1.55rem]">
              {product.title}
            </h3>
          </Link>

          {/* Subtitle */}
          <p className="mt-1 font-serif text-xs sm:text-[14px] italic leading-relaxed text-warmgray line-clamp-2">
            {product.subtitle}
          </p>

          {/* Key Feature Micro-Chips */}
          {product.details && product.details.length > 0 ? (
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5">
              {product.details.slice(0, 3).map((detail, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full border border-gold/25 bg-[#faf5ed] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-[11px] font-medium text-charcoal/85 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <span className="text-[9px] sm:text-[10px] text-gold-dark">✦</span>
                  {detail}
                </span>
              ))}
            </div>
          ) : null}

          {/* Ornamental Hairline Divider */}
          <div className="my-3.5 sm:my-5 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/30 to-gold/30" />
            <span className="font-serif text-xs text-gold">✦</span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/30 to-gold/30" />
          </div>

          {/* Price & Action Strip */}
          <div className="mt-auto flex flex-col gap-3 pt-1">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="block font-serif text-[10px] sm:text-xs italic text-warmgray">Offering price</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-xl sm:text-2xl font-bold text-primary">
                    {formatINR(product.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Responsive Touch-Friendly Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              <AddToCartButton
                product={{ slug: product.slug, title: product.title, image: product.image, price: product.price }}
                compact
                className="w-full text-xs sm:text-sm py-2.5 sm:py-2.5"
              />
              <Link
                href={`/checkout/product/${product.slug}`}
                className="group/btn inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all duration-300 hover:bg-primary-dark hover:shadow-lg active:scale-95"
              >
                <span>Buy Now</span>
                <span className="grid h-4 w-4 sm:h-5 sm:w-5 place-items-center rounded-full bg-white/20 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
                  <ArrowUpRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </article>
  );
}
