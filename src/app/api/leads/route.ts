import { apiError, apiSuccess, readJsonObject, requestId } from "@/lib/api";
import { consumeRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSameOriginRequest } from "@/lib/security";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\d\s-]{7,20}$/;
const textValue = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  const traceId = requestId(request);
  try {
    if (!isSameOriginRequest(request)) return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
    if (!(await consumeRateLimit(request, "public-leads", 5, 900))) {
      return apiError("RATE_LIMITED", "Too many submissions. Please try again later.", 429);
    }
    const body = await readJsonObject(request, 12_288);
    if (!body.consent) return apiError("BAD_REQUEST", "Consent is required.", 422);
    const kind = body.kind;
    const name = textValue(body.name, 120);
    const email = textValue(body.email, 254).toLowerCase();
    const phone = textValue(body.phone, 20);
    if (email && !emailPattern.test(email)) return apiError("BAD_REQUEST", "Enter a valid email address.", 422);
    if (phone && !phonePattern.test(phone)) return apiError("BAD_REQUEST", "Enter a valid phone number.", 422);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const admin = createAdminClient();
    if (kind === "enquiry") {
      const message = textValue(body.message, 3000);
      if (!name || !message || (!email && !phone)) return apiError("BAD_REQUEST", "Name, message and contact details are required.", 422);
      const { data, error } = await admin.from("enquiries").insert({
        user_id: user?.id ?? null, category: textValue(body.category, 50) || "general",
        name, email: email || null, phone: phone || null, message,
        source_path: textValue(body.sourcePath, 200) || null, consented_at: new Date().toISOString(),
      }).select("id").single();
      if (error) throw error;
      return apiSuccess({ reference: data.id.slice(0, 8) }, 201);
    }
    if (kind === "waitlist") {
      if (!email && !phone) return apiError("BAD_REQUEST", "Email or phone is required.", 422);
      const { data, error } = await admin.from("waitlist_signups").insert({
        email: email || null, phone: phone || null,
        source: textValue(body.source, 80) || "shakti-app", consented_at: new Date().toISOString(),
      }).select("id").single();
      if (error?.code === "23505") return apiSuccess({ alreadyRegistered: true });
      if (error) throw error;
      return apiSuccess({ reference: data.id.slice(0, 8) }, 201);
    }
    if (kind === "community") {
      if (!name || (!email && !phone)) return apiError("BAD_REQUEST", "Name and contact details are required.", 422);
      const { data, error } = await admin.from("community_applications").insert({
        user_id: user?.id ?? null, name, email: email || null, phone: phone || null,
        intention: textValue(body.intention, 1500) || null, consented_at: new Date().toISOString(),
      }).select("id").single();
      if (error) throw error;
      return apiSuccess({ reference: data.id.slice(0, 8) }, 201);
    }
    return apiError("BAD_REQUEST", "Unknown submission type.", 422);
  } catch (error) {
    console.error("[leads]", { traceId, error });
    return apiError("INTERNAL_ERROR", "Could not save your request. Please try again.", 500, { traceId });
  }
}
