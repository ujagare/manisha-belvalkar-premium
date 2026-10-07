"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, RotateCcw, ShoppingBag } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";

type ReadingPhase = "idle" | "shuffling" | "choosing" | "revealing" | "revealed";

const CARD_COUNT = 52;

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

export default function ShaktiCardReading({ showBuyButton = false }: { showBuyButton?: boolean }) {
  const sectionHeight = showBuyButton
    ? "min-h-[58rem] sm:min-h-[76rem] lg:min-h-[60rem]"
    : "min-h-[70rem] sm:min-h-[72rem] lg:min-h-[48rem]";
  const tableHeight = showBuyButton
    ? "h-[52rem] sm:h-[69rem] lg:h-[54rem]"
    : "h-[64rem] sm:h-[65rem] lg:h-[42rem]";
  const revealHeight = showBuyButton
    ? "min-h-[50rem] sm:min-h-[68rem] lg:min-h-[54rem]"
    : "min-h-[62rem] sm:min-h-[64rem] lg:min-h-[42rem]";
  const sectionRef = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const deckOrderRef = useRef<number[]>(Array.from({ length: CARD_COUNT }, (_, index) => index + 1));
  const [phase, setPhase] = useState<ReadingPhase>("idle");
  const [cardNumber, setCardNumber] = useState<number | null>(null);

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
    <section ref={sectionRef} aria-label="Shakti oracle card reading" className={`relative isolate overflow-hidden bg-[#260b0a] text-white ${sectionHeight}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(153,42,29,0.94)_0%,rgba(70,16,13,0.94)_39%,rgba(25,7,7,1)_78%)]" />

      {showBuyButton ? (
        <h1 className="text-gold-shimmer absolute left-1/2 top-24 z-50 -translate-x-1/2 whitespace-nowrap text-center font-display text-5xl font-semibold leading-none tracking-[-0.045em] sm:top-28 sm:text-6xl lg:top-24 lg:text-7xl">
          SHAKTI
        </h1>
      ) : null}

      <div className={`relative mx-auto max-w-[100rem] ${sectionHeight}`}>
        <header className={`${phase === "idle" ? "absolute" : "hidden"} left-1/2 ${showBuyButton ? "top-[9.5rem] sm:top-[12rem]" : "top-[7.5rem] sm:top-[8.5rem]"} z-40 w-[calc(100%-3rem)] -translate-x-1/2 text-center lg:left-[8%] lg:top-[54%] lg:w-[42%] lg:max-w-[40rem] lg:-translate-x-0 lg:-translate-y-1/2`}>
          <div className="relative mx-auto h-72 w-fit max-w-full sm:h-[28rem] lg:h-[44rem]">
            {showBuyButton ? (
              <div className="pointer-events-none absolute left-1/2 top-[34%] block aspect-[1172/1342] w-full -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_30px_rgba(238,198,50,0.5)]" aria-hidden="true">
                <div className="animate-spin-slow relative h-full w-full motion-reduce:animate-none">
                  <Image
                    src="/images/devi-chakra-rotating.png"
                    alt=""
                    fill
                    sizes="580px"
                    className="object-contain"
                  />
                </div>
              </div>
            ) : null}
            <Image
              src={showBuyButton ? "/images/devi-foreground.png" : "/images/shakti-symbol.png"}
              alt={showBuyButton ? "Devi Shakti" : "Shakti"}
              width={1042}
              height={1509}
              priority
              sizes="(max-width: 640px) 230px, (max-width: 1024px) 310px, 490px"
              className="relative z-10 h-full w-auto max-w-full object-contain drop-shadow-[0_22px_52px_rgba(221,184,41,0.38)]"
            />
          </div>
        </header>

        <div className={`relative overflow-hidden border-x border-[#b98d35]/25 bg-transparent shadow-[inset_0_1px_0_rgba(255,236,155,0.15)] ${sectionHeight}`}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(153,42,29,0.94)_0%,rgba(70,16,13,0.92)_43%,rgba(25,7,7,1)_100%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(112deg,transparent_0%,rgba(255,255,255,0.045)_18%,transparent_35%),linear-gradient(72deg,transparent_55%,rgba(0,0,0,0.22)_76%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-[0.42rem] rounded-[1.05rem] border border-gold/20 sm:inset-[0.7rem] sm:rounded-[1.35rem]" />
          <div className="pointer-events-none absolute inset-[0.72rem] rounded-[0.9rem] border border-gold/8 sm:inset-[1rem] sm:rounded-[1.15rem]" />

          <div className="relative z-20 mx-[0.72rem] mt-[0.72rem] flex min-h-14 items-center justify-between border-b border-gold/15 px-4 sm:mx-4 sm:mt-4 sm:min-h-16 sm:px-5">
            <div className="hidden w-12 sm:block" aria-hidden="true" />
            <p className="mx-auto font-serif text-base italic tracking-wide text-gold-light/90 sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:text-lg" aria-live="polite">
              {phase === "idle" && "When you are ready, begin the shuffle"}
              {phase === "shuffling" && "The deck is moving with your intention…"}
              {phase === "choosing" && "Now choose one card"}
              {phase === "revealing" && "Stay with the card you chose…"}
              {phase === "revealed" && "Your message has arrived"}
            </p>
            <div className="hidden text-[0.62rem] font-medium tracking-[0.24em] text-white/38 sm:block">ONE CARD READING</div>
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
                    className="reading-deck-card group absolute left-1/2 top-1/2 aspect-[1060/1484] w-[4.75rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[0.42rem] border border-[#f5d85d]/55 bg-[#8b1c10] shadow-[0_14px_24px_rgba(0,0,0,0.48)] will-change-transform enabled:cursor-pointer enabled:hover:brightness-125 enabled:hover:shadow-[0_18px_36px_rgba(238,198,50,0.4)] sm:w-[6.5rem] lg:w-[7.25rem]"
                  >
                    <Image src="/images/shakti-cards/card_back-cover.png" alt="" fill sizes="(max-width: 640px) 66px, 94px" className="object-cover" />
                    <span className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/15 opacity-0 transition-opacity duration-300 group-enabled:group-hover:opacity-100" />
                  </button>
                ))}

                {phase === "idle" && (
                  <div className="absolute left-1/2 top-[58%] w-[8.75rem] -translate-x-1/2 -translate-y-1/2 sm:top-[60%] sm:w-[12.5rem] lg:left-[72%] lg:top-[43%] lg:w-[16rem]">
                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-[19rem] w-[19rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(240,198,51,0.19),rgba(180,20,20,0.07)_45%,transparent_70%)] blur-sm sm:h-[24rem] sm:w-[24rem]" />
                    <div className="absolute -left-[42%] top-[8%] hidden aspect-[1060/1484] w-full -rotate-[17deg] overflow-hidden rounded-xl border border-gold/25 opacity-35 shadow-[0_26px_55px_rgba(0,0,0,0.48)] sm:block">
                      <Image src="/images/shakti-cards/card_back-cover.png" alt="" fill sizes="224px" className="object-cover" />
                    </div>
                    <div className="absolute -right-[42%] top-[8%] hidden aspect-[1060/1484] w-full rotate-[17deg] overflow-hidden rounded-xl border border-gold/25 opacity-35 shadow-[0_26px_55px_rgba(0,0,0,0.48)] sm:block">
                      <Image src="/images/shakti-cards/card_back-cover.png" alt="" fill sizes="224px" className="object-cover" />
                    </div>
                    <div className="absolute inset-0 translate-x-5 translate-y-4 rounded-xl border border-gold/20 bg-[#30100d] shadow-[0_24px_34px_rgba(0,0,0,0.34)]" />
                    <div className="absolute inset-0 translate-x-3.5 translate-y-2.5 rounded-xl border border-gold/25 bg-[#52130e]" />
                    <div className="absolute inset-0 translate-x-2 translate-y-1.5 rounded-xl border border-gold/35 bg-[#761b10]" />
                    <div className="relative aspect-[1060/1484] overflow-hidden rounded-xl border border-gold-light/80 shadow-[0_38px_75px_rgba(0,0,0,0.75),0_0_55px_rgba(221,184,41,0.22)] transition-transform duration-700 hover:-translate-y-1">
                      <Image src="/images/shakti-cards/card_back-cover.png" alt="Shakti card deck cover" fill sizes="168px" priority className="object-cover" />
                      <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent" />
                    </div>
                    <div className="pointer-events-none absolute left-1/2 top-[calc(100%+1.2rem)] h-3 w-48 -translate-x-1/2 rounded-[50%] bg-black/50 blur-md" />
                    <div className="pointer-events-none absolute left-1/2 top-[calc(100%+1.65rem)] h-px w-56 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/55 to-transparent" />
                    <div className="pointer-events-none absolute left-1/2 top-[calc(100%+1.45rem)] h-2 w-2 -translate-x-1/2 rotate-45 border border-gold/60 bg-[#4b120f]" />
                    <div className="absolute left-1/2 top-[calc(100%+3.25rem)] z-20 flex -translate-x-1/2 flex-col items-center gap-3">
                      <button
                        type="button"
                        onClick={startShuffle}
                        className="group inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-gold/45 bg-[#210a09]/90 px-6 py-3 text-xs font-semibold tracking-[0.1em] text-gold-light shadow-[0_16px_35px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-gold-light/75 hover:bg-[#35100d] sm:px-7 sm:py-3.5"
                      >
                        Shuffle the cards
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                      </button>
                      {showBuyButton ? (
                        <Link
                          href="/checkout/product/shakti-oracle-deck"
                          className="group inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-gradient-to-r from-gold to-gold-dark px-6 py-3 text-xs font-semibold tracking-[0.06em] text-primary-deeper shadow-[0_18px_45px_-18px_rgba(238,198,50,0.72)] transition duration-300 hover:-translate-y-1 hover:from-gold-light hover:to-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light sm:px-7 sm:py-3.5"
                        >
                          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                          Buy the SHAKTI deck
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute inset-x-0 bottom-8 z-[60] text-center">
                {phase === "choosing" && <p className="text-xs font-medium tracking-[0.18em] text-white/55">MOVE SLOWLY. CHOOSE WITH INTUITION.</p>}
              </div>
            </>
          ) : (
            cardNumber && selectedGuidance && (
              <div className={`mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 lg:py-16 ${revealHeight}`}>
                <div className="revealed-card relative mx-auto w-full max-w-[18rem] [perspective:1200px] lg:max-w-[21rem]">
                  <div className="absolute -inset-9 rounded-[3rem] bg-gold/20 blur-3xl" />
                  <div className="relative aspect-[1060/1484] overflow-hidden rounded-2xl border border-gold-light/70 bg-gold-soft shadow-[0_45px_100px_rgba(0,0,0,0.7),0_0_55px_rgba(221,184,41,0.22)]">
                    <Image src={`/images/shakti-cards/card_${cardNumber}.png`} alt={`Your selected Shakti card, card ${cardNumber}`} fill sizes="(max-width: 1023px) 288px, 336px" priority className="object-cover" />
                  </div>
                </div>

                <div className="reading-copy text-center lg:text-left">
                  <p className="font-serif text-lg italic tracking-[0.1em] text-gold-light/80">The card you chose</p>
                  <h3 className="mt-4 text-balance font-display text-4xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-5xl">{selectedGuidance.title}</h3>
                  <div className="my-7 h-px bg-gradient-to-r from-transparent via-gold/55 to-transparent lg:from-gold/55 lg:via-gold/20" />
                  <p className="text-pretty text-base leading-8 text-white/70 sm:text-lg">{selectedGuidance.message}</p>
                  <blockquote className="mt-8 border-y border-gold/20 py-5 font-serif text-xl italic leading-relaxed text-gold-light sm:text-2xl">“{selectedGuidance.affirmation}”</blockquote>
                  <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                    <button type="button" onClick={resetReading} className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/[0.05] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:border-gold/80 hover:bg-white/[0.09]">
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      Shuffle again
                    </button>
                    <Link href="/contact" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-dark px-6 py-3 text-sm font-semibold text-primary-deeper transition duration-300 hover:from-gold-light hover:to-gold">
                      Book a personal reading
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
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
