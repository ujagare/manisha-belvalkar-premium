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
  MessageCircle,
  Sparkles,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import {
  courses,
  healingServices,
  mentoringAreas,
  services,
  testimonials,
} from "@/lib/data";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore personal Tarot consultations, soul-purpose guidance, healing sessions and transformational mentoring with Manisha Belvalkar.",
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
    text: "Share a few suitable time windows and the team will confirm your private appointment.",
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
  const featuredTestimonial = testimonials[6] ?? testimonials[0];

  return (
    <div className="overflow-hidden bg-[#f8f3e9] text-[#241b17]">
      <section className="relative isolate min-h-[760px] bg-[#201713] text-white lg:min-h-[840px]">
        <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="mx-auto grid min-h-[760px] max-w-[1680px] lg:min-h-[840px] lg:grid-cols-[0.94fr_1.06fr]">
          <div className="relative z-20 flex items-center px-6 py-32 sm:px-10 lg:px-16 xl:px-24">
            <div className="max-w-xl">
              <Reveal>
                <Marker light>Private guidance, thoughtfully held</Marker>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="mt-9 max-w-2xl text-balance font-serif text-[clamp(3.6rem,7vw,7.5rem)] font-medium leading-[0.88] tracking-[-0.055em]">
                  A clearer way
                  <span className="block italic text-[#e4c665]">
                    back to yourself.
                  </span>
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-9 max-w-xl text-lg leading-8 text-white/78 sm:text-xl sm:leading-9">
                  Personal Tarot, healing and mentoring experiences for the
                  questions that cannot be answered by logic alone.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mt-11 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="#paths"
                    className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#b41414] px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_18px_45px_-18px_rgba(180,20,20,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#981010] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e4c665]"
                  >
                    Find your path <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-14 items-center justify-center gap-3 border border-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e4c665]"
                  >
                    Ask Manisha&apos;s team
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="relative min-h-[520px] lg:min-h-full">
            <Image
              src="/images/page-heroes/services-hero.png"
              alt="Manisha Belvalkar's private guidance, healing and mentoring services"
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 54vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#211a17]/75 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#211a17] lg:via-[#211a17]/12 lg:to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 z-20 border border-white/25 bg-[#211a17]/78 p-6 shadow-2xl backdrop-blur-xl sm:bottom-10 sm:left-10 sm:right-auto sm:max-w-md sm:p-7">
              <p className="font-serif text-2xl leading-snug">
                “The right session is not about knowing everything. It is about
                seeing what matters now.”
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#e4c665]">
                Manisha Belvalkar
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="border-b border-[#6b0b0b]/12 bg-[#fffdf9]">
        <div className="mx-auto grid max-w-7xl divide-y divide-[#6b0b0b]/10 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:px-8">
          {[
            ["Private & confidential", "A calm, judgement-free space"],
            ["Online from anywhere", "Join from the comfort of home"],
            ["Personal, not prescriptive", "Guidance shaped around you"],
          ].map(([title, text]) => (
            <div className="px-4 py-6 sm:px-7" key={title}>
              <p className="flex items-center gap-2 text-sm font-semibold text-[#3b2922]">
                <Check className="size-4 text-[#a81414]" /> {title}
              </p>
              <p className="mt-2 pl-6 text-base leading-6 text-[#6b554a]">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <nav
        aria-label="Service categories"
        className="border-b border-[#d5b75e]/35 bg-[#6b0b0b] text-white"
      >
        <div className="mx-auto grid max-w-7xl lg:grid-cols-[1.15fr_repeat(4,1fr)]">
          <div className="flex min-h-24 items-center bg-[#560707] px-6 py-6 sm:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e7c968]">
                Explore services
              </p>
              <p className="mt-1 font-serif text-2xl">Choose your starting point</p>
            </div>
          </div>
          {[
            ["01", "Tarot readings", "#readings"],
            ["02", "Healing", "#healing"],
            ["03", "Mentoring", "#mentoring"],
            ["04", "Courses", "/courses"],
          ].map(([number, label, href]) => (
            <Link
              href={href}
              key={label}
              className="group flex min-h-20 items-center justify-between border-t border-white/15 px-6 py-5 transition-colors duration-300 hover:bg-[#861010] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#e7c968] lg:min-h-24 lg:border-l lg:border-t-0"
            >
              <span>
                <span className="block text-xs font-semibold tracking-[0.18em] text-[#e7c968]">
                  {number}
                </span>
                <span className="mt-1 block text-base font-semibold sm:text-lg">
                  {label}
                </span>
              </span>
              <ArrowRight className="size-5 text-[#e7c968] transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </nav>

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

          <div className="relative mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pathways.map((path, index) => {
              const Icon = path.icon;
              return (
                <Reveal delay={index * 0.06} key={path.title}>
                  <Link
                    href={path.href}
                    className="group flex min-h-[360px] h-full flex-col border border-[#6b0b0b]/14 bg-[#fffdf8] p-7 shadow-[0_24px_70px_-48px_rgba(73,29,20,0.55)] transition-all duration-300 hover:-translate-y-2 hover:border-[#6b0b0b] hover:bg-[#6b0b0b] hover:shadow-[0_30px_70px_-35px_rgba(73,29,20,0.65)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a81414] sm:p-8"
                  >
                    <div className="flex items-start justify-between">
                      <Icon className="size-6 text-[#a81414] transition-colors group-hover:text-[#e4c665]" />
                      <span className="text-xs font-semibold tracking-[0.18em] text-[#a81414] transition-colors group-hover:text-[#e4c665]">
                        0{index + 1}
                      </span>
                    </div>
                    <div className="mt-auto pt-14">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a81414] transition-colors group-hover:text-[#e4c665]">
                        {path.eyebrow}
                      </p>
                      <h3 className="mt-3 font-serif text-3xl leading-tight transition-colors group-hover:text-white">
                        {path.title}
                      </h3>
                      <p className="mt-4 text-base leading-7 text-[#5f4a3f] transition-colors group-hover:text-white/80 sm:text-lg sm:leading-8">
                        {path.text}
                      </p>
                      <ArrowUpRight className="mt-6 size-5 text-[#a81414] transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#e4c665]" />
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
        <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-[#b41414]/25 to-transparent" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10">
            <Reveal>
              <div className="relative overflow-hidden bg-[#251815] px-7 py-10 text-white shadow-[0_35px_90px_-45px_rgba(67,18,13,0.8)] sm:px-10 sm:py-12 lg:sticky lg:top-28 lg:min-h-[42rem] lg:self-start lg:px-12 lg:py-14">
                <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,#f4da80_1px,transparent_0)] [background-size:22px_22px]" />
                <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[#c6922c]/20 blur-3xl" />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-6">
                    <Marker light>Tarot & soul guidance</Marker>
                    <span className="font-serif text-5xl italic leading-none text-[#e4c665]/35">01</span>
                  </div>
                  <p className="mt-9 inline-flex w-fit border border-[#e4c665]/30 bg-[#e4c665]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#f0d77c]">
                    Private services
                  </p>
                  <h2 className="mt-7 max-w-lg text-balance font-serif text-4xl leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-[3.5rem]">
                    Insight for the chapter
                    <span className="block italic text-[#e4c665]">you are living now.</span>
                  </h2>
                  <p className="mt-7 max-w-md text-lg leading-8 text-white/72">
                    A focused private conversation that brings intuitive insight
                    and grounded perspective to your most important questions.
                  </p>
                  <div className="mt-10 border-t border-white/15 pt-7 lg:mt-auto">
                    <p className="border-l-2 border-[#e4c665] pl-5 font-serif text-xl italic leading-8 text-white/90">
                      No fear-based predictions. No generic answers. Just honest,
                      compassionate clarity.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="space-y-3 lg:pt-8">
              {tarotServices.map((service, index) => (
                <Reveal delay={index * 0.05} key={service.slug}>
                  <article
                    className={`group relative overflow-hidden border p-5 transition-all duration-500 sm:p-6 ${
                      service.mostBooked
                        ? "border-[#a31313] bg-[#751010] text-white shadow-[0_30px_70px_-40px_rgba(107,11,11,0.85)]"
                        : "border-white/80 bg-[#fffdf9] shadow-[0_24px_70px_-52px_rgba(73,29,20,0.5)] hover:-translate-y-1.5 hover:border-[#c5a146]/55 hover:shadow-[0_32px_75px_-42px_rgba(107,11,11,0.4)]"
                    }`}
                  >
                    <div className={`pointer-events-none absolute inset-x-0 top-0 h-1 ${service.mostBooked ? "bg-[#e4c665]" : "bg-gradient-to-r from-[#8f0e0e] via-[#c9a54b] to-transparent"}`} />
                    <div className="grid gap-4 sm:grid-cols-[2.25rem_1fr_auto] sm:items-center sm:gap-5">
                      <span className={`font-serif text-xl italic ${service.mostBooked ? "text-[#e4c665]" : "text-[#aa8d7d]"}`}>
                        0{index + 1}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className={`font-serif text-2xl leading-tight sm:text-3xl ${service.mostBooked ? "text-white" : "text-[#321e18]"}`}>
                            {service.title}
                          </h3>
                          {service.mostBooked && (
                            <span className="bg-[#e4c665] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#50100c]">
                              Most booked
                            </span>
                          )}
                        </div>
                        <p className={`mt-2 line-clamp-2 max-w-xl text-base leading-7 ${service.mostBooked ? "text-white/75" : "text-[#513b32]"}`}>
                          {service.description}
                        </p>
                        <div className={`mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.1em] ${service.mostBooked ? "text-[#f0d77c]" : "text-[#6b0b0b]"}`}>
                          <span className="flex items-center gap-2">
                            <Clock className="size-3.5" /> {service.duration}
                          </span>
                          <span>{formatINR(service.price)}</span>
                        </div>
                      </div>
                      <Link
                        href={`/services/${service.slug}`}
                        aria-label={`View ${service.title}`}
                        className={`inline-flex min-h-11 items-center justify-center gap-2 px-4 text-sm font-bold transition-all group-hover:translate-x-1 sm:size-12 sm:px-0 ${service.mostBooked ? "bg-[#e4c665] text-[#50100c] hover:bg-white" : "bg-[#6b0b0b] text-white hover:bg-[#a81414]"}`}
                      >
                        <span className="sm:hidden">View session</span>
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
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

      <section id="healing" className="relative bg-[#211a17] px-6 py-24 text-white sm:px-10 lg:py-36">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e4c665] to-transparent" />
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
              <div>
                <Marker light>Healing & energy work</Marker>
                <h2 className="mt-6 max-w-3xl font-serif text-4xl leading-[1.02] tracking-[-0.035em] sm:text-6xl">
                  Create space for what wants to change.
                </h2>
              </div>
              <p className="max-w-lg text-lg leading-8 text-white/75 lg:justify-self-end">
                Gentle, private sessions designed to support emotional release,
                energetic balance and a more centred relationship with yourself.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 border-t border-white/15">
            {healingServices.map((service, index) => (
              <Reveal delay={index * 0.05} key={service.slug}>
                <Link
                  href={`/healing/${service.slug}`}
                  className="group grid gap-5 border-b border-white/15 py-8 transition-colors hover:bg-white/[0.035] sm:grid-cols-[70px_0.8fr_1.2fr_auto] sm:items-center sm:px-4"
                >
                  <span className="font-serif text-xl italic text-[#e4c665]">
                    0{index + 1}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl">
                    {service.title}
                  </h3>
                  <p className="max-w-xl text-lg leading-8 text-white/78">
                    {service.short}
                  </p>
                  <span className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-[#e4c665] group-hover:text-[#e4c665]">
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
        <section className="bg-white px-6 py-24 sm:px-10 lg:py-32">
          <div className="mx-auto grid max-w-7xl overflow-hidden bg-[#eee3d2] lg:grid-cols-2">
            <div className="relative min-h-[520px] lg:min-h-[650px]">
              <Image
                src="/images/manisha-wix.jpg"
                alt="Manisha Belvalkar"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </div>
            <div className="flex items-center p-8 sm:p-12 lg:p-16">
              <Reveal>
                <Marker>Signature journey</Marker>
                <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#806b5f]">
                  {featuredCourse.duration}
                </p>
                <h2 className="mt-4 font-serif text-4xl leading-[1.03] tracking-[-0.035em] sm:text-5xl">
                  {featuredCourse.title}
                </h2>
                <p className="mt-6 text-lg leading-9 text-[#5d493f]">
                  {featuredCourse.description}
                </p>
                <div className="mt-8 border-y border-[#6b0b0b]/15 py-5">
                  <p className="text-sm font-semibold text-[#34251f]">
                    Best for you if:
                  </p>
                  <ul className="mt-4 space-y-3 text-base leading-7 text-[#5d493f]">
                    <li className="flex gap-3">
                      <Check className="mt-1 size-4 shrink-0 text-[#a81414]" />
                      You want consistent, personal guidance rather than a
                      one-time conversation.
                    </li>
                    <li className="flex gap-3">
                      <Check className="mt-1 size-4 shrink-0 text-[#a81414]" />
                      You are ready to work gently but honestly with recurring
                      patterns.
                    </li>
                  </ul>
                </div>
                <Link
                  href={`/courses/${featuredCourse.slug}`}
                  className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 bg-[#6b0b0b] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#8f0e0e]"
                >
                  Explore the journey <ArrowRight className="size-4" />
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#f8f3e9] px-6 py-24 sm:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="text-center">
              <Marker>What happens next</Marker>
              <h2 className="mx-auto mt-6 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
                Simple to book. Personal from the start.
              </h2>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-10 border-t border-[#6b0b0b]/18 pt-10 md:grid-cols-3">
            {steps.map((step, index) => (
              <Reveal delay={index * 0.07} key={step.number}>
                <div className="grid grid-cols-[auto_1fr] gap-5">
                  <span className="font-serif text-3xl italic text-[#a81414]">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-serif text-2xl">{step.title}</h3>
                    <p className="mt-3 text-base leading-7 text-[#644d43]">
                      {step.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {featuredTestimonial && (
        <section className="bg-white px-6 py-24 sm:px-10 lg:py-32">
          <Reveal>
            <figure className="mx-auto max-w-5xl text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-[#a81414]/25 font-serif text-3xl text-[#a81414]">
                “
              </div>
              <blockquote className="mt-8 font-serif text-3xl leading-[1.28] tracking-[-0.025em] text-[#34251f] sm:text-5xl">
                {featuredTestimonial.text}
              </blockquote>
              <figcaption className="mt-8">
                <p className="text-sm font-semibold text-[#3b2922]">
                  {featuredTestimonial.name}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#9a8173]">
                  {featuredTestimonial.role}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </section>
      )}

      <section className="relative bg-[#6b0b0b] px-6 py-20 text-white sm:px-10 lg:py-24">
        <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:22px_22px]" />
        <Reveal>
          <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e7c968]">
                Still deciding?
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
                Tell us what you are navigating.
              </h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-white/78">
                Manisha&apos;s team will help you choose the most useful
                starting point—without pressure or guesswork.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-14 shrink-0 items-center justify-center gap-3 bg-[#e4c665] px-8 py-4 text-sm font-bold uppercase tracking-[0.11em] text-[#4a130f] transition-colors hover:bg-white"
            >
              <MessageCircle className="size-5" />
              Help me choose
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
