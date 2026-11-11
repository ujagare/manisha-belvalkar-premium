import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Clock,
  Compass,
  Heart,
  Sparkles,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import {
  courses,
  healingServices,
  mentoringAreas,
  services,
} from "@/lib/data";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tarot Consultation & Spiritual Healing Services in Mumbai & Pune",
  description:
    "Book a personal Tarot consultation, soul purpose reading, Goddess attunement, chakra therapy or transformational mentoring session with Dr. Manisha Belvalkar — 30+ years of experience in Mumbai & Pune.",
  alternates: { canonical: "/services" },
};

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
    text: "For emotional heaviness, recurring patterns and a deeper return to inner steadiness.",
    href: "#healing",
  },
  {
    icon: Sparkles,
    eyebrow: "Growth",
    title: "I want deeper support",
    text: "For ongoing guidance, spiritual practice and a more intentional personal transformation.",
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
    text: "Select the session that feels closest to your present need. If you are unsure, simply ask.",
  },
  {
    number: "02",
    title: "Reserve a time",
    text: "Share a few suitable time windows and the team will confirm your booking time.",
  },
  {
    number: "03",
    title: "Arrive as you are",
    text: "Bring your question, your context and an open mind. No special preparation is needed.",
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
      className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] ${
        light ? "text-[#e7c968]" : "text-[#981313]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-px w-7 ${light ? "bg-[#e7c968]" : "bg-[#981313]"}`}
      />
      {children}
    </span>
  );
}

export default function ServicesPage() {
  const tarotServices = services.filter(
    (service) => !service.slug.includes("well-being")
  );
  const wellbeingServices = services.filter((service) =>
    service.slug.includes("well-being")
  );
  const featuredCourse = courses.find(
    (course) => course.slug === "personalized-wellbeing"
  );
  return (
    <div className="overflow-hidden bg-[#f8f3e9] text-[#241b17]">
      <section className="relative isolate bg-[#fdf8f0] px-6 pb-24 pt-16 sm:px-10 lg:pb-28 lg:pt-20">
        <div className="pointer-events-none absolute -right-32 top-12 size-[32rem] rounded-full bg-[#d9b957]/12 blur-3xl" />
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20">
          <div className="relative z-20">
            <div className="max-w-2xl">
              <Reveal>
                <Marker>Private guidance, thoughtfully held</Marker>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-8 max-w-2xl text-balance font-serif text-[clamp(3.25rem,6.4vw,5.5rem)] font-medium leading-[0.94] tracking-[-0.045em] text-[#292524]">
                  A clearer way
                  <span className="block italic text-[#a81414]">
                    back to yourself.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-8 max-w-xl text-lg leading-8 text-[#67564d] sm:text-xl sm:leading-9">
                  Personal Tarot, healing and mentoring experiences for the
                  questions that cannot be answered by logic alone.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-11 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="#paths"
                    className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#b41414] px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_18px_45px_-18px_rgba(180,20,20,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#981010] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e4c665]"
                  >
                    Find your path <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-[#a8871a] px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#292524] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ddb829] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8871a]"
                  >
                    Ask Manisha&apos;s team
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="mt-12 grid gap-5 border-t border-[#6b0b0b]/12 pt-7 sm:grid-cols-3">
                  {[
                    ["Private & confidential", "A calm, judgement-free space"],
                    ["Online from anywhere", "Join from the comfort of home"],
                    ["Personal guidance", "Shaped around you"],
                  ].map(([title, text]) => (
                    <div key={title}>
                      <p className="text-sm font-semibold text-[#34251f]">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#76635a]">{text}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal direction="left" delay={0.12}>
            <div className="relative mx-auto w-full max-w-[470px] px-3 pt-3">
              <div className="pointer-events-none absolute inset-0 rounded-t-[999px] rounded-b-[1.5rem] border border-[#c7a23b]" />
              <div className="relative aspect-[3/4.15] overflow-hidden rounded-t-[999px] rounded-b-[1rem] shadow-[0_45px_85px_-45px_rgba(107,11,11,0.65)]">
                <Image
                  src="/images/page-heroes/services-hero.webp"
                  alt="Manisha Belvalkar's private guidance, healing and mentoring services"
                  fill
                  preload
                  sizes="(max-width: 1024px) 90vw, 470px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#351b16]/30 via-transparent to-transparent" />
              </div>
              <div className="relative z-20 -mt-20 -ml-3 mr-4 border-t-2 border-[#ddb829] bg-[#211a17] p-6 text-white shadow-[0_28px_60px_-25px_rgba(28,25,23,0.7)] sm:-ml-10 sm:mr-20 sm:p-7">
                <p className="font-serif text-2xl leading-snug">
                  “The right session is not about knowing everything. It is about
                  seeing what matters now.”
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#e4c665]">
                  Manisha Belvalkar
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="paths" className="relative px-6 py-24 sm:px-10 lg:py-36">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-[#d9b957]/10 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <Marker>Begin with what you need</Marker>
              <h2 className="mt-6 font-serif text-4xl leading-[1.02] tracking-[-0.035em] sm:text-6xl">
                You do not need to know the service.
                <span className="block italic text-[#a81414]">
                  Only where you are.
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="relative mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pathways.map((path, index) => {
              const Icon = path.icon;
              return (
                <Reveal delay={index * 0.06} key={path.title}>
                  <Link
                    href={path.href}
                    className="group flex min-h-[280px] h-full flex-col rounded-md border border-[#d8c8ae] bg-white p-7 shadow-[0_24px_40px_-30px_rgba(107,11,11,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c5a146] hover:shadow-[0_24px_40px_-28px_rgba(107,11,11,0.4)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a81414] sm:p-8"
                  >
                    <div className="flex items-start justify-between">
                      <Icon className="size-6 text-[#a81414]" />
                      <span className="text-xs font-semibold tracking-[0.18em] text-[#a8871a]">
                        0{index + 1}
                      </span>
                    </div>
                    <div className="mt-auto pt-10">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a8871a]">
                        {path.eyebrow}
                      </p>
                      <h3 className="mt-3 font-serif text-3xl leading-tight">
                        {path.title}
                      </h3>
                      <p className="mt-4 text-base leading-7 text-[#5f4a3f]">
                        {path.text}
                      </p>
                      <ArrowUpRight className="mt-6 size-5 text-[#a81414] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="readings" className="relative overflow-hidden border-y border-[#6b0b0b]/10 bg-[#f3eadc] px-6 py-24 sm:px-10 lg:py-36">
        <div className="pointer-events-none absolute -left-40 top-24 size-[34rem] rounded-full bg-[#c39a32]/12 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
              <div>
                <Marker>Tarot & soul guidance</Marker>
                <h2 className="mt-6 max-w-2xl text-balance font-serif text-4xl leading-[1.02] tracking-[-0.04em] sm:text-6xl">
                  Insight for the chapter
                  <span className="block italic text-[#a81414]">you are living now.</span>
                </h2>
              </div>
              <div className="lg:pb-1">
                <p className="max-w-xl text-lg leading-8 text-[#5f4a3f]">
                  A focused private conversation that brings intuitive insight
                  and grounded perspective to your most important questions.
                </p>
                <p className="mt-5 max-w-xl font-serif text-xl italic leading-8 text-[#8f0e0e]">
                  No fear-based predictions. No generic answers. Just honest,
                  compassionate clarity.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-7 sm:grid-cols-2 xl:grid-cols-4">
            {tarotServices.map((service, index) => (
              <Reveal delay={index * 0.06} key={service.slug}>
                <article
                  className={`group relative flex h-full min-h-[35rem] flex-col rounded-t-[999px] rounded-b-xl border p-2.5 transition-all duration-500 hover:-translate-y-2 ${
                    service.mostBooked
                      ? "border-[#6b0b0b] bg-[#6b0b0b] text-white shadow-[0_35px_70px_-35px_rgba(107,11,11,0.75)]"
                      : "border-[#d8c8ae] bg-[#fffdf9] shadow-[0_24px_60px_-42px_rgba(107,11,11,0.55)] hover:border-[#c5a146]"
                  }`}
                >
                  {service.mostBooked && (
                    <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#ddb829] px-4 py-2 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#371d17]">
                      Most booked
                    </span>
                  )}
                  <div className={`flex h-full flex-col rounded-t-[999px] rounded-b-lg border px-5 pb-5 pt-14 text-center ${service.mostBooked ? "border-[#ddb829]" : "border-[#c9a520]"}`}>
                    <span className={`font-serif text-sm tracking-[0.28em] ${service.mostBooked ? "text-[#e4c665]" : "text-[#8f0e0e]"}`}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Sparkles className={`mx-auto mt-5 size-10 stroke-[1.2] ${service.mostBooked ? "text-[#e4c665]" : "text-[#a81414]"}`} />
                    <h3 className="mt-5 font-serif text-3xl leading-tight">{service.title}</h3>
                    <p className={`mt-5 text-[0.95rem] leading-7 ${service.mostBooked ? "text-white/75" : "text-[#5f4a3f]"}`}>
                      {service.description}
                    </p>
                    <div className={`mt-auto flex items-end justify-between border-t pt-5 text-left ${service.mostBooked ? "border-[#ddb829]/35" : "border-[#6b0b0b]/12"}`}>
                      <span className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] ${service.mostBooked ? "text-[#f0d77c]" : "text-[#6b0b0b]"}`}>
                        <Clock className="size-3.5" /> {service.duration}
                      </span>
                      <span className="font-serif text-2xl">{formatINR(service.price)}</span>
                    </div>
                    <Link
                      href={`/services/${service.slug}`}
                      className={`mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-xs font-bold uppercase tracking-[0.15em] transition-all active:scale-[0.98] ${service.mostBooked ? "bg-[#ddb829] text-[#371d17] hover:bg-[#f0d060]" : "bg-[#a81414] text-white hover:bg-[#6b0b0b]"}`}
                    >
                      Reserve session <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {wellbeingServices.length > 0 && (
        <section className="relative overflow-hidden bg-[#981313] px-6 py-16 text-white sm:px-10 lg:py-20">
          <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:20px_20px]" />
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f0d77c]">
                Well-being sessions
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
                When one session is only the beginning.
              </h2>
            </div>
            {wellbeingServices.map((service) => (
              <div
                className="flex w-full flex-col gap-5 border-t border-white/20 pt-6 sm:flex-row sm:items-center sm:justify-between lg:w-auto lg:min-w-[460px] lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0"
                key={service.slug}
              >
                <div>
                  <h3 className="font-serif text-2xl">{service.title}</h3>
                  <p className="mt-2 text-base text-white/80">
                    {service.duration} · {formatINR(service.price)}
                  </p>
                </div>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 bg-white px-6 text-sm font-semibold text-[#8f0e0e] transition-colors hover:bg-[#f5e8c0]"
                >
                  Explore <ArrowRight className="size-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="healing" className="relative bg-[#6b0b0b] px-6 py-24 text-white sm:px-10 lg:py-28">
        <div className="mx-auto grid max-w-[1200px] gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <div>
                <Marker light>Healing & energy work</Marker>
                <h2 className="mt-6 max-w-xl font-serif text-4xl leading-[1.02] tracking-[-0.035em] sm:text-6xl">
                  Create space for <span className="italic text-[#f0d060]">what wants to change.</span>
                </h2>
              <p className="mt-7 max-w-lg text-lg leading-8 text-[#efe5d2]">
                Gentle, private sessions designed to support emotional release,
                energetic balance and a more centred relationship with yourself.
              </p>
            </div>
          </Reveal>

          <div className="border-t border-[#ddb829]/35">
            {healingServices.map((service, index) => (
              <Reveal delay={index * 0.05} key={service.slug}>
                <Link
                  href={`/healing/${service.slug}`}
                  className="group grid grid-cols-[1fr_auto] items-center gap-6 border-b border-[#ddb829]/35 px-1 py-7 transition-all hover:bg-white/[0.05] hover:px-4 sm:py-8"
                >
                  <div className="min-w-0">
                    <h3 className="font-serif text-2xl leading-tight sm:text-3xl">
                      {service.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#efe5d2] sm:text-base sm:leading-7">
                      {service.short}
                    </p>
                  </div>
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[#ddb829] text-[#ddb829] transition-colors group-hover:bg-[#ddb829] group-hover:text-[#292524]">
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="mentoring" className="relative bg-[#f0e6d7] px-6 py-24 sm:px-10 lg:py-36">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#8f0e0e]" />
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <Marker>Mentoring</Marker>
              <h2 className="mt-6 font-serif text-4xl leading-[1.04] tracking-[-0.035em] sm:text-6xl">
                A deeper practice, held over time.
              </h2>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#644d43]">
                For those who want to move beyond a single answer and build
                discernment, self-trust and a grounded spiritual practice.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-px bg-[#6b0b0b]/14 lg:grid-cols-3">
            {mentoringAreas.map((area, index) => (
              <Reveal delay={index * 0.07} key={area.slug}>
                <Link
                  href={`/mentoring/${area.slug}`}
                  className="group flex min-h-[360px] h-full flex-col bg-[#fffdf8] p-8 transition-colors hover:bg-white sm:p-10"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a81414]">
                    Path 0{index + 1}
                  </span>
                  <h3 className="mt-12 font-serif text-3xl leading-tight sm:text-4xl">
                    {area.title}
                  </h3>
                  <p className="mt-5 text-lg leading-8 text-[#523d34]">
                    {area.short}
                  </p>
                  <span className="mt-auto flex items-center gap-2 pt-10 text-sm font-semibold text-[#8f0e0e]">
                    Discover this path
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {featuredCourse && (
        <section className="bg-[#fdf8f0] px-6 py-24 sm:px-10 lg:py-28">
          <div className="mx-auto grid max-w-[1200px] overflow-hidden rounded-lg bg-[#1c1917] text-white lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[340px] lg:min-h-[620px]">
              <Image
                src="/images/manisha-wix.webp"
                alt="Manisha Belvalkar"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
              />
              <span className="absolute bottom-6 left-6 rounded-full bg-[#ddb829] px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#292524]">
                {featuredCourse.duration}
              </span>
            </div>
            <div className="flex items-center p-8 sm:p-12 lg:p-16">
              <Reveal>
                <Marker light>Signature journey</Marker>
                <h2 className="mt-4 font-serif text-4xl leading-[1.03] tracking-[-0.035em] sm:text-5xl">
                  {featuredCourse.title}
                </h2>
                <p className="mt-6 text-lg leading-9 text-[#d6cfc2]">
                  {featuredCourse.description}
                </p>
                <div className="mt-8 border-y border-[#ddb829]/30 py-5">
                  <p className="text-sm font-semibold text-white">
                    Best for you if:
                  </p>
                  <ul className="mt-4 space-y-3 text-base leading-7 text-[#efe5d2]">
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
                <Link
                  href={`/courses/${featuredCourse.slug}`}
                  className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#ddb829] px-7 py-3 text-sm font-semibold text-[#292524] transition-colors hover:bg-[#f0d060]"
                >
                  Explore the journey <ArrowRight className="size-4" />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#f8f3e9] px-6 py-24 sm:px-10 lg:py-28">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <div>
              <Marker>What happens next</Marker>
              <h2 className="mt-6 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
                Simple to book. <span className="italic text-[#a81414]">Personal from the start.</span>
              </h2>
            </div>
          </Reveal>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal delay={index * 0.07} key={step.number}>
                <div className="relative border-t border-[#c9a520] pt-10">
                  <span className="absolute -top-7 left-0 bg-[#f8f3e9] pr-4 font-serif text-5xl italic text-[#a81414]">
                    {index === 0 ? "i." : index === 1 ? "ii." : "iii."}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl">{step.title}</h3>
                  <p className="mt-3 text-base leading-7 text-[#644d43]">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
