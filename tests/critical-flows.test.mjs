import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { cartState, normalizeCartItems } from "../src/lib/cart.ts";
import { SHAKTI_CARD_COUNT, shaktiCardImagePath } from "../src/lib/shakti-card-assets.ts";
import {
  cartWhatsAppMessage,
  contactWhatsAppMessage,
  purchaseWhatsAppMessage,
  sessionWhatsAppMessage,
  shouldUseManualFlow,
  whatsappUrl,
} from "../src/lib/manual-flow.ts";
import {
  assertDatabaseSuccess,
  collectPaginatedRazorpayItems,
  defaultAvailabilityStarts,
  evaluateWebhookPaymentTransition,
  isAsyncHealingItem,
  isProtectedCheckoutPath,
  isWithinModificationWindow,
  resolveWebhookEventId,
  sessionCheckoutIssue,
  successfulPaymentStatus,
} from "../src/lib/payment-safety.ts";
import { convertInrToSubunits, formatCurrencySubunits, normalizeCurrency } from "../src/lib/currency.ts";
import { buildSessionIcs } from "../src/lib/ics.ts";
import { formatVisitorLocalDateTime, isOutsideIst } from "../src/lib/timezone.ts";

test("product order keeps its item, total, customer and delivery details", () => {
  const message = purchaseWhatsAppMessage({ reference: "ORDER-1", kind: "product", item: "Shakti Oracle Deck", total: "₹2,499", name: "Asha", email: "asha@example.com", details: "Delivery: Mumbai 400028" });
  assert.match(message, /Shakti Oracle Deck/);
  assert.match(message, /₹2,499/);
  assert.match(message, /Delivery: Mumbai 400028/);
});

test("course enrollment is identified separately from a product order", () => {
  const message = purchaseWhatsAppMessage({ reference: "COURSE-1", kind: "course", item: "Aishwarya Siddhi", total: "Fee confirmed personally", name: "Asha", email: "asha@example.com", details: "Learning goal: build a grounded daily practice" });
  assert.match(message, /enrollment request/);
  assert.match(message, /Learning goal/);
});

test("session booking contains the selected slot and reference", () => {
  const message = sessionWhatsAppMessage({ title: "Distance Healing", date: "12 Oct", time: "11:00", format: "Online", reference: "BOOKING-1" });
  assert.match(message, /12 Oct at 11:00 IST/);
  assert.match(message, /BOOKING-1/);
});

test("contact enquiry preserves contact details and message", () => {
  const message = contactWhatsAppMessage({ reference: "ENQUIRY-1", name: "Asha", phone: "+91 9876543210", email: "asha@example.com", message: "Please share session details." });
  assert.match(message, /asha@example.com/);
  assert.match(decodeURIComponent(whatsappUrl(message)), /Please share session details/);
});

test("empty and filled carts resolve to the correct UI state", () => {
  const item = { slug: "deck", title: "Deck", image: "/deck.jpg", price: 1000, quantity: 2 };
  assert.equal(cartState([]), "empty");
  assert.equal(cartState([item]), "ready");
  assert.match(cartWhatsAppMessage({ reference: "ORDER-2", items: [item], subtotalLabel: "₹2,000", name: "Asha", email: "asha@example.com", address: "Mumbai 400028" }), /Deck x 2/);
});

test("malformed persisted cart quantities default to one", () => {
  assert.equal(
    typeof normalizeCartItems,
    "function",
    "cart normalization must be available at the storage boundary",
  );

  const [item] = normalizeCartItems([
    { slug: "deck", title: "Deck", image: "/deck.jpg", price: 1000, quantity: "not-a-number" },
  ]);

  assert.equal(item.quantity, 1);
  assert.equal(item.price * item.quantity, 1000);
});

test("missing Supabase or Razorpay activates manual fallback", () => {
  assert.equal(shouldUseManualFlow(false, false), true);
  assert.equal(shouldUseManualFlow(true, false), true);
  assert.equal(shouldUseManualFlow(true, true), false);
});

test("paid sessions require a signed-in customer and a real availability slot", () => {
  assert.equal(sessionCheckoutIssue({ itemTypes: ["service"], userId: null, slotId: null, format: null }), "SIGN_IN_REQUIRED");
  assert.equal(sessionCheckoutIssue({ itemTypes: ["service"], userId: "user-1", slotId: null, format: "online" }), "SLOT_REQUIRED");
  assert.equal(sessionCheckoutIssue({ itemTypes: ["service"], userId: "user-1", slotId: "slot-1", format: "online" }), null);
  assert.equal(sessionCheckoutIssue({ itemTypes: ["product"], userId: null, slotId: null, format: null }), null);
});

test("only a captured Razorpay payment is treated as successful", () => {
  assert.equal(successfulPaymentStatus("captured"), true);
  assert.equal(successfulPaymentStatus("authorized"), false);
  assert.equal(successfulPaymentStatus("failed"), false);
});

test("database errors stop payment fulfillment instead of being acknowledged", () => {
  assert.throws(
    () => assertDatabaseSuccess({ error: { message: "booking insert failed" } }, "booking confirmation"),
    /booking confirmation: booking insert failed/,
  );
  assert.doesNotThrow(() => assertDatabaseSuccess({ error: null }, "booking confirmation"));
});

test("rolling availability continues after the latest slot in India time", () => {
  const starts = defaultAvailabilityStarts("2026-11-30T15:00:00.000Z", 2);
  assert.deepEqual(starts, [
    "2026-12-01T04:30:00.000Z",
    "2026-12-01T09:30:00.000Z",
    "2026-12-02T04:30:00.000Z",
    "2026-12-02T09:30:00.000Z",
  ]);
});

test("every selectable Shakti card resolves to an existing image", () => {
  for (let cardNumber = 1; cardNumber <= SHAKTI_CARD_COUNT; cardNumber += 1) {
    const publicPath = shaktiCardImagePath(cardNumber);
    assert.equal(
      existsSync(join(process.cwd(), "public", publicPath.slice(1))),
      true,
      `Missing image for Shakti card ${cardNumber}: ${publicPath}`,
    );
  }
});

test("async distance healing bypasses live slot requirement while live healing enforces it", () => {
  assert.equal(isAsyncHealingItem("healing", "distance-healing"), true);
  assert.equal(isAsyncHealingItem("healing", "shakti-healing"), false);
  assert.equal(
    sessionCheckoutIssue({
      itemTypes: ["healing"],
      itemSlugs: ["distance-healing"],
      userId: "user-1",
      slotId: null,
      format: null,
    }),
    null,
  );
  assert.equal(
    sessionCheckoutIssue({
      itemTypes: ["healing"],
      itemSlugs: ["shakti-healing"],
      userId: "user-1",
      slotId: null,
      format: "online",
    }),
    "SLOT_REQUIRED",
  );
});

test("INR and USD Razorpay currency conversion is authoritative and rounded cleanly", () => {
  assert.equal(normalizeCurrency("usd"), "USD");
  assert.equal(normalizeCurrency("EUR"), "INR");
  assert.equal(convertInrToSubunits(24000, "INR"), 2400000);
  const usdSubunits = convertInrToSubunits(24000, "USD");
  assert.equal(usdSubunits % 100, 0);
  assert.ok(usdSubunits >= 10000);
  assert.match(formatCurrencySubunits(usdSubunits, "USD"), /^\$/);
});

test("booking 24-hour cancel/reschedule window is strictly enforced", () => {
  const now = Date.parse("2026-11-20T10:00:00.000Z");
  assert.equal(isWithinModificationWindow("2026-11-21T10:01:00.000Z", now), true);
  assert.equal(isWithinModificationWindow("2026-11-21T09:59:00.000Z", now), false);
});

test("session calendar invite builds valid RFC 5545 VCALENDAR output", () => {
  const ics = buildSessionIcs({
    bookingId: "booking-123",
    title: "Shakti Healing",
    startsAtIso: "2026-12-01T04:30:00.000Z",
    joinUrl: "https://www.manishabelvalkar.com/account/bookings/booking-123/room",
    organizerEmail: "manishabelvalkar@gmail.com",
    attendeeEmail: "client@example.com",
  });
  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /DTSTART:20261201T043000Z/);
  assert.match(ics, /\/account\/bookings\/booking-123\/room/);
  assert.match(ics, /END:VCALENDAR/);
});

test("Razorpay webhook event ID derives deterministically from event + entity ID and rejects missing identifiers", () => {
  assert.equal(
    resolveWebhookEventId({
      event: "payment.captured",
      payload: { payment: { entity: { id: "pay_12345678" } } },
    }, null),
    "payment.captured:pay_12345678",
  );
  assert.equal(
    resolveWebhookEventId({
      event: "refund.processed",
      payload: {
        payment: { entity: { id: "pay_12345678" } },
        refund: { entity: { id: "rfnd_99999999" } },
      },
    }, null),
    "refund.processed:rfnd_99999999",
  );
  assert.equal(
    resolveWebhookEventId({
      event: "payment.dispute.created",
      payload: {
        payment: { entity: { id: "pay_12345678" } },
        dispute: { entity: { id: "disp_88888888" } },
      },
    }, null),
    "payment.dispute.created:disp_88888888",
  );
  assert.equal(
    resolveWebhookEventId({ event: "settlement.processed", payload: {} }, "evt_header_12345"),
    "evt_header_12345",
  );
  assert.equal(resolveWebhookEventId({ event: "payment.captured", payload: {} }, null), null);
  assert.equal(resolveWebhookEventId({ payload: {} }, "evt_header_12345"), null);
});

test("webhook payment transitions relax amount check on failed events and protect captured orders", () => {
  const existingCreated = { status: "created", amount_subunits: 249900, currency: "INR" };
  assert.equal(
    evaluateWebhookPaymentTransition({
      existing: existingCreated,
      incomingStatus: "failed",
      incomingAmount: 10000,
      incomingCurrency: "USD",
    }),
    "apply",
  );
  assert.equal(
    evaluateWebhookPaymentTransition({
      existing: existingCreated,
      incomingStatus: "captured",
      incomingAmount: 10000,
      incomingCurrency: "INR",
    }),
    "mismatch",
  );
  assert.equal(
    evaluateWebhookPaymentTransition({
      existing: { status: "captured", amount_subunits: 249900, currency: "INR" },
      incomingStatus: "failed",
      incomingAmount: 249900,
      incomingCurrency: "INR",
    }),
    "skip",
  );
  assert.equal(
    evaluateWebhookPaymentTransition({
      existing: null,
      incomingStatus: "failed",
      incomingAmount: 249900,
      incomingCurrency: "INR",
    }),
    "missing",
  );
});

test("paid checkout gate protects every /checkout route including products when payments are configured", () => {
  assert.equal(isProtectedCheckoutPath("/checkout/product/shakti-oracle-deck", true), true);
  assert.equal(isProtectedCheckoutPath("/checkout/cart", true), true);
  assert.equal(isProtectedCheckoutPath("/checkout/service/vastu", true), true);
  assert.equal(isProtectedCheckoutPath("/checkout/product/shakti-oracle-deck", false), false);
  assert.equal(isProtectedCheckoutPath("/products/shakti-oracle-deck", true), false);
});

test("Razorpay order payment collection paginates across pages using count and skip", async () => {
  const allItems = Array.from({ length: 12 }, (_, index) => ({
    id: `pay_${index + 1}`,
    status: index === 11 ? "captured" : "failed",
  }));
  const seenParams = [];
  const collected = await collectPaginatedRazorpayItems(
    async ({ count, skip }) => {
      seenParams.push({ count, skip });
      return allItems.slice(skip, skip + count);
    },
    { pageSize: 5, maxPages: 5 },
  );
  assert.equal(collected.length, 12);
  assert.equal(collected.at(-1)?.id, "pay_12");
  assert.deepEqual(seenParams, [
    { count: 5, skip: 0 },
    { count: 5, skip: 5 },
    { count: 5, skip: 10 },
  ]);
});

test("USD conversion rounds up cleanly and honors explicit server rate override for client parity", () => {
  assert.equal(convertInrToSubunits(8500, "USD", 85), 10000);
  assert.equal(convertInrToSubunits(8501, "USD", 85), 10100);
  assert.equal(convertInrToSubunits(8600, "USD", 85), 10200);
  assert.equal(formatCurrencySubunits(convertInrToSubunits(8600, "USD", 85), "USD"), "$102");
});

test("visitor local timezone formatter suppresses IST duplicates and converts NRI/international zones", () => {
  const slotIso = "2026-12-01T04:30:00.000Z"; // 10:00 AM IST
  assert.equal(isOutsideIst("Asia/Kolkata"), false);
  assert.equal(isOutsideIst("Asia/Calcutta"), false);
  assert.equal(isOutsideIst("America/New_York"), true);
  assert.equal(formatVisitorLocalDateTime(slotIso, "Asia/Kolkata"), null);

  const nyFull = formatVisitorLocalDateTime(slotIso, "America/New_York");
  assert.ok(nyFull && nyFull.includes("11:30"), `Expected 11:30 previous night in EST, got: ${nyFull}`);

  const nyTimeOnly = formatVisitorLocalDateTime(slotIso, "America/New_York", { timeOnly: true });
  assert.ok(nyTimeOnly && nyTimeOnly.includes("11:30"), `Expected 11:30 timeOnly in EST, got: ${nyTimeOnly}`);
});
