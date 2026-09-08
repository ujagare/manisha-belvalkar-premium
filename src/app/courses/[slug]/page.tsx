import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Check,
  MessageCircle,
  CalendarDays,
  UserRound,
} from "lucide-react";
import { courses, brand } from "@/lib/data";
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
                  <Button href={`/checkout/course/${course.slug}`} size="lg" variant="gold">
                    <MessageCircle className="h-4 w-4" />
                    Enroll Now
                  </Button>
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

          <Reveal delay={0.2} className="mt-12 text-center">
            <p className="text-sm text-warmgray">
              Enrollment requires an eligibility conversation.
            </p>
            <div className="mt-5">
              <Button href={brand.whatsappHref} size="lg">
                <MessageCircle className="h-4 w-4" />
                Start your conversation
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <GoldDivider className="pt-4" />
    </>
  );
}
