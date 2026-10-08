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
