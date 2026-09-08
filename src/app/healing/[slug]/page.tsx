import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";
import { healingServices } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import CTASection from "@/components/home/CTASection";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return healingServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = healingServices.find((s) => s.slug === slug);
  if (!service) return {};
  return { title: service.title, description: service.short };
}

export default async function HealingDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = healingServices.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        eyebrow="Healing"
        title={
          <>
            <span className="text-gold-shimmer">{service.title}</span>
          </>
        }
        subtitle={service.short}
      />

      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:px-10">
          <Reveal direction="right">
            <div className="gold-border-gradient relative h-72 overflow-hidden rounded-2xl lg:h-[480px]">
              <Parallax
                src={service.image}
                speed={0.35}
                className="transition-transform duration-700 hover:scale-105"
                containerClass="absolute inset-0"
                alt={service.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="eyebrow mb-4 text-gold-dark">What&apos;s included</div>
            <h2 className="font-display text-3xl font-bold leading-tight text-charcoal sm:text-4xl">
              {service.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-warmgray">
              {service.description}
            </p>
            <ul className="mt-7 space-y-3">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark shadow-sm shadow-gold/40">
                    <Check className="h-3.5 w-3.5 text-primary-deeper" strokeWidth={3} />
                  </span>
                  <span className="text-ink">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href={`/checkout/healing/${service.slug}`} size="lg" variant="gold">
                Book a Healing Session
              </Button>
              <Link
                href="/healing"
                className="inline-flex items-center gap-2 text-sm font-medium text-warmgray transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                All healing services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}