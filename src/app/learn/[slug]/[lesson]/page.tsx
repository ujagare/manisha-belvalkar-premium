import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import CoursePlayer from "@/components/course/CoursePlayer";
import { courseForViewer, flattenLessons } from "@/lib/course-content";
import { getCourseBySlug } from "@/lib/supabase/courses";
import {
  getCurrentUser,
  getMyCourseEnrollment,
  getMyCourseNotes,
  getMyCourseProgress,
} from "@/lib/supabase/session";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string; lesson: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lesson } = await params;
  const course = await getCourseBySlug(slug);
  const found = course
    ? flattenLessons(course).find((l) => l.id === lesson)
    : null;
  if (!course || !found) return { title: "Lesson not found" };
  return {
    title: `${found.title} — ${course.title}`,
    robots: { index: false, follow: false },
  };
}

export default async function LessonPage({ params }: Props) {
  const { slug, lesson } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const selectedLesson = flattenLessons(course).find(
    (item) => item.id === lesson,
  );
  if (!selectedLesson) notFound();

  const user = await getCurrentUser();
  const enrollment = user ? await getMyCourseEnrollment(slug) : null;
  const fullAccess = Boolean(enrollment);

  if (!selectedLesson.free && !user) {
    redirect(`/login?next=${encodeURIComponent(`/learn/${slug}/${lesson}`)}`);
  }
  if (!selectedLesson.free && !fullAccess) {
    redirect(`/courses/${slug}?access=required`);
  }

  const [progress, notes] = fullAccess
    ? await Promise.all([getMyCourseProgress(slug), getMyCourseNotes(slug)])
    : [[], []];

  const enrolledAt = enrollment?.enrolled_at ?? enrollment?.created_at ?? null;

  return (
    <CoursePlayer
      course={courseForViewer(course, fullAccess, enrolledAt)}
      initialLessonId={lesson}
      hasFullAccess={fullAccess}
      enrolledAtIso={enrolledAt}
      initialProgress={progress}
      initialNotes={notes}
    />
  );
}
