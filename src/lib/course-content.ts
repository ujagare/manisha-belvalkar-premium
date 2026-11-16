import type { Course, CourseLesson } from "@/lib/data";

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
 * The course shape that may be handed to the client player.
 *
 * The whole course object is serialised into the RSC payload, so without this
 * a preview visitor would receive the `videoUrl` of every paid lesson. Lesson
 * titles, durations and ordering are always safe to send; the media URL is only
 * kept for lessons the viewer is actually entitled to play.
 */
export function courseForViewer(course: Course, hasFullAccess: boolean): Course {
  if (hasFullAccess || !course.curriculum) return course;
  return {
    ...course,
    curriculum: course.curriculum.map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) =>
        lesson.free ? lesson : { ...lesson, videoUrl: undefined },
      ),
    })),
  };
}
