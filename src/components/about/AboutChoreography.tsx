"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpenText,
  Heart,
  Home as HomeIcon,
  Sparkles,
} from "lucide-react";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "@/app/about/page.module.css";

interface AwardInfo {
  title: string;
  description: string;
}

interface AboutChoreographyProps {
  award?: AwardInfo;
  whatsappHref: string;
}

const expertise = [
  {
    icon: BookOpenText,
    title: "Tarot consultation",
    text: "A focused reading that brings context, clarity and direction to the questions shaping your life.",
  },
  {
    icon: Sparkles,
    title: "Soul purpose reading",
    text: "A deeper look at your natural gifts, recurring patterns and the path that feels most aligned.",
  },
  {
    icon: HomeIcon,
    title: "Goddess attunement",
    text: "A sacred practice for connecting with divine feminine energy, inner strength and spiritual support.",
  },
  {
    icon: Heart,
    title: "Chakra therapy",
    text: "Gentle energy work created to restore balance, vitality and a stronger sense of inner steadiness.",
  },
];

const milestones = [
  [
    "1990s",
    "The practice begins",
    "Manisha starts exploring Tarot, energy work and ancient wisdom traditions.",
  ],
  [
    "2000s",
    "Study becomes mastery",
    "Years of research shape a personal approach to Tarot, attunement and chakra work.",
  ],
  [
    "2010s",
    "Recognition follows",
    "A PhD in Tarot Reading and features in leading publications bring wider recognition.",
  ],
  [
    "Today",
    "The work continues",
    "Private sessions, mentoring, courses and Shakti carry the practice to a global community.",
  ],
] as const;

const stats = [
  ["30+", "Years of practice"],
  ["PhD", "in Tarot Reading"],
  ["04", "Core disciplines"],
] as const;

const manifestoWordsFirst = "Clarity begins when you learn to hear".split(" ");
const manifestoWordsAccent = "your own wisdom.".split(" ");
const lifeQuoteWords =
  "“The experience of the divine happens every day, in each moment. It is not something that you achieve.”".split(
    " ",
  );

function Ornament({ animated = false }: { animated?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center gap-2 text-[#ddb829] sm:gap-3"
    >
      <span
        data-ornament-line={animated ? "true" : undefined}
        className="h-px w-7 origin-right bg-current will-change-transform sm:w-10"
      />
      <Sparkles className="size-3.5 stroke-[1.4] sm:size-4" />
      <span
        data-ornament-line={animated ? "true" : undefined}
        className="h-px w-7 origin-left bg-current will-change-transform sm:w-10"
      />
    </span>
  );
}

function Mandala() {
  const point = (angle: number, radius: number) =>
    `${(Math.cos(angle) * radius).toFixed(2)} ${(Math.sin(angle) * radius).toFixed(2)}`;
  const ring = (count: number, inner: number, outer: number, width = 1) =>
    Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2;
      const spread = (Math.PI / count) * width;
      return `M${point(angle - spread, inner)} Q${point(angle, outer + (outer - inner) * 0.4)} ${point(angle + spread, inner)}`;
    });

  return (
    <svg
      data-mandala
      className={`${styles.mandala} will-change-transform`}
      viewBox="-100 -100 200 200"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      {[96, 88, 60, 34, 18].map((radius) => (
        <circle key={radius} r={radius} strokeWidth="0.35" />
      ))}
      {ring(16, 60, 88).map((path, index) => (
        <path key={`outer-${index}`} d={path} strokeWidth="0.35" />
      ))}
      {ring(32, 88, 96).map((path, index) => (
        <path key={`edge-${index}`} d={path} strokeWidth="0.35" />
      ))}
      {ring(12, 34, 58, 1.2).map((path, index) => (
        <path key={`middle-${index}`} d={path} strokeWidth="0.35" />
      ))}
      {ring(8, 18, 32).map((path, index) => (
        <path key={`inner-${index}`} d={path} strokeWidth="0.35" />
      ))}
      {Array.from({ length: 48 }, (_, index) => {
        const angle = (index / 48) * Math.PI * 2;
        return (
          <circle
            key={index}
            cx={Math.cos(angle) * 92}
            cy={Math.sin(angle) * 92}
            r="0.8"
            fill="currentColor"
            stroke="none"
          />
        );
      })}
    </svg>
  );
}

export default function AboutChoreography({
  award,
  whatsappHref,
}: AboutChoreographyProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      const observers: IntersectionObserver[] = [];
      let resizeObserver: ResizeObserver | undefined;
      let cancelled = false;

      const observeRevealGroup = (
        selector: string,
        { stagger = 0.08, y = 26, duration = 0.8 } = {},
      ) => {
        const nodes = Array.from(root.querySelectorAll<HTMLElement>(selector));
        if (!nodes.length) return;

        // Only prime nodes strictly below the current viewport so nothing can ever stay invisible
        const pending = nodes.filter(
          (el) => el.getBoundingClientRect().top > window.innerHeight * 0.94,
        );
        if (!pending.length) return;

        gsap.set(pending, { opacity: 0, y });

        const reveal = (targets: HTMLElement[]) => {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            ease: "power3.out",
            overwrite: "auto",
            clearProps: "transform",
          });
        };

        const seen = new Set<HTMLElement>();
        const io = new IntersectionObserver(
          (entries) => {
            const entering = entries
              .filter(
                (entry) =>
                  entry.isIntersecting ||
                  entry.boundingClientRect.top < window.innerHeight,
              )
              .map((entry) => entry.target as HTMLElement)
              .filter((el) => !seen.has(el));

            if (!entering.length) return;
            entering.forEach((el) => {
              seen.add(el);
              io.unobserve(el);
            });
            reveal(entering);
          },
          { threshold: 0.05, rootMargin: "0px 0px -32px 0px" },
        );

        pending.forEach((el) => io.observe(el));
        observers.push(io);
      };

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Hero entrance choreography
        const heroTl = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        heroTl
          .from("[data-hero-eyebrow]", {
            y: 16,
            opacity: 0,
            duration: 0.65,
            clearProps: "transform",
          })
          .from(
            "[data-hero-line]",
            {
              yPercent: 108,
              opacity: 0,
              duration: 0.95,
              stagger: 0.1,
              clearProps: "transform",
            },
            "-=0.4",
          )
          .from(
            "[data-hero-ornament], [data-hero-copy], [data-hero-cta]",
            {
              y: 22,
              opacity: 0,
              duration: 0.8,
              stagger: 0.09,
              clearProps: "transform",
            },
            "-=0.55",
          )
          .from(
            "[data-hero-stat]",
            {
              y: 18,
              opacity: 0,
              duration: 0.7,
              stagger: 0.08,
              clearProps: "transform",
            },
            "-=0.5",
          )
          .from(
            "[data-hero-art]",
            {
              scale: 0.95,
              y: 24,
              opacity: 0,
              duration: 1.05,
              clearProps: "transform",
            },
            0.12,
          )
          .from(
            "[data-hero-badge]",
            {
              scale: 0.78,
              opacity: 0,
              duration: 0.7,
              ease: "back.out(1.4)",
            },
            "-=0.5",
          );

        // Hero scroll-linked depth (mandala rotation + counter-parallax badge)
        gsap.to("[data-mandala]", {
          rotation: 42,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-hero-section]",
            start: "top top",
            end: "bottom top",
            scrub: 1.4,
          },
        });

        gsap.to("[data-hero-badge]", {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-hero-section]",
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });

        // 2. Manifesto scrubbed word-by-word reveal (never starts at opacity 0)
        gsap.fromTo(
          "[data-manifesto-word]",
          { opacity: 0.3, y: 6 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-manifesto-section]",
              start: "top 84%",
              end: "top 38%",
              scrub: 0.8,
            },
          },
        );

        // 3. Practice split: scrubbed arch scale & image settle + narrative entrance
        gsap.fromTo(
          "[data-practice-frame]",
          { scale: 0.94, y: 20 },
          {
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-practice-section]",
              start: "top 88%",
              end: "top 32%",
              scrub: 1,
            },
          },
        );

        gsap.fromTo(
          "[data-practice-img]",
          { scale: 1.08 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-practice-section]",
              start: "top 88%",
              end: "bottom 25%",
              scrub: 1.1,
            },
          },
        );

        observeRevealGroup("[data-practice-copy]", { stagger: 0.09, y: 24 });

        // 4. Four disciplines staggered wave (IntersectionObserver guarantees 100% visibility)
        observeRevealGroup("[data-discipline-head]", { stagger: 0, y: 22 });
        observeRevealGroup("[data-discipline-card]", { stagger: 0.09, y: 30 });

        // 5. Three decades timeline progress draw + node entrance
        observeRevealGroup("[data-journey-head]", { stagger: 0, y: 22 });
        observeRevealGroup("[data-journey-item]", { stagger: 0.1, y: 24 });

        gsap.from("[data-journey-track]", {
          scaleX: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-journey-list]",
            start: "top 82%",
            end: "top 38%",
            scrub: 0.9,
          },
        });

        // 6. Recognition & Press scale-in + stagger
        observeRevealGroup("[data-recognition-head]", { stagger: 0, y: 22 });
        observeRevealGroup("[data-award-copy]", { stagger: 0, y: 24 });
        observeRevealGroup("[data-press-figure]", { stagger: 0.12, y: 26 });

        gsap.fromTo(
          "[data-award-frame]",
          { scale: 0.95 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-award-row]",
              start: "top 86%",
              end: "top 36%",
              scrub: 0.9,
            },
          },
        );
      });

      // Desktop-only subtle scroll pin + scrubbed quote & portrait depth on "A life in practice"
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const lifeTl = gsap.timeline({
            scrollTrigger: {
              trigger: "[data-life-section]",
              start: "top top",
              end: "+=240",
              pin: "[data-life-inner]",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          lifeTl
            .fromTo(
              "[data-life-quote-word]",
              { opacity: 0.3 },
              { opacity: 1, stagger: 0.05, ease: "none" },
              0,
            )
            .fromTo(
              "[data-life-art]",
              { scale: 0.95, y: 22 },
              { scale: 1.02, y: -12, ease: "none" },
              0,
            );
        },
      );

      // Mobile / tablet fallback for "A life in practice" without pinning
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          observeRevealGroup("[data-life-left], [data-life-art]", {
            stagger: 0.1,
            y: 24,
          });
        },
      );

      // Keep ScrollTrigger offsets accurate after webfont load and image layout shifts
      void document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });

      if (typeof ResizeObserver !== "undefined") {
        let refreshTimer = 0;
        resizeObserver = new ResizeObserver(() => {
          window.clearTimeout(refreshTimer);
          refreshTimer = window.setTimeout(() => {
            if (!cancelled) ScrollTrigger.refresh();
          }, 150);
        });
        resizeObserver.observe(root);
      }

      return () => {
        cancelled = true;
        observers.forEach((io) => io.disconnect());
        resizeObserver?.disconnect();
      };
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className={`${styles.page} overflow-x-clip bg-[#fdf8f0] pt-16 text-[#30231e]`}
    >
      {/* 1. Attention — Hero */}
      <header
        data-hero-section
        className="relative isolate overflow-hidden bg-[#6b0b0b] px-4 pb-8 pt-6 text-white sm:min-h-[calc(100dvh-4rem)] sm:px-8 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-20"
      >
        <div
          aria-hidden="true"
          className="absolute inset-2.5 border border-[#ddb829]/20 sm:inset-8"
        />
        <div
          aria-hidden="true"
          className="hidden sm:block absolute -left-28 top-20 size-96 rounded-full bg-[#b41414]/35 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-6 sm:min-h-[calc(100dvh-11rem)] sm:gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-24">
          <div className="pt-1 lg:pt-0">
            <p
              data-hero-eyebrow
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f0d060] sm:text-xs sm:tracking-[0.28em]"
            >
              About Manisha
            </p>

            <h1 className="mt-2.5 max-w-2xl text-balance font-serif text-[1.9rem] leading-[1.06] tracking-[-0.03em] sm:mt-6 sm:text-6xl sm:tracking-[-0.035em] lg:text-[4.75rem]">
              <span className="block overflow-hidden pb-0.5 sm:pb-1">
                <span data-hero-line className="inline-block will-change-transform">
                  Wisdom shaped by a
                </span>
              </span>
              <span className="block overflow-hidden pb-0.5 sm:pb-1">
                <span
                  data-hero-line
                  className="inline-block italic text-[#f0d060] will-change-transform"
                >
                  lifetime of practice.
                </span>
              </span>
            </h1>

            <div data-hero-ornament className="mt-3.5 sm:mt-8">
              <Ornament />
            </div>

            <p
              data-hero-copy
              className="mt-3 max-w-xl text-sm leading-6 text-[#efe5d2] sm:mt-7 sm:text-lg sm:leading-8"
            >
              For over 30 years, Manisha has helped people meet uncertainty with
              clarity, self-trust and grounded spiritual guidance.
            </p>

            <div
              data-hero-cta
              className="mt-4 grid grid-cols-2 gap-2 sm:mt-9 sm:flex sm:flex-wrap sm:gap-4"
            >
              <Link
                href="/contact"
                className="group inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#ddb829] px-2.5 py-2 text-center text-[11px] font-bold leading-tight text-[#3b2118] shadow-[0_18px_38px_-16px_rgba(221,184,41,0.55)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#f0d060] active:scale-[0.98] sm:min-h-13 sm:justify-between sm:gap-4 sm:whitespace-nowrap sm:pl-7 sm:pr-3 sm:text-sm"
              >
                <span>Work with Manisha</span>
                <ArrowRight className="size-3 shrink-0 sm:hidden" strokeWidth={1.8} />
                <span className="hidden size-8 place-items-center rounded-full bg-[#3b2118]/12 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 sm:grid">
                  <ArrowRight className="size-4" strokeWidth={1.7} />
                </span>
              </Link>
              <Link
                href="#disciplines"
                className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#f0d060]/55 px-2.5 py-2 text-center text-[11px] font-semibold leading-tight text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-[#f0d060] hover:text-[#f0d060] active:scale-[0.98] sm:min-h-13 sm:whitespace-nowrap sm:px-7 sm:py-3 sm:text-sm"
              >
                Explore her practice
              </Link>
            </div>

            <dl className="mt-5 grid max-w-2xl grid-cols-3 border-y border-[#ddb829]/25 py-3 sm:mt-12 sm:py-6">
              {stats.map(([value, label], index) => (
                <div
                  key={label}
                  data-hero-stat
                  className={
                    index
                      ? "border-l border-[#ddb829]/25 px-2.5 sm:px-6"
                      : "pr-2.5 sm:pr-6"
                  }
                >
                  <dt className="font-serif text-xl tabular-nums text-[#f0d060] sm:text-4xl">
                    {value}
                  </dt>
                  <dd className="mt-0.5 text-[0.58rem] uppercase leading-3.5 tracking-[0.08em] text-white/65 sm:mt-1 sm:text-xs sm:leading-5 sm:tracking-[0.1em]">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div data-hero-art className={`${styles.heroArt} will-change-transform`}>
            <Mandala />
            <div className={styles.jharokha}>
              <div className={styles.jharokhaInner}>
                <Image
                  src="/images/manisha-about-hero.webp"
                  alt="Dr. Manisha Belvalkar seated with her Tarot cards"
                  fill
                  priority
                  sizes="(max-width: 640px) 224px, (max-width: 1024px) 90vw, 470px"
                  className={`${styles.jharokhaImage} object-[50%_35%]`}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#3a0909] via-[#3a0909]/25 to-transparent px-3.5 pb-3.5 pt-10 sm:px-7 sm:pb-7 sm:pt-24">
                  <p className="font-serif text-sm sm:text-xl">
                    Dr. Manisha Belvalkar
                  </p>
                  <p className="mt-0.5 text-[0.56rem] uppercase tracking-[0.14em] text-[#f0d060] sm:mt-1 sm:text-xs sm:tracking-[0.16em]">
                    PhD in Tarot Reading
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.plinth} aria-hidden="true" />
            <div
              data-hero-badge
              className="absolute bottom-5 -right-2 grid size-14 place-items-center rounded-full border border-[#ddb829] bg-[#8b0f0f] text-center shadow-xl will-change-transform sm:-right-8 sm:bottom-20 sm:size-24"
            >
              <div>
                <b className="block font-serif text-lg leading-none tabular-nums text-[#f0d060] sm:text-3xl">
                  30+
                </b>
                <span className="text-[0.5rem] uppercase tracking-[0.14em] sm:text-[0.65rem] sm:tracking-[0.18em]">
                  Years
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Scrubbed Manifesto Strip */}
      <section
        data-manifesto-section
        className="border-b border-[#6b0b0b]/10 bg-[#efe5d2] px-4 py-6 sm:px-8 sm:py-16 lg:py-24"
      >
        <blockquote className="mx-auto flex max-w-5xl flex-col items-center gap-2.5 text-center font-serif text-[1.2rem] leading-snug text-[#6b0b0b] sm:gap-6 sm:text-4xl sm:leading-tight lg:flex-row lg:justify-center lg:text-5xl">
          <Ornament animated />
          <span className="text-balance">
            {manifestoWordsFirst.map((word, index) => (
              <span
                key={`m1-${index}`}
                data-manifesto-word
                className="inline-block will-change-transform"
              >
                {word}
                {"\u00A0"}
              </span>
            ))}
            <em className="text-[#a8871a]">
              {manifestoWordsAccent.map((word, index) => (
                <span
                  key={`m2-${index}`}
                  data-manifesto-word
                  className="inline-block will-change-transform"
                >
                  {word}
                  {index < manifestoWordsAccent.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </em>
          </span>
          <span className="hidden sm:inline-flex">
            <Ornament animated />
          </span>
        </blockquote>
      </section>

      {/* 3. Practice Narrative + Scrubbed Arch Reveal */}
      <section
        data-practice-section
        className="px-4 py-8 sm:px-8 sm:py-24 lg:py-32"
      >
        <div className="mx-auto grid max-w-[1200px] items-center gap-5 sm:gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24">
          <div
            data-practice-frame
            className="mx-auto w-full max-w-[200px] will-change-transform sm:max-w-[420px] lg:mx-0"
          >
            <div className={styles.jharokha}>
              <div className={styles.jharokhaInner}>
                <Image
                  data-practice-img
                  src="/images/manisha-about-practice.webp"
                  alt="Manisha Belvalkar during a Tarot reading"
                  fill
                  sizes="(max-width: 640px) 200px, (max-width: 1024px) 420px, 420px"
                  className={`${styles.jharokhaImage} object-[50%_28%] will-change-transform`}
                />
              </div>
            </div>
          </div>

          <div data-practice-text>
            <div data-practice-copy>
              <Ornament />
            </div>
            <h2
              data-practice-copy
              className="mt-3 max-w-3xl text-balance font-serif text-[1.6rem] leading-[1.08] tracking-[-0.025em] sm:mt-7 sm:text-5xl sm:leading-[1.06] sm:tracking-[-0.03em] lg:text-6xl"
            >
              A practice built on{" "}
              <em className="text-[#a81414]">attention, study and care.</em>
            </h2>
            <div className="mt-3.5 max-w-[42rem] space-y-3 text-[13.5px] leading-6 text-[#67564d] sm:mt-8 sm:space-y-5 sm:text-lg sm:leading-8">
              <p
                data-practice-copy
                className="first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-4xl first-letter:leading-[0.85] first-letter:text-[#a81414] sm:first-letter:mr-3 sm:first-letter:text-6xl sm:first-letter:leading-[0.8]"
              >
                Manisha&apos;s work began with a deep curiosity about the unseen
                patterns that influence everyday life. That curiosity grew into
                decades of disciplined study across Tarot, soul purpose, divine
                feminine practices and chakra therapy.
              </p>
              <p data-practice-copy>
                Her PhD in Tarot Reading reflects that commitment to depth. In
                each session, she pairs intuitive insight with practical
                conversation so that guidance feels useful beyond the reading
                itself.
              </p>
              <p
                data-practice-copy
                className="border-l-2 border-[#ddb829] pl-3.5 font-serif text-base italic leading-6 text-[#6b0b0b] sm:pl-6 sm:text-xl sm:leading-normal"
              >
                The intention is simple: to help each person understand where
                they are, recognise what is asking to change and move forward
                with greater confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interest — Four Disciplines with Double-Bezel & Haptic Micro-Motion */}
      <section
        id="disciplines"
        data-disciplines-section
        className="bg-[#fdf8f0] px-4 py-8 sm:px-8 sm:py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[1200px]">
          <div data-discipline-head className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance font-serif text-[1.6rem] leading-[1.08] tracking-[-0.025em] sm:text-5xl sm:leading-[1.06] sm:tracking-[-0.03em] lg:text-6xl">
              Four disciplines.{" "}
              <em className="text-[#a81414]">One thoughtful approach.</em>
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-[13.5px] leading-6 text-[#67564d] sm:mt-6 sm:text-lg sm:leading-8">
              Every practice offers a different way to understand the present and
              make the next decision with care.
            </p>
          </div>

          <div
            data-disciplines-grid
            className="mt-6 grid grid-cols-2 grid-flow-dense gap-2.5 sm:mt-14 sm:gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {expertise.map((item) => (
              <div key={item.title} data-discipline-card className="h-full">
                <article className="group h-full rounded-[1.15rem] bg-[#efe5d2]/75 p-1 ring-1 ring-[#c7a23b]/35 shadow-[0_20px_44px_-32px_rgba(107,11,11,0.4)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5 hover:ring-[#ddb829] sm:rounded-[1.75rem] sm:p-1.5 sm:shadow-[0_28px_60px_-42px_rgba(107,11,11,0.45)]">
                  <div className="relative flex h-full flex-col items-center overflow-hidden rounded-[calc(1.15rem-0.25rem)] bg-white px-3 py-4 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] sm:rounded-[calc(1.75rem-0.375rem)] sm:px-6 sm:py-10">
                    <div className="relative grid size-10 place-items-center rounded-full bg-[#6b0b0b] text-[#ddb829] ring-1 ring-[#ddb829] ring-offset-2 ring-offset-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105 group-hover:rotate-3 sm:size-16 sm:ring-offset-4">
                      <item.icon className="size-4 sm:size-7" strokeWidth={1.25} />
                    </div>
                    <h3 className="mt-3 font-serif text-[1rem] leading-snug text-[#292524] transition-colors duration-300 group-hover:text-[#981313] sm:mt-7 sm:text-2xl sm:leading-tight">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[11.5px] leading-[1.45] text-[#67564d] sm:mt-4 sm:text-sm sm:leading-7">
                      {item.text}
                    </p>
                    <span
                      aria-hidden="true"
                      className="mt-auto hidden h-px w-12 origin-center scale-x-0 border-b border-[#ddb829] pt-6 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-x-100 sm:block"
                    />
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Desire — Three Decades Journey Timeline with Scroll-Drawn Gold Track */}
      <section
        data-journey-section
        className="bg-[#1c1917] px-4 py-8 text-white sm:px-8 sm:py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[1200px]">
          <div data-journey-head>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ddb829] sm:text-xs sm:tracking-[0.26em]">
              The journey
            </p>
            <h2 className="mt-2 max-w-3xl text-balance font-serif text-[1.6rem] leading-[1.08] tracking-[-0.025em] sm:mt-5 sm:text-5xl sm:leading-[1.06] sm:tracking-[-0.03em] lg:text-6xl">
              Three decades of{" "}
              <em className="text-[#f0d060]">learning and service.</em>
            </h2>
          </div>

          <div data-journey-list className="relative mt-6 sm:mt-14">
            <div
              aria-hidden="true"
              className="absolute left-0 right-0 top-0 hidden h-px bg-[#ddb829]/20 lg:block"
            />
            <div
              data-journey-track
              aria-hidden="true"
              className="absolute left-0 right-0 top-0 hidden h-px origin-left bg-gradient-to-r from-[#ddb829] via-[#f0d060] to-[#ddb829] will-change-transform lg:block"
            />

            <ol className="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {milestones.map(([year, title, text]) => (
                <li
                  key={year}
                  data-journey-item
                  className="relative border-t border-[#ddb829]/35 pt-4 sm:pt-8 lg:border-t-0 lg:px-6 lg:first:pl-0"
                >
                  <span
                    data-journey-node
                    className="absolute -top-2 left-0 grid size-4 place-items-center rounded-full border border-[#ddb829] bg-[#1c1917] shadow-[0_0_16px_rgba(221,184,41,0.45)] after:size-1.5 after:rounded-full after:bg-[#ddb829] sm:-top-2.5 sm:size-5 sm:after:size-2 lg:left-6 lg:first:left-0"
                  />
                  <time className="font-serif text-xl italic tabular-nums text-[#f0d060] sm:text-4xl">
                    {year}
                  </time>
                  <h3 className="mt-1.5 font-serif text-[0.98rem] leading-snug sm:mt-5 sm:text-2xl">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-[11.5px] leading-[1.5] text-[#d6cfc2] sm:mt-3 sm:text-sm sm:leading-7">
                    {text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 6. Pinned Editorial Reading Beat — A Life In Practice */}
      <section
        data-life-section
        className="relative overflow-hidden bg-[#fdf8f0] px-4 py-8 sm:px-8 sm:py-24 lg:py-32"
      >
        <div
          data-life-inner
          className="relative mx-auto grid max-w-[1200px] items-center gap-5 sm:gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24"
        >
          <div data-life-left>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a8871a] sm:text-xs sm:tracking-[0.26em]">
              Beyond the sessions
            </p>
            <h2 className="mt-2 font-serif text-[1.7rem] leading-[1.04] tracking-[-0.025em] sm:mt-5 sm:text-6xl sm:leading-[1.02] sm:tracking-[-0.03em] lg:text-7xl">
              A life <em className="text-[#a81414]">in practice.</em>
            </h2>
            <blockquote className="mt-4 border-l-2 border-[#ddb829] pl-3.5 font-serif text-[1.05rem] italic leading-[1.45] text-[#8b0f0f] sm:mt-10 sm:pl-7 sm:text-3xl lg:text-4xl">
              {lifeQuoteWords.map((word, index) => (
                <span
                  key={`lq-${index}`}
                  data-life-quote-word
                  className="inline-block"
                >
                  {word}
                  {index < lifeQuoteWords.length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </blockquote>
            <p className="mt-3 max-w-xl text-[13.5px] leading-6 text-[#57534e] sm:mt-7 sm:text-base sm:leading-8">
              A glimpse of Manisha as a practitioner, teacher and woman whose
              work has grown through decades of study, recognition and lived
              spiritual practice.
            </p>
            <div className="mt-4 flex items-center gap-3 sm:mt-10 sm:gap-5">
              <Sparkles className="size-5 shrink-0 text-[#a8871a] sm:size-8" strokeWidth={1.2} />
              <div>
                <b className="font-serif text-base sm:text-2xl">
                  Presence before prescription.
                </b>
                <p className="mt-0.5 text-xs text-[#57534e] sm:mt-1 sm:text-sm">
                  Warm, grounded and deeply attentive.
                </p>
              </div>
            </div>
          </div>

          <div
            data-life-art
            className="mx-auto w-full max-w-[196px] will-change-transform sm:max-w-[400px]"
          >
            <div className={styles.jharokha}>
              <div className={styles.jharokhaInner}>
                <Image
                  src="/images/manisha/manisha-about-presence.webp"
                  alt="Manisha Belvalkar in a personal portrait"
                  fill
                  sizes="(max-width: 640px) 196px, (max-width: 1024px) 400px, 400px"
                  className={`${styles.jharokhaImage} object-[50%_15%]`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Recognition, Press & Haptic CTA */}
      <section
        data-recognition-section
        className="bg-[#6b0b0b] px-4 py-8 text-white sm:px-8 sm:py-24 lg:py-32"
      >
        <div className="mx-auto max-w-[1200px]">
          <div data-recognition-head className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ddb829] sm:text-xs sm:tracking-[0.26em]">
              A recognised voice
            </p>
            <h2 className="mt-2 text-balance font-serif text-[1.6rem] leading-[1.08] tracking-[-0.025em] sm:mt-5 sm:text-5xl sm:leading-[1.06] sm:tracking-[-0.03em] lg:text-6xl">
              A journey <em className="text-[#f0d060]">honoured</em> through
              recognition.
            </h2>
          </div>

          <div
            data-award-row
            className="mt-5 grid items-center gap-4 border-y border-[#a8871a]/30 py-5 sm:mt-14 sm:gap-12 sm:py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:py-14"
          >
            <div
              data-award-frame
              className="relative aspect-[16/10] overflow-hidden border-[3px] border-[#ddb829] bg-white shadow-[0_28px_70px_-42px_rgba(107,11,11,0.6)] will-change-transform sm:aspect-[3/2] sm:border-[6px]"
            >
              <Image
                src="/images/manisha-health-magazine.webp"
                alt="Manisha Belvalkar receiving the International Excellence Award from actor Sonu Sood"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>

            <div data-award-copy>
              <Award className="size-6 text-[#ddb829] sm:size-9" strokeWidth={1.3} />
              <h3 className="mt-2.5 font-serif text-xl leading-tight sm:mt-6 sm:text-4xl lg:text-5xl">
                {award?.title ?? "International Excellence Award"}
              </h3>
              <p className="mt-2 text-[13.5px] leading-6 text-[#efe5d2] sm:mt-6 sm:text-lg sm:leading-8">
                {award?.description ??
                  "An honour recognising her mastery and years of dedicated service."}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-9 sm:flex sm:flex-wrap sm:gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex min-h-10 items-center justify-center gap-1 rounded-full bg-[#ddb829] px-2.5 py-2 text-center text-[11px] font-semibold leading-tight text-[#292524] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#f0d060] active:scale-[0.98] sm:min-h-13 sm:justify-between sm:gap-4 sm:whitespace-nowrap sm:pl-7 sm:pr-3 sm:text-sm"
                >
                  <span>Begin a conversation</span>
                  <ArrowRight className="size-3 shrink-0 sm:hidden" strokeWidth={1.8} />
                  <span className="hidden size-8 place-items-center rounded-full bg-[#292524]/12 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 sm:grid">
                    <ArrowRight className="size-4" strokeWidth={1.7} />
                  </span>
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#f0d060]/60 px-2.5 py-2 text-center text-[11px] font-semibold leading-tight text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-[#f0d060] hover:text-[#f0d060] active:scale-[0.98] sm:min-h-13 sm:whitespace-nowrap sm:px-7 sm:py-3 sm:text-sm"
                >
                  Message on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-16">
            <h3 className="font-serif text-xl sm:text-3xl">In the press</h3>
            <div
              data-press-grid
              className="mt-3.5 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-7"
            >
              {[
                [
                  "/images/manisha-portrait-healer.webp",
                  "Magazine feature titled A Spiritual Success",
                  "“A Spiritual Success”",
                  "Wonder Women feature",
                ],
                [
                  "/images/manisha/manisha-excellence-mandala.webp",
                  "Manisha Belvalkar holding the Success Today Excellence Award",
                  "Success Today Excellence Award",
                  "Honour & recognition",
                ],
              ].map(([src, alt, title, caption]) => (
                <figure key={src} data-press-figure className="group">
                  <div className="relative aspect-[4/4.6] overflow-hidden border-[3px] border-[#ddb829] bg-white sm:aspect-[4/5] sm:border-[5px]">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      sizes="(max-width: 768px) 46vw, 50vw"
                      className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="flex flex-col gap-0.5 border-b border-[#ddb829]/30 py-2.5 transition-colors duration-300 group-hover:border-[#f0d060] sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:py-5">
                    <b className="font-serif text-sm leading-snug sm:text-xl">{title}</b>
                    <span className="text-[0.6rem] uppercase tracking-[0.12em] text-[#ddb829] sm:text-xs sm:tracking-[0.15em]">
                      {caption}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
