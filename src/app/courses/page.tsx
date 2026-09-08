import type { Metadata } from "next";
import Link from "next/link";
import { courses, brand } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import GoldDivider from "@/components/ui/GoldDivider";
import CTASection from "@/components/home/CTASection";
import { MessageCircle, Check, Sparkles, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Dr Manisha Belvalkar's courses are designed to guide you on a transformative journey of self-discovery, healing, and spiritual growth.",
};

export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Courses"
        title={
          <>
            Transformative <span className="text-crimson-gradient">courses</span>
          </>
        }
        subtitle="Dr Manisha Belvalkar's courses are designed to guide you on a transformative journey of self-discovery, healing, and spiritual growth."
      />

      {/* Course cards */}
      <section className="relative py-20 lg:py-28">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(221,184,41,0.06),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-8 md:grid-cols-2">
            {courses.map((course, i) => (
              <Reveal key={course.slug} delay={(i % 2) * 0.12}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-2 hover:border-gold/50 hover:shadow-[0_35px_80px_-30px_rgba(221,184,41,0.45)]">
                  {/* Image — blurred cover backdrop + full contained artwork (any aspect ratio) */}
                  <div className="relative h-60 overflow-hidden bg-ivory">
                    <div
                      className="absolute inset-0 scale-125 bg-cover bg-center opacity-50 blur-2xl"
                      style={{ backgroundImage: `url('${course.image}')` }}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-charcoal/10 via-transparent to-cream/60" />
                    <div
                      className="absolute inset-0 bg-contain bg-center p-4 transition-transform duration-1000 ease-out group-hover:scale-[1.05]"
                      style={{ backgroundImage: `url('${course.image}')`, backgroundRepeat: "no-repeat" }}
                    />
                    {/* Duration glass chip */}
                    <span className="absolute bottom-4 left-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-charcoal/45 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-gold-light" />
                      {course.duration}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col px-7 pb-7 pt-6">
                    <h2 className="font-display text-2xl font-bold leading-tight text-charcoal transition-colors duration-300 group-hover:text-primary">
                      {course.title}
                    </h2>

                    {/* Ornamental divider */}
                    <div className="mt-4 flex items-center gap-3" aria-hidden="true">
                      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/40" />
                      <span className="font-serif text-sm text-gold">✦</span>
                      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-gold/40" />
                    </div>

                    <p className="mt-4 flex-1 text-sm leading-relaxed text-warmgray">
                      {course.description}
                    </p>

                    <ul className="mt-5 space-y-2.5">
                      {course.highlights.slice(0, 3).map((h) => (
                        <li
                          key={h}
                          className="flex items-start gap-2.5 text-sm text-ink"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark shadow-sm shadow-gold/40">
                            <Check className="h-3 w-3 text-primary-deeper" strokeWidth={3} />
                          </span>
                          {h}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex items-center gap-3 border-t border-parchment/70 pt-6">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-dark px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110"
                      >
                        Learn More
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <a
                        href={brand.whatsappHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gold/50 bg-white px-5 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:bg-gold hover:text-primary-deeper"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Enquire
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How to enroll */}
      <section className="bg-charcoal py-20 text-white lg:py-24">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <Reveal>
            <div className="eyebrow mb-4 text-gold">How to Enroll</div>
            <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
              Begin with a <span className="text-gold">conversation</span>
            </h2>
            <p className="mt-6 leading-relaxed text-white/70">
              To join a course, an eligibility conversation is required. Send a
              WhatsApp message with your full name and why you are interested in
              the course. Once eligibility is confirmed, further enrollment
              details will be shared.
            </p>
            <div className="mt-9">
              <Button
                href={brand.whatsappHref}
                size="lg"
                variant="gold"
              >
                <MessageCircle className="h-5 w-5" />
                Message on WhatsApp
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <GoldDivider className="pt-4" />

      <CTASection />
    </>
  );
}
