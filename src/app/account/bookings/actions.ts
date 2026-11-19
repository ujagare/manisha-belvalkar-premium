"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/session";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  provisionDailyBookingRoom,
  releaseAvailabilitySlot,
  reserveAvailabilitySlot,
  revokeBookingVideoRoom,
} from "@/lib/bookings";
import { isWithinModificationWindow } from "@/lib/payment-safety";

/**
 * Cancel one of the user's own bookings with 24-hour policy enforcement,
 * atomic slot release, and Daily.co room revocation.
 */
export async function cancelBookingAction(form: FormData) {
  const id = form.get("id")?.toString() ?? "";
  const user = await getCurrentUser();
  if (!user || !id) redirect("/account/bookings");

  const admin = createAdminClient();
  const { data: booking } = await admin
    .from("bookings")
    .select("id,user_id,status,requested_start,slot_id,daily_room_name")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!booking || !["requested", "payment_pending", "confirmed"].includes(booking.status)) {
    redirect("/account/bookings");
  }

  if (booking.status === "confirmed" && !isWithinModificationWindow(booking.requested_start)) {
    redirect("/account/bookings?notice=cancel_locked_24h");
  }

  await admin
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", booking.id)
    .eq("user_id", user.id);

  if (booking.slot_id) await releaseAvailabilitySlot(admin, booking.slot_id);
  if (booking.daily_room_name) await revokeBookingVideoRoom(booking.daily_room_name);

  revalidatePath("/account/bookings");
  redirect("/account/bookings?notice=cancelled");
}

/**
 * Atomically reschedule a booking to a real open availability slot.
 * Enforces >= 24 hours notice and max 1 free self-service reschedule for confirmed paid sessions.
 */
export async function rescheduleBookingAction(form: FormData) {
  const id = form.get("id")?.toString() ?? "";
  const newSlotId = form.get("slot_id")?.toString()?.trim() ?? "";
  const user = await getCurrentUser();
  if (!user || !id || !newSlotId) redirect("/account/bookings");

  const admin = createAdminClient();
  const { data: booking } = await admin
    .from("bookings")
    .select("id,user_id,status,format,offering_slug,requested_start,slot_id,daily_room_name,reschedule_count")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!booking || !["requested", "confirmed"].includes(booking.status)) {
    redirect("/account/bookings");
  }

  if (booking.status === "confirmed") {
    if (!isWithinModificationWindow(booking.requested_start)) {
      redirect("/account/bookings?notice=reschedule_locked_24h");
    }
    if ((booking.reschedule_count ?? 0) >= 1) {
      redirect("/account/bookings?notice=reschedule_limit_reached");
    }
  }

  const claimed = await reserveAvailabilitySlot(admin, newSlotId, booking.format);
  if (!claimed.success || !claimed.startsAt) {
    redirect("/account/bookings?notice=slot_unavailable");
  }

  const nowIso = new Date().toISOString();
  const { error } = await admin
    .from("bookings")
    .update({
      slot_id: newSlotId,
      requested_start: claimed.startsAt,
      reschedule_count: (booking.reschedule_count ?? 0) + 1,
      reminder_24h_sent_at: null,
      reminder_1h_sent_at: null,
      updated_at: nowIso,
    })
    .eq("id", booking.id)
    .eq("user_id", user.id);

  if (error) {
    await releaseAvailabilitySlot(admin, newSlotId);
    redirect("/account/bookings?notice=reschedule_failed");
  }

  if (booking.slot_id && booking.slot_id !== newSlotId) {
    await releaseAvailabilitySlot(admin, booking.slot_id);
  }

  // Rotate Daily.co room to match new session time window.
  if (booking.status === "confirmed" && booking.format === "online") {
    if (booking.daily_room_name) await revokeBookingVideoRoom(booking.daily_room_name);
    await provisionDailyBookingRoom(admin, {
      id: booking.id,
      offering_slug: booking.offering_slug,
      requested_start: claimed.startsAt,
    }).catch((err) => console.warn("[bookings:reschedule:daily]", err));
  }

  revalidatePath("/account/bookings");
  redirect("/account/bookings?notice=rescheduled");
}
