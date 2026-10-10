import { apiError, apiSuccess, readJsonObject, requestId } from "@/lib/api";
import { consumeRateLimit } from "@/lib/rate-limit";
import { isSameOriginRequest } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const traceId = requestId(request);
  try {
    if (!isSameOriginRequest(request)) return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError("UNAUTHORIZED", "Please sign in to continue.", 401);
    if (!(await consumeRateLimit(request, "distance-healing-feedback", 5, 3600, user.id))) return apiError("RATE_LIMITED", "Please try again later.", 429);
    const body = await readJsonObject(request);
    const caseId = typeof body.caseId === "string" ? body.caseId : "";
    const rating = typeof body.rating === "number" ? body.rating : 0;
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 2000) : "";
    const publicationConsent = ["private", "anonymous", "first_name"].includes(String(body.publicationConsent)) ? String(body.publicationConsent) : "private";
    if (!/^[0-9a-f-]{36}$/i.test(caseId) || !Number.isInteger(rating) || rating < 1 || rating > 5 || message.length < 10) return apiError("BAD_REQUEST", "Please provide a rating and feedback.", 422);
    const admin = createAdminClient();
    const { data: healingCase } = await admin.from("distance_healing_cases").select("id,status").eq("id", caseId).eq("user_id", user.id).maybeSingle();
    if (!healingCase || !["delivered", "completed"].includes(healingCase.status)) return apiError("FORBIDDEN", "Feedback opens after delivery.", 403);
    const { data, error } = await admin.from("distance_healing_feedback").upsert({ case_id: caseId, user_id: user.id, rating, message, publication_consent: publicationConsent }, { onConflict: "case_id" }).select("id").single();
    if (error) throw error;
    await admin.from("distance_healing_cases").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", caseId);
    return apiSuccess({ feedbackId: data.id }, 201);
  } catch (error) {
    console.error("[distance-healing:feedback]", { traceId, error });
    return apiError("INTERNAL_ERROR", "Feedback could not be saved.", 500, { traceId });
  }
}
