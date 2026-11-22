"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Lock,
  PlayCircle,
} from "lucide-react";
import type { Course } from "@/lib/data";
import { formatINR } from "@/lib/utils";
import Reveal from "@/components/ui/Reveal";

type PathwayFilter = "all" | "practitioner" | "sadhana" | "syllabus";

const FILTER_OPTIONS: {
  id: PathwayFilter;
  label: string;
  count: number;
}[] = [
  { id: "all", label: "All pathways", count: 6 },
  { id: "practitioner", label: "Tarot & 1-on-1", count: 3 },
  { id: "sadhana", label: "Sadhana & Lineage", count: 3 },
  { id: "syllabus", label: "With Preview Lessons", count: 2 },
];

const COURSE_IMAGE_OVERRIDE: Record<string, string> = {
  "professional-tarot-reader": "/images/mentoring/tarot-mentoring.webp",
};

const COURSE_TRACK_LABEL: Record<string, string> = {
  "professional-tarot-reader": "Professional Certification",
  "personalized-wellbeing": "Private 1-on-1 Coaching",
  "shri-vidya": "Two-Year Sacred Lineage",
  "advanced-chakra": "Energy & Kundalini Study",
  "aishwarya-siddhi": "Guided Daily Sadhana",
  "soul-purpose-reading-course": "Birth Chart & Tarot Reading",
};

const PRACTITIONER_SLUGS = new Set([
  "professional-tarot-reader",
  "personalized-wellbeing",
  "soul-purpose-reading-course",
]);

const SADHANA_SLUGS = new Set([
  "shri-vidya",
  "advanced-chakra",
  "aishwarya-siddhi",
]);

function getCourseImage(course: Course): string {
  return COURSE_IMAGE_OVERRIDE[course.slug] ?? course.image;
}

function getCoursePriceLabel(course: Course): string {
  if (!course.price) return "On enquiry";
  if (course.pricingOptions?.length) {
    return `From ${formatINR(course.price)}`;
  }
  return formatINR(course.price);
}

function SyllabusDrawer({
  course,
  dark = false,
}: {
  course: Course;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (!course.curriculum?.length) return null;

  const totalLessons = course.curriculum.reduce(
    (sum, mod) => sum + mod.lessons.length,
    0,
  );
  const freeLesson = course.curriculum
    .flatMap((mod) => mod.lessons)
    .find((lesson) => lesson.free);

  return (
    <div
      className={`mt-3.5 border-t pt-3 sm:mt-5 sm:pt-4 ${
        dark ? "border-[#ddb829]/20" : "border-[#efe5d2]"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.04em] transition-all duration-300 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 sm:min-h-10 sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.06em] ${
            dark
              ? "border-[#ddb829]/40 bg-[#2c2521] text-[#f0d060] hover:border-[#f0d060] focus-visible:outline-[#f0d060]"
              : "border-[#d8c8ae] bg-[#faf6ef] text-[#6b0b0b] hover:border-[#a8871a] hover:bg-[#faf3dc] focus-visible:outline-[#a81414]"
          }`}
        >
          <BookOpen className="size-3 sm:size-3.5" strokeWidth={1.7} />
          <span>
            {open
              ? "Hide syllabus"
              : `Preview syllabus (${course.curriculum.length} modules · ${totalLessons} lessons)`}
          </span>
          <ChevronDown
            className={`size-3 transition-transform duration-300 sm:size-3.5 ${
              open ? "rotate-180" : ""
            }`}
            strokeWidth={1.8}
          />
        </button>

        {freeLesson ? (
          <Link
            href={`/learn/${course.slug}/${freeLesson.id}`}
            className={`inline-flex min-h-9 items-center gap-1.5 text-[11px] font-semibold underline underline-offset-4 transition-colors sm:min-h-10 sm:text-xs ${
              dark
                ? "text-[#f0d060] hover:text-white"
                : "text-[#981313] hover:text-[#6b0b0b]"
            }`}
          >
            <PlayCircle className="size-3 sm:size-3.5" strokeWidth={1.7} />
            Preview free lesson
          </Link>
        ) : null}
      </div>

      {open ? (
        <div
          className={`mt-3 grid gap-2.5 rounded-xl border p-3 sm:mt-4 sm:gap-3 sm:rounded-2xl sm:p-5 ${
            dark
              ? "border-[#ddb829]/25 bg-[#181412]"
              : "border-[#e6dac3] bg-[#faf6ef]"
          }`}
        >
          {course.curriculum.map((mod, index) => (
            <div
              key={mod.module}
              className={
                index > 0
                  ? `border-t pt-2.5 sm:pt-3 ${
                      dark ? "border-[#ddb829]/15" : "border-[#e6dac3]"
                    }`
                  : ""
              }
            >
              <div className="flex items-baseline justify-between gap-2">
                <p
                  className={`font-serif text-[13px] font-semibold sm:text-sm ${
                    dark ? "text-[#f0d060]" : "text-[#292524]"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}. {mod.module}
                </p>
                <span
                  className={`text-[10.5px] tabular-nums sm:text-[11px] ${
                    dark ? "text-[#d6cfc2]/75" : "text-[#57534e]"
                  }`}
                >
                  {mod.lessons.length} lessons
                </span>
              </div>
              <ul className="mt-1.5 space-y-1 sm:mt-2 sm:space-y-1.5">
                {mod.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className={`flex items-center justify-between gap-2.5 text-[11.5px] leading-5 sm:gap-3 sm:text-xs ${
                      dark ? "text-[#efe5d2]" : "text-[#44403c]"
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                      {lesson.free ? (
                        <PlayCircle
                          className={`size-3 shrink-0 sm:size-3.5 ${
                            dark ? "text-[#f0d060]" : "text-[#b41414]"
                          }`}
                          strokeWidth={1.8}
                        />
                      ) : (
                        <Lock
                          className={`size-3 shrink-0 ${
                            dark ? "text-[#d6cfc2]/50" : "text-[#78716c]"
                          }`}
                          strokeWidth={1.8}
                        />
                      )}
                      {lesson.free ? (
                        <Link
                          href={`/learn/${course.slug}/${lesson.id}`}
                          className="truncate font-semibold underline underline-offset-2"
                        >
                          {lesson.title}
                        </Link>
                      ) : (
                        <span className="truncate">{lesson.title}</span>
                      )}
                    </span>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 tabular-nums ${
                        dark ? "text-[#d6cfc2]/70" : "text-[#57534e]"
                      }`}
                    >
                      <Clock3 className="size-3" strokeWidth={1.6} />
                      {lesson.duration}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CourseActionButton({
  href,
  label = "View course details",
  variant = "crimson",
}: {
  href: string;
  label?: string;
  variant?: "crimson" | "outline" | "gold";
}) {
  if (variant === "gold") {
    return (
      <Link
        href={href}
        className="group/btn inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full bg-[#ddb829] py-1.5 pl-4 pr-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#1c1917] shadow-[0_14px_34px_-16px_rgba(221,184,41,0.55)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#f0d060] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0d060] sm:min-h-11 sm:gap-3 sm:py-2 sm:pl-5 sm:pr-2 sm:text-xs sm:tracking-[0.14em]"
      >
        <span>{label}</span>
        <span className="grid size-6 place-items-center rounded-full bg-[#1c1917]/12 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px group-hover/btn:scale-105 sm:size-7">
          <ArrowUpRight className="size-3 sm:size-3.5" strokeWidth={1.6} />
        </span>
      </Link>
    );
  }

  if (variant === "outline") {
    return (
      <Link
        href={href}
        className="group/btn inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full border border-[#c7a23b] bg-[#faf3dc]/70 py-1.5 pl-4 pr-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6b0b0b] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#ddb829] hover:text-[#1c1917] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a8871a] sm:min-h-11 sm:gap-3 sm:py-2 sm:pl-5 sm:pr-2 sm:text-xs sm:tracking-[0.14em]"
      >
        <span>{label}</span>
        <span className="grid size-6 place-items-center rounded-full bg-[#6b0b0b]/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px group-hover/btn:scale-105 sm:size-7">
          <ArrowUpRight className="size-3 sm:size-3.5" strokeWidth={1.6} />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group/btn inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-full bg-[#b41414] py-1.5 pl-4 pr-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_14px_34px_-16px_rgba(180,20,20,0.85)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-[#8b0f0f] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a81414] sm:min-h-11 sm:gap-3 sm:py-2 sm:pl-5 sm:pr-2 sm:text-xs sm:tracking-[0.14em]"
    >
      <span>{label}</span>
      <span className="grid size-6 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-px group-hover/btn:scale-105 sm:size-7">
        <ArrowUpRight className="size-3 sm:size-3.5" strokeWidth={1.6} />
      </span>
    </Link>
  );
}

function StandardCourseCard({
  course,
  variant = "crimson",
  aspect = "aspect-[16/9] sm:aspect-[4/3]",
  imageFit = "cover",
}: {
  course: Course;
  variant?: "crimson" | "outline";
  aspect?: string;
  imageFit?: "cover" | "contain-light";
}) {
  const imageSrc = getCourseImage(course);

  return (
    <div className="h-full rounded-2xl bg-[#efe5d2]/75 p-1.5 ring-1 ring-[#c7a23b]/35 shadow-[0_24px_55px_-40px_rgba(107,11,11,0.4)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:ring-[#c9a520] sm:rounded-[2rem] sm:p-2 sm:shadow-[0_32px_70px_-48px_rgba(107,11,11,0.45)]">
      <article
        id={course.slug}
        className="group flex h-full flex-col overflow-hidden rounded-[calc(1rem-0.375rem)] bg-[#fffdf9] p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] sm:rounded-[calc(2rem-0.5rem)] sm:p-7"
      >
        <div
          className={`relative overflow-hidden rounded-xl sm:rounded-[1.25rem] ${aspect} ${
            imageFit === "contain-light"
              ? "bg-[#fdf8f0] ring-1 ring-[#efe5d2]"
              : "bg-[#efe5d2]"
          }`}
        >
          <Image
            src={imageSrc}
            alt={course.title}
            fill
            sizes="(max-width: 1024px) 100vw, 48vw"
            className={
              imageFit === "contain-light"
                ? "object-contain p-2.5 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02] sm:p-4"
                : "object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
            }
          />
        </div>

        <div className="mt-3.5 flex flex-1 flex-col sm:mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#efe5d2] pb-2.5 sm:pb-4">
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#a8871a] sm:text-xs sm:tracking-[0.16em]">
              {COURSE_TRACK_LABEL[course.slug] ?? course.duration}
            </span>
            <span className="font-serif text-lg tabular-nums text-[#981313] sm:text-2xl">
              {getCoursePriceLabel(course)}
            </span>
          </div>

          <h3 className="mt-2.5 font-serif text-xl leading-snug text-[#292524] transition-colors duration-300 group-hover:text-[#981313] sm:mt-5 sm:text-3xl sm:leading-tight">
            {course.title}
          </h3>

          <p className="mt-1 text-[11px] font-medium tracking-[0.04em] text-[#57534e] sm:mt-1.5 sm:text-xs">
            {course.duration}
          </p>

          <p className="mt-1.5 max-w-xl text-pretty text-[13px] leading-[1.55] text-[#57534e] sm:mt-3 sm:text-base sm:leading-7">
            {course.description}
          </p>

          {course.pricingOptions?.length ? (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-2.5">
              {course.pricingOptions.map((option) => (
                <div
                  key={option.label}
                  className="rounded-lg border border-[#e6dac3] bg-[#faf6ef] px-2.5 py-2 sm:rounded-xl sm:px-4 sm:py-3"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-1 sm:gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8b0f0f] sm:text-xs sm:tracking-[0.14em]">
                      {option.label}
                    </span>
                    <span className="font-serif text-sm font-semibold tabular-nums text-[#292524] sm:text-lg">
                      {formatINR(option.price)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10.5px] leading-snug text-[#57534e] sm:mt-1 sm:text-xs">{option.format}</p>
                </div>
              ))}
            </div>
          ) : null}

          <ul className="mt-3 space-y-1.5 sm:mt-5 sm:space-y-2.5">
            {course.highlights.slice(0, 4).map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2 text-xs leading-5 text-[#292524] sm:gap-2.5 sm:text-sm sm:leading-6"
              >
                <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#faf3dc] text-[#8b0f0f] ring-1 ring-[#ddb829]/55 sm:mt-1 sm:size-4.5">
                  <Check className="size-2.5" strokeWidth={2.5} />
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>

          <SyllabusDrawer course={course} />

          <div className="mt-auto pt-4 sm:pt-7">
            <CourseActionButton
              href={`/courses/${course.slug}`}
              variant={variant}
            />
          </div>
        </div>
      </article>
    </div>
  );
}

export default function CourseCatalogExplorer({
  courses,
}: {
  courses: Course[];
}) {
  const [activeFilter, setActiveFilter] = useState<PathwayFilter>("all");

  const tarotCourse = courses.find(
    (c) => c.slug === "professional-tarot-reader",
  );
  const wellbeingCourse = courses.find(
    (c) => c.slug === "personalized-wellbeing",
  );
  const shriVidyaCourse = courses.find((c) => c.slug === "shri-vidya");
  const chakraCourse = courses.find((c) => c.slug === "advanced-chakra");
  const aishwaryaCourse = courses.find((c) => c.slug === "aishwarya-siddhi");
  const soulPurposeCourse = courses.find(
    (c) => c.slug === "soul-purpose-reading-course",
  );

  const filteredCourses = courses.filter((course) => {
    if (activeFilter === "practitioner") {
      return PRACTITIONER_SLUGS.has(course.slug);
    }
    if (activeFilter === "sadhana") {
      return SADHANA_SLUGS.has(course.slug);
    }
    if (activeFilter === "syllabus") {
      return Boolean(course.curriculum?.length);
    }
    return true;
  });

  return (
    <div>
      {/* Pathway Filter Bar — wraps cleanly on all viewports */}
      <div
        className="mt-4 flex flex-wrap items-center gap-1.5 border-b border-[#6b0b0b]/12 pb-4 sm:mt-10 sm:gap-2.5 sm:pb-6"
        role="group"
        aria-label="Filter courses by study format"
      >
        {FILTER_OPTIONS.map((option) => {
          const isActive = activeFilter === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveFilter(option.id)}
              aria-pressed={isActive}
              className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.04em] transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a81414] sm:min-h-11 sm:gap-2 sm:px-5 sm:py-2 sm:text-xs sm:tracking-[0.06em] ${
                isActive
                  ? "border-[#b41414] bg-[#b41414] text-white shadow-[0_12px_28px_-14px_rgba(180,20,20,0.8)]"
                  : "border-[#d8c8ae] bg-[#fffdf9] text-[#292524] hover:border-[#c9a520] hover:bg-[#faf3dc]"
              }`}
            >
              <span>{option.label}</span>
              <span
                className={`tabular-nums text-[10.5px] sm:text-[11px] ${
                  isActive ? "text-[#f0d060]" : "text-[#a8871a]"
                }`}
              >
                {option.count}
              </span>
            </button>
          );
        })}
      </div>

      {activeFilter === "all" ? (
        <div className="mt-5 space-y-4 sm:mt-12 sm:space-y-8">
          {/* Row 1: Asymmetric 7/5 Bento — Professional Tarot + Personalized Well-being */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-8">
            {tarotCourse ? (
              <Reveal className="lg:col-span-7" delay={0.04}>
                <StandardCourseCard
                  course={tarotCourse}
                  variant="crimson"
                  aspect="aspect-[16/9] sm:aspect-[16/10]"
                />
              </Reveal>
            ) : null}

            {wellbeingCourse ? (
              <Reveal className="lg:col-span-5" delay={0.1}>
                <StandardCourseCard
                  course={wellbeingCourse}
                  variant="outline"
                  aspect="aspect-[16/9] sm:aspect-[4/3]"
                />
              </Reveal>
            ) : null}
          </div>

          {/* Row 2: Obsidian Double-Bezel Sanctuary Panel — Shri Vidya Immersion */}
          {shriVidyaCourse ? (
            <Reveal delay={0.08}>
              <div className="rounded-2xl bg-[#1c1917] p-1.5 ring-1 ring-[#ddb829]/30 shadow-[0_28px_70px_-40px_rgba(28,25,23,0.7)] sm:rounded-[2rem] sm:p-2 sm:shadow-[0_38px_90px_-42px_rgba(28,25,23,0.75)]">
                <article
                  id={shriVidyaCourse.slug}
                  className="group relative grid items-center gap-3.5 overflow-hidden rounded-[calc(1rem-0.375rem)] bg-[#221d1a] p-3 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] sm:gap-7 sm:rounded-[calc(2rem-0.5rem)] sm:p-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12 lg:p-10"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none hidden sm:block absolute -right-24 -top-24 size-96 rounded-full bg-[#ddb829]/10 blur-3xl"
                  />

                  <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#fdf8f0] p-2.5 ring-1 ring-[#ddb829]/35 sm:aspect-[4/3] sm:rounded-[1.25rem] sm:p-6 lg:order-2">
                    <Image
                      src={getCourseImage(shriVidyaCourse)}
                      alt={shriVidyaCourse.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 44vw"
                      className="object-contain p-2.5 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03] sm:p-6"
                    />
                  </div>

                  <div className="relative z-10 flex flex-col lg:order-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#ddb829]/25 pb-2.5 sm:pb-4">
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#f0d060] sm:text-xs sm:tracking-[0.18em]">
                        {COURSE_TRACK_LABEL[shriVidyaCourse.slug]}
                      </span>
                      <span className="font-serif text-lg tabular-nums text-[#f0d060] sm:text-2xl">
                        {getCoursePriceLabel(shriVidyaCourse)}
                      </span>
                    </div>

                    <h3 className="mt-2.5 font-serif text-xl leading-snug text-white sm:mt-5 sm:text-4xl sm:leading-tight">
                      {shriVidyaCourse.title}
                    </h3>

                    <p className="mt-1 text-[11px] font-medium tracking-[0.04em] text-[#d6cfc2]/80 sm:mt-1.5 sm:text-xs">
                      {shriVidyaCourse.duration}
                    </p>

                    <p className="mt-1.5 max-w-xl text-pretty text-[13px] leading-[1.55] text-[#d6cfc2] sm:mt-4 sm:text-base sm:leading-7">
                      {shriVidyaCourse.description}
                    </p>

                    <ul className="mt-3 grid gap-1.5 sm:mt-6 sm:grid-cols-2 sm:gap-3">
                      {shriVidyaCourse.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2 text-xs leading-5 text-[#efe5d2] sm:gap-2.5 sm:text-sm sm:leading-6"
                        >
                          <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#ddb829] text-[#1c1917] sm:mt-1 sm:size-4.5">
                            <Check className="size-2.5" strokeWidth={2.75} />
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <SyllabusDrawer course={shriVidyaCourse} dark />

                    <div className="mt-4 sm:mt-7">
                      <CourseActionButton
                        href={`/courses/${shriVidyaCourse.slug}`}
                        variant="gold"
                      />
                    </div>
                  </div>
                </article>
              </div>
            </Reveal>
          ) : null}

          {/* Row 3: Inverse 5/7 Bento — Advanced Chakra + Aishwarya Siddhi */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-8">
            {chakraCourse ? (
              <Reveal className="lg:col-span-5" delay={0.05}>
                <StandardCourseCard
                  course={chakraCourse}
                  variant="outline"
                  aspect="aspect-[16/10] sm:aspect-square"
                  imageFit="contain-light"
                />
              </Reveal>
            ) : null}

            {aishwaryaCourse ? (
              <Reveal className="lg:col-span-7" delay={0.1}>
                <div className="h-full rounded-2xl bg-[#efe5d2]/75 p-1.5 ring-1 ring-[#c7a23b]/35 shadow-[0_24px_55px_-40px_rgba(107,11,11,0.4)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:ring-[#c9a520] sm:rounded-[2rem] sm:p-2 sm:shadow-[0_32px_70px_-48px_rgba(107,11,11,0.45)]">
                  <article
                    id={aishwaryaCourse.slug}
                    className="group grid h-full gap-3.5 overflow-hidden rounded-[calc(1rem-0.375rem)] bg-[#fffdf9] p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] sm:grid-cols-[0.72fr_1.28fr] sm:gap-6 sm:rounded-[calc(2rem-0.5rem)] sm:p-7"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#efe5d2] sm:aspect-[3/4] sm:h-full sm:min-h-[340px] sm:rounded-[1.25rem]">
                      <Image
                        src={getCourseImage(aishwaryaCourse)}
                        alt={aishwaryaCourse.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 24vw"
                        className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#efe5d2] pb-2.5 sm:pb-4">
                        <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#a8871a] sm:text-xs sm:tracking-[0.16em]">
                          {COURSE_TRACK_LABEL[aishwaryaCourse.slug]}
                        </span>
                        <span className="font-serif text-lg tabular-nums text-[#981313] sm:text-2xl">
                          {getCoursePriceLabel(aishwaryaCourse)}
                        </span>
                      </div>

                      <h3 className="mt-2.5 font-serif text-xl leading-snug text-[#292524] transition-colors duration-300 group-hover:text-[#981313] sm:mt-5 sm:text-3xl sm:leading-tight">
                        {aishwaryaCourse.title}
                      </h3>

                      <p className="mt-1 text-[11px] font-medium tracking-[0.04em] text-[#57534e] sm:mt-1.5 sm:text-xs">
                        {aishwaryaCourse.duration}
                      </p>

                      <p className="mt-1.5 text-pretty text-[13px] leading-[1.55] text-[#57534e] sm:mt-3 sm:text-base sm:leading-7">
                        {aishwaryaCourse.description}
                      </p>

                      <ul className="mt-3 space-y-1.5 sm:mt-5 sm:space-y-2.5">
                        {aishwaryaCourse.highlights.slice(0, 3).map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs leading-5 text-[#292524] sm:gap-2.5 sm:text-sm sm:leading-6"
                          >
                            <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#faf3dc] text-[#8b0f0f] ring-1 ring-[#ddb829]/55 sm:mt-1 sm:size-4.5">
                              <Check className="size-2.5" strokeWidth={2.5} />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <SyllabusDrawer course={aishwaryaCourse} />

                      <div className="mt-auto pt-4 sm:pt-7">
                        <CourseActionButton
                          href={`/courses/${aishwaryaCourse.slug}`}
                          variant="crimson"
                        />
                      </div>
                    </div>
                  </article>
                </div>
              </Reveal>
            ) : null}
          </div>

          {/* Row 4: Horizontal Editorial Reading Strip — Soul Purpose Reading */}
          {soulPurposeCourse ? (
            <Reveal delay={0.08}>
              <div className="rounded-2xl bg-[#efe5d2]/75 p-1.5 ring-1 ring-[#c7a23b]/35 shadow-[0_24px_55px_-40px_rgba(107,11,11,0.4)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:ring-[#c9a520] sm:rounded-[2rem] sm:p-2 sm:shadow-[0_32px_70px_-48px_rgba(107,11,11,0.45)]">
                <article
                  id={soulPurposeCourse.slug}
                  className="group grid items-center gap-3.5 rounded-[calc(1rem-0.375rem)] bg-[#fffdf9] p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] sm:gap-7 sm:rounded-[calc(2rem-0.5rem)] sm:p-8 lg:grid-cols-12 lg:gap-12 lg:p-10"
                >
                  <div className="relative lg:col-span-5">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-[#efe5d2] sm:aspect-[4/3] sm:rounded-[1.25rem] lg:aspect-[5/4]">
                      <Image
                        src={getCourseImage(soulPurposeCourse)}
                        alt={soulPurposeCourse.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col lg:col-span-7">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#efe5d2] pb-2.5 sm:pb-4">
                      <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#a8871a] sm:text-xs sm:tracking-[0.18em]">
                        {COURSE_TRACK_LABEL[soulPurposeCourse.slug]}
                      </span>
                      <span className="font-serif text-lg tabular-nums text-[#981313] sm:text-2xl">
                        {getCoursePriceLabel(soulPurposeCourse)}
                      </span>
                    </div>

                    <h3 className="mt-2.5 font-serif text-xl leading-snug text-[#292524] transition-colors duration-300 group-hover:text-[#981313] sm:mt-5 sm:text-4xl sm:leading-tight">
                      {soulPurposeCourse.title}
                    </h3>

                    <p className="mt-1 text-[11px] font-medium tracking-[0.04em] text-[#57534e] sm:mt-1.5 sm:text-xs">
                      {soulPurposeCourse.duration}
                    </p>

                    <p className="mt-1.5 max-w-2xl text-pretty text-[13px] leading-[1.55] text-[#57534e] sm:mt-4 sm:text-lg sm:leading-8">
                      {soulPurposeCourse.description}
                    </p>

                    <ul className="mt-3 grid gap-1.5 sm:mt-6 sm:grid-cols-2 sm:gap-3">
                      {soulPurposeCourse.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2 text-xs leading-5 text-[#292524] sm:gap-2.5 sm:text-sm sm:leading-6"
                        >
                          <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-[#faf3dc] text-[#8b0f0f] ring-1 ring-[#ddb829]/55 sm:mt-1 sm:size-4.5">
                            <Check className="size-2.5" strokeWidth={2.5} />
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-7 sm:gap-4">
                      <CourseActionButton
                        href={`/courses/${soulPurposeCourse.slug}`}
                        variant="crimson"
                      />
                      <Link
                        href="/mentoring"
                        className="inline-flex min-h-9 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6b0b0b] underline underline-offset-4 transition-colors hover:text-[#a81414] sm:min-h-11 sm:text-xs sm:tracking-[0.14em]"
                      >
                        Compare with 1-on-1 mentoring
                        <ArrowRight className="size-3 sm:size-3.5" strokeWidth={1.6} />
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            </Reveal>
          ) : null}
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:gap-8">
          {filteredCourses.map((course) => (
            <StandardCourseCard
              key={course.slug}
              course={course}
              variant={
                course.slug === "professional-tarot-reader" ||
                course.slug === "shri-vidya"
                  ? "crimson"
                  : "outline"
              }
              aspect="aspect-[16/9] sm:aspect-[4/3]"
              imageFit={
                course.slug === "shri-vidya" ||
                course.slug === "advanced-chakra"
                  ? "contain-light"
                  : "cover"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
