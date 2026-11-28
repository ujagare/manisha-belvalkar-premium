import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { apiError, apiSuccess, readJsonObject, requestId } from "@/lib/api";
import { COURSE_VIDEO_BUCKET } from "@/lib/course-security";
import { courses as staticCourses } from "@/lib/data";
import { isSameOriginRequest } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const ALLOWED_STAFF_ROLES = ["owner", "admin", "catalog_manager"];
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PROVIDERS = new Set([
  "supabase_private",
  "vdocipher",
  "bunny",
  "external_signed",
]);

async function authorizeCourseAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: apiError("UNAUTHORIZED", "Please sign in.", 401) };

  const admin = createAdminClient();
  const { data: staff } = await admin
    .from("staff_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!staff || !ALLOWED_STAFF_ROLES.includes(staff.role)) {
    return { error: apiError("FORBIDDEN", "Course admin access required.", 403) };
  }

  const { data: assurance } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (assurance?.currentLevel !== "aal2") {
    return {
      error: apiError(
        "FORBIDDEN",
        "Two-factor authentication (MFA) is required for admin changes.",
        403,
      ),
    };
  }

  return { user, admin, role: staff.role };
}

function cleanLines(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input
      .filter((item): item is string => typeof item === "string")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20);
  }
  if (typeof input === "string") {
    return input
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20);
  }
  return [];
}

export async function POST(request: Request) {
  const traceId = requestId(request);
  try {
    if (!isSameOriginRequest(request)) {
      return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
    }

    const auth = await authorizeCourseAdmin();
    if ("error" in auth) return auth.error;
    const { user, admin } = auth;

    const body = await readJsonObject(request);
    const action = typeof body.action === "string" ? body.action : "";

    // 1. Import static catalog course + curriculum into DB for visual editing
    if (action === "import_static_course") {
      const slug = typeof body.slug === "string" ? body.slug.trim() : "";
      const source = staticCourses.find((c) => c.slug === slug);
      if (!source) {
        return apiError("NOT_FOUND", "Static course not found.", 404);
      }

      const { error: courseErr } = await admin.from("courses").upsert(
        {
          slug: source.slug,
          title: source.title,
          description: source.description,
          delivery_format: "recorded",
          amount_subunits: source.price ? Math.round(source.price * 100) : null,
          currency: "INR",
          duration_label: source.duration,
          image: source.image,
          highlights: source.highlights,
          suitable_for: source.suitableFor,
          pricing_options: source.pricingOptions ?? [],
          track_category:
            source.slug === "professional-tarot-reader" ||
            source.slug === "personalized-wellbeing" ||
            source.slug === "soul-purpose-reading-course"
              ? "practitioner"
              : "sadhana",
          seo_title: source.seoTitle ?? null,
          seo_description: source.seoDescription ?? null,
          is_active: true,
        },
        { onConflict: "slug" },
      );
      if (courseErr) throw courseErr;

      if (source.curriculum?.length) {
        const { data: existingMods } = await admin
          .from("course_modules")
          .select("id")
          .eq("course_slug", source.slug)
          .limit(1);

        if (!existingMods?.length) {
          for (let mIndex = 0; mIndex < source.curriculum.length; mIndex += 1) {
            const mod = source.curriculum[mIndex];
            const { data: createdMod, error: modErr } = await admin
              .from("course_modules")
              .insert({
                course_slug: source.slug,
                title: mod.module,
                sort_order: mIndex * 10,
                is_published: true,
              })
              .select("id")
              .single();
            if (modErr || !createdMod) throw modErr;

            for (let lIndex = 0; lIndex < mod.lessons.length; lIndex += 1) {
              const lesson = mod.lessons[lIndex];
              const { data: createdLesson, error: lesErr } = await admin
                .from("course_lessons")
                .insert({
                  module_id: createdMod.id,
                  course_slug: source.slug,
                  lesson_slug: lesson.id,
                  title: lesson.title,
                  duration_label: lesson.duration,
                  description: lesson.description ?? null,
                  is_free_preview: Boolean(lesson.free),
                  video_provider: lesson.videoUrl ? "external_signed" : "supabase_private",
                  has_video: Boolean(lesson.videoUrl),
                  sort_order: lIndex * 10,
                  is_published: true,
                })
                .select("id")
                .single();
              if (lesErr || !createdLesson) throw lesErr;

              if (lesson.videoUrl) {
                await admin.from("course_lesson_media").upsert(
                  {
                    lesson_id: createdLesson.id,
                    course_slug: source.slug,
                    lesson_slug: lesson.id,
                    video_provider: "external_signed",
                    external_source_url: lesson.videoUrl,
                  },
                  { onConflict: "lesson_id" },
                );
              }
            }
          }
        }
      }

      await admin.from("audit_logs").insert({
        actor_user_id: user.id,
        action: "course.imported_from_static",
        entity_type: "course",
        entity_id: source.slug,
        metadata: { slug: source.slug },
      });

      revalidatePath("/courses");
      revalidatePath(`/courses/${source.slug}`);
      revalidatePath(`/learn/${source.slug}`);
      return apiSuccess({ imported: true, slug: source.slug });
    }

    // 2. Create or Update Course Metadata
    if (action === "upsert_course") {
      const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
      const title = typeof body.title === "string" ? body.title.trim() : "";
      if (!SLUG_REGEX.test(slug) || slug.length > 80) {
        return apiError(
          "BAD_REQUEST",
          "Slug must use lowercase letters, numbers, and hyphens only (e.g. tarot-foundation-batch-1).",
          422,
        );
      }
      if (title.length < 3) {
        return apiError("BAD_REQUEST", "Course title must be at least 3 characters.", 422);
      }

      const priceInr = typeof body.priceInr === "number" ? body.priceInr : Number(body.priceInr);
      const amountSubunits =
        Number.isFinite(priceInr) && priceInr > 0 ? Math.round(priceInr * 100) : null;
      const durationLabel =
        typeof body.durationLabel === "string" && body.durationLabel.trim()
          ? body.durationLabel.trim().slice(0, 120)
          : "Self-paced recorded series";
      const description =
        typeof body.description === "string" ? body.description.trim().slice(0, 4000) : "";
      const image =
        typeof body.image === "string" && body.image.trim()
          ? body.image.trim().slice(0, 500)
          : "/images/tarot.webp";
      const trackCategory =
        body.trackCategory === "practitioner" ? "practitioner" : "sadhana";
      const trackLabel =
        typeof body.trackLabel === "string" && body.trackLabel.trim()
          ? body.trackLabel.trim().slice(0, 80)
          : null;
      const isActive = body.isActive !== false;
      const sortOrder =
        typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)
          ? Math.floor(body.sortOrder)
          : 0;

      const highlights = cleanLines(body.highlights);
      const suitableFor = cleanLines(body.suitableFor);

      const { error } = await admin.from("courses").upsert(
        {
          slug,
          title,
          description,
          delivery_format: "recorded",
          amount_subunits: amountSubunits,
          currency: "INR",
          duration_label: durationLabel,
          image,
          highlights,
          suitable_for: suitableFor,
          track_category: trackCategory,
          track_label: trackLabel,
          sort_order: sortOrder,
          is_active: isActive,
        },
        { onConflict: "slug" },
      );

      if (error) throw error;

      await admin.from("audit_logs").insert({
        actor_user_id: user.id,
        action: "course.upserted",
        entity_type: "course",
        entity_id: slug,
        metadata: { title, priceInr: amountSubunits ? amountSubunits / 100 : null, isActive },
      });

      revalidatePath("/courses");
      revalidatePath(`/courses/${slug}`);
      revalidatePath(`/learn/${slug}`);
      return apiSuccess({ saved: true, slug });
    }

    // 3. Create or Update Series Module (Chapter / Part)
    if (action === "upsert_module") {
      const id = typeof body.id === "string" && body.id.trim() ? body.id.trim() : undefined;
      const courseSlug =
        typeof body.courseSlug === "string" ? body.courseSlug.trim() : "";
      const title = typeof body.title === "string" ? body.title.trim() : "";
      if (!SLUG_REGEX.test(courseSlug) || title.length < 2) {
        return apiError("BAD_REQUEST", "Valid course slug and module title required.", 422);
      }

      const description =
        typeof body.description === "string" && body.description.trim()
          ? body.description.trim().slice(0, 1000)
          : null;
      const sortOrder =
        typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)
          ? Math.floor(body.sortOrder)
          : 0;
      const unlockOffsetDays =
        typeof body.unlockOffsetDays === "number" && body.unlockOffsetDays >= 0
          ? Math.min(365, Math.floor(body.unlockOffsetDays))
          : 0;
      const isPublished = body.isPublished !== false;

      const payload = {
        ...(id ? { id } : {}),
        course_slug: courseSlug,
        title,
        description,
        sort_order: sortOrder,
        unlock_offset_days: unlockOffsetDays,
        is_published: isPublished,
      };

      const { data, error } = id
        ? await admin
            .from("course_modules")
            .update(payload)
            .eq("id", id)
            .select("id")
            .single()
        : await admin
            .from("course_modules")
            .insert(payload)
            .select("id")
            .single();

      if (error) throw error;

      revalidatePath("/courses");
      revalidatePath(`/courses/${courseSlug}`);
      revalidatePath(`/learn/${courseSlug}`);
      return apiSuccess({ moduleId: data.id });
    }

    // 4. Delete Module
    if (action === "delete_module") {
      const moduleId = typeof body.moduleId === "string" ? body.moduleId.trim() : "";
      const courseSlug = typeof body.courseSlug === "string" ? body.courseSlug.trim() : "";
      if (!moduleId) return apiError("BAD_REQUEST", "Module ID required.", 422);

      const { error } = await admin.from("course_modules").delete().eq("id", moduleId);
      if (error) throw error;

      if (courseSlug) {
        revalidatePath("/courses");
        revalidatePath(`/courses/${courseSlug}`);
        revalidatePath(`/learn/${courseSlug}`);
      }
      return apiSuccess({ deleted: true });
    }

    // 5. Generate Direct-to-Vault Signed Video Upload URL (up to 512 MB per episode)
    if (action === "create_upload_url") {
      const courseSlug =
        typeof body.courseSlug === "string" ? body.courseSlug.trim() : "";
      const lessonSlug =
        typeof body.lessonSlug === "string" ? body.lessonSlug.trim() : "";
      const mimeType =
        typeof body.mimeType === "string" ? body.mimeType.trim() : "video/mp4";

      if (!SLUG_REGEX.test(courseSlug) || !SLUG_REGEX.test(lessonSlug)) {
        return apiError(
          "BAD_REQUEST",
          "Valid course slug and lesson ID are required before uploading.",
          422,
        );
      }

      const ext =
        mimeType === "video/webm"
          ? "webm"
          : mimeType === "video/quicktime"
            ? "mov"
            : mimeType === "application/pdf"
              ? "pdf"
              : "mp4";

      const storagePath = `${courseSlug}/${lessonSlug}-${randomUUID().slice(0, 8)}.${ext}`;
      const { data, error } = await admin.storage
        .from(COURSE_VIDEO_BUCKET)
        .createSignedUploadUrl(storagePath);

      if (error || !data) {
        throw error ?? new Error("Failed to create signed upload URL.");
      }

      return apiSuccess({
        storagePath,
        signedUrl: data.signedUrl,
        token: data.token,
      });
    }

    // 6. Create or Update Video Episode (Lesson Metadata + Service-Role Media Vault)
    if (action === "upsert_lesson") {
      const id = typeof body.id === "string" && body.id.trim() ? body.id.trim() : undefined;
      const moduleId = typeof body.moduleId === "string" ? body.moduleId.trim() : "";
      const courseSlug = typeof body.courseSlug === "string" ? body.courseSlug.trim() : "";
      const lessonSlug =
        typeof body.lessonSlug === "string" ? body.lessonSlug.trim().toLowerCase() : "";
      const title = typeof body.title === "string" ? body.title.trim() : "";

      if (!moduleId || !SLUG_REGEX.test(courseSlug) || !SLUG_REGEX.test(lessonSlug) || title.length < 2) {
        return apiError(
          "BAD_REQUEST",
          "Module, valid lesson slug (e.g. episode-1), and lesson title are required.",
          422,
        );
      }

      const durationLabel =
        typeof body.durationLabel === "string" && body.durationLabel.trim()
          ? body.durationLabel.trim().slice(0, 40)
          : "15 min";
      const description =
        typeof body.description === "string" && body.description.trim()
          ? body.description.trim().slice(0, 2000)
          : null;
      const notesMarkdown =
        typeof body.notesMarkdown === "string" && body.notesMarkdown.trim()
          ? body.notesMarkdown.trim().slice(0, 12000)
          : null;
      const isFreePreview = body.isFreePreview === true;
      const isPublished = body.isPublished !== false;
      const sortOrder =
        typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)
          ? Math.floor(body.sortOrder)
          : 0;

      const rawProvider =
        typeof body.videoProvider === "string" ? body.videoProvider : "supabase_private";
      const videoProvider = PROVIDERS.has(rawProvider) ? rawProvider : "supabase_private";

      const storagePath =
        typeof body.storagePath === "string" && body.storagePath.trim()
          ? body.storagePath.trim().slice(0, 500)
          : null;
      const vdocipherVideoId =
        typeof body.vdocipherVideoId === "string" && body.vdocipherVideoId.trim()
          ? body.vdocipherVideoId.trim().slice(0, 120)
          : null;
      const bunnyLibraryId =
        typeof body.bunnyLibraryId === "string" && body.bunnyLibraryId.trim()
          ? body.bunnyLibraryId.trim().slice(0, 80)
          : null;
      const bunnyVideoId =
        typeof body.bunnyVideoId === "string" && body.bunnyVideoId.trim()
          ? body.bunnyVideoId.trim().slice(0, 120)
          : null;
      const externalSourceUrl =
        typeof body.externalSourceUrl === "string" && body.externalSourceUrl.trim()
          ? body.externalSourceUrl.trim().slice(0, 1000)
          : null;

      const hasVideo = Boolean(
        (videoProvider === "supabase_private" && storagePath) ||
          (videoProvider === "vdocipher" && vdocipherVideoId) ||
          (videoProvider === "bunny" && bunnyLibraryId && bunnyVideoId) ||
          (videoProvider === "external_signed" && externalSourceUrl),
      );

      const resources = Array.isArray(body.resources)
        ? body.resources
            .map((item) => {
              if (!item || typeof item !== "object") return null;
              const rec = item as Record<string, unknown>;
              const rTitle = typeof rec.title === "string" ? rec.title.trim().slice(0, 120) : "";
              const rUrl = typeof rec.url === "string" ? rec.url.trim().slice(0, 600) : "";
              return rTitle && rUrl ? { title: rTitle, url: rUrl } : null;
            })
            .filter((item): item is { title: string; url: string } => item !== null)
        : [];

      const lessonPayload = {
        module_id: moduleId,
        course_slug: courseSlug,
        lesson_slug: lessonSlug,
        title,
        duration_label: durationLabel,
        description,
        notes_markdown: notesMarkdown,
        resources,
        is_free_preview: isFreePreview,
        video_provider: videoProvider,
        has_video: hasVideo,
        sort_order: sortOrder,
        is_published: isPublished,
      };

      const { data: savedLesson, error: lessonErr } = id
        ? await admin
            .from("course_lessons")
            .update(lessonPayload)
            .eq("id", id)
            .select("id")
            .single()
        : await admin
            .from("course_lessons")
            .upsert(lessonPayload, { onConflict: "course_slug,lesson_slug" })
            .select("id")
            .single();

      if (lessonErr || !savedLesson) throw lessonErr;

      const { error: mediaErr } = await admin.from("course_lesson_media").upsert(
        {
          lesson_id: savedLesson.id,
          course_slug: courseSlug,
          lesson_slug: lessonSlug,
          video_provider: videoProvider,
          storage_path: storagePath,
          vdocipher_video_id: vdocipherVideoId,
          bunny_library_id: bunnyLibraryId,
          bunny_video_id: bunnyVideoId,
          external_source_url: externalSourceUrl,
        },
        { onConflict: "lesson_id" },
      );

      if (mediaErr) throw mediaErr;

      await admin.from("audit_logs").insert({
        actor_user_id: user.id,
        action: "course.lesson_upserted",
        entity_type: "course_lesson",
        entity_id: savedLesson.id,
        metadata: { courseSlug, lessonSlug, title, videoProvider, hasVideo },
      });

      revalidatePath("/courses");
      revalidatePath(`/courses/${courseSlug}`);
      revalidatePath(`/learn/${courseSlug}`);
      revalidatePath(`/learn/${courseSlug}/${lessonSlug}`);
      return apiSuccess({ lessonId: savedLesson.id, hasVideo });
    }

    // 7. Delete Lesson + Cleanup Private Storage File
    if (action === "delete_lesson") {
      const lessonRowId = typeof body.lessonId === "string" ? body.lessonId.trim() : "";
      if (!lessonRowId) return apiError("BAD_REQUEST", "Lesson ID required.", 422);

      const { data: media } = await admin
        .from("course_lesson_media")
        .select("storage_path,course_slug")
        .eq("lesson_id", lessonRowId)
        .maybeSingle();

      if (media?.storage_path) {
        await admin.storage
          .from(COURSE_VIDEO_BUCKET)
          .remove([media.storage_path])
          .catch(() => null);
      }

      const { error } = await admin
        .from("course_lessons")
        .delete()
        .eq("id", lessonRowId);
      if (error) throw error;

      if (media?.course_slug) {
        revalidatePath("/courses");
        revalidatePath(`/courses/${media.course_slug}`);
        revalidatePath(`/learn/${media.course_slug}`);
      }
      return apiSuccess({ deleted: true });
    }

    // 8. Manual Student Enrollment Grant (by Email)
    if (action === "grant_enrollment") {
      const email =
        typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      const courseSlug =
        typeof body.courseSlug === "string" ? body.courseSlug.trim() : "";
      if (!email || !courseSlug) {
        return apiError("BAD_REQUEST", "Student email and course are required.", 422);
      }

      const { data: targetProfile } = await admin
        .from("profiles")
        .select("id,email,full_name")
        .ilike("email", email)
        .maybeSingle();

      if (!targetProfile) {
        return apiError(
          "NOT_FOUND",
          "No registered account found with that email. Ask the student to sign up on the website first, then grant access.",
          404,
        );
      }

      const { data: existing } = await admin
        .from("course_enrollments")
        .select("id,status")
        .eq("user_id", targetProfile.id)
        .eq("course_slug", courseSlug)
        .is("cohort_id", null)
        .maybeSingle();

      const nowIso = new Date().toISOString();
      if (existing) {
        const { error } = await admin
          .from("course_enrollments")
          .update({ status: "active", enrolled_at: nowIso })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await admin.from("course_enrollments").insert({
          user_id: targetProfile.id,
          course_slug: courseSlug,
          status: "active",
          enrolled_at: nowIso,
        });
        if (error) throw error;
      }

      await admin.from("audit_logs").insert({
        actor_user_id: user.id,
        action: "course.enrollment_granted",
        entity_type: "course_enrollment",
        entity_id: `${targetProfile.id}:${courseSlug}`,
        metadata: { email, courseSlug },
      });

      return apiSuccess({ granted: true, studentName: targetProfile.full_name ?? email });
    }

    // 9. Suspend / Activate Enrollment (Instant Anti-Piracy Kill Switch)
    if (action === "set_enrollment_status") {
      const enrollmentId =
        typeof body.enrollmentId === "string" ? body.enrollmentId.trim() : "";
      const status = typeof body.status === "string" ? body.status : "";
      if (!enrollmentId || !["active", "cancelled", "completed"].includes(status)) {
        return apiError("BAD_REQUEST", "Valid enrollment ID and status required.", 422);
      }

      const { data: updated, error } = await admin
        .from("course_enrollments")
        .update({ status })
        .eq("id", enrollmentId)
        .select("user_id,course_slug")
        .single();
      if (error || !updated) throw error;

      if (status === "cancelled") {
        await admin
          .from("course_playback_sessions")
          .update({
            revoked_at: new Date().toISOString(),
            revoke_reason: "ENROLLMENT_SUSPENDED_BY_ADMIN",
          })
          .eq("user_id", updated.user_id)
          .eq("course_slug", updated.course_slug)
          .is("revoked_at", null);
      }

      await admin.from("audit_logs").insert({
        actor_user_id: user.id,
        action: `course.enrollment_${status}`,
        entity_type: "course_enrollment",
        entity_id: enrollmentId,
        metadata: { status, courseSlug: updated.course_slug },
      });

      return apiSuccess({ updated: true });
    }

    // 10. Reset Student Registered Devices (when student genuinely buys a new laptop/phone)
    if (action === "reset_student_devices") {
      const targetUserId =
        typeof body.userId === "string" ? body.userId.trim() : "";
      if (!targetUserId) return apiError("BAD_REQUEST", "User ID required.", 422);

      const { error } = await admin
        .from("course_registered_devices")
        .delete()
        .eq("user_id", targetUserId);
      if (error) throw error;

      await admin.from("audit_logs").insert({
        actor_user_id: user.id,
        action: "course.devices_reset",
        entity_type: "user",
        entity_id: targetUserId,
        metadata: {},
      });

      return apiSuccess({ reset: true });
    }

    return apiError("BAD_REQUEST", "Unknown admin course action.", 422);
  } catch (error) {
    console.error("[admin:courses]", { traceId, error });
    return apiError(
      "INTERNAL_ERROR",
      error instanceof Error ? error.message : "Course operation failed.",
      500,
      { traceId },
    );
  }
}
