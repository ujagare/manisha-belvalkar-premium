import assert from "node:assert/strict";
import { test } from "node:test";
import { cartState } from "../src/lib/cart.ts";
import {
  cartWhatsAppMessage,
  contactWhatsAppMessage,
  purchaseWhatsAppMessage,
  sessionWhatsAppMessage,
  shouldUseManualFlow,
  whatsappUrl,
} from "../src/lib/manual-flow.ts";

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

test("missing Supabase or Razorpay activates manual fallback", () => {
  assert.equal(shouldUseManualFlow(false, false), true);
  assert.equal(shouldUseManualFlow(true, false), true);
  assert.equal(shouldUseManualFlow(true, true), false);
});
