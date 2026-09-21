import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { shaktiPillars, shaktiIntro, brand } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import GoldDivider from "@/components/ui/GoldDivider";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Shakti",
  description:
    "A sacred journey of self-discovery, empowerment and inner transformation for women.",
};

export default function ShaktiPage() {
  const [first, ...rest] = shaktiPillars;

  return (
    <>
      <PageHero
        eyebrow="Shakti"
        image="/images/page-heroes/shakti-hero.png"
        imageAlt="Sculptural crimson lotus with an antique gold sacred geometry halo"
        title={
          <>
            Awaken your{" "}
            <span className="text-gold-shimmer">divine feminine</span>
          </>
        }
        subtitle={shaktiIntro}
      />

      {/* Bento grid: one large + three */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="The Four Pillars"
            title="A journey of self-discovery, empowerment and inner transformation"
          />

          <div className="mt-16 grid grid-flow-dense gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Large feature card */}
            <Reveal className="lg:col-span-2 lg:row-span-2">
              <div className="group relative flex h-full min-h-[420px] flex-col justify-end overflow-hidden rounded-[28px] bg-charcoal p-10 ring-1 ring-gold/15 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_80px_-30px_rgba(221,184,41,0.45)]">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-40 transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
                  style={{ backgroundImage: `url(${first.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative z-10">
                  <span className="eyebrow mb-3 text-gold">{first.tagline}</span>
                  <h3 className="font-display text-4xl font-bold text-white sm:text-5xl">
                    {first.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
                    {first.description}
                  </p>
                </div>
              </div>
            </Reveal>

            {rest.map((pillar) => (
              <Reveal key={pillar.title}>
                <div className="group relative flex h-full min-h-[220px] flex-col justify-end overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-8 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-2 hover:border-gold/50 hover:shadow-[0_35px_80px_-30px_rgba(221,184,41,0.45)]">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                  <div
                    className="absolute inset-0 opacity-[0.06] transition-opacity duration-500 group-hover:opacity-[0.1]"
                    style={{
                      backgroundImage: `url(${pillar.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="relative z-10">
                    <span className="eyebrow mb-2 text-gold-dark">
                      {pillar.tagline}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-charcoal transition-colors duration-300 group-hover:text-primary">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-warmgray">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Divine quote */}
      <section className="bg-charcoal py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
          <Reveal>
            <Sparkles className="mx-auto mb-6 h-8 w-8 text-gold" />
            <p className="font-serif text-2xl font-medium italic leading-relaxed text-gold-light sm:text-3xl">
              &ldquo;Within every woman lives the energy of the Goddess — waiting
              to be remembered, honoured and set free.&rdquo;
            </p>
            <p className="mt-6 font-serif text-lg text-white/60">&mdash; {brand.name}</p>
            <div className="mt-10">
              <Button href="/contact" size="lg" variant="gold">
                Begin Your Shakti Journey
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
