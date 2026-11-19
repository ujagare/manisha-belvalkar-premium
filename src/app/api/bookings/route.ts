import { apiError, apiSuccess, readJsonObject } from "@/lib/api";
import { healingServices, mentoringAreas, services } from "@/lib/data";
import { consumeRateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSameOriginRequest } from "@/lib/security";
import { sendEmail } from "@/lib/resend/client";
import { bookingAdminEmail, requestConfirmationEmail } from "@/lib/resend/templates";
import { brand } from "@/lib/data";
import { releaseAvailabilitySlot, releaseExpiredSlotHolds, reserveAvailabilitySlot } from "@/lib/bookings";

export async function GET(request: Request) {
  try {
    const admin = createAdminClient();
    await releaseExpiredSlotHolds(admin).catch((err) => console.warn("[bookings:release-holds]", err));
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "online";

    const { data: slots, error } = await admin
      .from("availability_slots")
      .select("id,starts_at,ends_at,format,capacity,reserved_count,status")
      .eq("status", "available")
      .eq("format", format)
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(30);

    if (error) throw error;
    return apiSuccess({ slots: slots ?? [] });
  } catch (error) {
    console.error("[bookings:get-slots]", error);
    return apiError("INTERNAL_ERROR", "Could not fetch available slots.", 500);
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return apiError("UNAUTHORIZED", "Please sign in to request a booking.", 401);
  if (!(await consumeRateLimit(request, "bookings", 5, 3600, user.id))) return apiError("RATE_LIMITED", "Too many booking requests.", 429);
  try {
    const body = await readJsonObject(request);
    const type = typeof body.type === "string" ? body.type : "";
    const slug = typeof body.slug === "string" ? body.slug : "";
    const slotId = typeof body.slotId === "string" && body.slotId.length > 10 ? body.slotId.trim() : null;
    const format = ["online", "mumbai", "pune", "other"].includes(String(body.format)) ? String(body.format) : "online";
    const valid = type === "service" ? services.some((item) => item.slug === slug)
      : type === "healing" ? healingServices.some((item) => item.slug === slug)
        : type === "mentoring" ? mentoringAreas.some((item) => item.slug === slug) : false;
    if (!valid) return apiError("BAD_REQUEST", "Unknown offering.", 422);
    if (!slotId) return apiError("BAD_REQUEST", "Select an available time slot.", 422);

    let requestedStart = typeof body.requestedStart === "string" && !Number.isNaN(Date.parse(body.requestedStart)) ? new Date(body.requestedStart).toISOString() : null;
    const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 1500) : null;
    let timezone = typeof body.timezone === "string" ? body.timezone.slice(0, 80) : "Asia/Kolkata";
    const offering = services.find((item) => item.slug === slug)?.title
      ?? healingServices.find((item) => item.slug === slug)?.title
      ?? mentoringAreas.find((item) => item.slug === slug)?.title
      ?? slug;

    const admin = createAdminClient();

    // If a specific availability slot was selected, atomically reserve it to prevent double-booking
    const slotReservation = await reserveAvailabilitySlot(admin, slotId, format);
    if (!slotReservation.success) {
      return apiError("CONFLICT", "The selected time slot is no longer available. Please select another slot.", 409);
    }
    if (slotReservation.startsAt) {
      requestedStart = slotReservation.startsAt;
    }
    if (slotReservation.timezone) {
      timezone = slotReservation.timezone;
    }

    const { data, error } = await admin.from("bookings").insert({
      user_id: user.id,
      offering_type: type,
      offering_slug: slug,
      format,
      requested_start: requestedStart,
      notes,
      timezone,
      slot_id: slotId,
      meeting_url: null,
      status: "requested",
    }).select("id,status,meeting_url,requested_start").single();
    if (error) {
      await releaseAvailabilitySlot(admin, slotId);
      throw error;
    }

    // Notify the studio of the new booking request (best-effort)
    const bookingRef = data.id.slice(0, 8);
    const { subject, html } = bookingAdminEmail({
      offering,
      name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "a user",
      email: user.email ?? "no email",
      reference: bookingRef,
      format,
      requestedStart,
      notes,
      timezone,
    });
    await sendEmail({ to: brand.email, subject, html });
    if (user.email) {
      const customer = requestConfirmationEmail({
        name: user.user_metadata?.full_name ?? user.email.split("@")[0],
        reference: bookingRef,
        requestType: "session booking",
        summary: `${offering} - ${format}${requestedStart ? ` - ${new Date(requestedStart).toLocaleString("en-IN", { timeZone: timezone })}` : ""}`,
      });
      await sendEmail({ to: user.email, subject: customer.subject, html: customer.html });
    }
    return apiSuccess({ booking: { ...data, reference: bookingRef } }, 201);
  } catch (error) {
    console.error("[bookings:create]", error);
    return apiError("INTERNAL_ERROR", "Could not create booking request.", 500);
  }
}
