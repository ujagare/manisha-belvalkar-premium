import { apiError, apiSuccess, readJsonObject, requestId } from "@/lib/api";
import { isSameOriginRequest } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendEmail, sessionAftercareEmail } from "@/lib/resend";
import { getSiteUrl } from "@/lib/site-url";
import { releaseAvailabilitySlot, revokeBookingVideoRoom } from "@/lib/bookings";

export const runtime = "nodejs";

const ALLOWED_STATUSES = [
  "requested",
  "payment_pending",
  "confirmed",
  "completed",
  "cancelled",
  "reschedule_requested",
] as const;

const ALLOWED_ROLES = ["owner", "admin", "booking_manager", "support"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const traceId = requestId(request);
  try {
    if (!isSameOriginRequest(request)) {
      return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
    }

    const { id } = await params;
    if (!id || id.length < 8) {
      return apiError("BAD_REQUEST", "Invalid booking reference.", 422);
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return apiError("UNAUTHORIZED", "Please sign in.", 401);

    const admin = createAdminClient();
    const { data: staff } = await admin
      .from("staff_roles")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!staff || !ALLOWED_ROLES.includes(staff.role)) {
      return apiError("FORBIDDEN", "Staff access required.", 403);
    }

    const { data: assurance } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (assurance?.currentLevel !== "aal2") {
      return apiError("FORBIDDEN", "Two-factor authentication is required.", 403);
    }

    const { data: existing } = await admin
      .from("bookings")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (!existing) return apiError("NOT_FOUND", "Booking not found.", 404);

    const body = await readJsonObject(request, 8192);
    const status = typeof body.status === "string" ? body.status.trim() : existing.status;
    if (!ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
      return apiError("BAD_REQUEST", "Invalid booking status.", 422);
    }

    const rawAftercare =
      typeof body.aftercareNotes === "string"
        ? body.aftercareNotes.trim().slice(0, 3000)
        : existing.aftercare_notes ?? "";
    const aftercareNotes = rawAftercare.length > 0 ? rawAftercare : null;
    const sendAftercareEmailFlag = Boolean(body.sendAftercareEmail) && Boolean(aftercareNotes);

    const nowIso = new Date().toISOString();
    const patch: Record<string, unknown> = {
      status,
      aftercare_notes: aftercareNotes,
      updated_at: nowIso,
    };
    if (sendAftercareEmailFlag || (aftercareNotes && !existing.aftercare_sent_at)) {
      patch.aftercare_sent_at = nowIso;
    }

    const { data: updated, error: updateError } = await admin
      .from("bookings")
      .update(patch)
      .eq("id", id)
      .select("id, status, aftercare_notes, aftercare_sent_at")
      .single();

    if (updateError) {
      if (updateError.message.includes("aftercare_notes")) {
        return apiError(
          "INTERNAL_ERROR",
          "Run migration 20261127233000_booking_aftercare_notes.sql in Supabase first to save aftercare notes.",
          500,
        );
      }
      throw updateError;
    }

    // Release slot & video room if admin cancels an active booking
    if (status === "cancelled" && existing.status !== "cancelled") {
      if (existing.slot_id) await releaseAvailabilitySlot(admin, existing.slot_id);
      if (existing.daily_room_name) await revokeBookingVideoRoom(existing.daily_room_name);
    }

    // Sync parent order fulfillment when session is completed
    if (existing.order_id && status === "completed") {
      await admin
        .from("orders")
        .update({
          status: "completed",
          fulfillment_status: "completed",
          updated_at: nowIso,
        })
        .eq("id", existing.order_id);
    }

    let emailSent = false;
    if (sendAftercareEmailFlag && aftercareNotes) {
      const [{ data: profile }, { data: order }] = await Promise.all([
        admin.from("profiles").select("email, full_name").eq("id", existing.user_id).maybeSingle(),
        existing.order_id
          ? admin.from("orders").select("guest_email, guest_name, item_title").eq("id", existing.order_id).maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      const recipientEmail = profile?.email ?? order?.guest_email ?? null;
      const recipientName = profile?.full_name ?? order?.guest_name ?? recipientEmail?.split("@")[0] ?? "Seeker";
      const offeringTitle =
        order?.item_title ??
        existing.offering_slug.replace(/-/g, " ").replace(/\b\w/g, (ch: string) => ch.toUpperCase());
      const sessionDateLabel = existing.requested_start
        ? `${new Date(existing.requested_start).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })} IST`
        : null;

      if (recipientEmail) {
        const mail = sessionAftercareEmail({
          name: recipientName,
          title: offeringTitle,
          sessionDateLabel,
          aftercareNotes,
          bookingsUrl: `${getSiteUrl()}/account/bookings`,
        });
        const sent = await sendEmail({ to: recipientEmail, subject: mail.subject, html: mail.html });
        emailSent = sent.ok;
      }
    }

    await admin.from("audit_logs").insert({
      actor_user_id: user.id,
      action: "booking.updated",
      entity_type: "booking",
      entity_id: id,
      metadata: {
        status,
        has_aftercare: Boolean(aftercareNotes),
        aftercare_emailed: emailSent,
      },
    });

    return apiSuccess({ booking: updated, emailSent });
  } catch (error) {
    console.error("[admin:bookings]", { traceId, error });
    return apiError("INTERNAL_ERROR", "Could not update session booking.", 500, { traceId });
  }
}
