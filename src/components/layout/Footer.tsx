"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowUp,
  ArrowUpRight,
  Heart,
  LogIn,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  User,
} from "lucide-react";
import { brand, navigation, services, courses } from "@/lib/data";
import GoldDivider from "../ui/GoldDivider";

const easeOut = [0.16, 1, 0.3, 1] as const;

/** Fade-and-rise reveal when the element scrolls into view. */
function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** A subtle lotus mandala drawn in gold strokes — decorative only. */
function Mandala({ className }: { className?: string }) {
  const rotations = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.4"
    >
      <g>
        {rotations.map((rot) => (
          <ellipse
            key={rot}
            cx="100"
            cy="100"
            rx="13"
            ry="50"
            transform={`rotate(${rot} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r="94" />
        <circle cx="100" cy="100" r="70" />
        <circle cx="100" cy="100" r="34" />
        <circle cx="100" cy="100" r="12" />
      </g>
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const mainRef = useRef<HTMLDivElement>(null);

  // Footer enters from the bottom of the viewport → progress 0 when its
  // top touches the viewport bottom, 1 when it fills the screen.
  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start end", "end end"],
  });
  // Watermark and mandala drift against the scroll for depth.
  const yWatermark = useTransform(scrollYProgress, [0, 1], [90, -30]);
  const yMandala = useTransform(scrollYProgress, [0, 1], [60, -20]);

  return (
    <footer className="relative overflow-hidden bg-charcoal pb-20 text-ivory/80 xl:pb-0">
      {/* ================= CTA band ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-deeper via-primary to-primary-dark">
        {/* Gold glows */}
        <div
          className="glow-gold pointer-events-none absolute -left-24 -top-24 h-80 w-80"
          aria-hidden="true"
        />
        <div
          className="glow-gold pointer-events-none absolute -bottom-32 -right-20 h-96 w-96"
          aria-hidden="true"
        />
        <svg
          viewBox="0 0 500 500"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[740px] w-[740px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow text-gold opacity-70 drop-shadow-[0_0_34px_rgba(221,184,41,0.55)] motion-reduce:animate-none"
          style={{ animationDuration: "95s" }}
          aria-hidden="true"
        >
          <g fill="none" stroke="currentColor">
            <circle cx="250" cy="250" r="214" strokeWidth="1.5" opacity=".72" />
            <circle cx="250" cy="250" r="172" strokeWidth="1.35" opacity=".58" />
            <circle cx="250" cy="250" r="116" strokeWidth="1.2" opacity=".62" />
            <circle cx="250" cy="250" r="64" strokeWidth="1.1" opacity=".55" />
            <path d="M250 50 420 350H80Z" strokeWidth="1.5" opacity=".82" />
            <path d="m250 450 170-300H80Z" strokeWidth="1.5" opacity=".82" />
            <path d="M250 116c31 40 70 56 118 48-8 48 8 87 48 118-40 31-56 70-48 118-48-8-87 8-118 48-31-40-70-56-118-48 8-48-8-87-48-118 40-31 56-70 48-118 48 8 87-8 118-48Z" strokeWidth="1.35" opacity=".66" />
            <circle cx="250" cy="250" r="88" strokeDasharray="3 10" strokeLinecap="round" strokeWidth="1.4" opacity=".78" />
          </g>
        </svg>
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl px-6 py-7 text-center lg:py-9">
          <Reveal>
            <div className="eyebrow mb-5 flex items-center justify-center gap-4 text-gold-light">
              <span className="hairline-gold w-12" />
              <Sparkles className="h-4 w-4" />
              Begin Your Journey
              <Sparkles className="h-4 w-4" />
              <span className="hairline-gold w-12" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-display text-2xl font-bold leading-[1.1] tracking-tight text-white sm:text-3xl lg:text-4xl">
              It is your own commitment
              <br />
              <span className="font-serif font-medium italic text-gold-light">
                that determines your success
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              Take the first step toward clarity, alignment, and purpose.
              Manisha is here to illuminate your path.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
              <a
                href={brand.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-deeper shadow-[0_16px_40px_-12px_rgba(221,184,41,0.7)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_20px_50px_-12px_rgba(221,184,41,0.9)]"
              >
                <MessageCircle className="h-4 w-4" />
                Book a Session
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all duration-500 hover:-translate-y-0.5 hover:border-gold hover:bg-white/10"
              >
                <Heart className="h-4 w-4 text-gold-light" />
                Ask a Question
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= Main footer ================= */}
      <div className="relative" ref={mainRef}>
        {/* Decorative background — parallax layers */}
        <motion.div
          style={{ y: yMandala }}
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <Mandala className="absolute -right-32 top-10 h-96 w-96 text-gold/[0.05]" />
        </motion.div>
        <div
          className="glow-gold pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] opacity-60"
          aria-hidden="true"
        />
        {/* Giant watermark — drifts slowly for depth */}
        <motion.span
          style={{ y: yWatermark }}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[22vw] font-bold leading-none text-white/[0.015]"
        >
          Manisha
        </motion.span>

        {/* Gold hairline on top */}
        <div
          className="h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-6 pb-6 pt-9 lg:px-10 lg:pt-11">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
            {/* Brand column */}
            <Reveal className="lg:col-span-3" delay={0}>
              <Link
                href="/"
                className="flex items-center gap-3 font-display text-3xl font-bold tracking-tight text-white transition-colors hover:text-gold-light"
              >
                <Image
                  src="/images/Logo.png"
                  alt="Manisha Belvalkar"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover ring-1 ring-gold/40"
                />
                Manisha
                <span className="font-serif font-normal italic text-gold">
                  Belvalkar
                </span>
              </Link>
              <p className="mt-1.5 text-sm leading-relaxed text-ivory/50">
                Guiding souls toward clarity, success, and self-empowerment
                through Tarot, Healing, and Well-being.
              </p>

              {/* Socials */}
              <div className="mt-3 flex items-center gap-3">
                <a
                  href={brand.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ivory/70 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-primary-deeper"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </Reveal>

            {/* Navigate */}
            <Reveal className="lg:col-span-3" delay={0.1}>
              <h4 className="mb-3 font-serif text-lg font-semibold text-white">
                Navigate
              </h4>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-1.5">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-ivory/60 transition-colors duration-300 hover:text-gold"
                    >
                      <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-4" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Offerings */}
            <Reveal className="lg:col-span-3" delay={0.2}>
              <h4 className="mb-3 font-serif text-lg font-semibold text-white">
                Offerings
              </h4>
              <ul className="space-y-1.5">
                {services.slice(0, 3).map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="group inline-flex items-center gap-1.5 text-sm text-ivory/60 transition-colors duration-300 hover:text-gold"
                    >
                      <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-4" />
                      {s.title}
                    </Link>
                  </li>
                ))}
                {courses.slice(0, 2).map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/courses/${c.slug}`}
                      className="group inline-flex items-center gap-1.5 text-sm text-ivory/60 transition-colors duration-300 hover:text-gold"
                    >
                      <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-4" />
                      {c.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/products"
                    className="group inline-flex items-center gap-1.5 text-sm text-ivory/60 transition-colors duration-300 hover:text-gold"
                  >
                    <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-4" />
                    Shop
                  </Link>
                </li>
              </ul>
            </Reveal>

            {/* Contact */}
            <Reveal className="lg:col-span-3" delay={0.3}>
              <h4 className="mb-3 font-serif text-lg font-semibold text-white">
                Connect
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href={brand.phoneHref}
                    className="group flex items-start gap-3 transition-colors duration-300 hover:text-gold"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-primary-deeper">
                      <Phone className="h-4 w-4" />
                    </span>
                    <span className="text-sm leading-relaxed">{brand.phone}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={brand.emailHref}
                    className="group flex items-start gap-3 transition-colors duration-300 hover:text-gold"
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-primary-deeper">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span className="break-all text-sm leading-relaxed">
                      {brand.email}
                    </span>
                  </a>
                </li>
                <li>
                  <div className="flex flex-col gap-2">
                    {brand.locations ? (
                      brand.locations.map((location, idx) => (
                        <a
                          key={idx}
                          href={location.mapsHref}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-start gap-3 transition-colors duration-300 hover:text-gold"
                        >
                          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-primary-deeper">
                            <MapPin className="h-4 w-4" />
                          </span>
                          <span className="text-sm leading-relaxed">{location.address}</span>
                        </a>
                      ))
                    ) : (
                      <a
                        href={brand.mapsHref}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-start gap-3 transition-colors duration-300 hover:text-gold"
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-primary-deeper">
                          <MapPin className="h-4 w-4" />
                        </span>
                        <span className="text-sm leading-relaxed">{brand.address}</span>
                      </a>
                    )}
                  </div>
                </li>
              </ul>

              <a
                href={brand.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="group mt-3 inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm font-medium text-gold transition-all duration-300 hover:bg-gold hover:text-primary-deeper"
              >
                Start your journey
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </div>

          <nav
            aria-label="Customer help"
            className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-1.5 border-t border-white/10 pt-4 text-xs text-ivory/55"
          >
            <Link className="transition-colors hover:text-gold" href="/how-it-works">How it works</Link>
            <Link className="transition-colors hover:text-gold" href="/faq">FAQ</Link>
            <Link className="transition-colors hover:text-gold" href="/testimonials">Client experiences</Link>
            <Link className="transition-colors hover:text-gold" href="/events">Live events</Link>
            <Link className="transition-colors hover:text-gold" href="/insights">Insights</Link>
            <Link className="transition-colors hover:text-gold" href="/support">Support</Link>
          </nav>

          <nav
            aria-label="Legal information"
            className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-xs text-ivory/55"
          >
            <Link className="transition-colors hover:text-gold" href="/privacy-policy">Privacy policy</Link>
            <Link className="transition-colors hover:text-gold" href="/terms-and-conditions">Terms &amp; conditions</Link>
            <Link className="transition-colors hover:text-gold" href="/refund-cancellation-policy">Refund &amp; cancellation</Link>
            <Link className="transition-colors hover:text-gold" href="/shipping-delivery-policy">Shipping &amp; delivery</Link>
            <Link className="transition-colors hover:text-gold" href="/disclaimer">Disclaimer</Link>
            <Link className="transition-colors hover:text-gold" href="/grievance-redressal">Grievance redressal</Link>
            <Link className="transition-colors hover:text-gold" href="/editorial-policy">Editorial policy</Link>
          </nav>

          <GoldDivider className="mt-6" />
        </div>
      </div>

      {/* ================= Bottom bar ================= */}
      <div className="relative border-t border-white/10 px-6 py-3 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-xs text-ivory/40 sm:flex-row sm:justify-between">
          <p>
            &copy; {year} {brand.name}. All rights reserved.
          </p>
          <p className="inline-flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-ivory/60 transition-all duration-300 hover:border-gold hover:text-gold"
            >
              <LogIn className="h-3.5 w-3.5" />
              Sign in
            </Link>
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-ivory/60 transition-all duration-300 hover:border-gold hover:text-gold"
            >
              <User className="h-3.5 w-3.5" />
              My account
            </Link>
          </p>
          <a
            href="#top"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-ivory/60 transition-all duration-300 hover:border-gold hover:text-gold"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
