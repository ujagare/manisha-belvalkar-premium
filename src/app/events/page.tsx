import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { eventOfferings } from "@/lib/phase-two-data";

export const metadata: Metadata = { title: "Live Events and Workshops", description: "Explore online guidance sessions and live small-group workshops with Manisha Belvalkar.", alternates: { canonical: "/events" } };

export default function EventsPage() {
  return <>
    <PageHero eyebrow="Live experiences" image="/images/page-heroes/live-hero.png" imageAlt="An intimate stage prepared for an online live experience" title={<>Learn, reflect, and connect <span className="text-gold-shimmer">live</span></>} subtitle="Explore private online guidance and small-group workshops. New dates are confirmed directly with the team." />
    <section className="bg-ivory py-20 lg:py-28"><div className="mx-auto max-w-6xl px-6 lg:px-10"><div className="space-y-10">{eventOfferings.map((event, index) => <article key={event.slug} className="grid overflow-hidden rounded-[30px] border border-parchment bg-white shadow-[0_28px_75px_-52px_rgba(91,62,42,0.55)] md:grid-cols-2"><div className={`relative min-h-80 ${index % 2 ? "md:order-2" : ""}`}><Image src={event.image} alt={`Atmosphere for ${event.title}`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 to-transparent" /></div><div className="flex flex-col justify-center p-8 sm:p-10"><p className="eyebrow text-gold-dark">{event.eyebrow}</p><h2 className="mt-4 font-display text-3xl font-bold text-charcoal sm:text-4xl">{event.title}</h2><p className="mt-4 leading-7 text-warmgray">{event.description}</p><p className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary"><CalendarDays className="h-4 w-4" />Next date on enquiry · {event.format}</p><Link href={`/events/${event.slug}`} className="group mt-7 inline-flex items-center gap-2 font-semibold text-primary">View experience <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link></div></article>)}</div></div></section>
  </>;
}
