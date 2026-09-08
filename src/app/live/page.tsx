import type { Metadata } from "next";
import { Radio, Calendar, Video } from "lucide-react";
import { liveEvents, brand } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Live Sessions",
  description:
    "Online sessions and interactive live workshops with Dr. Manisha Belvalkar.",
};

const icons = [Video, Calendar];

export default function LivePage() {
  return (
    <>
      <PageHero
        eyebrow="Live"
        title={
          <>
            Experience it{" "}
            <span className="text-gold-shimmer">live</span>
          </>
        }
        subtitle="Online sessions and interactive live workshops — Tarot, healing and self-development from anywhere in the world."
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Live Offerings"
            title="Join from anywhere"
            subtitle="Small-group and one-on-one experiences, held online."
          />

          <div className="mt-14 grid gap-7 md:grid-cols-2">
            {liveEvents.map((event, i) => {
              const Icon = icons[i] ?? Radio;
              return (
                <Reveal key={event.title} delay={i * 0.1}>
                  <div className="gold-border-gradient group relative h-full overflow-hidden rounded-2xl bg-white p-9 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/10">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="eyebrow mb-3 inline-block rounded-full bg-gold-soft px-3 py-1 text-gold-dark">
                      {event.format}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-charcoal">
                      {event.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-warmgray">
                      {event.description}
                    </p>
                    <Button
                      href={brand.whatsappHref}
                      className="mt-7"
                      variant="primary"
                    >
                      Enquire for next session
                    </Button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}