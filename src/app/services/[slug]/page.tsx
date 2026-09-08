import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Clock, ArrowLeft, Calendar } from "lucide-react";
import { services } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import GoldDivider from "@/components/ui/GoldDivider";
import ServiceCard from "@/components/ui/ServiceCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.title,
    description: service.short,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-ivory pb-16 pt-32 lg:pb-20 lg:pt-40">
        <div className="glow-gold absolute -right-32 -top-32 h-[400px] w-[400px]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-medium text-warmgray transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              All services
            </Link>
          </Reveal>

          <div className="mt-10 grid items-center gap-14 lg:grid-cols-2">
            <div>
              <Reveal>
                <div className="eyebrow mb-4 text-gold-dark">
                  {service.category.replace("-", " ")}
                </div>
                <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-charcoal sm:text-6xl">
                  {service.title}
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 text-lg leading-relaxed text-warmgray">
                  {service.description}
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-warmgray">
                    <Clock className="h-4 w-4 text-gold" />
                    {service.duration}
                  </div>
                  {service.badge ? (
                    <span className="rounded-full bg-gold-soft px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-deep">
                      {service.badge}
                    </span>
                  ) : null}
                  {service.mostBooked ? (
                    <span className="rounded-full bg-primary-soft px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                      Most Booked
                    </span>
                  ) : null}
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="mt-8 flex items-baseline gap-3">
                  {service.price > 0 ? (
                    <>
                      <span className="font-display text-5xl font-bold text-primary">
                        {formatINR(service.price)}
                      </span>
                      <span className="text-sm text-warmgray">/ session</span>
                    </>
                  ) : (
                    <span className="font-display text-3xl font-bold text-primary">
                      By Appointment
                    </span>
                  )}
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button href={`/checkout/service/${service.slug}`} size="lg" variant="gold">
                    <Calendar className="h-4 w-4" />
                    Book this session
                  </Button>
                  <Button href="/contact" size="lg" variant="outline">
                    Ask a question
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal direction="left" delay={0.15}>
              <div className="gold-border-gradient relative overflow-hidden rounded-[28px]">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={900}
                  height={1000}
                  className="h-[480px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-5 lg:gap-20">
            <Reveal className="lg:col-span-2">
              <h2 className="font-display text-4xl font-bold leading-tight text-charcoal">
                What&apos;s <span className="text-crimson-gradient">included</span>
              </h2>
              <p className="mt-4 leading-relaxed text-warmgray">
                Every session is deeply personal, drawing on over 30 years of
                practice to meet you exactly where you are.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-3">
              <ul className="grid gap-4 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="group flex items-start gap-3 rounded-[20px] border border-parchment bg-gradient-to-b from-white to-cream/70 p-5 shadow-[0_6px_24px_-16px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-[0_18px_40px_-24px_rgba(221,184,41,0.4)]"
                  >
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark shadow-sm shadow-gold/40">
                      <Check className="h-3.5 w-3.5 text-primary-deeper" strokeWidth={3} />
                    </span>
                    <span className="text-sm leading-relaxed text-ink">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* Other services */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal className="mb-12 text-center">
            <h2 className="font-display text-4xl font-bold text-charcoal">
              Explore more <span className="text-gold">offerings</span>
            </h2>
          </Reveal>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {others.map((service, i) => (
              <Reveal key={service.slug} delay={i * 0.1}>
                <ServiceCard service={service} compact />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
