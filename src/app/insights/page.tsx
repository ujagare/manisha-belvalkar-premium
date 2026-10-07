import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText } from "lucide-react";
import InsightExplorer from "@/components/insights/InsightExplorer";

export const metadata: Metadata = {
  title: "Insights & Resources",
  description: "Grounded guides for spiritual reflection, session preparation, chakra awareness, Tarot consultations, and everyday wellbeing practices.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal px-6 pb-20 pt-36 text-white lg:px-10 lg:pb-24 lg:pt-44">
        <div className="pointer-events-none absolute right-[-8rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-14rem] left-[28%] h-[26rem] w-[26rem] rounded-full bg-gold/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <p className="eyebrow flex items-center gap-3 text-gold"><BookOpenText className="h-4 w-4" />Knowledge library</p>
          <h1 className="mt-7 max-w-4xl text-balance font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-8xl">Insight for the inner work.</h1>
          <div className="mt-8 grid max-w-4xl gap-6 border-t border-white/15 pt-7 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-2xl text-pretty text-base leading-8 text-white/70 sm:text-lg">Practical, responsible reading to help you prepare, reflect, and make informed choices. These resources support self-inquiry; they do not replace professional care.</p>
            <Link href="/editorial-policy" className="text-sm font-semibold text-gold underline decoration-gold/40 underline-offset-4 hover:text-gold-light">How we publish</Link>
          </div>
        </div>
      </section>
      <section className="bg-cream px-6 py-16 lg:px-10 lg:py-24"><div className="mx-auto max-w-7xl"><InsightExplorer /></div></section>
    </>
  );
}
