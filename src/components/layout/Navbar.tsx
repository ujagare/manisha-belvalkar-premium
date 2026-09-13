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
  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-white/88 backdrop-blur-xl shadow-[0_1px_0_rgba(107,11,11,0.08),0_10px_35px_rgba(91,62,42,0.06)]"
            : isHome
              ? "border-b border-gold/15 bg-cream/78 backdrop-blur-xl"
              : "bg-cream",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* Logo / Brand */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2.5 text-charcoal transition-colors hover:text-primary",
            )}
          >
            <Image
              src="/images/Logo.png"
              alt="Manisha Belvalkar"
              width={36}
              height={36}
              className={cn(
                "h-9 w-9 rounded-full object-cover ring-1 ring-gold/35 shadow-sm shadow-gold/10",
              )}
            />
            <span
              className={cn(
                "flex items-baseline gap-1 font-display text-lg font-bold tracking-tight text-charcoal transition-colors",
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
                    active && "bg-primary-soft/70 text-primary",
                    !active && "text-warmgray hover:bg-white/65 hover:text-charcoal",
                  )}
                >
                  {item.label}
                  {active ? (
                    <span
                      className={cn(
                        "absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full",
                        "bg-primary",
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
                    "inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/25 active:translate-y-0",
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
              "text-charcoal hover:bg-primary-soft",
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
