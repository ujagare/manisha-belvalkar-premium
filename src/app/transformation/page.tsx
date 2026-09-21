import type { Metadata } from "next";
import { Check, Sparkles, Clock, Calendar } from "lucide-react";
import { transformationProgram, brand } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import GoldDivider from "@/components/ui/GoldDivider";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "6 Months to Transform",
  description:
    "A premium flagship journey of personal transformation — six months of mentoring, healing, tarot insight and empowerment.",
};

export default function TransformationPage() {
  const { months, ...program } = transformationProgram;

  return (
    <>
      <PageHero
        eyebrow="Flagship Program"
        image="/images/page-heroes/transformation-hero.png"
        imageAlt="Six sculptural steps rising toward warm light with a crimson thread"
        title={
          <>
            Six months to{" "}
            <span className="text-gold-shimmer">transform</span>
          </>
        }
        subtitle={program.description}
      />

      {/* Program meta */}
      <section className="bg-mist py-14 lg:py-16">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 lg:px-10">
          <Reveal className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gold" />
            <div>
              <div className="text-sm font-semibold text-charcoal">{program.duration}</div>
              <div className="text-xs text-warmgray">Guided monthly journey</div>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-gold" />
            <div>
              <div className="text-sm font-semibold text-charcoal">Monthly mentoring</div>
              <div className="text-xs text-warmgray">Healing + Tarot + Empowerment</div>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gold" />
            <div>
              <div className="text-sm font-semibold text-charcoal">{program.price}</div>
              <div className="text-xs text-warmgray">Private consultation required</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="The Journey"
            title="Six chapters of transformation"
            subtitle="Each month builds on the last — a carefully guided path from self-discovery to lasting change."
          />

          <div className="relative mt-16">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-gold/60 via-gold/20 to-transparent md:left-1/2" />

            <div className="space-y-12">
              {months.map((m, i) => {
                const left = i % 2 === 0;
                return (
                  <Reveal key={m.month}>
                    <div
                      className={`relative flex items-start gap-6 md:w-1/2 ${
                        left ? "md:mr-auto md:pr-10" : "md:ml-auto md:pl-10"
                      }`}
                    >
                      {/* Node */}
                      <div className="absolute left-5 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-charcoal text-gold shadow-lg ring-4 ring-gold/20 md:left-auto md:right-0 md:translate-x-1/2 md:top-0">
                        <span className="font-display text-sm font-bold">
                          {String(m.month).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="group relative ml-14 flex-1 overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-7 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_30px_70px_-30px_rgba(221,184,41,0.45)] md:ml-0">
                        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                        <div className="eyebrow relative mb-2 text-gold-dark">
                          Month {m.month}
                        </div>
                        <h3 className="relative font-display text-2xl font-bold text-charcoal transition-colors duration-300 group-hover:text-primary">
                          {m.title}
                        </h3>
                        <p className="relative mt-2 text-sm leading-relaxed text-warmgray">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <Reveal className="mt-16 text-center">
            <div className="eyebrow mb-4 text-gold-dark">Ready to begin?</div>
            <h3 className="font-display text-3xl font-bold text-charcoal sm:text-4xl">
              Begin the journey to your transformed self
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-base text-warmgray">
              A private consultation determines whether this journey is right for
              you — and shapes your personal roadmap.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href={brand.whatsappHref} size="lg" variant="gold">
                Request a Consultation
              </Button>
              <Button href="/contact" size="lg" variant="outline">
                Contact Manisha
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <GoldDivider />
      <CTASection />
    </>
  );
}
