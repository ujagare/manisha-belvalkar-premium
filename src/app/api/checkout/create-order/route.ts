import { apiError, apiSuccess, readJsonObject, requestId } from "@/lib/api";
import { getCatalogItem, orderTypes } from "@/lib/checkout";
import { isPaymentsConfigured, serverEnv } from "@/lib/env";
import { consumeRateLimit } from "@/lib/rate-limit";
import { createRazorpayOrder } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { OrderItemType } from "@/lib/supabase/database.types";
import { isSameOriginRequest } from "@/lib/security";
import { calculateGstBreakdown } from "@/lib/gst";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const traceId = requestId(request);
  try {
    if (!isSameOriginRequest(request)) return apiError("FORBIDDEN", "Request origin is not allowed.", 403);
    if (!isPaymentsConfigured()) {
      return apiError("PAYMENTS_NOT_CONFIGURED", "Online payment is not available yet.", 503);
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await readJsonObject(request);

    // Guest checkout: allow an order without an account as long as a valid
    // contact email is supplied. Signed-in users are unaffected.
    const guestEmail =
      typeof body.guestEmail === "string" && /.+@.+\..+/.test(body.guestEmail.trim())
        ? body.guestEmail.trim().slice(0, 320)
        : null;
    const guestName =
      typeof body.guestName === "string" ? body.guestName.trim().slice(0, 100) : null;
    if (!user && !guestEmail) {
      return apiError("UNAUTHORIZED", "Please sign in or enter your email to continue.", 401);
    }
    const rateKey = user?.id ?? guestEmail!;
    if (!(await consumeRateLimit(request, "checkout", 8, 600, rateKey))) {
      return apiError("RATE_LIMITED", "Too many checkout attempts. Please try again shortly.", 429);
    }
    const cartItems = Array.isArray(body.items) ? body.items : null;
    const requestedItems = cartItems
      ? cartItems.slice(0, 20).map((raw) => {
          const value = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
          return {
            type: "product" as OrderItemType,
            slug: typeof value.slug === "string" ? value.slug.trim() : "",
            quantity: typeof value.quantity === "number" && Number.isInteger(value.quantity) ? value.quantity : 1,
          };
        })
      : [{
          type: typeof body.type === "string" ? body.type as OrderItemType : "product" as OrderItemType,
          slug: typeof body.slug === "string" ? body.slug.trim() : "",
          quantity: typeof body.quantity === "number" && Number.isInteger(body.quantity) ? body.quantity : 1,
        }];
    const idempotencyKey = request.headers.get("idempotency-key")?.trim();
    const totalQuantity = requestedItems.reduce((sum, item) => sum + item.quantity, 0);
    if (!requestedItems.length || totalQuantity > 20 || requestedItems.some((item) => !orderTypes.includes(item.type) || !/^[a-z0-9-]{1,100}$/.test(item.slug) || item.quantity < 1 || item.quantity > 20)) {
      return apiError("BAD_REQUEST", "Invalid checkout item.", 422);
    }
    if (!idempotencyKey || !/^[A-Za-z0-9_-]{16,100}$/.test(idempotencyKey)) {
      return apiError("BAD_REQUEST", "A valid idempotency key is required.", 422);
    }

    // Optional delivery address: either an existing saved address (id) or a
    // one-time address object. Physical orders should carry a valid address.
    const addressBody = body.address && typeof body.address === "object" ? body.address as Record<string, unknown> : null;
    const customerDetailsBody = body.customerDetails && typeof body.customerDetails === "object" ? body.customerDetails as Record<string, unknown> : null;
    const customerDetails = customerDetailsBody
      ? {
          phone: typeof customerDetailsBody.phone === "string" ? customerDetailsBody.phone.trim().slice(0, 20) : "",
          preferred_language: typeof customerDetailsBody.preferredLanguage === "string" ? customerDetailsBody.preferredLanguage.trim().slice(0, 40) : "",
          preferred_contact: typeof customerDetailsBody.preferredContact === "string" ? customerDetailsBody.preferredContact.trim().slice(0, 40) : "",
          experience_level: typeof customerDetailsBody.experienceLevel === "string" ? customerDetailsBody.experienceLevel.trim().slice(0, 80) : "",
          learning_goal: typeof customerDetailsBody.learningGoal === "string" ? customerDetailsBody.learningGoal.trim().slice(0, 1000) : "",
        }
      : null;
    const savedAddressId = typeof addressBody?.savedAddressId === "string" ? addressBody.savedAddressId.trim() : null;
    const pendingAddress = addressBody && !savedAddressId
      ? {
          recipient_name: typeof addressBody.recipient_name === "string" ? addressBody.recipient_name.trim().slice(0, 100) : "",
          phone: typeof addressBody.phone === "string" ? addressBody.phone.trim().slice(0, 20) : "",
          line1: typeof addressBody.line1 === "string" ? addressBody.line1.trim().slice(0, 200) : "",
          line2: typeof addressBody.line2 === "string" ? addressBody.line2.trim().slice(0, 200) : null,
          city: typeof addressBody.city === "string" ? addressBody.city.trim().slice(0, 80) : "",
          state: typeof addressBody.state === "string" ? addressBody.state.trim().slice(0, 80) : "",
          postal_code: typeof addressBody.postal_code === "string" ? addressBody.postal_code.trim().slice(0, 12) : "",
        }
      : null;

    const resolved = await Promise.all(requestedItems.map(async (requested) => ({ requested, item: await getCatalogItem(requested.type, requested.slug) })));
    if (resolved.some(({ item }) => !item)) return apiError("NOT_FOUND", "One or more items are unavailable.", 404);
    if (resolved.some(({ item }) => item!.price == null || item!.price! <= 0)) {
      return apiError("CONFLICT", "This offering requires confirmation before payment.", 409);
    }

    const amountSubunits = resolved.reduce((sum, { requested, item }) => sum + Math.round(item!.price! * 100) * requested.quantity, 0);
    if (!Number.isSafeInteger(amountSubunits) || amountSubunits < 100) {
      return apiError("BAD_REQUEST", "Payment amount must be at least ₹1.", 422);
    }
    const primary = resolved[0].item!;
    const orderTitle = resolved.length === 1 ? primary.title : `${primary.title} + ${resolved.length - 1} more`;
    const admin = createAdminClient();

    // Resolve the chosen delivery address to an address_id (saved or new).
    let addressId: string | null = null;
    if (savedAddressId && user) {
      const { data: saved } = await admin.from("addresses").select("id").eq("id", savedAddressId).eq("user_id", user.id).maybeSingle();
      if (!saved) return apiError("NOT_FOUND", "Selected address could not be verified.", 404);
      addressId = saved.id;
    } else if (pendingAddress && pendingAddress.recipient_name && pendingAddress.phone && pendingAddress.line1 && pendingAddress.city && pendingAddress.state && /^[0-9]{3,6}([-\s]?[0-9]{1,3})?$/.test(pendingAddress.postal_code)) {
      const { data: created, error: addrError } = await admin.from("addresses").insert({ user_id: user?.id ?? null, ...pendingAddress }).select("id").single();
      if (addrError || !created) throw new Error(`Address insert failed: ${addrError?.message ?? "unknown"}`);
      addressId = created.id;
    }
    if (requestedItems.some((item) => item.type === "product") && !addressId) {
      return apiError("BAD_REQUEST", "A complete delivery address is required for physical products.", 422);
    }
    if (requestedItems.some((item) => item.type === "course") && (!customerDetails?.phone || customerDetails.learning_goal.length < 20)) {
      return apiError("BAD_REQUEST", "Phone number and learning goals are required for course enrollment.", 422);
    }

    // Check duplicate course enrollments for signed-in users
    if (user && requestedItems.some((item) => item.type === "course")) {
      const courseItems = requestedItems.filter((i) => i.type === "course");
      for (const cItem of courseItems) {
        const { data: existingEnrollment } = await admin
          .from("course_enrollments")
          .select("id")
          .eq("user_id", user.id)
          .eq("course_slug", cItem.slug)
          .eq("status", "active")
          .maybeSingle();

        if (existingEnrollment) {
          return apiError("CONFLICT", `You are already enrolled in this course (${cItem.slug}).`, 409);
        }
      }
    }

    // Check stock availability for physical products
    const productItems = requestedItems.filter((i) => i.type === "product");
    const matchedVariants: Array<{ variantId: string; quantity: number }> = [];

    if (productItems.length > 0) {
      for (const pItem of productItems) {
        const { data: prod } = await admin.from("products").select("id,title").eq("slug", pItem.slug).maybeSingle();
        if (prod) {
          const { data: variant } = await admin
            .from("product_variants")
            .select("id,stock_on_hand,reserved_stock")
            .eq("product_id", prod.id)
            .eq("is_active", true)
            .order("created_at", { ascending: true })
            .limit(1)
            .maybeSingle();

          if (variant) {
            const availableStock = variant.stock_on_hand - variant.reserved_stock;
            if (availableStock < pItem.quantity) {
              return apiError(
                "CONFLICT",
                `"${prod.title}" is out of stock or only ${Math.max(0, availableStock)} item(s) left.`,
                409
              );
            }
            matchedVariants.push({ variantId: variant.id, quantity: pItem.quantity });
          }
        }
      }
    }

    let existingQuery = admin
      .from("orders")
      .select("id,gateway_order_id,amount_subunits,currency")
      .eq("user_id", user?.id ?? null)
      .eq("idempotency_key", idempotencyKey);
    if (!user && guestEmail) existingQuery = existingQuery.eq("guest_email", guestEmail);
    const { data: existing } = await existingQuery.maybeSingle();
    if (existing?.gateway_order_id) {
      return apiSuccess({
        orderId: existing.id,
        razorpayOrderId: existing.gateway_order_id,
        amount: existing.amount_subunits,
        currency: existing.currency,
        keyId: serverEnv.razorpayKeyId(),
      });
    }

    // Determine customer state for GST (CGST+SGST for Maharashtra, IGST for others)
    let customerState: string | null = null;
    if (pendingAddress?.state) {
      customerState = pendingAddress.state;
    } else if (addressId) {
      const { data: addr } = await admin.from("addresses").select("state").eq("id", addressId).maybeSingle();
      if (addr?.state) customerState = addr.state;
    }

    const itemTaxBreakdowns = resolved.map(({ requested, item }) => {
      const lineTotalSubunits = Math.round(item!.price! * 100) * requested.quantity;
      const breakdown = calculateGstBreakdown(item!.type, item!.slug, lineTotalSubunits, customerState);
      return { requested, item: item!, breakdown, lineTotalSubunits };
    });

    const subtotalSubunits = itemTaxBreakdowns.reduce((sum, b) => sum + b.breakdown.taxableSubunits, 0);
    const taxSubunits = itemTaxBreakdowns.reduce((sum, b) => sum + b.breakdown.taxSubunits, 0);
    const cgstSubunits = itemTaxBreakdowns.reduce((sum, b) => sum + b.breakdown.cgstSubunits, 0);
    const sgstSubunits = itemTaxBreakdowns.reduce((sum, b) => sum + b.breakdown.sgstSubunits, 0);
    const igstSubunits = itemTaxBreakdowns.reduce((sum, b) => sum + b.breakdown.igstSubunits, 0);

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        guest_email: guestEmail,
        guest_name: guestName,
        item_type: primary.type,
        item_slug: primary.slug,
        item_title: orderTitle,
        amount: amountSubunits / 100,
        amount_subunits: amountSubunits,
        subtotal_subunits: subtotalSubunits,
        tax_subunits: taxSubunits,
        cgst_subunits: cgstSubunits,
        sgst_subunits: sgstSubunits,
        igst_subunits: igstSubunits,
        currency: "INR",
        status: "pending",
        payment_status: "created",
        idempotency_key: idempotencyKey,
        address_id: addressId,
      })
      .select("id")
      .single();
    if (orderError || !order) throw new Error(`Order insert failed: ${orderError?.message ?? "unknown"}`);

    const { error: itemsError } = await admin.from("order_items").insert(itemTaxBreakdowns.map(({ requested, item, breakdown }) => ({
      order_id: order.id,
      item_type: item.type,
      item_slug: item.slug,
      title: item.title,
      quantity: requested.quantity,
      unit_amount_subunits: Math.round(item.price! * 100),
      hsn_sac_code: breakdown.hsnSacCode,
      tax_rate: breakdown.taxRatePercent,
      tax_subunits: breakdown.taxSubunits,
      metadata: item.type === "course" && customerDetails ? customerDetails : {},
    })));
    if (itemsError) throw new Error(`Order items insert failed: ${itemsError.message}`);

    // Reserve inventory for products. The ledger row goes in first so the
    // unique index on (order_id, variant_id, reason) makes the reservation
    // idempotent — a retried create-order with the same idempotency key cannot
    // reserve the same units twice.
    for (const matched of matchedVariants) {
      const { error: reserveError } = await admin.from("inventory_movements").insert({
        variant_id: matched.variantId,
        order_id: order.id,
        quantity_delta: -matched.quantity,
        reason: "reserve",
        note: `Reserved ${matched.quantity} unit(s) for checkout order ${order.id.slice(0, 8)}`,
      });
      if (reserveError) {
        if (reserveError.code !== "23505") console.error("[checkout:reserve]", reserveError);
        continue;
      }

      const { data: currentVar } = await admin
        .from("product_variants")
        .select("reserved_stock")
        .eq("id", matched.variantId)
        .maybeSingle();

      if (currentVar) {
        await admin
          .from("product_variants")
          .update({
            reserved_stock: currentVar.reserved_stock + matched.quantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", matched.variantId);
      }
    }

    const gatewayOrder = await createRazorpayOrder({
      amount: amountSubunits,
      currency: "INR",
      receipt: order.id.slice(0, 40),
      notes: { internal_order_id: order.id, user_id: user?.id ?? "guest", item_count: String(totalQuantity) },
    });
    const { error: updateError } = await admin.from("orders").update({ gateway_order_id: gatewayOrder.id }).eq("id", order.id);
    if (updateError) throw new Error(`Order gateway update failed: ${updateError.message}`);
    const { error: paymentError } = await admin.from("payments").insert({
      order_id: order.id,
      provider: "razorpay",
      provider_order_id: gatewayOrder.id,
      amount_subunits: amountSubunits,
      currency: "INR",
      status: "created",
    });
    if (paymentError) throw new Error(`Payment insert failed: ${paymentError.message}`);

    return apiSuccess({
      orderId: order.id,
      razorpayOrderId: gatewayOrder.id,
      amount: amountSubunits,
      currency: "INR",
      keyId: serverEnv.razorpayKeyId(),
    }, 201);
  } catch (error) {
    console.error("[checkout:create-order]", { traceId, error });
    const message = error instanceof Error && ["CONTENT_TYPE", "BODY_TOO_LARGE", "INVALID_BODY"].includes(error.message)
      ? "Invalid request body."
      : "Could not start checkout. Please try again.";
    return apiError("INTERNAL_ERROR", message, 500, { traceId });
  }
}
