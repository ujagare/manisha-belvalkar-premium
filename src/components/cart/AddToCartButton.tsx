"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";
import { cn } from "@/lib/utils";

export default function AddToCartButton({
  product,
  compact = false,
  className,
}: {
  product: { slug: string; title: string; image: string; price: number };
  compact?: boolean;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        addItem(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full border border-primary px-4 py-2.5 text-xs sm:text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
        className,
      )}
      aria-live="polite"
    >
      {added ? <Check className="h-3.5 w-3.5" /> : <ShoppingBag className="h-3.5 w-3.5" />}
      {added ? "Added" : compact ? "Add to Cart" : "Add to Cart"}
    </button>
  );
}
