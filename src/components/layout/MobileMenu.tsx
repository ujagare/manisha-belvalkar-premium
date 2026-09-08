"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigation } from "@/lib/data";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 flex flex-col bg-cream/98 backdrop-blur-xl md:hidden"
    >
      <div className="flex h-16 items-center justify-end px-6">
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-primary-soft"
          aria-label="Close menu"
        >
          <X className="h-5 w-5 text-charcoal" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col items-center justify-center gap-2 pb-16">
        {navigation.map((item, i) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "text-2xl font-medium transition-all duration-500",
                active
                  ? "font-display text-primary"
                  : "text-warmgray hover:text-charcoal",
              )}
              style={{
                animation: open
                  ? `fade-up 0.5s ease ${i * 0.07}s both`
                  : "none",
              }}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/contact"
          onClick={onClose}
          className="mt-8 rounded-full bg-primary px-10 py-4 text-lg font-medium text-white shadow-lg transition-all hover:bg-primary-dark"
          style={{
            animation: open
              ? `fade-up 0.5s ease ${navigation.length * 0.07}s both`
              : "none",
          }}
        >
          Connect with me
        </Link>
      </nav>
    </div>
  );
}