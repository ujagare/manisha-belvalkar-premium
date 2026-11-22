import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";

import GsapReveal from "@/components/ui/GsapReveal";
import Reveal from "@/components/ui/Reveal";
import { brand, mentoringAreas, mentoringIntro } from "@/lib/data";

export const metadata: Metadata = {
  title: "Spiritual Mentoring & Soul Purpose",
  description:
    "Private mentoring through Tarot, soul purpose reading and clarity-alignment with Dr. Manisha Belvalkar. Sessions in Mumbai, Pune and online.",
  alternates: { canonical: "/mentoring" },
};

const heroIntro =
  "A private guidance space for self-discovery, soul purpose and aligned action. Through Tarot, intuitive mentoring and deep reflection, Dr. Manisha Belvalkar helps you see clearly and choose your next step with confidence.";

const moments = [
  {
    number: "01",
    title: "Crossroads & major decisions",
    text: "When a career shift, relationship choice or personal transition asks for perspective deeper than pros and cons.",
  },
  {
    number: "02",
    title: "Recurring patterns & blind spots",
    text: "When similar situations keep returning and you are ready to understand the underlying dynamic with honesty.",
  },
  {
    number: "03",
    title: "Purpose, alignment & inner steadiness",
    text: "When outer success feels incomplete and you want your daily choices to reflect who you truly are.",
  },
];

const sessionFlow = [
  {
    numeral: "i.",
    title: "Clarify your central question",
    text: "We begin with where you are right now — naming the crossroads, pattern or intention you want to illuminate without judgement or rush.",
  },
  {
    numeral: "ii.",
    title: "Reflect through Tarot & intuitive insight",
    text: "Tarot acts as a precise mirror, surfacing unseen dynamics, inner strengths and timing so the bigger picture becomes unmistakable.",
  },
  {
    numeral: "iii.",
    title: "Leave with grounded next steps",
    text: "Every mentoring session closes with clear reflection points, practical remedies where helpful, and calm direction you can act on immediately.",
  },
];

function Marker({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] sm:gap-3 sm:text-xs sm:tracking-[0.22em] ${light ? "text-[#f0d060]" : "text-[#981313]"
        }`}
    >
      <span
        aria-hidden="true"
        className={`h-px w-5 sm:w-8 ${light ? "bg-[#f0d060]" : "bg-[#981313]"}`}
      />
      {children}
    </span>
  );
}

function Ornament() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center gap-2 text-[#ddb829] sm:gap-3"
    >
      <span className="h-px w-7 bg-current sm:w-10" />
      <Sparkles className="size-3.5 stroke-[1.4] sm:size-4" />
      <span className="h-px w-7 bg-current sm:w-10" />
    </span>
  );
}

export default function MentoringPage() {
  return (
    <div className="overflow-hidden bg-[#fdf8f0] text-[#292524]">
      {/* Editorial Split Hero — matches Services & About palette and Lora hierarchy */}
      <section className="relative isolate bg-[#fdf8f0] px-4 pb-7 pt-20 sm:px-10 sm:pb-24 sm:pt-24 lg:pb-28 lg:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute -right-32 top-12 size-[32rem] rounded-full bg-[#ddb829]/12 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute -left-36 bottom-0 size-[26rem] rounded-full bg-[#b41414]/6 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-[1200px] items-center gap-5 sm:gap-14 lg:grid-cols-[1.06fr_0.94fr] lg:gap-20">
          <div className="relative z-20">
            <div className="max-w-2xl">
              <GsapReveal y={20} instant>
                <Marker>Private spiritual mentoring</Marker>
              </GsapReveal>

              <GsapReveal y={26} delay={0.08} instant>
                <h1 className="mt-2.5 max-w-2xl text-balance font-serif text-[1.85rem] leading-[1.06] tracking-[-0.03em] text-[#292524] sm:mt-7 sm:text-[clamp(3.15rem,6vw,5.15rem)] sm:leading-[0.96]">
                  Guidance for your
                  <span className="block text-[#a81414]">next chapter.</span>
                </h1>
              </GsapReveal>

              <GsapReveal y={20} delay={0.14} instant>
                <p className="mt-2.5 max-w-xl text-pretty text-[13.5px] leading-6 text-[#57534e] sm:mt-7 sm:text-lg sm:leading-8">
                  {heroIntro}
                </p>
              </GsapReveal>

              <GsapReveal y={20} delay={0.2} instant>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-10 sm:flex sm:flex-row sm:items-center sm:gap-3">
                  <Link
                    href="#pathways"
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#b41414] px-2.5 py-2 text-center text-[11px] font-semibold uppercase leading-tight tracking-[0.06em] text-white transition-colors duration-200 hover:bg-[#8b0f0f] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a81414] sm:min-h-14 sm:gap-3 sm:whitespace-nowrap sm:px-8 sm:py-4 sm:text-sm sm:tracking-[0.12em]"
                  >
                    <span>Explore paths</span>
                    <ArrowRight className="size-3.5 shrink-0 sm:size-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-[#a8871a] px-2.5 py-2 text-center text-[11px] font-semibold uppercase leading-tight tracking-[0.06em] text-[#292524] transition-colors duration-200 hover:bg-[#ddb829] hover:text-[#1c1917] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8871a] sm:min-h-14 sm:whitespace-nowrap sm:px-8 sm:py-4 sm:text-sm sm:tracking-[0.12em]"
                  >
                    Book session
                  </Link>
                </div>
              </GsapReveal>

              <GsapReveal y={18} delay={0.26} instant>
                <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-[#6b0b0b]/12 pt-3.5 sm:mt-12 sm:gap-5 sm:pt-7">
                  {[
                    ["30+ years", "PhD in Tarot"],
                    ["Private 1:1", "Confidential care"],
                    ["Global", "Mumbai, Pune, Online"],
                  ].map(([title, sub]) => (
                    <div key={title}>
                      <dt className="text-xs font-semibold text-[#292524] sm:text-sm">
                        {title}
                      </dt>
                      <dd className="mt-0.5 text-[11px] leading-4 text-[#67564d] sm:mt-1 sm:text-sm sm:leading-6">
                        {sub}
                      </dd>
                    </div>
                  ))}
                </dl>
              </GsapReveal>
            </div>
          </div>

          <Reveal direction="left" delay={0.12}>
            <div className="relative mx-auto w-full max-w-[248px] px-2 pt-2 sm:max-w-[470px] sm:px-3 sm:pt-3">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-t-[999px] rounded-b-[1.5rem] border border-[#c7a23b]"
              />
              <div className="relative aspect-[4/3.6] overflow-hidden rounded-t-[999px] rounded-b-[1rem] shadow-[0_24px_50px_-30px_rgba(28,25,23,0.45)] sm:aspect-[3/4.15]">
                <Image
                  src="/images/manisha/manisha-mentoring-portrait.webp"
                  alt="Dr. Manisha Belvalkar — Spiritual Mentor and Tarot Guide"
                  fill
                  priority
                  sizes="(max-width: 1024px) 248px, 470px"
                  className="object-cover object-[50%_18%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#351b16]/35 via-transparent to-transparent" />
              </div>
              <div className="relative z-20 mx-1 -mt-6 border-t-2 border-[#ddb829] bg-[#1c1917] p-3 text-white shadow-[0_20px_45px_-22px_rgba(28,25,23,0.65)] sm:-ml-10 sm:mr-16 sm:-mt-20 sm:p-7">
                <p className="font-serif text-[13px] leading-snug text-[#fdf8f0] sm:text-2xl">
                  “Mentoring is a sacred pause: a space to listen deeply, see
                  clearly, and choose with courage.”
                </p>
                <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f0d060] sm:mt-3 sm:text-xs sm:tracking-[0.2em]">
                  {brand.name}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Parchment Manifesto Strip */}
      <section className="border-y border-[#6b0b0b]/10 bg-[#efe5d2] px-4 py-5 sm:px-10 sm:py-14 lg:py-20">
        <GsapReveal y={18}>
          <blockquote className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-center font-serif text-[1.08rem] leading-snug text-[#6b0b0b] sm:gap-6 sm:text-4xl lg:flex-row lg:justify-center lg:text-[2.65rem]">
            <Ornament />
            <span className="text-balance">
              Tarot is not fortune-telling.{" "}
              <span className="text-[#a8871a]">
                It is a mirror for your own clarity.
              </span>
            </span>
            <span className="hidden sm:inline-flex">
              <Ornament />
            </span>
          </blockquote>
        </GsapReveal>
      </section>

      {/* Why Mentoring — Asymmetric Editorial Contrast */}
      <section className="bg-[#f8f3e9] px-4 py-8 sm:px-10 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] items-start gap-5 sm:gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <Marker>Beyond a single answer</Marker>
              <h2 className="mt-2.5 text-balance font-serif text-[1.6rem] leading-[1.08] text-[#292524] sm:mt-6 sm:text-5xl sm:leading-[1.06]">
                When a reading opens the door,{" "}
                <span className="text-[#a81414]">
                  mentoring helps you walk through it.
                </span>
              </h2>
              <p className="mt-2.5 max-w-lg text-pretty text-[13.5px] leading-6 text-[#57534e] sm:mt-6 sm:text-lg sm:leading-8">
                {mentoringIntro}
              </p>
            </div>
          </Reveal>

          <div className="border-t border-[#6b0b0b]/15">
            {moments.map((moment, index) => (
              <Reveal delay={index * 0.06} key={moment.number}>
                <div className="grid grid-cols-[1.85rem_1fr] gap-2.5 border-b border-[#6b0b0b]/15 py-3.5 sm:grid-cols-[auto_1fr] sm:gap-7 sm:py-8">
                  <span className="pt-0.5 font-serif text-base tabular-nums text-[#a8871a] sm:pt-1 sm:text-2xl">
                    {moment.number}
                  </span>
                  <div>
                    <h3 className="font-serif text-[1.05rem] leading-snug text-[#292524] sm:text-2xl">
                      {moment.title}
                    </h3>
                    <p className="mt-1 max-w-xl text-xs leading-5 text-[#57534e] sm:mt-2 sm:text-base sm:leading-7">
                      {moment.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Three Pathways — Alternating Editorial Showcase Panels */}
      <section
        id="pathways"
        className="relative bg-[#fdf8f0] px-4 py-8 sm:px-10 sm:py-24 lg:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute right-0 top-24 size-[30rem] rounded-full bg-[#ddb829]/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1200px]">
          <Reveal>
            <div className="flex flex-col justify-between gap-3 border-b border-[#6b0b0b]/12 pb-4 sm:gap-6 sm:pb-8 lg:flex-row lg:items-end lg:pb-12">
              <div className="max-w-2xl">
                <Marker>Three mentoring pathways</Marker>
                <h2 className="mt-2.5 text-balance font-serif text-[1.6rem] leading-[1.08] text-[#292524] sm:mt-6 sm:text-5xl sm:leading-[1.06] lg:text-6xl">
                  Choose the guidance{" "}
                  <span className="text-[#a81414]">your chapter asks for.</span>
                </h2>
              </div>
              <p className="max-w-md text-pretty text-[13px] leading-6 text-[#57534e] sm:text-base sm:leading-8">
                Each pathway offers a distinct depth — from focused Tarot
                mentoring to soul-purpose insight and ongoing alignment.
              </p>
            </div>
          </Reveal>

          <div className="mt-5 space-y-4 sm:mt-16 sm:space-y-20 lg:space-y-24">
            {mentoringAreas.map((area, index) => {
              const imageRight = index % 2 === 1;

              return (
                <Reveal key={area.slug} delay={0.05}>
                  <article
                    id={area.slug}
                    className="group grid items-center gap-3.5 rounded-2xl border border-[#e5dcc6] bg-[#fffdf9] p-3.5 shadow-[0_24px_55px_-40px_rgba(107,11,11,0.4)] transition-colors duration-500 hover:border-[#c9a520] sm:gap-10 sm:rounded-3xl sm:p-8 sm:shadow-[0_32px_70px_-48px_rgba(107,11,11,0.45)] lg:grid-cols-12 lg:gap-12 lg:p-10"
                  >
                    <div
                      className={`relative lg:col-span-5 ${imageRight ? "lg:order-2" : ""
                        }`}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-[#d8c8ae] bg-[#efe5d2] p-1.5 sm:aspect-[3/4] sm:rounded-2xl sm:p-2">
                        <div className="relative h-full w-full overflow-hidden rounded-lg sm:rounded-xl">
                          <Image
                            src={area.image}
                            alt={area.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 42vw"
                            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/30 via-transparent to-transparent" />
                        </div>
                      </div>
                      <span className="absolute left-3.5 top-3.5 rounded-full border border-[#ddb829]/60 bg-[#1c1917]/90 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[#f0d060] backdrop-blur-sm sm:left-5 sm:top-5 sm:px-3.5 sm:py-1 sm:text-[0.68rem] sm:tracking-[0.2em]">
                        Path {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div
                      className={`flex flex-col lg:col-span-7 ${imageRight ? "lg:order-1" : ""
                        }`}
                    >
                      <div className="flex items-center gap-2.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#a8871a] sm:gap-3 sm:text-xs sm:tracking-[0.22em]">
                        <span>Pathway {String(index + 1).padStart(2, "0")}</span>
                        <span
                          aria-hidden="true"
                          className="h-px flex-1 bg-gradient-to-r from-[#ddb829]/55 to-transparent"
                        />
                      </div>

                      <h3 className="mt-1.5 text-balance font-serif text-xl leading-snug text-[#292524] transition-colors duration-300 group-hover:text-[#981313] sm:mt-4 sm:text-4xl sm:leading-tight">
                        {area.title}
                      </h3>

                      <p className="mt-1.5 max-w-2xl text-pretty text-[13px] leading-6 text-[#57534e] sm:mt-4 sm:text-lg sm:leading-8">
                        {area.description}
                      </p>

                      <ul className="mt-3.5 grid grid-cols-2 gap-x-2.5 gap-y-2 border-t border-[#efe5d2] pt-3 sm:mt-6 sm:gap-x-6 sm:gap-y-3.5 sm:pt-6">
                        {area.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-1.5 text-[11.5px] leading-[1.45] text-[#292524] sm:gap-2.5 sm:text-sm sm:leading-6"
                          >
                            <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border border-[#ddb829]/60 bg-[#faf3dc] text-[#8b0f0f] sm:size-5">
                              <Check className="size-2.5 sm:size-3" strokeWidth={2.75} />
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-9 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
                        <Link
                          href={`/mentoring/${area.slug}`}
                          className="inline-flex min-h-10 items-center justify-center gap-1 rounded-full bg-[#b41414] px-2 py-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.04em] text-white shadow-[0_14px_34px_-16px_rgba(180,20,20,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8b0f0f] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a81414] sm:min-h-12 sm:gap-2.5 sm:whitespace-nowrap sm:px-7 sm:py-3 sm:text-xs sm:tracking-[0.14em]"
                        >
                          <span>Explore this path</span>
                          <ArrowRight className="size-3 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:size-4" />
                        </Link>
                        <Link
                          href={`/mentoring/${area.slug}`}
                          className="inline-flex min-h-10 items-center justify-center gap-1 rounded-full border border-[#d8c8ae] px-2 py-2 text-center text-[10px] font-semibold uppercase leading-tight tracking-[0.04em] text-[#6b0b0b] transition-colors hover:border-[#c9a520] hover:bg-[#faf3dc] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8871a] sm:min-h-12 sm:gap-1.5 sm:whitespace-nowrap sm:px-5 sm:py-3 sm:text-xs sm:tracking-[0.14em]"
                        >
                          <span>Reserve session</span>
                          <ArrowUpRight className="size-3 shrink-0 sm:size-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deep Sacred Crimson Sanctuary — Matches About & Services signature section */}
      <section className="relative overflow-hidden bg-[#6b0b0b] px-4 py-8 text-white sm:px-10 sm:py-24 lg:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute -left-28 top-16 size-96 rounded-full bg-[#b41414]/35 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 border border-[#ddb829]/15 sm:inset-8"
        />

        <div className="relative mx-auto grid max-w-[1200px] gap-6 sm:gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
          <Reveal>
            <div>
              <Marker light>How a session unfolds</Marker>
              <h2 className="mt-2.5 max-w-xl text-balance font-serif text-[1.6rem] leading-[1.08] text-white sm:mt-6 sm:text-5xl sm:leading-[1.06] lg:text-6xl">
                Thoughtful structure.{" "}
                <span className="text-[#f0d060]">Unhurried space.</span>
              </h2>
              <p className="mt-2.5 max-w-lg text-pretty text-[13.5px] leading-6 text-[#efe5d2] sm:mt-6 sm:text-lg sm:leading-8">
                Whether you meet in Mumbai, Pune or online, every session is
                held privately — blending intuitive precision with grounded,
                practical conversation.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-10 sm:flex sm:flex-wrap sm:gap-4">
                <Link
                  href="/contact"
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#ddb829] px-2.5 py-2 text-center text-[11px] font-bold leading-tight text-[#3b2118] transition hover:-translate-y-0.5 hover:bg-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:min-h-13 sm:gap-2 sm:whitespace-nowrap sm:px-7 sm:py-3 sm:text-sm"
                >
                  <span>Begin a conversation</span>
                  <ArrowRight className="size-3 shrink-0 sm:size-4" />
                </Link>
                <Link
                  href={brand.whatsappHref}
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#f0d060]/55 px-2.5 py-2 text-center text-[11px] font-semibold leading-tight text-white transition hover:border-[#f0d060] hover:text-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:min-h-13 sm:whitespace-nowrap sm:px-7 sm:py-3 sm:text-sm"
                >
                  Message on WhatsApp
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="border-t border-[#ddb829]/35">
            {sessionFlow.map((step, index) => (
              <Reveal delay={index * 0.06} key={step.numeral}>
                <div className="grid grid-cols-[1.85rem_1fr] gap-2.5 border-b border-[#ddb829]/35 py-3.5 sm:grid-cols-[3.5rem_1fr] sm:gap-6 sm:py-8">
                  <span className="font-serif text-xl text-[#f0d060] sm:text-4xl">
                    {step.numeral}
                  </span>
                  <div>
                    <h3 className="font-serif text-[1.05rem] leading-snug text-white sm:text-2xl sm:leading-tight">
                      {step.title}
                    </h3>
                    <p className="mt-1 max-w-xl text-xs leading-5 text-[#efe5d2] sm:mt-2 sm:text-base sm:leading-7">
                      {step.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Obsidian Closing Card — Mirrors Services' Signature Feature Panel */}
      <section className="bg-[#f8f3e9] px-4 py-8 sm:px-10 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] overflow-hidden rounded-2xl border border-[#ddb829]/25 bg-[#1c1917] text-white shadow-[0_38px_80px_-42px_rgba(28,25,23,0.65)] lg:grid-cols-[0.88fr_1.12fr]">
          <div className="relative min-h-[175px] sm:min-h-[360px] lg:min-h-[500px]">
            <Image
              src="/images/page-heroes/mentoring-hero.webp"
              alt="A warm private mentoring table with handwritten journal, tea cup and Tarot card"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/65 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#1c1917]/40" />
            <span className="absolute bottom-3 left-3 rounded-full bg-[#ddb829] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#292524] sm:bottom-6 sm:left-6 sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.16em]">
              Mumbai · Pune · Online
            </span>
          </div>

          <div className="flex items-center p-4 sm:p-12 lg:p-16">
            <Reveal>
              <Marker light>Your next step</Marker>
              <h2 className="mt-2.5 text-balance font-serif text-[1.5rem] leading-[1.1] text-white sm:mt-4 sm:text-4xl sm:leading-[1.08] lg:text-5xl">
                Not sure which pathway fits best?{" "}
                <span className="text-[#f0d060]">Let us help you choose.</span>
              </h2>
              <p className="mt-2.5 max-w-xl text-pretty text-[13px] leading-6 text-[#d6cfc2] sm:mt-6 sm:text-lg sm:leading-8">
                Share a brief note about what you are navigating. Manisha&apos;s
                team will recommend the right mentoring session and coordinate a
                comfortable time window.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-9 sm:gap-4">
                <Link
                  href="/contact"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[#ddb829] px-4 py-2 text-xs font-semibold text-[#292524] transition hover:-translate-y-0.5 hover:bg-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:min-h-12 sm:gap-3 sm:px-7 sm:py-3 sm:text-sm"
                >
                  Find your mentoring path <ArrowRight className="size-3.5 sm:size-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#d6cfc2]/35 px-4 py-2 text-xs font-semibold text-[#efe5d2] transition hover:border-[#ddb829] hover:text-[#f0d060] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ddb829] sm:min-h-12 sm:px-6 sm:py-3 sm:text-sm"
                >
                  View all services
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
