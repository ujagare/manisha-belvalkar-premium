import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { mentoringAreas, brand } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import GoldDivider from "@/components/ui/GoldDivider";

const premiumMentoringIntro =
  "A private guidance space for self-discovery, soul purpose and aligned action. Through Tarot, intuitive mentoring and deep reflection, Dr. Manisha Belvalkar helps you understand yourself and move forward with clarity.";

export const metadata: Metadata = {
  title: "Mentoring",
  description:
    "Premium mentoring through Tarot, Soul Purpose Reading, and clarity-alignment guidance with Dr. Manisha Belvalkar.",
  alternates: { canonical: "/mentoring" },
};

export default function MentoringPage() {
  return (
    <>
      <PageHero
        eyebrow="Mentoring"
        image="/images/page-heroes/mentoring-hero.png"
        imageAlt="A warm private mentoring table with journal, tea and reflection card"
        contentSide="right"
        title={
          <>
            Guidance for your{" "}
            <span className="text-gold-shimmer">next chapter</span>
          </>
        }
        subtitle={premiumMentoringIntro}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-white via-cream to-gold-soft/70 py-20 lg:py-24">
        <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-gold/18 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full bg-primary/8 blur-3xl" />
        <svg
          viewBox="0 0 500 500"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow text-gold-deep opacity-[0.16] motion-reduce:animate-none"
          style={{ animationDuration: "100s" }}
          aria-hidden="true"
        >
          <g fill="none" stroke="currentColor">
            <circle cx="250" cy="250" r="214" strokeWidth="1" />
            <circle cx="250" cy="250" r="156" strokeWidth="1" opacity=".75" />
            <path d="M250 50 420 350H80Z" strokeWidth="1.2" />
            <path d="m250 450 170-300H80Z" strokeWidth="1.2" />
            <circle cx="250" cy="250" r="86" strokeDasharray="3 10" strokeLinecap="round" />
          </g>
        </svg>
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <Reveal>
            <Sparkles className="mx-auto mb-6 h-8 w-8 text-gold" />
            <p className="relative font-serif text-2xl font-semibold italic leading-relaxed text-primary-deeper sm:text-3xl">
              &ldquo;Mentoring is a sacred pause: a space to listen deeply, see
              clearly, and choose the next step with courage.&rdquo;
            </p>
            <p className="mt-6 font-serif text-lg text-warmgray">
              &mdash; {brand.name}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Three Premium Pathways"
            title="Choose the guidance your soul is asking for"
            subtitle="Three focused pathways: Mentoring through Tarot, Soul Purpose Reading, and evolution through clarity and alignment."
          />

          <div className="mx-auto mt-10 grid max-w-4xl gap-3 rounded-[2rem] border border-gold/20 bg-white/60 p-2 shadow-[0_20px_70px_-48px_rgba(107,11,11,0.45)] backdrop-blur-md sm:grid-cols-3 sm:rounded-full">
            {mentoringAreas.map((area, index) => (
              <a
                key={area.slug}
                href={`#${area.slug}`}
                className="rounded-full px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-warmgray transition-all duration-300 hover:bg-primary hover:text-white"
              >
                {String(index + 1).padStart(2, "0")} {area.title}
              </a>
            ))}
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {mentoringAreas.map((area, index) => (
              <Reveal key={area.slug} delay={index * 0.08}>
                <Link
                  id={area.slug}
                  href={`/mentoring/${area.slug}`}
                  className="group relative flex h-full min-h-[520px] flex-col overflow-hidden rounded-[2rem] border border-gold/20 bg-gradient-to-b from-white/95 to-cream/80 p-7 shadow-[0_20px_70px_-46px_rgba(107,11,11,0.55)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-gold/55 hover:shadow-[0_38px_90px_-42px_rgba(221,184,41,0.75)]"
                >
                  <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold/20 opacity-70 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                  <div
                    className="absolute inset-0 opacity-[0.055] transition-opacity duration-500 group-hover:opacity-[0.09]"
                    style={{
                      backgroundImage: `url(${area.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="relative z-10 flex flex-1 flex-col">
                    <div className="mb-8 flex items-center justify-between">
                      <span className="eyebrow text-gold-dark">
                        Path {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/25 bg-gold/10 text-gold-deep shadow-[0_0_40px_rgba(221,184,41,0.18)]">
                        <Sparkles className="h-4 w-4" />
                      </span>
                    </div>

                    <h3 className="font-display text-2xl font-bold leading-tight text-charcoal transition-colors duration-300 group-hover:text-primary">
                      {area.title}
                    </h3>
                    <div
                      className="mt-4 flex items-center gap-3"
                      aria-hidden="true"
                    >
                      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/40" />
                      <span className="font-serif text-sm text-gold">*</span>
                      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-gold/40" />
                    </div>

                    <p className="mt-4 flex-1 text-sm leading-relaxed text-warmgray">
                      {area.short}
                    </p>
                    <ul className="mt-5 space-y-3">
                      {area.features.slice(0, 3).map((feature) => (
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
                      Explore{" "}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#210b0a] py-24 text-white sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
          <Reveal>
            <p className="font-serif text-xl italic tracking-[0.06em] text-gold-light/75">Your next step can be simple</p>
            <h2 className="mt-4 text-balance font-display text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl">
              Ready to find <span className="text-gold-shimmer">clarity?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-8 text-white/65 sm:text-lg">
              Choose the mentoring pathway that feels closest to your present question, or begin with a conversation to understand which form of guidance suits you best.
            </p>
            <Link href="/contact" className="group mt-9 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-gold to-gold-dark px-8 py-4 text-sm font-semibold text-primary-deeper shadow-[0_14px_42px_rgba(221,184,41,0.2)] transition duration-300 hover:-translate-y-1 hover:from-gold-light hover:to-gold">
              Find your mentoring path
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      <GoldDivider />
    </>
  );
}
