import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { journeySteps } from "@/lib/phase-two-data";

export const metadata: Metadata = { title: "How It Works", description: "From choosing an offering to confirmation, preparation, delivery, and continued support.", alternates: { canonical: "/how-it-works" } };

export default function HowItWorksPage() {
  return <>
    <PageHero eyebrow="Your journey" image="/images/page-heroes/transformation-hero.png" imageAlt="A quiet path representing a considered personal journey" title={<>A clear path from <span className="text-gold-shimmer">intention to action</span></>} subtitle="Know exactly what happens before, during, and after a booking or order request." />
    <section className="bg-ivory py-20 lg:py-28"><div className="mx-auto max-w-6xl px-6 lg:px-10">
      <div className="space-y-0 border-y border-parchment">{journeySteps.map((step) => <article key={step.number} className="group grid gap-5 border-b border-parchment py-9 last:border-b-0 sm:grid-cols-[5rem_1fr_auto] sm:items-center sm:gap-8"><span className="font-serif text-3xl italic text-gold/70">{step.number}</span><div><h2 className="font-display text-2xl font-bold text-charcoal sm:text-3xl">{step.title}</h2><p className="mt-3 max-w-[66ch] leading-7 text-warmgray">{step.description}</p></div><span className="hidden h-px w-16 bg-gradient-to-r from-gold/70 to-transparent transition-all group-hover:w-24 lg:block" aria-hidden="true" /></article>)}</div>
    </div></section>
    <section className="bg-charcoal py-16 text-white"><div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10"><div className="flex gap-5"><ShieldCheck className="mt-1 h-7 w-7 shrink-0 text-gold" /><div><h2 className="font-display text-3xl font-bold">Clarity before commitment</h2><p className="mt-3 max-w-2xl leading-7 text-white/65">No booking is confirmed until the team verifies the offering, availability, fee, format, and next steps. Review the FAQ and policies before you proceed.</p></div></div><div className="flex flex-wrap gap-4"><Link href="/faq" className="font-semibold text-gold">Read FAQ</Link><Link href="/services" className="group inline-flex items-center gap-2 font-semibold text-white">Explore offerings <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></div></div></section>
  </>;
}
