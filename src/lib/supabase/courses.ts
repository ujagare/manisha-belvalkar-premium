import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  Database,
  Json,
} from "@/lib/supabase/database.types";
import {
  courses as staticCourses,
  type Course,
  type CourseLesson,
  type CourseLessonResource,
  type CourseModule,
  type CourseVideoProvider,
} from "@/lib/data";

type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type ModuleRow = Database["public"]["Tables"]["course_modules"]["Row"];
type LessonRow = Database["public"]["Tables"]["course_lessons"]["Row"];

function createCatalogClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // Read-only catalog client — never mutates cookies.
        },
      },
    },
  );
}

function parseStringArray(raw: Json, fallback: string[] = []): string[] {
  if (!Array.isArray(raw)) return fallback;
  return raw.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function parsePricingOptions(
  raw: Json,
  fallback?: { label: string; price: number; format: string }[],
): { label: string; price: number; format: string }[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return fallback;
  const parsed = raw
    .map((entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
      const obj = entry as Record<string, Json | undefined>;
      const label = typeof obj.label === "string" ? obj.label.trim() : "";
      const format = typeof obj.format === "string" ? obj.format.trim() : "";
      const price = typeof obj.price === "number" ? obj.price : Number(obj.price);
      if (!label || !Number.isFinite(price) || price <= 0) return null;
      return { label, price, format };
    })
    .filter((item): item is { label: string; price: number; format: string } => item !== null);
  return parsed.length ? parsed : fallback;
}

function parseResources(raw: Json): CourseLessonResource[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) return undefined;
  const parsed = raw
    .map((entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
      const obj = entry as Record<string, Json | undefined>;
      const title = typeof obj.title === "string" ? obj.title.trim() : "";
      const url = typeof obj.url === "string" ? obj.url.trim() : "";
      if (!title || !url) return null;
      return { title, url };
    })
    .filter((item): item is CourseLessonResource => item !== null);
  return parsed.length ? parsed : undefined;
}

function normalizeProvider(raw: string | null | undefined): CourseVideoProvider {
  if (raw === "vdocipher" || raw === "bunny" || raw === "external_signed") {
    return raw;
  }
  return "supabase_private";
}

function buildModulesForCourse(
  slug: string,
  moduleRows: ModuleRow[],
  lessonRows: LessonRow[],
  staticFallback?: CourseModule[],
): CourseModule[] | undefined {
  const courseMods = moduleRows.filter((m) => m.course_slug === slug);
  if (courseMods.length === 0) {
    return staticFallback?.map((mod) => ({
      ...mod,
      lessons: mod.lessons.map((lesson) => ({
        ...lesson,
        hasVideo: Boolean(lesson.hasVideo || lesson.videoUrl),
      })),
    }));
  }

  return courseMods.map((mod) => {
    const modLessons: CourseLesson[] = lessonRows
      .filter((l) => l.module_id === mod.id)
      .map((l) => ({
        id: l.lesson_slug,
        title: l.title,
        duration: l.duration_label || "15 min",
        durationSeconds: l.duration_seconds ?? undefined,
        description: l.description ?? undefined,
        notesMarkdown: l.notes_markdown ?? undefined,
        resources: parseResources(l.resources),
        free: l.is_free_preview,
        hasVideo: l.has_video,
        videoProvider: normalizeProvider(l.video_provider),
      }));

    return {
      id: mod.id,
      module: mod.title,
      description: mod.description ?? undefined,
      unlockOffsetDays: mod.unlock_offset_days ?? 0,
      lessons: modLessons,
    };
  });
}

function mergeCourseRow(
  row: CourseRow,
  staticCourse: Course | undefined,
  moduleRows: ModuleRow[],
  lessonRows: LessonRow[],
): Course {
  const priceInr =
    row.amount_subunits != null && row.amount_subunits > 0
      ? Math.round(row.amount_subunits / 100)
      : staticCourse?.price;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title || staticCourse?.title || row.slug,
    seoTitle: row.seo_title ?? staticCourse?.seoTitle,
    seoDescription: row.seo_description ?? staticCourse?.seoDescription,
    duration: row.duration_label || staticCourse?.duration || "Self-paced recorded course",
    description: row.description || staticCourse?.description || "",
    highlights: parseStringArray(row.highlights, staticCourse?.highlights ?? []),
    suitableFor: parseStringArray(row.suitable_for, staticCourse?.suitableFor ?? []),
    image: row.image || staticCourse?.image || "/images/tarot.webp",
    price: priceInr,
    pricingOptions: parsePricingOptions(row.pricing_options, staticCourse?.pricingOptions),
    trackCategory:
      row.track_category === "practitioner" || row.track_category === "sadhana"
        ? row.track_category
        : staticCourse?.trackCategory,
    trackLabel: row.track_label ?? staticCourse?.trackLabel,
    curriculum: buildModulesForCourse(
      row.slug,
      moduleRows,
      lessonRows,
      staticCourse?.curriculum,
    ),
  };
}

/**
 * Fetches all active courses (DB-backed courses + modules + lessons merged
 * cleanly with static fallback courses in `src/lib/data.ts`).
 *
 * Safe to call in both static/ISR pages and dynamic server components because
 * it uses a cookie-less anon client and never touches `course_lesson_media`.
 */
export const getCourses = cache(async (): Promise<Course[]> => {
  const hydratedStatic = staticCourses.map((course) => ({
    ...course,
    curriculum: course.curriculum?.map((mod) => ({
      ...mod,
      lessons: mod.lessons.map((lesson) => ({
        ...lesson,
        hasVideo: Boolean(lesson.hasVideo || lesson.videoUrl),
      })),
    })),
  }));

  if (!isSupabaseConfigured()) return hydratedStatic;

  try {
    const supabase = createCatalogClient();
    const [coursesRes, modulesRes, lessonsRes] = await Promise.all([
      supabase
        .from("courses")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("course_modules")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase
        .from("course_lessons")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

    if (coursesRes.error && modulesRes.error) {
      return hydratedStatic;
    }

    const dbCourses = coursesRes.data ?? [];
    const dbModules = modulesRes.data ?? [];
    const dbLessons = lessonsRes.data ?? [];

    if (dbCourses.length === 0 && dbModules.length === 0) {
      return hydratedStatic;
    }

    const staticBySlug = new Map(hydratedStatic.map((c) => [c.slug, c]));
    const dbBySlug = new Map(dbCourses.map((c) => [c.slug, c]));
    const inactiveSlugs = new Set(
      dbCourses.filter((c) => !c.is_active).map((c) => c.slug),
    );

    const result: Course[] = [];
    const seen = new Set<string>();

    // 1. DB courses in explicit sort_order
    for (const row of dbCourses) {
      if (!row.is_active) continue;
      seen.add(row.slug);
      result.push(
        mergeCourseRow(row, staticBySlug.get(row.slug), dbModules, dbLessons),
      );
    }

    // 2. Static courses not yet imported to `courses` table (unless deactivated in DB),
    //    still picking up any `course_modules` / `course_lessons` attached to their slug!
    for (const staticCourse of hydratedStatic) {
      if (seen.has(staticCourse.slug) || inactiveSlugs.has(staticCourse.slug)) {
        continue;
      }
      if (!dbBySlug.has(staticCourse.slug)) {
        result.push({
          ...staticCourse,
          curriculum: buildModulesForCourse(
            staticCourse.slug,
            dbModules,
            dbLessons,
            staticCourse.curriculum,
          ),
        });
      }
    }

    return result;
  } catch (err) {
    console.warn("[courses] DB catalog read failed, falling back to static:", err);
    return hydratedStatic;
  }
});

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const all = await getCourses();
  return all.find((c) => c.slug === slug) ?? null;
}
