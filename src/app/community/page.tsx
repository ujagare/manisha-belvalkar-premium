import type { Metadata } from "next";
import { HeartHandshake, Users, CalendarHeart, Sparkles } from "lucide-react";
import { communityIntro, communityPillars, brand } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import LeadCaptureForm from "@/components/backend/LeadCaptureForm";
import { isServerConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Join Magic Community",
  description:
    "Join Magic Community for monthly moon cycle based guidance, tips, remedies and member-only offerings.",
  alternates: { canonical: "/community" },
};

const icons = [HeartHandshake, Sparkles, Users, CalendarHeart];

export default function CommunityPage() {
  return (
    <>
      <section className="relative isolate min-h-[640px] overflow-hidden bg-neutral-200 pt-24 text-white lg:min-h-[720px] lg:pt-28">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/page-heroes/community-hero.png')" }}
          aria-label="An intimate sacred circle arranged with handcrafted cushions and flowers"
        />
        <div className="absolute inset-0 bg-neutral-700/60" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(82,82,82,0.92)_0%,rgba(82,82,82,0.72)_42%,rgba(82,82,82,0.22)_76%,rgba(82,82,82,0.08)_100%)]" />
        <div className="absolute inset-y-0 left-[7%] hidden w-px bg-gradient-to-b from-transparent via-white/35 to-transparent lg:block" />

        <div className="relative mx-auto flex min-h-[540px] max-w-7xl items-end px-6 pb-16 pt-20 lg:min-h-[610px] lg:items-center lg:px-10 lg:pb-20">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow mb-6 flex items-center gap-4 text-white/85">
                <span className="h-px w-12 bg-gradient-to-r from-white to-transparent" />
                Community
              </div>
              <h1 className="max-w-[11ch] break-words font-display text-[2.25rem] font-bold leading-[1.06] text-white drop-shadow-[0_3px_24px_rgba(0,0,0,0.35)] sm:max-w-full sm:text-6xl lg:text-[5.15rem] lg:leading-[0.98]">
                Join Magic Community
                <span className="block text-gold-shimmer">
                  Growth is magical together
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-relaxed text-white/82 text-shadow-sm sm:text-lg">
                {communityIntro}
              </p>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
      </section>

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
            <LeadCaptureForm kind="community" source="community-page" manualMode={!isServerConfigured()} />
          </Reveal>
        </div>
      </section>

    </>
  );
}
