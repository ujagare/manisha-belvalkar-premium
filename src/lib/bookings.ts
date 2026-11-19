import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertDatabaseSuccess, defaultAvailabilityStarts } from "@/lib/payment-safety";
import { createPrivateDailyRoom, deleteDailyRoom } from "@/lib/daily";
import { isDailyConfigured } from "@/lib/env";

type AdminClient = ReturnType<typeof createAdminClient>;

export interface AvailabilitySlotItem {
  id: string;
  starts_at: string;
  ends_at: string;
  format: string;
  capacity: number;
  reserved_count: number;
  status: string;
}

/**
 * Provision a private, waiting-room-protected Daily.co video room for a confirmed
 * online booking. Never falls back to unauthenticated public meet.jit.si rooms.
 */
export async function provisionDailyBookingRoom(
  admin: AdminClient,
  booking: { id: string; offering_slug: string; requested_start: string | null },
): Promise<{ roomName: string; roomUrl: string } | null> {
  if (!isDailyConfigured()) {
    console.warn("[bookings:daily] DAILY_API_KEY is not configured; room provisioning deferred.");
    return null;
  }

  const room = await createPrivateDailyRoom({
    bookingId: booking.id,
    offeringSlug: booking.offering_slug,
    startsAtIso: booking.requested_start,
    durationMinutes: 60,
  });

  const updateResult = await admin
    .from("bookings")
    .update({
      video_provider: "daily",
      daily_room_name: room.roomName,
      meeting_url: room.roomUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", booking.id);
  assertDatabaseSuccess(updateResult, "Daily.co booking room update");

  return room;
}

export async function revokeBookingVideoRoom(roomName: string | null | undefined) {
  if (!roomName) return;
  await deleteDailyRoom(roomName);
}

/**
 * Atomically claim one seat on an availability slot via compare-and-set.
 */
export async function reserveAvailabilitySlot(
  admin: AdminClient,
  slotId: string,
  expectedFormat?: string,
): Promise<{ success: boolean; startsAt?: string; format?: string; timezone?: string }> {
  const { data: slot, error } = await admin
    .from("availability_slots")
    .select("id,starts_at,format,capacity,reserved_count,status")
    .eq("id", slotId)
    .maybeSingle();

  if (error || !slot) return { success: false };
  if (slot.status !== "available" || slot.reserved_count >= slot.capacity) return { success: false };
  if (expectedFormat && slot.format !== expectedFormat) return { success: false };

  const nextReserved = slot.reserved_count + 1;
  const nextStatus = nextReserved >= slot.capacity ? "booked" : "available";

  const { data: claimed, error: updateError } = await admin
    .from("availability_slots")
    .update({ reserved_count: nextReserved, status: nextStatus })
    .eq("id", slot.id)
    .eq("reserved_count", slot.reserved_count)
    .select("id");

  if (updateError || !claimed || claimed.length !== 1) return { success: false };

  return { success: true, startsAt: slot.starts_at, format: slot.format, timezone: "Asia/Kolkata" };
}

/**
 * Releases a previously reserved availability slot upon cancellation, refund, or hold expiry.
 */
export async function releaseAvailabilitySlot(admin: AdminClient, slotId: string) {
  const { data: slot } = await admin
    .from("availability_slots")
    .select("id,capacity,reserved_count")
    .eq("id", slotId)
    .maybeSingle();

  if (slot && slot.reserved_count > 0) {
    const nextReserved = Math.max(0, slot.reserved_count - 1);
    await admin
      .from("availability_slots")
      .update({
        reserved_count: nextReserved,
        status: "available",
      })
      .eq("id", slot.id);
  }
}

/**
 * Releases expired 15-minute checkout holds lazily (called before slot listing/booking
 * and from scheduled cleanup) so abandoned Razorpay checkouts never ghost-lock slots.
 */
export async function releaseExpiredSlotHolds(admin: AdminClient): Promise<number> {
  const nowIso = new Date().toISOString();
  const { data: expired, error } = await admin
    .from("bookings")
    .select("id,slot_id,order_id")
    .eq("status", "payment_pending")
    .not("hold_expires_at", "is", null)
    .lte("hold_expires_at", nowIso)
    .limit(25);

  if (error || !expired?.length) return 0;

  let releasedCount = 0;
  for (const row of expired) {
    const { data: cancelled } = await admin
      .from("bookings")
      .update({ status: "cancelled", updated_at: nowIso })
      .eq("id", row.id)
      .eq("status", "payment_pending")
      .select("id");

    if (!cancelled?.length) continue;
    if (row.slot_id) await releaseAvailabilitySlot(admin, row.slot_id);
    if (row.order_id) {
      await admin
        .from("orders")
        .update({ status: "cancelled", payment_status: "failed", updated_at: nowIso })
        .eq("id", row.order_id)
        .eq("status", "pending")
        .eq("payment_status", "created");
    }
    releasedCount += 1;
  }

  return releasedCount;
}

export async function extendDefaultAvailability(admin: AdminClient, workingDays = 14) {
  const latest = await admin
    .from("availability_slots")
    .select("starts_at")
    .eq("format", "online")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  assertDatabaseSuccess(latest, "Availability lookup");
  if (latest.data?.starts_at && new Date(latest.data.starts_at).getTime() - Date.now() > 10 * 24 * 60 * 60 * 1000) return 0;
  const starts = defaultAvailabilityStarts(latest.data?.starts_at ?? new Date().toISOString(), workingDays);
  const inserted = await admin.from("availability_slots").insert(starts.map((startsAt) => ({
    starts_at: startsAt,
    ends_at: new Date(new Date(startsAt).getTime() + 60 * 60 * 1000).toISOString(),
    format: "online",
    capacity: 1,
    reserved_count: 0,
    status: "available",
  })));
  assertDatabaseSuccess(inserted, "Availability extension");
  return starts.length;
}
