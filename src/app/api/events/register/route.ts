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

    // 1. Prevent duplicate active registrations
    const { data: existingReg } = await admin
      .from("event_registrations")
      .select("id,status")
      .eq("user_id", user.id)
      .eq("event_slug", slug)
      .in("status", ["pending", "confirmed"])
      .maybeSingle();

    if (existingReg) {
      return apiError("CONFLICT", "You are already registered for this event.", 409);
    }

    // 2. Check event instance capacity and fetch joining URL
    const { data: evt } = await admin.from("events").select("id").eq("slug", slug).maybeSingle();
    let joiningUrl: string | null = null;
    let eventInstanceId: string | null = null;

    if (evt) {
      const { data: instance } = await admin
        .from("event_instances")
        .select("id,capacity,registered_count,joining_url,status")
        .eq("event_id", evt.id)
        .in("status", ["scheduled"])
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (instance) {
        if (instance.capacity && instance.registered_count >= instance.capacity) {
          return apiError("CONFLICT", "This event has reached its maximum registration capacity.", 409);
        }
        eventInstanceId = instance.id;
        joiningUrl = instance.joining_url;

        const newCount = instance.registered_count + 1;
        const isFull = instance.capacity ? newCount >= instance.capacity : false;
        await admin
          .from("event_instances")
          .update({
            registered_count: newCount,
            status: isFull ? "full" : "scheduled",
          })
          .eq("id", instance.id);
      }
    }

    const { data, error } = await admin
      .from("event_registrations")
      .insert({
        user_id: user.id,
        event_slug: slug,
        event_instance_id: eventInstanceId,
        joining_url: joiningUrl,
        status: "confirmed",
      })
      .select("id,status,joining_url")
      .single();
    if (error) throw error;
    return apiSuccess({ registration: data }, 201);
  } catch (error) {
    console.error("[events:register]", error);
    return apiError("INTERNAL_ERROR", "Could not create event registration.", 500);
  }
}
