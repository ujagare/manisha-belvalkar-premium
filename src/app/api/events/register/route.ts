import { apiError, apiSuccess, readJsonObject } from "@/lib/api";
import { eventOfferings } from "@/lib/phase-two-data";
import { consumeRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSameOriginRequest } from "@/lib/security";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return apiError("UNAUTHORIZED", "Please sign in to register.", 401);
  if (!(await consumeRateLimit(request, "event-registration", 5, 3600, user.id))) return apiError("RATE_LIMITED", "Too many registration requests.", 429);
  try {
    const body = await readJsonObject(request);
    const slug = typeof body.slug === "string" ? body.slug : "";
    if (!eventOfferings.some((event) => event.slug === slug)) return apiError("BAD_REQUEST", "Unknown event.", 422);
    const admin = createAdminClient();
    const { data, error } = await admin.from("event_registrations").insert({ user_id: user.id, event_slug: slug, status: "pending" }).select("id,status").single();
    if (error) throw error;
    return apiSuccess({ registration: data }, 201);
  } catch (error) {
    console.error("[events:register]", error);
    return apiError("INTERNAL_ERROR", "Could not create event registration.", 500);
  }
}
