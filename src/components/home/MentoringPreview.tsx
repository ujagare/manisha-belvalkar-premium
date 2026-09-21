import Link from "next/link";
import { ArrowRight, Flame, ScrollText, Sparkles } from "lucide-react";
import { mentoringAreas } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import GsapReveal from "@/components/ui/GsapReveal";
import SacredSectionBackdrop from "@/components/home/SacredSectionBackdrop";
import HomeImageCard from "@/components/home/HomeImageCard";

const mentoringVisuals = [
  {
    image: "/images/page-heroes/mentoring-hero.png",
    icon: Sparkles,
    position: "left center",
  },
  {
    image: "/images/home-cards/tarot-consultation.png",
    icon: ScrollText,
    position: "center",
  },
  {
    image: "/images/home-cards/positive-energy.png",
    icon: Flame,
    position: "center",
  },
];

export default function MentoringPreview() {
  const highlights = mentoringAreas.slice(0, 3);
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      <SacredSectionBackdrop motif="arch" className="opacity-35" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Mentoring"
          title="Tarot as a mirror, not a fortune"
          subtitle="One-on-one mentoring that helps you understand yourself, explore your patterns and find clarity."
        />

        <div className="mt-14 grid items-stretch gap-7 md:grid-cols-3">
          {highlights.map((area, i) => (
            <GsapReveal key={area.slug} delay={i * 0.1} y={60}>
              <HomeImageCard
                href={`/mentoring/${area.slug}`}
                image={mentoringVisuals[i]?.image ?? area.image}
                alt={area.title}
                eyebrow={String(i + 1).padStart(2, "0")}
                title={area.title}
                description={area.short}
                cta="Explore"
                icon={mentoringVisuals[i]?.icon}
                imagePosition={mentoringVisuals[i]?.position}
              />
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
