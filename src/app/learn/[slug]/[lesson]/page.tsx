import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses } from "@/lib/data";
import { flattenLessons } from "@/lib/course-content";
import CoursePlayer from "@/components/course/CoursePlayer";

interface Props {
  params: Promise<{ slug: string; lesson: string }>;
}

export async function generateStaticParams() {
  return courses
    .filter((c) => c.curriculum?.length)
    .flatMap((c) => flattenLessons(c).map((l) => ({ slug: c.slug, lesson: l.id })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lesson } = await params;
  const course = courses.find((c) => c.slug === slug);
  const found = course ? flattenLessons(course).find((l) => l.id === lesson) : null;
  if (!course || !found) return { title: "Lesson not found" };
  return { title: `${found.title} — ${course.title}`, robots: { index: false, follow: false } };
}

export default async function LessonPage({ params }: Props) {
  const { slug, lesson } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();
  if (!flattenLessons(course).some((l) => l.id === lesson)) notFound();
  return <CoursePlayer course={course} initialLessonId={lesson} />;
}
