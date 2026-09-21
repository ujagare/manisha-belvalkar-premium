import { HeartHandshake } from "lucide-react";
import { healingServices } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import GsapReveal from "@/components/ui/GsapReveal";
import HomeImageCard from "@/components/home/HomeImageCard";
import SacredSectionBackdrop from "@/components/home/SacredSectionBackdrop";

const healingImages: Record<string, string> = {
  "healing-sessions": "/images/home-cards/healing-session.png",
  "distance-healing": "/images/home-cards/distance-healing.png",
  "positive-energy": "/images/home-cards/positive-energy.png",
  "chakra-questionnaire": "/images/home-cards/chakra-assessment.png",
};

export default function HealingPreview() {
  return (
    <section className="relative overflow-hidden bg-mist py-20 lg:py-28">
      <SacredSectionBackdrop motif="petals" className="opacity-45" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Energy Healing"
          title="Return to balance"
          subtitle="Gentle, powerful practices — in person or at a distance — to restore harmony across body, mind and spirit."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {healingServices.map((service, i) => (
            <GsapReveal key={service.slug} delay={i * 0.08} y={50}>
              <HomeImageCard
                href={`/healing/${service.slug}`}
                image={healingImages[service.slug] ?? service.image}
                alt={service.title}
                eyebrow={String(i + 1).padStart(2, "0")}
                title={service.title}
                description={service.short}
                cta="Learn more"
                icon={HeartHandshake}
              />
            </GsapReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
