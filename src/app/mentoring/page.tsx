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

function Ornament() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex items-center gap-3 text-[#ddb829]"
    >
      <span className="h-px w-10 bg-current" />
      <Sparkles className="size-4 stroke-[1.4]" />
      <span className="h-px w-10 bg-current" />
    </span>
  );
}

export default function MentoringPage() {
  return (
    <div className="overflow-hidden bg-[#fdf8f0] text-[#292524]">
      {/* Editorial Split Hero — matches Services & About palette and Lora hierarchy */}
      <section className="relative isolate bg-[#fdf8f0] px-4 pb-12 pt-20 sm:px-10 sm:pb-24 sm:pt-24 lg:pb-28 lg:pt-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-12 size-[32rem] rounded-full bg-[#ddb829]/12 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-36 bottom-0 size-[26rem] rounded-full bg-[#b41414]/6 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-[1200px] items-center gap-10 sm:gap-14 lg:grid-cols-[1.06fr_0.94fr] lg:gap-20">
          <div className="relative z-20">
            <div className="max-w-2xl">
              <GsapReveal y={20} instant>
                <Marker>Private spiritual mentoring</Marker>
              </GsapReveal>

              <GsapReveal y={26} delay={0.08} instant>
                <h1 className="mt-4 max-w-2xl text-balance font-serif text-[2.25rem] leading-[1.03] tracking-[-0.03em] text-[#292524] sm:mt-7 sm:text-[clamp(3.15rem,6vw,5.15rem)] sm:leading-[0.96]">
                  Guidance for your
                  <span className="block text-[#a81414]">next chapter.</span>
                </h1>
              </GsapReveal>

              <GsapReveal y={20} delay={0.14} instant>
                <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-[#57534e] sm:mt-7 sm:text-lg sm:leading-8">
                  {heroIntro}
                </p>
              </GsapReveal>

              <GsapReveal y={20} delay={0.2} instant>
                <div className="mt-6 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center">
                  <Link
                    href="#pathways"
                    className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#b41414] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_18px_45px_-18px_rgba(180,20,20,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8b0f0f] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a81414] sm:min-h-14 sm:px-8 sm:py-4"
                  >
                    Explore mentoring paths <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#a8871a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#292524] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ddb829] hover:text-[#1c1917] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8871a] sm:min-h-14 sm:px-8 sm:py-4"
                  >
                    Book a session
                  </Link>
                </div>
              </GsapReveal>

              <GsapReveal y={18} delay={0.26} instant>
                <dl className="mt-8 grid gap-4 border-t border-[#6b0b0b]/12 pt-5 sm:mt-12 sm:grid-cols-3 sm:gap-5 sm:pt-7">
                  {[
                    ["30+ years of practice", "PhD in Tarot Reading"],
                    ["Private & confidential", "1-on-1 personal sessions"],
                    ["Mumbai, Pune & online", "Join from anywhere"],
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

          <Reveal direction="left" delay={0.12}>
            <div className="relative mx-auto w-full max-w-[360px] px-2 pt-2 sm:max-w-[470px] sm:px-3 sm:pt-3">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-t-[999px] rounded-b-[1.5rem] border border-[#c7a23b]"
              />
              <div className="relative aspect-[3/3.6] overflow-hidden rounded-t-[999px] rounded-b-[1rem] shadow-[0_45px_85px_-45px_rgba(107,11,11,0.65)] sm:aspect-[3/4.15]">
                <Image
                  src="/images/manisha/manisha-mentoring-portrait.webp"
                  alt="Dr. Manisha Belvalkar — Spiritual Mentor and Tarot Guide"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 470px"
                  className="object-cover object-[50%_18%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#351b16]/35 via-transparent to-transparent" />
              </div>
              <div className="relative z-20 mx-2 -mt-10 border-t-2 border-[#ddb829] bg-[#1c1917] p-4 text-white shadow-[0_28px_60px_-25px_rgba(28,25,23,0.72)] sm:-ml-10 sm:mr-16 sm:-mt-20 sm:p-7">
                <p className="font-serif text-lg leading-snug text-[#fdf8f0] sm:text-2xl">
                  “Mentoring is a sacred pause: a space to listen deeply, see
                  clearly, and choose with courage.”
                </p>
                <p className="mt-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#f0d060] sm:mt-3">
                  {brand.name}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Parchment Manifesto Strip */}
      <section className="border-y border-[#6b0b0b]/10 bg-[#efe5d2] px-4 py-10 sm:px-10 sm:py-14 lg:py-20">
        <GsapReveal y={18}>
          <blockquote className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center font-serif text-2xl leading-tight text-[#6b0b0b] sm:gap-6 sm:text-4xl lg:flex-row lg:justify-center lg:text-[2.65rem]">
            <Ornament />
            <span className="text-balance">
              Tarot is not fortune-telling.{" "}
              <span className="text-[#a8871a]">
                It is a mirror for your own clarity.
              </span>
            </span>
            <Ornament />
          </blockquote>
        </GsapReveal>
      </section>

      {/* Why Mentoring — Asymmetric Editorial Contrast */}
      <section className="bg-[#f8f3e9] px-4 py-14 sm:px-10 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <Marker>Beyond a single answer</Marker>
              <h2 className="mt-4 text-balance font-serif text-[1.9rem] leading-[1.06] text-[#292524] sm:mt-6 sm:text-5xl">
                When a reading opens the door,{" "}
                <span className="text-[#a81414]">
                  mentoring helps you walk through it.
                </span>
              </h2>
              <p className="mt-4 max-w-lg text-pretty text-base leading-7 text-[#57534e] sm:mt-6 sm:text-lg sm:leading-8">
                {mentoringIntro}
              </p>
            </div>
          </Reveal>

          <div className="border-t border-[#6b0b0b]/15">
            {moments.map((moment, index) => (
              <Reveal delay={index * 0.06} key={moment.number}>
                <div className="grid gap-3 border-b border-[#6b0b0b]/15 py-6 sm:grid-cols-[auto_1fr] sm:gap-7 sm:py-8">
                  <span className="font-serif text-xl tabular-nums text-[#a8871a] sm:pt-1 sm:text-2xl">
                    {moment.number}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl leading-snug text-[#292524] sm:text-2xl">
                      {moment.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#57534e] sm:text-base sm:leading-7">
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
        className="relative bg-[#fdf8f0] px-4 py-14 sm:px-10 sm:py-24 lg:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-24 size-[30rem] rounded-full bg-[#ddb829]/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1200px]">
          <Reveal>
            <div className="flex flex-col justify-between gap-6 border-b border-[#6b0b0b]/12 pb-8 lg:flex-row lg:items-end lg:pb-12">
              <div className="max-w-2xl">
                <Marker>Three mentoring pathways</Marker>
                <h2 className="mt-4 text-balance font-serif text-[1.9rem] leading-[1.06] text-[#292524] sm:mt-6 sm:text-5xl lg:text-6xl">
                  Choose the guidance{" "}
                  <span className="text-[#a81414]">your chapter asks for.</span>
                </h2>
              </div>
              <p className="max-w-md text-pretty text-sm leading-7 text-[#57534e] sm:text-base sm:leading-8">
                Each pathway offers a distinct depth — from focused Tarot
                mentoring to soul-purpose insight and ongoing alignment.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 space-y-12 sm:mt-16 sm:space-y-20 lg:space-y-24">
            {mentoringAreas.map((area, index) => {
              const imageRight = index % 2 === 1;

              return (
                <Reveal key={area.slug} delay={0.05}>
                  <article
                    id={area.slug}
                    className="group grid items-center gap-7 rounded-2xl border border-[#e5dcc6] bg-[#fffdf9] p-4 shadow-[0_32px_70px_-48px_rgba(107,11,11,0.45)] transition-colors duration-500 hover:border-[#c9a520] sm:gap-10 sm:rounded-3xl sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-10"
                  >
                    <div
                      className={`relative lg:col-span-5 ${
                        imageRight ? "lg:order-2" : ""
                      }`}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[#d8c8ae] bg-[#efe5d2] p-2 sm:rounded-2xl">
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
                      <span className="absolute left-5 top-5 rounded-full border border-[#ddb829]/60 bg-[#1c1917]/90 px-3.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#f0d060] backdrop-blur-sm">
                        Path {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div
                      className={`flex flex-col lg:col-span-7 ${
                        imageRight ? "lg:order-1" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#a8871a]">
                        <span>Pathway {String(index + 1).padStart(2, "0")}</span>
                        <span
                          aria-hidden="true"
                          className="h-px flex-1 bg-gradient-to-r from-[#ddb829]/55 to-transparent"
                        />
                      </div>

                      <h3 className="mt-3 text-balance font-serif text-2xl leading-tight text-[#292524] transition-colors duration-300 group-hover:text-[#981313] sm:mt-4 sm:text-4xl">
                        {area.title}
                      </h3>

                      <p className="mt-3 max-w-2xl text-pretty text-base leading-7 text-[#57534e] sm:mt-4 sm:text-lg sm:leading-8">
                        {area.description}
                      </p>

                      <ul className="mt-6 grid gap-3 border-t border-[#efe5d2] pt-5 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3.5 sm:pt-6">
                        {area.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 text-sm leading-6 text-[#292524]"
                          >
                            <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-[#ddb829]/60 bg-[#faf3dc] text-[#8b0f0f]">
                              <Check className="size-3" strokeWidth={2.75} />
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
                        <Link
                          href={`/mentoring/${area.slug}`}
                          className="inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[#b41414] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_14px_34px_-16px_rgba(180,20,20,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#8b0f0f] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a81414] sm:min-h-12 sm:px-7"
                        >
                          Explore this path
                          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <Link
                          href={`/mentoring/${area.slug}`}
                          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#d8c8ae] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#6b0b0b] transition-colors hover:border-[#c9a520] hover:bg-[#faf3dc] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8871a] sm:min-h-12"
                        >
                          Reserve session <ArrowUpRight className="size-3.5" />
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
      <section className="relative overflow-hidden bg-[#6b0b0b] px-4 py-14 text-white sm:px-10 sm:py-24 lg:py-32">
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
              <Marker light>How a session unfolds</Marker>
              <h2 className="mt-4 max-w-xl text-balance font-serif text-[1.9rem] leading-[1.06] text-white sm:mt-6 sm:text-5xl lg:text-6xl">
                Thoughtful structure.{" "}
                <span className="text-[#f0d060]">Unhurried space.</span>
              </h2>
              <p className="mt-4 max-w-lg text-pretty text-base leading-7 text-[#efe5d2] sm:mt-6 sm:text-lg sm:leading-8">
                Whether you meet in Mumbai, Pune or online, every session is
                held privately — blending intuitive precision with grounded,
                practical conversation.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#ddb829] px-6 py-3 text-sm font-bold text-[#3b2118] transition hover:-translate-y-0.5 hover:bg-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:min-h-13 sm:px-7"
                >
                  Begin a conversation <ArrowRight className="size-4" />
                </Link>
                <Link
                  href={brand.whatsappHref}
                  className="inline-flex min-h-11 items-center rounded-full border border-[#f0d060]/55 px-6 py-3 text-sm font-semibold text-white transition hover:border-[#f0d060] hover:text-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:min-h-13 sm:px-7"
                >
                  Message on WhatsApp
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="border-t border-[#ddb829]/35">
            {sessionFlow.map((step, index) => (
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

      {/* Obsidian Closing Card — Mirrors Services' Signature Feature Panel */}
      <section className="bg-[#f8f3e9] px-4 py-14 sm:px-10 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] overflow-hidden rounded-2xl border border-[#ddb829]/25 bg-[#1c1917] text-white shadow-[0_38px_80px_-42px_rgba(28,25,23,0.65)] lg:grid-cols-[0.88fr_1.12fr]">
          <div className="relative min-h-[260px] sm:min-h-[360px] lg:min-h-[500px]">
            <Image
              src="/images/page-heroes/mentoring-hero.webp"
              alt="A warm private mentoring table with handwritten journal, tea cup and Tarot card"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/65 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#1c1917]/40" />
            <span className="absolute bottom-4 left-4 rounded-full bg-[#ddb829] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#292524] sm:bottom-6 sm:left-6 sm:px-5 sm:py-2">
              Mumbai · Pune · Online
            </span>
          </div>

          <div className="flex items-center p-6 sm:p-12 lg:p-16">
            <Reveal>
              <Marker light>Your next step</Marker>
              <h2 className="mt-4 text-balance font-serif text-[1.85rem] leading-[1.08] text-white sm:text-4xl lg:text-5xl">
                Not sure which pathway fits best?{" "}
                <span className="text-[#f0d060]">Let us help you choose.</span>
              </h2>
              <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-[#d6cfc2] sm:mt-6 sm:text-lg sm:leading-8">
                Share a brief note about what you are navigating. Manisha&apos;s
                team will recommend the right mentoring session and coordinate a
                comfortable time window.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#ddb829] px-6 py-3 text-sm font-semibold text-[#292524] transition hover:-translate-y-0.5 hover:bg-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:px-7"
                >
                  Find your mentoring path <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#d6cfc2]/35 px-6 py-3 text-sm font-semibold text-[#efe5d2] transition hover:border-[#ddb829] hover:text-[#f0d060] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ddb829]"
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
