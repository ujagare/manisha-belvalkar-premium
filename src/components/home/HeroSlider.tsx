"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import NextImage from "next/image";
import { heroSlides, brand } from "@/lib/data";
import Button from "@/components/ui/Button";
import GradientText from "@/components/ui/GradientText";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 5000;

const slideVariants: Variants = {
  enter: { opacity: 0, scale: 1.12 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const contentVariants: Variants = {
  enter: { opacity: 0, y: 30 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { scrollY } = useScroll();
  const bgParallax = useTransform(scrollY, [0, 500], [0, -100]);
  const overlayParallax = useTransform(scrollY, [0, 500], [0, 60]);

  const slide = heroSlides[current];

  const goTo = useCallback((index: number) => {
    if (index === current) return;
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % heroSlides.length);
  }, []);

  // Auto-rotation
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, next]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-charcoal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ============ Background image crossfade ============ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
          style={{ y: bgParallax }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          {/* Dark overlay gradient — deeper at bottom for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/70" />
          {/* Premium cinematic layers — ken-burns aura + vignette + gold glow */}
          <div className="absolute inset-0 animate-ken-burns bg-[radial-gradient(ellipse_60%_50%_at_70%_45%,rgba(221,184,41,0.16),transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_50%,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Ambient floating gold particles (premium depth) */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
        {[
          { l: "12%", t: "28%", d: "0s", s: "h-1.5 w-1.5" },
          { l: "22%", t: "62%", d: "1.6s", s: "h-1 w-1" },
          { l: "38%", t: "18%", d: "3.1s", s: "h-1 w-1" },
          { l: "68%", t: "24%", d: "0.9s", s: "h-1.5 w-1.5" },
          { l: "82%", t: "55%", d: "2.4s", s: "h-1 w-1" },
          { l: "90%", t: "36%", d: "4s", s: "h-1.5 w-1.5" },
          { l: "48%", t: "74%", d: "1.2s", s: "h-1 w-1" },
        ].map((p, i) => (
          <span
            key={i}
            className={cn("absolute rounded-full bg-gold/70 animate-float", p.s)}
            style={{ left: p.l, top: p.t, animationDelay: p.d }}
          />
        ))}
      </div>

      {/* Subtle hairline grid */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(221,184,41,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(221,184,41,0.3) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
        }}
        aria-hidden="true"
      />

      {/* ============ Content ============ */}
      {slide.bookImage ? (
        /* ---------- Premium product slide: copy left, book right ---------- */
        <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 pb-24 pt-28 lg:grid-cols-2 lg:gap-16 lg:pb-28 lg:pt-36">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="text-center lg:text-left"
            >
              {/* Eyebrow */}
              <div className="eyebrow mb-6 items-center justify-center gap-4 text-gold lg:justify-start">
                <span className="hairline-gold w-12" />
                {slide.eyebrow}
                <span className="hairline-gold w-12 lg:block" />
              </div>

              {/* Heading */}
              <h1 className="font-display text-5xl font-bold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl">
                <span className="block">{slide.headline}</span>
                <span className="mt-1 block">
                  <GradientText as="span" variant="gold">
                    {slide.headlineHighlight}
                  </GradientText>
                </span>
              </h1>

              {/* Book name + info */}
              <p className="mt-7 font-serif text-2xl font-medium italic text-gold sm:text-3xl">
                {slide.bookTitle}
              </p>
              <p className="mt-3 text-sm uppercase tracking-[0.18em] text-white/50">
                {slide.bookInfo}
              </p>

              {/* Gold ornamental divider */}
              <div className="my-7 flex items-center justify-center gap-4 lg:justify-start">
                <span className="h-px w-16 bg-gold/50" />
                <span className="font-serif text-2xl text-gold">✦</span>
                <span className="h-px w-16 bg-gold/50" />
              </div>

              <p className="mx-auto max-w-xl text-base leading-relaxed text-white/65 sm:text-lg lg:mx-0">
                {slide.tagline}
              </p>

              {/* Price + CTA */}
              <div className="mt-9 flex flex-wrap items-center justify-center gap-5 lg:justify-start">
                <Button href={slide.ctaHref} size="lg" variant="gold">
                  <Sparkles className="h-4 w-4" />
                  {slide.ctaLabel}
                </Button>
                {slide.bookPrice ? (
                  <span className="font-display text-3xl font-bold text-white">
                    {slide.bookPrice}
                    <span className="ml-2 align-middle text-sm font-medium text-white/50">
                      incl. all taxes
                    </span>
                  </span>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Book art */}
          <div className="relative flex items-center justify-center">
            {/* Ambient gold glow */}
            <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/25 blur-[90px]" />
            <div className="absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[70px]" />

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 40, rotate: 2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <motion.div
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  {/* Floating badge */}
                  {slide.bookBadge ? (
                    <span className="absolute -right-5 -top-5 z-10 rotate-3 rounded-full bg-gold px-5 py-2 font-display text-sm font-bold text-primary-deeper shadow-xl shadow-black/40">
                      ✦ {slide.bookBadge}
                    </span>
                  ) : null}

                  <div className="relative overflow-hidden rounded-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/15">
                    <NextImage
                      src={slide.bookImage}
                      alt={slide.bookTitle ?? "SHAKTI book"}
                      width={520}
                      height={680}
                      priority={current === 0}
                      loading="eager"
                      className={cn(
                        "h-auto object-cover",
                        slide.bookLarge
                          ? "w-[340px] sm:w-[420px] lg:w-[580px]"
                          : "w-[300px] sm:w-[380px] lg:w-[440px]",
                      )}
                    />
                    {/* Spine highlight */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
                    {/* Sheen */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25 opacity-40" />
                  </div>

                  {/* Floor reflection */}
                  <div className="mx-auto mt-2 h-10 w-3/4 rounded-[100%] bg-black/60 blur-xl" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* ---------- Standard centered slide ---------- */
        <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 pb-24 pt-28 text-center lg:pb-28 lg:pt-36">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              variants={contentVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              {/* Eyebrow */}
              <div className="eyebrow mb-8 flex items-center justify-center gap-4 text-gold">
                <span className="hairline-gold w-12" />
                {slide.eyebrow}
                <span className="hairline-gold w-12" />
              </div>

              {/* Heading */}
              <h1 className="font-display text-5xl font-bold leading-[1.06] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.25rem]">
                <span className="block">{slide.headline}</span>
                <span className="mt-1 block">
                  <GradientText as="span" variant="gold">
                    {slide.headlineHighlight}
                  </GradientText>
                </span>
              </h1>

              {/* Gold ornamental divider */}
              <div className="my-8 flex items-center justify-center gap-4">
                <span className="h-px w-16 bg-gold/50" />
                <span className="font-serif text-2xl text-gold">✦</span>
                <span className="h-px w-16 bg-gold/50" />
              </div>

              {/* Name */}
              <p className="font-serif text-xl font-medium italic text-white/70 sm:text-2xl">
                — {brand.name} —
              </p>

              {/* Tagline */}
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
                {slide.tagline}
              </p>

              {/* CTA */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button href={slide.ctaHref} size="lg" variant="gold">
                  <Sparkles className="h-4 w-4" />
                  {slide.ctaLabel}
                </Button>
              </div>

              {/* Trust stats row */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
                <span className="inline-flex items-center gap-1.5 text-white/50">
                  <Star className="h-4 w-4 fill-gold/60 text-gold-deep" />
                  30+ Years Experience
                </span>
                <span className="inline-flex items-center gap-1.5 text-white/50">
                  <Star className="h-4 w-4 fill-gold/60 text-gold-deep" />
                  PhD in Tarot Reading
                </span>
                <span className="inline-flex items-center gap-1.5 text-white/50">
                  <Star className="h-4 w-4 fill-gold/60 text-gold-deep" />
                  4 Sacred Practices
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ============ Navigation dots ============ */}
      <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2 flex items-center gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "rounded-full transition-all duration-500",
              i === current
                ? "h-2.5 w-10 bg-gold shadow-[0_0_12px_rgba(221,184,41,0.5)]"
                : "h-2.5 w-2.5 bg-white/30 hover:bg-white/60",
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ============ Scroll indicator ============ */}
      <motion.div
        style={{ y: overlayParallax }}
        className="absolute bottom-0 left-1/2 z-10 -translate-x-1/2"
      >
        <a
          href="#about"
          className="group inline-flex flex-col items-center gap-2 pb-6 text-[0.6rem] uppercase tracking-[0.25em] text-white/30 transition-colors hover:text-gold"
        >
          Scroll
          <span className="block h-9 w-px bg-gradient-to-b from-gold/60 to-transparent transition-colors duration-300 group-hover:from-gold" />
        </a>
      </motion.div>
    </section>
  );
}