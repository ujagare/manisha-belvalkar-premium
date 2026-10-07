import { apiError, apiSuccess, readJsonObject } from "@/lib/api";
import { healingServices, mentoringAreas, services } from "@/lib/data";
import { consumeRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSameOriginRequest } from "@/lib/security";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return apiError("UNAUTHORIZED", "Please sign in to request a booking.", 401);
  if (!(await consumeRateLimit(request, "bookings", 5, 3600, user.id))) return apiError("RATE_LIMITED", "Too many booking requests.", 429);
  try {
    const body = await readJsonObject(request);
    const type = body.type;
    const slug = typeof body.slug === "string" ? body.slug : "";
    const format = ["online", "mumbai", "pune", "other"].includes(String(body.format)) ? body.format : "online";
    const valid = type === "service" ? services.some((item) => item.slug === slug)
      : type === "healing" ? healingServices.some((item) => item.slug === slug)
        : type === "mentoring" ? mentoringAreas.some((item) => item.slug === slug) : false;
    if (!valid) return apiError("BAD_REQUEST", "Unknown offering.", 422);
    const requestedStart = typeof body.requestedStart === "string" && !Number.isNaN(Date.parse(body.requestedStart)) ? new Date(body.requestedStart).toISOString() : null;
    const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 1500) : null;
    const timezone = typeof body.timezone === "string" ? body.timezone.slice(0, 80) : "Asia/Kolkata";
    const admin = createAdminClient();
    const { data, error } = await admin.from("bookings").insert({
      user_id: user.id, offering_type: type, offering_slug: slug, format,
      requested_start: requestedStart, notes, timezone, status: "requested",
    }).select("id,status").single();
    if (error) throw error;
    return apiSuccess({ booking: data }, 201);
  } catch (error) {
    console.error("[bookings:create]", error);
    return apiError("INTERNAL_ERROR", "Could not create booking request.", 500);
  }
}
