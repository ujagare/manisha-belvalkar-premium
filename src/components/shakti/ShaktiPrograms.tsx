"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type PointerEvent } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { whatsappUrl } from "@/lib/manual-flow";
import { transformationProgram } from "@/lib/data";
import styles from "@/app/shakti/shakti.module.css";

const sadhanaPhases = [
  {
    step: "01",
    title: "Seed Mantras",
    detail: "Guided chanting rooted in sacred phonetic vibration.",
  },
  {
    step: "02",
    title: "Daily Invocation",
    detail: "Steady ritual devotion to awaken Goddess presence.",
  },
  {
    step: "03",
    title: "52-Day Integration",
    detail: "Inner listening woven into daily strength and grace.",
  },
] as const;

const programs = [
  {
    id: "transformation-journey",
    index: "01",
    eyebrow: "Guided Container · 6 Months",
    tab: "Shakti Transformation Journey",
    duration: "6 months",
    title: "Shakti Transformation Journey",
    description:
      "A six-month guided experience for transcending limiting beliefs and creating deep, lasting transformation. Through self-exploration, mentoring and aligned practices, you begin living from a clearer and more empowered inner foundation.",
    image: "/images/shakti-transformation-journey.webp",
    imageAlt:
      "Goddess Shakti standing before a sacred mandala in a transformational divine feminine artwork",
    features: [
      "Recognise and transcend limiting beliefs",
      "Deep self-exploration and emotional awareness",
      "Reclaim your voice, choices and personal power",
      "Create grounded change through clarity and alignment",
    ],
    ctaLabel: "Explore the 6-month journey",
    ctaHref: "/courses/personalized-wellbeing",
    whatsappText:
      "Hello Manisha, I would like to know more about the Shakti Transformation Journey (6 months).",
  },
  {
    id: "goddess-invocation",
    index: "02",
    eyebrow: "Devotional Sadhana · 52 Days",
    tab: "Goddess Invocation Sadhana",
    duration: "52 days",
    title: "Goddess Invocation Sadhana",
    description:
      "A 52-day sacred practice rooted in the chanting of seed mantras and guided invocation rituals. The journey helps you build a living relationship with Goddess energy through devotion, discipline and daily inner listening.",
    image: "/images/page-heroes/shakti-hero.webp",
    imageAlt:
      "A crimson and antique-gold lotus altar representing Goddess invocation",
    features: [
      "Guided chanting of sacred seed mantras",
      "Daily Goddess invocation rituals",
      "Practices for devotion, receptivity and inner strength",
      "Reflection and integration throughout all 52 days",
    ],
    ctaLabel: "Explore Goddess Attunement",
    ctaHref: "/services/goddess-attunement",
    whatsappText:
      "Hello Manisha, I would like to know more about the Goddess Invocation Sadhana (52 days).",
  },
] as const;

function updateSpotlight(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
}

export default function ShaktiPrograms() {
  const [activeId, setActiveId] = useState<(typeof programs)[number]["id"]>(
    programs[0].id,
  );
  const activeProgram =
    programs.find((program) => program.id === activeId) ?? programs[0];

  return (
    <section
      className="relative overflow-hidden border-y border-gold/20 bg-ivory py-16 sm:py-24 lg:py-32"
      aria-labelledby="shakti-programs-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-28 h-[34rem] w-[34rem] rounded-full bg-primary/[0.06] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 bottom-10 h-[34rem] w-[34rem] rounded-full bg-gold/14 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid items-end gap-5 border-b border-gold/30 pb-7 sm:gap-8 sm:pb-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary-dark">
              <span className="h-px w-8 bg-primary/70" aria-hidden="true" />
              The Shakti path
            </span>
            <h2
              id="shakti-programs-title"
              className="mt-4 max-w-4xl text-balance font-display text-[2rem] font-semibold leading-[1.06] tracking-[-0.02em] text-charcoal sm:mt-5 sm:text-5xl lg:text-[3.75rem]"
            >
              Awaken your <span className="text-crimson-gradient">divine feminine</span>
            </h2>
          </div>
          <p className="max-w-[54ch] text-pretty text-sm leading-7 text-warmgray sm:text-base sm:leading-8 lg:justify-self-end">
            Choose a focused devotional practice or a longer transformational container. Both journeys are designed to help you honour your essence, deepen self-awareness and walk with greater inner power.
          </p>
        </div>

        {/* Architectural program switcher */}
        <div
          role="tablist"
          aria-label="Shakti programs"
          className="mt-7 grid gap-2 rounded-2xl border border-gold/30 bg-cream/90 p-1.5 shadow-[0_20px_50px_-38px_rgba(92,19,14,0.45)] backdrop-blur-sm sm:mt-10 sm:gap-3 sm:p-2 md:grid-cols-2 md:rounded-full"
        >
          {programs.map((program) => {
            const active = activeId === program.id;
            return (
              <button
                key={program.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="shakti-program-panel"
                onClick={() => setActiveId(program.id)}
                className={`${styles.tactileButton} flex min-h-12 items-center justify-between gap-3 rounded-xl px-4 py-3 text-left sm:gap-4 sm:px-6 sm:py-3.5 md:rounded-full md:px-7 ${
                  active
                    ? "bg-[#5c100d] text-white shadow-[0_16px_38px_-18px_rgba(92,16,13,0.92),inset_0_1px_0_rgba(240,208,96,0.28)] ring-1 ring-gold/35"
                    : "text-charcoal hover:bg-gold-soft/75 hover:text-primary-dark"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={`font-serif text-sm italic tabular-nums ${
                      active ? "text-gold-light" : "text-gold-deep"
                    }`}
                  >
                    {program.index}
                  </span>
                  <span className="font-display text-base font-semibold sm:text-lg lg:text-xl">
                    {program.tab}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] tabular-nums ${
                    active
                      ? "border-gold/45 bg-gold/12 text-gold-light"
                      : "border-gold/30 bg-white/70 text-gold-deep"
                  }`}
                >
                  {program.duration}
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured sanctuary panel */}
        <article
          id="shakti-program-panel"
          role="tabpanel"
          key={activeProgram.id}
          onPointerMove={updateSpotlight}
          className={`${styles.spotlightSurface} ${styles.panelEnter} relative mt-7 overflow-hidden rounded-[1.5rem] border border-gold/32 bg-[#210b0a] shadow-[0_44px_100px_-50px_rgba(62,12,9,0.88)] sm:mt-10 sm:rounded-[2rem]`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 z-10 rounded-[1.15rem] border border-gold/12 sm:inset-3.5 sm:rounded-[1.55rem]"
          />

          <div className="grid lg:grid-cols-[0.96fr_1.04fr]">
            {/* Visual side */}
            <div
              className={`${styles.mediaZoomFrame} relative min-h-[18rem] overflow-hidden sm:min-h-[28rem] lg:min-h-[38rem] ${
                activeProgram.id === "transformation-journey"
                  ? "bg-[radial-gradient(circle_at_50%_45%,#8d1214_0%,#520a0c_58%,#210b0a_100%)]"
                  : "bg-[#210b0a]"
              }`}
            >
              <Image
                src={activeProgram.image}
                alt={activeProgram.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className={`${styles.mediaZoom} ${
                  activeProgram.id === "transformation-journey"
                    ? "object-contain object-center p-4 sm:p-6"
                    : "object-cover"
                }`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#210b0a]/85 via-[#210b0a]/15 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#210b0a]/60" />

              <div className="absolute bottom-5 left-5 z-20 rounded-xl border border-gold/30 bg-[#1a0706]/80 px-4 py-3 text-white backdrop-blur-md sm:bottom-8 sm:left-8 sm:px-5 sm:py-3.5">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.26em] text-gold-light/85">
                  {activeProgram.eyebrow}
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-cream tabular-nums sm:text-2xl">
                  {activeProgram.duration}
                </p>
              </div>
            </div>

            {/* Copy side */}
            <div className="relative z-10 flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-gold/[0.09] blur-3xl"
              />
              <span className="inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-gold-light/85">
                <span className="h-px w-7 bg-gold/70" aria-hidden="true" />
                A sacred container for change
              </span>
              <h3 className="relative mt-3.5 text-balance font-display text-2xl font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:mt-4 sm:text-4xl lg:text-[2.75rem]">
                {activeProgram.title}
              </h3>
              <p className="relative mt-4 max-w-[58ch] text-pretty text-sm leading-7 text-cream/78 sm:mt-5 sm:text-base sm:leading-8">
                {activeProgram.description}
              </p>

              <ul className="relative mt-6 space-y-3 border-y border-gold/18 py-5 sm:mt-8 sm:space-y-3.5 sm:py-6">
                {activeProgram.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm leading-6 text-cream/88"
                  >
                    <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-sm border border-gold/65 bg-gold/15 text-gold-light">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="relative mt-7 flex flex-wrap items-center gap-4 sm:mt-8">
                <Link
                  href={activeProgram.ctaHref}
                  className={`${styles.tactileButton} group inline-flex min-h-12 items-center gap-3 rounded-full bg-gradient-to-r from-gold to-gold-dark px-6 py-3 text-sm font-semibold text-primary-deeper shadow-[0_16px_38px_-14px_rgba(221,184,41,0.45)] hover:-translate-y-0.5 hover:from-gold-light hover:to-gold sm:px-7 sm:py-3.5`}
                >
                  {activeProgram.ctaLabel}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
                <a
                  href={whatsappUrl(activeProgram.whatsappText)}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light/85 transition-colors hover:text-gold-light"
                >
                  Ask on WhatsApp
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Editorial journey breakdown strip inside the sanctuary card */}
          <div className="relative z-10 border-t border-gold/18 bg-[#180706]/85 px-6 py-6 sm:px-10 sm:py-8 lg:px-14">
            {activeProgram.id === "transformation-journey" ? (
              <>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-gold-light/80">
                    Six inner thresholds · Month by month
                  </p>
                  <p className="text-xs text-cream/55">
                    Personalised mentoring · By consultation
                  </p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {transformationProgram.months.map((item) => (
                    <div
                      key={item.month}
                      className="rounded-xl border border-gold/15 bg-white/[0.025] px-4 py-3.5 transition-colors duration-300 hover:border-gold/35 hover:bg-white/[0.045]"
                    >
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-serif text-xs italic text-gold-light/80 tabular-nums">
                          0{item.month}
                        </span>
                        <h4 className="font-display text-base font-semibold text-cream">
                          {item.title}
                        </h4>
                      </div>
                      <p className="mt-1.5 text-xs leading-5 text-cream/65">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-gold-light/80">
                    The 52-day sacred rhythm
                  </p>
                  <p className="text-xs text-cream/55">
                    Guided devotional sadhana
                  </p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {sadhanaPhases.map((phase) => (
                    <div
                      key={phase.step}
                      className="rounded-xl border border-gold/15 bg-white/[0.025] px-4 py-3.5 transition-colors duration-300 hover:border-gold/35 hover:bg-white/[0.045]"
                    >
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-serif text-xs italic text-gold-light/80 tabular-nums">
                          {phase.step}
                        </span>
                        <h4 className="font-display text-base font-semibold text-cream">
                          {phase.title}
                        </h4>
                      </div>
                      <p className="mt-1.5 text-xs leading-5 text-cream/65">
                        {phase.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
