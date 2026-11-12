import type { Metadata } from "next";
import { Radio, Calendar, Video } from "lucide-react";
import { liveEvents } from "@/lib/data";
import { eventOfferings } from "@/lib/phase-two-data";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Live Online Sessions & Tarot Workshops",
  description:
    "Join online guidance sessions and interactive live workshops with Dr. Manisha Belvalkar — Tarot, healing and spiritual growth from anywhere in India.",
  alternates: { canonical: "/live" },
};

const icons = [Video, Calendar];

export default function LivePage() {
  return (
    <>
      <PageHero
        eyebrow="Live"
        image="/images/page-heroes/live-hero.webp"
        imageAlt="An intimate stage prepared for a live wisdom circle"
        title={
          <>
            Experience it{" "}
            <span className="text-gold-shimmer">live</span>
          </>
        }
        subtitle="Online sessions and interactive live workshops — Tarot, healing and self-development from anywhere in the world."
      />

      <section className="py-12 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
          <SectionHeading
            eyebrow="Live Offerings"
            title="Join from anywhere"
            subtitle="Small-group and one-on-one experiences, held online."
          />

          <div className="mt-8 sm:mt-14 grid gap-5 sm:gap-7 md:grid-cols-2">
            {liveEvents.map((event, i) => {
              const Icon = icons[i] ?? Radio;
              return (
                <Reveal key={event.title} delay={i * 0.1}>
                  <div className="gold-border-gradient group relative h-full overflow-hidden rounded-2xl bg-white p-5 sm:p-9 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/10">
                    <div className="mb-4 sm:mb-6 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-primary-soft text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <span className="eyebrow mb-2.5 sm:mb-3 inline-block rounded-full bg-gold-soft px-3 py-1 text-gold-dark">
                      {event.format}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-charcoal">
                      {event.title}
                    </h3>
                    <p className="mt-2.5 sm:mt-3 text-sm sm:text-base leading-relaxed text-warmgray">
                      {event.description}
                    </p>
                    <Button
                      href={`/events/${eventOfferings[i]?.slug ?? ""}`}
                      className="mt-5 sm:mt-7"
                      variant="primary"
                    >
                      View experience
                    </Button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

    </>
  );
}
