import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { mentoringAreas } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import GsapReveal from "@/components/ui/GsapReveal";
import Parallax from "@/components/ui/Parallax";

export default function MentoringPreview() {
  const highlights = mentoringAreas.slice(0, 3);
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Mentoring"
          title="Tarot as a mirror, not a fortune"
          subtitle="One-on-one mentoring that helps you understand yourself, explore your patterns and find clarity."
        />

        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {highlights.map((area, i) => (
            <GsapReveal key={area.slug} delay={i * 0.1} y={60}>
              <Link
                href={`/mentoring/${area.slug}`}
                className="group relative flex h-full min-h-[320px] flex-col justify-end overflow-hidden rounded-[28px] bg-charcoal p-8 ring-1 ring-gold/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_35px_80px_-30px_rgba(221,184,41,0.45)]"
              >
                <Parallax
                  src={area.image}
                  speed={0.35}
                  containerClass="absolute inset-0"
                  className="opacity-35 transition-all duration-700 group-hover:opacity-55"
                  alt={area.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="relative z-10">
                  <span className="eyebrow mb-2 text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/70">{area.short}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-gold transition-all group-hover:gap-2">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </GsapReveal>
          ))}
        </div>

        <GsapReveal className="mt-10 text-center" y={30}>
          <Link
            href="/mentoring"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-all hover:gap-3"
          >
            All mentoring areas <ArrowRight className="h-4 w-4" />
          </Link>
        </GsapReveal>
      </div>
    </section>
  );
}