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

/** Inline SVG brand icons (lucide v1 removed brand logos). */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
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
    <footer className="relative overflow-hidden bg-charcoal text-ivory/80">
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
        {/* Decorative ring */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl px-6 py-14 text-center lg:py-16">
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
            <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
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
                className="group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-primary-deeper shadow-[0_16px_40px_-12px_rgba(221,184,41,0.7)] transition-all duration-500 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_20px_50px_-12px_rgba(221,184,41,0.9)]"
              >
                <MessageCircle className="h-4 w-4" />
                Book a Session
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-4 text-sm font-semibold text-white backdrop-blur transition-all duration-500 hover:-translate-y-0.5 hover:border-gold hover:bg-white/10"
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

        <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-12 lg:px-10 lg:pt-14">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            {/* Brand column */}
            <Reveal className="lg:col-span-4" delay={0}>
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
              <p className="mt-2 text-sm leading-relaxed text-ivory/50">
                Guiding souls toward clarity, success, and self-empowerment
                through Tarot, Healing, and Well-being.
              </p>

              {/* Socials */}
              <div className="mt-5 flex items-center gap-3">
                <a
                  href={brand.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ivory/70 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-primary-deeper"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
                {/* Social placeholders — replace with real profile URLs */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ivory/70 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-primary-deeper"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ivory/70 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-primary-deeper"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-ivory/70 transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-primary-deeper"
                >
                  <YoutubeIcon className="h-4 w-4" />
                </a>
              </div>
            </Reveal>

            {/* Navigate */}
            <Reveal className="lg:col-span-2" delay={0.1}>
              <h4 className="mb-4 font-serif text-lg font-semibold text-white">
                Navigate
              </h4>
              <ul className="space-y-2.5">
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
              <h4 className="mb-4 font-serif text-lg font-semibold text-white">
                Offerings
              </h4>
              <ul className="space-y-2.5">
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
                    Products & Sacred Tools
                  </Link>
                </li>
              </ul>
            </Reveal>

            {/* Contact */}
            <Reveal className="lg:col-span-3" delay={0.3}>
              <h4 className="mb-4 font-serif text-lg font-semibold text-white">
                Connect
              </h4>
              <ul className="space-y-3">
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
                </li>
              </ul>

              <a
                href={brand.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="group mt-5 inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm font-medium text-gold transition-all duration-300 hover:bg-gold hover:text-primary-deeper"
              >
                Start your journey
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </Reveal>
          </div>

          <GoldDivider className="mt-10" />
        </div>
      </div>

      {/* ================= Bottom bar ================= */}
      <div className="relative border-t border-white/10 px-6 py-4 lg:px-10">
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
