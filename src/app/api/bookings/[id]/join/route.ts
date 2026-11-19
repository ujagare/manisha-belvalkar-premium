import { apiError, apiSuccess } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { consumeRateLimit } from "@/lib/rate-limit";
import { createDailyMeetingToken } from "@/lib/daily";
import { provisionDailyBookingRoom } from "@/lib/bookings";
import { isDailyConfigured } from "@/lib/env";

export const runtime = "nodejs";

const OPEN_BEFORE_MS = 15 * 60 * 1000; // 15 minutes before scheduled start
const CLOSE_AFTER_MS = 150 * 60 * 1000; // 60-min session + 90-min grace window

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    if (!id || id.length < 8) return apiError("BAD_REQUEST", "Invalid booking reference.", 422);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError("UNAUTHORIZED", "Please sign in to enter your private session room.", 401);

    if (!(await consumeRateLimit(request, "booking-join", 20, 600, user.id))) {
      return apiError("RATE_LIMITED", "Too many room join attempts. Please wait a moment.", 429);
    }

    const admin = createAdminClient();
    const [{ data: booking }, { data: staffRow }] = await Promise.all([
      admin
        .from("bookings")
        .select("id,user_id,offering_type,offering_slug,format,requested_start,timezone,status,meeting_url,daily_room_name,client_joined_at,host_joined_at")
        .eq("id", id)
        .maybeSingle(),
      admin.from("staff_roles").select("role").eq("user_id", user.id).maybeSingle(),
    ]);

    const isStaff = Boolean(staffRow?.role);
    if (!booking || (!isStaff && booking.user_id !== user.id)) {
      return apiError("NOT_FOUND", "Session booking not found.", 404);
    }

    if (booking.status !== "confirmed") {
      return apiError("CONFLICT", "This session is not confirmed yet. Complete payment to unlock your private room.", 409);
    }

    if (booking.format !== "online") {
      return apiError("BAD_REQUEST", "This booking is an in-person session and does not have an online video room.", 400);
    }

    if (!isDailyConfigured()) {
      return apiError("INTERNAL_ERROR", "Private Daily.co video room setup is pending. Please contact our support team.", 503);
    }

    // Enforce time-bounded entry window for clients (staff can open anytime to prepare).
    const startMs = booking.requested_start ? Date.parse(booking.requested_start) : Number.NaN;
    const nowMs = Date.now();
    if (!isStaff && Number.isFinite(startMs)) {
      if (nowMs < startMs - OPEN_BEFORE_MS) {
        return apiError(
          "CONFLICT",
          "Your private video room opens 15 minutes before your scheduled session time.",
          409,
          { opensAt: new Date(startMs - OPEN_BEFORE_MS).toISOString() },
        );
      }
      if (nowMs > startMs + CLOSE_AFTER_MS) {
        return apiError("CONFLICT", "This session window has closed.", 409);
      }
    }

    // Lazily provision a Daily.co room if payment webhook was processed before DAILY_API_KEY was added.
    let roomName = booking.daily_room_name;
    let roomUrl = booking.meeting_url;
    if (!roomName || !roomUrl || !roomUrl.includes(".daily.co")) {
      const created = await provisionDailyBookingRoom(admin, {
        id: booking.id,
        offering_slug: booking.offering_slug,
        requested_start: booking.requested_start,
      });
      if (!created) {
        return apiError("INTERNAL_ERROR", "Could not initialize private Daily.co video room.", 503);
      }
      roomName = created.roomName;
      roomUrl = created.roomUrl;
    }

    const displayName = isStaff
      ? "Dr. Manisha Belvalkar"
      : (user.user_metadata?.full_name as string | undefined)
        ?? (user.user_metadata?.name as string | undefined)
        ?? user.email?.split("@")[0]
        ?? "Client";

    const token = await createDailyMeetingToken({
      roomName,
      userName: displayName,
      userId: user.id,
      isOwner: isStaff,
      expiresInSeconds: 2 * 60 * 60,
    });

    // Record attendance timestamp (essential evidence for service delivery & dispute defense).
    const nowIso = new Date().toISOString();
    if (isStaff && !booking.host_joined_at) {
      await admin.from("bookings").update({ host_joined_at: nowIso, updated_at: nowIso }).eq("id", booking.id);
    } else if (!isStaff && !booking.client_joined_at) {
      await admin.from("bookings").update({ client_joined_at: nowIso, updated_at: nowIso }).eq("id", booking.id);
    }

    return apiSuccess({
      bookingId: booking.id,
      roomUrl,
      token,
      isOwner: isStaff,
      startsAt: booking.requested_start,
      offeringSlug: booking.offering_slug,
    });
  } catch (error) {
    console.error("[bookings:join]", error);
    return apiError("INTERNAL_ERROR", "Could not connect to your private video room. Please retry.", 500);
  }
}
