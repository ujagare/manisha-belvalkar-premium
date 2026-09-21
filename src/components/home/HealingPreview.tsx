"use client";

import { useRef } from "react";
import { HeartHandshake, ChevronLeft, ChevronRight } from "lucide-react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector<HTMLElement>(":scope > *");
    if (!card) return;
    const gap = 28;
    const amount = card.offsetWidth + gap;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-mist via-cream to-mist py-24 lg:py-32">
      <SacredSectionBackdrop motif="petals" className="opacity-45" />

      {/* Decorative glows */}
      <div className="glow-gold absolute -left-52 top-20 h-[500px] w-[500px]" />
      <div className="glow-crimson absolute -right-52 bottom-20 h-[500px] w-[500px]" />

      {/* Decorative top ornament line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[70%] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading
          eyebrow="Energy Healing"
          title="Return to balance"
          subtitle="Gentle, powerful practices — in person or at a distance — to restore harmony across body, mind and spirit."
        />

        <div className="mt-16 relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-white/80 shadow-[0_12px_36px_-8px_rgba(221,184,41,0.35)] backdrop-blur-md transition-all duration-300 hover:bg-gold/15 hover:border-gold/60 hover:shadow-[0_16px_44px_-8px_rgba(221,184,41,0.5)] hover:scale-110 cursor-pointer lg:-left-6"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-gold-dark" />
          </button>

          {/* Cards row */}
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-7 overflow-x-auto scroll-smooth pb-6 hide-scrollbar px-1"
          >
            {healingServices.map((service, i) => (
              <GsapReveal key={service.slug} delay={i * 0.08} y={50}>
                <div className="w-[300px] min-w-[300px] h-[480px] snap-start flex-shrink-0">
                  <HomeImageCard
                    href={`/healing/${service.slug}`}
                    image={healingImages[service.slug] ?? service.image}
                    alt={service.title}
                    eyebrow={String(i + 1).padStart(2, "0")}
                    title={service.title}
                    description={service.short}
                    cta="Learn more"
                    icon={HeartHandshake}
                    className="!h-full !min-h-0"
                  />
                </div>
              </GsapReveal>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-2 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-white/80 shadow-[0_12px_36px_-8px_rgba(221,184,41,0.35)] backdrop-blur-md transition-all duration-300 hover:bg-gold/15 hover:border-gold/60 hover:shadow-[0_16px_44px_-8px_rgba(221,184,41,0.5)] hover:scale-110 cursor-pointer lg:-right-6"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-gold-dark" />
          </button>
        </div>
      </div>

      {/* Decorative bottom ornament line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-[70%] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </section>
  );
}
