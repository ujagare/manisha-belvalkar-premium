import type { Course, CourseLesson } from "@/lib/data";
import { isModuleUnlockedByDrip } from "@/lib/course-security";

/** Flatten a course's curriculum modules into a single ordered lesson list. */
export function flattenLessons(course: Course): CourseLesson[] {
  return course.curriculum?.flatMap((m) => m.lessons) ?? [];
}

/** Total lesson count across a course's curriculum. */
export function courseLessonCount(course: Course): number {
  return flattenLessons(course).length;
}

/** Find one lesson by id across the whole course. */
export function findLesson(course: Course, lessonId: string): CourseLesson | undefined {
  return flattenLessons(course).find((l) => l.id === lessonId);
}

/**
 * Sanitizes a Course before serializing into any React Server Component or
 * client bundle.
 *
 * ZERO-LEAK INVARIANT:
 * - Raw `videoUrl` is ALWAYS stripped — even for enrolled students! Media
 *   playback is authorized strictly one lesson at a time through
 *   `POST /api/courses/playback` (which enforces active enrollment, device cap,
 *   single-stream session lock, and short-lived HMAC / DRM tokens).
 * - Paid lesson `notesMarkdown` and `resources` are stripped unless the viewer
 *   owns full access or the lesson is marked `free` AND its module drip window
 *   has opened.
 */
export function courseForViewer(
  course: Course,
  hasFullAccess: boolean,
  enrolledAtIso?: string | null,
): Course {
  if (!course.curriculum) return course;
  return {
    ...course,
    curriculum: course.curriculum.map((module) => {
      const drip = isModuleUnlockedByDrip(module.unlockOffsetDays, enrolledAtIso);
      const moduleUnlocked = hasFullAccess && drip.unlocked;
      return {
        ...module,
        lessons: module.lessons.map((lesson) => {
          const canReadContent = Boolean(lesson.free || moduleUnlocked);
          const hasVideo = Boolean(lesson.hasVideo || lesson.videoUrl);
          return {
            ...lesson,
            hasVideo,
            videoUrl: undefined,
            notesMarkdown: canReadContent ? lesson.notesMarkdown : undefined,
            resources: canReadContent ? lesson.resources : undefined,
          };
        }),
      };
    }),
  };
}
