import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { healingServices, healingIntro } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import GoldDivider from "@/components/ui/GoldDivider";
import DistanceHealingExperience from "@/components/home/DistanceHealingExperience";
import ChakraAssessment from "@/components/home/ChakraAssessment";

export const metadata: Metadata = {
  title: "Energy Healing",
  description:
    "Energy Healing, Distance Healing, Shakti Healing, and guided mind reprogramming with Dr. Manisha Belvalkar.",
  alternates: { canonical: "/healing" },
};

export default function HealingPage() {
  const primaryServices = healingServices.filter(
    (service) => service.slug !== "mind-reprogramming",
  );
  const guidedMeditation = healingServices.find(
    (service) => service.slug === "mind-reprogramming",
  );

  return (
    <>
      <PageHero
        eyebrow="Energy Healing"
        image="/images/page-heroes/healing-hero.png"
        imageAlt="Seven luminous mineral forms resting in rippled healing sand"
        title={
          <>
            Return to <span className="text-gold-shimmer">balance</span>
          </>
        }
        subtitle={healingIntro}
      />

      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute -right-40 top-16 h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 bottom-10 h-[420px] w-[420px] rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Healing Pathways"
            title="Three focused ways to restore your energy"
            subtitle="Choose Energy Healing, Distance Healing, or Shakti Healing. Each offering is designed with gentle precision and personal aftercare."
          />

          <div className="mx-auto mt-10 grid max-w-4xl gap-3 rounded-[2rem] border border-gold/20 bg-white/65 p-2 shadow-[0_20px_70px_-48px_rgba(107,11,11,0.45)] backdrop-blur-md sm:grid-cols-3 sm:rounded-full">
            {primaryServices.map((service, index) => (
              <a
                key={service.slug}
                href={`#${service.slug}`}
                className="rounded-full px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-warmgray transition-all duration-300 hover:bg-primary hover:text-white"
              >
                {String(index + 1).padStart(2, "0")} {service.title}
              </a>
            ))}
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {primaryServices.map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.08}>
                <Link
                  id={service.slug}
                  href={`/healing/${service.slug}`}
                  className="group relative flex h-full min-h-[500px] flex-col overflow-hidden rounded-[2rem] border border-gold/20 bg-gradient-to-b from-white/95 to-cream/80 p-7 shadow-[0_20px_70px_-46px_rgba(107,11,11,0.55)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-gold/55 hover:shadow-[0_38px_90px_-42px_rgba(221,184,41,0.75)]"
                >
                  <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold/20 opacity-70 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                  <div className="relative h-52 overflow-hidden rounded-[1.5rem] ring-1 ring-gold/20">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-[1.08]"
                      style={{ backgroundImage: `url(${service.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/45 via-transparent to-transparent" />
                  </div>

                  <div className="relative z-10 mt-7 flex flex-1 flex-col">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="eyebrow text-gold-dark">
                        Healing {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold-deep">
                        <Sparkles className="h-4 w-4" />
                      </span>
                    </div>
                    <h3 className="font-display text-2xl font-bold leading-tight text-charcoal transition-colors duration-300 group-hover:text-primary">
                      {service.title}
                    </h3>
                    <div className="mt-4 flex items-center gap-3" aria-hidden="true">
                      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/40" />
                      <span className="font-serif text-sm text-gold">*</span>
                      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-gold/40" />
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-warmgray">
                      {service.short}
                    </p>
                    <ul className="mt-5 space-y-3">
                      {service.features.slice(0, 3).map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-xs leading-relaxed text-warmgray"
                        >
                          <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark shadow-sm shadow-gold/40">
                            <Check
                              className="h-2.5 w-2.5 text-primary-deeper"
                              strokeWidth={3}
                            />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-7 inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/40 group-hover:brightness-110">
                      Learn more{" "}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {guidedMeditation ? (
            <Reveal delay={0.18}>
              <Link
                href={`/healing/${guidedMeditation.slug}`}
                className="group relative mt-10 grid overflow-hidden rounded-[2rem] border border-gold/25 bg-charcoal p-6 shadow-[0_32px_95px_-42px_rgba(107,11,11,0.7)] transition-all duration-500 hover:-translate-y-1 hover:border-gold/60 md:grid-cols-[0.85fr_1.15fr] md:p-8"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(221,184,41,0.22),transparent_32%),radial-gradient(circle_at_88%_14%,rgba(180,20,20,0.22),transparent_34%)]" />
                <svg
                  viewBox="0 0 500 500"
                  className="pointer-events-none absolute -right-24 -top-28 h-[520px] w-[520px] animate-spin-slow text-gold opacity-20 motion-reduce:animate-none"
                  style={{ animationDuration: "100s" }}
                  aria-hidden="true"
                >
                  <g fill="none" stroke="currentColor">
                    <circle cx="250" cy="250" r="206" />
                    <circle cx="250" cy="250" r="142" opacity=".7" />
                    <path d="M250 58 420 350H80Z" />
                    <path d="m250 442 170-292H80Z" />
                  </g>
                </svg>

                <div className="relative min-h-[260px] overflow-hidden rounded-[1.5rem] ring-1 ring-gold/25">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-[1.06]"
                    style={{ backgroundImage: `url(${guidedMeditation.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
                </div>

                <div className="relative z-10 mt-7 flex flex-col justify-center md:mt-0 md:px-8">
                  <span className="eyebrow text-gold-light">Longer guided tab</span>
                  <h3 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                    {guidedMeditation.title}
                  </h3>
                  <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                    {guidedMeditation.description}
                  </p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {guidedMeditation.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-xs leading-relaxed text-white/70"
                      >
                        <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-gold text-primary-deeper">
                          <Check className="h-2.5 w-2.5" strokeWidth={3} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-primary-deeper shadow-lg shadow-gold/20 transition-all duration-300 group-hover:bg-gold-light">
                    Explore guided meditation
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ) : null}
        </div>
      </section>

      <DistanceHealingExperience />
      <ChakraAssessment />

      <GoldDivider />
    </>
  );
}
