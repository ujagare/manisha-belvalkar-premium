import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { healingServices, healingIntro, brand } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import GoldDivider from "@/components/ui/GoldDivider";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Healing",
  description:
    "From in-person sessions to distance healing, restore harmony across your body, mind and spirit.",
};

export default function HealingPage() {
  return (
    <>
      <PageHero
        eyebrow="Healing"
        title={
          <>
            Return to{" "}
            <span className="text-gold-shimmer">balance</span>
          </>
        }
        subtitle={healingIntro}
      />

      {/* Healing services */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Healing Services"
            title="Gentle, powerful ways to heal"
            subtitle="Every offering begins with understanding your energy and ends with practical aftercare."
          />

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {healingServices.map((service, i) => (
              <Reveal key={service.slug} delay={i * 0.08}>
                <Link
                  href={`/healing/${service.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-8 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-2 hover:border-gold/50 hover:shadow-[0_35px_80px_-30px_rgba(221,184,41,0.45)] sm:flex-row sm:items-center sm:gap-8"
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                  <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl ring-1 ring-gold/20 sm:h-44 sm:w-44">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-[1.08]"
                      style={{ backgroundImage: `url(${service.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
                  </div>
                  <div className="relative mt-6 flex flex-1 flex-col sm:mt-0">
                    <h3 className="font-display text-2xl font-bold text-charcoal transition-colors duration-300 group-hover:text-primary">
                      {service.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-3" aria-hidden="true">
                      <span className="h-px w-10 bg-gradient-to-r from-gold to-gold/30" />
                      <span className="font-serif text-sm text-gold">✦</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-warmgray">
                      {service.short}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {service.features.slice(0, 2).map((f) => (
                        <li key={f} className="flex items-start gap-2 text-xs text-warmgray">
                          <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark shadow-sm shadow-gold/40">
                            <Check className="h-2.5 w-2.5 text-primary-deeper" strokeWidth={3} />
                          </span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-dark px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/40 group-hover:brightness-110">
                      Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Chakra questionnaire highlight */}
      <section className="bg-mist py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <Reveal>
              <SectionHeading
                eyebrow="Begin Here"
                title="Not sure where to start?"
                align="left"
                subtitle="Begin with the Chakra Questionnaire — a guided assessment that reveals where your energy is balanced and where it needs attention."
              />
            </Reveal>
            <Reveal delay={0.15}>
              <div className="relative overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-8 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)]">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
                <ul className="relative space-y-4">
                  {[
                    "Complete a guided 7-chakra assessment",
                    "Receive your personal energy report",
                    "Get a recommended healing path",
                    "Start with a free discovery conversation",
                  ].map((step) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark shadow-sm shadow-gold/40">
                        <Check className="h-3.5 w-3.5 text-primary-deeper" strokeWidth={3} />
                      </span>
                      <span className="text-base text-ink">{step}</span>
                    </li>
                  ))}
                </ul>
                <Button href={brand.whatsappHref} className="mt-7 w-full" variant="gold">
                  Request the Questionnaire
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <GoldDivider />
      <CTASection />
    </>
  );
}