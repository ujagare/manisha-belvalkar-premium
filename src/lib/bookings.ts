import { randomBytes } from "node:crypto";
import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { assertDatabaseSuccess, defaultAvailabilityStarts } from "@/lib/payment-safety";

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
 * Generate an unguessable meeting room URL for an online booking.
 *
 * The room name carries 128 bits of randomness. An earlier version derived it
 * from the booking reference (4 bytes) plus the public offering slug, which let
 * anyone who knew an offering enumerate rooms and join a private consultation.
 */
export function generateMeetingUrl(bookingRef: string, offeringSlug: string): string {
  const sanitizedSlug = offeringSlug.replace(/[^a-z0-9-]/gi, "");
  const secret = randomBytes(16).toString("hex");
  const roomName = `mb-${sanitizedSlug}-${bookingRef}-${secret}`.toLowerCase();
  return `https://meet.jit.si/${roomName}`;
}

/**
 * Atomically claim one seat on an availability slot.
 *
 * Uses a compare-and-set: the UPDATE is filtered on the exact `reserved_count`
 * that was read, and `.select()` makes PostgREST return the affected rows. When
 * a concurrent booking has already claimed the last seat the filter matches no
 * rows, so `data` comes back empty and we treat the slot as taken. Without the
 * `.select()` this was a no-op guard — PostgREST reports no error when an
 * UPDATE matches zero rows — and two customers could book the same time.
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
    .eq("reserved_count", slot.reserved_count) // compare-and-set
    .select("id");

  if (updateError || !claimed || claimed.length !== 1) return { success: false };

  return { success: true, startsAt: slot.starts_at, format: slot.format, timezone: "Asia/Kolkata" };
}

/**
 * Releases a previously reserved availability slot upon cancellation/refund
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
