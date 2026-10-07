import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { testimonials } from "@/lib/data";

export const metadata: Metadata = { title: "Client Experiences", description: "Personal reflections shared by clients of Manisha Belvalkar.", alternates: { canonical: "/testimonials" } };

export default function TestimonialsPage() {
  return <>
    <PageHero eyebrow="Client experiences" image="/images/page-heroes/community-hero.png" imageAlt="A warm circle representing shared personal experiences" title={<>Words from journeys of <span className="text-gold-shimmer">clarity and change</span></>} subtitle="Personal reflections from people who chose guidance, learning, healing, or spiritual practice with Manisha." />
    <section className="bg-ivory py-20 lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-10">
      <p className="max-w-3xl text-pretty leading-7 text-warmgray">These accounts describe individual experiences. Names and roles are published with the information available to us; outcomes vary and are not promised or guaranteed.</p>
      <div className="mt-12 columns-1 gap-6 md:columns-2 lg:columns-3">{testimonials.map((item, index) => <article key={`${item.name}-${index}`} className="mb-6 break-inside-avoid rounded-[24px] bg-white p-7 shadow-[0_18px_55px_-38px_rgba(91,62,42,0.5)]"><Quote className="h-6 w-6 text-gold" /><blockquote className="mt-5 text-pretty font-serif text-xl leading-8 text-charcoal">“{item.text}”</blockquote><div className="mt-6 border-t border-parchment pt-5"><p className="font-semibold text-primary">{item.name}</p><p className="mt-1 text-sm text-warmgray">{item.role}</p></div></article>)}</div>
    </div></section>
    <section className="bg-cream py-14"><div className="mx-auto flex max-w-5xl flex-col gap-5 px-6 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display text-3xl font-bold text-charcoal">Choose your own next step</h2><p className="mt-2 text-warmgray">Explore the offering that fits your present intention.</p></div><Link href="/services" className="group inline-flex items-center gap-2 font-semibold text-primary">Explore services <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></div></section>
  </>;
}
