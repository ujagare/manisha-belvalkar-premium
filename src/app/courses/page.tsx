import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import CourseCatalogExplorer from "@/components/courses/CourseCatalogExplorer";
import GsapReveal from "@/components/ui/GsapReveal";
import Reveal from "@/components/ui/Reveal";
import { brand, courses } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tarot & Chakra Courses, Mumbai & Pune",
  description:
    "Learn Tarot reading, chakra therapy and Goddess attunement with Dr. Manisha Belvalkar. One-to-one courses, group workshops and online sessions.",
  alternates: { canonical: "/courses" },
};

const heroSummary =
  "Structured pathways in Tarot, chakra work, Shri Vidya and Goddess sadhana. Taught live online, through guided WhatsApp study, or in personal sessions.";

const teachingPrinciples = [
  {
    number: "01",
    title: "Lineage before shortcuts",
    text: "Every course is rooted in three decades of lived practice rather than rushed weekend certificates or scripted spreads.",
  },
  {
    number: "02",
    title: "Paced for real life",
    text: "Whether you join live online classes, a two-year Shri Vidya immersion, or daily WhatsApp voice notes, the rhythm leaves space for assimilation.",
  },
  {
    number: "03",
    title: "Ethical, grounded guidance",
    text: "Students learn to read and hold space with clarity, discernment and responsibility without fear-based language.",
  },
  {
    number: "04",
    title: "Continuity after each class",
    text: "Workbooks, guided reflections, and direct support keep your practice steady between sessions instead of fading after enrollment.",
  },
];

const trackGuide = [
  {
    numeral: "i.",
    title: "Starting from curiosity or self-clarity",
    text: "Begin with the Soul Purpose Reading or Aishwarya Siddhi Course if you want an immediate, personal entry point without a multi-year commitment.",
  },
  {
    numeral: "ii.",
    title: "Building an ethical Tarot or healing practice",
    text: "Choose Become a Professional Tarot Reader (Basic and Advanced) or the Advanced Chakra Course for structured practitioner training.",
  },
  {
    numeral: "iii.",
    title: "Committing to deep personal or spiritual immersion",
    text: "Explore Personalized Well-being for private 1-on-1 transformation, or Shri Vidya for dedicated two-year yantra and mantra study.",
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

export default function CoursesPage() {
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
                <SectionMarker>Sacred learning &amp; lineage</SectionMarker>
              </GsapReveal>

              <GsapReveal y={24} delay={0.07} instant>
                <h1 className="mt-4 max-w-2xl text-balance font-serif text-[2.25rem] leading-[1.03] tracking-[-0.03em] text-[#292524] sm:mt-6 sm:text-[clamp(3.1rem,5.6vw,4.9rem)] sm:leading-[0.98]">
                  Study the craft.
                  <span className="block text-[#a81414]">
                    Deepen the practice.
                  </span>
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
                    href="#catalog"
                    className="group inline-flex min-h-12 items-center justify-between gap-4 whitespace-nowrap rounded-full bg-[#b41414] py-2.5 pl-6 pr-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_-18px_rgba(180,20,20,0.85)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#8b0f0f] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a81414] sm:min-h-13 sm:pl-7 sm:pr-3"
                  >
                    <span>Explore pathways</span>
                    <span className="grid size-8 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                      <ArrowUpRight className="size-4" strokeWidth={1.6} />
                    </span>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#a8871a]/65 bg-transparent px-6 py-3 text-sm font-semibold text-[#292524] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-[#a8871a] hover:bg-[#ddb829] hover:text-[#1c1917] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8871a] sm:min-h-13 sm:px-7"
                  >
                    Ask before enrolling
                  </Link>
                </div>
              </GsapReveal>

              <GsapReveal y={16} delay={0.24} instant>
                <dl className="mt-8 grid gap-4 border-t border-[#6b0b0b]/12 pt-5 sm:mt-11 sm:grid-cols-3 sm:gap-5 sm:pt-7">
                  {[
                    ["6 pathways", "Tarot, Shakti & Chakras"],
                    ["Live & 1-on-1", "Zoom, WhatsApp & study"],
                    ["30+ years", "PhD in Tarot Reading"],
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

          {/* Double-Bezel Arch Showcase + Obsidian Quote Plinth */}
          <Reveal direction="left" delay={0.1}>
            <div className="relative mx-auto w-full max-w-[380px] sm:max-w-[470px]">
              <div className="rounded-t-[999px] rounded-b-[2rem] bg-[#efe5d2]/85 p-2 ring-1 ring-[#c7a23b]/45 shadow-[0_36px_80px_-42px_rgba(107,11,11,0.5)]">
                <div className="relative aspect-[4/3.8] overflow-hidden rounded-t-[999px] rounded-b-[1.5rem] bg-[#1c1917] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] sm:aspect-[4/4.2]">
                  <Image
                    src="/images/page-heroes/courses-hero.webp"
                    alt="Handcrafted study books, brass oil lamp and learning cards in warm light"
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 470px"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241612]/35 via-transparent to-transparent" />
                </div>
              </div>

              <div className="relative z-20 mx-2 -mt-8 rounded-2xl border-t-2 border-[#ddb829] bg-[#1c1917] p-5 text-white shadow-[0_28px_60px_-24px_rgba(28,25,23,0.72)] sm:-ml-8 sm:mr-14 sm:-mt-16 sm:p-7">
                <p className="font-serif text-lg leading-snug text-[#fdf8f0] sm:text-[1.4rem]">
                  “Spiritual study is not memorizing meanings. It is training
                  your attention until clarity becomes second nature.”
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
          <blockquote className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center font-serif text-2xl leading-tight text-[#6b0b0b] sm:text-3xl lg:flex-row lg:justify-center lg:gap-8 lg:text-[2.45rem]">
            <span
              aria-hidden="true"
              className="h-px w-16 shrink-0 bg-[#a8871a]/60"
            />
            <span className="text-balance">
              Good teaching gives you tools.{" "}
              <span className="text-[#a8871a]">
                True mentorship builds your own steadiness.
              </span>
            </span>
            <span
              aria-hidden="true"
              className="h-px w-16 shrink-0 bg-[#a8871a]/60"
            />
          </blockquote>
        </GsapReveal>
      </section>

      {/* 3. Asymmetric Double-Bezel Course Catalog + Interactive Filter & Syllabus Preview */}
      <section
        id="catalog"
        className="relative bg-[#fdf8f0] px-4 py-16 sm:px-10 sm:py-24 lg:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-28 size-[28rem] rounded-full bg-[#ddb829]/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1200px]">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-balance font-serif text-[1.95rem] leading-[1.06] text-[#292524] sm:text-5xl lg:text-6xl">
                Six pathways to{" "}
                <span className="text-[#a81414]">learn and deepen.</span>
              </h2>
              <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-[#57534e] sm:mt-5 sm:text-lg sm:leading-8">
                Filter by format or browse all courses below. Courses with
                recorded modules include an interactive syllabus preview and free
                opening lesson.
              </p>
            </div>
          </Reveal>

          <CourseCatalogExplorer courses={courses} />
        </div>
      </section>

      {/* 4. Asymmetric Sticky Editorial Index — How Each Course Is Held */}
      <section className="bg-[#f8f3e9] px-4 py-16 sm:px-10 sm:py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1200px] items-start gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <h2 className="text-balance font-serif text-[1.95rem] leading-[1.06] text-[#292524] sm:text-5xl">
                How every course{" "}
                <span className="text-[#a81414]">is held.</span>
              </h2>
              <p className="mt-5 max-w-lg text-pretty text-base leading-7 text-[#57534e] sm:mt-6 sm:text-lg sm:leading-8">
                Each curriculum is designed around steady absorption rather than
                information overload, giving you room to practise, ask
                questions and integrate what you learn.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-[#6b0b0b]/15">
            {teachingPrinciples.map((item, index) => (
              <Reveal delay={index * 0.06} key={item.number}>
                <div className="grid gap-3 border-b border-[#6b0b0b]/15 py-6 sm:grid-cols-[3.25rem_1fr] sm:gap-7 sm:py-8">
                  <span className="font-serif text-xl tabular-nums text-[#a8871a] sm:pt-0.5 sm:text-2xl">
                    {item.number}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl leading-snug text-[#292524] sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#57534e] sm:text-base sm:leading-7">
                      {item.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Deep Sacred Crimson Sanctuary — Choosing Your Track */}
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
              <SectionMarker light>Choosing your track</SectionMarker>
              <h2 className="mt-4 max-w-xl text-balance font-serif text-[1.9rem] leading-[1.06] text-white sm:mt-6 sm:text-5xl lg:text-6xl">
                Not sure which path{" "}
                <span className="text-[#f0d060]">fits your stage?</span>
              </h2>
              <p className="mt-4 max-w-lg text-pretty text-base leading-7 text-[#efe5d2] sm:mt-6 sm:text-lg sm:leading-8">
                Share your background and what drew you to study. Manisha&apos;s
                team will help match your pace and readiness to the right
                cohort or private format.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-[#ddb829] px-6 py-3 text-sm font-bold text-[#1c1917] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:min-h-13 sm:px-7"
                >
                  Ask before enrolling <ArrowRight className="size-4" />
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
            {trackGuide.map((step, index) => (
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

      {/* 6. Obsidian Double-Bezel Closing Card — Mentor Portrait & Direct Access */}
      <section className="bg-[#f8f3e9] px-4 py-14 sm:px-10 sm:py-20 lg:py-28">
        <div className="mx-auto rounded-[2rem] bg-[#1c1917] p-2 ring-1 ring-[#ddb829]/30 shadow-[0_38px_80px_-42px_rgba(28,25,23,0.65)] max-w-[1200px]">
          <div className="grid overflow-hidden rounded-[calc(2rem-0.5rem)] bg-[#221d1a] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] lg:grid-cols-[0.88fr_1.12fr]">
            <div className="relative min-h-[280px] sm:min-h-[380px] lg:min-h-[500px]">
              <Image
                src="/images/manisha/manisha-courses-mentor.webp"
                alt="Dr. Manisha Belvalkar — Spiritual Mentor and Tarot Teacher"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-[50%_20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/75 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#221d1a]/55" />
              <span className="absolute bottom-4 left-4 rounded-full bg-[#ddb829] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#1c1917] sm:bottom-6 sm:left-6 sm:px-5 sm:py-2">
                Mumbai · Pune · Live Online
              </span>
            </div>

            <div className="flex items-center p-6 sm:p-12 lg:p-16">
              <Reveal>
                <h2 className="text-balance font-serif text-[1.85rem] leading-[1.08] text-white sm:text-4xl lg:text-5xl">
                  Ready to step into{" "}
                  <span className="text-[#f0d060]">structured study?</span>
                </h2>
                <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-[#d6cfc2] sm:mt-6 sm:text-lg sm:leading-8">
                  Already enrolled in a course with recorded lessons, or looking
                  for a single private session first? Open your library or ask
                  our team for upcoming cohort dates.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
                  <Link
                    href="/contact"
                    className="group inline-flex min-h-12 items-center justify-center gap-3 whitespace-nowrap rounded-full bg-[#ddb829] py-2 pl-6 pr-2 text-sm font-semibold text-[#1c1917] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060]"
                  >
                    <span>Ask before enrolling</span>
                    <span className="grid size-8 place-items-center rounded-full bg-[#1c1917]/12 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105">
                      <ArrowUpRight className="size-4" strokeWidth={1.6} />
                    </span>
                  </Link>
                  <Link
                    href="/account/courses"
                    className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#d6cfc2]/35 px-6 py-3 text-sm font-semibold text-[#efe5d2] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[#ddb829] hover:text-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ddb829]"
                  >
                    My learning library
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
