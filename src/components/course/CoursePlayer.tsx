"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Check, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Lock, PlayCircle, Sparkles } from "lucide-react";
import type { Course } from "@/lib/data";
import { flattenLessons } from "@/lib/course-content";
import { cn } from "@/lib/utils";

const PROGRESS_KEY = "mb_course_progress";
const LAST_KEY = "mb_course_last";

type ProgressMap = Record<string, Record<string, boolean>>;

export function readProgress(slug: string): { completed: ProgressMap; last: string | null } {
  if (typeof window === "undefined") return { completed: {}, last: null };
  let completed: ProgressMap = {};
  try {
    completed = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch {
    completed = {};
  }
  let last: string | null = null;
  try {
    last = window.localStorage.getItem(`${LAST_KEY}_${slug}`);
  } catch {
    last = null;
  }
  return { completed, last };
}

export function writeProgress(slug: string, completed: ProgressMap) {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed));
  } catch {
    /* storage full/unavailable — non-fatal */
  }
}

export default function CoursePlayer({ course, initialLessonId }: { course: Course; initialLessonId?: string }) {
  const router = useRouter();
  const lessons = useMemo(() => flattenLessons(course), [course]);
  const [completed, setCompleted] = useState<ProgressMap>({});
  const [activeId, setActiveId] = useState<string | null>(initialLessonId ?? null);
  const [loaded, setLoaded] = useState(false);

  // Hydrate progress + resume last lesson from localStorage once on mount.
  useEffect(() => {
    const { completed: stored, last } = readProgress(course.slug);
    setCompleted(stored);
    setActiveId((prev) => prev ?? last ?? lessons[0]?.id ?? null);
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course.slug]);

  const active = lessons.find((l) => l.id === activeId) ?? null;
  const activeIndex = active ? lessons.findIndex((l) => l.id === active.id) : -1;
  const courseCompleted = lessons.length > 0 && lessons.every((l) => completed[course.slug]?.[l.id]);
  const doneCount = lessons.filter((l) => completed[course.slug]?.[l.id]).length;
  const pct = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;

  function go(id: string) {
    setActiveId(id);
    try {
      window.localStorage.setItem(`${LAST_KEY}_${course.slug}`, id);
    } catch { /* ignore */ }
    router.replace(`/learn/${course.slug}/${id}`);
  }

  function toggleComplete(id: string) {
    setCompleted((prev) => {
      const courseMap = { ...(prev[course.slug] ?? {}) };
      if (courseMap[id]) delete courseMap[id];
      else courseMap[id] = true;
      const next = { ...prev, [course.slug]: courseMap };
      writeProgress(course.slug, next);
      return next;
    });
  }

  if (!loaded) return <div className="min-h-screen animate-pulse bg-ivory" />;

  return (
    <section className="bg-ivory min-h-screen pt-28 lg:pt-32">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment pb-4">
          <div className="flex items-center gap-3">
            <Link href="/account/courses" className="flex h-10 w-10 items-center justify-center rounded-full border border-parchment bg-white text-warmgray hover:text-primary" aria-label="Back to my courses">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="font-display text-lg font-bold leading-tight text-charcoal">{course.title}</p>
              <p className="text-xs text-warmgray">My courses · {course.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-charcoal">Progress</span>
            <div className="h-2 w-28 overflow-hidden rounded-full bg-parchment">
              <div className="h-full rounded-full bg-gradient-to-r from-gold to-gold-dark transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs font-semibold text-primary">{pct}%</span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
          {/* Main content */}
          <div>
            {active ? (
              <div className="rounded-[28px] border border-parchment bg-white p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Link href="/account/courses" className="text-warmgray hover:text-primary">My courses</Link>
                  <span className="text-warmgray">/</span>
                  <span className="text-warmgray">{course.title}</span>
                  <span className="text-warmgray">/</span>
                  <span className="font-semibold text-charcoal">{active.title}</span>
                </div>
                <h1 className="mt-3 font-display text-3xl font-bold text-charcoal sm:text-4xl">{active.title}</h1>
                <p className="mt-2 flex items-center gap-2 text-sm text-warmgray"><Clock3 className="h-4 w-4" />{active.duration}</p>

                {/* Player */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-parchment bg-charcoal">
                  {active.videoUrl ? (
                    <video controls className="aspect-video w-full bg-black" src={active.videoUrl} poster={course.image} />
                  ) : (
                    <div className="relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
                      <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: `url('${course.image}')`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} />
                      <div className="relative text-center text-white">
                        <PlayCircle className="mx-auto h-14 w-14 text-gold-light" />
                        <p className="mt-3 text-lg font-semibold">{active.title}</p>
                        <p className="mt-1 text-xs text-white/70">Recorded lesson · add a videoUrl to play a real video</p>
                      </div>
                    </div>
                  )}
                </div>

                <p className="mt-6 leading-relaxed text-warmgray">
                  {active.description ?? "No detailed notes are attached to this lesson yet. Add a description or a video URL to complete the lesson."}
                </p>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => toggleComplete(active.id)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition",
                      completed[course.slug]?.[active.id]
                        ? "bg-green-600 text-white"
                        : "border border-parchment bg-white text-charcoal hover:border-gold",
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {completed[course.slug]?.[active.id] ? "Completed" : "Mark as complete"}
                  </button>

                  <div className="flex items-center gap-2">
                    {activeIndex > 0 && lessons[activeIndex - 1] ? (
                      <button type="button" onClick={() => go(lessons[activeIndex - 1].id)} className="inline-flex items-center gap-1.5 rounded-full border border-parchment bg-white px-5 py-2.5 text-sm font-semibold text-charcoal hover:border-gold">
                        <ChevronLeft className="h-4 w-4" /> Previous
                      </button>
                    ) : null}
                    {activeIndex >= 0 && activeIndex < lessons.length - 1 ? (
                      <button type="button" onClick={() => go(lessons[activeIndex + 1].id)} className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:brightness-110">
                        Next <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : activeIndex === lessons.length - 1 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-600 px-5 py-2.5 text-sm font-bold text-white">
                        <Check className="h-4 w-4" /> Course complete
                      </span>
                    ) : null}
                  </div>
                </div>

                {activeIndex >= 0 && activeIndex === lessons.length - 1 && doneCount === lessons.length ? (
                  <div className="mt-6 rounded-2xl bg-gold-soft p-5 text-center">
                    <Sparkles className="mx-auto h-6 w-6 text-gold-dark" />
                    <p className="mt-2 font-display text-lg font-bold text-charcoal">Congratulations — you finished {course.title}!</p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-[28px] border border-parchment bg-white p-12 text-center">
                <BookOpen className="mx-auto h-10 w-10 text-gold" />
                <p className="mt-4 text-warmgray">Select a lesson from the sidebar to begin.</p>
              </div>
            )}
          </div>

          {/* Sidebar curriculum */}
          <aside className="h-fit rounded-[20px] border border-parchment bg-white lg:sticky lg:top-28">
            <div className="border-b border-parchment px-5 py-4">
              <p className="font-display text-lg font-bold text-charcoal">Course content</p>
              <p className="mt-0.5 text-xs text-warmgray">{lessons.length} lessons · {doneCount} completed</p>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-2">
              {course.curriculum?.map((module, mi) => (
                <div key={module.module} className="mb-3">
                  <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-warmgray">{module.module}</p>
                  {module.lessons.map((lesson) => {
                    const isActive = activeId === lesson.id;
                    const isDone = completed[course.slug]?.[lesson.id];
                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => go(lesson.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
                          isActive ? "bg-primary-soft text-primary" : "text-charcoal hover:bg-ivory",
                        )}
                      >
                        <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full", isDone ? "bg-green-600 text-white" : isActive ? "bg-primary text-white" : lesson.free ? "bg-gold-soft text-gold-deep" : "bg-ink/5 text-warmgray")}>
                          {isDone ? <Check className="h-3.5 w-3.5" /> : lesson.free ? <PlayCircle className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{lesson.title}</span>
                          <span className="text-xs text-warmgray">{lesson.duration}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
