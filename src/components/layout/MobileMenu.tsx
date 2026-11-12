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
      className="fixed inset-0 z-40 flex min-h-[100dvh] flex-col overflow-hidden bg-cream/98 backdrop-blur-xl xl:hidden"
    >
      <div className="flex h-16 items-center justify-end px-4 sm:px-6">
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-primary-soft"
          aria-label="Close menu"
        >
          <X className="h-5 w-5 text-charcoal" />
        </button>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col items-center justify-start gap-1 overflow-y-auto px-4 py-4 pb-8 sm:justify-center sm:gap-2 sm:px-6 sm:pb-16">
        {navigation.map((item, i) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex min-h-11 items-center px-4 text-xl font-medium transition-all duration-500 sm:text-2xl",
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
        <div className="mt-5 flex w-full max-w-xs flex-col gap-2.5 sm:mt-8">
          <Link
            href="/contact"
            onClick={onClose}
            className="flex min-h-11 items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-medium text-white shadow-lg transition-all hover:bg-primary-dark"
            style={{
              animation: open
                ? `fade-up 0.5s ease ${navigation.length * 0.07}s both`
                : "none",
            }}
          >
            Connect with me
          </Link>
          <div className="grid grid-cols-2 gap-2.5">
            <Link
              href="/login"
              onClick={onClose}
              className="flex min-h-11 items-center justify-center rounded-full border border-parchment bg-white px-4 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:border-gold hover:text-primary"
            >
              Sign in
            </Link>
            <Link
              href="/account"
              onClick={onClose}
              className="flex min-h-11 items-center justify-center rounded-full border border-parchment bg-white px-4 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:border-gold hover:text-primary"
            >
              My account
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
