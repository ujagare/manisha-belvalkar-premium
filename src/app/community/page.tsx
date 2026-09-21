import type { Metadata } from "next";
import { HeartHandshake, Users, CalendarHeart, Sparkles } from "lucide-react";
import { communityIntro, communityPillars, brand } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join a community of women and seekers walking the path of self-discovery, healing and empowerment.",
};

const icons = [HeartHandshake, Sparkles, Users, CalendarHeart];

export default function CommunityPage() {
  return (
    <>
      <PageHero
        eyebrow="Community"
        image="/images/page-heroes/community-hero.png"
        imageAlt="An intimate sacred circle arranged with handcrafted cushions and flowers"
        title={
          <>
            Growth is sweeter{" "}
            <span className="text-gold-shimmer">together</span>
          </>
        }
        subtitle={communityIntro}
      />

      {/* Pillars */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Inside the Community"
            title="What members receive"
            subtitle="A like-hearted circle of women and seekers, guided by Dr. Manisha Belvalkar."
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {communityPillars.map((pillar, i) => {
              const Icon = icons[i] ?? HeartHandshake;
              return (
                <Reveal key={pillar.title} delay={i * 0.08}>
                  <div className="group relative h-full overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-8 text-center shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-2 hover:border-gold/50 hover:shadow-[0_35px_80px_-30px_rgba(221,184,41,0.45)]">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                    <div className="relative mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/25 ring-1 ring-gold/30 transition-all duration-500 group-hover:scale-105">
                      <Icon className="h-6 w-6 text-gold-light" />
                    </div>
                    <h3 className="relative font-display text-xl font-bold text-charcoal transition-colors duration-300 group-hover:text-primary">
                      {pillar.title}
                    </h3>
                    <div className="relative mx-auto mt-3 flex w-24 items-center gap-2" aria-hidden="true">
                      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/50" />
                      <span className="font-serif text-xs text-gold">✦</span>
                      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/50" />
                    </div>
                    <p className="relative mt-3 text-sm leading-relaxed text-warmgray">
                      {pillar.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="bg-charcoal py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <Reveal>
            <div className="eyebrow mb-5 text-gold">Join Our Community</div>
            <h2 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
              Begin your journey in{" "}
              <span className="text-gold-shimmer">sacred company</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70">
              Write to us to join the community and receive invitations to
              sacred circles, live sessions and member-only wisdom.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button href={brand.whatsappHref} size="lg" variant="gold">
                Request to Join
              </Button>
              <Button href={brand.emailHref} size="lg" variant="ghost">
                Write to Manisha
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
