import type { Metadata } from "next";
import { Smartphone, Check } from "lucide-react";
import { appName, appTagline, appFeatures, brand } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import LeadCaptureForm from "@/components/backend/LeadCaptureForm";
import { isServerConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "SHAKTI App Coming Soon",
  description: `${appTagline} The SHAKTI App is coming soon.`,
};

export default function AppPage() {
  return (
    <>
      <PageHero
        eyebrow="Coming Soon"
        image="/images/page-heroes/app-hero.png"
        imageAlt="SHAKTI spiritual companion app presented in a refined studio setting"
        title={
          <>
            The SHAKTI App is{" "}
            <span className="text-gold-shimmer">coming soon</span>
          </>
        }
        subtitle="A thoughtful space for daily guidance, healing practices and sacred wisdom, designed to stay close wherever life takes you."
      />

      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-14 border-y border-primary/15 bg-white/55 px-5 py-6 text-center sm:px-8">
              <p className="font-display text-2xl font-semibold text-charcoal sm:text-3xl">
                We are preparing something meaningful.
              </p>
              <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-warmgray sm:text-base">
                The app is currently in development. Join the launch list to be among the first to know when it becomes available.
              </p>
            </div>
          </Reveal>

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
              <LeadCaptureForm kind="waitlist" source="shakti-app" manualMode={!isServerConfigured()} />
            </Reveal>
          </div>
        </div>
      </section>

    </>
  );
}
