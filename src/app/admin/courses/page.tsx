import Link from "next/link";
import CourseStudioClient, {
  type AdminCourseItem,
  type AdminEnrollmentItem,
  type AdminLessonItem,
  type AdminModuleItem,
  type AdminSecurityEventItem,
} from "@/components/admin/CourseStudioClient";
import { courses as staticCourses } from "@/lib/data";
import { isVdoCipherConfigured, serverEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaff } from "@/lib/supabase/staff";

export const metadata = {
  title: "Recorded Courses & DRM Studio",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  await requireStaff(["owner", "admin", "catalog_manager"]);
  const admin = createAdminClient();

  const [
    coursesRes,
    modulesRes,
    lessonsRes,
    mediaRes,
    enrollmentsRes,
    devicesRes,
    eventsRes,
  ] = await Promise.all([
    admin
      .from("courses")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    admin
      .from("course_modules")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    admin
      .from("course_lessons")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    admin.from("course_lesson_media").select("*"),
    admin
      .from("course_enrollments")
      .select("id,user_id,course_slug,status,enrolled_at,created_at")
      .order("created_at", { ascending: false })
      .limit(150),
    admin.from("course_registered_devices").select("user_id,is_blocked"),
    admin
      .from("course_security_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const dbCoursesRows = coursesRes.data ?? [];
  const dbModulesRows = modulesRes.data ?? [];
  const dbLessonsRows = lessonsRes.data ?? [];
  const mediaByLessonId = new Map(
    (mediaRes.data ?? []).map((m) => [m.lesson_id, m]),
  );

  const userIds = Array.from(
    new Set([
      ...(enrollmentsRes.data ?? []).map((e) => e.user_id),
      ...(eventsRes.data ?? [])
        .map((ev) => ev.user_id)
        .filter((id): id is string => Boolean(id)),
    ]),
  );

  const { data: profilesRows } = userIds.length
    ? await admin
        .from("profiles")
        .select("id,full_name,email,phone")
        .in("id", userIds)
    : { data: [] };

  const profileMap = new Map((profilesRows ?? []).map((p) => [p.id, p]));
  const deviceCountByUser = new Map<string, number>();
  for (const dev of devicesRes.data ?? []) {
    deviceCountByUser.set(
      dev.user_id,
      (deviceCountByUser.get(dev.user_id) ?? 0) + 1,
    );
  }

  const courses: AdminCourseItem[] = dbCoursesRows.map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    durationLabel: row.duration_label ?? "Self-paced recorded series",
    priceInr: row.amount_subunits ? Math.round(row.amount_subunits / 100) : 0,
    image: row.image ?? "/images/tarot.webp",
    highlights: Array.isArray(row.highlights)
      ? row.highlights.filter((x: unknown): x is string => typeof x === "string")
      : [],
    suitableFor: Array.isArray(row.suitable_for)
      ? row.suitable_for.filter((x: unknown): x is string => typeof x === "string")
      : [],
    trackCategory:
      row.track_category === "practitioner" ? "practitioner" : "sadhana",
    trackLabel: row.track_label ?? "",
    sortOrder: row.sort_order ?? 0,
    isActive: row.is_active,
  }));

  const dbSlugs = new Set(courses.map((c) => c.slug));
  const unimportedStatic = staticCourses
    .filter((c) => !dbSlugs.has(c.slug))
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      priceInr: c.price ?? 0,
      moduleCount: c.curriculum?.length ?? 0,
      lessonCount:
        c.curriculum?.reduce((sum, m) => sum + m.lessons.length, 0) ?? 0,
    }));

  const modules: AdminModuleItem[] = dbModulesRows.map((m) => ({
    id: m.id,
    courseSlug: m.course_slug,
    title: m.title,
    description: m.description ?? "",
    sortOrder: m.sort_order,
    unlockOffsetDays: m.unlock_offset_days,
    isPublished: m.is_published,
  }));

  const lessons: AdminLessonItem[] = dbLessonsRows.map((l) => {
    const media = mediaByLessonId.get(l.id);
    return {
      id: l.id,
      moduleId: l.module_id,
      courseSlug: l.course_slug,
      lessonSlug: l.lesson_slug,
      title: l.title,
      durationLabel: l.duration_label,
      description: l.description ?? "",
      notesMarkdown: l.notes_markdown ?? "",
      resources: Array.isArray(l.resources)
        ? (l.resources as Array<{ title: string; url: string }>)
        : [],
      isFreePreview: l.is_free_preview,
      videoProvider:
        (media?.video_provider as AdminLessonItem["videoProvider"]) ??
        (l.video_provider as AdminLessonItem["videoProvider"]) ??
        "supabase_private",
      hasVideo: l.has_video,
      sortOrder: l.sort_order,
      isPublished: l.is_published,
      storagePath: media?.storage_path ?? "",
      vdocipherVideoId: media?.vdocipher_video_id ?? "",
      bunnyLibraryId: media?.bunny_library_id ?? "",
      bunnyVideoId: media?.bunny_video_id ?? "",
      externalSourceUrl: media?.external_source_url ?? "",
    };
  });

  const enrollments: AdminEnrollmentItem[] = (enrollmentsRes.data ?? []).map(
    (e) => {
      const prof = profileMap.get(e.user_id);
      return {
        id: e.id,
        userId: e.user_id,
        studentName: prof?.full_name ?? "Student",
        studentEmail: prof?.email ?? e.user_id.slice(0, 8),
        studentPhone: prof?.phone ?? null,
        courseSlug: e.course_slug,
        status: e.status,
        enrolledAt: e.enrolled_at ?? e.created_at,
        deviceCount: deviceCountByUser.get(e.user_id) ?? 0,
      };
    },
  );

  const securityEvents: AdminSecurityEventItem[] = (eventsRes.data ?? []).map(
    (ev) => {
      const prof = ev.user_id ? profileMap.get(ev.user_id) : undefined;
      return {
        id: ev.id,
        userId: ev.user_id,
        studentEmail: prof?.email ?? (ev.user_id ? ev.user_id.slice(0, 8) : "Guest / Unauthenticated"),
        courseSlug: ev.course_slug,
        lessonId: ev.lesson_id,
        eventType: ev.event_type,
        severity: ev.severity,
        ipHash: ev.ip_hash,
        createdAt: ev.created_at,
      };
    },
  );

  const allCourseSlugs = [
    ...courses.map((c) => ({ slug: c.slug, title: c.title })),
    ...unimportedStatic.map((c) => ({ slug: c.slug, title: `${c.title} (Static)` })),
  ];

  return (
    <main className="min-h-[100dvh] bg-ivory px-4 pb-24 pt-20 sm:px-6 sm:pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-parchment pb-6">
          <div>
            <p className="eyebrow text-gold-deep">Private operations · LMS &amp; Anti-Piracy</p>
            <h1 className="mt-2.5 font-display text-3xl font-bold text-charcoal sm:text-5xl">
              Recorded Courses &amp; Series Studio
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-warmgray">
              Create multi-module video series, upload episodes directly into the encrypted private vault (or connect VdoCipher / Bunny DRM), manage student access, and monitor anti-piracy alerts.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex min-h-10 items-center text-sm font-semibold text-primary hover:underline"
          >
            ← Back to operations
          </Link>
        </div>

        <CourseStudioClient
          initialCourses={courses}
          unimportedStatic={unimportedStatic}
          initialModules={modules}
          initialLessons={lessons}
          initialEnrollments={enrollments}
          initialSecurityEvents={securityEvents}
          allCourseOptions={allCourseSlugs}
          vdocipherConfigured={isVdoCipherConfigured()}
          maxDevicesPerStudent={serverEnv.courseMaxDevices()}
        />
      </div>
    </main>
  );
}
