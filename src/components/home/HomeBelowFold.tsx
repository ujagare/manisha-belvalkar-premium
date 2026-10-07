"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slideLibrary = [
  {
    number: "02",
    tab: "Guidance",
    eyebrow: "Clarity, healing and transformation",
    title: "Find the kind of support this moment needs.",
    description: "Begin with one clear question, restore balance through energy work, or enter a deeper mentoring journey shaped around your life.",
    image: "/images/home-cards/tarot-consultation.png",
    imageClass: "object-cover",
    alt: "Tarot consultation setting from Manisha's gallery",
    primary: ["Explore all guidance", "/services"],
    secondary: ["Book a session", "/contact"],
    links: [
      ["Personal readings", "Tarot, soul purpose and clear next steps", "/services"],
      ["Energy healing", "In-person and distance support", "/healing"],
      ["Mentoring", "Longer journeys of clarity and alignment", "/mentoring"],
    ],
  },
  {
    number: "03",
    tab: "Shakti",
    eyebrow: "Sacred wisdom for everyday life",
    title: "Bring practice, learning and ritual closer.",
    description: "Discover Manisha’s world of divine feminine wisdom through Shakti, thoughtful courses, sacred tools and guidance you can return to each day.",
    image: "/images/shakti-cards-and-book.png",
    imageClass: "object-contain p-6 sm:p-10 lg:p-12",
    alt: "Shakti oracle cards and sacred tools",
    primary: ["Enter Shakti", "/shakti"],
    secondary: ["Visit the shop", "/products"],
    links: [
      ["Courses", "Learn Tarot, angels and sacred practice", "/courses"],
      ["Books & tools", "Wisdom to hold, use and revisit", "/products"],
      ["SHAKTI App", "Daily guidance in your pocket", "/app"],
    ],
  },
  {
    number: "01",
    tab: "Connect",
    eyebrow: "Meet the person behind the practice",
    title: "Know the journey. Join the living community.",
    description: "Explore Manisha’s three-decade path, hear from the people she has guided and find live ways to learn, gather and connect.",
    image: "/images/manisha-about-hero.jpg",
    imageClass: "object-cover object-[50%_28%] sm:object-center",
    alt: "Dr. Manisha Belvalkar with Tarot cards",
    primary: ["Meet Manisha", "/about"],
    secondary: ["Start a conversation", "/contact"],
    links: [
      ["Client stories", "Real experiences of clarity and change", "/testimonials"],
      ["Events & live", "Gatherings, workshops and online sessions", "/events"],
      ["Community", "Practise and grow with others", "/community"],
    ],
  },
] as const;

const slides = [slideLibrary[2], slideLibrary[0], slideLibrary[1]] as const;

export default function HomeBelowFold() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const slide = slides[current];

  const step = useCallback((direction: 1 | -1) => {
    setCurrent((value) => (value + direction + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setTimeout(() => step(1), 8000);
    return () => window.clearTimeout(timer);
  }, [current, paused, reduceMotion, step]);

  return (
    <section
      className="relative isolate overflow-hidden bg-[#f8f1e6] py-12 text-charcoal sm:py-20 lg:py-24"
      aria-roledescription="carousel"
      aria-label="Explore everything Manisha offers"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
      onTouchEnd={(event) => {
        const end = event.changedTouches[0]?.clientX;
        if (touchStart.current != null && end != null && Math.abs(end - touchStart.current) > 48) step(end < touchStart.current ? 1 : -1);
        touchStart.current = null;
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true" style={{ backgroundImage: "radial-gradient(circle at 8% 12%, rgba(180,20,20,.07), transparent 24%), radial-gradient(circle at 90% 86%, rgba(221,184,41,.15), transparent 28%)" }} />
      <div className="pointer-events-none absolute inset-y-0 left-[6%] hidden w-px bg-primary/10 lg:block" />
      <div className="pointer-events-none absolute inset-y-0 right-[6%] hidden w-px bg-primary/10 lg:block" />

      <div className="relative mx-auto max-w-[92rem] px-5 sm:px-8 lg:px-12">
        <div className="mb-6 grid gap-4 border-b border-primary/15 pb-5 sm:mb-8 sm:gap-6 sm:pb-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.18em] text-primary"><span className="h-px w-9 bg-gold-deep/70" />Everything in one place</p>
            <h2 className="mt-4 max-w-4xl text-balance font-display text-3xl font-semibold leading-none tracking-[-0.04em] sm:mt-5 sm:text-5xl lg:text-6xl">Three paths into Manisha’s world.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-warmgray lg:text-right">Choose a chapter or let the story unfold. Every service, offering and way to connect is gathered here.</p>
        </div>

        <div className="mb-5 grid grid-cols-3 gap-1 rounded-full border border-primary/15 bg-white/55 p-1 sm:mb-8">
          {slides.map((item, index) => (
            <button key={item.tab} type="button" onClick={() => setCurrent(index)} aria-current={index === current ? "true" : undefined} className={cn("flex min-h-11 items-center justify-center rounded-full px-3 py-2.5 text-left transition duration-300 sm:min-h-12 sm:justify-between sm:px-5 sm:py-3", index === current ? "bg-primary text-white shadow-[0_12px_30px_-18px_rgba(107,11,11,.65)]" : "text-warmgray hover:bg-primary-soft hover:text-primary")}>
              <span className="text-xs font-semibold sm:text-sm">{item.tab}</span><span className={cn("hidden font-serif text-lg italic sm:inline", index === current ? "text-gold-light" : "text-gold-deep")}>{item.number}</span>
            </button>
          ))}
        </div>

        <div className="overflow-hidden border border-primary/15 bg-[#fffaf3] shadow-[0_30px_90px_-55px_rgba(84,25,17,.45)]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article key={slide.number} initial={{ opacity: 0, x: reduceMotion ? 0 : 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reduceMotion ? 0 : -18 }} transition={{ duration: reduceMotion ? .12 : .55, ease: [0.16, 1, 0.3, 1] }} className="grid sm:min-h-[37rem] lg:grid-cols-[.92fr_1.08fr]" aria-live="polite">
              <div className="relative min-h-[15rem] overflow-hidden bg-primary-deeper sm:min-h-[21rem] lg:min-h-full">
                <Image src={slide.image} alt={slide.alt} fill priority={current === 0} sizes="(max-width: 1024px) 100vw, 46vw" className={slide.imageClass} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2c0908]/80 via-[#2c0908]/10 to-transparent" />
                <div className="absolute left-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-gold/45 bg-primary-deeper/65 font-serif text-xl text-gold-light backdrop-blur-sm sm:left-7 sm:top-7 sm:h-12 sm:w-12 sm:text-2xl">✦</div>
                <p className="absolute bottom-5 left-5 font-serif text-lg italic text-gold-light sm:bottom-8 sm:left-8 sm:text-2xl">Guidance for the soul</p>
              </div>

              <div className="flex flex-col p-5 sm:p-8 lg:p-10 xl:p-12">
                <div className="flex items-center justify-between gap-6"><p className="text-[0.66rem] font-semibold tracking-[0.16em] text-primary">{slide.eyebrow}</p><span className="font-serif text-4xl italic text-gold-deep/45">{slide.number}</span></div>
                <h3 className="mt-4 max-w-3xl text-balance font-display text-[2.1rem] font-semibold leading-[.98] tracking-[-0.045em] sm:mt-6 sm:text-5xl xl:text-[4rem]">{slide.title}</h3>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-warmgray sm:mt-6 sm:text-lg sm:leading-8">{slide.description}</p>
                <div className="mt-6 border-y border-primary/15 sm:mt-9">
                  {slide.links.map(([title, detail, href]) => (
                    <Link key={href + title} href={href} className="group grid grid-cols-[1fr_auto] items-center gap-2 border-b border-primary/15 py-3 last:border-b-0 sm:grid-cols-[.72fr_1fr_auto] sm:gap-5 sm:py-4">
                      <span className="font-display text-lg font-semibold tracking-[-0.02em] transition-colors group-hover:text-primary sm:text-xl">{title}</span><span className="hidden text-sm leading-6 text-warmgray sm:block">{detail}</span><ArrowUpRight className="h-4 w-4 text-gold-deep transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  ))}
                </div>
                <div className="mt-auto flex flex-col items-stretch gap-3 pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:pt-7">
                  <Link href={slide.primary[1]} className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-primary-dark">{slide.primary[0]}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                  <Link href={slide.secondary[1]} className="inline-flex items-center rounded-full border border-primary/25 px-6 py-3.5 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary-soft">{slide.secondary[0]}</Link>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 sm:mt-7 sm:gap-6">
          <div className="flex flex-1 items-center gap-3" aria-hidden="true">{slides.map((item, index) => <span key={item.number} className={cn("h-px transition-all duration-500", index === current ? "w-16 bg-primary" : "w-7 bg-primary/20")} />)}</div>
          <p className="text-[0.65rem] tracking-[0.18em] text-warmgray"><span className="font-semibold text-primary">{slide.number}</span> / 03</p>
          <div className="flex flex-1 justify-end gap-2">
            <button type="button" onClick={() => step(-1)} aria-label="Previous slide" className="grid h-11 w-11 place-items-center rounded-full border border-primary/20 text-primary transition hover:border-primary hover:bg-primary hover:text-white active:scale-95"><ArrowLeft className="h-4 w-4" /></button>
            <button type="button" onClick={() => step(1)} aria-label="Next slide" className="grid h-11 w-11 place-items-center rounded-full border border-primary/20 text-primary transition hover:border-primary hover:bg-primary hover:text-white active:scale-95"><ArrowRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
