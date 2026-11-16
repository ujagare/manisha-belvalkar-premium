import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { DISTANCE_HEALING_SLUG, ensureDistanceHealingCase } from "@/lib/distance-healing";
import { orderConfirmationEmail, sendEmail } from "@/lib/resend";
import { formatINR } from "@/lib/utils";
import { assignOrderInvoiceNumber, orderInvoiceToken } from "@/lib/invoice";
import { getSiteUrl } from "@/lib/site-url";

type AdminClient = ReturnType<typeof createAdminClient>;

interface OrderRecord {
  id: string;
  user_id: string | null;
  item_type: string;
  item_slug: string;
  item_title: string;
  amount: number | null;
  amount_subunits: number | null;
  guest_email: string | null;
  guest_name: string | null;
  user_email?: string | null;
  user_name?: string | null;
}

/**
 * Activates order fulfillment upon successful payment capture:
 * - Bookings for service/healing
 * - Distance healing case creation
 * - Recorded course enrollments
 * - Inventory decrement (reserved stock -> sold)
 * - Confirmation email (idempotent, once per order)
 */
export async function activateOrderFulfilment(admin: AdminClient, order: OrderRecord) {
  // Generate & assign sequential GST Tax Invoice Number. Returns the number
  // that was already present when this order had been fulfilled once before,
  // which is how we keep the confirmation email to a single send — both the
  // browser verify route and the webhook call this function for one payment.
  const priorInvoice = await admin
    .from("orders")
    .select("invoice_number")
    .eq("id", order.id)
    .maybeSingle();
  const alreadyFulfilled = Boolean(priorInvoice.data?.invoice_number);

  await assignOrderInvoiceNumber(admin, order.id);

  // 1. Service / Healing booking
  if (order.item_type === "service" || order.item_type === "healing") {
    await admin.from("bookings").upsert(
      {
        user_id: order.user_id,
        order_id: order.id,
        offering_type: order.item_type,
        offering_slug: order.item_slug,
        format: "online",
        timezone: "Asia/Kolkata",
        status: "requested",
      },
      { onConflict: "order_id" }
    );
  }

  // 2. Distance healing intake case
  if (order.user_id && order.item_type === "healing" && order.item_slug === DISTANCE_HEALING_SLUG) {
    await ensureDistanceHealingCase(order.id, order.user_id);
  }

  // 3. Course enrollment
  if (order.user_id && order.item_type === "course") {
    await admin.from("course_enrollments").upsert(
      {
        user_id: order.user_id,
        order_id: order.id,
        course_slug: order.item_slug,
        status: "active",
        enrolled_at: new Date().toISOString(),
      },
      { onConflict: "order_id" }
    );
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

  // 5. Send order confirmation email (best-effort).
  // Signed-in customers get it too — previously only guest orders were
  // emailed, so a logged-in buyer never received a receipt.
  const recipientEmail = order.guest_email ?? order.user_email ?? null;
  if (recipientEmail && !alreadyFulfilled) {
    const token = orderInvoiceToken(order.id);
    const invoicePath = token
      ? `${getSiteUrl()}/api/orders/${order.id}/invoice?token=${token}`
      : null;
    const { subject, html } = orderConfirmationEmail({
      name: order.guest_name ?? order.user_name ?? recipientEmail.split("@")[0],
      email: recipientEmail,
      orderRef: order.id.slice(0, 8),
      items: order.item_title,
      totalLabel:
        order.amount_subunits != null
          ? formatINR(order.amount_subunits / 100)
          : order.amount != null
            ? formatINR(order.amount)
            : "—",
      itemType: order.item_type,
      invoicePath,
    });
    const result = await sendEmail({ to: recipientEmail, subject, html });
    console.log(`[fulfillment:email] order=${order.id.slice(0, 8)}`, result.ok ? "sent" : `skipped: ${result.error}`);
  }
}

/**
 * Revokes access and cancels orders/bookings when a refund is processed:
 * - Cancels order & sets payment_status = 'refunded'
 * - Revokes course access ('refunded')
 * - Cancels bookings
 * - Returns physical stock to inventory (reason: 'return')
 */
export async function revokeOrderFulfilment(admin: AdminClient, orderId: string, providerRefundId?: string | null) {
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

  // 3. Cancel booking
  await admin.from("bookings").update({
    status: "cancelled",
    updated_at: new Date().toISOString(),
  }).eq("order_id", orderId);

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
