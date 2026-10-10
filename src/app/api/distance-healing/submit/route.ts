import { randomUUID } from "node:crypto";
import { apiError, apiSuccess, requestId } from "@/lib/api";
import { consumeRateLimit } from "@/lib/rate-limit";
import { isSameOriginRequest } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { DISTANCE_HEALING_SLUG, SOURCE_BUCKET, ensureDistanceHealingCase, validImageSignature } from "@/lib/distance-healing";

export const runtime = "nodejs";
const IMAGE_TYPES = new Map([["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"]]);

export async function POST(request: Request) {
  const traceId = requestId(request);
  try {
    if (!isSameOriginRequest(request)) return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError("UNAUTHORIZED", "Please sign in to continue.", 401);
    if (!(await consumeRateLimit(request, "distance-healing-submit", 6, 600, user.id))) {
      return apiError("RATE_LIMITED", "Too many submission attempts. Please try again shortly.", 429);
    }

    const form = await request.formData();
    const orderId = typeof form.get("orderId") === "string" ? String(form.get("orderId")) : "";
    const method = form.get("method") === "whatsapp" ? "whatsapp" : "website";
    const intention = typeof form.get("intention") === "string" ? String(form.get("intention")).trim().slice(0, 2000) : "";
    const consent = form.get("consent") === "true";
    if (!/^[0-9a-f-]{36}$/i.test(orderId) || intention.length < 10 || !consent) {
      return apiError("BAD_REQUEST", "Booking, healing intention, and privacy consent are required.", 422);
    }

    const admin = createAdminClient();
    const { data: order } = await admin.from("orders")
      .select("id,user_id,item_type,item_slug,payment_status")
      .eq("id", orderId).eq("user_id", user.id).maybeSingle();
    if (!order || order.item_type !== "healing" || order.item_slug !== DISTANCE_HEALING_SLUG) {
      return apiError("NOT_FOUND", "Distance Healing booking was not found.", 404);
    }
    if (order.payment_status !== "paid") {
      return apiError("FORBIDDEN", "A verified payment is required before submission.", 403);
    }

    const healingCase = await ensureDistanceHealingCase(order.id, user.id);
    let photoPath = healingCase.source_photo_path as string | null;
    if (method === "website") {
      const photo = form.get("photo");
      if (!(photo instanceof File)) return apiError("BAD_REQUEST", "Please upload a recent photograph.", 422);
      const extension = IMAGE_TYPES.get(photo.type);
      if (!extension || photo.size < 1 || photo.size > 10 * 1024 * 1024) {
        return apiError("BAD_REQUEST", "Use a JPG, PNG, or WebP image up to 10 MB.", 422);
      }
      const bytes = new Uint8Array(await photo.arrayBuffer());
      if (!validImageSignature(bytes.subarray(0, 16), photo.type)) {
        return apiError("BAD_REQUEST", "The uploaded file is not a valid supported image.", 422);
      }
      photoPath = `${user.id}/${order.id}/source-${randomUUID()}.${extension}`;
      const { error: uploadError } = await admin.storage.from(SOURCE_BUCKET).upload(photoPath, bytes, {
        contentType: photo.type, cacheControl: "private, max-age=0", upsert: false,
      });
      if (uploadError) throw uploadError;
      if (healingCase.source_photo_path) await admin.storage.from(SOURCE_BUCKET).remove([healingCase.source_photo_path]);
    }

    const now = new Date().toISOString();
    const { data: updated, error } = await admin.from("distance_healing_cases").update({
      submission_method: method,
      intention,
      source_photo_path: method === "website" ? photoPath : null,
      status: "submitted",
      submitted_at: now,
      retention_delete_after: new Date(Date.now() + 30 * 86400_000).toISOString(),
    }).eq("id", healingCase.id).eq("user_id", user.id).select("id,status,submission_method").single();
    if (error) throw error;
    await admin.from("consent_records").insert({
      user_id: user.id, consent_type: "distance_healing_media_processing", policy_version: "2026-10-10",
      source: "distance-healing-submission", granted_at: now, metadata: { order_id: order.id, submission_method: method },
    });
    return apiSuccess({ case: updated });
  } catch (error) {
    console.error("[distance-healing:submit]", { traceId, error });
    return apiError("INTERNAL_ERROR", "Your submission could not be saved. Please try again.", 500, { traceId });
  }
}
