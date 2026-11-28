import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import CourseCatalogExplorer from "@/components/courses/CourseCatalogExplorer";
import GsapReveal from "@/components/ui/GsapReveal";
import Reveal from "@/components/ui/Reveal";
import { brand } from "@/lib/data";
import { getCourses } from "@/lib/supabase/courses";

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

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <div className="overflow-x-clip bg-[#fdf8f0] text-[#292524]">
      {/* 1. Editorial Split Hero — fits initial viewport cleanly */}
      <section className="relative isolate bg-[#fdf8f0] px-4 pb-7 pt-20 sm:px-10 sm:pb-20 sm:pt-24 lg:min-h-[calc(100dvh-1rem)] lg:pb-24 lg:pt-24">
        <div
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute -right-28 top-12 size-[30rem] rounded-full bg-[#ddb829]/12 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute -left-36 bottom-4 size-[24rem] rounded-full bg-[#b41414]/6 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-[1200px] items-center gap-5 sm:gap-14 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
          <div className="relative z-20">
            <div className="max-w-2xl">
              <GsapReveal y={18} instant>
                <SectionMarker>Sacred learning &amp; lineage</SectionMarker>
              </GsapReveal>

              <GsapReveal y={24} delay={0.07} instant>
                <h1 className="mt-2.5 max-w-2xl text-balance font-serif text-[1.85rem] leading-[1.06] tracking-[-0.03em] text-[#292524] sm:mt-6 sm:text-[clamp(3.1rem,5.6vw,4.9rem)] sm:leading-[0.98]">
                  Study the craft.
                  <span className="block text-[#a81414]">
                    Deepen the practice.
                  </span>
                </h1>
              </GsapReveal>

              <GsapReveal y={18} delay={0.13} instant>
                <p className="mt-2.5 max-w-xl text-pretty text-[13.5px] leading-6 text-[#57534e] sm:mt-6 sm:text-lg sm:leading-8">
                  {heroSummary}
                </p>
              </GsapReveal>

              <GsapReveal y={18} delay={0.18} instant>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-9 sm:flex sm:flex-row sm:items-center sm:gap-3">
                  <Link
                    href="#catalog"
                    className="group inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#b41414] px-2.5 py-2 text-center text-[11.5px] font-semibold leading-tight text-white transition-colors duration-200 hover:bg-[#8b0f0f] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a81414] sm:min-h-13 sm:justify-between sm:gap-4 sm:whitespace-nowrap sm:pl-7 sm:pr-3 sm:text-sm"
                  >
                    <span>Explore courses</span>
                    <span className="hidden size-8 place-items-center rounded-full bg-white/15 sm:grid">
                      <ArrowUpRight className="size-4" strokeWidth={1.6} />
                    </span>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-[#a8871a]/65 bg-transparent px-2.5 py-2 text-center text-[11.5px] font-semibold leading-tight text-[#292524] transition-colors duration-200 hover:border-[#a8871a] hover:bg-[#ddb829] hover:text-[#1c1917] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8871a] sm:min-h-13 sm:whitespace-nowrap sm:px-7 sm:text-sm"
                  >
                    Ask before enrolling
                  </Link>
                </div>
              </GsapReveal>

              <GsapReveal y={16} delay={0.24} instant>
                <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-[#6b0b0b]/12 pt-3.5 sm:mt-11 sm:gap-5 sm:pt-7">
                  {[
                    ["6 pathways", "Tarot & Shakti"],
                    ["Live & 1:1", "Online & study"],
                    ["30+ years", "PhD in Tarot"],
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

          {/* Double-Bezel Arch Showcase + Obsidian Quote Plinth */}
          <Reveal direction="left" delay={0.1}>
            <div className="relative mx-auto w-full max-w-[248px] sm:max-w-[470px]">
              <div className="rounded-t-[999px] rounded-b-[1.5rem] bg-[#efe5d2]/85 p-1.5 ring-1 ring-[#c7a23b]/45 sm:rounded-b-[2rem] sm:p-2">
                <div className="relative aspect-[4/3.5] overflow-hidden rounded-t-[999px] rounded-b-[1.25rem] bg-[#1c1917] sm:aspect-[4/4.2] sm:rounded-b-[1.5rem]">
                  <Image
                    src="/images/manisha/manisha-courses-hero.webp"
                    alt="Dr. Manisha Belvalkar — Spiritual Mentor and Tarot Teacher"
                    fill
                    priority
                    sizes="(max-width: 1024px) 248px, 470px"
                    className="object-cover object-[50%_16%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241612]/35 via-transparent to-transparent" />
                </div>
              </div>

              <div className="relative z-20 mx-1 -mt-6 rounded-xl border-t-2 border-[#ddb829] bg-[#1c1917] p-3 text-white shadow-[0_20px_45px_-22px_rgba(28,25,23,0.65)] sm:-ml-8 sm:mr-14 sm:-mt-16 sm:rounded-2xl sm:p-7">
                <p className="font-serif text-[13px] leading-snug text-[#fdf8f0] sm:text-[1.4rem]">
                  “Spiritual study is not memorizing meanings. It is training
                  your attention until clarity becomes second nature.”
                </p>
                <p className="mt-1.5 text-[10px] font-semibold tracking-[0.14em] text-[#f0d060] sm:mt-3 sm:text-xs">
                  {brand.name}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Parchment Manifesto Strip */}
      <section className="border-y border-[#6b0b0b]/10 bg-[#efe5d2] px-4 py-5 sm:px-10 sm:py-16 lg:py-20">
        <GsapReveal y={18}>
          <blockquote className="mx-auto flex max-w-4xl flex-col items-center gap-2 text-center font-serif text-[1.08rem] leading-snug text-[#6b0b0b] sm:gap-5 sm:text-3xl lg:flex-row lg:justify-center lg:gap-8 lg:text-[2.45rem]">
            <span
              aria-hidden="true"
              className="h-px w-14 shrink-0 bg-[#a8871a]/60 sm:w-16"
            />
            <span className="text-balance">
              Good teaching gives you tools.{" "}
              <span className="text-[#a8871a]">
                True mentorship builds your own steadiness.
              </span>
            </span>
            <span
              aria-hidden="true"
              className="h-px w-14 shrink-0 bg-[#a8871a]/60 sm:w-16"
            />
          </blockquote>
        </GsapReveal>
      </section>

      {/* 3. Asymmetric Double-Bezel Course Catalog + Interactive Filter & Syllabus Preview */}
      <section
        id="catalog"
        className="relative bg-[#fdf8f0] px-4 py-8 sm:px-10 sm:py-24 lg:py-32"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute right-0 top-28 size-[28rem] rounded-full bg-[#ddb829]/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-[1200px]">
          <Reveal>
            <div className="max-w-2xl">
              <h2 className="text-balance font-serif text-[1.6rem] leading-[1.08] text-[#292524] sm:text-5xl sm:leading-[1.06] lg:text-6xl">
                Six pathways to{" "}
                <span className="text-[#a81414]">learn and deepen.</span>
              </h2>
              <p className="mt-2.5 max-w-xl text-pretty text-[13px] leading-6 text-[#57534e] sm:mt-5 sm:text-lg sm:leading-8">
                Filter by format or browse all courses below. Courses with
                recorded modules include an interactive syllabus preview and free
                opening lesson.
              </p>
            </div>
          </Reveal>

          <CourseCatalogExplorer courses={courses} />
        </div>
      </section>

      {/* 4. Asymmetric Editorial Cards — How Each Course Is Held */}
      <section className="bg-[#f8f3e9] px-4 py-7 sm:px-10 sm:py-16 lg:py-16">
        <div className="mx-auto grid max-w-[1200px] items-start gap-4 sm:gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-12">
          <Reveal>
            <div>
              <h2 className="text-balance font-serif text-[1.6rem] leading-[1.08] text-[#292524] sm:text-4xl sm:leading-[1.06] lg:text-[2.65rem]">
                How every course{" "}
                <span className="text-[#a81414]">is held.</span>
              </h2>
              <p className="mt-2 max-w-md text-pretty text-[13px] leading-5.5 text-[#57534e] sm:mt-4 sm:text-base sm:leading-7 lg:mt-3.5 lg:text-[15px] lg:leading-7">
                Each curriculum is designed around steady absorption rather than
                information overload, giving you room to practise, ask
                questions and integrate what you learn.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            {teachingPrinciples.map((item, index) => (
              <Reveal delay={index * 0.06} key={item.number} className="h-full">
                <article className="flex h-full flex-col rounded-xl border border-[#e5dcc6] bg-[#fffdf9] p-3 shadow-[0_14px_34px_-26px_rgba(107,11,11,0.35)] transition-colors duration-300 hover:border-[#c9a520] sm:rounded-2xl sm:p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-full bg-[#faf3dc] px-2 py-0.5 font-serif text-[11px] font-semibold tabular-nums text-[#8b0f0f] ring-1 ring-[#ddb829]/45 sm:px-2.5 sm:text-xs">
                      {item.number}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-gradient-to-r from-[#ddb829]/45 to-transparent"
                    />
                  </div>
                  <h3 className="mt-2 font-serif text-[13.5px] leading-snug text-[#292524] sm:mt-3 sm:text-lg lg:text-[1.12rem]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[11px] leading-[1.45] text-[#57534e] sm:mt-1.5 sm:text-[13.5px] sm:leading-[1.55]">
                    {item.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Deep Sacred Crimson Sanctuary — Choosing Your Track */}
      <section className="relative overflow-hidden bg-[#6b0b0b] px-4 py-8 text-white sm:px-10 sm:py-16 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none hidden sm:block absolute -left-28 top-16 size-96 rounded-full bg-[#b41414]/35 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 border border-[#ddb829]/15 sm:inset-5"
        />

        <div className="relative mx-auto grid max-w-[1200px] gap-5 sm:gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-12">
          <Reveal>
            <div>
              <SectionMarker light>Choosing your track</SectionMarker>
              <h2 className="mt-2.5 max-w-xl text-balance font-serif text-[1.6rem] leading-[1.08] text-white sm:mt-4 sm:text-4xl sm:leading-[1.06] lg:text-[2.65rem]">
                Not sure which path{" "}
                <span className="text-[#f0d060]">fits your stage?</span>
              </h2>
              <p className="mt-2.5 max-w-lg text-pretty text-[13.5px] leading-6 text-[#efe5d2] sm:mt-4 sm:text-base sm:leading-7 lg:text-[15px] lg:leading-7">
                Share your background and what drew you to study. Manisha&apos;s
                team will help match your pace and readiness to the right
                cohort or private format.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-3">
                <Link
                  href="/contact"
                  className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#ddb829] px-2.5 py-2 text-center text-[11px] font-bold leading-tight text-[#1c1917] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:min-h-11 sm:gap-2 sm:whitespace-nowrap sm:px-6 sm:py-2.5 sm:text-sm"
                >
                  <span>Ask before enrolling</span>
                  <ArrowRight className="size-3 shrink-0 sm:size-4" />
                </Link>
                <Link
                  href={brand.whatsappHref}
                  className="inline-flex min-h-10 items-center justify-center rounded-full border border-[#f0d060]/55 px-2.5 py-2 text-center text-[11px] font-semibold leading-tight text-white transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[#f0d060] hover:text-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:min-h-11 sm:whitespace-nowrap sm:px-6 sm:py-2.5 sm:text-sm"
                >
                  Message on WhatsApp
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="border-t border-[#ddb829]/35">
            {trackGuide.map((step, index) => (
              <Reveal delay={index * 0.06} key={step.numeral}>
                <div className="grid grid-cols-[1.85rem_1fr] gap-2.5 border-b border-[#ddb829]/35 py-3.5 sm:grid-cols-[3rem_1fr] sm:gap-5 sm:py-5 lg:grid-cols-[2.25rem_1fr] lg:gap-4 lg:py-4">
                  <span className="font-serif text-xl text-[#f0d060] sm:text-3xl lg:text-2xl">
                    {step.numeral}
                  </span>
                  <div>
                    <h3 className="font-serif text-[1.05rem] leading-snug text-white sm:text-xl sm:leading-tight lg:text-[1.2rem]">
                      {step.title}
                    </h3>
                    <p className="mt-1 max-w-xl text-xs leading-5 text-[#efe5d2] sm:mt-1.5 sm:text-sm sm:leading-6 lg:mt-1 lg:text-[13.5px] lg:leading-[1.55]">
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
      <section className="bg-[#f8f3e9] px-4 py-8 sm:px-10 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-[1200px] rounded-2xl bg-[#1c1917] p-1.5 ring-1 ring-[#ddb829]/30 shadow-[0_28px_65px_-40px_rgba(28,25,23,0.65)] sm:rounded-[2rem] sm:p-2 sm:shadow-[0_38px_80px_-42px_rgba(28,25,23,0.65)]">
          <div className="grid overflow-hidden rounded-[calc(1rem-0.375rem)] bg-[#221d1a] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] sm:rounded-[calc(2rem-0.5rem)] lg:grid-cols-[0.88fr_1.12fr]">
            <div className="relative min-h-[180px] sm:min-h-[380px] lg:min-h-[500px]">
              <Image
                src="/images/manisha/manisha-courses-mentor.webp"
                alt="Dr. Manisha Belvalkar — Spiritual Mentor and Tarot Teacher"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-[50%_20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917]/75 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#221d1a]/55" />
              <span className="absolute bottom-3 left-3 rounded-full bg-[#ddb829] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#1c1917] sm:bottom-6 sm:left-6 sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.16em]">
                Mumbai · Pune · Live Online
              </span>
            </div>

            <div className="flex items-center p-4 sm:p-12 lg:p-16">
              <Reveal>
                <h2 className="text-balance font-serif text-[1.5rem] leading-[1.1] text-white sm:text-4xl sm:leading-[1.08] lg:text-5xl">
                  Ready to step into{" "}
                  <span className="text-[#f0d060]">structured study?</span>
                </h2>
                <p className="mt-2.5 max-w-xl text-pretty text-[13px] leading-6 text-[#d6cfc2] sm:mt-6 sm:text-lg sm:leading-8">
                  Already enrolled in a course with recorded lessons, or looking
                  for a single private session first? Open your library or ask
                  our team for upcoming cohort dates.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-9 sm:flex sm:flex-wrap sm:items-center sm:gap-4">
                  <Link
                    href="/contact"
                    className="group inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-[#ddb829] px-2.5 py-2 text-center text-[11px] font-semibold leading-tight text-[#1c1917] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:min-h-12 sm:gap-3 sm:whitespace-nowrap sm:py-2 sm:pl-6 sm:pr-2 sm:text-sm"
                  >
                    <span>Ask before enrolling</span>
                    <span className="hidden size-8 place-items-center rounded-full bg-[#1c1917]/12 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 sm:grid">
                      <ArrowUpRight className="size-4" strokeWidth={1.6} />
                    </span>
                  </Link>
                  <Link
                    href="/account/courses"
                    className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-[#d6cfc2]/35 px-2.5 py-2 text-center text-[11px] font-semibold leading-tight text-[#efe5d2] transition duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-[#ddb829] hover:text-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ddb829] sm:min-h-12 sm:gap-2 sm:whitespace-nowrap sm:px-6 sm:py-3 sm:text-sm"
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
