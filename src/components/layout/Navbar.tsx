"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Compass,
  HeartPulse,
  LogIn,
  Menu,
  ShoppingBag,
  Sparkles,
  Store,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { navigation } from "@/lib/data";
import MobileMenu from "./MobileMenu";
import { useCart } from "@/components/cart/CartProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { itemCount } = useCart();

  const mobileNavigation = [
    { label: "Shakti", href: "/shakti", icon: Sparkles },
    { label: "Mentoring", href: "/mentoring", icon: Compass },
    { label: "Healing", href: "/healing", icon: HeartPulse },
    { label: "Courses", href: "/courses", icon: BookOpen },
    { label: "Shop", href: "/products", icon: Store },
  ];

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
            ? "navbar-scrolled-shadow bg-white/88 backdrop-blur-xl"
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
          <nav className="hidden items-center gap-1 xl:flex">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-3 py-2 text-[0.82rem] font-medium transition-all duration-300",
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
            <Link href="/cart" className="relative ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-parchment bg-white text-charcoal hover:border-gold hover:text-primary" aria-label={`Cart with ${itemCount} items`}>
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 ? <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">{itemCount > 99 ? "99+" : itemCount}</span> : null}
            </Link>
            <li className="ml-1 list-none">
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
          <div className="flex items-center gap-2 xl:hidden">
            <Link href="/cart" className="relative flex h-9 w-9 items-center justify-center rounded-full text-charcoal hover:bg-primary-soft" aria-label={`Cart with ${itemCount} items`}><ShoppingBag className="h-5 w-5" />{itemCount > 0 ? <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white">{itemCount}</span> : null}</Link>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className={cn(
              "relative z-50 flex h-9 w-9 items-center justify-center rounded-full transition-colors xl:hidden",
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
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      {!menuOpen ? (
        <nav
          aria-label="Mobile navigation"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-cream/95 px-2 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-12px_35px_rgba(62,38,25,0.08)] backdrop-blur-xl xl:hidden"
        >
          <div className="mx-auto grid max-w-md grid-cols-5 items-end">
            {mobileNavigation.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[0.65rem] font-semibold transition-colors active:bg-primary-soft",
                    active ? "text-primary" : "text-warmgray",
                  )}
                >
                  <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </>
  );
}
