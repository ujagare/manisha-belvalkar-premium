import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Clock3, GraduationCap, Play, Sparkles } from "lucide-react";
import { courses } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser, getMyCourseProgress, getMyEnrollments } from "@/lib/supabase/session";

export const metadata: Metadata = { title: "My Courses", robots: { index: false, follow: false } };

export default async function MyCoursesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/courses");

  const configured = isSupabaseConfigured();
  const enrollments = configured ? await getMyEnrollments(50) : [];
  const progressRows = configured ? await getMyCourseProgress() : [];
  const enrolledSlugs = new Set(enrollments.filter((item) => ["active", "completed"].includes(item.status)).map((item) => item.course_slug));
  const enrolledCourses = courses.filter((course) => enrolledSlugs.has(course.slug));

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f3e9] pb-24 pt-28 lg:pt-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_82%_8%,rgba(221,184,41,0.17),transparent_32%),radial-gradient(circle_at_5%_20%,rgba(180,20,20,0.07),transparent_28%)]" />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <Link href="/account" className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-warmgray transition hover:text-primary"><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to My Account</Link>
        <header className="mt-8 grid gap-6 border-b border-gold/20 pb-9 sm:grid-cols-[1fr_auto] sm:items-end">
          <div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-deep">Your learning space</p><h1 className="mt-3 font-display text-5xl font-semibold tracking-[-0.03em] text-charcoal sm:text-6xl">My courses</h1><p className="mt-4 max-w-2xl leading-7 text-warmgray">Your recorded programs, lesson progress and next steps—all in one private library.</p></div>
          {enrolledCourses.length ? <div className="flex items-center gap-3 rounded-2xl bg-white/60 px-5 py-4 ring-1 ring-parchment"><GraduationCap className="h-5 w-5 text-primary" /><div><p className="text-xs text-warmgray">Active learning</p><p className="font-display text-xl font-semibold text-charcoal">{enrolledCourses.length} {enrolledCourses.length === 1 ? "course" : "courses"}</p></div></div> : null}
        </header>

        {!configured ? <div className="mt-8 rounded-2xl bg-gold-soft p-5 text-sm text-gold-deep ring-1 ring-gold/35"><strong>Setup pending:</strong> Connect Supabase to display enrolled courses and sync lesson progress.</div> : null}

        {enrolledCourses.length ? (
          <section className="mt-9 grid gap-7 md:grid-cols-2" aria-label="Enrolled courses">
            {enrolledCourses.map((course) => {
              const lessons = course.curriculum?.flatMap((module) => module.lessons) ?? [];
              const courseProgress = progressRows.filter((row) => row.course_slug === course.slug);
              const completeCount = courseProgress.filter((row) => row.completed).length;
              const percentage = lessons.length ? Math.round((completeCount / lessons.length) * 100) : 0;
              const resumeLesson = courseProgress[0]?.lesson_id ?? lessons[0]?.id;
              const learningHref = resumeLesson ? `/learn/${course.slug}/${resumeLesson}` : `/learn/${course.slug}`;
              return (
                <article key={course.slug} className="group overflow-hidden rounded-[1.75rem] bg-white shadow-[0_24px_70px_-46px_rgba(62,38,25,0.45)] ring-1 ring-parchment transition duration-300 hover:-translate-y-1 hover:ring-gold/55">
                  <div className="relative h-52 overflow-hidden bg-charcoal"><Image src={course.image} alt={course.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-5 transition-transform duration-700 group-hover:scale-[1.04]" /><div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-transparent to-transparent" /><span className="absolute bottom-4 left-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-light"><Sparkles className="h-3.5 w-3.5" /> Enrolled</span></div>
                  <div className="p-6"><h2 className="font-display text-2xl font-semibold text-charcoal transition group-hover:text-primary">{course.title}</h2><div className="mt-3 flex flex-wrap gap-4 text-xs text-warmgray"><span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{course.duration}</span><span className="inline-flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" />{lessons.length} lessons</span></div>
                    <div className="mt-6"><div className="mb-2 flex justify-between text-xs"><span className="text-warmgray">{completeCount} of {lessons.length} lessons complete</span><span className="font-semibold tabular-nums text-primary">{percentage}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-parchment"><div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${percentage}%` }} /></div></div>
                    <Link href={learningHref} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"><Play className="h-4 w-4 fill-current" />{percentage ? "Resume learning" : "Start course"}<ArrowRight className="h-4 w-4" /></Link>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <section className="relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-[2rem] bg-charcoal px-6 py-14 text-center text-white shadow-[0_35px_90px_-45px_rgba(62,38,25,0.75)]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(221,184,41,0.2),transparent_42%)]" /><div className="relative"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gold/15 ring-1 ring-gold/30"><GraduationCap className="h-8 w-8 text-gold-light" /></span><h2 className="mt-6 font-display text-3xl font-semibold">Your learning library is ready.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/60">Choose a course and complete enrolment. Your recorded lessons will appear here automatically.</p><Link href="/courses" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold text-primary-deeper">Explore courses <ArrowRight className="h-4 w-4" /></Link></div></section>
        )}
      </div>
    </div>
  );
}
