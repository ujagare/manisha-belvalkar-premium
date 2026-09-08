import Link from "next/link";
import { ArrowRight, HeartHandshake } from "lucide-react";
import { healingServices } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import GsapReveal from "@/components/ui/GsapReveal";

export default function HealingPreview() {
  return (
    <section className="bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Healing"
          title="Return to balance"
          subtitle="Gentle, powerful practices — in person or at a distance — to restore harmony across body, mind and spirit."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {healingServices.map((service, i) => (
            <GsapReveal key={service.slug} delay={i * 0.08} y={50}>
              <Link
                href={`/healing/${service.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-7 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-2 hover:border-gold/50 hover:shadow-[0_35px_80px_-30px_rgba(221,184,41,0.45)]"
              >
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/25 ring-1 ring-gold/30 transition-transform duration-500 group-hover:scale-105">
                  <HeartHandshake className="h-5 w-5 text-gold-light" />
                </div>
                <h3 className="relative font-display text-xl font-bold text-charcoal transition-colors duration-300 group-hover:text-primary">
                  {service.title}
                </h3>
                <p className="relative mt-2 flex-1 text-sm leading-relaxed text-warmgray">
                  {service.short}
                </p>
                <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </GsapReveal>
          ))}
        </div>
      </div>
    </section>
  );
}