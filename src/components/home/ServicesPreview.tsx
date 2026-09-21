import Link from "next/link";
import { ArrowRight, Home, Sparkles, SunMedium } from "lucide-react";
import { services } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import HomeImageCard from "@/components/home/HomeImageCard";
import SacredSectionBackdrop from "@/components/home/SacredSectionBackdrop";

/** Home preview: the three core offerings. */
export default function ServicesPreview() {
  const featured = [
    services.find((s) => s.slug === "tarot-consultation-60")!,
    services.find((s) => s.slug === "well-being-program")!,
    services.find((s) => s.slug === "goddess-attunement")!,
  ];
  const visuals = {
    "tarot-consultation-60": {
      image: "/images/home-cards/tarot-consultation.png",
      icon: Sparkles,
      label: "Tarot",
    },
    "well-being-program": {
      image: "/images/home-cards/wellbeing-program.png",
      icon: SunMedium,
      label: "Well-being",
    },
    "goddess-attunement": {
      image: "/images/home-cards/goddess-attunement.png",
      icon: Sparkles,
      label: "Divine Feminine",
    },
  };

  return (
    <section className="relative overflow-hidden bg-mist py-24 lg:py-32">
      <SacredSectionBackdrop motif="orbit" className="opacity-40" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Work with Manisha"
          title={
            <>
              Offerings for your <span className="text-crimson-gradient">journey</span>
            </>
          }
          subtitle="Whether you're seeking insight into your life's path, harmony in your spaces, or a deeper understanding of your unique energy, these offerings provide the perfect blend of wisdom and intuition."
        />

        <div className="mt-16 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((service, i) => {
            const visual = visuals[service.slug as keyof typeof visuals];
            return (
            <Reveal key={service.slug} delay={i * 0.12}>
              <HomeImageCard
                href={`/services/${service.slug}`}
                image={visual.image}
                alt={service.title}
                eyebrow={visual.label}
                title={service.title}
                description={service.short}
                cta={service.price > 0 ? "View session" : "Book consultation"}
                icon={visual.icon}
              />
            </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2} className="mt-14 text-center">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary-dark"
          >
            View all services
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
