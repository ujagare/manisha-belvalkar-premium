import type { Metadata } from "next";
import { services } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceCard from "@/components/ui/ServiceCard";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Tap into the power of ancient wisdom through Tarot, Healing, and Well-being Sessions to attract good luck, positivity, and success.",
};

const categories = [
  {
    title: "Tarot Consultation",
    line: "Let Tarot show you the way",
    services: services.filter((s) => s.category === "tarot"),
  },
  {
    title: "Well-being Sessions",
    line: "Navigate life with confidence",
    services: services.filter((s) => s.category === "wellbeing"),
  },
  {
    title: "Space Clearing",
    line: "Energize and heal your space",
    services: services.filter((s) => s.category === "space-clearing"),
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Services for your{" "}
            <span className="text-crimson-gradient">soul</span>
          </>
        }
        subtitle="Tap into the power of ancient wisdom through Tarot, Healing, and Well-being Sessions to attract good luck, positivity, and success."
      />

      {categories.map((cat, ci) => (
        <section
          key={cat.title}
          className={ci % 2 === 1 ? "bg-mist py-20 lg:py-24" : "py-20 lg:py-24"}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionHeading
              eyebrow={String(ci + 1).padStart(2, "0")}
              title={cat.title}
              subtitle={cat.line}
            />
            <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {cat.services.map((service, i) => (
                <Reveal key={service.slug} delay={i * 0.1}>
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      <CTASection />
    </>
  );
}
