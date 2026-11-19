"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Clock,
  Compass,
  Heart,
  Sparkles,
} from "lucide-react";

import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { MOTION_TOKENS } from "@/lib/motion";
import {
  brand,
  type Course,
  type HealingService,
  type MentoringArea,
  type Service,
} from "@/lib/data";
import { formatINR } from "@/lib/utils";
import { scrollToSection } from "@/components/providers/SmoothScrollProvider";
import styles from "@/app/services/services.module.css";

interface ServicesChoreographyProps {
  tarotServices: Service[];
  wellbeingServices: Service[];
  healingServices: HealingService[];
  mentoringAreas: MentoringArea[];
  featuredCourse?: Course;
}

type IntentId = "clarity" | "release" | "patterns" | "immersion";

const pathways = [
  {
    icon: Compass,
    eyebrow: "Clarity",
    title: "I need direction",
    text: "For a decision, relationship, career shift or a moment when the next step feels unclear.",
    href: "#readings",
  },
  {
    icon: Heart,
    eyebrow: "Balance",
    title: "I want to feel lighter",
    text: "For emotional heaviness, recurring stress and a deeper return to inner steadiness.",
    href: "#healing",
  },
  {
    icon: Sparkles,
    eyebrow: "Growth",
    title: "I want deeper support",
    text: "For ongoing guidance, spiritual practice and intentional personal transformation.",
    href: "#mentoring",
  },
  {
    icon: BookOpen,
    eyebrow: "Learning",
    title: "I want to learn",
    text: "For structured study, sacred practices and tools you can carry into everyday life.",
    href: "/courses",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose your path",
    text: "Select the session closest to your present need. If you are unsure, use the quick matcher above or ask.",
  },
  {
    number: "02",
    title: "Reserve a time",
    text: "Share suitable time windows and the team confirms your in-person or online appointment.",
  },
  {
    number: "03",
    title: "Arrive as you are",
    text: "Bring your question, your context and an open mind. No special preparation is needed.",
  },
];

const marqueeTerms = [
  "Tarot Consultation",
  "Soul Purpose Reading",
  "Shakti Healing",
  "Distance Energy Work",
  "Goddess Attunement",
  "Mentoring through Tarot",
  "Guided Meditation",
];

function Marker({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <span
      data-marker
      className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] ${
        light ? "text-[#e7c968]" : "text-[#981313]"
      }`}
    >
      <span
        data-marker-line
        aria-hidden="true"
        className={`h-px w-7 origin-left ${
          light ? "bg-[#e7c968]" : "bg-[#981313]"
        }`}
      />
      <span data-marker-label>{children}</span>
    </span>
  );
}

function SacredOrbitalRing({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 240"
      fill="none"
      stroke="currentColor"
      className={className}
    >
      <circle
        cx="120"
        cy="120"
        r="112"
        strokeWidth="0.6"
        strokeDasharray="3 5"
      />
      <circle cx="120" cy="120" r="88" strokeWidth="0.5" />
      <circle cx="120" cy="120" r="54" strokeWidth="0.5" strokeOpacity="0.7" />
      <path
        d="M120 12 L134 106 L228 120 L134 134 L120 228 L106 134 L12 120 L106 106 Z"
        strokeWidth="0.55"
        strokeOpacity="0.65"
      />
      <path
        d="M44 44 L120 98 L196 44 L142 120 L196 196 L120 142 L44 196 L98 120 Z"
        strokeWidth="0.45"
        strokeOpacity="0.4"
      />
    </svg>
  );
}

function updateSpotlight(event: PointerEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  el.style.setProperty("--spot-x", `${x}px`);
  el.style.setProperty("--spot-y", `${y}px`);
}

export default function ServicesChoreography({
  tarotServices,
  wellbeingServices,
  healingServices,
  mentoringAreas,
  featuredCourse,
}: ServicesChoreographyProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mobileRailRef = useRef<HTMLElement>(null);
  const readingsRailRef = useRef<HTMLDivElement>(null);

  const [activeHealingIndex, setActiveHealingIndex] = useState(0);
  const [activeReadingIndex, setActiveReadingIndex] = useState(0);
  const [selectedIntent, setSelectedIntent] = useState<IntentId>("clarity");

  const intentRecommendations = useMemo(() => {
    const tarot60 =
      tarotServices.find((s) => s.slug === "tarot-consultation-60") ??
      tarotServices[0];
    const primaryHealing =
      healingServices.find((s) => s.slug === "distance-healing") ??
      healingServices[0];
    const primaryMentoring = mentoringAreas[0];

    return [
      {
        id: "clarity" as const,
        chip: "Decision or crossroads",
        discipline: "Tarot & Soul Guidance",
        title: tarot60?.title ?? "Tarot Consultation",
        meta: tarot60
          ? `${tarot60.duration} · ${formatINR(tarot60.price)}`
          : "60 minutes",
        reason:
          "Ideal when multiple questions overlap across career, relationships or timing and you want clear perspective.",
        ctaLabel: "Reserve session",
        href: tarot60 ? `/services/${tarot60.slug}` : "/services",
        sectionHref: "#readings",
      },
      {
        id: "release" as const,
        chip: "Emotional heaviness",
        discipline: "Healing & Energy Work",
        title: primaryHealing?.title ?? "Distance Healing",
        meta: primaryHealing?.price
          ? `${primaryHealing.format ?? "Private"} · ${formatINR(primaryHealing.price)}`
          : "Private session",
        reason:
          "Designed to settle nervous-system overwhelm, clear stagnant energy and restore grounded calm from anywhere.",
        ctaLabel: "Explore healing",
        href: primaryHealing ? `/healing/${primaryHealing.slug}` : "/healing",
        sectionHref: "#healing",
      },
      {
        id: "patterns" as const,
        chip: "Recurring life patterns",
        discipline: "1-on-1 Mentoring",
        title: primaryMentoring?.title ?? "Mentoring through Tarot",
        meta: "Private reflective pathway",
        reason:
          "Best when you want to see why familiar dynamics repeat and build steady self-trust over time.",
        ctaLabel: "Discover this path",
        href: primaryMentoring
          ? `/mentoring/${primaryMentoring.slug}`
          : "/mentoring",
        sectionHref: "#mentoring",
      },
      {
        id: "immersion" as const,
        chip: "Longer personal journey",
        discipline: "Signature Journey",
        title: featuredCourse?.title ?? "Personalized Well-being Course",
        meta: featuredCourse?.duration ?? "6 online sessions",
        reason:
          "Built around your energetic blueprint with live guidance and custom practices for lasting transformation.",
        ctaLabel: "Explore the journey",
        href: featuredCourse
          ? `/courses/${featuredCourse.slug}`
          : "/courses/personalized-wellbeing",
        sectionHref: "#signature-journey",
      },
    ];
  }, [tarotServices, healingServices, mentoringAreas, featuredCourse]);

  const activeRecommendation =
    intentRecommendations.find((item) => item.id === selectedIntent) ??
    intentRecommendations[0];

  // Center the active healing pill inside the mobile sticky rail cleanly.
  useEffect(() => {
    const rail = mobileRailRef.current;
    if (!rail) return;
    const activePill = rail.querySelector<HTMLElement>(
      `[data-healing-pill="${activeHealingIndex}"]`,
    );
    if (!activePill) return;
    const targetLeft = Math.max(
      0,
      activePill.offsetLeft - (rail.clientWidth - activePill.clientWidth) / 2,
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      rail.scrollLeft = targetLeft;
      return;
    }

    gsap.to(rail, {
      scrollLeft: targetLeft,
      duration: 0.42,
      ease: "power2.out",
      overwrite: true,
    });
  }, [activeHealingIndex]);

  // Sync mobile Tarot spread dot indicator while swiping horizontally.
  useEffect(() => {
    const rail = readingsRailRef.current;
    if (!rail) return;
    let rafId = 0;

    const handleRailScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (window.innerWidth >= 768) return;
        const cards = Array.from(
          rail.querySelectorAll<HTMLElement>("[data-readings-card]"),
        );
        if (!cards.length) return;
        const centerX = rail.scrollLeft + rail.clientWidth / 2;
        let closestIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;
        cards.forEach((card, index) => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          const dist = Math.abs(centerX - cardCenter);
          if (dist < closestDistance) {
            closestDistance = dist;
            closestIndex = index;
          }
        });
        setActiveReadingIndex((prev) =>
          prev === closestIndex ? prev : closestIndex,
        );
      });
    };

    rail.addEventListener("scroll", handleRailScroll, { passive: true });
    return () => {
      rail.removeEventListener("scroll", handleRailScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const stepReadingSpread = (targetIndex: number) => {
    const rail = readingsRailRef.current;
    if (!rail) return;
    const clamped = Math.max(0, Math.min(tarotServices.length - 1, targetIndex));
    const card = rail.querySelectorAll<HTMLElement>("[data-readings-card]")[
      clamped
    ];
    if (!card) return;
    setActiveReadingIndex(clamped);
    const left = Math.max(
      0,
      card.offsetLeft - (rail.clientWidth - card.clientWidth) / 2,
    );
    gsap.to(rail, {
      scrollLeft: left,
      duration: 0.55,
      ease: "power3.out",
      overwrite: true,
    });
  };

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      ScrollTrigger.config({ ignoreMobileResize: true });

      const mm = gsap.matchMedia();
      let cancelled = false;
      let heroStartTimer = 0;
      let cleanupHeroListener: (() => void) | undefined;

      const isAlreadyVisible = (el: HTMLElement) =>
        el.getBoundingClientRect().top <= window.innerHeight * 0.88;

      const revealOnce = (target: HTMLElement, trigger?: HTMLElement) => {
        if (isAlreadyVisible(target)) return;
        gsap.from(target, {
          y: MOTION_TOKENS.distance.reveal,
          opacity: 0,
          duration: MOTION_TOKENS.duration.editorial,
          ease: MOTION_TOKENS.ease.editorial,
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: trigger ?? target,
            start: "top 90%",
            once: true,
          },
        });
      };

      // 1. UNIVERSAL AWARD-GRADE CHOREOGRAPHY (MOBILE + DESKTOP)
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const splitInstances: SplitText[] = [];
        const scrollLineTweens: gsap.core.Tween[] = [];

        // Top reading progress hairline scrubbed across the whole page
        const progressEl =
          root.querySelector<HTMLElement>("[data-scroll-progress]");
        if (progressEl) {
          gsap.fromTo(
            progressEl,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.25,
              },
            },
          );
        }

        // Hero entrance timeline (primed immediately, played as soon as IntroLoader parts)
        const heroTl = gsap.timeline({
          paused: true,
          defaults: { ease: MOTION_TOKENS.ease.editorial },
        });

        heroTl
          .from(
            "[data-hero-stage]",
            {
              scale: 0.965,
              opacity: 0.45,
              duration: 0.95,
              ease: MOTION_TOKENS.ease.editorial,
              clearProps: "transform,opacity",
            },
            0,
          )
          .fromTo(
            "[data-hero-image-scale]",
            { scale: 1.16 },
            {
              scale: 1.05,
              duration: 1.35,
              ease: MOTION_TOKENS.ease.settle,
              clearProps: "transform",
            },
            0,
          )
          .from(
            "[data-hero-eyebrow]",
            {
              y: MOTION_TOKENS.distance.subtle,
              opacity: 0,
              duration: 0.5,
              clearProps: "transform,opacity",
            },
            0.08,
          )
          .from(
            "[data-hero-line]",
            {
              yPercent: 112,
              duration: 0.9,
              stagger: 0.11,
              ease: MOTION_TOKENS.ease.editorial,
              clearProps: "transform",
            },
            0.14,
          )
          .from(
            "[data-hero-pill]",
            {
              scale: 0.68,
              opacity: 0,
              duration: 0.72,
              ease: "back.out(1.5)",
              clearProps: "transform,opacity",
            },
            0.3,
          )
          .from(
            "[data-hero-copy]",
            {
              y: MOTION_TOKENS.distance.subtle,
              opacity: 0,
              duration: 0.6,
              clearProps: "transform,opacity",
            },
            0.44,
          )
          .from(
            "[data-hero-cta]",
            {
              y: MOTION_TOKENS.distance.subtle,
              opacity: 0,
              duration: 0.55,
              clearProps: "transform,opacity",
            },
            0.56,
          )
          .from(
            "[data-hero-dock-card]",
            {
              y: 22,
              opacity: 0,
              duration: 0.65,
              stagger: 0.08,
              clearProps: "transform,opacity",
            },
            0.66,
          );

        const activeLoader = document.querySelector(
          '[data-intro-loader="active"]',
        );
        if (activeLoader) {
          const playHero = () => {
            window.clearTimeout(heroStartTimer);
            cleanupHeroListener?.();
            cleanupHeroListener = undefined;
            if (!cancelled) heroTl.play(0);
          };
          const onIntroLeaving = () => {
            window.setTimeout(playHero, 180);
          };
          window.addEventListener("intro-loader:leaving", onIntroLeaving, {
            once: true,
          });
          cleanupHeroListener = () =>
            window.removeEventListener("intro-loader:leaving", onIntroLeaving);
          heroStartTimer = window.setTimeout(playHero, 4500);
        } else {
          heroTl.play(0);
        }

        // Universal Hero Scroll Parallax (runs on BOTH mobile & desktop)
        const heroSection =
          root.querySelector<HTMLElement>("[data-hero-section]");
        if (heroSection) {
          gsap.to("[data-hero-mandala]", {
            rotation: 48,
            ease: "none",
            scrollTrigger: {
              trigger: heroSection,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });

          gsap.fromTo(
            "[data-hero-parallax]",
            { yPercent: -3, scale: 1.14 },
            {
              yPercent: 5,
              scale: 1.07,
              ease: "none",
              scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top",
                scrub: 0.9,
              },
            },
          );

          gsap.to("[data-hero-stage]", {
            scale: 0.97,
            ease: "none",
            scrollTrigger: {
              trigger: heroSection,
              start: "top top",
              end: "bottom top",
              scrub: 0.9,
            },
          });

          gsap.to("[data-hero-text-parallax]", {
            y: -28,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: heroSection,
              start: "top top",
              end: "bottom 25%",
              scrub: 0.85,
            },
          });

          gsap.to("[data-hero-glow]", {
            y: 48,
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
              trigger: heroSection,
              start: "top top",
              end: "bottom top",
              scrub: 1,
            },
          });
        }

        // Masked line-by-line scroll reveals on section H2s
        root
          .querySelectorAll<HTMLElement>("[data-split-heading]")
          .forEach((heading) => {
            let lineTween: gsap.core.Tween | undefined;
            let hasPlayed = isAlreadyVisible(heading);

            const split = SplitText.create(heading, {
              type: "lines",
              mask: "lines",
              linesClass: "services-line",
              aria: "auto",
              autoSplit: true,
              deepSlice: true,
              onSplit(self) {
                if (!self.lines.length) return;
                lineTween?.scrollTrigger?.kill();
                lineTween?.kill();

                if (hasPlayed) {
                  gsap.set(self.lines, { yPercent: 0, clearProps: "transform" });
                  return;
                }

                lineTween = gsap.from(self.lines, {
                  yPercent: 108,
                  duration: 0.86,
                  stagger: 0.08,
                  ease: MOTION_TOKENS.ease.editorial,
                  clearProps: "transform",
                  scrollTrigger: {
                    trigger: heading,
                    start: "top 90%",
                    once: true,
                    onEnter: () => {
                      hasPlayed = true;
                    },
                  },
                });
                scrollLineTweens.push(lineTween);
              },
            });
            splitInstances.push(split);
          });

        // Section marker hairlines draw left-to-right on scroll
        root.querySelectorAll<HTMLElement>("[data-marker]").forEach((marker) => {
          if (isAlreadyVisible(marker)) return;
          const line = marker.querySelector<HTMLElement>("[data-marker-line]");
          const label = marker.querySelector<HTMLElement>("[data-marker-label]");
          const markerTl = gsap.timeline({
            scrollTrigger: {
              trigger: marker,
              start: "top 92%",
              once: true,
            },
          });

          if (line) {
            markerTl.fromTo(
              line,
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 0.65,
                ease: MOTION_TOKENS.ease.editorial,
                clearProps: "transform",
              },
              0,
            );
          }

          if (label) {
            markerTl.from(
              label,
              {
                x: -10,
                opacity: 0,
                duration: 0.55,
                ease: MOTION_TOKENS.ease.editorial,
                clearProps: "transform,opacity",
              },
              0.08,
            );
          }
        });

        // Scrubbed word-by-word illumination on editorial quotes & prose
        root
          .querySelectorAll<HTMLElement>("[data-scrub-words]")
          .forEach((proseEl) => {
            const wordSplit = SplitText.create(proseEl, {
              type: "words",
              aria: "auto",
            });
            splitInstances.push(wordSplit);

            if (!wordSplit.words.length) return;
            gsap.fromTo(
              wordSplit.words,
              { opacity: 0.28 },
              {
                opacity: 1,
                stagger: 0.04,
                ease: "none",
                scrollTrigger: {
                  trigger: proseEl,
                  start: "top 92%",
                  end: "top 54%",
                  scrub: 0.7,
                },
              },
            );
          });

        root
          .querySelectorAll<HTMLElement>("[data-soft-reveal]")
          .forEach((el) => revealOnce(el));

        // Guidance finder panel entrance
        const finderEl =
          root.querySelector<HTMLElement>("[data-guidance-finder]");
        if (finderEl) revealOnce(finderEl);

        // Well-being banner + scrubbed dot texture drift
        const wellbeingBanner = root.querySelector<HTMLElement>(
          "[data-wellbeing-banner]",
        );
        if (wellbeingBanner) revealOnce(wellbeingBanner);

        const wellbeingDots = root.querySelector<HTMLElement>(
          "[data-wellbeing-dots]",
        );
        if (wellbeingDots) {
          gsap.fromTo(
            wellbeingDots,
            { xPercent: -3, yPercent: -4 },
            {
              xPercent: 3,
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: "[data-wellbeing-section]",
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            },
          );
        }

        // Velocity-reactive kinetic marquee
        const marqueeTrack =
          root.querySelector<HTMLElement>("[data-marquee-track]");
        if (marqueeTrack) {
          const marqueeTween = gsap.to(marqueeTrack, {
            xPercent: -50,
            duration: 28,
            ease: "none",
            repeat: -1,
          });

          ScrollTrigger.create({
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            onUpdate: (self) => {
              const velocity = self.getVelocity();
              const boost = gsap.utils.clamp(
                0.7,
                2.6,
                1 + Math.abs(velocity) / 900,
              );
              const dir = velocity < -80 ? -1 : 1;
              gsap.to(marqueeTween, {
                timeScale: dir * boost,
                duration: 0.35,
                overwrite: "auto",
              });
            },
          });
        }

        // Healing mandala continuous scroll rotation (mobile + desktop)
        const healingMandala = root.querySelector<HTMLElement>(
          "[data-healing-mandala]",
        );
        if (healingMandala) {
          gsap.to(healingMandala, {
            rotation: 64,
            ease: "none",
            scrollTrigger: {
              trigger: "#healing",
              start: "top bottom",
              end: "bottom top",
              scrub: 1.3,
            },
          });
        }

        // Healing sticky stacking deck choreography (MOBILE + DESKTOP)
        const healingCards = Array.from(
          root.querySelectorAll<HTMLElement>("[data-healing-card]"),
        );
        const healingAnchors = Array.from(
          root.querySelectorAll<HTMLElement>("[data-healing-anchor]"),
        );

        healingCards.forEach((card, index) => {
          const anchor = healingAnchors[index] ?? card;
          const nextAnchor = healingAnchors[index + 1] ?? healingCards[index + 1];

          ScrollTrigger.create({
            trigger: anchor,
            start: "top 62%",
            end: nextAnchor ? "top 62%" : "bottom 35%",
            endTrigger: nextAnchor ?? card,
            onEnter: () => setActiveHealingIndex(index),
            onEnterBack: () => setActiveHealingIndex(index),
          });

          const media = card.querySelector<HTMLElement>("[data-healing-media]");
          if (media) {
            gsap.fromTo(
              media,
              { scale: 1.09 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: anchor,
                  start: "top 95%",
                  end: "top 35%",
                  scrub: 0.75,
                },
              },
            );
          }

          if (index === healingCards.length - 1 || !nextAnchor) return;
          const innerCard = card.querySelector<HTMLElement>(
            "[data-healing-inner]",
          );
          const dimLayer = card.querySelector<HTMLElement>("[data-healing-dim]");

          if (innerCard) {
            gsap.to(innerCard, {
              scale: 0.945,
              ease: "none",
              scrollTrigger: {
                trigger: nextAnchor,
                start: "top 82%",
                end: "top 24%",
                scrub: 0.7,
                invalidateOnRefresh: true,
              },
            });
          }

          if (dimLayer) {
            gsap.to(dimLayer, {
              opacity: 0.28,
              ease: "none",
              scrollTrigger: {
                trigger: nextAnchor,
                start: "top 82%",
                end: "top 24%",
                scrub: 0.7,
              },
            });
          }
        });

        // Mentoring top rule draws smoothly on scroll (mobile + desktop)
        const mentoringRule = root.querySelector<HTMLElement>(
          "[data-mentoring-rule]",
        );
        if (mentoringRule) {
          gsap.fromTo(
            mentoringRule,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: "#mentoring",
                start: "top 88%",
                end: "top 42%",
                scrub: 0.8,
              },
            },
          );
        }

        // Featured Journey: scrubbed curtain clipPath + zoom settle + continuous parallax (mobile + desktop)
        const featuredEl = root.querySelector<HTMLElement>(
          "[data-featured-section]",
        );
        if (featuredEl) {
          const featuredTl = gsap.timeline({
            scrollTrigger: {
              trigger: featuredEl,
              start: "top 88%",
              end: "top 26%",
              scrub: 0.75,
              invalidateOnRefresh: true,
            },
            defaults: { ease: MOTION_TOKENS.ease.scrub },
          });

          featuredTl
            .fromTo(
              "[data-featured-image-mask]",
              { clipPath: "inset(100% 0% 0% 0%)" },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                duration: 0.55,
                ease: MOTION_TOKENS.ease.editorial,
              },
              0,
            )
            .fromTo(
              "[data-featured-image-scale]",
              { scale: 1.12 },
              {
                scale: 1,
                duration: 1,
                ease: MOTION_TOKENS.ease.settle,
              },
              0,
            )
            .fromTo(
              '[data-featured-step="1"]',
              { y: 18, opacity: 0.3 },
              {
                y: 0,
                opacity: 1,
                duration: 0.45,
                ease: MOTION_TOKENS.ease.editorial,
              },
              0.05,
            )
            .fromTo(
              '[data-featured-step="2"]',
              { y: 16, opacity: 0.25 },
              {
                y: 0,
                opacity: 1,
                duration: 0.42,
                ease: MOTION_TOKENS.ease.editorial,
              },
              0.3,
            )
            .fromTo(
              '[data-featured-step="3"]',
              { y: 14, opacity: 0.25 },
              {
                y: 0,
                opacity: 1,
                duration: 0.4,
                ease: MOTION_TOKENS.ease.editorial,
              },
              0.55,
            );

          gsap.fromTo(
            "[data-featured-parallax]",
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: featuredEl,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            },
          );
        }

        // Step top hairlines draw left-to-right sequentially on scroll (mobile + desktop)
        root
          .querySelectorAll<HTMLElement>("[data-step-line]")
          .forEach((line, index) => {
            gsap.fromTo(
              line,
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: "[data-steps-grid]",
                  start: `top ${92 - index * 5}%`,
                  end: `top ${62 - index * 5}%`,
                  scrub: 0.75,
                },
              },
            );
          });

        return () => {
          window.clearTimeout(heroStartTimer);
          cleanupHeroListener?.();
          scrollLineTweens.forEach((t) => t.kill());
          splitInstances.forEach((s) => s.revert());
        };
      });

      // 2. DESKTOP SCRUBBED GRID CHOREOGRAPHY (>= 1024px)
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.to("[data-hero-dock-card]", {
            y: -18,
            stagger: 0.04,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-hero-section]",
              start: "top top",
              end: "bottom 25%",
              scrub: 0.8,
            },
          });

          root
            .querySelectorAll<HTMLElement>("[data-paths-card]")
            .forEach((card, index) => {
              gsap.fromTo(
                card,
                { y: 28 + index * 14, scale: 0.96, opacity: 0.5 },
                {
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: "[data-paths-grid]",
                    start: "top 94%",
                    end: "top 54%",
                    scrub: 0.75,
                    invalidateOnRefresh: true,
                  },
                },
              );
            });

          root
            .querySelectorAll<HTMLElement>("[data-readings-card]")
            .forEach((card, index) => {
              gsap.fromTo(
                card,
                {
                  y: 30 + (index % 2) * 24 + index * 6,
                  scale: 0.94,
                  opacity: 0.5,
                },
                {
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: "[data-readings-grid]",
                    start: "top 94%",
                    end: "top 52%",
                    scrub: 0.8,
                    invalidateOnRefresh: true,
                  },
                },
              );
            });

          root
            .querySelectorAll<HTMLElement>("[data-mentoring-card]")
            .forEach((card, index) => {
              gsap.fromTo(
                card,
                { y: 26 + index * 16, opacity: 0.5 },
                {
                  y: 0,
                  opacity: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: "[data-mentoring-grid]",
                    start: "top 92%",
                    end: "top 54%",
                    scrub: 0.75,
                    invalidateOnRefresh: true,
                  },
                },
              );
            });

          root
            .querySelectorAll<HTMLElement>("[data-step-item]")
            .forEach((step, index) => {
              gsap.fromTo(
                step,
                { y: 24 + index * 14, opacity: 0.45 },
                {
                  y: 0,
                  opacity: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: "[data-steps-grid]",
                    start: "top 92%",
                    end: "top 58%",
                    scrub: 0.75,
                    invalidateOnRefresh: true,
                  },
                },
              );
            });
        },
      );

      // 3. MOBILE / TABLET SCROLL-LINKED CARD ELEVATION & REVEALS (< 1024px)
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Scrubbed staggered lift on Pathway cards as you scroll into them
          root
            .querySelectorAll<HTMLElement>("[data-paths-card]")
            .forEach((card, index) => {
              gsap.fromTo(
                card,
                {
                  y: 26,
                  scale: 0.96,
                  opacity: 0.45,
                },
                {
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 95%",
                    end: `top ${68 - index * 2}%`,
                    scrub: 0.65,
                  },
                },
              );
            });

          // Readings spread grand entrance on mobile
          const readingsGrid = root.querySelector<HTMLElement>(
            "[data-readings-grid]",
          );
          if (readingsGrid) {
            gsap.fromTo(
              readingsGrid.querySelectorAll<HTMLElement>("[data-readings-card]"),
              { y: 32, scale: 0.94, opacity: 0.35 },
              {
                y: 0,
                scale: 1,
                opacity: 1,
                stagger: 0.08,
                duration: 0.82,
                ease: MOTION_TOKENS.ease.editorial,
                clearProps: "transform,opacity",
                scrollTrigger: {
                  trigger: readingsGrid,
                  start: "top 90%",
                  once: true,
                },
              },
            );
          }

          // Mentoring cards scrubbed entrance + clip-path portrait wipe on mobile
          root
            .querySelectorAll<HTMLElement>("[data-mentoring-card]")
            .forEach((card) => {
              gsap.fromTo(
                card,
                { y: 24, scale: 0.97, opacity: 0.4 },
                {
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 95%",
                    end: "top 66%",
                    scrub: 0.65,
                  },
                },
              );

              const thumb = card.querySelector<HTMLElement>(
                "[data-mentoring-thumb]",
              );
              if (thumb) {
                gsap.fromTo(
                  thumb,
                  { clipPath: "inset(100% 0% 0% 0%)" },
                  {
                    clipPath: "inset(0% 0% 0% 0%)",
                    ease: "none",
                    scrollTrigger: {
                      trigger: card,
                      start: "top 92%",
                      end: "top 62%",
                      scrub: 0.65,
                    },
                  },
                );
              }
            });

          // What Happens Next scrubbed elevation per step on mobile
          root
            .querySelectorAll<HTMLElement>("[data-step-item]")
            .forEach((step) => {
              gsap.fromTo(
                step,
                { y: 22, opacity: 0.35 },
                {
                  y: 0,
                  opacity: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: step,
                    start: "top 94%",
                    end: "top 68%",
                    scrub: 0.6,
                  },
                },
              );
            });
        },
      );

      // Refresh ScrollTrigger once webfonts finish loading and on horizontal orientation changes only
      void document.fonts?.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });

      let lastWidth = window.innerWidth;
      const onResize = () => {
        if (Math.abs(window.innerWidth - lastWidth) > 24) {
          lastWidth = window.innerWidth;
          ScrollTrigger.refresh();
        }
      };
      window.addEventListener("resize", onResize, { passive: true });

      return () => {
        cancelled = true;
        window.removeEventListener("resize", onResize);
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      className={`${styles.choreographyRoot} overflow-x-clip bg-[#f8f3e9] text-[#241b17]`}
    >
      {/* Top editorial reading progress hairline (synced to scroll via GSAP) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-16 z-40 h-[2px] bg-[#c9a520]/15"
      >
        <div
          data-scroll-progress
          className="h-full origin-left scale-x-0 bg-gradient-to-r from-[#981313] via-[#ddb829] to-[#f0d060]"
        />
      </div>

      {/* 1. HERO - CINEMATIC DOUBLE-BEZEL SACRED PORTAL & BENTO DOCK */}
      <section
        data-hero-section
        className="relative isolate bg-[#fdf8f0] px-3 pb-10 pt-20 sm:px-6 sm:pb-12 sm:pt-22 lg:px-8"
      >
        <div
          data-hero-stage
          className="relative mx-auto max-w-[1400px] rounded-[2rem] border border-[#c7a23b]/45 bg-[#2a0a0a] p-1.5 shadow-[0_48px_100px_-42px_rgba(61,12,12,0.55)] will-change-transform sm:rounded-[2.85rem] sm:p-2"
        >
          <div className="relative flex min-h-[82dvh] flex-col justify-between overflow-hidden rounded-[1.65rem] bg-[#1c1917] px-5 py-7 text-white sm:rounded-[2.35rem] sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            {/* Full-bleed atmospheric backdrop with scroll parallax */}
            <div
              data-hero-parallax
              className="pointer-events-none absolute -inset-10 will-change-transform"
            >
              <div
                data-hero-image-scale
                className="absolute inset-0 will-change-transform"
              >
                <Image
                  src="/images/page-heroes/services-hero-luxury.webp"
                  alt="Manisha Belvalkar private guidance, healing and mentoring services"
                  fill
                  preload
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            {/* Warm sacred crimson-charcoal gradient & subtle radial golden bloom (GPU-friendly) */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1a0b0b]/62 via-[#2b0909]/36 to-[#160d0b]/80"
            />
            <div
              data-hero-glow
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[34%] size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(221,184,41,0.22)_0%,transparent_68%)] sm:size-[42rem]"
            />
            <div
              data-hero-mandala
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[40%] size-[24rem] -translate-x-1/2 -translate-y-1/2 will-change-transform sm:size-[40rem]"
            >
              <SacredOrbitalRing className="size-full text-[#f0d060]/14" />
            </div>

            {/* Top editorial status bar */}
            <div
              data-hero-eyebrow
              className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5 sm:pb-4"
            >
              <Marker light>Private guidance, thoughtfully held</Marker>
              <span className="hidden text-[11px] font-semibold uppercase tracking-[0.22em] text-[#efe5d2]/75 sm:inline-block">
                Mumbai · Pune · Online
              </span>
            </div>

            {/* Centered wide editorial display + inline image pill (active on mobile & desktop) */}
            <div
              data-hero-text-parallax
              className="relative z-10 mx-auto my-auto flex max-w-5xl flex-col items-center py-8 text-center sm:py-14"
            >
              <h1 className="max-w-5xl text-balance font-serif text-[2.35rem] font-medium leading-[1.03] tracking-[-0.03em] text-[#fdf8f0] sm:text-[clamp(3.15rem,5.9vw,5.4rem)] sm:leading-[0.99]">
                <span className="block overflow-hidden pb-1.5">
                  <span
                    data-hero-line
                    className="inline-block"
                  >
                    A clearer
                    <span
                      data-hero-pill
                      className="relative mx-2 inline-block h-[0.68em] w-[1.45em] overflow-hidden rounded-full border border-[#ddb829]/70 align-middle shadow-[0_14px_30px_-10px_rgba(0,0,0,0.65)] sm:mx-2.5 sm:h-[0.72em] sm:w-[1.6em]"
                    >
                      <Image
                        src="/images/tarot.webp"
                        alt=""
                        fill
                        sizes="(max-width: 640px) 72px, 120px"
                        className="object-cover"
                      />
                    </span>
                    way
                  </span>
                </span>
                <span className="block overflow-hidden pb-2">
                  <span
                    data-hero-line
                    className="inline-block text-[#f0d060]"
                  >
                    back to yourself.
                  </span>
                </span>
              </h1>

              <p
                data-hero-copy
                className="mt-4 max-w-2xl text-pretty text-base leading-7 text-[#efe5d2]/90 sm:mt-7 sm:text-xl sm:leading-9"
              >
                Personal Tarot, energy healing and mentoring experiences crafted
                for the turning points that cannot be solved by logic alone.
              </p>

              <div
                data-hero-cta
                className="mt-7 flex flex-wrap items-center justify-center gap-3.5 sm:mt-10 sm:gap-5"
              >
                <a
                  href="#paths"
                  style={{ "--bevel-border": "#f0d060" } as CSSProperties}
                  className={`${styles.bevelButton} group inline-flex min-h-12 items-center gap-4 rounded-full bg-[#ddb829] py-2 pl-6 pr-2 text-xs font-bold uppercase tracking-[0.15em] text-[#1c1917] shadow-[0_24px_50px_-18px_rgba(221,184,41,0.65)] hover:bg-[#f0d060] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:min-h-14 sm:pl-7 sm:pr-2.5`}
                >
                  <span>Find your path</span>
                  <span className="grid size-8 place-items-center rounded-full bg-[#1c1917]/12 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 sm:size-9">
                    <ArrowRight className="size-4" strokeWidth={1.7} />
                  </span>
                </a>

                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#f0d060]/55 bg-white/8 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-[#fdf8f0] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-[#f0d060] hover:bg-white/15 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:min-h-14 sm:px-7"
                >
                  Ask Manisha&apos;s team
                </Link>
              </div>
            </div>

            {/* Bottom 3-panel obsidian bento dock */}
            <div className="relative z-10 grid gap-2.5 sm:gap-4 lg:grid-cols-[1.35fr_0.82fr_0.82fr]">
              <div
                data-hero-dock-card
                className="flex min-w-0 items-center gap-3.5 rounded-[1.2rem] border border-[#ddb829]/25 bg-[#160a0a]/82 p-3.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] sm:gap-4 sm:rounded-[1.35rem] sm:p-5"
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-[#ddb829]/50 sm:size-16">
                  <Image
                    src="/images/manisha/manisha-services-mentor.webp"
                    alt="Dr. Manisha Belvalkar"
                    fill
                    sizes="64px"
                    className="object-cover object-[50%_18%]"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-sm leading-snug text-[#fdf8f0] sm:text-base">
                    “The right session is not about knowing everything. It is
                    about seeing what matters now.”
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f0d060]">
                    Dr. Manisha Belvalkar · 30+ Years
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:col-span-2">
                <a
                  href="#readings"
                  data-hero-dock-card
                  className="group flex min-w-0 flex-col justify-between rounded-[1.2rem] border border-white/15 bg-[#160a0a]/74 p-3.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] transition-colors duration-300 hover:border-[#ddb829]/50 hover:bg-[#1e0d0d]/88 active:scale-[0.99] sm:rounded-[1.35rem] sm:p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f0d060] sm:text-[11px]">
                      Tarot &amp; Purpose
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-[#f0d060] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="mt-2 font-serif text-sm leading-snug text-[#fdf8f0] sm:text-lg">
                    Insight for decisions &amp; life chapters
                  </p>
                </a>

                <a
                  href="#healing"
                  data-hero-dock-card
                  className="group flex min-w-0 flex-col justify-between rounded-[1.2rem] border border-white/15 bg-[#160a0a]/74 p-3.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] transition-colors duration-300 hover:border-[#ddb829]/50 hover:bg-[#1e0d0d]/88 active:scale-[0.99] sm:rounded-[1.35rem] sm:p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f0d060] sm:text-[11px]">
                      Healing &amp; Shakti
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 text-[#f0d060] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="mt-2 font-serif text-sm leading-snug text-[#fdf8f0] sm:text-lg">
                    Emotional release &amp; energy balance
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PATHWAYS INTRO, INTERACTIVE GUIDANCE FINDER & GRID */}
      <section
        id="paths"
        className="relative scroll-mt-20 px-4 py-12 sm:px-10 sm:py-20 lg:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(217,185,87,0.14)_0%,transparent_70%)] sm:h-96 sm:w-96"
        />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h2
              data-split-heading
              className="font-serif text-[1.95rem] leading-[1.06] tracking-[-0.03em] sm:text-5xl lg:text-6xl"
            >
              You do not need to know the service.
              <span className="block text-[#a81414]">
                Only where you are.
              </span>
            </h2>
          </div>

          {/* Interactive Guidance Finder - lets visitors match their present need in one tap */}
          <div
            data-guidance-finder
            className="mt-7 rounded-2xl border border-[#d8c8ae] bg-[#fffdf9] p-4 shadow-[0_24px_55px_-38px_rgba(107,11,11,0.3)] sm:mt-10 sm:rounded-[1.75rem] sm:p-6 lg:p-7"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#981313]">
                  Quick session matcher
                </p>
                <p className="mt-1 font-serif text-lg text-[#241b17] sm:text-xl">
                  Tap what feels closest right now
                </p>
              </div>
              <div
                role="tablist"
                aria-label="Choose what brings you here"
                className="hide-scrollbar flex items-center gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:pb-0"
              >
                {intentRecommendations.map((item) => {
                  const active = item.id === selectedIntent;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setSelectedIntent(item.id)}
                      className={`inline-flex min-h-10 shrink-0 cursor-pointer items-center whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 ${
                        active
                          ? "bg-[#6b0b0b] text-[#fdf8f0] shadow-[0_12px_28px_-14px_rgba(107,11,11,0.75)] focus-visible:outline-[#6b0b0b]"
                          : "border border-[#d8c8ae] bg-[#faf6ef] text-[#523d34] hover:border-[#c5a146] hover:bg-[#faf3dc] focus-visible:outline-[#a8871a]"
                      }`}
                    >
                      {item.chip}
                    </button>
                  );
                })}
              </div>
            </div>

            {activeRecommendation && (
              <div
                key={activeRecommendation.id}
                role="tabpanel"
                className={`${styles.finderPanelEnter} mt-4 flex flex-col justify-between gap-4 rounded-xl border border-[#e5dcc6] bg-[#f8f3e9] p-4 sm:mt-5 sm:flex-row sm:items-center sm:rounded-2xl sm:p-5`}
              >
                <div className="min-w-0 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#a8871a]">
                    <span>{activeRecommendation.discipline}</span>
                    <span aria-hidden="true" className="text-[#c5a146]">
                      ·
                    </span>
                    <span className="text-[#6b0b0b]">
                      {activeRecommendation.meta}
                    </span>
                  </div>
                  <h3 className="mt-1.5 font-serif text-xl leading-snug text-[#241b17] sm:text-2xl">
                    {activeRecommendation.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-[#5f4a3f] sm:text-base">
                    {activeRecommendation.reason}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2.5 sm:gap-3">
                  <Link
                    href={activeRecommendation.href}
                    className="group/match inline-flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-full bg-[#a81414] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors duration-300 hover:bg-[#6b0b0b] active:scale-[0.98]"
                  >
                    <span>{activeRecommendation.ctaLabel}</span>
                    <ArrowRight className={`${styles.ctaArrow} size-4`} />
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      scrollToSection(activeRecommendation.sectionHref)
                    }
                    className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full border border-[#c7a23b]/60 bg-white px-4 py-2.5 text-xs font-semibold text-[#6b0b0b] transition-colors hover:bg-[#faf3dc] active:scale-[0.98]"
                  >
                    Jump to section
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            data-paths-grid
            className="relative mt-6 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
          >
            {pathways.map((path, index) => {
              const Icon = path.icon;
              const isHash = path.href.startsWith("#");
              const cardContent = (
                <>
                  <div className="flex items-start justify-between">
                    <Icon className="size-5 text-[#a81414] sm:size-6" />
                    <span className="text-xs font-semibold tracking-[0.18em] text-[#a8871a] tabular-nums">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="mt-auto pt-5 sm:pt-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8871a]">
                      {path.eyebrow}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl leading-tight sm:mt-3 sm:text-3xl">
                      {path.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-6 text-[#5f4a3f] sm:mt-4 sm:text-base sm:leading-7">
                      {path.text}
                    </p>
                    <ArrowUpRight
                      className={`${styles.ctaArrowDiagonal} mt-4 size-5 text-[#a81414] sm:mt-6`}
                    />
                  </div>
                </>
              );

              const cardClasses = `${styles.cardSurface} ${styles.spotlightCard} group flex h-full flex-col rounded-xl border border-[#d8c8ae] bg-white p-5 shadow-[0_24px_40px_-30px_rgba(107,11,11,0.25)] hover:border-[#c5a146] hover:shadow-[0_24px_40px_-28px_rgba(107,11,11,0.4)] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a81414] sm:min-h-[280px] sm:rounded-md sm:p-8`;

              return (
                <div key={path.title} data-paths-card>
                  {isHash ? (
                    <a
                      href={path.href}
                      onPointerMove={updateSpotlight}
                      className={cardClasses}
                    >
                      {cardContent}
                    </a>
                  ) : (
                    <Link
                      href={path.href}
                      onPointerMove={updateSpotlight}
                      className={cardClasses}
                    >
                      {cardContent}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. TAROT & SOUL GUIDANCE */}
      <section
        id="readings"
        className="relative scroll-mt-20 overflow-hidden border-y border-[#6b0b0b]/10 bg-[#f3eadc] px-4 py-12 sm:px-10 sm:py-20 lg:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-24 size-[24rem] rounded-full bg-[radial-gradient(circle,rgba(195,154,50,0.16)_0%,transparent_70%)] sm:size-[34rem]"
        />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-5 sm:gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <Marker>Tarot &amp; soul guidance</Marker>
              <h2
                data-split-heading
                className="mt-4 max-w-2xl text-balance font-serif text-[1.85rem] leading-[1.06] tracking-[-0.03em] sm:mt-6 sm:text-5xl lg:text-6xl"
              >
                Insight for the chapter
                <span className="block italic text-[#a81414]">
                  you are living now.
                </span>
              </h2>
            </div>
            <div className="lg:pb-1">
              <p
                data-soft-reveal
                className="max-w-xl text-base leading-7 text-[#5f4a3f] sm:text-lg sm:leading-8"
              >
                A focused private conversation that brings intuitive insight and
                grounded perspective to your most important questions.
              </p>
              <p
                data-scrub-words
                className="mt-3 max-w-xl font-serif text-lg italic leading-7 text-[#8f0e0e] sm:mt-5 sm:text-xl sm:leading-8"
              >
                No fear-based predictions. No generic answers. Just honest,
                compassionate clarity.
              </p>
            </div>
          </div>

          {/* Mobile swipeable Tarot spread header controls */}
          {tarotServices.length > 1 && (
            <div className="mt-7 flex items-center justify-between gap-4 md:hidden">
              <div className="flex items-center gap-2">
                {tarotServices.map((service, idx) => (
                  <button
                    key={service.slug}
                    type="button"
                    aria-label={`View reading ${idx + 1}: ${service.title}`}
                    onClick={() => stepReadingSpread(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeReadingIndex
                        ? "w-7 bg-[#981313]"
                        : "w-2 bg-[#981313]/25"
                    }`}
                  />
                ))}
                <span className="ml-2 text-xs font-semibold tracking-[0.16em] text-[#6b0b0b] tabular-nums">
                  0{activeReadingIndex + 1} / 0{tarotServices.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => stepReadingSpread(activeReadingIndex - 1)}
                  disabled={activeReadingIndex === 0}
                  aria-label="Previous reading card"
                  className="grid size-10 place-items-center rounded-full border border-[#d8c8ae] bg-white text-[#6b0b0b] transition-colors disabled:opacity-40"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => stepReadingSpread(activeReadingIndex + 1)}
                  disabled={activeReadingIndex === tarotServices.length - 1}
                  aria-label="Next reading card"
                  className="grid size-10 place-items-center rounded-full border border-[#d8c8ae] bg-white text-[#6b0b0b] transition-colors disabled:opacity-40"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* Original 4-column desktop arch grid; interactive horizontal snap-spread on mobile */}
          <div
            ref={readingsRailRef}
            data-readings-grid
            className="hide-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 pt-4 md:mx-0 md:mt-14 md:grid md:grid-cols-2 md:gap-7 md:overflow-visible md:px-0 md:pb-0 md:pt-0 xl:grid-cols-4"
          >
            {tarotServices.map((service, index) => (
              <div
                key={service.slug}
                data-readings-card
                className="h-full w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink"
              >
                <article
                  onPointerMove={updateSpotlight}
                  className={`${styles.cardSurface} ${styles.spotlightCard} group relative flex h-full flex-col rounded-t-[10rem] rounded-b-2xl border p-2 sm:min-h-[35rem] sm:rounded-t-[999px] sm:rounded-b-xl sm:p-2.5 ${
                    service.mostBooked
                      ? "border-[#6b0b0b] bg-[#6b0b0b] text-white shadow-[0_35px_70px_-35px_rgba(107,11,11,0.75)]"
                      : "border-[#d8c8ae] bg-[#fffdf9] shadow-[0_24px_60px_-42px_rgba(107,11,11,0.55)] hover:border-[#c5a146]"
                  }`}
                >
                  {service.mostBooked && (
                    <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#ddb829] px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#371d17] sm:py-2">
                      Most booked
                    </span>
                  )}
                  <div
                    className={`flex h-full flex-col rounded-t-[9.5rem] rounded-b-xl border px-4 pb-4 pt-9 text-center sm:rounded-t-[999px] sm:rounded-b-lg sm:px-5 sm:pb-5 sm:pt-14 ${
                      service.mostBooked
                        ? "border-[#ddb829]"
                        : "border-[#c9a520]"
                    }`}
                  >
                    <span
                      className={`font-serif text-xs tracking-[0.28em] tabular-nums sm:text-sm ${
                        service.mostBooked ? "text-[#e4c665]" : "text-[#8f0e0e]"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Sparkles
                      className={`mx-auto mt-3 size-7 stroke-[1.2] sm:mt-5 sm:size-10 ${
                        service.mostBooked ? "text-[#e4c665]" : "text-[#a81414]"
                      }`}
                    />
                    <h3 className="mt-3 font-serif text-2xl leading-tight sm:mt-5 sm:text-3xl">
                      {service.title}
                    </h3>
                    <p
                      className={`mt-3 text-sm leading-6 sm:mt-5 sm:text-[0.95rem] sm:leading-7 ${
                        service.mostBooked ? "text-white/75" : "text-[#5f4a3f]"
                      }`}
                    >
                      {service.description}
                    </p>
                    <div
                      className={`mt-5 flex items-end justify-between border-t pt-4 text-left sm:mt-auto sm:pt-5 ${
                        service.mostBooked
                          ? "border-[#ddb829]/35"
                          : "border-[#6b0b0b]/12"
                      }`}
                    >
                      <span
                        className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] sm:gap-2 ${
                          service.mostBooked
                            ? "text-[#f0d77c]"
                            : "text-[#6b0b0b]"
                        }`}
                      >
                        <Clock className="size-3.5" /> {service.duration}
                      </span>
                      <span className="font-serif text-xl tabular-nums sm:text-2xl">
                        {formatINR(service.price)}
                      </span>
                    </div>
                    <Link
                      href={`/services/${service.slug}`}
                      className={`mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-xs font-bold uppercase tracking-[0.15em] transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 sm:mt-5 sm:min-h-12 ${
                        service.mostBooked
                          ? "bg-[#ddb829] text-[#371d17] hover:bg-[#f0d060] focus-visible:outline-[#f0d060]"
                          : "bg-[#a81414] text-white hover:bg-[#6b0b0b] focus-visible:outline-[#a81414]"
                      }`}
                    >
                      Reserve session{" "}
                      <ArrowRight className={`${styles.ctaArrow} size-4`} />
                    </Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WELL-BEING BANNER */}
      {wellbeingServices.length > 0 && (
        <section
          data-wellbeing-section
          className="relative overflow-hidden bg-[#981313] px-4 py-10 text-white sm:px-10 sm:py-16 lg:py-20"
        >
          <div
            data-wellbeing-dots
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:20px_20px]"
          />
          <div
            data-wellbeing-banner
            className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 lg:flex-row lg:items-center lg:gap-8"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0d77c]">
                Well-being sessions
              </p>
              <h2
                data-split-heading
                className="mt-2 font-serif text-2xl sm:text-4xl"
              >
                When one session is only the beginning.
              </h2>
            </div>
            {wellbeingServices.map((service) => (
              <div
                className="flex w-full flex-col gap-4 border-t border-white/20 pt-5 sm:flex-row sm:items-center sm:justify-between lg:w-auto lg:min-w-[460px] lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
                key={service.slug}
              >
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-white/80 sm:mt-2 sm:text-base tabular-nums">
                    {service.duration} · {formatINR(service.price)}
                  </p>
                </div>
                <Link
                  href={`/services/${service.slug}`}
                  className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#8f0e0e] transition-colors hover:bg-[#f5e8c0] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:min-h-12 sm:px-6"
                >
                  Explore{" "}
                  <ArrowRight className={`${styles.ctaArrow} size-4`} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Velocity-reactive kinetic practice ribbon (one marquee on page) */}
      <div
        aria-hidden="true"
        className="overflow-hidden border-b border-[#ddb829]/25 bg-[#1c1917] py-3.5 text-[#f0d060]"
      >
        <div data-marquee-track className={styles.marqueeTrack}>
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center gap-8 pr-8">
              {marqueeTerms.map((term) => (
                <span
                  key={`${dup}-${term}`}
                  className="inline-flex items-center gap-8 whitespace-nowrap font-serif text-sm tracking-[0.06em] text-[#efe5d2]/90 sm:text-base"
                >
                  <span>{term}</span>
                  <Sparkles className="size-3.5 text-[#ddb829]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 5. HEALING & ENERGY WORK - MOBILE & DESKTOP STICKY STACKING CARD DECK */}
      <section
        id="healing"
        className="relative scroll-mt-20 overflow-x-clip bg-[#6b0b0b] px-4 pb-20 pt-14 text-white sm:px-10 sm:py-24 lg:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-24 top-20 size-[22rem] rounded-full bg-[radial-gradient(circle,rgba(221,184,41,0.14)_0%,transparent_70%)] sm:size-[34rem]" />
          <div className="absolute -right-24 bottom-24 size-[20rem] rounded-full bg-[radial-gradient(circle,rgba(180,20,20,0.34)_0%,transparent_70%)] sm:size-[28rem]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-stretch gap-6 sm:gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="min-w-0 lg:self-stretch">
            <div
              data-healing-sticky
              className="relative min-w-0 lg:sticky lg:top-28"
            >
              <div
                data-healing-mandala
                aria-hidden="true"
                className="pointer-events-none absolute -left-10 -top-10 -z-10 size-52 will-change-transform sm:-left-20 sm:-top-20 sm:size-88"
              >
                <SacredOrbitalRing className="size-full text-[#f0d060]/14" />
              </div>

              <Marker light>Healing &amp; energy work</Marker>
              <h2
                data-split-heading
                className="mt-4 w-full max-w-xl font-serif text-[1.9rem] leading-[1.06] tracking-[-0.03em] sm:mt-6 sm:text-5xl lg:text-[3.4rem]"
              >
                Create space for{" "}
                <span className="text-[#f0d060]">what wants to change.</span>
              </h2>
              <p
                data-scrub-words
                className="mt-3.5 w-full max-w-md text-[15px] leading-6 text-[#efe5d2]/90 sm:mt-6 sm:text-lg sm:leading-8"
              >
                Gentle, private sessions designed to support emotional release,
                energetic balance and a more centred relationship with yourself.
              </p>

              {/* Desktop live modality focus indicator + jump rail */}
              {healingServices.length > 0 && (
                <div className="mt-10 hidden rounded-[1.5rem] border border-[#ddb829]/25 bg-[#520707]/85 p-5 shadow-[0_24px_45px_-28px_rgba(0,0,0,0.65)] lg:block">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f0d060]">
                      In focus
                    </span>
                    <span className="font-serif text-xs tracking-[0.2em] text-[#efe5d2] tabular-nums">
                      0
                      {Math.min(
                        activeHealingIndex + 1,
                        healingServices.length,
                      )}{" "}
                      / 0{healingServices.length}
                    </span>
                  </div>

                  <div
                    aria-hidden="true"
                    className="mt-3 h-px w-full overflow-hidden bg-white/15"
                  >
                    <div
                      className="h-full bg-[#ddb829] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                      style={{
                        width: `${((Math.min(activeHealingIndex, healingServices.length - 1) + 1) / healingServices.length) * 100}%`,
                      }}
                    />
                  </div>

                  <nav
                    aria-label="Healing modalities index"
                    className="mt-3.5 grid gap-1"
                  >
                    {healingServices.map((service, idx) => {
                      const isActive = idx === activeHealingIndex;
                      return (
                        <a
                          key={service.slug}
                          href={`#healing-card-${idx}`}
                          onClick={() => setActiveHealingIndex(idx)}
                          className={`group flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-all duration-300 ${
                            isActive
                              ? "bg-white/10 text-white"
                              : "text-[#efe5d2]/70 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span className="flex min-w-0 items-center gap-2.5">
                            <span
                              aria-hidden="true"
                              className={`size-1.5 shrink-0 rounded-full transition-colors ${
                                isActive ? "bg-[#ddb829]" : "bg-white/25"
                              }`}
                            />
                            <span className="truncate font-serif">
                              {service.title}
                            </span>
                          </span>
                          <span className="shrink-0 text-[11px] tracking-[0.16em] text-[#f0d060]/80 tabular-nums">
                            0{idx + 1}
                          </span>
                        </a>
                      );
                    })}
                  </nav>
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 w-full">
            {/* Mobile/tablet sticky horizontal pill rail */}
            {healingServices.length > 0 && (
              <div className="sticky top-[68px] z-30 mb-5 w-full max-w-full overflow-hidden rounded-2xl border border-[#ddb829]/30 bg-[#4b0707]/95 p-1.5 shadow-[0_16px_32px_-14px_rgba(0,0,0,0.65)] backdrop-blur-md lg:hidden">
                <nav
                  ref={mobileRailRef}
                  aria-label="Healing modalities quick jump"
                  className="hide-scrollbar flex w-full items-center gap-1.5 overflow-x-auto"
                >
                  {healingServices.map((service, idx) => {
                    const isActive = idx === activeHealingIndex;
                    return (
                      <a
                        key={service.slug}
                        data-healing-pill={idx}
                        href={`#healing-card-${idx}`}
                        onClick={() => setActiveHealingIndex(idx)}
                        className={`inline-flex min-h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-300 ${
                          isActive
                            ? "bg-[#ddb829] text-[#241b17] shadow-sm"
                            : "bg-white/8 text-[#efe5d2] hover:bg-white/14"
                        }`}
                      >
                        <span
                          className={`text-[10px] tracking-[0.16em] tabular-nums ${
                            isActive ? "text-[#6b0b0b]" : "text-[#f0d060]"
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        <span className="font-serif">
                          {service.title.split(" (")[0]}
                        </span>
                      </a>
                    );
                  })}
                </nav>
              </div>
            )}

            <div
              data-healing-stack
              className="min-w-0 pb-8 lg:pb-20"
            >
              {healingServices.map((service, index) => {
                const stickyVars = {
                  "--sticky-mobile": `${126 + index * 10}px`,
                  "--sticky-desktop": `${112 + index * 18}px`,
                  "--sticky-z": 10 + index,
                } as CSSProperties;

                return (
                  <Fragment key={service.slug}>
                    {/* Non-sticky anchor marker so clicking rail pills works up AND down */}
                    <span
                      id={`healing-card-${index}`}
                      data-healing-anchor
                      aria-hidden="true"
                      className="pointer-events-none block h-0 scroll-mt-36 lg:scroll-mt-28"
                    />
                    <div
                      data-healing-card
                      style={stickyVars}
                      className={`${styles.healingStickyCard} mb-6 min-w-0 last:mb-0 sm:mb-8 lg:mb-10`}
                    >
                      <div
                        data-healing-inner
                        className={`${styles.hoverZoomFrame} group relative min-w-0 overflow-hidden rounded-[1.5rem] border border-[#ddb829]/35 bg-[#4d0707] p-1.5 shadow-[0_-20px_55px_-26px_rgba(0,0,0,0.72)] will-change-transform sm:rounded-[2rem] sm:p-2`}
                      >
                        <div
                          data-healing-dim
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 z-20 rounded-[1.5rem] bg-[#140303] opacity-0 sm:rounded-[2rem]"
                        />

                        <div className="grid min-w-0 items-stretch gap-3.5 rounded-[1.15rem] bg-[#fdf8f0] p-3.5 text-[#241b17] sm:grid-cols-[0.82fr_1.18fr] sm:gap-7 sm:rounded-[1.5rem] sm:p-6 lg:p-7">
                          <div className="relative h-36 min-w-0 overflow-hidden rounded-[0.9rem] sm:h-auto sm:min-h-[260px] sm:rounded-[1.15rem]">
                            <div
                              data-healing-media
                              className="absolute inset-0 will-change-transform"
                            >
                              <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 40vw, 340px"
                                className={`${styles.hoverZoomMedia} object-cover`}
                              />
                            </div>
                            <div
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1c1917]/45 via-transparent to-transparent"
                            />
                            <span className="absolute left-2.5 top-2.5 rounded-full bg-[#1c1917]/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#f0d060] sm:left-3.5 sm:top-3.5 sm:px-3">
                              0{index + 1} · {service.format ?? "Private session"}
                            </span>
                          </div>

                          <div className="flex min-w-0 flex-col justify-between py-0.5 sm:py-1">
                            <div>
                              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                                <h3 className="font-serif text-[1.32rem] leading-tight sm:text-[1.85rem]">
                                  {service.title}
                                </h3>
                                {service.price && (
                                  <span className="shrink-0 font-serif text-lg text-[#8f0e0e] tabular-nums sm:text-2xl">
                                    {formatINR(service.price)}
                                  </span>
                                )}
                              </div>
                              <p className="mt-2 line-clamp-3 text-[13.5px] leading-5 text-[#5f4a3f] sm:mt-3 sm:line-clamp-none sm:text-base sm:leading-7">
                                {service.description}
                              </p>
                              <ul className="mt-3 space-y-1.5 border-t border-[#d8c8ae] pt-2.5 sm:mt-4 sm:space-y-2 sm:pt-4">
                                {service.features.slice(0, 3).map((feature) => (
                                  <li
                                    key={feature}
                                    className="flex items-start gap-2 text-[13px] leading-5 text-[#47362d] sm:gap-2.5 sm:text-sm sm:leading-6"
                                  >
                                    <Check
                                      className="mt-0.5 size-3.5 shrink-0 text-[#981313] sm:mt-1 sm:size-4"
                                      strokeWidth={1.7}
                                    />
                                    <span>{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="mt-4 flex items-center justify-between gap-4 sm:mt-6">
                              <Link
                                href={`/healing/${service.slug}`}
                                className="group/heal inline-flex min-h-10 w-full items-center justify-between gap-3 rounded-full bg-[#6b0b0b] py-1.5 pl-5 pr-2 text-xs font-bold uppercase tracking-[0.15em] text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-[#981313] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6b0b0b] sm:min-h-11 sm:w-auto sm:justify-start"
                              >
                                <span>Explore healing</span>
                                <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/heal:translate-x-0.5 group-hover/heal:-translate-y-px group-hover/heal:scale-105 sm:size-8">
                                  <ArrowUpRight
                                    className="size-4"
                                    strokeWidth={1.7}
                                  />
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. MENTORING - EDITORIAL PORTRAITS & SCRUBBED WAVE */}
      <section
        id="mentoring"
        className="relative scroll-mt-20 bg-[#f0e6d7] px-4 py-12 sm:px-10 sm:py-20 lg:py-32"
      >
        <div
          data-mentoring-rule
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left bg-[#8f0e0e] will-change-transform"
        />
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h2
              data-split-heading
              className="font-serif text-[1.9rem] leading-[1.06] tracking-[-0.03em] sm:text-5xl lg:text-6xl"
            >
              A deeper practice, held over time.
            </h2>
            <p
              data-scrub-words
              className="mt-4 max-w-2xl text-base leading-7 text-[#644d43] sm:mt-7 sm:text-lg sm:leading-8"
            >
              For those who want to move beyond a single answer and build
              discernment, self-trust and a grounded spiritual practice.
            </p>
          </div>

          <div
            data-mentoring-grid
            className="mt-8 grid gap-4 sm:mt-14 lg:grid-cols-3 lg:gap-px lg:bg-[#6b0b0b]/14"
          >
            {mentoringAreas.map((area, index) => (
              <div key={area.slug} data-mentoring-card className="h-full">
                <Link
                  href={`/mentoring/${area.slug}`}
                  onPointerMove={updateSpotlight}
                  className={`${styles.hoverZoomFrame} ${styles.spotlightCard} group flex h-full flex-col overflow-hidden rounded-2xl border border-[#d8c8ae] bg-[#fffdf8] p-4 transition-colors hover:bg-white active:scale-[0.99] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#a81414] lg:rounded-none lg:border-0 lg:p-8`}
                >
                  <div
                    data-mentoring-thumb
                    className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#efe5d2]"
                  >
                    <Image
                      src={area.image}
                      alt={area.title}
                      fill
                      sizes="(max-width: 1024px) 92vw, 30vw"
                      className={`${styles.hoverZoomMedia} object-cover object-center`}
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1c1917]/40 via-transparent to-transparent"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-[#1c1917]/85 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f0d060]">
                      Path 0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-2xl leading-tight sm:mt-7 sm:text-3xl">
                    {area.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-6 text-[#523d34] sm:mt-4 sm:text-base sm:leading-7">
                    {area.short}
                  </p>

                  {area.features.length > 0 && (
                    <ul className="mt-4 space-y-1.5 border-t border-[#efe5d2] pt-3.5 text-xs leading-5 text-[#5f4a3f]">
                      {area.features.slice(0, 2).map((feat) => (
                        <li key={feat} className="flex items-start gap-2">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-[#a81414]" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <span className="mt-5 flex items-center gap-2 pt-3 text-sm font-semibold text-[#8f0e0e] lg:mt-auto lg:pt-7">
                    Discover this path
                    <ArrowRight className={`${styles.ctaArrow} size-4`} />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FEATURED JOURNEY - SCRUBBED CURTAIN REVEAL & PARALLAX (MOBILE + DESKTOP) */}
      {featuredCourse && (
        <section
          id="signature-journey"
          data-featured-section
          className="scroll-mt-20 bg-[#fdf8f0] px-4 py-12 sm:px-10 sm:py-20 lg:py-28"
        >
          <div
            className={`${styles.hoverZoomFrame} group mx-auto grid max-w-[1200px] overflow-hidden rounded-2xl bg-[#1c1917] text-white shadow-[0_38px_80px_-42px_rgba(28,25,23,0.6)] lg:grid-cols-[0.9fr_1.1fr]`}
          >
            <div className="relative min-h-[260px] overflow-hidden sm:min-h-[360px] lg:min-h-[600px]">
              <div
                data-featured-image-mask
                className="absolute inset-0 overflow-hidden"
              >
                <div
                  data-featured-parallax
                  className="absolute -inset-y-10 inset-x-0 will-change-transform"
                >
                  <div
                    data-featured-image-scale
                    className="absolute inset-0 will-change-transform"
                  >
                    <Image
                      src="/images/manisha/manisha-services-mentor.webp"
                      alt="Dr. Manisha Belvalkar - Spiritual Mentor"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className={`${styles.hoverZoomMedia} object-cover object-[50%_18%]`}
                    />
                  </div>
                </div>
              </div>
              <span
                data-featured-step="3"
                className="absolute bottom-4 left-4 z-10 rounded-full bg-[#ddb829] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#292524] sm:bottom-6 sm:left-6 sm:px-5 sm:py-2"
              >
                {featuredCourse.duration}
              </span>
            </div>
            <div className="flex items-center p-5 sm:p-12 lg:p-16">
              <div>
                <div data-featured-step="1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0d060]">
                    Signature journey
                  </p>
                  <h2
                    data-split-heading
                    className="mt-3 font-serif text-[1.75rem] leading-[1.08] tracking-[-0.03em] sm:mt-4 sm:text-4xl lg:text-5xl"
                  >
                    {featuredCourse.title}
                  </h2>
                  <p className="mt-4 text-base leading-7 text-[#d6cfc2] sm:mt-6 sm:text-lg sm:leading-9">
                    {featuredCourse.description}
                  </p>
                </div>

                {featuredCourse.highlights.length > 0 && (
                  <div
                    data-featured-step="2"
                    className="mt-5 flex flex-wrap gap-2"
                  >
                    {featuredCourse.highlights.slice(0, 3).map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#ddb829]/30 bg-white/5 px-3 py-1 text-xs text-[#efe5d2]"
                      >
                        {item.split(":")[0]}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  data-featured-step="2"
                  className="mt-5 border-y border-[#ddb829]/30 py-4 sm:mt-7 sm:py-5"
                >
                  <p className="text-sm font-semibold text-white">
                    Best for you if:
                  </p>
                  <ul className="mt-3 space-y-2.5 text-sm leading-6 text-[#efe5d2] sm:mt-4 sm:space-y-3 sm:text-base sm:leading-7">
                    <li className="flex gap-3">
                      <Check className="mt-1 size-4 shrink-0 text-[#ddb829]" />
                      You want consistent, personal guidance rather than a
                      one-time conversation.
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-4 shrink-0 text-[#ddb829]" />
                      You are ready to work gently but honestly with recurring
                      patterns.
                    </li>
                  </ul>
                </div>

                <div data-featured-step="3">
                  <Link
                    href={`/courses/${featuredCourse.slug}`}
                    className="group/cta mt-6 inline-flex min-h-11 items-center justify-center gap-3 rounded-full bg-[#ddb829] px-6 py-3 text-sm font-semibold text-[#292524] transition-colors hover:bg-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:mt-8 sm:min-h-12 sm:px-7"
                  >
                    Explore the journey{" "}
                    <ArrowRight className={`${styles.ctaArrow} size-4`} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. WHAT HAPPENS NEXT */}
      <section className="bg-[#f8f3e9] px-4 py-12 sm:px-10 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                data-split-heading
                className="max-w-2xl font-serif text-[1.9rem] leading-tight sm:text-4xl lg:text-5xl"
              >
                Simple to book.{" "}
                <span className="text-[#a81414]">
                  Personal from the start.
                </span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#a81414] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#6b0b0b] active:scale-[0.98]"
              >
                Ask Manisha&apos;s team
                <ArrowRight className="size-4" />
              </Link>
              <a
                href={brand.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#c7a23b] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#6b0b0b] transition-colors hover:bg-[#faf3dc] active:scale-[0.98]"
              >
                WhatsApp desk
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </div>

          <div
            data-steps-grid
            className="mt-12 grid gap-8 sm:mt-16 sm:gap-12 md:grid-cols-3"
          >
            {steps.map((step, index) => (
              <div
                key={step.number}
                data-step-item
                className="relative border-t border-[#c9a520]/25 pt-7 sm:pt-10"
              >
                <span
                  data-step-line
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 -top-px h-px origin-left bg-[#c9a520]"
                />
                <span className="absolute -top-5 left-0 z-10 bg-[#f8f3e9] pr-4 font-serif text-4xl text-[#a81414] sm:-top-7 sm:text-5xl">
                  {index === 0 ? "i." : index === 1 ? "ii." : "iii."}
                </span>
                <h3 className="mt-2 font-serif text-xl sm:mt-4 sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#644d43] sm:mt-3 sm:text-base sm:leading-7">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
