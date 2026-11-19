import { apiError, apiSuccess } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase/admin";
import { releasePendingSessionBooking, releaseReservedInventory } from "@/lib/fulfillment";
import { SOURCE_BUCKET } from "@/lib/distance-healing";
import { extendDefaultAvailability, releaseExpiredSlotHolds } from "@/lib/bookings";
import { sendEmail, sessionReminderEmail } from "@/lib/resend";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

/**
 * Scheduled Cron Handler:
 * 1. Enforces Distance Healing 30-day media retention policy (deletes expired photos from storage).
 * 2. Releases expired inventory reservations for abandoned/expired checkouts (>60 mins).
 */
export async function GET(request: Request) {
  // Authorize: Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when the
  // CRON_SECRET env var is set. Fail CLOSED when it is not configured — an open
  // endpoint here would let anyone trigger storage deletions and order
  // cancellations on demand.
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("[cron:cleanup] CRON_SECRET is not configured; refusing to run.");
    return apiError("INTERNAL_ERROR", "Cron is not configured.", 503);
  }
  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return apiError("UNAUTHORIZED", "Invalid or missing cron secret.", 401);
  }

  const admin = createAdminClient();
  const results = {
    mediaCleaned: 0,
    abandonedOrdersReleased: 0,
    expiredHoldsReleased: 0,
    remindersSent: 0,
    slotsAdded: 0,
    timestamp: new Date().toISOString(),
  };

  try {
    results.slotsAdded = await extendDefaultAvailability(admin);
    results.expiredHoldsReleased = await releaseExpiredSlotHolds(admin);
    // 1. Media Retention Cleanup for Distance Healing Cases
    const now = new Date().toISOString();
    const { data: expiredCases, error: caseError } = await admin
      .from("distance_healing_cases")
      .select("id,source_photo_path,retention_delete_after")
      .not("source_photo_path", "is", null)
      .lte("retention_delete_after", now)
      .limit(50);

    if (caseError) {
      console.error("[cron:cleanup:cases]", caseError);
    } else if (expiredCases && expiredCases.length > 0) {
      for (const item of expiredCases) {
        if (item.source_photo_path) {
          try {
            // Delete file from Supabase storage
            await admin.storage
              .from(SOURCE_BUCKET)
              .remove([item.source_photo_path]);

            // Clear photo path on case record
            await admin
              .from("distance_healing_cases")
              .update({
                source_photo_path: null,
                staff_notes: `[Automated Retention]: Media deleted on ${now}`,
                updated_at: now,
              })
              .eq("id", item.id);

            results.mediaCleaned++;
          } catch (delErr) {
            console.error(`[cron:cleanup:media] Failed for case ${item.id}`, delErr);
          }
        }
      }
    }

    // 2. Release Abandoned Inventory Reservations (> 60 minutes old, unpaid)
    const sixtyMinutesAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data: abandonedOrders, error: orderError } = await admin
      .from("orders")
      .select("id")
      .eq("status", "pending")
      .eq("payment_status", "created")
      .lte("created_at", sixtyMinutesAgo)
      .limit(30);

    if (orderError) {
      console.error("[cron:cleanup:orders]", orderError);
    } else if (abandonedOrders && abandonedOrders.length > 0) {
      for (const order of abandonedOrders) {
        await releaseReservedInventory(admin, order.id);
        await releasePendingSessionBooking(admin, order.id);
        await admin
          .from("orders")
          .update({
            status: "cancelled",
            payment_status: "failed",
            updated_at: now,
          })
          .eq("id", order.id);

        results.abandonedOrdersReleased++;
      }
    }

    // 3. Automated Session Reminders (T-24h & T-1h for confirmed online sessions)
    const nowMs = Date.now();
    const in25HoursIso = new Date(nowMs + 25 * 60 * 60 * 1000).toISOString();
    const { data: upcomingSessions } = await admin
      .from("bookings")
      .select("id,user_id,offering_slug,requested_start,reminder_24h_sent_at,reminder_1h_sent_at")
      .eq("status", "confirmed")
      .eq("format", "online")
      .gte("requested_start", now)
      .lte("requested_start", in25HoursIso)
      .limit(40);

    if (upcomingSessions?.length) {
      const siteUrl = getSiteUrl();
      for (const session of upcomingSessions) {
        if (!session.requested_start) continue;
        const msUntil = Date.parse(session.requested_start) - nowMs;
        const needs1h = msUntil <= 90 * 60 * 1000 && msUntil > 0 && !session.reminder_1h_sent_at;
        const needs24h = msUntil <= 25 * 60 * 60 * 1000 && msUntil > 2 * 60 * 60 * 1000 && !session.reminder_24h_sent_at;
        if (!needs1h && !needs24h) continue;

        const { data: profile } = await admin
          .from("profiles")
          .select("email,full_name")
          .eq("id", session.user_id)
          .maybeSingle();
        if (!profile?.email) continue;

        const title = session.offering_slug.replace(/-/g, " ").replace(/\b\w/g, (ch: string) => ch.toUpperCase());
        const startsAtLabel = `${new Date(session.requested_start).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "numeric",
          minute: "2-digit",
        })} IST`;

        const mail = sessionReminderEmail({
          name: profile.full_name ?? profile.email.split("@")[0],
          title,
          startsAtLabel,
          joinUrl: `${siteUrl}/account/bookings/${session.id}/room`,
          windowLabel: needs1h ? "1 hour" : "24 hours",
        });

        const sent = await sendEmail({ to: profile.email, subject: mail.subject, html: mail.html });
        if (sent.ok) {
          await admin
            .from("bookings")
            .update(needs1h ? { reminder_1h_sent_at: now } : { reminder_24h_sent_at: now })
            .eq("id", session.id);
          results.remindersSent++;
        }
      }
    }

    return apiSuccess({ success: true, ...results });
  } catch (error) {
    console.error("[cron:cleanup]", error);
    return apiError("INTERNAL_ERROR", "Cron cleanup failed.", 500);
  }
}
