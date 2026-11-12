"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

const programs = [
  {
    id: "transformation-journey",
    tab: "Shakti Transformation Journey",
    duration: "6 months",
    title: "Shakti Transformation Journey",
    description:
      "A six-month guided experience for transcending limiting beliefs and creating deep, lasting transformation. Through self-exploration, mentoring and aligned practices, you begin living from a clearer and more empowered inner foundation.",
    image: "/images/shakti-transformation-journey.webp",
    imageAlt: "Goddess Shakti standing before a sacred mandala in a transformational divine feminine artwork",
    features: [
      "Recognise and transcend limiting beliefs",
      "Deep self-exploration and emotional awareness",
      "Reclaim your voice, choices and personal power",
      "Create grounded change through clarity and alignment",
    ],
  },
  {
    id: "goddess-invocation",
    tab: "Goddess Invocation Sadhana",
    duration: "52 days",
    title: "Goddess Invocation Sadhana",
    description:
      "A 52-day sacred practice rooted in the chanting of seed mantras and guided invocation rituals. The journey helps you build a living relationship with Goddess energy through devotion, discipline and daily inner listening.",
    image: "/images/page-heroes/shakti-hero.webp",
    imageAlt: "A crimson and antique-gold lotus altar representing Goddess invocation",
    features: [
      "Guided chanting of sacred seed mantras",
      "Daily Goddess invocation rituals",
      "Practices for devotion, receptivity and inner strength",
      "Reflection and integration throughout all 52 days",
    ],
  },
] as const;

export default function ShaktiPrograms() {
  const [activeId, setActiveId] = useState<(typeof programs)[number]["id"]>(programs[0].id);
  const activeProgram = programs.find((program) => program.id === activeId) ?? programs[0];

  return (
    <section className="relative overflow-hidden bg-[#f8f0e4] py-12 sm:py-20 lg:py-32" aria-labelledby="shakti-programs-title">
      <div className="pointer-events-none absolute -left-48 top-28 h-[34rem] w-[34rem] rounded-full bg-primary/7 blur-3xl" />
      <div className="pointer-events-none absolute -right-48 bottom-10 h-[34rem] w-[34rem] rounded-full bg-gold/12 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        <div className="grid items-end gap-4 border-b border-gold/25 pb-6 sm:gap-8 sm:pb-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="font-serif text-lg italic tracking-[0.06em] text-primary sm:text-xl">The Shakti path</p>
            <h2 id="shakti-programs-title" className="mt-3 max-w-4xl text-balance font-display text-[1.85rem] font-semibold leading-[1.06] tracking-[-0.03em] text-charcoal sm:mt-4 sm:text-5xl lg:text-7xl">
              Awaken your <span className="text-crimson-gradient">divine feminine</span>
            </h2>
          </div>
          <p className="max-w-xl text-pretty text-sm leading-7 text-warmgray sm:text-base sm:leading-8 lg:justify-self-end">
            Choose a focused devotional practice or a longer transformational container. Both journeys are designed to help you honour your essence, deepen self-awareness and walk with greater inner power.
          </p>
        </div>

        <div role="tablist" aria-label="Shakti programs" className="mt-6 grid gap-2 rounded-2xl border border-gold/20 bg-white/55 p-1.5 shadow-[0_18px_55px_-42px_rgba(92,19,14,0.55)] backdrop-blur-sm sm:mt-9 sm:gap-3 sm:p-2 md:grid-cols-2 md:rounded-full">
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
                className={`flex min-h-11 items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-all duration-500 sm:gap-4 sm:px-5 sm:py-4 md:rounded-full md:px-7 ${active ? "bg-[#65130f] text-white shadow-[0_14px_35px_-18px_rgba(101,19,15,0.9)]" : "text-charcoal hover:bg-gold-soft"}`}
              >
                <span className="font-display text-base font-semibold sm:text-xl">{program.tab}</span>
                <span className={`shrink-0 text-[0.62rem] font-bold uppercase tracking-[0.2em] ${active ? "text-gold-light" : "text-gold-deep"}`}>{program.duration}</span>
              </button>
            );
          })}
        </div>

        <article id="shakti-program-panel" role="tabpanel" key={activeProgram.id} className="mt-6 grid overflow-hidden rounded-2xl border border-gold/25 bg-[#210b0a] shadow-[0_42px_100px_-52px_rgba(70,15,11,0.85)] animate-fade-up sm:mt-10 sm:rounded-[1.75rem] lg:grid-cols-[1.04fr_0.96fr] lg:rounded-[2.25rem]">
          <div className={`relative min-h-[16rem] overflow-hidden sm:min-h-[30rem] lg:min-h-[40rem] ${activeProgram.id === "transformation-journey" ? "bg-[radial-gradient(circle_at_center,#a90c11_0%,#72070b_72%,#3a0808_100%)]" : ""}`}>
            <Image
              src={activeProgram.image}
              alt={activeProgram.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 54vw"
              className={activeProgram.id === "transformation-journey" ? "object-contain object-center" : "object-cover transition-transform duration-1000 ease-out hover:scale-[1.025]"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#210b0a]/65 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#210b0a]/30" />
            <div className="absolute bottom-4 left-4 border-l border-gold/60 pl-3 text-white sm:bottom-8 sm:left-8 sm:pl-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-gold-light/80">Guided journey</p>
              <p className="mt-0.5 font-display text-2xl sm:mt-1 sm:text-3xl">{activeProgram.duration}</p>
            </div>
          </div>

          <div className="relative flex flex-col justify-center px-5 py-7 sm:px-10 sm:py-12 lg:px-14">
            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
            <p className="relative font-serif text-base italic tracking-[0.08em] text-gold-light/75 sm:text-lg">A sacred container for change</p>
            <h3 className="relative mt-2.5 text-balance font-display text-2xl font-semibold leading-[1.08] tracking-[-0.025em] text-white sm:mt-4 sm:text-4xl lg:text-5xl">{activeProgram.title}</h3>
            <p className="relative mt-3.5 text-pretty text-sm leading-7 text-white/66 sm:mt-6 sm:text-base sm:leading-8">{activeProgram.description}</p>
            <ul className="relative mt-5 space-y-2.5 sm:mt-8 sm:space-y-4">
              {activeProgram.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-white/78">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold text-primary-deeper"><Check className="h-3 w-3" strokeWidth={3} /></span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="group relative mt-6 inline-flex min-h-11 w-fit items-center gap-3 rounded-full bg-gradient-to-r from-gold to-gold-dark px-6 py-3 text-sm font-semibold text-primary-deeper shadow-[0_14px_38px_rgba(221,184,41,0.18)] transition duration-300 hover:-translate-y-1 hover:from-gold-light hover:to-gold sm:mt-10 sm:px-7 sm:py-3.5">
              Enquire about this journey
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
