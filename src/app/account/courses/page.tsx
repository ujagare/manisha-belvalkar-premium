import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BookOpen, Clock3, GraduationCap } from "lucide-react";
import { courses } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser, getMyEnrollments } from "@/lib/supabase/session";

export const metadata: Metadata = {
  title: "My Courses",
  robots: { index: false, follow: false },
};

export default async function MyCoursesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account/courses");

  const configured = isSupabaseConfigured();
  const enrollments = configured ? await getMyEnrollments(50) : [];
  const enrolledSlugs = new Set(enrollments.map((e) => e.course_slug));
  const enrolledCourses = courses.filter((c) => enrolledSlugs.has(c.slug));
  const allLessons = (c: (typeof courses)[number]) => c.curriculum?.flatMap((m) => m.lessons) ?? [];

  return (
    <section className="relative overflow-hidden bg-ivory pb-24 pt-32 lg:pt-40">
      <div className="glow-gold absolute -right-32 -top-32 h-[400px] w-[400px]" />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <Link href="/account" className="inline-flex items-center gap-2 text-sm font-medium text-warmgray hover:text-primary">
          ← Back to My Account
        </Link>
        <div className="mt-6 border-b border-parchment pb-6">
          <p className="eyebrow text-gold-dark">Student dashboard</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-charcoal sm:text-5xl">My Courses</h1>
          <p className="mt-3 max-w-2xl text-warmgray">Access every course you&apos;ve enrolled in and continue exactly where you left off.</p>
        </div>

        {!configured ? (
          <div className="mt-8 rounded-2xl border border-gold/40 bg-gold-soft p-5 text-sm text-gold-deep">
            <strong>Setup pending:</strong> Supabase keys abhi placeholders hain. Connection hone ke baad aapke enrolled courses yahan dikhenge. Tab tak aap free lessons preview kar sakte hain.
          </div>
        ) : null}

        {enrolledCourses.length ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {enrolledCourses.map((course) => {
              const lessons = allLessons(course);
              return (
                <Link key={course.slug} href={`/learn/${course.slug}`} className="group flex flex-col overflow-hidden rounded-[28px] border border-parchment bg-gradient-to-b from-white to-cream/70 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_30px_70px_-28px_rgba(221,184,41,0.5)]">
                  <div className="relative h-44 bg-ivory">
                    <div className="absolute inset-0 scale-125 bg-cover bg-center opacity-40 blur-xl" style={{ backgroundImage: `url('${course.image}')` }} />
                    <div className="absolute inset-0 bg-contain bg-center p-4 transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${course.image}')`, backgroundRepeat: "no-repeat" }} />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-xl font-bold text-charcoal group-hover:text-primary">{course.title}</h2>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-warmgray">
                      <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" />{course.duration}</span>
                      {lessons.length ? <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{lessons.length} lessons</span> : null}
                    </div>
                    <span className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition group-hover:brightness-110">
                      Open course <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-parchment bg-white p-12 text-center">
            <GraduationCap className="mx-auto h-10 w-10 text-gold-dark" />
            <p className="mt-3 text-warmgray">No courses here yet.</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-warmgray/70">Browse the course catalog and enroll to see them in your library.</p>
            <Link href="/courses" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:brightness-110">
              Explore courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
