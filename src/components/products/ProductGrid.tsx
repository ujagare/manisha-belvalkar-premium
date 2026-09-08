"use client";

import { useMemo, useState } from "react";
import { LayoutGrid } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/data";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

type FilterKey = "all" | ProductCategory;

const filterLabels: Record<FilterKey, string> = {
  all: "All Products",
  oracle: "Oracle & Tarot",
  book: "Books",
  ritual: "Sacred Rituals",
};

/** Stable display order for category pills. */
const categoryOrder: ProductCategory[] = ["oracle", "book", "ritual"];

interface ProductGridProps {
  products: Product[];
}

/** Storefront grid with animated category filtering. */
export default function ProductGrid({ products }: ProductGridProps) {
  const [active, setActive] = useState<FilterKey>("all");

  const visible = useMemo(
    () => (active === "all" ? products : products.filter((p) => p.category === active)),
    [products, active],
  );

  // Only show pills for categories that actually have products.
  const filters = useMemo(() => {
    const present = categoryOrder.filter((c) => products.some((p) => p.category === c));
    return [
      { key: "all" as FilterKey, label: filterLabels.all },
      ...present.map((c) => ({ key: c as FilterKey, label: filterLabels[c] })),
    ];
  }, [products]);

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActive(f.key)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300",
              active === f.key
                ? "border-primary bg-primary text-white shadow-md shadow-primary/25"
                : "border-parchment bg-white text-warmgray hover:border-gold hover:text-charcoal",
            )}
          >
            {f.key === "all" ? <LayoutGrid className="h-3.5 w-3.5" /> : null}
            {f.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-[10px] font-bold",
                active === f.key ? "bg-white/20 text-white" : "bg-primary-soft text-primary",
              )}
            >
              {f.key === "all"
                ? products.length
                : products.filter((p) => p.category === f.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
