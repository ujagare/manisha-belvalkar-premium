import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, MessageCircle, CalendarDays, UserRound, PlayCircle, Lock, Clock3 } from "lucide-react";
import { courses } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import GoldDivider from "@/components/ui/GoldDivider";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) return { title: "Course not found" };
  return {
    title: course.title,
    description: course.description,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: { images: course.image ? [course.image] : undefined },
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();

  return (
    <>
      <section className="relative overflow-hidden bg-ivory pb-16 pt-32 lg:pb-24 lg:pt-40">
        <div className="glow-gold absolute -right-32 -top-32 h-[420px] w-[420px]" />
        <div className="glow-crimson absolute -bottom-32 -left-32 h-[380px] w-[380px]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-sm font-medium text-warmgray transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              All courses
            </Link>
          </Reveal>

          <div className="mt-10 grid items-center gap-14 lg:grid-cols-2">
            <div>
              <Reveal>
                <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-gold-soft px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-deep">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {course.duration}
                </span>
                <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-charcoal sm:text-6xl">
                  {course.title}
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 text-lg leading-relaxed text-warmgray">
                  {course.description}
                </p>
              </Reveal>
              <Reveal delay={0.25}>
                <div className="mt-8 flex flex-wrap gap-4">
                  {course.price ? (
                    <Button href={`/checkout/course/${course.slug}`} size="lg" variant="gold">
                      <Check className="h-4 w-4" />
                      Get this course · {formatINR(course.price)}
                    </Button>
                  ) : (
                    <Button href={`/checkout/course/${course.slug}`} size="lg" variant="gold">
                      <MessageCircle className="h-4 w-4" />
                      Enroll Now
                    </Button>
                  )}
                  {course.curriculum?.some((m) => m.lessons.some((l) => l.free)) ? (
                    <Button href={`/learn/${course.slug}/${course.curriculum.flatMap(m=>m.lessons).find(l=>l.free)!.id}`} size="lg" variant="outline">
                      Preview free lesson
                    </Button>
                  ) : null}
                  <Button href="/contact" size="lg" variant="outline">
                    Ask about this course
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal direction="left" delay={0.15}>
              <div className="gold-border-gradient relative overflow-hidden rounded-2xl">
                {/* Blurred cover backdrop + full contained artwork */}
                <div
                  className="h-[480px] w-full scale-125 bg-cover bg-center opacity-50 blur-2xl"
                  style={{ backgroundImage: `url('${course.image}')` }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-charcoal/10 via-transparent to-cream/40" />
                <div
                  className="absolute inset-0 bg-contain bg-center p-6"
                  style={{ backgroundImage: `url('${course.image}')`, backgroundRepeat: "no-repeat" }}
                />
                <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-white/90 p-5 backdrop-blur">
                  <p className="text-xs uppercase tracking-widest text-warmgray">
                    Program format
                  </p>
                  <p className="mt-1 font-display text-lg font-bold text-charcoal">
                    {course.duration}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-5 lg:gap-20">
            <Reveal className="lg:col-span-2">
              <h2 className="font-display text-4xl font-bold leading-tight text-charcoal">
                Course <span className="text-crimson-gradient">highlights</span>
              </h2>
              <p className="mt-4 leading-relaxed text-warmgray">
                Each course is carefully crafted to provide practical tools,
                personalized guidance, and profound insights that empower you to
                create lasting positive change.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-3">
              <ul className="space-y-4">
                {course.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-4 rounded-xl border border-parchment bg-white p-5"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="h-4 w-4" />
                    </span>
                    <span className="text-sm leading-relaxed text-ink sm:text-base">
                      {h}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Curriculum (engine for recorded learning) */}
      {course.curriculum && course.curriculum.length ? (
        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <Reveal className="text-center">
              <div className="eyebrow mb-4 text-gold-dark">Course curriculum</div>
              <h2 className="font-display text-4xl font-bold text-charcoal">
                What you&apos;ll <span className="text-crimson-gradient">learn</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-warmgray">
                Clean, structured modules you can follow at your own pace. Free lessons are watchable before you decide.
              </p>
            </Reveal>

            <div className="mt-12 space-y-6">
              {course.curriculum.map((module, mi) => (
                <Reveal key={module.module} delay={mi * 0.06}>
                  <div className="overflow-hidden rounded-[24px] border border-parchment bg-white">
                    <div className="flex items-center justify-between gap-4 border-b border-parchment bg-cream/50 px-6 py-4">
                      <h3 className="font-display text-lg font-bold text-charcoal">{module.module}</h3>
                      <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-warmgray">
                        {module.lessons.length} {module.lessons.length === 1 ? "lesson" : "lessons"}
                      </span>
                    </div>
                    <ul className="divide-y divide-parchment/60">
                      {module.lessons.map((lesson) => (
                        <li key={lesson.id} className="flex items-center gap-4 px-6 py-4">
                          {lesson.free ? (
                            <Link href={`/learn/${course.slug}/${lesson.id}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary transition hover:bg-primary hover:text-white" aria-label={`Play ${lesson.title}`}>
                              <PlayCircle className="h-5 w-5" />
                            </Link>
                          ) : (
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-warmgray" aria-hidden="true">
                              <Lock className="h-5 w-5" />
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-charcoal">{lesson.title}</p>
                            {lesson.description ? <p className="mt-0.5 text-sm text-warmgray">{lesson.description}</p> : null}
                          </div>
                          <span className="flex shrink-0 items-center gap-1 text-xs text-warmgray">
                            <Clock3 className="h-3.5 w-3.5" /> {lesson.duration}
                          </span>
                          {lesson.free ? <span className="shrink-0 rounded-full bg-gold-soft px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-deep">Free</span> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>

            {course.curriculum.some((m) => m.lessons.some((l) => l.free)) ? (
              <p className="mt-10 text-center text-sm text-warmgray">
                Locked content unlocks after you enroll.
                {course.price ? <Link href={`/checkout/course/${course.slug}`} className="ml-1 font-semibold text-primary underline underline-offset-2">Get the course for {formatINR(course.price)}</Link> : null}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Suitable for */}
      <section className="bg-mist py-20 lg:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <Reveal className="text-center">
            <div className="eyebrow mb-4 text-gold-dark">Who it&apos;s for</div>
            <h2 className="font-display text-4xl font-bold text-charcoal">
              This course is <span className="text-crimson-gradient">for you</span> if…
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {course.suitableFor.map((item, i) => (
              <Reveal key={item} delay={i * 0.1}>
                <div className="flex h-full flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm">
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-ink">
                    {item}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider className="pt-4" />
    </>
  );
}
