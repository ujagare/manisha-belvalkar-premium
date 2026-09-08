"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogIn, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navigation } from "@/lib/data";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Home hero is dark (charcoal + white text) — at the top, navbar uses light text;
  // once scrolled (white bar) or on other pages, dark text.
  const brandMuted = isHome && !scrolled;
  const brandActive = !brandMuted;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-white/80 backdrop-blur-lg shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : isHome
              ? "bg-gradient-to-b from-charcoal/60 via-charcoal/25 to-transparent"
              : "bg-cream",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* Logo / Brand */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2.5 transition-colors",
              brandActive && "hover:text-primary",
            )}
          >
            <Image
              src="/images/Logo.png"
              alt="Manisha Belvalkar"
              width={36}
              height={36}
              className={cn(
                "h-9 w-9 rounded-full object-cover ring-1",
                brandMuted ? "ring-white/30" : "ring-black/10",
              )}
            />
            <span
              className={cn(
                "flex items-baseline gap-1 font-display text-lg font-bold tracking-tight transition-colors",
                brandMuted && "text-white",
                brandActive && "text-charcoal",
              )}
            >
              Manisha
              <span className="font-serif font-normal italic text-gold">
                Belvalkar
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                    active && (brandMuted ? "text-white" : "text-primary"),
                    !active && brandMuted && "text-white/75 hover:text-white",
                    !active && brandActive && "text-warmgray hover:text-charcoal",
                  )}
                >
                  {item.label}
                  {active ? (
                    <span
                      className={cn(
                        "absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full",
                        brandMuted ? "bg-gold" : "bg-primary",
                      )}
                    />
                  ) : null}
                </Link>
              );
            })}
            <li className="ml-3 list-none">
                <Link
                  href="/login"
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium shadow-md transition-all duration-300 hover:shadow-lg",
                    brandMuted
                      ? "bg-gold text-primary-deeper hover:bg-gold-light"
                      : "bg-primary text-white hover:bg-primary-dark",
                  )}
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              </li>
          </nav>

          {/* Mobile toggle — desktop pe nahi dikhta */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={cn(
              "relative z-50 flex h-9 w-9 items-center justify-center rounded-full transition-colors md:hidden",
              brandMuted
                ? "text-white hover:bg-white/10"
                : "text-charcoal hover:bg-primary-soft",
            )}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}