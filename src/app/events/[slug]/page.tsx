import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, MessageCircle } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { brand } from "@/lib/data";
import { eventOfferings } from "@/lib/phase-two-data";
import EventRegistrationButton from "@/components/backend/EventRegistrationButton";
import { isServerConfigured } from "@/lib/env";

interface Props { params: Promise<{ slug: string }> }
export function generateStaticParams() { return eventOfferings.map((event) => ({ slug: event.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const event = eventOfferings.find((item) => item.slug === slug); if (!event) return { title: "Event not found" }; return { title: event.title, description: event.description, alternates: { canonical: `/events/${event.slug}` } }; }

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params; const event = eventOfferings.find((item) => item.slug === slug); if (!event) notFound();
  const whatsapp = `${brand.whatsappHref.split("?")[0]}?text=${encodeURIComponent(`Hello Manisha, I would like to enquire about the next ${event.title}.`)}`;
  return <>
    <PageHero eyebrow={event.eyebrow} image={event.image} imageAlt={`Atmosphere for ${event.title}`} title={<>{event.title}</>} subtitle={event.description} />
    <section className="bg-ivory py-20 lg:py-28"><div className="mx-auto max-w-6xl px-6 lg:px-10"><Link href="/events" className="inline-flex items-center gap-2 text-sm font-medium text-warmgray hover:text-primary"><ArrowLeft className="h-4 w-4" />All live experiences</Link>
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-20"><div className="space-y-12"><section><p className="eyebrow text-gold-dark">A good fit if</p><ul className="mt-6 space-y-4">{event.audience.map((item) => <li key={item} className="flex gap-3 leading-7 text-warmgray"><Check className="mt-1 h-5 w-5 shrink-0 text-gold-dark" />{item}</li>)}</ul></section><section><h2 className="font-display text-3xl font-bold text-charcoal">What the experience includes</h2><ul className="mt-6 space-y-4">{event.includes.map((item) => <li key={item} className="flex gap-3 leading-7 text-warmgray"><Check className="mt-1 h-5 w-5 shrink-0 text-gold-dark" />{item}</li>)}</ul></section><section><h2 className="font-display text-3xl font-bold text-charcoal">How to prepare</h2><ol className="mt-6 space-y-4">{event.preparation.map((item, index) => <li key={item} className="grid grid-cols-[2rem_1fr] gap-3 leading-7 text-warmgray"><span className="font-serif italic text-gold-dark">0{index + 1}</span>{item}</li>)}</ol></section></div>
      <aside className="lg:sticky lg:top-28 lg:self-start"><div className="rounded-[26px] bg-charcoal p-7 text-white"><CalendarDays className="h-6 w-6 text-gold" /><p className="mt-5 text-xs uppercase tracking-[0.18em] text-gold-light">Format</p><p className="mt-2 font-semibold">{event.format}</p><p className="mt-5 text-xs uppercase tracking-[0.18em] text-gold-light">Duration</p><p className="mt-2 leading-6 text-white/75">{event.duration}</p><p className="mt-5 text-xs uppercase tracking-[0.18em] text-gold-light">Next date</p><p className="mt-2 leading-6 text-white/75">Confirmed directly with the team</p><a href={whatsapp} target="_blank" rel="noreferrer" className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-semibold text-primary-deeper"><MessageCircle className="h-4 w-4" />Enquire on WhatsApp</a><EventRegistrationButton slug={event.slug} title={event.title} manualMode={!isServerConfigured()} /></div><p className="mt-4 text-xs leading-5 text-warmgray">Review the refund policy and disclaimer before confirming a place.</p></aside></div>
    </div></section>
  </>;
}
