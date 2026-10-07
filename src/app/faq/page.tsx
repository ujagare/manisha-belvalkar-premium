import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import FaqExplorer from "@/components/faq/FaqExplorer";
import { faqItems } from "@/lib/phase-two-data";

export const metadata: Metadata = { title: "Frequently Asked Questions", description: "Clear answers about bookings, spiritual sessions, courses, products, delivery, and your account.", alternates: { canonical: "/faq" } };

const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };

export default function FaqPage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <PageHero eyebrow="Help before you begin" image="/images/page-heroes/contact-hero.png" imageAlt="A calm space for clear questions and considered answers" title={<>Questions, answered with <span className="text-gold-shimmer">clarity</span></>} subtitle="Search practical answers about choosing, booking, attending, buying, and getting support." />
    <section className="bg-ivory py-20 lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-10"><FaqExplorer /></div></section>
    <section className="border-t border-parchment bg-cream py-14"><div className="mx-auto flex max-w-5xl flex-col gap-5 px-6 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display text-3xl font-bold text-charcoal">Still need a personal answer?</h2><p className="mt-2 text-warmgray">Share your question with the support team.</p></div><Link href="/support" className="group inline-flex items-center gap-2 font-semibold text-primary">Visit support <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></div></section>
  </>;
}
