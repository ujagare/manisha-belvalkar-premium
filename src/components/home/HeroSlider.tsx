"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Star } from "lucide-react";
import NextImage from "next/image";
import { brand, heroSlides } from "@/lib/data";
import Button from "@/components/ui/Button";
import GradientText from "@/components/ui/GradientText";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 6000;
const SWIPE_MIN_PX = 50;

const slideVariants: Variants = {
  enter: { opacity: 0, scale: 1.06, filter: "blur(8px)" },
  center: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(8px)",
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const contentVariants: Variants = {
  enter: { opacity: 0, y: 28, filter: "blur(8px)" },
  center: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.78,
      ease: [0.16, 1, 0.3, 1],
      when: "beforeChildren",
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: "blur(5px)",
    transition: { duration: 0.36, ease: [0.16, 1, 0.3, 1] },
  },
};

const itemVariants: Variants = {
  enter: { opacity: 0, y: 20 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease: [0.16, 1, 0.3, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

function SacredGeometryBackdrop() {
  return (
    <div
      className="pointer-events-none absolute -right-40 top-1/2 z-[2] aspect-square w-[min(78vw,58rem)] -translate-y-1/2 opacity-50 [mask-image:radial-gradient(circle,black_45%,transparent_75%)]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 800 800"
        className="h-full w-full animate-spin-slow text-gold-deep [animation-duration:90s] motion-reduce:animate-none"
      >
        <g fill="none" stroke="currentColor">
          <circle cx="400" cy="400" r="326" strokeWidth="1" opacity=".24" />
          <circle cx="400" cy="400" r="260" strokeWidth="1.2" opacity=".25" />
          <circle cx="400" cy="400" r="148" strokeWidth="1" opacity=".24" />
          <path d="M400 104 650 548 150 548Z" strokeWidth="1.3" opacity=".34" />
          <path d="m400 696 250-444H150Z" strokeWidth="1.3" opacity=".34" />
          <path
            d="M400 214c42 54 94 75 158 64-11 64 10 116 64 158-54 42-75 94-64 158-64-11-116 10-158 64-42-54-94-75-158-64 11-64-10-116-64-158 54-42 75-94 64-158 64 11 116-10 158-64Z"
            strokeWidth="1.1"
            opacity=".28"
          />
        </g>
      </svg>
    </div>
  );
}

function HeroGallery({
  slide,
  current,
}: {
  slide: (typeof heroSlides)[number];
  current: number;
}) {
  const isProducts = slide.layout === "products";
  const isServices = slide.layout === "services";

  return (
    <motion.div
      key={`${current}-gallery`}
      variants={contentVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className={cn(
        "relative mx-auto h-[22rem] w-full max-w-[31rem] sm:h-[28rem] lg:h-[32rem]",
        isProducts && "max-w-[34rem]",
      )}
    >
      <div className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-[90px]" />
      <div className="absolute left-[18%] top-[16%] h-36 w-36 rounded-full bg-primary/10 blur-[70px]" />

      <motion.div
        variants={itemVariants}
        className={cn(
          "absolute overflow-hidden rounded-[2rem] bg-white/70 shadow-[0_42px_100px_-48px_rgba(107,11,11,0.65)] ring-1 ring-gold/25 backdrop-blur-md",
          isProducts
            ? "left-[3%] top-[4%] h-[70%] w-[55%] p-4 sm:p-5"
            : "left-[8%] top-[2%] h-[82%] w-[58%] p-3",
          isServices && "left-[3%] top-[8%] h-[68%] w-[60%]",
        )}
      >
        <NextImage
          src={slide.gallery[0].image}
          alt={slide.gallery[0].alt}
          width={620}
          height={780}
          priority={current === 0}
          className={cn(
            "h-full w-full rounded-[1.5rem] object-cover",
            isProducts && "object-contain",
          )}
        />
      </motion.div>

      {slide.gallery.slice(1).map((item, index) => (
        <motion.figure
          key={item.image}
          variants={itemVariants}
          className={cn(
            "absolute overflow-hidden rounded-[1.4rem] bg-cream/90 p-2 shadow-[0_28px_70px_-38px_rgba(28,25,23,0.6)] ring-1 ring-gold/20 backdrop-blur-sm",
            index === 0 &&
              "right-[3%] top-[9%] h-[34%] w-[42%] rotate-2 sm:right-[5%]",
            index === 1 &&
              "bottom-[13%] right-[10%] h-[36%] w-[45%] -rotate-2",
            index === 2 &&
              "bottom-[3%] left-[10%] h-[25%] w-[42%] rotate-1",
          )}
        >
          <NextImage
            src={item.image}
            alt={item.alt}
            width={420}
            height={360}
            className={cn(
              "h-full w-full rounded-[1rem] object-cover",
              isProducts && "object-contain",
            )}
          />
          <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-primary shadow-sm">
            {item.title}
          </figcaption>
        </motion.figure>
      ))}

      <motion.div
        variants={itemVariants}
        className="absolute bottom-0 right-0 w-[78%] rounded-[1.8rem] border border-white/70 bg-white/78 p-4 shadow-[0_26px_80px_-48px_rgba(107,11,11,0.72)] backdrop-blur-xl sm:p-5"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-white shadow-lg shadow-primary/20">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-deep">
              {slide.featureLabel}
            </p>
            <p className="font-display text-xl font-bold leading-tight text-charcoal sm:text-2xl">
              {slide.featureValue}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [tabVisible, setTabVisible] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const bgParallax = useTransform(scrollY, [0, 520], [0, -90]);
  const overlayParallax = useTransform(scrollY, [0, 520], [0, 54]);
  const slide = heroSlides[current];

  const goTo = useCallback((index: number) => {
    setCurrent((active) => (active === index ? active : index));
  }, []);

  const step = useCallback((dir: 1 | -1) => {
    setCurrent((active) => (active + dir + heroSlides.length) % heroSlides.length);
  }, []);

  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    swipeStart.current = touch ? { x: touch.clientX, y: touch.clientY } : null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;

    const end = event.changedTouches[0];
    if (!end) return;

    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    step(dx < 0 ? 1 : -1);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  };

  useEffect(() => {
    const onVisibility = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!tabVisible) return;

    const timer = setTimeout(
      () => setCurrent((active) => (active + 1) % heroSlides.length),
      INTERVAL_MS,
    );
    return () => clearTimeout(timer);
  }, [current, tabVisible]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[68svh] touch-pan-y overflow-hidden bg-cream select-none sm:min-h-[82svh]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured home slides"
    >
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
          <NextImage
            src={slide.image}
            alt={`${brand.name} — ${slide.eyebrow}`}
            width={1920}
            height={1080}
            priority={current === 0}
            className="h-full w-full object-cover opacity-[0.18]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_48%_56%_at_77%_38%,rgba(221,184,41,0.34),transparent_68%),radial-gradient(ellipse_38%_42%_at_18%_18%,rgba(180,20,20,0.12),transparent_70%),linear-gradient(112deg,#fffdf8_0%,#fdf7ec_45%,#efdcc2_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(104deg,rgba(255,253,248,0.98)_0%,rgba(255,253,248,0.84)_42%,rgba(255,253,248,0.26)_74%)]" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white/85 via-cream/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <SacredGeometryBackdrop />

      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="heroSilkCrimson" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8b0f0f" stopOpacity=".2" />
            <stop offset=".55" stopColor="#d64545" stopOpacity=".11" />
            <stop offset="1" stopColor="#b41414" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="heroSilkGold" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ddb829" stopOpacity=".25" />
            <stop offset="1" stopColor="#f0d060" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M-120 760C150 570 310 870 620 720c170-82 275-44 430 34-310 7-422 172-725 126C116 849 4 930-120 946Z"
          fill="url(#heroSilkCrimson)"
        />
        <path
          d="M1260-100c75 152 260 133 420 242v252c-181-123-308-95-438-271Z"
          fill="url(#heroSilkCrimson)"
        />
        <path
          d="M1212 20c132 86 252 39 420 182"
          fill="none"
          stroke="url(#heroSilkGold)"
          strokeWidth="3"
        />
        <path
          d="M822 74c220-86 493 17 588 218"
          fill="none"
          stroke="#c9a520"
          strokeDasharray="3 12"
          strokeLinecap="round"
          strokeOpacity=".42"
        />
      </svg>

      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168,135,26,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(168,135,26,0.12) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
        }}
        aria-hidden="true"
      />
      <div className="grain" aria-hidden="true" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-4 px-5 pb-12 pt-[4.5rem] sm:min-h-[82svh] sm:px-6 sm:pb-16 sm:pt-24 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-10 lg:pb-20 lg:pt-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${current}-copy`}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-center lg:text-left"
          >
            <motion.div
              variants={itemVariants}
              className="eyebrow mb-5 flex items-center justify-center gap-4 text-gold-deep sm:mb-7 lg:justify-start"
            >
              <span className="hairline-gold w-12" />
              {slide.eyebrow}
              <span className="hairline-gold w-12 lg:block" />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-balance font-display text-[2.45rem] font-bold leading-[1.03] tracking-[-0.035em] text-charcoal sm:text-5xl md:text-6xl lg:text-[4.6rem]"
            >
              <span className="block">{slide.headline}</span>
              <span className="mt-1 block">
                <GradientText as="span" variant="crimson">
                  {slide.headlineHighlight}
                </GradientText>
              </span>
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="my-4 flex items-center justify-center gap-4 sm:my-6 lg:justify-start"
            >
              <span className="h-px w-14 bg-gold/55 sm:w-16" />
              <span className="font-serif text-2xl text-gold">{"*"}</span>
              <span className="h-px w-14 bg-gold/55 sm:w-16" />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mx-auto max-w-xl text-base leading-relaxed text-warmgray sm:text-lg lg:mx-0"
            >
              {slide.tagline}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-6 grid grid-cols-2 gap-3 sm:max-w-lg lg:mt-7"
            >
              {[
                [slide.featureLabel, slide.featureValue],
                [slide.supportingLabel, slide.supportingValue],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-gold/20 bg-white/58 p-4 text-left shadow-[0_18px_50px_-42px_rgba(107,11,11,0.55)] backdrop-blur-md"
                >
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gold-deep">
                    {label}
                  </p>
                  <p className="mt-2 font-display text-lg font-bold leading-tight text-charcoal sm:text-xl">
                    {value}
                  </p>
                </div>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:mt-8 lg:justify-start"
            >
              <Button
                href={slide.ctaHref}
                size="lg"
                variant="primary"
                className="px-8 shadow-lg shadow-primary/20 hover:-translate-y-0.5"
              >
                <Sparkles className="h-4 w-4" />
                {slide.ctaLabel}
              </Button>
              {slide.secondaryCtaHref && slide.secondaryCtaLabel ? (
                <Button
                  href={slide.secondaryCtaHref}
                  size="lg"
                  variant="outline"
                  className="bg-white/35 px-7 backdrop-blur-md hover:-translate-y-0.5"
                >
                  {slide.secondaryCtaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              ) : null}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs sm:mt-8 sm:gap-x-8 sm:text-sm lg:justify-start"
            >
              <span className="inline-flex items-center gap-1.5 text-warmgray">
                <Star className="h-4 w-4 fill-gold/60 text-gold-deep" />
                30+ Years Experience
              </span>
              <span className="inline-flex items-center gap-1.5 text-warmgray">
                <Star className="h-4 w-4 fill-gold/60 text-gold-deep" />
                {brand.role}
              </span>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <HeroGallery key={`${current}-visual`} slide={slide} current={current} />
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-3 top-1/2 z-20 hidden -translate-y-1/2 justify-between sm:flex lg:inset-x-6">
        {[
          { label: "Previous slide", direction: -1 as const, Icon: ArrowLeft },
          { label: "Next slide", direction: 1 as const, Icon: ArrowRight },
        ].map(({ label, direction, Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => step(direction)}
            className="group grid h-11 w-11 place-items-center rounded-full border border-gold/25 bg-white/55 text-primary shadow-[0_18px_50px_-34px_rgba(107,11,11,0.65)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/55 hover:bg-white/80 hover:text-primary-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:h-12 lg:w-12"
            aria-label={label}
          >
            <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
          </button>
        ))}
      </div>

      <div className="absolute bottom-16 right-5 z-20 flex items-center gap-2 sm:hidden">
        {[
          { label: "Previous slide", direction: -1 as const, Icon: ArrowLeft },
          { label: "Next slide", direction: 1 as const, Icon: ArrowRight },
        ].map(({ label, direction, Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => step(direction)}
            className="grid h-10 w-10 place-items-center rounded-full border border-gold/25 bg-white/70 text-primary shadow-lg shadow-primary/10 backdrop-blur-xl transition-all duration-300 active:scale-95"
            aria-label={label}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 sm:bottom-10">
        {heroSlides.map((item, index) => (
          <button
            key={item.layout}
            onClick={() => goTo(index)}
            className={cn(
              "rounded-full transition-all duration-500",
              index === current
                ? "h-2.5 w-10 bg-gold shadow-[0_0_12px_rgba(221,184,41,0.5)]"
                : "h-2.5 w-2.5 bg-primary/20 hover:bg-primary/45",
            )}
            aria-label={`Go to ${item.eyebrow} slide`}
          />
        ))}
      </div>

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
