"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 7500;

const navigationSlides = [
  {
    id: "discover",
    number: "01",
    tab: "Discover",
    eyebrow: "Meet Manisha",
    title: "A life devoted to inner clarity.",
    description:
      "Discover Dr. Manisha Belvalkar's three-decade journey through Tarot, sacred practice and holistic guidance—and the stories shaped along the way.",
    primary: { label: "Know her journey", href: "/about" },
    secondary: { label: "Client stories", href: "/testimonials" },
    links: [
      { label: "About", detail: "Her path & practice", href: "/about" },
      { label: "Media", detail: "Features & conversations", href: "/media" },
      { label: "Insights", detail: "Read and reflect", href: "/insights" },
    ],
  },
  {
    id: "guidance",
    number: "02",
    tab: "Guidance",
    eyebrow: "Guidance & healing",
    title: "Support shaped around where you are.",
    description:
      "Move from uncertainty toward grounded choices through personal consultations, energy healing and longer mentoring journeys.",
    primary: { label: "Explore services", href: "/services" },
    secondary: { label: "Book a session", href: "/contact" },
    links: [
      { label: "Healing", detail: "Restore your balance", href: "/healing" },
      { label: "Mentoring", detail: "Guided transformation", href: "/mentoring" },
      { label: "How it works", detail: "Your next steps", href: "/how-it-works" },
    ],
  },
  {
    id: "shakti",
    number: "03",
    tab: "Shakti",
    eyebrow: "Shakti & sacred tools",
    title: "Bring sacred wisdom into daily life.",
    description:
      "Enter the world of Shakti through oracle wisdom, devotional practice, considered learning and tools made for an intentional everyday ritual.",
    primary: { label: "Enter Shakti", href: "/shakti" },
    secondary: { label: "Visit the shop", href: "/products" },
    links: [
      { label: "Books", detail: "Wisdom to keep", href: "/books" },
      { label: "Courses", detail: "Learn in depth", href: "/courses" },
      { label: "SHAKTI App", detail: "Guidance in your pocket", href: "/app" },
    ],
  },
  {
    id: "connect",
    number: "04",
    tab: "Connect",
    eyebrow: "Connect & participate",
    title: "Come closer to the living community.",
    description:
      "Join live experiences, thoughtful gatherings and a community built around reflection, practice and meaningful human connection.",
    primary: { label: "Connect with Manisha", href: "/contact" },
    secondary: { label: "View live sessions", href: "/live" },
    links: [
      { label: "Events", detail: "Upcoming gatherings", href: "/events" },
      { label: "Community", detail: "Practice together", href: "/community" },
      { label: "Live", detail: "Join from anywhere", href: "/live" },
    ],
  },
] as const;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const slide = navigationSlides[current];

  const goTo = useCallback((index: number) => {
    setCurrent((index + navigationSlides.length) % navigationSlides.length);
  }, []);

  const step = useCallback((direction: 1 | -1) => {
    setCurrent(
      (active) =>
        (active + direction + navigationSlides.length) % navigationSlides.length,
    );
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setTimeout(() => step(1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [current, paused, reduceMotion, step]);

  return (
    <section
      className="relative isolate overflow-hidden bg-[#fbf7ef] text-charcoal"
      aria-roledescription="carousel"
      aria-label="Explore Manisha Belvalkar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        const end = event.changedTouches[0]?.clientX;
        touchStart.current = null;
        if (start == null || end == null || Math.abs(end - start) < 48) return;
        step(end < start ? 1 : -1);
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 78% 34%, rgba(221,184,41,0.13), transparent 27%), radial-gradient(circle at 8% 88%, rgba(180,20,20,0.055), transparent 25%)",
        }}
      />
      <div className="pointer-events-none absolute inset-y-0 left-[7%] hidden w-px bg-primary/10 lg:block" />
      <div className="pointer-events-none absolute inset-y-0 right-[7%] hidden w-px bg-primary/10 lg:block" />

      <div className="relative mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mb-14 flex items-end justify-between gap-8 border-b border-primary/15 pb-5 sm:mb-20">
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-primary">
              Explore the practice
            </p>
            <p className="mt-2 font-serif text-lg italic text-warmgray">
              Four paths, one considered journey
            </p>
          </div>
          <p className="hidden text-right text-[0.6rem] uppercase tracking-[0.22em] text-warmgray/65 sm:block">
            Select a chapter<br />to learn more
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[0.36fr_1fr] lg:gap-20 xl:gap-28">
          <nav className="border-t border-primary/15" aria-label="Explore chapters">
            {navigationSlides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(index)}
                aria-current={index === current ? "true" : undefined}
                className={cn(
                  "group relative flex w-full items-center justify-between border-b border-primary/15 py-4 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:py-5",
                  index === current
                    ? "text-primary"
                    : "text-warmgray hover:text-charcoal",
                )}
              >
                <span className="flex items-baseline gap-4">
                  <span className="font-mono text-[0.62rem] tracking-[0.18em] opacity-55">
                    {item.number}
                  </span>
                  <span className="font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
                    {item.tab}
                  </span>
                </span>
                <ArrowRight
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    index === current ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100",
                  )}
                />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px bg-primary transition-[width] duration-500",
                    index === current ? "w-full" : "w-0",
                  )}
                />
              </button>
            ))}
          </nav>

          <div className="min-h-[29rem] lg:min-h-[31rem]">
            <AnimatePresence mode="wait">
              <motion.article
                key={slide.id}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
                transition={{ duration: reduceMotion ? 0.15 : 0.62, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-4 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-gold-deep">
                  <span className="h-px w-10 bg-gold-deep/60" />
                  {slide.eyebrow}
                </div>

                <div className="mt-7 grid gap-8 xl:grid-cols-[1fr_7.5rem] xl:items-start">
                  <h2 className="max-w-4xl text-balance font-display text-[3rem] font-semibold leading-[0.96] tracking-[-0.045em] text-charcoal sm:text-6xl lg:text-[4.5rem]">
                    {slide.title}
                  </h2>
                  <div className="hidden aspect-square place-items-center rounded-full border border-gold-deep/25 text-center xl:grid">
                    <span className="font-display text-4xl text-primary/85">{slide.number}</span>
                  </div>
                </div>

                <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-warmgray sm:text-lg">
                  {slide.description}
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-5">
                  <Link
                    href={slide.primary.href}
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_-18px_rgba(107,11,11,0.55)] transition duration-300 hover:-translate-y-1 hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                  >
                    {slide.primary.label}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                  <Link
                    href={slide.secondary.href}
                    className="group inline-flex items-center gap-2 border-b border-charcoal/25 py-2 text-sm font-semibold text-charcoal transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
                  >
                    {slide.secondary.label}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>

                <div className="mt-12 grid border-y border-primary/15 sm:grid-cols-3">
                  {slide.links.map((link, index) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "group flex items-center justify-between gap-5 border-primary/15 py-5 transition-colors hover:text-primary sm:block sm:px-5",
                        index < slide.links.length - 1 && "border-b sm:border-b-0 sm:border-r",
                        index === 0 && "sm:pl-0",
                      )}
                    >
                      <span>
                        <span className="block font-display text-lg font-semibold sm:text-xl">{link.label}</span>
                        <span className="mt-1 block text-xs text-warmgray/75">{link.detail}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-gold-deep transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:mt-4" />
                    </Link>
                  ))}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-primary/15 pt-5 lg:mt-16">
          <p className="text-[0.62rem] uppercase tracking-[0.24em] text-warmgray/65">
            <span className="text-primary">{slide.number}</span> / 04
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous chapter"
              className="grid h-11 w-11 place-items-center rounded-full border border-primary/20 text-primary transition duration-300 hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next chapter"
              className="grid h-11 w-11 place-items-center rounded-full border border-primary/20 text-primary transition duration-300 hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:scale-95"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
