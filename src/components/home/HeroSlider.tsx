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
    transition: {
      duration: 0.9,
      delay: 0.35,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.09,
      delayChildren: 0.25,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/** Child blocks inside a slide rise in sequence (stagger reveal). */
const itemVariants: Variants = {
  enter: { opacity: 0, y: 26 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

/** Layered sacred geometry that stays crisp at every viewport size. */
function SacredGeometryBackdrop() {
  return (
    <div
      className="pointer-events-none absolute -right-36 top-1/2 z-[2] aspect-square w-[min(76vw,58rem)] -translate-y-1/2 opacity-55 [mask-image:radial-gradient(circle,black_48%,transparent_74%)]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 800 800" className="h-full w-full animate-spin-slow text-gold-deep [animation-duration:80s] motion-reduce:animate-none">
        <g fill="none" stroke="currentColor">
          <circle cx="400" cy="400" r="326" strokeWidth="1" opacity=".28" />
          <circle cx="400" cy="400" r="282" strokeWidth="1.5" opacity=".24" />
          <circle cx="400" cy="400" r="212" strokeWidth="1" opacity=".3" />
          <circle cx="400" cy="400" r="118" strokeWidth="1" opacity=".24" />
          <path d="M400 100 650 550 150 550Z" strokeWidth="1.4" opacity=".34" />
          <path d="m400 700 250-450H150Z" strokeWidth="1.4" opacity=".34" />
          <path d="m400 156 207 368H193Z" strokeWidth=".9" opacity=".22" />
          <path d="m400 644 207-368H193Z" strokeWidth=".9" opacity=".22" />
          <path d="M400 214c42 54 94 75 158 64-11 64 10 116 64 158-54 42-75 94-64 158-64-11-116 10-158 64-42-54-94-75-158-64 11-64-10-116-64-158 54-42 75-94 64-158 64 11 116-10 158-64Z" strokeWidth="1.2" opacity=".26" />
        </g>
        {Array.from({ length: 16 }).map((_, index) => {
          const angle = (index * Math.PI * 2) / 16;
          const x = 400 + Math.cos(angle) * 326;
          const y = 400 + Math.sin(angle) * 326;
          return <circle key={index} cx={x} cy={y} r="4" fill="currentColor" opacity=".42" />;
        })}
      </svg>
    </div>
  );
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [tabVisible, setTabVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const bgParallax = useTransform(scrollY, [0, 500], [0, -100]);
  const overlayParallax = useTransform(scrollY, [0, 500], [0, 60]);

  const slide = heroSlides[current];

  const goTo = useCallback((index: number) => {
    setCurrent((c) => (c === index ? c : index));
  }, []);

  // Pause auto-rotation only when the tab is hidden.
  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Auto-rotation — the timer re-arms on every slide change, so a manual
  // dot click restarts the full interval instead of fighting the old one.
  useEffect(() => {
    if (!tabVisible) return;
    const t = setTimeout(
      () => setCurrent((c) => (c + 1) % heroSlides.length),
      INTERVAL_MS,
    );
    return () => clearTimeout(t);
  }, [current, tabVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[68svh] overflow-hidden bg-cream sm:min-h-svh"
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_52%_62%_at_78%_43%,rgba(221,184,41,0.32),transparent_66%),radial-gradient(ellipse_38%_40%_at_64%_64%,rgba(180,20,20,0.13),transparent_72%),radial-gradient(ellipse_50%_46%_at_5%_92%,rgba(201,165,32,0.18),transparent_70%),linear-gradient(118deg,#fffdf8_0%,#fdf7ec_43%,#efdfc8_100%)]" />
          {/* Dark overlay gradient — deeper at bottom for readability */}
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(255,253,248,0.96)_0%,rgba(255,253,248,0.72)_42%,rgba(255,253,248,0.03)_69%)]" />
          {/* Premium cinematic layers — ken-burns aura + vignette + gold glow */}
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white/80 via-cream/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <SacredGeometryBackdrop />

      {/* Flowing silk and orbital lines give the light canvas ceremonial depth. */}
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="silkCrimson" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8b0f0f" stopOpacity=".2" />
            <stop offset=".55" stopColor="#d64545" stopOpacity=".12" />
            <stop offset="1" stopColor="#b41414" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="silkGold" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ddb829" stopOpacity=".26" />
            <stop offset="1" stopColor="#f0d060" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M-120 760C150 570 310 870 620 720c170-82 275-44 430 34-310 7-422 172-725 126C116 849 4 930-120 946Z" fill="url(#silkCrimson)" />
        <path d="M-80 807c221-146 376 82 650-30" fill="none" stroke="#c9a520" strokeOpacity=".32" strokeWidth="2" />
        <path d="M1260-100c75 152 260 133 420 242v252c-181-123-308-95-438-271Z" fill="url(#silkCrimson)" />
        <path d="M1212 20c132 86 252 39 420 182" fill="none" stroke="url(#silkGold)" strokeWidth="3" />
        <path d="M822 74c220-86 493 17 588 218" fill="none" stroke="#c9a520" strokeDasharray="3 12" strokeLinecap="round" strokeOpacity=".46" />
        <circle cx="1408" cy="292" r="6" fill="#ddb829" fillOpacity=".7" />
        <circle cx="1284" cy="118" r="4" fill="#ddb829" fillOpacity=".55" />
        <circle cx="1024" cy="78" r="3" fill="#ddb829" fillOpacity=".5" />
      </svg>

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
            className={cn("absolute rounded-full bg-gold/35 animate-float", p.s)}
            style={{ left: p.l, top: p.t, animationDelay: p.d }}
          />
        ))}
      </div>

      {/* Subtle hairline grid */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.24]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168,135,26,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(168,135,26,0.12) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
        aria-hidden="true"
      />

      {/* ============ Content ============ */}
      {slide.bookImage ? (
        /* ---------- Premium product slide: copy left, book right ---------- */
        <div className="relative z-10 mx-auto grid min-h-0 max-w-7xl items-center gap-5 px-5 pb-12 pt-[4.5rem] sm:min-h-svh sm:gap-8 sm:px-6 sm:pb-24 sm:pt-28 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:pb-28 lg:pt-36">
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
              <motion.div
                variants={itemVariants}
                className="eyebrow mb-6 items-center justify-center gap-4 text-gold-deep lg:justify-start"
              >
                <span className="hairline-gold w-12" />
                {slide.eyebrow}
                <span className="hairline-gold w-12 lg:block" />
              </motion.div>

              {/* Heading */}
              <motion.h1
                variants={itemVariants}
                className="text-balance font-display text-[2.6rem] font-bold leading-[1.04] tracking-[-0.035em] text-charcoal sm:text-5xl lg:text-6xl xl:text-7xl"
              >
                <span className="block">{slide.headline}</span>
                <span className="mt-1 block">
                  <GradientText as="span" variant="crimson">
                    {slide.headlineHighlight}
                  </GradientText>
                </span>
              </motion.h1>

              {/* Book name + info */}
              <motion.p
                variants={itemVariants}
                className="mt-4 font-serif text-lg font-semibold italic text-primary sm:mt-7 sm:text-2xl lg:text-3xl"
              >
                {slide.bookTitle}
              </motion.p>
              <motion.p
                variants={itemVariants}
                className="mt-2 text-xs uppercase tracking-[0.18em] text-warmgray sm:mt-3 sm:text-sm"
              >
                {slide.bookInfo}
              </motion.p>

              {/* Gold ornamental divider */}
              <motion.div
                variants={itemVariants}
                className="my-3 flex items-center justify-center gap-4 sm:my-7 lg:justify-start"
              >
                <span className="h-px w-12 bg-gold/50 sm:w-16" />
                <span className="font-serif text-2xl text-gold">✦</span>
                <span className="h-px w-12 bg-gold/50 sm:w-16" />
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="mx-auto max-w-xl text-sm leading-relaxed text-warmgray sm:text-base lg:text-lg lg:mx-0"
              >
                {slide.tagline}
              </motion.p>

              {/* Price + CTA */}
              <motion.div
                variants={itemVariants}
                className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:mt-9 sm:gap-5 lg:justify-start"
              >
                <Button href={slide.ctaHref} size="lg" variant="primary" className="px-7 shadow-lg shadow-primary/20 hover:-translate-y-0.5 sm:px-9">
                  <Sparkles className="h-4 w-4" />
                  {slide.ctaLabel}
                </Button>
                {slide.bookPrice ? (
                  <span className="font-display text-2xl font-bold text-charcoal sm:text-3xl">
                    {slide.bookPrice}
                    <span className="ml-2 align-middle text-sm font-medium text-warmgray">
                      incl. all taxes
                    </span>
                  </span>
                ) : null}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Book art */}
          <div className="relative flex items-center justify-center">
            {/* Ambient gold glow */}
            <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-[90px]" />
            <div className="absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[70px]" />
            <div className="absolute bottom-[1%] left-1/2 hidden h-16 w-[78%] -translate-x-1/2 rounded-[50%] border border-gold/40 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(229,208,172,0.72))] shadow-[0_22px_45px_rgba(107,11,11,0.15),inset_0_2px_0_rgba(255,255,255,0.9)] sm:block" />
            <div className="absolute bottom-[-1%] left-1/2 hidden h-5 w-[66%] -translate-x-1/2 rounded-[50%] bg-primary/15 blur-xl sm:block" />

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
                    <span className="absolute -right-2 -top-3 z-10 rotate-3 rounded-full border border-gold/40 bg-white/90 px-3.5 py-1.5 font-display text-xs font-bold text-primary shadow-lg shadow-gold/15 backdrop-blur-md sm:-right-3 sm:-top-4 sm:px-5 sm:py-2 sm:text-sm">
                      ✦ {slide.bookBadge}
                    </span>
                  ) : null}

                  <div className="relative overflow-hidden rounded-2xl shadow-[0_40px_90px_-30px_rgba(107,11,11,0.38)] ring-1 ring-gold/15">
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
                          ? "w-[190px] sm:w-[380px] lg:w-[500px] xl:w-[580px]"
                          : "w-[165px] sm:w-[340px] lg:w-[400px] xl:w-[440px]",
                      )}
                    />
                    {/* Spine highlight */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />
                    {/* Sheen */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25 opacity-40" />
                  </div>

                  {/* Floor reflection */}
                  <div className="mx-auto mt-2 h-9 w-3/4 rounded-[100%] bg-primary/15 blur-xl" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* ---------- Standard centered slide ---------- */
        <div className="relative z-10 mx-auto flex min-h-0 max-w-3xl items-center justify-center px-5 pb-12 pt-[4.5rem] text-center sm:min-h-svh sm:px-6 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-36">
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
              <motion.div variants={itemVariants} className="eyebrow mb-6 flex items-center justify-center gap-4 text-gold-deep sm:mb-8">
                <span className="hairline-gold w-12" />
                {slide.eyebrow}
                <span className="hairline-gold w-12" />
              </motion.div>

              {/* Heading */}
              <motion.h1
                variants={itemVariants}
                className="text-balance font-display text-[2.6rem] font-bold leading-[1.04] tracking-[-0.035em] text-charcoal sm:text-6xl md:text-7xl lg:text-[5.25rem]"
              >
                <span className="block">{slide.headline}</span>
                <span className="mt-1 block">
                  <GradientText as="span" variant="crimson">
                    {slide.headlineHighlight}
                  </GradientText>
                </span>
              </motion.h1>

              {/* Gold ornamental divider */}
              <motion.div variants={itemVariants} className="my-5 flex items-center justify-center gap-4 sm:my-8">
                <span className="h-px w-16 bg-gold/50" />
                <span className="font-serif text-2xl text-gold">✦</span>
                <span className="h-px w-16 bg-gold/50" />
              </motion.div>

              {/* Name */}
              <motion.p variants={itemVariants} className="font-serif text-xl font-medium italic text-primary sm:text-2xl">
                — {brand.name} —
              </motion.p>

              {/* Tagline */}
              <motion.p variants={itemVariants} className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-warmgray sm:text-lg">
                {slide.tagline}
              </motion.p>

              {/* CTA */}
              <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button href={slide.ctaHref} size="lg" variant="primary" className="px-9 shadow-lg shadow-primary/20 hover:-translate-y-0.5">
                  <Sparkles className="h-4 w-4" />
                  {slide.ctaLabel}
                </Button>
              </motion.div>

              {/* Trust stats row */}
              <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:mt-12 sm:gap-x-8 sm:text-sm">
                <span className="inline-flex items-center gap-1.5 text-warmgray">
                  <Star className="h-4 w-4 fill-gold/60 text-gold-deep" />
                  30+ Years Experience
                </span>
                <span className="inline-flex items-center gap-1.5 text-warmgray">
                  <Star className="h-4 w-4 fill-gold/60 text-gold-deep" />
                  PhD in Tarot Reading
                </span>
                <span className="inline-flex items-center gap-1.5 text-warmgray">
                  <Star className="h-4 w-4 fill-gold/60 text-gold-deep" />
                  4 Sacred Practices
                </span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ============ Navigation dots ============ */}
      <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 flex items-center gap-3 sm:bottom-10">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              "rounded-full transition-all duration-500",
              i === current
                ? "h-2.5 w-10 bg-gold shadow-[0_0_12px_rgba(221,184,41,0.5)]"
                : "h-2.5 w-2.5 bg-primary/20 hover:bg-primary/45",
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
          className="group hidden flex-col items-center gap-2 pb-6 text-[0.6rem] uppercase tracking-[0.25em] text-warmgray/60 transition-colors hover:text-primary sm:inline-flex"
        >
          Scroll
          <span className="block h-9 w-px bg-gradient-to-b from-gold-deep/60 to-transparent transition-colors duration-300 group-hover:from-primary" />
        </a>
      </motion.div>
    </section>
  );
}
