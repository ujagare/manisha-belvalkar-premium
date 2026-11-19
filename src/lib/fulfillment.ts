import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { DISTANCE_HEALING_SLUG, ensureDistanceHealingCase } from "@/lib/distance-healing";
import { orderConfirmationEmail, sendEmail } from "@/lib/resend";
import { formatCurrencySubunits, normalizeCurrency } from "@/lib/currency";
import { assignOrderInvoiceNumber, orderInvoiceToken } from "@/lib/invoice";
import { getSiteUrl } from "@/lib/site-url";
import { assertDatabaseSuccess, isAsyncHealingItem } from "@/lib/payment-safety";
import {
  provisionDailyBookingRoom,
  releaseAvailabilitySlot,
  revokeBookingVideoRoom,
} from "@/lib/bookings";
import { buildSessionIcs } from "@/lib/ics";
import { brand } from "@/lib/data";

type AdminClient = ReturnType<typeof createAdminClient>;

interface OrderRecord {
  id: string;
  user_id: string | null;
  item_type: string;
  item_slug: string;
  item_title: string;
  amount: number | null;
  amount_subunits: number | null;
  currency?: string | null;
  guest_email: string | null;
  guest_name: string | null;
  user_email?: string | null;
  user_name?: string | null;
}

/**
 * Activates order fulfillment upon successful payment capture:
 * - Bookings for live service/healing/mentoring + private Daily.co room provisioning
 * - Distance healing async case creation (no live video slot needed)
 * - Recorded course enrollments
 * - Inventory decrement (reserved stock -> sold)
 * - Confirmation email with .ics calendar invite & protected Join Room link (idempotent)
 */
export async function activateOrderFulfilment(admin: AdminClient, order: OrderRecord) {
  const priorInvoice = await admin
    .from("orders")
    .select("invoice_number")
    .eq("id", order.id)
    .maybeSingle();
  const alreadyFulfilled = Boolean(priorInvoice.data?.invoice_number);

  let confirmedBooking: {
    id: string;
    format: string;
    requested_start: string | null;
    timezone: string | null;
    meeting_url: string | null;
  } | null = null;

  const isAsyncDistanceHealing = isAsyncHealingItem(order.item_type, order.item_slug);

  // 1. Live Service / Healing / Mentoring booking (skip for async distance healing)
  if (["service", "healing", "mentoring"].includes(order.item_type) && !isAsyncDistanceHealing) {
    if (!order.user_id) throw new Error("Paid sessions require an authenticated customer.");
    const bookingResult = await admin
      .from("bookings")
      .update({
        status: "confirmed",
        hold_expires_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("order_id", order.id)
      .eq("user_id", order.user_id)
      .select("id,format,requested_start,timezone,meeting_url,daily_room_name");
    assertDatabaseSuccess(bookingResult, "Session booking confirmation");
    if (!bookingResult.data?.length) {
      throw new Error("Session booking confirmation: booking was not prepared before payment.");
    }
    const booking = bookingResult.data[0];
    if (booking.format === "online" && !booking.daily_room_name) {
      try {
        const room = await provisionDailyBookingRoom(admin, {
          id: booking.id,
          offering_slug: order.item_slug,
          requested_start: booking.requested_start,
        });
        if (room) booking.meeting_url = room.roomUrl;
      } catch (dailyErr) {
        // Log loudly, but do NOT roll back a paid booking — room can be lazily provisioned on join.
        console.error("[fulfillment:daily]", { bookingId: booking.id, dailyErr });
      }
    }
    confirmedBooking = booking;
  }

  // 2. Distance healing intake case (async photo workflow)
  if (order.user_id && order.item_type === "healing" && order.item_slug === DISTANCE_HEALING_SLUG) {
    await ensureDistanceHealingCase(order.id, order.user_id);
  }

  // 3. Course enrollment
  if (order.user_id && order.item_type === "course") {
    const enrollmentResult = await admin.from("course_enrollments").upsert(
      {
        user_id: order.user_id,
        order_id: order.id,
        course_slug: order.item_slug,
        status: "active",
        enrolled_at: new Date().toISOString(),
      },
      { onConflict: "order_id" }
    );
    assertDatabaseSuccess(enrollmentResult, "Course enrollment activation");
  }

  // 4. Physical product inventory: convert reserved stock into sale
  if (order.item_type === "product") {
    const { data: orderItems } = await admin
      .from("order_items")
      .select("item_slug,quantity")
      .eq("order_id", order.id)
      .eq("item_type", "product");

    if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        const { data: prod } = await admin.from("products").select("id").eq("slug", item.item_slug).maybeSingle();
        if (prod) {
          const { data: variant } = await admin
            .from("product_variants")
            .select("id,stock_on_hand,reserved_stock")
            .eq("product_id", prod.id)
            .limit(1)
            .maybeSingle();

          if (variant) {
            // Check if sale was already recorded for this order and variant
            const { data: existingSale } = await admin
              .from("inventory_movements")
              .select("id")
              .eq("order_id", order.id)
              .eq("variant_id", variant.id)
              .eq("reason", "sale")
              .maybeSingle();

            if (!existingSale) {
              const newStock = Math.max(0, variant.stock_on_hand - item.quantity);
              const newReserved = Math.max(0, variant.reserved_stock - item.quantity);

              // Claim the sale by writing the ledger row FIRST and letting a
              // unique index on (order_id, variant_id, reason) reject a
              // concurrent duplicate. Only the winner adjusts stock, so a
              // double webhook cannot decrement twice.
              const { error: ledgerError } = await admin.from("inventory_movements").insert({
                variant_id: variant.id,
                order_id: order.id,
                quantity_delta: -item.quantity,
                reason: "sale",
                note: `Captured payment for order ${order.id.slice(0, 8)}`,
              });

              if (ledgerError) {
                // 23505 = duplicate sale already recorded by the other caller.
                if (ledgerError.code !== "23505") {
                  console.error("[fulfillment:inventory]", ledgerError);
                }
                continue;
              }

              await admin.from("product_variants").update({
                stock_on_hand: newStock,
                reserved_stock: newReserved,
                updated_at: new Date().toISOString(),
              }).eq("id", variant.id);
            }
          }
        }
      }
    }
  }

  await assignOrderInvoiceNumber(admin, order.id);

  // 5. Send order confirmation email (best-effort, idempotent).
  let recipientEmail = order.guest_email ?? order.user_email ?? null;
  let recipientName = order.guest_name ?? order.user_name ?? null;
  if (!recipientEmail && order.user_id) {
    const { data: profile } = await admin
      .from("profiles")
      .select("email,full_name")
      .eq("id", order.user_id)
      .maybeSingle();
    recipientEmail = profile?.email ?? null;
    recipientName = recipientName ?? profile?.full_name ?? null;
  }

  if (recipientEmail && !alreadyFulfilled) {
    const siteUrl = getSiteUrl();
    const token = orderInvoiceToken(order.id);
    const invoicePath = token ? `${siteUrl}/api/orders/${order.id}/invoice?token=${token}` : null;
    const currency = normalizeCurrency(order.currency);
    const totalLabel = order.amount_subunits != null
      ? formatCurrencySubunits(order.amount_subunits, currency)
      : order.amount != null
        ? formatCurrencySubunits(Math.round(order.amount * 100), currency)
        : "—";

    const sessionJoinUrl = confirmedBooking && confirmedBooking.format === "online"
      ? `${siteUrl}/account/bookings/${confirmedBooking.id}/room`
      : null;
    const sessionStartLabel = confirmedBooking?.requested_start
      ? `${new Date(confirmedBooking.requested_start).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })} IST`
      : null;
    const healingPortalUrl = isAsyncDistanceHealing
      ? `${siteUrl}/distance-healing/${order.id}`
      : null;

    const { subject, html } = orderConfirmationEmail({
      name: recipientName ?? recipientEmail.split("@")[0],
      email: recipientEmail,
      orderRef: order.id.slice(0, 8).toUpperCase(),
      items: order.item_title,
      totalLabel,
      itemType: order.item_type,
      invoicePath,
      sessionStartLabel,
      sessionFormat: confirmedBooking?.format === "online" ? "Online (Private Video Room)" : confirmedBooking?.format ?? null,
      sessionJoinUrl,
      healingPortalUrl,
    });

    const attachments = confirmedBooking?.requested_start && sessionJoinUrl
      ? [{
          filename: `manisha-belvalkar-session-${order.id.slice(0, 8)}.ics`,
          content: buildSessionIcs({
            bookingId: confirmedBooking.id,
            title: order.item_title,
            startsAtIso: confirmedBooking.requested_start,
            joinUrl: sessionJoinUrl,
            organizerEmail: brand.email,
            attendeeEmail: recipientEmail,
          }),
          contentType: "text/calendar; charset=utf-8; method=REQUEST",
        }]
      : undefined;

    const result = await sendEmail({ to: recipientEmail, subject, html, attachments });
    console.log(`[fulfillment:email] order=${order.id.slice(0, 8)}`, result.ok ? "sent" : `skipped: ${result.error}`);
  }
}

/**
 * Revokes access and cancels orders/bookings when a refund is processed:
 * - Cancels order & sets payment_status = 'refunded'
 * - Revokes course access ('refunded')
 * - Cancels bookings, deletes private Daily.co room, releases slot
 * - Returns physical stock to inventory (reason: 'return')
 */
export async function revokeOrderFulfilment(admin: AdminClient, orderId: string, providerRefundId?: string | null) {
  const booking = await admin.from("bookings").select("slot_id,daily_room_name").eq("order_id", orderId).maybeSingle();
  assertDatabaseSuccess(booking, "Refund booking lookup");
  // 1. Update order status
  await admin.from("orders").update({
    payment_status: "refunded",
    status: "cancelled",
    updated_at: new Date().toISOString(),
  }).eq("id", orderId);

  // 2. Revoke course access
  await admin.from("course_enrollments").update({
    status: "refunded",
  }).eq("order_id", orderId);

  // 3. Cancel booking & revoke video room
  const bookingCancellation = await admin.from("bookings").update({
    status: "cancelled",
    updated_at: new Date().toISOString(),
  }).eq("order_id", orderId);
  assertDatabaseSuccess(bookingCancellation, "Refund booking cancellation");
  if (booking.data?.slot_id) await releaseAvailabilitySlot(admin, booking.data.slot_id);
  if (booking.data?.daily_room_name) await revokeBookingVideoRoom(booking.data.daily_room_name);

  // 4. Update internal refunds record if requested
  await admin.from("refunds").update({
    status: "processed",
    provider_refund_id: providerRefundId ?? null,
    updated_at: new Date().toISOString(),
  }).eq("order_id", orderId).in("status", ["requested", "approved", "processing"]);

  // 5. Restore physical stock if sale was completed
  const { data: sales } = await admin
    .from("inventory_movements")
    .select("variant_id,quantity_delta")
    .eq("order_id", orderId)
    .eq("reason", "sale");

  if (sales && sales.length > 0) {
    for (const sale of sales) {
      const units = Math.abs(sale.quantity_delta);
      const { data: variant } = await admin
        .from("product_variants")
        .select("id,stock_on_hand")
        .eq("id", sale.variant_id)
        .maybeSingle();

      if (variant) {
        await admin.from("product_variants").update({
          stock_on_hand: variant.stock_on_hand + units,
          updated_at: new Date().toISOString(),
        }).eq("id", variant.id);

        await admin.from("inventory_movements").insert({
          variant_id: variant.id,
          order_id: orderId,
          quantity_delta: units,
          reason: "return",
          note: `Refund processed: returned ${units} unit(s) to stock`,
        });
      }
    }
  }
}

/**
 * Releases reserved inventory if an order is cancelled or expires before payment capture
 */
export async function releaseReservedInventory(admin: AdminClient, orderId: string) {
  const { data: reserves } = await admin
    .from("inventory_movements")
    .select("id,variant_id,quantity_delta")
    .eq("order_id", orderId)
    .eq("reason", "reserve");

  if (reserves && reserves.length > 0) {
    for (const res of reserves) {
      const units = Math.abs(res.quantity_delta);
      const { data: variant } = await admin
        .from("product_variants")
        .select("id,reserved_stock")
        .eq("id", res.variant_id)
        .maybeSingle();

      if (variant) {
        await admin.from("product_variants").update({
          reserved_stock: Math.max(0, variant.reserved_stock - units),
          updated_at: new Date().toISOString(),
        }).eq("id", variant.id);

        await admin.from("inventory_movements").insert({
          variant_id: variant.id,
          order_id: orderId,
          quantity_delta: units,
          reason: "release",
          note: `Released reservation for uncaptured order ${orderId.slice(0, 8)}`,
        });
      }
    }
  }
}

export async function releasePendingSessionBooking(admin: AdminClient, orderId: string) {
  const booking = await admin
    .from("bookings")
    .select("id,slot_id,status")
    .eq("order_id", orderId)
    .maybeSingle();
  assertDatabaseSuccess(booking, "Pending session lookup");
  if (!booking.data || !["payment_pending", "requested"].includes(booking.data.status)) return;
  if (booking.data.slot_id) await releaseAvailabilitySlot(admin, booking.data.slot_id);
  const cancelled = await admin
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", booking.data.id);
  assertDatabaseSuccess(cancelled, "Pending session cancellation");
}
