import { randomUUID } from "node:crypto";
import { apiError, apiSuccess, requestId } from "@/lib/api";
import { isSameOriginRequest } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { DELIVERY_BUCKET, validImageSignature } from "@/lib/distance-healing";

export const runtime = "nodejs";
const STATUSES = ["submitted", "in_progress", "ready", "delivered", "completed", "cancelled"];
const IMAGE_TYPES = new Map([["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"]]);
const AUDIO_TYPES = new Map([["audio/mpeg", "mp3"], ["audio/mp4", "m4a"], ["audio/x-m4a", "m4a"], ["audio/wav", "wav"]]);

export async function POST(request: Request, { params }: { params: Promise<{ caseId: string }> }) {
  const traceId = requestId(request);
  try {
    if (!isSameOriginRequest(request)) return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
    const { caseId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError("UNAUTHORIZED", "Please sign in.", 401);
    const admin = createAdminClient();
    const { data: staff } = await admin.from("staff_roles").select("role").eq("user_id", user.id).maybeSingle();
    if (!staff || !["owner", "admin", "booking_manager"].includes(staff.role)) return apiError("FORBIDDEN", "Staff access required.", 403);
    const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assurance?.currentLevel !== "aal2") return apiError("FORBIDDEN", "Two-factor authentication is required.", 403);

    const { data: healingCase } = await admin.from("distance_healing_cases").select("*").eq("id", caseId).maybeSingle();
    if (!healingCase) return apiError("NOT_FOUND", "Healing case not found.", 404);
    const form = await request.formData();
    const status = String(form.get("status") ?? healingCase.status);
    if (!STATUSES.includes(status)) return apiError("BAD_REQUEST", "Invalid workflow status.", 422);
    const notes = String(form.get("staffNotes") ?? "").trim().slice(0, 4000) || null;
    const resultPhoto = form.get("resultPhoto");
    const music = form.get("music");
    let resultPath = healingCase.result_photo_path;
    let musicPath = healingCase.music_path;

    if (resultPhoto instanceof File && resultPhoto.size > 0) {
      const extension = IMAGE_TYPES.get(resultPhoto.type);
      if (!extension || resultPhoto.size > 10 * 1024 * 1024) return apiError("BAD_REQUEST", "Result photo must be JPG, PNG, or WebP up to 10 MB.", 422);
      const bytes = new Uint8Array(await resultPhoto.arrayBuffer());
      if (!validImageSignature(bytes.subarray(0, 16), resultPhoto.type)) return apiError("BAD_REQUEST", "Invalid result image.", 422);
      resultPath = `${healingCase.user_id}/${healingCase.order_id}/result-${randomUUID()}.${extension}`;
      const { error } = await admin.storage.from(DELIVERY_BUCKET).upload(resultPath, bytes, { contentType: resultPhoto.type, upsert: false });
      if (error) throw error;
      if (healingCase.result_photo_path) await admin.storage.from(DELIVERY_BUCKET).remove([healingCase.result_photo_path]);
    }
    if (music instanceof File && music.size > 0) {
      const extension = AUDIO_TYPES.get(music.type);
      if (!extension || music.size > 25 * 1024 * 1024) return apiError("BAD_REQUEST", "Music must be MP3, M4A, or WAV up to 25 MB.", 422);
      const bytes = new Uint8Array(await music.arrayBuffer());
      musicPath = `${healingCase.user_id}/${healingCase.order_id}/healing-${randomUUID()}.${extension}`;
      const { error } = await admin.storage.from(DELIVERY_BUCKET).upload(musicPath, bytes, { contentType: music.type, upsert: false });
      if (error) throw error;
      if (healingCase.music_path) await admin.storage.from(DELIVERY_BUCKET).remove([healingCase.music_path]);
    }
    if (["ready", "delivered", "completed"].includes(status) && (!resultPath || !musicPath)) return apiError("BAD_REQUEST", "Upload both the completed photograph and healing music before marking ready.", 422);
    const now = new Date().toISOString();
    const timestamps = {
      ...(status === "in_progress" && !healingCase.processing_started_at ? { processing_started_at: now } : {}),
      ...(status === "ready" ? { ready_at: now } : {}),
      ...(status === "delivered" ? { delivered_at: now } : {}),
      ...(status === "completed" ? { completed_at: now } : {}),
    };
    const { data, error } = await admin.from("distance_healing_cases").update({ status, staff_notes: notes, result_photo_path: resultPath, music_path: musicPath, ...timestamps }).eq("id", caseId).select("id,status").single();
    if (error) throw error;
    await admin.from("orders").update({ fulfillment_status: status === "completed" ? "completed" : status === "delivered" ? "delivered" : "processing", status: status === "completed" ? "completed" : "confirmed" }).eq("id", healingCase.order_id);
    await admin.from("audit_logs").insert({ actor_user_id: user.id, action: "distance_healing.updated", entity_type: "distance_healing_case", entity_id: caseId, metadata: { status } });
    return apiSuccess({ case: data });
  } catch (error) {
    console.error("[admin:distance-healing]", { traceId, error });
    return apiError("INTERNAL_ERROR", "The healing case could not be updated.", 500, { traceId });
  }
}
