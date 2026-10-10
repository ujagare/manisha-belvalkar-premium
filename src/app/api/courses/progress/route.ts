import { apiError, apiSuccess, readJsonObject } from "@/lib/api";
import { courses } from "@/lib/data";
import { flattenLessons } from "@/lib/course-content";
import { createClient } from "@/lib/supabase/server";
import { isSameOriginRequest } from "@/lib/security";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return apiError("UNAUTHORIZED", "Please sign in to save progress.", 401);

  const body = await readJsonObject(request);
  const courseSlug = typeof body.courseSlug === "string" ? body.courseSlug : "";
  const lessonId = typeof body.lessonId === "string" ? body.lessonId : "";
  const course = courses.find((item) => item.slug === courseSlug);
  if (!course || !flattenLessons(course).some((lesson) => lesson.id === lessonId)) {
    return apiError("BAD_REQUEST", "Unknown course lesson.", 422);
  }

  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_slug", courseSlug)
    .in("status", ["active", "completed"])
    .limit(1)
    .maybeSingle();
  if (!enrollment) return apiError("FORBIDDEN", "This course is not in your library.", 403);

  const completed = body.completed === true;
  const watchedSeconds = typeof body.watchedSeconds === "number"
    ? Math.max(0, Math.min(86400, Math.floor(body.watchedSeconds)))
    : 0;
  const now = new Date().toISOString();
  const { error } = await supabase.from("course_lesson_progress").upsert({
    user_id: user.id,
    course_slug: courseSlug,
    lesson_id: lessonId,
    completed,
    watched_seconds: watchedSeconds,
    last_watched_at: now,
    completed_at: completed ? now : null,
  }, { onConflict: "user_id,course_slug,lesson_id" });
  if (error) return apiError("INTERNAL_ERROR", "Progress could not be saved.", 500);
  return apiSuccess({ saved: true });
}
