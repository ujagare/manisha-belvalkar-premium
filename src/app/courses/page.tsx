import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { courses } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import GoldDivider from "@/components/ui/GoldDivider";

export const metadata: Metadata = {
  title: "Tarot, Chakra & Spiritual Courses in Mumbai & Pune",
  description:
    "Learn Tarot reading, chakra therapy and Goddess attunement with Dr. Manisha Belvalkar. One-to-one courses, group workshops, Zoom and WhatsApp workshops — beginner to advanced.",
  alternates: { canonical: "/courses" },
};

const courseOfferings = [
  {
    eyebrow: "Professional Tarot Training",
    courseSlug: "professional-tarot-reader",
    description:
      "Live online Tarot training with Basic and Advanced pathways for confident, ethical and professional reading practice.",
  },
  {
    eyebrow: "Online One-to-One",
    courseSlug: "personalized-wellbeing",
    description:
      "Six personalized online sessions with direct guidance through Zoom and ongoing WhatsApp support.",
  },
  {
    eyebrow: "Shared Practice",
    courseSlug: "advanced-chakra",
    description:
      "Immersive in-person learning for small groups, with practice, discussion, and grounded spiritual study.",
  },
  {
    eyebrow: "Live Online",
    courseSlug: "shri-vidya",
    description:
      "Structured live online workshops for serious learners who want presence, interaction, and continuity from anywhere.",
  },
  {
    eyebrow: "Guided Daily Practice",
    courseSlug: "aishwarya-siddhi",
    description:
      "A compact guided format with voice notes, texts, images, and step-by-step practice delivered through WhatsApp.",
  },
  {
    eyebrow: "Personal Reading",
    courseSlug: "soul-purpose-reading-course",
    description:
      "A deeply prepared personal reading based on your birth details and questions, with focused soul-purpose guidance.",
  },
] as const;

export default function CoursesPage() {
  const offeringsWithCourses = courseOfferings
    .map((tab) => ({
      ...tab,
      course: courses.find((course) => course.slug === tab.courseSlug),
    }))
    .filter((tab) => tab.course);

  return (
    <>
      <PageHero
        eyebrow="Courses"
        image="/images/page-heroes/courses-hero.webp"
        imageAlt="Handcrafted study books and learning cards in warm golden light"
        title={
          <>
            <span className="block whitespace-nowrap text-[2rem] min-[380px]:text-[2.25rem] sm:text-inherit">
              Transformative
            </span>
            <span className="block text-crimson-gradient">courses</span>
          </>
        }
        subtitle="Choose personalized online study, advanced chakra work, Shri Vidya, guided WhatsApp practice, or a Soul Purpose Reading."
      />

      <section className="relative overflow-hidden py-20 lg:py-28">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(221,184,41,0.09),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-36 bottom-10 h-[420px] w-[420px] rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeading
            eyebrow="Courses & Readings"
            title="Choose your next journey"
            subtitle="Explore each offering through its format, guidance, investment, and the experience it is designed to support."
          />

          <div className="mt-14 grid gap-8 lg:grid-cols-6">
            {offeringsWithCourses.map((tab, index) => {
              const course = tab.course!;

              return (
                <Reveal
                  key={course.slug}
                  delay={(index % 2) * 0.1}
                  className="lg:col-span-3"
                >
                  <article
                    id={course.slug}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-gold/25 bg-white shadow-[0_24px_70px_-44px_rgba(107,11,11,0.55)] transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_36px_90px_-42px_rgba(107,11,11,0.5)]"
                  >
                    <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold/20 opacity-70 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                    <div className="relative h-72 overflow-hidden bg-ivory sm:h-80">
                      <Image src={course.image} alt="" fill sizes="(max-width: 1024px) 92vw, 46vw" className="scale-125 object-cover opacity-50 blur-2xl" aria-hidden="true" />
                      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/5 via-transparent to-charcoal/35" />
                      <Image src={course.image} alt={course.title} fill sizes="(max-width: 1024px) 92vw, 46vw" className="object-contain p-3 transition-transform duration-1000 ease-out group-hover:scale-[1.04] sm:p-4" />
                      <span className="absolute bottom-4 left-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-charcoal/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                        <Sparkles className="h-3 w-3 text-gold-light" />
                        {tab.eyebrow}
                      </span>
                    </div>

                    <div className="relative flex flex-1 flex-col px-6 pb-7 pt-7 sm:px-8 sm:pb-8">
                      <h2 className="font-display text-3xl font-bold leading-tight text-charcoal transition-colors duration-300 group-hover:text-primary">
                        {course.title}
                      </h2>
                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold/20 bg-cream/60 px-4 py-3.5">
                        {course.price ? (
                          <div>
                            <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-warmgray">{course.pricingOptions?.length ? "Starting at" : "Investment"}</span>
                            <span className="font-display text-2xl font-bold text-primary">{formatINR(course.price)}</span>
                          </div>
                        ) : null}
                        <div className="max-w-[55%] text-right">
                          <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-warmgray">Format</span>
                          <span className="text-xs font-semibold leading-relaxed text-gold-deep">{course.duration}</span>
                        </div>
                      </div>
                      {course.pricingOptions?.length ? (
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {course.pricingOptions.map((option) => (
                            <div key={option.label} className="rounded-xl border border-gold/20 bg-white px-3.5 py-3">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-xs font-bold uppercase tracking-[0.14em] text-gold-deep">{option.label}</span>
                                <span className="font-display text-lg font-bold text-primary">{formatINR(option.price)}</span>
                              </div>
                              <p className="mt-1 text-xs text-warmgray">{option.format}</p>
                            </div>
                          ))}
                        </div>
                      ) : null}
                      <p className="mt-5 text-sm font-medium leading-relaxed text-charcoal/80">
                        {tab.description}
                      </p>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-warmgray">
                        {course.description}
                      </p>

                      <ul className="mt-5 space-y-2.5">
                        {course.highlights.slice(0, 3).map((highlight) => (
                          <li
                            key={highlight}
                            className="flex items-start gap-2.5 text-sm text-ink"
                          >
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-dark shadow-sm shadow-gold/40">
                              <Check
                                className="h-3 w-3 text-primary-deeper"
                                strokeWidth={3}
                              />
                            </span>
                            {highlight}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 border-t border-parchment/70 pt-6">
                        <Link
                          href={`/courses/${course.slug}`}
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-dark px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110"
                        >
                          View course details
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <GoldDivider className="pt-4" />
    </>
  );
}
