import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CircleCheck,
  Clock3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Video,
} from "lucide-react";
import { healingServices } from "@/lib/data";
import SessionBookingForm from "@/components/services/SessionBookingForm";
import InternalSubmenu from "@/components/layout/InternalSubmenu";
import { isServerConfigured } from "@/lib/env";

interface Props {
  params: Promise<{ slug: string }>;
}

const legacyHealingRedirects: Record<string, string> = {
  "goddess-healing": "shakti-healing",
  "chakra-healing": "healing-sessions",
  "positive-energy": "healing-sessions",
  "chakra-questionnaire": "healing-sessions",
};

export function generateStaticParams() {
  return [
    ...healingServices.map((service) => ({ slug: service.slug })),
    ...Object.keys(legacyHealingRedirects).map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = healingServices.find((item) => item.slug === slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.short,
    alternates: { canonical: `/healing/${service.slug}` },
    openGraph: { images: [service.image] },
  };
}

export default async function HealingDetailPage({ params }: Props) {
  const { slug } = await params;
  if (legacyHealingRedirects[slug]) redirect(`/healing/${legacyHealingRedirects[slug]}`);

  const service = healingServices.find((item) => item.slug === slug);
  if (!service) notFound();

  return (
    <>
      <InternalSubmenu
        activeHref={`/healing/${service.slug}`}
        backHref="/healing"
        backLabel="All healing"
        items={healingServices.map((item) => ({ href: `/healing/${item.slug}`, label: item.title }))}
        label="Healing"
      />

      <div className="relative overflow-hidden bg-ivory pb-28 pt-28 lg:pb-24 lg:pt-36">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_82%_8%,rgba(221,184,41,0.18),transparent_32%),radial-gradient(circle_at_8%_24%,rgba(107,11,11,0.09),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <Link href="/healing" className="inline-flex items-center gap-2 text-sm font-semibold text-warmgray transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
            <ArrowLeft className="h-4 w-4" /> All healing services
          </Link>

          <div className="mt-7 grid min-w-0 items-start gap-10 2xl:grid-cols-[minmax(0,1fr)_minmax(26rem,31rem)] 2xl:gap-14">
            <article className="min-w-0">
              <section className="overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_80px_-48px_rgba(62,38,25,0.55)] ring-1 ring-parchment/90">
                <div className="grid">
                  <div className="relative h-[22rem] overflow-hidden bg-charcoal sm:h-[28rem] lg:h-[30rem]">
                    <Image
                      src={service.image}
                      alt=""
                      fill
                      priority
                      sizes="(max-width: 1535px) 100vw, 52vw"
                      className="scale-110 object-cover opacity-45 blur-2xl"
                      aria-hidden="true"
                    />
                    <Image
                      src={service.image}
                      alt={`${service.title} with Dr. Manisha Belvalkar`}
                      fill
                      priority
                      sizes="(max-width: 1535px) 100vw, 52vw"
                      className="object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-transparent to-transparent" />
                    <div className="absolute inset-x-5 bottom-5 rounded-2xl bg-charcoal/80 p-4 text-white backdrop-blur-md ring-1 ring-white/15">
                      <p className="font-display text-lg font-semibold">Dr. Manisha Belvalkar</p>
                      <p className="mt-1 text-xs leading-5 text-white/70">Energy healer, mentor and spiritual guide</p>
                    </div>
                  </div>

                  <div className="min-w-0 p-6 sm:p-8 lg:p-9">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary">
                      <CircleCheck className="h-4 w-4" /> Private one-to-one session
                    </div>
                    <h1 className="mt-5 max-w-full [overflow-wrap:anywhere] text-balance font-display text-4xl font-semibold leading-[1.05] tracking-[-0.025em] text-charcoal sm:text-[2.75rem] 2xl:text-5xl">{service.title}</h1>
                    <p className="mt-4 max-w-prose text-pretty text-[0.95rem] leading-7 text-warmgray sm:text-base">{service.description}</p>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center gap-3 rounded-2xl bg-ivory/70 p-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-primary shadow-sm"><Video className="h-5 w-5" /></span>
                        <div><p className="text-sm font-semibold text-charcoal">Online available</p><p className="mt-0.5 text-xs text-warmgray">Private video session</p></div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl bg-ivory/70 p-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-primary shadow-sm"><Clock3 className="h-5 w-5" /></span>
                        <div><p className="text-sm font-semibold text-charcoal">IST scheduling</p><p className="mt-0.5 text-xs text-warmgray">Choose your preferred slot</p></div>
                      </div>
                    </div>

                    <ul className="mt-7 space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-ink">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-gold-deep" strokeWidth={2.5} /> {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mt-8 grid gap-4 sm:grid-cols-3" aria-label="Session assurances">
                {[
                  { icon: ShieldCheck, title: "30+ years of practice", copy: "Experienced, intuitive guidance" },
                  { icon: LockKeyhole, title: "Confidential", copy: "A private and respectful space" },
                  { icon: Sparkles, title: "Personalised", copy: "Prepared around your intention" },
                ].map(({ icon: Icon, title, copy }) => (
                  <div key={title} className="border-l border-gold/45 pl-4">
                    <Icon className="h-5 w-5 text-primary" />
                    <h2 className="mt-3 text-sm font-semibold text-charcoal">{title}</h2>
                    <p className="mt-1 text-xs leading-5 text-warmgray">{copy}</p>
                  </div>
                ))}
              </section>

              <section className="mt-12 max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">How your online session works</p>
                <h2 className="mt-3 text-balance font-display text-3xl font-semibold text-charcoal sm:text-4xl">A calm, simple path from booking to aftercare.</h2>
                <ol className="mt-7 grid gap-5 sm:grid-cols-3">
                  {[
                    ["01", "Choose a time", "Select online and share your preferred date and IST time."],
                    ["02", "Get confirmation", "The team confirms availability, fee and video details on WhatsApp."],
                    ["03", "Join privately", "Meet from a quiet space and receive your personal aftercare guidance."],
                  ].map(([number, title, copy]) => (
                    <li key={number} className="rounded-2xl bg-white/65 p-5 ring-1 ring-parchment/80">
                      <span className="font-mono text-xs font-bold text-gold-deep">{number}</span>
                      <h3 className="mt-3 text-sm font-semibold text-charcoal">{title}</h3>
                      <p className="mt-2 text-xs leading-5 text-warmgray">{copy}</p>
                    </li>
                  ))}
                </ol>
              </section>
            </article>

            <aside id="book-session" className="min-w-0 scroll-mt-28">
              <SessionBookingForm type="healing" slug={service.slug} title={service.title} manualMode={!isServerConfigured()} />
            </aside>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-parchment bg-white/95 p-3 shadow-[0_-12px_35px_-22px_rgba(62,38,25,0.5)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-pretty text-[11px] font-semibold leading-4 text-charcoal sm:text-xs">{service.title}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-warmgray"><Video className="h-3 w-3 text-primary" /> Online session available</p>
          </div>
          <a href="#book-session" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-xs font-bold text-white shadow-lg shadow-primary/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
            <CalendarDays className="h-4 w-4" /> Book session
          </a>
        </div>
      </div>
    </>
  );
}
