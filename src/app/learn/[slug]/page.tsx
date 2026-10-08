import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses } from "@/lib/data";
import CoursePlayer from "@/components/course/CoursePlayer";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return courses.filter((c) => c.curriculum?.length).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) return { title: "Course not found" };
  return { title: `${course.title} — Student`, robots: { index: false, follow: false } };
}

export default async function LearnCoursePage({ params }: Props) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  if (!course) notFound();
  return <CoursePlayer course={course} />;
}
