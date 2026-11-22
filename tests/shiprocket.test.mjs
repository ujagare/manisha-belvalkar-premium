import assert from "node:assert/strict";
import { test } from "node:test";
import {
  calculateParcelSpec,
  estimateFallbackDelivery,
  formatShiprocketOrderDate,
  isValidIndianPincode,
  mapShiprocketStatus,
  normalizeTrackingScans,
  parseCourierOptions,
  shipmentMilestoneIndex,
  shiprocketTrackingUrl,
  verifyShiprocketWebhookToken,
} from "../src/lib/shiprocket-utils.ts";

test("Indian PIN code validation accepts valid 6-digit codes and rejects malformed inputs", () => {
  assert.equal(isValidIndianPincode("400001"), true);
  assert.equal(isValidIndianPincode("411001"), true);
  assert.equal(isValidIndianPincode("110001"), true);
  assert.equal(isValidIndianPincode("011001"), false);
  assert.equal(isValidIndianPincode("40001"), false);
  assert.equal(isValidIndianPincode("4000011"), false);
  assert.equal(isValidIndianPincode("abc123"), false);
});

test("parcel spec calculates accurate weight and stacked dimensions for single and multi-item carts", () => {
  const deck = calculateParcelSpec([{ slug: "shakti-oracle-deck", quantity: 1 }]);
  assert.equal(deck.weightKg, 0.45);
  assert.equal(deck.lengthCm, 16);
  assert.equal(deck.breadthCm, 12);
  assert.equal(deck.heightCm, 5);

  const combo = calculateParcelSpec([
    { slug: "shakti-oracle-deck", quantity: 2 },
    { slug: "sacred-salt-frame", quantity: 1 },
  ]);
  assert.equal(combo.weightKg, 2.1);
  assert.equal(combo.lengthCm, 26);
  assert.equal(combo.breadthCm, 22);
  assert.equal(combo.heightCm, 20);
});

test("Shiprocket status IDs and labels map cleanly to internal lifecycle and milestone indices", () => {
  assert.equal(mapShiprocketStatus(1, "NEW").shipmentStatus, "created");
  assert.equal(mapShiprocketStatus(2, "AWB Assigned").shipmentStatus, "awb_assigned");
  assert.equal(mapShiprocketStatus(3, "Pickup Scheduled").shipmentStatus, "pickup_scheduled");
  assert.equal(mapShiprocketStatus(6, "Shipped").shipmentStatus, "shipped");
  assert.equal(mapShiprocketStatus(18, "In Transit").shipmentStatus, "in_transit");
  assert.equal(mapShiprocketStatus(17, "Out For Delivery").shipmentStatus, "out_for_delivery");
  assert.equal(mapShiprocketStatus(7, "Delivered").shipmentStatus, "delivered");
  assert.equal(mapShiprocketStatus(7, "Delivered").fulfillmentStatus, "delivered");
  assert.equal(mapShiprocketStatus(9, "RTO Initiated").shipmentStatus, "rto_initiated");
  assert.equal(mapShiprocketStatus(10, "RTO Delivered").shipmentStatus, "returned");
  assert.equal(mapShiprocketStatus(8, "Canceled").shipmentStatus, "cancelled");
  assert.equal(mapShiprocketStatus(21, "Undelivered").shipmentStatus, "exception");

  assert.equal(shipmentMilestoneIndex("pending"), 0);
  assert.equal(shipmentMilestoneIndex("pickup_scheduled"), 1);
  assert.equal(shipmentMilestoneIndex("shipped"), 2);
  assert.equal(shipmentMilestoneIndex("in_transit"), 3);
  assert.equal(shipmentMilestoneIndex("out_for_delivery"), 4);
  assert.equal(shipmentMilestoneIndex("delivered"), 5);
  assert.equal(shipmentMilestoneIndex("rto_initiated"), -1);
});

test("tracking scans normalize, deduplicate, and sort newest-first", () => {
  const scans = normalizeTrackingScans([
    { date: "2026-11-18 10:00:00", activity: "Picked up from Pune", location: "Pune", "sr-status-label": "SHIPPED" },
    { date: "2026-11-19 14:30:00", activity: "Out for delivery", location: "Mumbai", "sr-status-label": "OUT FOR DELIVERY" },
    { date: "2026-11-18 10:00:00", activity: "Picked up from Pune", location: "Pune", "sr-status-label": "SHIPPED" },
  ]);
  assert.equal(scans.length, 2);
  assert.equal(scans[0].location, "Mumbai");
  assert.equal(scans[1].location, "Pune");
});

test("courier parser identifies recommended, cheapest, and fastest couriers", () => {
  const parsed = parseCourierOptions(
    [
      { courier_company_id: 10, courier_name: "Delhivery Surface", rate: 62, estimated_delivery_days: 5, mode: 0, rating: 4.3, cod: 1 },
      { courier_company_id: 24, courier_name: "Blue Dart Air", rate: 118, estimated_delivery_days: 2, mode: 1, rating: 4.8, cod: 0 },
      { courier_company_id: 35, courier_name: "Xpressbees Air", rate: 84, estimated_delivery_days: 3, mode: 1, rating: 4.5, cod: 1 },
    ],
    35,
  );
  assert.equal(parsed.couriers.length, 3);
  assert.equal(parsed.recommendedCourier?.courierCompanyId, 35);
  assert.equal(parsed.cheapestCourier?.courierCompanyId, 10);
  assert.equal(parsed.fastestCourier?.courierCompanyId, 24);
  assert.equal(parsed.fastestCourier?.mode, "Air");
  assert.equal(parsed.cheapestCourier?.mode, "Surface");
});

test("webhook token verification uses exact constant-time match", () => {
  assert.equal(verifyShiprocketWebhookToken("secret-token-123", "secret-token-123"), true);
  assert.equal(verifyShiprocketWebhookToken("secret-token-124", "secret-token-123"), false);
  assert.equal(verifyShiprocketWebhookToken("short", "secret-token-123"), false);
  assert.equal(verifyShiprocketWebhookToken(null, "secret-token-123"), false);
  assert.equal(verifyShiprocketWebhookToken("secret-token-123", ""), false);
});

test("fallback delivery estimator and Shiprocket helpers produce valid formats", () => {
  const mh = estimateFallbackDelivery("400001", new Date("2026-11-19T00:00:00Z"));
  const del = estimateFallbackDelivery("110001", new Date("2026-11-19T00:00:00Z"));
  assert.equal(mh.serviceable, true);
  assert.equal(mh.live, false);
  assert.ok(mh.estimatedDaysMax < del.estimatedDaysMax);
  assert.equal(shiprocketTrackingUrl("AWB 123"), "https://shiprocket.co/tracking/AWB%20123");
  assert.equal(shiprocketTrackingUrl(""), null);
  assert.match(formatShiprocketOrderDate("2026-11-19T09:00:00.000Z"), /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
});
