import type { Metadata } from "next";
import { Smartphone, Check } from "lucide-react";
import { appName, appTagline, appFeatures, brand } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "App",
  description: appTagline,
};

export default function AppPage() {
  return (
    <>
      <PageHero
        eyebrow="App"
        image="/images/page-heroes/app-hero.png"
        imageAlt="SHAKTI spiritual companion app presented in a refined studio setting"
        title={
          <>
            Your spiritual companion,{" "}
            <span className="text-gold-shimmer">in your pocket</span>
          </>
        }
        subtitle={appTagline}
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal direction="right">
              <div className="gold-border-gradient mx-auto flex h-96 w-64 flex-col items-center justify-center rounded-[2.5rem] bg-charcoal p-8 shadow-2xl shadow-gold/10">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-gold">
                  <Smartphone className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl font-bold text-white">
                    {appName}
                  </div>
                  <div className="mt-2 text-xs text-white/60">
                    Coming soon to your app store
                  </div>
                </div>
                <div className="mt-8 h-px w-24 bg-gold/30" />
                <div className="mt-6 space-y-3 text-center">
                  <div className="text-[0.6rem] uppercase tracking-[0.25em] text-gold">
                    Guidance · Healing · Wisdom
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <SectionHeading
                eyebrow="App Features"
                title="Everything you need, beautifully together"
                align="left"
              />
              <ul className="mt-8 space-y-4">
                {appFeatures.map((f) => (
                  <li key={f.title} className="flex items-start gap-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                      <Check className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="font-semibold text-ink">{f.title}</div>
                      <div className="text-sm text-warmgray">{f.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-9">
                <Button href={brand.whatsappHref} size="lg" variant="gold">
                  Get notified on launch
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
