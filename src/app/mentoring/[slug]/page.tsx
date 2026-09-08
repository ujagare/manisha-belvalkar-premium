import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowLeft } from "lucide-react";
import { mentoringAreas, brand } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";
import CTASection from "@/components/home/CTASection";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return mentoringAreas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = mentoringAreas.find((a) => a.slug === slug);
  if (!area) return {};
  return { title: area.title, description: area.short };
}

export default async function MentoringDetailPage({ params }: Props) {
  const { slug } = await params;
  const area = mentoringAreas.find((a) => a.slug === slug);
  if (!area) notFound();

  return (
    <>
      <PageHero
        eyebrow="Mentoring"
        title={
          <>
            <span className="text-gold-shimmer">{area.title}</span>
          </>
        }
        subtitle={area.short}
      />

      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:px-10">
          <Reveal direction="right">
            <div className="gold-border-gradient relative h-72 overflow-hidden rounded-2xl lg:h-[480px]">
              <Parallax
                src={area.image}
                speed={0.35}
                className="transition-transform duration-700 hover:scale-105"
                containerClass="absolute inset-0"
                alt={area.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="eyebrow mb-4 text-gold-dark">What to expect</div>
            <h2 className="font-display text-3xl font-bold leading-tight text-charcoal sm:text-4xl">
              {area.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-warmgray">
              {area.description}
            </p>
            <ul className="mt-7 space-y-3">
              {area.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark shadow-sm shadow-gold/40">
                    <Check className="h-3.5 w-3.5 text-primary-deeper" strokeWidth={3} />
                  </span>
                  <span className="text-ink">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href={brand.whatsappHref} size="lg" variant="gold">
                Begin Your Journey
              </Button>
              <Link
                href="/mentoring"
                className="inline-flex items-center gap-2 text-sm font-medium text-warmgray transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                All mentoring areas
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}