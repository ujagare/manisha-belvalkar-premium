import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { testimonials } from "@/lib/data";

export const metadata: Metadata = { title: "Client Experiences & Reviews", description: "Personal reflections and reviews shared by clients of Dr. Manisha Belvalkar — Tarot, healing, mentoring and spiritual guidance.", alternates: { canonical: "/testimonials" } };

export default function TestimonialsPage() {
  return <>
    <PageHero eyebrow="Client experiences" image="/images/page-heroes/community-hero.webp" imageAlt="A warm circle representing shared personal experiences" title={<>Words from journeys of <span className="text-gold-shimmer">clarity and change</span></>} subtitle="Personal reflections from people who chose guidance, learning, healing, or spiritual practice with Manisha." />
    <section className="bg-ivory py-12 sm:py-20 lg:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <p className="max-w-3xl text-pretty text-sm sm:text-base leading-6 sm:leading-7 text-warmgray">These accounts describe individual experiences. Names and roles are published with the information available to us; outcomes vary and are not promised or guaranteed.</p>
      <div className="mt-8 sm:mt-12 columns-1 gap-5 sm:gap-6 md:columns-2 lg:columns-3">{testimonials.map((item, index) => <article key={`${item.name}-${index}`} className="mb-4 sm:mb-6 break-inside-avoid rounded-2xl sm:rounded-[24px] bg-white p-5 sm:p-7 shadow-[0_18px_55px_-38px_rgba(91,62,42,0.5)]"><Quote className="h-5 w-5 sm:h-6 sm:w-6 text-gold" /><blockquote className="mt-3 sm:mt-5 text-pretty font-serif text-lg sm:text-xl leading-7 sm:leading-8 text-charcoal">“{item.text}”</blockquote><div className="mt-4 sm:mt-6 border-t border-parchment pt-4 sm:pt-5"><p className="font-semibold text-primary">{item.name}</p><p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-warmgray">{item.role}</p></div></article>)}</div>
    </div></section>
    <section className="bg-cream py-10 sm:py-14"><div className="mx-auto flex max-w-5xl flex-col gap-4 sm:gap-5 px-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal">Choose your own next step</h2><p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-warmgray">Explore the offering that fits your present intention.</p></div><Link href="/services" className="group inline-flex min-h-11 items-center gap-2 font-semibold text-primary">Explore services <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></div></section>
  </>;
}
