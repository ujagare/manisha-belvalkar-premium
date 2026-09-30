import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { courses } from "@/lib/data";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import GoldDivider from "@/components/ui/GoldDivider";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Premium spiritual learning pathways with Dr Manisha Belvalkar: one-to-one courses, group workshops, Zoom workshops, and WhatsApp workshops.",
  alternates: { canonical: "/courses" },
};

const courseTabs = [
  {
    label: "In Person One to One Courses",
    eyebrow: "Private Study",
    courseSlug: "personalized-wellbeing",
    description:
      "Deep personal guidance for seekers who want an intimate, tailored learning experience with direct attention.",
  },
  {
    label: "In Person Group Workshops",
    eyebrow: "Shared Practice",
    courseSlug: "advanced-chakra",
    description:
      "Immersive in-person learning for small groups, with practice, discussion, and grounded spiritual study.",
  },
  {
    label: "Online Zoom Workshops",
    eyebrow: "Live Online",
    courseSlug: "shri-vidya",
    description:
      "Structured live online workshops for serious learners who want presence, interaction, and continuity from anywhere.",
  },
  {
    label: "WhatsApp Workshop",
    eyebrow: "Guided Daily Practice",
    courseSlug: "aishwarya-siddhi",
    description:
      "A compact guided format with voice notes, texts, images, and step-by-step practice delivered through WhatsApp.",
  },
] as const;

export default function CoursesPage() {
  const tabsWithCourses = courseTabs
    .map((tab) => ({
      ...tab,
      course: courses.find((course) => course.slug === tab.courseSlug),
    }))
    .filter((tab) => tab.course);

  return (
    <>
      <PageHero
        eyebrow="Courses"
        image="/images/page-heroes/courses-hero.png"
        imageAlt="Handcrafted study books and learning cards in warm golden light"
        title={
          <>
            Transformative <span className="text-crimson-gradient">courses</span>
          </>
        }
        subtitle="Choose the learning format that fits your season: private one-to-one study, in-person group workshops, live Zoom workshops, or guided WhatsApp practice."
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
            eyebrow="Four Learning Formats"
            title="Select the way you want to learn"
            subtitle="Each tab leads into a curated course experience with a clear format, pace, and next step."
          />

          <div className="mx-auto mt-10 grid max-w-6xl gap-3 rounded-[2rem] border border-gold/20 bg-white/65 p-2 shadow-[0_20px_70px_-48px_rgba(107,11,11,0.45)] backdrop-blur-md md:grid-cols-4 md:rounded-full">
            {tabsWithCourses.map((tab, index) => (
              <a
                key={tab.label}
                href={`#${tab.course!.slug}`}
                className="rounded-full px-4 py-3 text-center text-[0.65rem] font-bold uppercase tracking-[0.15em] text-warmgray transition-all duration-300 hover:bg-primary hover:text-white"
              >
                {String(index + 1).padStart(2, "0")} {tab.label}
              </a>
            ))}
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {tabsWithCourses.map((tab, index) => {
              const course = tab.course!;

              return (
                <Reveal key={course.slug} delay={(index % 2) * 0.1}>
                  <article
                    id={course.slug}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-gold/20 bg-gradient-to-b from-white/95 to-cream/80 shadow-[0_20px_70px_-46px_rgba(107,11,11,0.55)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-gold/55 hover:shadow-[0_38px_90px_-42px_rgba(221,184,41,0.75)]"
                  >
                    <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold/20 opacity-70 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                    <div className="relative h-64 overflow-hidden bg-ivory">
                      <div
                        className="absolute inset-0 scale-125 bg-cover bg-center opacity-50 blur-2xl"
                        style={{ backgroundImage: `url('${course.image}')` }}
                        aria-hidden="true"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/10 via-transparent to-cream/60" />
                      <div
                        className="absolute inset-0 bg-contain bg-center p-5 transition-transform duration-1000 ease-out group-hover:scale-[1.05]"
                        style={{
                          backgroundImage: `url('${course.image}')`,
                          backgroundRepeat: "no-repeat",
                        }}
                      />
                      <span className="absolute bottom-4 left-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-charcoal/50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                        <Sparkles className="h-3 w-3 text-gold-light" />
                        {tab.eyebrow}
                      </span>
                    </div>

                    <div className="relative flex flex-1 flex-col px-7 pb-7 pt-6">
                      <p className="eyebrow mb-3 text-gold-dark">{tab.label}</p>
                      <h2 className="font-display text-2xl font-bold leading-tight text-charcoal transition-colors duration-300 group-hover:text-primary">
                        {course.title}
                      </h2>
                      <div className="mt-4 flex items-center gap-3" aria-hidden="true">
                        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/40" />
                        <span className="font-serif text-sm text-gold">*</span>
                        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-gold/40" />
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-warmgray">
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

                      <div className="mt-7 border-t border-parchment/70 pt-6">
                        <Link
                          href={`/courses/${course.slug}`}
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-dark px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110"
                        >
                          Learn More
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
