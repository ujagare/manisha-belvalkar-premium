import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { shaktiPillars } from "@/lib/data";
import GoldDivider from "@/components/ui/GoldDivider";
import ShaktiCardReading from "@/components/shakti/ShaktiCardReading";
import ShaktiPrograms from "@/components/shakti/ShaktiPrograms";
import ShaktiQuote from "@/components/shakti/ShaktiQuote";
import ShaktiNurtures from "@/components/shakti/ShaktiNurtures";
import {
  ShaktiChapterNav,
  ShaktiOracleCollection,
} from "@/components/shakti/ShaktiOverview";
import LeadCaptureForm from "@/components/backend/LeadCaptureForm";
import Reveal from "@/components/ui/Reveal";
import { isServerConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Shakti Oracle Deck & Divine Feminine",
  description:
    "Discover the Shakti Oracle Deck by Dr. Manisha Belvalkar — inspired by the 51 Shakti Peethas, with Goddess Invocation Sadhana and a six-month journey.",
  alternates: { canonical: "/shakti" },
  openGraph: {
    title: "Shakti — Divine Feminine Wisdom & Transformation",
    description:
      "Oracle wisdom, sacred practice, healing and a guided six-month journey with Dr. Manisha Belvalkar.",
    images: ["/images/page-heroes/shakti-hero.webp"],
  },
};

export default function ShaktiPage() {
  return (
    <>
      <h1 className="sr-only">
        Shakti Oracle Deck &amp; Divine Feminine Healing
      </h1>

      <div id="oracle-reading" className="scroll-mt-16">
        <ShaktiCardReading variant="shakti" />
      </div>

      <ShaktiChapterNav />

      <ShaktiOracleCollection />

      <div id="shakti-programs" className="scroll-mt-20">
        <ShaktiPrograms />
      </div>

      <ShaktiNurtures pillars={shaktiPillars} />

      <ShaktiQuote />

      <section
        id="shakti-waitlist"
        aria-labelledby="shakti-waitlist-title"
        className="relative scroll-mt-20 overflow-hidden bg-cream px-4 py-16 sm:px-6 sm:py-24 lg:px-10 lg:py-28"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-gold/12 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <div className="grid items-center gap-8 rounded-[1.75rem] border border-gold/30 bg-ivory/85 p-6 shadow-[0_32px_80px_-48px_rgba(78,14,10,0.38)] sm:rounded-[2.25rem] sm:p-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 lg:p-14">
              <div>
                <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary-dark">
                  <span className="h-px w-8 bg-primary/70" aria-hidden="true" />
                  Stay close to Shakti
                </span>
                <h2
                  id="shakti-waitlist-title"
                  className="mt-4 text-balance font-display text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.02em] text-charcoal sm:text-4xl lg:text-[2.85rem]"
                >
                  Receive new guidance{" "}
                  <span className="text-crimson-gradient">first.</span>
                </h2>
                <p className="mt-4 max-w-[46ch] text-pretty text-sm leading-7 text-warmgray sm:text-base sm:leading-8">
                  Be notified when upcoming Shakti Transformation cohorts, Goddess Invocation Sadhana dates and new sacred releases open.
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-gold/25 pt-5 text-xs font-medium text-charcoal/80 sm:text-sm">
                  <li className="flex items-center gap-2.5">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold-deep" aria-hidden="true" />
                    Early invitations to the 52-day Sadhana &amp; 6-month cohort
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-gold-deep" aria-hidden="true" />
                    Direct WhatsApp confirmation — private, never spammed
                  </li>
                </ul>
              </div>

              <div>
                <LeadCaptureForm
                  kind="waitlist"
                  source="shakti-page"
                  manualMode={!isServerConfigured()}
                  hideHeading
                  className="mt-0"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <GoldDivider />
    </>
  );
}
