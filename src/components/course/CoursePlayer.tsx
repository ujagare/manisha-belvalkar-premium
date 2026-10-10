"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Check, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Lock, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";
import type { Course } from "@/lib/data";
import { flattenLessons } from "@/lib/course-content";
import { cn } from "@/lib/utils";

const PROGRESS_KEY = "mb_course_progress";
const LAST_KEY = "mb_course_last";
type ProgressMap = Record<string, Record<string, boolean>>;
type InitialProgress = Array<{ lesson_id: string; completed: boolean }>;

function readLocalProgress(slug: string): { completed: ProgressMap; last: string | null } {
  if (typeof window === "undefined") return { completed: {}, last: null };
  try {
    return {
      completed: JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "{}") as ProgressMap,
      last: window.localStorage.getItem(`${LAST_KEY}_${slug}`),
    };
  } catch {
    return { completed: {}, last: null };
  }
}

function writeLocalProgress(slug: string, completed: ProgressMap, lessonId?: string) {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed));
    if (lessonId) window.localStorage.setItem(`${LAST_KEY}_${slug}`, lessonId);
  } catch { /* local progress is a non-fatal fallback */ }
}

export default function CoursePlayer({
  course,
  initialLessonId,
  hasFullAccess = false,
  initialProgress = [],
}: {
  course: Course;
  initialLessonId?: string;
  hasFullAccess?: boolean;
  initialProgress?: InitialProgress;
}) {
  const router = useRouter();
  const lessons = useMemo(() => flattenLessons(course), [course]);
  const serverProgress = useMemo<ProgressMap>(() => ({
    [course.slug]: Object.fromEntries(initialProgress.filter((row) => row.completed).map((row) => [row.lesson_id, true])),
  }), [course.slug, initialProgress]);
  const [completed, setCompleted] = useState<ProgressMap>(serverProgress);
  const [activeId, setActiveId] = useState<string | null>(initialLessonId ?? null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const local = readLocalProgress(course.slug);
    const hydrate = window.setTimeout(() => {
      setCompleted((current) => ({ ...local.completed, [course.slug]: { ...(local.completed[course.slug] ?? {}), ...(current[course.slug] ?? {}) } }));
      const resumable = lessons.find((lesson) => lesson.id === local.last && (hasFullAccess || lesson.free));
      const firstAvailable = lessons.find((lesson) => hasFullAccess || lesson.free);
      setActiveId((current) => current ?? resumable?.id ?? firstAvailable?.id ?? null);
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(hydrate);
  }, [course.slug, hasFullAccess, lessons]);

  const active = lessons.find((lesson) => lesson.id === activeId) ?? null;
  const activeIndex = active ? lessons.findIndex((lesson) => lesson.id === active.id) : -1;
  const doneCount = lessons.filter((lesson) => completed[course.slug]?.[lesson.id]).length;
  const percentage = lessons.length ? Math.round((doneCount / lessons.length) * 100) : 0;

  function syncProgress(lessonId: string, isCompleted: boolean) {
    if (!hasFullAccess) return;
    void fetch("/api/courses/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseSlug: course.slug, lessonId, completed: isCompleted }),
    });
  }

  function go(lessonId: string) {
    const target = lessons.find((lesson) => lesson.id === lessonId);
    if (!target || (!hasFullAccess && !target.free)) return;
    setActiveId(lessonId);
    writeLocalProgress(course.slug, completed, lessonId);
    router.replace(`/learn/${course.slug}/${lessonId}`);
  }

  function toggleComplete(lessonId: string) {
    setCompleted((current) => {
      const courseProgress = { ...(current[course.slug] ?? {}) };
      const nextValue = !courseProgress[lessonId];
      if (nextValue) courseProgress[lessonId] = true;
      else delete courseProgress[lessonId];
      const next = { ...current, [course.slug]: courseProgress };
      writeLocalProgress(course.slug, next, lessonId);
      syncProgress(lessonId, nextValue);
      return next;
    });
  }

  if (!loaded) return <div className="min-h-screen animate-pulse bg-[#f8f3e9]" />;

  return (
    <div className="min-h-screen bg-[#f8f3e9] pb-16 pt-24 lg:pt-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gold/20 pb-5">
          <div className="flex items-center gap-3">
            <Link href="/account/courses" className="grid h-10 w-10 place-items-center rounded-full bg-white text-warmgray ring-1 ring-parchment transition hover:text-primary" aria-label="Back to my courses"><ArrowLeft className="h-4 w-4" /></Link>
            <div><p className="font-display text-lg font-semibold leading-tight text-charcoal">{course.title}</p><p className="mt-0.5 text-xs text-warmgray">Recorded course · Learn at your own pace</p></div>
          </div>
          <div className="flex items-center gap-3"><span className="hidden text-sm font-semibold text-charcoal sm:inline">Your progress</span><div className="h-2 w-28 overflow-hidden rounded-full bg-parchment"><div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${percentage}%` }} /></div><span className="text-xs font-semibold tabular-nums text-primary">{percentage}%</span></div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <section>
            {active ? (
              <article className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_26px_75px_-48px_rgba(62,38,25,0.48)] ring-1 ring-parchment">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-warmgray"><Link href="/account/courses" className="hover:text-primary">My courses</Link><span>/</span><span className="truncate">{course.title}</span><span>/</span><span className="font-semibold text-charcoal">{active.title}</span></div>
                  <div className="mt-4 flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-deep">Lesson {activeIndex + 1} of {lessons.length}</p><h1 className="mt-2 text-balance font-display text-3xl font-semibold text-charcoal sm:text-4xl">{active.title}</h1></div><span className="flex items-center gap-1.5 rounded-full bg-ivory px-3 py-1.5 text-xs text-warmgray"><Clock3 className="h-3.5 w-3.5" />{active.duration}</span></div>

                  <div className="mt-6 overflow-hidden rounded-2xl bg-charcoal shadow-2xl shadow-charcoal/20">
                    {active.videoUrl ? <video controls controlsList="nodownload" className="aspect-video w-full bg-black" src={active.videoUrl} poster={course.image} /> : <div className="relative flex aspect-video items-center justify-center bg-charcoal"><div className="absolute inset-0 bg-cover bg-center opacity-15 blur-sm" style={{ backgroundImage: `url('${course.image}')` }} /><div className="relative px-6 text-center text-white"><span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/15 ring-1 ring-gold/35"><PlayCircle className="h-8 w-8 text-gold-light" /></span><p className="mt-4 font-display text-xl font-semibold">{active.title}</p><p className="mt-1 text-xs text-white/55">Recorded lesson · Video will appear here when uploaded</p></div></div>}
                  </div>

                  <div className="mt-7"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep">About this lesson</p><p className="mt-3 max-w-3xl leading-7 text-warmgray">{active.description ?? "Follow this lesson at your own pace. Pause when you need to reflect, then return whenever you are ready."}</p></div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-parchment pt-6">
                    {hasFullAccess ? <button type="button" onClick={() => toggleComplete(active.id)} className={cn("inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition", completed[course.slug]?.[active.id] ? "bg-[#2f7354] text-white" : "bg-ivory text-charcoal ring-1 ring-parchment hover:ring-gold")}><CheckCircle2 className="h-4 w-4" />{completed[course.slug]?.[active.id] ? "Completed" : "Mark complete"}</button> : <Link href={`/checkout/course/${course.slug}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white">Enroll to unlock all lessons</Link>}
                    <div className="flex items-center gap-2">{activeIndex > 0 && (hasFullAccess || lessons[activeIndex - 1]?.free) ? <button type="button" onClick={() => go(lessons[activeIndex - 1].id)} className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-charcoal ring-1 ring-parchment hover:ring-gold"><ChevronLeft className="h-4 w-4" /> Previous</button> : null}{activeIndex < lessons.length - 1 && (hasFullAccess || lessons[activeIndex + 1]?.free) ? <button type="button" onClick={() => go(lessons[activeIndex + 1].id)} className="inline-flex items-center gap-1 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:brightness-110">Next <ChevronRight className="h-4 w-4" /></button> : null}</div>
                  </div>
                  {activeIndex === lessons.length - 1 && doneCount === lessons.length ? <div className="mt-6 rounded-2xl bg-gold-soft p-5 text-center"><Sparkles className="mx-auto h-6 w-6 text-gold-dark" /><p className="mt-2 font-display text-lg font-semibold text-charcoal">You completed {course.title}.</p></div> : null}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-parchment bg-ivory/45 px-6 py-4 text-xs text-warmgray sm:px-8"><span className="inline-flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-gold-deep" /> Personal, account-protected access</span><Link href="/support" className="font-semibold text-primary hover:underline">Need help?</Link></div>
              </article>
            ) : <div className="rounded-[1.75rem] bg-white p-12 text-center ring-1 ring-parchment"><BookOpen className="mx-auto h-10 w-10 text-gold" /><p className="mt-4 text-warmgray">No preview lesson is available yet.</p></div>}
          </section>

          <aside className="h-fit overflow-hidden rounded-[1.4rem] bg-charcoal text-white shadow-[0_24px_65px_-42px_rgba(62,38,25,0.7)] lg:sticky lg:top-28">
            <div className="border-b border-white/10 px-5 py-5"><p className="font-display text-lg font-semibold">Course content</p><p className="mt-1 text-xs text-white/45">{lessons.length} lessons · {doneCount} completed</p></div>
            <div className="max-h-[70vh] overflow-y-auto p-2">{course.curriculum?.map((module) => <div key={module.module} className="mb-3"><p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-light/70">{module.module}</p>{module.lessons.map((lesson) => { const selected = activeId === lesson.id; const done = completed[course.slug]?.[lesson.id]; const locked = !hasFullAccess && !lesson.free; return <button key={lesson.id} type="button" onClick={() => go(lesson.id)} disabled={locked} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition", selected ? "bg-white text-primary" : locked ? "cursor-not-allowed text-white/30" : "text-white/75 hover:bg-white/[0.07] hover:text-white")}><span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full", done ? "bg-[#2f7354] text-white" : selected ? "bg-primary text-white" : locked ? "bg-white/[0.05]" : "bg-gold/15 text-gold-light")}>{done ? <Check className="h-3.5 w-3.5" /> : locked ? <Lock className="h-3.5 w-3.5" /> : <PlayCircle className="h-3.5 w-3.5" />}</span><span className="min-w-0 flex-1"><span className="block truncate font-medium">{lesson.title}</span><span className={cn("text-xs", selected ? "text-warmgray" : "text-white/40")}>{lesson.duration}{lesson.free && !hasFullAccess ? " · Preview" : ""}</span></span></button>; })}</div>)}</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
