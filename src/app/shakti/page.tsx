import type { Metadata } from "next";
import { shaktiPillars } from "@/lib/data";
import GoldDivider from "@/components/ui/GoldDivider";
import ShaktiCardReading from "@/components/shakti/ShaktiCardReading";
import ShaktiPrograms from "@/components/shakti/ShaktiPrograms";
import ShaktiQuote from "@/components/shakti/ShaktiQuote";
import ShaktiNurtures from "@/components/shakti/ShaktiNurtures";
import {
  ShaktiOracleCollection,
} from "@/components/shakti/ShaktiOverview";
import LeadCaptureForm from "@/components/backend/LeadCaptureForm";
import { isServerConfigured } from "@/lib/env";

export const metadata: Metadata = {
  title: "Shakti Oracle Deck & Divine Feminine Healing",
  description:
    "Discover Shakti: divine feminine wisdom, the 52-card Shakti Oracle inspired by 51 Shakti Peethas, Goddess Invocation Sadhana, healing and a six-month transformation journey with Dr. Manisha Belvalkar.",
  alternates: { canonical: "/shakti" },
  openGraph: {
    title: "Shakti — Divine Feminine Wisdom & Transformation",
    description: "Oracle wisdom, sacred practice, healing and a guided six-month journey with Dr. Manisha Belvalkar.",
    images: ["/images/page-heroes/shakti-hero.webp"],
  },
};

export default function ShaktiPage() {
  return (
    <>
      <div id="oracle-reading" className="scroll-mt-24">
        <ShaktiCardReading />
      </div>

      <ShaktiOracleCollection />

      <div id="shakti-programs" className="scroll-mt-24">
        <ShaktiPrograms />
      </div>

      <ShaktiNurtures pillars={shaktiPillars} />

      <ShaktiQuote />

      <section className="bg-ivory px-4 py-12 sm:px-6 sm:py-16 lg:py-20"><div className="mx-auto max-w-2xl text-center"><p className="eyebrow text-gold-dark">Stay close to Shakti</p><h2 className="mt-3 font-display text-2xl font-bold text-charcoal sm:mt-4 sm:text-4xl">Receive new guidance first</h2><LeadCaptureForm kind="waitlist" source="shakti-page" manualMode={!isServerConfigured()} /></div></section>

      <GoldDivider />
    </>
  );
}
