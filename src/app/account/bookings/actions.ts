"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateMyBooking } from "@/lib/supabase/session";

/**
 * Cancel one of the user's own bookings. Ownership is enforced inside
 * updateMyBooking (scoped to the signed-in user's id) and by RLS.
 */
export async function cancelBookingAction(form: FormData) {
  const id = form.get("id")?.toString() ?? "";
  if (id) await updateMyBooking(id, { status: "cancelled" });
  revalidatePath("/account/bookings");
  redirect("/account/bookings");
}

/** Move a booking to a new preferred time and mark it for re-confirmation. */
export async function rescheduleBookingAction(form: FormData) {
  const id = form.get("id")?.toString() ?? "";
  const raw = form.get("requested_start")?.toString() ?? "";
  const requestedStart = raw && !Number.isNaN(Date.parse(raw)) ? new Date(raw).toISOString() : null;
  if (id && requestedStart) {
    await updateMyBooking(id, { status: "reschedule_requested", requested_start: requestedStart });
  }
  revalidatePath("/account/bookings");
  redirect("/account/bookings");
}
