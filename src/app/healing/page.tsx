import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import ChakraAssessment from "@/components/home/ChakraAssessment";
import DistanceHealingExperience from "@/components/home/DistanceHealingExperience";
import GsapReveal from "@/components/ui/GsapReveal";
import Reveal from "@/components/ui/Reveal";
import { brand, healingIntro, healingServices } from "@/lib/data";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Energy Healing in Mumbai & Pune",
  description:
    "Energy healing, distance healing and chakra balancing with Dr. Manisha Belvalkar. In-person sessions in Mumbai and Pune, plus distance healing online.",
  alternates: { canonical: "/healing" },
};

const heroSummary =
  "Gentle, grounded energy work for emotional release, chakra balance and inner steadiness. Held in person across Mumbai and Pune, or from home through distance healing.";

const healingSignals = [
  {
    number: "01",
    title: "Lingering emotional heaviness",
    text: "When stress, unspoken grief or old relational weight stays in the body long after a chapter has ended.",
  },
  {
    number: "02",
    title: "Mental fatigue and restless sleep",
    text: "When your thoughts keep circling and even quiet weekends leave you feeling drained rather than restored.",
  },
  {
    number: "03",
    title: "Navigating transition or uncertainty",
    text: "When work, family or health changes ask you to stay steady while everything around you is shifting.",
  },
  {
    number: "04",
    title: "Returning to inner clarity",
    text: "When you want calm spiritual support and practical grounding without dramatic promises or noise.",
  },
];

const sessionRhythm = [
  {
    numeral: "i.",
    title: "Quiet energetic listening",
    text: "Every session begins with an unhurried conversation to understand what feels heavy, stuck or out of balance right now.",
  },
  {
    numeral: "ii.",
    title: "Focused clearing and alignment",
    text: "Dr. Manisha works gently with your energy field, chakras and Shakti-guided intuition to release stagnation and restore flow.",
  },
  {
    numeral: "iii.",
    title: "Grounded aftercare",
    text: "You leave with calm clarity and simple, supportive practices to help your nervous system and energy stay settled.",
  },
];

function SectionMarker({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] ${
        light ? "text-[#f0d060]" : "text-[#981313]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-px w-8 ${light ? "bg-[#f0d060]" : "bg-[#981313]"}`}
      />
      {children}
    </span>
  );
}

export default function HealingPage() {
  const inPersonEnergy = healingServices.find(
    (service) => service.slug === "healing-sessions",
  );
  const distanceHealing = healingServices.find(
    (service) => service.slug === "distance-healing",
  );
  const shaktiHealing = healingServices.find(
    (service) => service.slug === "shakti-healing",
  );
  const guidedMeditation = healingServices.find(
    (service) => service.slug === "mind-reprogramming",
  );

  return (
    <div className="overflow-x-clip bg-[#fdf8f0] text-[#292524]">
      {/* 1. Editorial Split Hero — fits initial viewport cleanly */}
      <section className="relative isolate bg-[#fdf8f0] px-4 pb-12 pt-20 sm:px-10 sm:pb-20 sm:pt-24 lg:min-h-[calc(100dvh-1rem)] lg:pb-24 lg:pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 top-12 size-[30rem] rounded-full bg-[#ddb829]/12 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-36 bottom-4 size-[24rem] rounded-full bg-[#b41414]/6 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 sm:gap-14 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
          <div className="relative z-20">
            <div className="max-w-2xl">
              <GsapReveal y={18} instant>
                <SectionMarker>Energy healing &amp; chakra care</SectionMarker>
              </GsapReveal>

              <GsapReveal y={24} delay={0.07} instant>
                <h1 className="mt-4 max-w-2xl text-balance font-serif text-[2.25rem] leading-[1.03] tracking-[-0.03em] text-[#292524] sm:mt-6 sm:text-[clamp(3.1rem,5.6vw,4.9rem)] sm:leading-[0.98]">
                  Return to your
                  <span className="block text-[#a81414]">natural balance.</span>
                </h1>
              </GsapReveal>

              <GsapReveal y={18} delay={0.13} instant>
                <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-[#57534e] sm:mt-6 sm:text-lg sm:leading-8">
                  {heroSummary}
                </p>
              </GsapReveal>

              <GsapReveal y={18} delay={0.18} instant>
                <div className="mt-6 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center">
                  <Link
                    href="#offerings"
                    className="group inline-flex min-h-12 items-center justify-between gap-4 whitespace-nowrap rounded-full bg-[#b41414] py-2.5 pl-6 pr-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_-18px_rgba(180,20,20,0.85)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#8b0f0f] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a81414] sm:min-h-13 sm:pl-7 sm:pr-3"
                  >
                    <span>Explore healing paths</span>
                    <span className="grid size-8 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                      <ArrowUpRight className="size-4" strokeWidth={1.6} />
                    </span>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#a8871a]/65 bg-transparent px-6 py-3 text-sm font-semibold text-[#292524] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-[#a8871a] hover:bg-[#ddb829] hover:text-[#1c1917] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8871a] sm:min-h-13 sm:px-7"
                  >
                    Book a session
                  </Link>
                </div>
              </GsapReveal>

              <GsapReveal y={16} delay={0.24} instant>
                <dl className="mt-8 grid gap-4 border-t border-[#6b0b0b]/12 pt-5 sm:mt-11 sm:grid-cols-3 sm:gap-5 sm:pt-7">
                  {[
                    ["Mumbai & Pune", "Private in-person care"],
                    ["Distance healing", "Held anywhere online"],
                    ["30+ years", "With gentle aftercare"],
                  ].map(([title, sub]) => (
                    <div key={title}>
                      <dt className="text-sm font-semibold text-[#292524]">
                        {title}
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-[#67564d]">
                        {sub}
                      </dd>
                    </div>
                  ))}
                </dl>
              </GsapReveal>
            </div>
          </div>

          {/* Double-Bezel Arch Portrait + Obsidian Quote Plinth */}
          <Reveal direction="left" delay={0.1}>
            <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[460px]">
              <div className="rounded-t-[999px] rounded-b-[2rem] bg-[#efe5d2]/85 p-2 ring-1 ring-[#c7a23b]/45 shadow-[0_36px_80px_-42px_rgba(107,11,11,0.5)]">
                <div className="relative aspect-[3/3.55] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] bg-[#1c1917] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] sm:aspect-[3/4]">
                  <Image
                    src="/images/page-heroes/healing-hero.webp"
                    alt="Seven luminous mineral forms resting in rippled healing sand"
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 460px"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241612]/35 via-transparent to-transparent" />
                </div>
              </div>

              <div className="relative z-20 mx-2 -mt-8 rounded-2xl border-t-2 border-[#ddb829] bg-[#1c1917] p-5 text-white shadow-[0_28px_60px_-24px_rgba(28,25,23,0.72)] sm:-ml-8 sm:mr-14 sm:-mt-16 sm:p-7">
                <p className="font-serif text-lg leading-snug text-[#fdf8f0] sm:text-[1.4rem]">
                  “Healing begins when the nervous system feels safe enough to
                  release what it has been carrying.”
                </p>
                <p className="mt-3 text-xs font-semibold tracking-[0.14em] text-[#f0d060]">
                  {brand.name}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Parchment Manifesto Strip */}
      <section className="border-y border-[#6b0b0b]/10 bg-[#efe5d2] px-4 py-12 sm:px-10 sm:py-16 lg:py-20">
        <GsapReveal y={18}>
          <blockquote className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center font-serif text-2xl leading-tight text-[#6b0b0b] sm:text-3xl lg:text-[2.5rem]">
            <span
              aria-hidden="true"
              className="h-px w-20 bg-[#a8871a]/60"
            />
            <span className="text-balance">
              Healing is not about fixing what is broken.{" "}
              <span className="text-[#a8871a]">
                It is clearing space for your steadiness to return.
              </span>
            </span>
            <span
              aria-hidden="true"
              className="h-px w-20 bg-[#a8871a]/60"
            />
          </blockquote>
        </GsapReveal>
      </section>

      {/* 3. Asymmetric Sticky Editorial Index — When Energy Healing Helps */}
      <section className="bg-[#f8f3e9] px-4 py-16 sm:px-10 sm:py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1200px] items-start gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <h2 className="text-balance font-serif text-[1.95rem] leading-[1.06] text-[#292524] sm:text-5xl">
                Quiet signs your energy is{" "}
                <span className="text-[#a81414]">asking for care.</span>
              </h2>
              <p className="mt-5 max-w-lg text-pretty text-base leading-7 text-[#57534e] sm:mt-6 sm:text-lg sm:leading-8">
                {healingIntro}
              </p>
            </div>
          </Reveal>

          <div className="border-t border-[#6b0b0b]/15">
            {healingSignals.map((signal, index) => (
              <Reveal delay={index * 0.06} key={signal.number}>
                <div className="grid gap-3 border-b border-[#6b0b0b]/15 py-6 sm:grid-cols-[3.25rem_1fr] sm:gap-7 sm:py-8">
                  <span className="font-serif text-xl tabular-nums text-[#a8871a] sm:pt-0.5 sm:text-2xl">
                    {signal.number}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl leading-snug text-[#292524] sm:text-2xl">
                      {signal.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#57534e] sm:text-base sm:leading-7">
                      {signal.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Asymmetric Double-Bezel Healing Pathways Bento */}
      <section
        id="offerings"
        className="relative bg-[#fdf8f0] px-4 py-16 sm:px-10 sm:py-24 lg:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-28 size-[28rem] rounded-full bg-[#ddb829]/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1200px]">
          <Reveal>
            <div className="max-w-2xl border-b border-[#6b0b0b]/12 pb-8 lg:pb-12">
              <h2 className="text-balance font-serif text-[1.95rem] leading-[1.06] text-[#292524] sm:text-5xl lg:text-6xl">
                Four ways to restore{" "}
                <span className="text-[#a81414]">your balance.</span>
              </h2>
              <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-[#57534e] sm:mt-5 sm:text-lg sm:leading-8">
                Choose in-person Energy or Shakti Healing, Distance Healing from
                home, or guided meditation for deeper mental clarity.
              </p>
            </div>
          </Reveal>

          {/* Row 1: Asymmetric 7/5 Bento Pairing */}
          <div className="mt-10 grid gap-6 sm:mt-14 lg:grid-cols-12 lg:gap-8">
            {inPersonEnergy && (
              <Reveal className="lg:col-span-7" delay={0.04}>
                <div className="h-full rounded-[2rem] bg-[#efe5d2]/75 p-2 ring-1 ring-[#c7a23b]/35 shadow-[0_32px_70px_-48px_rgba(107,11,11,0.45)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:ring-[#c9a520]">
                  <article
                    id={inPersonEnergy.slug}
                    className="group flex h-full flex-col overflow-hidden rounded-[calc(2rem-0.5rem)] bg-[#fffdf9] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] sm:p-7"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[1.25rem] bg-[#efe5d2]">
                      <Image
                        src={inPersonEnergy.image}
                        alt={inPersonEnergy.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="mt-6 flex flex-1 flex-col">
                      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#efe5d2] pb-4">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8871a]">
                          {inPersonEnergy.format ?? "In person"}
                        </span>
                        <span className="font-serif text-xl tabular-nums text-[#981313] sm:text-2xl">
                          {inPersonEnergy.price
                            ? formatINR(inPersonEnergy.price)
                            : "On enquiry"}
                        </span>
                      </div>

                      <h3 className="mt-5 font-serif text-2xl leading-tight text-[#292524] transition-colors duration-300 group-hover:text-[#981313] sm:text-3xl">
                        {inPersonEnergy.title}
                      </h3>

                      <p className="mt-3 max-w-xl text-pretty text-sm leading-6 text-[#57534e] sm:text-base sm:leading-7">
                        {inPersonEnergy.description}
                      </p>

                      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                        {inPersonEnergy.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 text-sm leading-6 text-[#292524]"
                          >
                            <span className="mt-1 grid size-4.5 shrink-0 place-items-center rounded-full bg-[#faf3dc] text-[#8b0f0f] ring-1 ring-[#ddb829]/55">
                              <Check className="size-2.5" strokeWidth={2.5} />
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-7">
                        <Link
                          href={`/healing/${inPersonEnergy.slug}`}
                          className="group/btn inline-flex min-h-11 items-center gap-3 whitespace-nowrap rounded-full bg-[#b41414] py-2 pl-5 pr-2 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_-16px_rgba(180,20,20,0.85)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#8b0f0f] active:scale-[0.98]"
                        >
                          <span>Explore Energy Healing</span>
                          <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px group-hover/btn:scale-105">
                            <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              </Reveal>
            )}

            {distanceHealing && (
              <Reveal className="lg:col-span-5" delay={0.1}>
                <div className="h-full rounded-[2rem] bg-[#efe5d2]/75 p-2 ring-1 ring-[#c7a23b]/35 shadow-[0_32px_70px_-48px_rgba(107,11,11,0.45)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:ring-[#c9a520]">
                  <article
                    id={distanceHealing.slug}
                    className="group flex h-full flex-col overflow-hidden rounded-[calc(2rem-0.5rem)] bg-[#fffdf9] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] sm:p-7"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#efe5d2]">
                      <Image
                        src={distanceHealing.image}
                        alt={distanceHealing.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="mt-6 flex flex-1 flex-col">
                      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#efe5d2] pb-4">
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8871a]">
                          {distanceHealing.format ?? "Distance"}
                        </span>
                        <span className="font-serif text-xl tabular-nums text-[#981313] sm:text-2xl">
                          {distanceHealing.price
                            ? formatINR(distanceHealing.price)
                            : "On enquiry"}
                        </span>
                      </div>

                      <h3 className="mt-5 font-serif text-2xl leading-tight text-[#292524] transition-colors duration-300 group-hover:text-[#981313] sm:text-3xl">
                        {distanceHealing.title}
                      </h3>

                      <p className="mt-3 text-pretty text-sm leading-6 text-[#57534e] sm:text-base sm:leading-7">
                        {distanceHealing.description}
                      </p>

                      <ul className="mt-5 space-y-2.5">
                        {distanceHealing.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 text-sm leading-6 text-[#292524]"
                          >
                            <span className="mt-1 grid size-4.5 shrink-0 place-items-center rounded-full bg-[#faf3dc] text-[#8b0f0f] ring-1 ring-[#ddb829]/55">
                              <Check className="size-2.5" strokeWidth={2.5} />
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto pt-7">
                        <Link
                          href={`/healing/${distanceHealing.slug}`}
                          className="group/btn inline-flex min-h-11 items-center gap-3 whitespace-nowrap rounded-full border border-[#c7a23b] bg-[#faf3dc]/60 py-2 pl-5 pr-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#6b0b0b] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#ddb829] hover:text-[#1c1917] active:scale-[0.98]"
                        >
                          <span>Explore Distance Healing</span>
                          <span className="grid size-7 place-items-center rounded-full bg-[#6b0b0b]/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px group-hover/btn:scale-105">
                            <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </article>
                </div>
              </Reveal>
            )}
          </div>

          {/* Row 2: Shakti Healing Full-Width Asymmetric Split Showcase */}
          {shaktiHealing && (
            <Reveal delay={0.08}>
              <div className="mt-6 rounded-[2rem] bg-[#efe5d2]/75 p-2 ring-1 ring-[#c7a23b]/35 shadow-[0_32px_70px_-48px_rgba(107,11,11,0.45)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:ring-[#c9a520] sm:mt-8">
                <article
                  id={shaktiHealing.slug}
                  className="group grid items-center gap-7 rounded-[calc(2rem-0.5rem)] bg-[#fffdf9] p-4 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-10"
                >
                  <div className="relative lg:col-span-5">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#efe5d2] lg:aspect-[5/4]">
                      <Image
                        src={shaktiHealing.image}
                        alt={shaktiHealing.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:col-span-7">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#efe5d2] pb-4">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8871a]">
                        {shaktiHealing.format ?? "In person"}
                      </span>
                      <span className="font-serif text-xl tabular-nums text-[#981313] sm:text-2xl">
                        {shaktiHealing.price
                          ? formatINR(shaktiHealing.price)
                          : "On enquiry"}
                      </span>
                    </div>

                    <h3 className="mt-5 font-serif text-2xl leading-tight text-[#292524] transition-colors duration-300 group-hover:text-[#981313] sm:text-4xl">
                      {shaktiHealing.title}
                    </h3>

                    <p className="mt-3 max-w-2xl text-pretty text-base leading-7 text-[#57534e] sm:mt-4 sm:text-lg sm:leading-8">
                      {shaktiHealing.description}
                    </p>

                    <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                      {shaktiHealing.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm leading-6 text-[#292524]"
                        >
                          <span className="mt-1 grid size-4.5 shrink-0 place-items-center rounded-full bg-[#faf3dc] text-[#8b0f0f] ring-1 ring-[#ddb829]/55">
                            <Check className="size-2.5" strokeWidth={2.5} />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7">
                      <Link
                        href={`/healing/${shaktiHealing.slug}`}
                        className="group/btn inline-flex min-h-11 items-center gap-3 whitespace-nowrap rounded-full bg-[#b41414] py-2 pl-6 pr-2 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_-16px_rgba(180,20,20,0.85)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#8b0f0f] active:scale-[0.98]"
                      >
                        <span>Explore Shakti Healing</span>
                        <span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px group-hover/btn:scale-105">
                          <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            </Reveal>
          )}

          {/* Row 3: Deep Guided Meditation — Obsidian Double-Bezel Sanctuary Panel */}
          {guidedMeditation && (
            <Reveal delay={0.12}>
              <div className="mt-6 rounded-[2rem] bg-[#1c1917] p-2 ring-1 ring-[#ddb829]/30 shadow-[0_38px_90px_-42px_rgba(28,25,23,0.75)] sm:mt-8">
                <article
                  id={guidedMeditation.slug}
                  className="group relative grid items-center gap-7 overflow-hidden rounded-[calc(2rem-0.5rem)] bg-[#221d1a] p-4 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] sm:p-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12 lg:p-10"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-[#ddb829]/10 blur-3xl"
                  />

                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] ring-1 ring-[#ddb829]/25 lg:order-2 lg:aspect-[5/4]">
                    <Image
                      src={guidedMeditation.image}
                      alt={guidedMeditation.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 44vw"
                      className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/55 via-transparent to-transparent" />
                  </div>

                  <div className="relative z-10 flex flex-col lg:order-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#ddb829]/25 pb-4">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f0d060]">
                        {guidedMeditation.format ?? "Live online"}
                      </span>
                      {guidedMeditation.price ? (
                        <span className="font-serif text-xl tabular-nums text-[#f0d060] sm:text-2xl">
                          {formatINR(guidedMeditation.price)}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-5 font-serif text-2xl leading-tight text-white sm:text-4xl">
                      {guidedMeditation.title}
                    </h3>

                    <p className="mt-3 max-w-xl text-pretty text-sm leading-6 text-[#d6cfc2] sm:mt-4 sm:text-base sm:leading-7">
                      {guidedMeditation.description}
                    </p>

                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {guidedMeditation.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm leading-6 text-[#efe5d2]"
                        >
                          <span className="mt-1 grid size-4.5 shrink-0 place-items-center rounded-full bg-[#ddb829] text-[#1c1917]">
                            <Check className="size-2.5" strokeWidth={2.75} />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7">
                      <Link
                        href={`/healing/${guidedMeditation.slug}`}
                        className="group/btn inline-flex min-h-11 items-center gap-3 whitespace-nowrap rounded-full bg-[#ddb829] py-2 pl-6 pr-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1c1917] shadow-[0_14px_34px_-16px_rgba(221,184,41,0.55)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#f0d060] active:scale-[0.98]"
                      >
                        <span>Explore guided meditation</span>
                        <span className="grid size-7 place-items-center rounded-full bg-[#1c1917]/12 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px group-hover/btn:scale-105">
                          <ArrowRight className="size-3.5" strokeWidth={1.8} />
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* 5. Deep Sacred Crimson Sanctuary — How Healing Unfolds */}
      <section className="relative overflow-hidden bg-[#6b0b0b] px-4 py-16 text-white sm:px-10 sm:py-24 lg:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-28 top-16 size-96 rounded-full bg-[#b41414]/35 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-3 border border-[#ddb829]/15 sm:inset-8"
        />

        <div className="relative mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
          <Reveal>
            <div>
              <SectionMarker light>What a session holds</SectionMarker>
              <h2 className="mt-4 max-w-xl text-balance font-serif text-[1.9rem] leading-[1.06] text-white sm:mt-6 sm:text-5xl lg:text-6xl">
                Held with stillness.{" "}
                <span className="text-[#f0d060]">Guided with care.</span>
              </h2>
              <p className="mt-4 max-w-lg text-pretty text-base leading-7 text-[#efe5d2] sm:mt-6 sm:text-lg sm:leading-8">
                Whether you visit in Mumbai or Pune, or connect from another
                city, each session moves at a gentle pace tailored to your
                nervous system and energy.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-[#ddb829] px-6 py-3 text-sm font-bold text-[#1c1917] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:min-h-13 sm:px-7"
                >
                  Ask before booking <ArrowRight className="size-4" />
                </Link>
                <Link
                  href={brand.whatsappHref}
                  className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full border border-[#f0d060]/55 px-6 py-3 text-sm font-semibold text-white transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[#f0d060] hover:text-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:min-h-13 sm:px-7"
                >
                  Message on WhatsApp
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="border-t border-[#ddb829]/35">
            {sessionRhythm.map((step, index) => (
              <Reveal delay={index * 0.06} key={step.numeral}>
                <div className="grid gap-3 border-b border-[#ddb829]/35 py-6 sm:grid-cols-[3.5rem_1fr] sm:gap-6 sm:py-8">
                  <span className="font-serif text-3xl text-[#f0d060] sm:text-4xl">
                    {step.numeral}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl leading-tight text-white sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#efe5d2] sm:text-base sm:leading-7">
                      {step.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Distance Healing Experience */}
      <DistanceHealingExperience />

      {/* 7. Interactive Chakra Self-Assessment */}
      <ChakraAssessment />
    </div>
  );
}
