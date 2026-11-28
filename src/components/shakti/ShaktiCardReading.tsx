"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, RotateCcw, ShoppingBag, Sparkles } from "lucide-react";
import { SHAKTI_CARD_COUNT, shaktiCardImagePath } from "@/lib/shakti-card-assets";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "@/app/shakti/shakti.module.css";

type ReadingPhase = "idle" | "shuffling" | "choosing" | "revealing" | "revealed";

const CARD_COUNT = SHAKTI_CARD_COUNT;

const guidance = [
  {
    title: "Trust what is unfolding",
    message:
      "Clarity does not always arrive before the first step. Let your inner knowing lead, even if the whole path is not visible yet.",
    affirmation: "I trust the wisdom that is already alive within me.",
  },
  {
    title: "Make space for renewal",
    message:
      "Something within you is ready to change form. Release the need to hold every answer and allow a quieter, more truthful direction to emerge.",
    affirmation: "I welcome change with grace, courage and an open heart.",
  },
  {
    title: "Your energy is returning",
    message:
      "Protect your attention and bring it back to what truly nourishes you. Your strength grows each time you choose yourself with love.",
    affirmation: "My energy is sacred, focused and fully my own.",
  },
  {
    title: "Listen beneath the noise",
    message:
      "The answer is not asking you to search harder. Become still enough to hear the small, honest voice beneath expectation, urgency and fear.",
    affirmation: "Stillness connects me to my clearest truth.",
  },
  {
    title: "Let courage move first",
    message:
      "You do not need to feel completely ready. One sincere action can shift the energy around your question and reveal the support waiting for you.",
    affirmation: "I move with courage and life meets me on the way.",
  },
  {
    title: "Receive without resistance",
    message:
      "You have carried enough alone. Open yourself to help, affection and opportunity without needing to earn what is offered with genuine care.",
    affirmation: "I am worthy of receiving goodness with ease.",
  },
];

function shuffleDeck() {
  const deck = Array.from({ length: CARD_COUNT }, (_, index) => index + 1);

  for (let index = deck.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[randomIndex]] = [deck[randomIndex], deck[index]];
  }

  return deck;
}

function SacredGeometry() {
  return (
    <svg viewBox="0 0 500 500" aria-hidden="true" className="h-full w-full">
      <g fill="none" stroke="currentColor" strokeWidth="0.8">
        <circle cx="250" cy="250" r="196" />
        <circle cx="250" cy="250" r="154" />
        <circle cx="250" cy="250" r="104" />
        <path d="M250 67 407 342H93Z" />
        <path d="m250 433 157-275H93Z" />
        <path d="M250 100 379 325H121Z" />
        <path d="m250 400 129-225H121Z" />
        {Array.from({ length: 16 }, (_, index) => {
          const angle = (index * Math.PI * 2) / 16;
          const x1 = 250 + Math.cos(angle) * 205;
          const y1 = 250 + Math.sin(angle) * 205;
          const x2 = 250 + Math.cos(angle) * 226;
          const y2 = 250 + Math.sin(angle) * 226;
          return <path key={index} d={`M${x1} ${y1} L${x2} ${y2}`} />;
        })}
      </g>
    </svg>
  );
}

function SideOrnament({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 180 420" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M90 4v412M90 65c-54 39-54 92 0 128 54-36 54-89 0-128ZM90 228c-42 30-42 71 0 100 42-29 42-70 0-100Z" />
        <path d="M90 91c-25 22-25 49 0 72 25-23 25-50 0-72ZM90 248c-18 17-18 39 0 57 18-18 18-40 0-57Z" />
        <circle cx="90" cy="210" r="6" />
        <path d="M65 210H8m107 0h57M68 24h44M68 396h44" />
      </g>
    </svg>
  );
}

export default function ShaktiCardReading({
  showBuyButton = false,
  variant = "home",
}: {
  showBuyButton?: boolean;
  variant?: "home" | "shakti";
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const deckOrderRef = useRef<number[]>(Array.from({ length: CARD_COUNT }, (_, index) => index + 1));
  const [phase, setPhase] = useState<ReadingPhase>("idle");
  const [cardNumber, setCardNumber] = useState<number | null>(null);
  const isShaktiPage = variant === "shakti";
  const sectionHeight = showBuyButton
    ? "min-h-[43rem] sm:min-h-[68rem] lg:min-h-[58rem]"
    : isShaktiPage
      ? "min-h-[38rem] lg:min-h-[48rem]"
      : "min-h-[39rem] sm:min-h-[64rem] lg:min-h-[48rem]";
  const tableHeight = showBuyButton
    ? "h-[37rem] sm:h-[62rem] lg:h-[52rem]"
    : isShaktiPage
      ? phase === "idle"
        ? "min-h-[38rem] lg:h-[42rem]"
        : "h-[34rem] sm:h-[46rem] lg:h-[42rem]"
      : "h-[33rem] sm:h-[58rem] lg:h-[42rem]";
  const revealHeight = showBuyButton
    ? "min-h-[36rem] sm:min-h-[60rem] lg:min-h-[52rem]"
    : isShaktiPage
      ? "min-h-[34rem] sm:min-h-[44rem] lg:min-h-[42rem]"
      : "min-h-[33rem] sm:min-h-[56rem] lg:min-h-[42rem]";

  useGSAP(
    () => {
      if (!tableRef.current) return;
      gsap.set(".reading-deck-card", { autoAlpha: 0, x: 0, y: 0, rotation: 0, scale: 0.88 });
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      if (phase !== "revealed") return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap
        .timeline()
        .fromTo(
          ".revealed-card",
          { autoAlpha: 0, y: 44, rotateY: -92, scale: 0.86 },
          { autoAlpha: 1, y: 0, rotateY: 0, scale: 1, duration: reduced ? 0.01 : 1.15, ease: "expo.out" },
        )
        .fromTo(
          ".reading-copy > *",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: reduced ? 0.01 : 0.65, stagger: reduced ? 0 : 0.08, ease: "power3.out" },
          "-=0.5",
        );
    },
    { scope: sectionRef, dependencies: [phase], revertOnUpdate: true },
  );

  // One authored entrance for the idle hero: the wordmark condenses in,
  // the attendant deck crossfades up, then the CTA row settles last.
  useGSAP(
    () => {
      if (phase !== "idle") return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const t = reduced ? 0.01 : 1;

      // Hide before the fromTo runs so the entrance never flashes.
      gsap.set([".home-hero-wordmark", ".home-hero-deck", ".home-hero-cta"], {
        autoAlpha: 0,
        ...(reduced ? {} : { y: 0 }),
      });

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(
          ".home-hero-wordmark",
          { autoAlpha: 0, y: 12, letterSpacing: "0.28em", filter: "blur(6px)" },
          { autoAlpha: 1, y: 0, letterSpacing: "0.14em", filter: "blur(0px)", duration: t * 1.1 },
          0.05,
        )
        .fromTo(
          ".home-hero-deck",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: reduced ? 0.01 : 0.7 },
          "-=0.45",
        )
        .fromTo(
          ".home-hero-cta",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: t * 0.6 },
          "-=0.3",
        );
    },
    { scope: sectionRef, dependencies: [phase], revertOnUpdate: true },
  );

  const spreadPosition = (index: number, width: number, height: number) => {
    const mobile = width < 640;
    const columns = mobile ? 13 : 26;
    const rows = mobile ? 4 : 2;
    const row = Math.floor(index / columns);
    const column = index % columns;
    const cardWidth = mobile ? 66 : 94;
    const usableWidth = Math.max(220, width - cardWidth - (mobile ? 10 : 28));
    const step = usableWidth / (columns - 1);
    const centeredColumn = column - (columns - 1) / 2;
    const rowGap = mobile ? 76 : 122;
    const rowOffset = (row - (rows - 1) / 2) * rowGap;
    const arc = Math.pow(Math.abs(centeredColumn) / ((columns - 1) / 2), 2) * (mobile ? 16 : 34);

    return {
      x: centeredColumn * step,
      y: rowOffset + arc + (mobile ? -4 : height * 0.01),
      rotation: centeredColumn * (mobile ? 0.42 : 0.34) + (row % 2 === 0 ? -1.4 : 1.4),
      scale: 1,
    };
  };

  const animateShuffle = () => {
    if (!tableRef.current) return;

    const cards = gsap.utils.toArray<HTMLElement>(".reading-deck-card", tableRef.current);
    const width = tableRef.current.clientWidth;
    const height = tableRef.current.clientHeight;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const durationScale = reduced ? 0.01 : 1;

    gsap.killTweensOf(cards);
    gsap.set(cards, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      rotation: (index) => (index % 2 ? 0.6 : -0.6),
      scale: 0.9,
      zIndex: (index) => index + 1,
      pointerEvents: "none",
    });

    gsap
      .timeline({
        onComplete: () => {
          gsap.set(cards, { pointerEvents: "auto" });
          setPhase("choosing");
        },
      })
      .to(cards, {
        x: (index) => (index % 2 === 0 ? -1 : 1) * Math.min(width * 0.2, 190),
        y: (index) => ((index % 9) - 4) * 1.8,
        rotation: (index) => (index % 2 === 0 ? -10 : 10),
        duration: 0.52 * durationScale,
        stagger: 0.006 * durationScale,
        ease: "power3.inOut",
      })
      .to(cards, {
        x: (index) => ((index % 4) - 1.5) * 7,
        y: (index) => (index % 13) * -0.7,
        rotation: (index) => ((index % 5) - 2) * 1.8,
        duration: 0.7 * durationScale,
        stagger: { each: 0.012 * durationScale, from: "edges" },
        ease: "expo.inOut",
      })
      .to(cards, {
        x: (index) => Math.sin(index * 2.17) * Math.min(width * 0.32, 330),
        y: (index) => Math.cos(index * 1.61) * Math.min(height * 0.24, 105),
        rotation: (index) => Math.sin(index * 3.11) * 24,
        scale: 0.86,
        duration: 0.78 * durationScale,
        stagger: 0.006 * durationScale,
        ease: "power4.inOut",
      })
      .to(cards, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 0.9,
        duration: 0.62 * durationScale,
        stagger: { each: 0.008 * durationScale, from: "random" },
        ease: "power3.inOut",
      })
      .to(cards, {
        x: (index) => spreadPosition(index, width, height).x,
        y: (index) => spreadPosition(index, width, height).y,
        rotation: (index) => spreadPosition(index, width, height).rotation,
        scale: 1,
        zIndex: (index) => index + 1,
        duration: 1.1 * durationScale,
        stagger: 0.012 * durationScale,
        ease: "power4.inOut",
      });
  };

  const startShuffle = () => {
    deckOrderRef.current = shuffleDeck();
    setCardNumber(null);
    setPhase("shuffling");
    window.requestAnimationFrame(animateShuffle);
  };

  const chooseCard = (position: number, element: HTMLButtonElement) => {
    if (phase !== "choosing" || !tableRef.current) return;

    setPhase("revealing");
    const chosenCard = deckOrderRef.current[position];
    const cards = gsap.utils.toArray<HTMLElement>(".reading-deck-card", tableRef.current);
    const others = cards.filter((card) => card !== element);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const durationScale = reduced ? 0.01 : 1;

    gsap.set(cards, { pointerEvents: "none" });
    gsap
      .timeline({
        onComplete: () => {
          setCardNumber(chosenCard);
          setPhase("revealed");
        },
      })
      .to(others, {
        autoAlpha: 0,
        y: "+=70",
        scale: 0.78,
        duration: 0.5 * durationScale,
        stagger: { each: 0.008 * durationScale, from: "edges" },
        ease: "power3.in",
      })
      .to(
        element,
        {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1.28,
          zIndex: CARD_COUNT + 2,
          duration: 0.85 * durationScale,
          ease: "expo.inOut",
        },
        0.08,
      )
      .to(element, { autoAlpha: 0, rotateY: 88, duration: 0.38 * durationScale, ease: "power2.in" });
  };

  const resetReading = () => {
    if (tableRef.current) {
      const cards = gsap.utils.toArray<HTMLElement>(".reading-deck-card", tableRef.current);
      gsap.killTweensOf(cards);
      gsap.set(cards, { autoAlpha: 0, x: 0, y: 0, rotation: 0, scale: 0.88, pointerEvents: "none" });
    }
    setCardNumber(null);
    setPhase("idle");
  };

  const selectedGuidance = cardNumber ? guidance[(cardNumber - 1) % guidance.length] : null;

  return (
    <section
      ref={sectionRef}
      aria-label="Shakti oracle card reading"
      className={`relative isolate overflow-hidden bg-[#260b0a] text-white ${isShaktiPage ? "pt-16" : ""} ${sectionHeight}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(153,42,29,0.94)_0%,rgba(70,16,13,0.94)_39%,rgba(25,7,7,1)_78%)]" />

      {showBuyButton && phase === "idle" ? (
        <h1 className="home-hero-wordmark absolute left-1/2 top-[4.65rem] z-30 -translate-x-1/2 whitespace-nowrap text-center font-serif text-3xl font-medium leading-none tracking-[0.14em] text-[#e8c96a] sm:top-24 sm:text-6xl sm:tracking-[0.1em] lg:top-24 lg:text-7xl">
          SHAKTI
        </h1>
      ) : null}

      <div className={`relative mx-auto max-w-[100rem] ${sectionHeight}`}>
        <header
          className={`${
            phase === "idle"
              ? isShaktiPage
                ? "hidden lg:block lg:absolute"
                : "absolute"
              : "hidden"
          } left-1/2 ${
            showBuyButton ? "top-[7rem] sm:top-[12rem]" : "top-[4.75rem] sm:top-[8.5rem]"
          } z-40 w-[calc(100%-2.5rem)] -translate-x-1/2 text-center lg:left-[8%] lg:top-[54%] lg:w-[42%] lg:max-w-[40rem] lg:-translate-x-0 lg:-translate-y-1/2`}
        >
          {isShaktiPage ? (
            <div className="home-hero-wordmark mb-2 flex flex-col items-center lg:mb-3">
              <span className="inline-flex items-center gap-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-[#e8c96a]/85 sm:text-[0.68rem]">
                <span className="h-px w-5 bg-[#e8c96a]/60" aria-hidden="true" />
                51 Shakti Peethas · Sacred Oracle
                <span className="h-px w-5 bg-[#e8c96a]/60" aria-hidden="true" />
              </span>
            </div>
          ) : null}
          <div
            className={`relative mx-auto w-fit max-w-full ${
              isShaktiPage
                ? "h-[14.5rem] sm:h-[22rem] lg:h-[36rem]"
                : "h-[17.5rem] sm:h-[26rem] lg:h-[44rem]"
            }`}
          >
            {showBuyButton ? (
              <div className="pointer-events-none absolute left-1/2 top-[34%] block aspect-[1172/1342] w-full -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_30px_rgba(238,198,50,0.5)]" aria-hidden="true">
                <div className="animate-spin-slow relative h-full w-full motion-reduce:animate-none">
                  <Image
                    src="/images/devi-chakra-mandala.webp"
                    alt="Devi chakra mandala"
                    fill
                    priority
                    sizes="580px"
                    className="object-contain"
                  />
                </div>
              </div>
            ) : null}
            <Image
              src={showBuyButton ? "/images/devi-healing-goddess.webp" : "/images/shakti-symbol.webp"}
              alt={showBuyButton ? "Devi Shakti" : "Shakti"}
              width={1042}
              height={1509}
              priority
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 310px, 490px"
              className="relative z-10 h-full w-auto max-w-full object-contain drop-shadow-[0_22px_52px_rgba(221,184,41,0.38)]"
            />
          </div>
          {isShaktiPage ? (
            <p className="mx-auto mt-2 hidden max-w-sm text-pretty text-sm leading-6 text-cream/70 lg:block">
              Pause, hold a quiet question in your heart, and draw a single Goddess card for guidance.
            </p>
          ) : null}
        </header>

        <div className={`relative overflow-hidden border-x border-[#b98d35]/25 bg-transparent shadow-[inset_0_1px_0_rgba(255,236,155,0.15)] ${sectionHeight}`}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(153,42,29,0.94)_0%,rgba(70,16,13,0.92)_43%,rgba(25,7,7,1)_100%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(112deg,transparent_0%,rgba(255,255,255,0.045)_18%,transparent_35%),linear-gradient(72deg,transparent_55%,rgba(0,0,0,0.22)_76%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-[0.42rem] rounded-[1.05rem] border border-gold/22 sm:inset-[0.7rem] sm:rounded-[1.35rem]" />
          <div className="pointer-events-none absolute inset-[0.72rem] rounded-[0.9rem] border border-gold/10 sm:inset-[1rem] sm:rounded-[1.15rem]" />
          {isShaktiPage ? (
            <>
              <span aria-hidden="true" className="pointer-events-none absolute left-4 top-4 h-2 w-2 rotate-45 border border-gold/55 bg-[#2a0b09] sm:left-6 sm:top-6" />
              <span aria-hidden="true" className="pointer-events-none absolute right-4 top-4 h-2 w-2 rotate-45 border border-gold/55 bg-[#2a0b09] sm:right-6 sm:top-6" />
              <span aria-hidden="true" className="pointer-events-none absolute bottom-4 left-4 h-2 w-2 rotate-45 border border-gold/55 bg-[#2a0b09] sm:bottom-6 sm:left-6" />
              <span aria-hidden="true" className="pointer-events-none absolute bottom-4 right-4 h-2 w-2 rotate-45 border border-gold/55 bg-[#2a0b09] sm:bottom-6 sm:right-6" />
            </>
          ) : null}

          <div className="relative z-20 mx-[0.72rem] mt-[0.72rem] flex min-h-14 items-center justify-between border-b border-gold/15 px-4 sm:mx-4 sm:mt-4 sm:min-h-16 sm:px-6">
            <div className="hidden items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gold-light/65 sm:flex">
              {isShaktiPage ? (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-gold/80" aria-hidden="true" />
                  <span>SHAKTI ORACLE</span>
                </>
              ) : (
                <span className="w-12" aria-hidden="true" />
              )}
            </div>
            <p className="mx-auto font-serif text-sm italic tracking-wide text-gold-light/95 sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:text-lg" aria-live="polite">
              {phase === "idle" && "When you are ready, begin the shuffle"}
              {phase === "shuffling" && "The deck is moving with your intention…"}
              {phase === "choosing" && "Now choose one card"}
              {phase === "revealing" && "Stay with the card you chose…"}
              {phase === "revealed" && "Your message has arrived"}
            </p>
            <div className="hidden text-[0.62rem] font-medium tracking-[0.24em] text-cream/50 tabular-nums sm:block">
              {isShaktiPage ? "52 CARDS · ONE DRAW" : "ONE CARD READING"}
            </div>
          </div>

          <div className={`pointer-events-none absolute top-[54%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 text-gold/[0.105] transition-[left] duration-700 sm:h-[35rem] sm:w-[35rem] ${phase === "idle" ? "left-1/2 lg:left-[72%]" : "left-1/2"}`}>
            <SacredGeometry />
          </div>
          <SideOrnament className="pointer-events-none absolute -left-7 top-1/2 hidden h-[68%] -translate-y-1/2 text-gold/15 lg:block" />
          <SideOrnament className="pointer-events-none absolute -right-7 top-1/2 hidden h-[68%] -translate-y-1/2 scale-x-[-1] text-gold/15 lg:block" />
          <div className="pointer-events-none absolute left-8 top-1/2 hidden -translate-y-1/2 -rotate-90 text-[0.55rem] tracking-[0.5em] text-gold/25 xl:block">INTENTION</div>
          <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 rotate-90 text-[0.55rem] tracking-[0.5em] text-gold/25 xl:block">INTUITION</div>

          {phase !== "revealed" ? (
            <>
              <div ref={tableRef} className={`relative z-10 mx-auto w-full max-w-[92rem] ${tableHeight}`} aria-label="Shuffled face-down Shakti card deck">
                {Array.from({ length: CARD_COUNT }, (_, index) => (
                  <button
                    key={index}
                    type="button"
                    disabled={phase !== "choosing"}
                    onClick={(event) => chooseCard(index, event.currentTarget)}
                    aria-label={`Choose face-down card ${index + 1} of ${CARD_COUNT}`}
                    className={`reading-deck-card group absolute left-1/2 top-1/2 aspect-[1060/1484] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[0.3rem] border border-[#f5d85d]/55 bg-[#8b1c10] shadow-[0_9px_16px_rgba(0,0,0,0.48)] will-change-transform enabled:cursor-pointer enabled:hover:brightness-125 enabled:hover:shadow-[0_18px_36px_rgba(238,198,50,0.4)] sm:w-[6.5rem] lg:w-[7.25rem] ${showBuyButton ? "w-10" : "w-11"}`}
                  >
                    <Image src="/images/shakti-cards/card-back-cover.webp" alt="Shakti oracle card back design" fill sizes="(max-width: 640px) 44px, 94px" className="object-cover" loading="lazy" />
                    <span className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/15 opacity-0 transition-opacity duration-300 group-enabled:group-hover:opacity-100" />
                  </button>
                ))}

                {phase === "idle" && isShaktiPage ? (
                  <>
                    {/* Mobile & tablet vertical flow — large Devi with zero overlap over cards */}
                    <div className="relative z-20 mx-auto flex w-full max-w-xl flex-col items-center gap-7 px-4 pb-10 pt-5 sm:gap-9 sm:pb-12 sm:pt-7 lg:hidden">
                      <div className="flex flex-col items-center text-center">
                        <div className="home-hero-wordmark mb-2.5 flex flex-col items-center">
                          <span className="inline-flex items-center gap-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-[#e8c96a]/90 sm:text-[0.68rem]">
                            <span className="h-px w-5 bg-[#e8c96a]/60" aria-hidden="true" />
                            51 Shakti Peethas · Sacred Oracle
                            <span className="h-px w-5 bg-[#e8c96a]/60" aria-hidden="true" />
                          </span>
                        </div>
                        <div className="relative mx-auto h-[21rem] w-fit max-w-full sm:h-[26rem]">
                          <Image
                            src="/images/shakti-symbol.webp"
                            alt="Shakti"
                            width={1042}
                            height={1509}
                            priority
                            sizes="(max-width: 640px) 320px, 400px"
                            className="relative z-10 h-full w-auto max-w-full object-contain drop-shadow-[0_22px_52px_rgba(221,184,41,0.38)]"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="home-hero-deck relative w-[7rem] sm:w-[11rem]">
                          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[16rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(240,198,51,0.19),rgba(180,20,20,0.07)_45%,transparent_70%)] blur-sm sm:h-[22rem] sm:w-[22rem]" />
                          <div className="absolute -left-[40%] top-[8%] hidden aspect-[1060/1484] w-full -rotate-[17deg] overflow-hidden rounded-xl border border-gold/25 opacity-35 shadow-[0_26px_55px_rgba(0,0,0,0.48)] sm:block">
                            <Image src="/images/shakti-cards/card-back-cover.webp" alt="Shakti oracle card back design" fill sizes="224px" className="object-cover" loading="lazy" />
                          </div>
                          <div className="absolute -right-[40%] top-[8%] hidden aspect-[1060/1484] w-full rotate-[17deg] overflow-hidden rounded-xl border border-gold/25 opacity-35 shadow-[0_26px_55px_rgba(0,0,0,0.48)] sm:block">
                            <Image src="/images/shakti-cards/card-back-cover.webp" alt="Shakti oracle card back design" fill sizes="224px" className="object-cover" loading="lazy" />
                          </div>
                          <div className="absolute inset-0 translate-x-4 translate-y-3 rounded-xl border border-gold/20 bg-[#30100d] shadow-[0_24px_34px_rgba(0,0,0,0.34)] sm:translate-x-5 sm:translate-y-4" />
                          <div className="absolute inset-0 translate-x-2.5 translate-y-2 rounded-xl border border-gold/25 bg-[#52130e] sm:translate-x-3.5 sm:translate-y-2.5" />
                          <div className="absolute inset-0 translate-x-1.5 translate-y-1 rounded-xl border border-gold/35 bg-[#761b10] sm:translate-x-2 sm:translate-y-1.5" />
                          <button
                            type="button"
                            onClick={startShuffle}
                            aria-label="Shuffle the Shakti oracle deck"
                            className="group relative block aspect-[1060/1484] w-full cursor-pointer overflow-hidden rounded-xl border border-gold-light/80 shadow-[0_32px_68px_rgba(0,0,0,0.75),0_0_50px_rgba(221,184,41,0.22)] transition-transform duration-700 hover:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light active:scale-[0.985]"
                          >
                            <Image src="/images/shakti-cards/card-back-cover.webp" alt="Shakti card deck cover" fill sizes="(max-width: 639px) 128px, 180px" className="object-cover" loading="lazy" />
                            <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent transition-opacity duration-500 group-hover:opacity-100" />
                          </button>
                        </div>

                        <div className="relative mt-6 flex w-full flex-col items-center sm:mt-8">
                          <div className="pointer-events-none h-2.5 w-40 rounded-[50%] bg-black/45 blur-md sm:w-48" />
                          <div className="relative mt-2 flex w-48 items-center justify-center sm:w-56">
                            <span className="h-px w-full bg-gradient-to-r from-transparent via-gold/55 to-transparent" aria-hidden="true" />
                            <span className="absolute h-2 w-2 rotate-45 border border-gold/60 bg-[#4b120f]" aria-hidden="true" />
                          </div>

                          <div className="home-hero-cta mt-5 flex flex-col items-center gap-2.5 sm:mt-6">
                            <button
                              type="button"
                              onClick={startShuffle}
                              className={`${styles.tactileButton} group inline-flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-full bg-gradient-to-r from-gold to-gold-dark px-6 py-3 text-xs font-semibold tracking-[0.1em] text-primary-deeper shadow-[0_18px_45px_-16px_rgba(238,198,50,0.68)] hover:-translate-y-0.5 hover:from-gold-light hover:to-gold sm:px-8 sm:py-3.5`}
                            >
                              Shuffle the cards
                              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                            </button>
                            <p className="whitespace-nowrap text-[0.65rem] font-medium uppercase tracking-[0.24em] text-cream/55">
                              52 Goddess Cards · Tap deck or button
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop view — unchanged layout */}
                    <div className="home-hero-deck hidden lg:block lg:absolute lg:left-[72%] lg:top-[43%] lg:w-[16rem] lg:-translate-x-1/2 lg:-translate-y-1/2">
                      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(240,198,51,0.19),rgba(180,20,20,0.07)_45%,transparent_70%)] blur-sm" />
                      <div className="absolute -left-[42%] top-[8%] aspect-[1060/1484] w-full -rotate-[17deg] overflow-hidden rounded-xl border border-gold/25 opacity-35 shadow-[0_26px_55px_rgba(0,0,0,0.48)]">
                        <Image src="/images/shakti-cards/card-back-cover.webp" alt="Shakti oracle card back design" fill sizes="224px" className="object-cover" loading="lazy" />
                      </div>
                      <div className="absolute -right-[42%] top-[8%] aspect-[1060/1484] w-full rotate-[17deg] overflow-hidden rounded-xl border border-gold/25 opacity-35 shadow-[0_26px_55px_rgba(0,0,0,0.48)]">
                        <Image src="/images/shakti-cards/card-back-cover.webp" alt="Shakti oracle card back design" fill sizes="224px" className="object-cover" loading="lazy" />
                      </div>
                      <div className="absolute inset-0 translate-x-5 translate-y-4 rounded-xl border border-gold/20 bg-[#30100d] shadow-[0_24px_34px_rgba(0,0,0,0.34)]" />
                      <div className="absolute inset-0 translate-x-3.5 translate-y-2.5 rounded-xl border border-gold/25 bg-[#52130e]" />
                      <div className="absolute inset-0 translate-x-2 translate-y-1.5 rounded-xl border border-gold/35 bg-[#761b10]" />
                      <button
                        type="button"
                        onClick={startShuffle}
                        aria-label="Shuffle the Shakti oracle deck"
                        className="group relative block aspect-[1060/1484] w-full cursor-pointer overflow-hidden rounded-xl border border-gold-light/80 shadow-[0_38px_75px_rgba(0,0,0,0.75),0_0_55px_rgba(221,184,41,0.22)] transition-transform duration-700 hover:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light active:scale-[0.985]"
                      >
                        <Image src="/images/shakti-cards/card-back-cover.webp" alt="Shakti card deck cover" fill sizes="256px" className="object-cover" loading="lazy" />
                        <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent transition-opacity duration-500 group-hover:opacity-100" />
                      </button>
                      <div className="pointer-events-none absolute left-1/2 top-[calc(100%+1.2rem)] h-3 w-48 -translate-x-1/2 rounded-[50%] bg-black/50 blur-md" />
                      <div className="pointer-events-none absolute left-1/2 top-[calc(100%+1.65rem)] h-px w-56 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
                      <div className="pointer-events-none absolute left-1/2 top-[calc(100%+1.45rem)] h-2 w-2 -translate-x-1/2 rotate-45 border border-gold/60 bg-[#4b120f]" />
                      <div className="home-hero-cta absolute left-1/2 top-[calc(100%+3.1rem)] z-20 flex -translate-x-1/2 flex-col items-center gap-3">
                        <button
                          type="button"
                          onClick={startShuffle}
                          className={`${styles.tactileButton} group inline-flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-full bg-gradient-to-r from-gold to-gold-dark px-8 py-3.5 text-xs font-semibold tracking-[0.1em] text-primary-deeper shadow-[0_18px_45px_-16px_rgba(238,198,50,0.68)] hover:-translate-y-0.5 hover:from-gold-light hover:to-gold`}
                        >
                          Shuffle the cards
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                        </button>
                        <p className="whitespace-nowrap text-[0.65rem] font-medium uppercase tracking-[0.24em] text-cream/55">
                          52 Goddess Cards · Tap deck or button
                        </p>
                      </div>
                    </div>
                  </>
                ) : phase === "idle" ? (
                  <div className={`home-hero-deck absolute left-1/2 -translate-x-1/2 -translate-y-1/2 sm:top-[60%] sm:w-[12.5rem] lg:left-[72%] lg:top-[43%] lg:w-[16rem] ${showBuyButton ? "top-[63%] w-[5.5rem]" : "top-[56%] w-24"}`}>
                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[19rem] w-[19rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(240,198,51,0.19),rgba(180,20,20,0.07)_45%,transparent_70%)] blur-sm sm:h-[24rem] sm:w-[24rem]" />
                    <div className="absolute -left-[42%] top-[8%] hidden aspect-[1060/1484] w-full -rotate-[17deg] overflow-hidden rounded-xl border border-gold/25 opacity-35 shadow-[0_26px_55px_rgba(0,0,0,0.48)] sm:block">
                      <Image src="/images/shakti-cards/card-back-cover.webp" alt="Shakti oracle card back design" fill sizes="224px" className="object-cover" loading="lazy" />
                    </div>
                    <div className="absolute -right-[42%] top-[8%] hidden aspect-[1060/1484] w-full rotate-[17deg] overflow-hidden rounded-xl border border-gold/25 opacity-35 shadow-[0_26px_55px_rgba(0,0,0,0.48)] sm:block">
                      <Image src="/images/shakti-cards/card-back-cover.webp" alt="Shakti oracle card back design" fill sizes="224px" className="object-cover" loading="lazy" />
                    </div>
                    <div className="absolute inset-0 translate-x-5 translate-y-4 rounded-xl border border-gold/20 bg-[#30100d] shadow-[0_24px_34px_rgba(0,0,0,0.34)]" />
                    <div className="absolute inset-0 translate-x-3.5 translate-y-2.5 rounded-xl border border-gold/25 bg-[#52130e]" />
                    <div className="absolute inset-0 translate-x-2 translate-y-1.5 rounded-xl border border-gold/35 bg-[#761b10]" />
                    <button
                      type="button"
                      onClick={startShuffle}
                      aria-label="Shuffle the Shakti oracle deck"
                      className="group relative block aspect-[1060/1484] w-full cursor-pointer overflow-hidden rounded-xl border border-gold-light/80 shadow-[0_38px_75px_rgba(0,0,0,0.75),0_0_55px_rgba(221,184,41,0.22)] transition-transform duration-700 hover:-translate-y-1.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light active:scale-[0.985]"
                    >
                      <Image src="/images/shakti-cards/card-back-cover.webp" alt="Shakti card deck cover" fill sizes="(max-width: 639px) 112px, (max-width: 1023px) 200px, 256px" className="object-cover" loading="lazy" />
                      <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent transition-opacity duration-500 group-hover:opacity-100" />
                    </button>
                    <div className="pointer-events-none absolute left-1/2 top-[calc(100%+1.2rem)] h-3 w-48 -translate-x-1/2 rounded-[50%] bg-black/50 blur-md" />
                    <div className="pointer-events-none absolute left-1/2 top-[calc(100%+1.65rem)] h-px w-56 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
                    <div className="pointer-events-none absolute left-1/2 top-[calc(100%+1.45rem)] h-2 w-2 -translate-x-1/2 rotate-45 border border-gold/60 bg-[#4b120f]" />
                    <div className="home-hero-cta absolute left-1/2 top-[calc(100%+2.25rem)] z-20 flex -translate-x-1/2 flex-col items-center gap-2.5 sm:top-[calc(100%+3.25rem)] sm:gap-3">
                      <button
                        type="button"
                        onClick={startShuffle}
                        className={`${styles.tactileButton} group inline-flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-full border border-gold/45 bg-[#210a09]/90 px-5 py-2.5 text-xs font-semibold tracking-[0.1em] text-gold-light shadow-[0_16px_35px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md hover:-translate-y-1 hover:border-gold-light/75 hover:bg-[#35100d] sm:px-7 sm:py-3.5`}
                      >
                        Shuffle the cards
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                      </button>
                      {showBuyButton ? (
                        <Link
                          href="/checkout/product/shakti-oracle-deck"
                          className={`${styles.tactileButton} group inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-gradient-to-r from-gold to-gold-dark px-5 py-2.5 text-xs font-semibold tracking-[0.06em] text-primary-deeper shadow-[0_18px_45px_-18px_rgba(238,198,50,0.72)] hover:-translate-y-1 hover:from-gold-light hover:to-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light sm:px-7 sm:py-3.5`}
                        >
                          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                          Buy the SHAKTI deck
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="absolute inset-x-0 bottom-7 z-[60] text-center">
                {phase === "choosing" && (
                  <p className="inline-flex items-center gap-3 rounded-full border border-gold/25 bg-[#1a0706]/80 px-5 py-2 text-[0.68rem] font-semibold tracking-[0.22em] text-gold-light/90 backdrop-blur-md">
                    MOVE SLOWLY · CHOOSE WITH INTUITION
                  </p>
                )}
              </div>
            </>
          ) : (
            cardNumber && selectedGuidance && (
              <div className={`mx-auto grid max-w-6xl -translate-y-2 content-center items-center gap-4 px-5 py-7 sm:translate-y-0 sm:gap-12 sm:px-8 sm:py-14 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 lg:py-16 ${revealHeight}`}>
                <div className="revealed-card relative mx-auto w-full max-w-[10rem] [perspective:1200px] sm:max-w-[18rem] lg:max-w-[21rem]">
                  <div className="absolute -inset-9 rounded-[3rem] bg-gold/22 blur-3xl" />
                  <div className="relative rounded-[1.35rem] border border-gold/30 bg-[#1a0606]/70 p-1.5 shadow-[0_45px_100px_rgba(0,0,0,0.72),0_0_55px_rgba(221,184,41,0.22)] sm:p-2">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-gold-light/70 bg-gold-soft">
                      <Image src={shaktiCardImagePath(cardNumber)} alt={`Your selected Shakti card, card ${cardNumber}`} fill sizes="(max-width: 640px) 160px, (max-width: 1023px) 288px, 336px" className="object-contain" loading="lazy" />
                    </div>
                  </div>
                </div>

                <div className="reading-copy text-center lg:text-left">
                  <div className="inline-flex items-center gap-2.5 rounded-full border border-gold/28 bg-white/[0.04] px-3.5 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-gold-light tabular-nums">
                    <span>Card {String(cardNumber).padStart(2, "0")} of {CARD_COUNT}</span>
                    <span className="h-1 w-1 rounded-full bg-gold/70" aria-hidden="true" />
                    <span>Shakti Oracle</span>
                  </div>
                  <h3 className="mt-3 text-balance font-display text-2xl font-semibold leading-tight tracking-[-0.03em] text-white sm:mt-4 sm:text-5xl">
                    {selectedGuidance.title}
                  </h3>
                  <div className="my-3.5 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent sm:my-7 lg:from-gold/60 lg:via-gold/25" />
                  <p className="max-w-xl text-pretty text-sm leading-6 text-cream/80 sm:text-lg sm:leading-8">
                    {selectedGuidance.message}
                  </p>
                  <blockquote className="mt-4 border-y border-gold/25 bg-white/[0.02] px-4 py-3.5 font-serif text-base leading-relaxed text-gold-light sm:mt-8 sm:px-5 sm:py-5 sm:text-2xl">
                    “{selectedGuidance.affirmation}”
                  </blockquote>
                  <div className="mt-5 flex flex-col items-center gap-2.5 sm:mt-9 sm:flex-row sm:justify-center sm:gap-4 lg:justify-start">
                    <button
                      type="button"
                      onClick={resetReading}
                      className={`${styles.tactileButton} inline-flex min-h-11 items-center gap-2 rounded-full border border-gold/40 bg-white/[0.05] px-5 py-2.5 text-xs font-medium text-white hover:border-gold/80 hover:bg-white/[0.1] sm:px-6 sm:py-3 sm:text-sm`}
                    >
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      Shuffle again
                    </button>
                    <Link
                      href="/services/tarot-consultation-60"
                      className={`${styles.tactileButton} group inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-dark px-5 py-2.5 text-xs font-semibold text-primary-deeper shadow-[0_14px_34px_-12px_rgba(221,184,41,0.5)] hover:-translate-y-0.5 hover:from-gold-light hover:to-gold sm:px-6 sm:py-3 sm:text-sm`}
                    >
                      Book a personal reading
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
