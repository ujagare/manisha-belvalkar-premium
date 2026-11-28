"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Lock,
  Pencil,
  PlayCircle,
  ScrollText,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Course } from "@/lib/data";
import { flattenLessons } from "@/lib/course-content";
import { isModuleUnlockedByDrip } from "@/lib/course-security";
import SecureVideoStage, {
  type PlaybackDescriptor,
} from "@/components/course/SecureVideoStage";
import { cn } from "@/lib/utils";

const PROGRESS_KEY = "mb_course_progress";
const LAST_KEY = "mb_course_last";
const DEVICE_KEY = "mb_classroom_device_id";

type ProgressMap = Record<string, Record<string, boolean>>;
export type InitialProgress = Array<{
  lesson_id: string;
  completed: boolean;
  watched_seconds?: number;
}>;
export type InitialNote = {
  lesson_id: string;
  content: string;
  updated_at?: string;
};

type WorkspaceTab = "overview" | "notes" | "resources" | "personal";

function getOrCreateDeviceId(): { id: string; label: string } {
  if (typeof window === "undefined") {
    return { id: "server-render", label: "Web Browser" };
  }
  try {
    let existing = window.localStorage.getItem(DEVICE_KEY);
    if (!existing || existing.length < 12) {
      existing = `${crypto.randomUUID()}-${ screen.width }x${ screen.height }`;
      window.localStorage.setItem(DEVICE_KEY, existing);
    }
    const platform = navigator.platform || "Browser";
    return {
      id: existing,
      label: `${platform} (${window.innerWidth}px)`,
    };
  } catch {
    return { id: "ephemeral-browser-device", label: "Web Browser" };
  }
}

function readLocalProgress(slug: string): {
  completed: ProgressMap;
  last: string | null;
} {
  if (typeof window === "undefined") return { completed: {}, last: null };
  try {
    return {
      completed: JSON.parse(
        window.localStorage.getItem(PROGRESS_KEY) || "{}",
      ) as ProgressMap,
      last: window.localStorage.getItem(`${LAST_KEY}_${slug}`),
    };
  } catch {
    return { completed: {}, last: null };
  }
}

function writeLocalProgress(
  slug: string,
  completed: ProgressMap,
  lessonId?: string,
) {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed));
    if (lessonId) window.localStorage.setItem(`${LAST_KEY}_${slug}`, lessonId);
  } catch {
    /* Non-fatal fallback */
  }
}

export default function CoursePlayer({
  course,
  initialLessonId,
  hasFullAccess = false,
  enrolledAtIso = null,
  initialProgress = [],
  initialNotes = [],
}: {
  course: Course;
  initialLessonId?: string;
  hasFullAccess?: boolean;
  enrolledAtIso?: string | null;
  initialProgress?: InitialProgress;
  initialNotes?: InitialNote[];
}) {
  const router = useRouter();
  const lessons = useMemo(() => flattenLessons(course), [course]);

  const serverProgress = useMemo<ProgressMap>(
    () => ({
      [course.slug]: Object.fromEntries(
        initialProgress
          .filter((row) => row.completed)
          .map((row) => [row.lesson_id, true]),
      ),
    }),
    [course.slug, initialProgress],
  );

  const watchedByLesson = useMemo<Record<string, number>>(
    () =>
      Object.fromEntries(
        initialProgress.map((row) => [row.lesson_id, row.watched_seconds ?? 0]),
      ),
    [initialProgress],
  );

  const [completed, setCompleted] = useState<ProgressMap>(serverProgress);
  const [activeId, setActiveId] = useState<string | null>(
    initialLessonId ?? null,
  );
  const [loaded, setLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("overview");

  // Secure Playback State
  const [playback, setPlayback] = useState<PlaybackDescriptor | null>(null);
  const [playbackLoading, setPlaybackLoading] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const currentWatchedRef = useRef<number>(0);

  // Learner Personal Notes State
  const [notesMap, setNotesMap] = useState<Record<string, string>>(() =>
    Object.fromEntries(initialNotes.map((n) => [n.lesson_id, n.content])),
  );
  const [noteStatus, setNoteStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    const local = readLocalProgress(course.slug);
    const hydrate = window.setTimeout(() => {
      setCompleted((current) => ({
        ...local.completed,
        [course.slug]: {
          ...(local.completed[course.slug] ?? {}),
          ...(current[course.slug] ?? {}),
        },
      }));
      const resumable = lessons.find(
        (lesson) => lesson.id === local.last && (hasFullAccess || lesson.free),
      );
      const firstAvailable = lessons.find(
        (lesson) => hasFullAccess || lesson.free,
      );
      setActiveId(
        (current) => current ?? resumable?.id ?? firstAvailable?.id ?? null,
      );
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(hydrate);
  }, [course.slug, hasFullAccess, lessons]);

  const active = lessons.find((lesson) => lesson.id === activeId) ?? null;
  const activeIndex = active
    ? lessons.findIndex((lesson) => lesson.id === active.id)
    : -1;
  const activeModuleIndex = useMemo(() => {
    if (!active || !course.curriculum) return -1;
    return course.curriculum.findIndex((mod) =>
      mod.lessons.some((l) => l.id === active.id),
    );
  }, [active, course.curriculum]);

  const doneCount = lessons.filter(
    (lesson) => completed[course.slug]?.[lesson.id],
  ).length;
  const percentage = lessons.length
    ? Math.round((doneCount / lessons.length) * 100)
    : 0;

  // Fetch Short-Lived Encrypted / Signed Playback Session for Active Lesson
  const loadPlaybackSession = useCallback(
    async (targetLessonId: string) => {
      setPlaybackLoading(true);
      setPlaybackError(null);
      try {
        const device = getOrCreateDeviceId();
        const res = await fetch("/api/courses/playback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseSlug: course.slug,
            lessonId: targetLessonId,
            deviceId: device.id,
            deviceLabel: device.label,
          }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setPlayback(null);
          setPlaybackError(
            data?.error?.message ?? "Could not unlock lecture stream.",
          );
          return;
        }
        setPlayback(data as PlaybackDescriptor);
      } catch {
        setPlayback(null);
        setPlaybackError("Network error while connecting to classroom server.");
      } finally {
        setPlaybackLoading(false);
      }
    },
    [course.slug],
  );

  useEffect(() => {
    if (!loaded || !active?.id) return;
    currentWatchedRef.current = watchedByLesson[active.id] ?? 0;
    const lessonId = active.id;
    const timer = window.setTimeout(() => {
      void loadPlaybackSession(lessonId);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [active?.id, loadPlaybackSession, loaded, watchedByLesson]);

  // Live 25-Second Single-Stream Heartbeat + Seamless Token Rotation + Watched Seconds Sync
  useEffect(() => {
    if (!hasFullAccess || !active?.id || !playback?.ready) return;
    const sessionId = playback.sessionId;
    const interval = window.setInterval(async () => {
      const device = getOrCreateDeviceId();
      const nowSec = Math.floor(Date.now() / 1000);
      const needsTokenRefresh =
        playback.mode === "vault_stream" &&
        playback.tokenExpiresAt - nowSec < 45;

      try {
        const res = await fetch("/api/courses/classroom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "heartbeat",
            courseSlug: course.slug,
            lessonId: active.id,
            sessionId,
            deviceId: device.id,
            watchedSeconds: Math.floor(currentWatchedRef.current),
            refreshStream: needsTokenRefresh,
          }),
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.active === false) {
          setPlayback(null);
          setPlaybackError(
            data.reason === "SUPERSEDED_BY_OTHER_DEVICE"
              ? "Playback paused because your account started watching on another device. Only 1 active stream is allowed at a time."
              : "Your classroom session has expired or been suspended.",
          );
          return;
        }
        if (
          res.ok &&
          data?.streamUrl &&
          data?.tokenExpiresAt &&
          playback.mode === "vault_stream"
        ) {
          setPlayback((prev) =>
            prev && prev.ready && prev.mode === "vault_stream"
              ? {
                  ...prev,
                  streamUrl: data.streamUrl,
                  tokenExpiresAt: data.tokenExpiresAt,
                }
              : prev,
          );
        }
      } catch {
        /* Transient offline heartbeat failure — retry on next cycle */
      }
    }, 25000);

    return () => window.clearInterval(interval);
  }, [active?.id, course.slug, hasFullAccess, playback]);

  const reportSecurityEvent = useCallback(
    (
      eventType: string,
      metadata?: Record<string, string | number | boolean>,
    ) => {
      const device = getOrCreateDeviceId();
      void fetch("/api/courses/classroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "security_event",
          courseSlug: course.slug,
          lessonId: active?.id ?? "",
          deviceId: device.id,
          eventType,
          metadata,
        }),
      }).catch(() => null);
    },
    [active?.id, course.slug],
  );

  function syncProgress(lessonId: string, isCompleted: boolean) {
    if (!hasFullAccess) return;
    void fetch("/api/courses/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseSlug: course.slug,
        lessonId,
        completed: isCompleted,
        watchedSeconds: Math.floor(currentWatchedRef.current),
      }),
    });
  }

  function markLessonCompletedAutomatically(lessonId: string) {
    if (!hasFullAccess) return;
    setCompleted((current) => {
      if (current[course.slug]?.[lessonId]) return current;
      const courseProgress = { ...(current[course.slug] ?? {}), [lessonId]: true };
      const next = { ...current, [course.slug]: courseProgress };
      writeLocalProgress(course.slug, next, lessonId);
      syncProgress(lessonId, true);
      return next;
    });
  }

  function go(lessonId: string) {
    const parentMod = course.curriculum?.find((m) =>
      m.lessons.some((l) => l.id === lessonId),
    );
    const target = parentMod?.lessons.find((l) => l.id === lessonId);
    if (!target) return;
    const drip = isModuleUnlockedByDrip(parentMod?.unlockOffsetDays, enrolledAtIso);
    if (!target.free && (!hasFullAccess || !drip.unlocked)) return;

    setActiveId(lessonId);
    setNoteStatus("idle");
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

  async function savePersonalNote() {
    if (!hasFullAccess || !active) return;
    setNoteStatus("saving");
    try {
      const res = await fetch("/api/courses/classroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_note",
          courseSlug: course.slug,
          lessonId: active.id,
          content: notesMap[active.id] ?? "",
        }),
      });
      setNoteStatus(res.ok ? "saved" : "error");
    } catch {
      setNoteStatus("error");
    }
  }

  if (!loaded) return <div className="min-h-screen animate-pulse bg-[#f8f3e9]" />;

  const queryLower = searchQuery.trim().toLowerCase();

  return (
    <div className="min-h-[100dvh] bg-[#f8f3e9] pb-14 pt-20 sm:pb-16 sm:pt-24 lg:pt-28">
      <div className="mx-auto max-w-[1360px] px-4 lg:px-8">
        {/* Top Batch Classroom Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/25 pb-4 sm:gap-4 sm:pb-5">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href={hasFullAccess ? "/account/courses" : `/courses/${course.slug}`}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-warmgray ring-1 ring-parchment transition hover:text-primary"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-display text-base font-semibold leading-tight text-charcoal sm:text-xl">
                  {course.title}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-deep">
                  <ShieldCheck className="h-3 w-3" /> DRM &amp; Watermark Protected
                </span>
              </div>
              <p className="mt-0.5 text-xs text-warmgray">
                {course.curriculum?.length ?? 0} modules · {lessons.length} lectures · Single-device protected stream
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 ring-1 ring-parchment">
            <span className="hidden text-xs font-semibold text-charcoal sm:inline">
              {doneCount}/{lessons.length} completed
            </span>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-parchment sm:w-32">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs font-bold tabular-nums text-primary">
              {percentage}%
            </span>
          </div>
        </header>

        <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
          {/* Left Column: Video Stage + Classroom Tabs */}
          <section className="min-w-0">
            {active ? (
              <article className="overflow-hidden rounded-2xl bg-white shadow-[0_26px_75px_-48px_rgba(62,38,25,0.48)] ring-1 ring-parchment sm:rounded-[1.75rem]">
                <div className="p-3.5 sm:p-7">
                  {/* Protected Video Stage */}
                  <SecureVideoStage
                    lessonTitle={active.title}
                    posterImage={course.image}
                    playback={playback}
                    loading={playbackLoading}
                    error={playbackError}
                    initialWatchedSeconds={watchedByLesson[active.id] ?? 0}
                    onRetry={() => void loadPlaybackSession(active.id)}
                    onTimeProgress={(sec) => {
                      currentWatchedRef.current = sec;
                    }}
                    onNearlyComplete={() =>
                      markLessonCompletedAutomatically(active.id)
                    }
                    onSecurityEvent={reportSecurityEvent}
                  />

                  {/* Lecture Title & Quick Action Controls */}
                  <div className="mt-5 flex flex-wrap items-start justify-between gap-4 border-b border-parchment pb-5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                        {activeModuleIndex >= 0
                          ? `Module ${activeModuleIndex + 1} · `
                          : ""}
                        Lecture {activeIndex + 1} of {lessons.length}
                      </p>
                      <h1 className="mt-1.5 text-balance font-display text-2xl font-semibold text-charcoal sm:text-3xl">
                        {active.title}
                      </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-ivory px-3 py-2 text-xs font-medium text-warmgray">
                        <Clock3 className="h-3.5 w-3.5" />
                        {active.duration}
                      </span>
                      {hasFullAccess ? (
                        <button
                          type="button"
                          onClick={() => toggleComplete(active.id)}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition sm:text-sm",
                            completed[course.slug]?.[active.id]
                              ? "bg-[#2f7354] text-white"
                              : "bg-ivory text-charcoal ring-1 ring-parchment hover:ring-gold",
                          )}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {completed[course.slug]?.[active.id]
                            ? "Completed"
                            : "Mark complete"}
                        </button>
                      ) : (
                        <Link
                          href={`/checkout/course/${course.slug}`}
                          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-bold text-white transition hover:brightness-110 sm:text-sm"
                        >
                          Enroll to unlock full series
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Classroom Workspace Tabs (Overview / Lecture Notes / Resources / My Notes) */}
                  <div className="mt-4 flex flex-wrap gap-1.5 border-b border-parchment pb-3" role="tablist" aria-label="Lecture study tools">
                    {(
                      [
                        { id: "overview", label: "Overview", icon: BookOpen },
                        {
                          id: "notes",
                          label: "Sadhana & Notes",
                          icon: ScrollText,
                        },
                        {
                          id: "resources",
                          label: `Resources${active.resources?.length ? ` (${active.resources.length})` : ""}`,
                          icon: Download,
                        },
                        ...(hasFullAccess
                          ? [
                              {
                                id: "personal" as const,
                                label: "My Reflection Notes",
                                icon: Pencil,
                              },
                            ]
                          : []),
                      ] as const
                    ).map((tab) => {
                      const Icon = tab.icon;
                      const selected = workspaceTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          role="tab"
                          aria-selected={selected}
                          onClick={() => setWorkspaceTab(tab.id)}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition",
                            selected
                              ? "bg-charcoal text-white"
                              : "bg-ivory/75 text-warmgray hover:bg-ivory hover:text-charcoal",
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content Panels */}
                  <div className="mt-5 min-h-[7rem]">
                    {workspaceTab === "overview" ? (
                      <div>
                        <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-warmgray sm:text-base">
                          {active.description ??
                            "Follow this recorded lecture at your own steady pace. Pause whenever you wish to practise or reflect, and use the Reflection Notes tab to record your insights."}
                        </p>
                      </div>
                    ) : null}

                    {workspaceTab === "notes" ? (
                      <div>
                        {active.notesMarkdown ? (
                          <div className="rounded-2xl border border-parchment bg-ivory/50 p-4 text-sm leading-7 whitespace-pre-line text-charcoal sm:p-6">
                            {active.notesMarkdown}
                          </div>
                        ) : (
                          <p className="text-sm text-warmgray">
                            No written mantra or practice notes have been attached to this lecture yet.
                          </p>
                        )}
                      </div>
                    ) : null}

                    {workspaceTab === "resources" ? (
                      <div>
                        {active.resources?.length ? (
                          <ul className="grid gap-2.5 sm:grid-cols-2">
                            {active.resources.map((resItem) => (
                              <li key={resItem.url}>
                                <a
                                  href={resItem.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between gap-3 rounded-xl border border-parchment bg-ivory/60 px-4 py-3 text-sm font-semibold text-charcoal transition hover:border-gold hover:text-primary"
                                >
                                  <span className="truncate">{resItem.title}</span>
                                  <ArrowUpRight className="h-4 w-4 shrink-0 text-gold-deep" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-warmgray">
                            No supplementary PDFs or reference links for this lecture.
                          </p>
                        )}
                      </div>
                    ) : null}

                    {workspaceTab === "personal" && hasFullAccess ? (
                      <div>
                        <label
                          htmlFor="learner-personal-note"
                          className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gold-deep"
                        >
                          Private journal for &ldquo;{active.title}&rdquo; (synced to your account)
                        </label>
                        <textarea
                          id="learner-personal-note"
                          rows={5}
                          value={notesMap[active.id] ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNotesMap((prev) => ({ ...prev, [active.id]: val }));
                            setNoteStatus("idle");
                          }}
                          placeholder="Write your reflections, card spreads, mantra counts, or key takeaways from this episode…"
                          className="w-full rounded-xl border border-parchment bg-ivory/40 p-3.5 text-sm leading-6 text-charcoal outline-none focus:border-gold-dark focus:bg-white"
                        />
                        <div className="mt-2.5 flex items-center justify-between gap-3">
                          <span className="text-xs text-warmgray">
                            {noteStatus === "saved"
                              ? "Saved to your private account"
                              : noteStatus === "error"
                                ? "Could not save note — check connection"
                                : "Only visible to you"}
                          </span>
                          <button
                            type="button"
                            onClick={() => void savePersonalNote()}
                            disabled={noteStatus === "saving"}
                            className="rounded-full bg-charcoal px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary disabled:opacity-50"
                          >
                            {noteStatus === "saving" ? "Saving…" : "Save note"}
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Episode Navigation Footer */}
                  <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-parchment pt-5">
                    <div>
                      {activeIndex > 0 &&
                      (hasFullAccess || lessons[activeIndex - 1]?.free) ? (
                        <button
                          type="button"
                          onClick={() => go(lessons[activeIndex - 1].id)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-charcoal ring-1 ring-parchment transition hover:ring-gold sm:text-sm"
                        >
                          <ChevronLeft className="h-4 w-4" /> Previous lecture
                        </button>
                      ) : null}
                    </div>
                    <div>
                      {activeIndex < lessons.length - 1 &&
                      (hasFullAccess || lessons[activeIndex + 1]?.free) ? (
                        <button
                          type="button"
                          onClick={() => go(lessons[activeIndex + 1].id)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-white transition hover:brightness-110 sm:text-sm"
                        >
                          Next lecture <ChevronRight className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {doneCount === lessons.length && lessons.length > 0 ? (
                    <div className="mt-6 rounded-2xl bg-gold-soft p-5 text-center ring-1 ring-gold/30">
                      <Sparkles className="mx-auto h-6 w-6 text-gold-dark" />
                      <p className="mt-2 font-display text-lg font-semibold text-charcoal">
                        Congratulations — you have completed all lectures in {course.title}.
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-parchment bg-ivory/45 px-5 py-3.5 text-xs text-warmgray sm:px-7">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-gold-deep" />
                    Licensed to your personal account · Unauthorized recording or sharing automatically suspends access
                  </span>
                  <Link
                    href="/support"
                    className="font-semibold text-primary hover:underline"
                  >
                    Classroom support
                  </Link>
                </div>
              </article>
            ) : (
              <div className="rounded-[1.75rem] bg-white p-12 text-center ring-1 ring-parchment">
                <BookOpen className="mx-auto h-10 w-10 text-gold" />
                <p className="mt-4 text-warmgray">
                  No lectures are published in this series yet.
                </p>
              </div>
            )}
          </section>

          {/* Right Sticky Batch Curriculum Sidebar (Accordion + Search) */}
          <aside className="h-fit overflow-hidden rounded-[1.5rem] bg-[#191614] text-white shadow-[0_24px_65px_-42px_rgba(62,38,25,0.75)] ring-1 ring-white/10 lg:sticky lg:top-28">
            <div className="border-b border-white/10 p-4 sm:p-5">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-display text-lg font-semibold text-white">
                  Series curriculum
                </p>
                <span className="text-xs text-[#f0d060]">
                  {doneCount}/{lessons.length} done
                </span>
              </div>

              <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-white/40" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search lectures in series…"
                  aria-label="Search lectures in series"
                  className="h-8.5 w-full rounded-lg border border-white/12 bg-white/[0.06] pl-8.5 pr-3 text-xs text-white placeholder:text-white/40 outline-none focus:border-gold/60"
                />
              </div>
            </div>

            <div className="max-h-[72vh] overflow-y-auto divide-y divide-white/10">
              {course.curriculum?.map((module, mIdx) => {
                const drip = isModuleUnlockedByDrip(
                  module.unlockOffsetDays,
                  enrolledAtIso,
                );
                const visibleLessons = queryLower
                  ? module.lessons.filter((l) =>
                      l.title.toLowerCase().includes(queryLower),
                    )
                  : module.lessons;

                if (queryLower && visibleLessons.length === 0) return null;

                const modDone = module.lessons.filter(
                  (l) => completed[course.slug]?.[l.id],
                ).length;
                const modKey = module.id ?? module.module;
                const isCollapsed = Boolean(collapsedModules[modKey]) && !queryLower;

                return (
                  <div key={modKey}>
                    <button
                      type="button"
                      onClick={() =>
                        setCollapsedModules((prev) => ({
                          ...prev,
                          [modKey]: !prev[modKey],
                        }))
                      }
                      aria-expanded={!isCollapsed}
                      className="flex w-full items-center justify-between gap-3 bg-white/[0.03] px-4 py-3.5 text-left transition hover:bg-white/[0.06]"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f0d060]/80">
                          Module {String(mIdx + 1).padStart(2, "0")}
                        </p>
                        <p className="mt-0.5 truncate text-sm font-semibold text-white">
                          {module.module}
                        </p>
                        <p className="mt-0.5 text-[11px] text-white/45">
                          {modDone}/{module.lessons.length} lectures
                          {!drip.unlocked && drip.unlocksAtIso
                            ? ` · Unlocks ${new Date(drip.unlocksAtIso).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                            : ""}
                        </p>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-white/50 transition-transform",
                          isCollapsed && "-rotate-90",
                        )}
                      />
                    </button>

                    {!isCollapsed ? (
                      <div className="space-y-1 p-2">
                        {visibleLessons.map((lesson) => {
                          const selected = activeId === lesson.id;
                          const done = completed[course.slug]?.[lesson.id];
                          const locked =
                            !lesson.free && (!hasFullAccess || !drip.unlocked);

                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              onClick={() => go(lesson.id)}
                              disabled={locked}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition sm:text-sm",
                                selected
                                  ? "bg-white text-primary shadow-sm"
                                  : locked
                                    ? "cursor-not-allowed text-white/30"
                                    : "text-white/80 hover:bg-white/[0.08] hover:text-white",
                              )}
                            >
                              <span
                                className={cn(
                                  "grid h-6 w-6 shrink-0 place-items-center rounded-full",
                                  done
                                    ? "bg-[#2f7354] text-white"
                                    : selected
                                      ? "bg-primary text-white"
                                      : locked
                                        ? "bg-white/[0.06] text-white/35"
                                        : "bg-gold/15 text-[#f0d060]",
                                )}
                              >
                                {done ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : locked ? (
                                  <Lock className="h-3.5 w-3.5" />
                                ) : (
                                  <PlayCircle className="h-3.5 w-3.5" />
                                )}
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-medium">
                                  {lesson.title}
                                </span>
                                <span
                                  className={cn(
                                    "text-[11px]",
                                    selected ? "text-warmgray" : "text-white/45",
                                  )}
                                >
                                  {lesson.duration}
                                  {lesson.free && !hasFullAccess
                                    ? " · Free Preview"
                                    : ""}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
