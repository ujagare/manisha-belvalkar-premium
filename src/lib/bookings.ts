import { randomBytes } from "node:crypto";
import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

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
  slotId: string
): Promise<{ success: boolean; startsAt?: string; timezone?: string }> {
  const { data: slot, error } = await admin
    .from("availability_slots")
    .select("id,starts_at,capacity,reserved_count,status")
    .eq("id", slotId)
    .maybeSingle();

  if (error || !slot) return { success: false };
  if (slot.status !== "available" || slot.reserved_count >= slot.capacity) return { success: false };

  const nextReserved = slot.reserved_count + 1;
  const nextStatus = nextReserved >= slot.capacity ? "booked" : "available";

  const { data: claimed, error: updateError } = await admin
    .from("availability_slots")
    .update({ reserved_count: nextReserved, status: nextStatus })
    .eq("id", slot.id)
    .eq("reserved_count", slot.reserved_count) // compare-and-set
    .select("id");

  if (updateError || !claimed || claimed.length !== 1) return { success: false };

  return { success: true, startsAt: slot.starts_at, timezone: "Asia/Kolkata" };
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
