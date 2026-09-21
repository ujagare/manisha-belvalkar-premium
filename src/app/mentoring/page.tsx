import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { mentoringAreas, mentoringIntro, brand } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import GoldDivider from "@/components/ui/GoldDivider";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Mentoring",
  description:
    "Tarot is not fortune-telling — it is a mirror for self-exploration. One-on-one mentoring with Dr. Manisha Belvalkar.",
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
            Mentoring through{" "}
            <span className="text-gold-shimmer">Tarot</span>
          </>
        }
        subtitle={mentoringIntro}
      />

      {/* Intro quote */}
      <section className="bg-charcoal py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <Reveal>
            <p className="font-serif text-2xl font-medium italic leading-relaxed text-gold-light sm:text-3xl">
              &ldquo;The Tarot is not a fortune-telling tool — it is a mirror
              for self-exploration. Understand yourself, explore your patterns,
              find clarity and move toward transformation.&rdquo;
            </p>
            <p className="mt-6 font-serif text-lg text-white/60">&mdash; {brand.name}</p>
          </Reveal>
        </div>
      </section>

      {/* Mentoring Areas */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Areas of Mentoring"
            title="What brings you here?"
            subtitle="Choose a path that resonates — each area is a doorway into deeper self-understanding."
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mentoringAreas.map((area, i) => (
              <Reveal key={area.slug} delay={i * 0.08}>
                <Link
                  href={`/mentoring/${area.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-8 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-2 hover:border-gold/50 hover:shadow-[0_35px_80px_-30px_rgba(221,184,41,0.45)]"
                >
                  {/* Gold aura bloom */}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                  {/* Image thumb */}
                  <div
                    className="absolute inset-0 opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.07]"
                    style={{
                      backgroundImage: `url(${area.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="relative z-10 flex flex-1 flex-col">
                    <span className="eyebrow mb-3 inline-block text-gold-dark">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-2xl font-bold leading-tight text-charcoal transition-colors duration-300 group-hover:text-primary">
                      {area.title}
                    </h3>
                    {/* Ornamental divider */}
                    <div className="mt-4 flex items-center gap-3" aria-hidden="true">
                      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/40" />
                      <span className="font-serif text-sm text-gold">✦</span>
                      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-gold/40" />
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-warmgray">
                      {area.short}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {area.features.slice(0, 2).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-warmgray">
                          <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark shadow-sm shadow-gold/40">
                            <Check className="h-2.5 w-2.5 text-primary-deeper" strokeWidth={3} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/40 group-hover:brightness-110">
                      Explore <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who is it for? */}
      <section className="bg-mist py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <Reveal>
              <SectionHeading
                eyebrow="Who Is It For?"
                title="This mentoring is for you if..."
                align="left"
                subtitle="You are ready to invest in yourself — not just for a quick answer, but for lasting transformation."
              />
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="space-y-5">
                {[
                  "You feel stuck and want clarity on your next step",
                  "You are navigating a major life transition",
                  "You want to understand your patterns and break free from what no longer serves you",
                  "You are ready for deep inner work and self-exploration",
                  "You seek guidance that honours your whole being — mind, body and spirit",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-base text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <GoldDivider />
      <CTASection />
    </>
  );
}
