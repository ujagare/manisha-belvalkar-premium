import { apiError, apiSuccess, readJsonObject, requestId } from "@/lib/api";
import { getCatalogItem, orderTypes } from "@/lib/checkout";
import { isPaymentsConfigured, serverEnv } from "@/lib/env";
import { consumeRateLimit } from "@/lib/rate-limit";
import { createRazorpayOrder } from "@/lib/razorpay";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { OrderItemType } from "@/lib/supabase/database.types";
import { isSameOriginRequest } from "@/lib/security";

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
        currency: "INR",
        status: "pending",
        payment_status: "created",
        idempotency_key: idempotencyKey,
        address_id: addressId,
      })
      .select("id")
      .single();
    if (orderError || !order) throw new Error(`Order insert failed: ${orderError?.message ?? "unknown"}`);

    const { error: itemsError } = await admin.from("order_items").insert(resolved.map(({ requested, item }) => ({
      order_id: order.id,
      item_type: item!.type,
      item_slug: item!.slug,
      title: item!.title,
      quantity: requested.quantity,
      unit_amount_subunits: Math.round(item!.price! * 100),
      metadata: item!.type === "course" && customerDetails ? customerDetails : {},
    })));
    if (itemsError) throw new Error(`Order items insert failed: ${itemsError.message}`);

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
