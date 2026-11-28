import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import CoursePlayer from "@/components/course/CoursePlayer";
import { courseForViewer } from "@/lib/course-content";
import { getCourseBySlug } from "@/lib/supabase/courses";
import {
  getCurrentUser,
  getMyCourseEnrollment,
  getMyCourseNotes,
  getMyCourseProgress,
} from "@/lib/supabase/session";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course not found" };
  return {
    title: `${course.title} — Classroom`,
    robots: { index: false, follow: false },
  };
}

export default async function LearnCoursePage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/learn/${slug}`)}`);

  const enrollment = await getMyCourseEnrollment(slug);
  if (!enrollment) redirect(`/courses/${slug}?access=required`);

  const [progress, notes] = await Promise.all([
    getMyCourseProgress(slug),
    getMyCourseNotes(slug),
  ]);

  const enrolledAt = enrollment.enrolled_at ?? enrollment.created_at;

  return (
    <CoursePlayer
      course={courseForViewer(course, true, enrolledAt)}
      hasFullAccess
      enrolledAtIso={enrolledAt}
      initialProgress={progress}
      initialNotes={notes}
    />
  );
}
