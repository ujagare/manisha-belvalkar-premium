import "server-only";
import { createHmac } from "node:crypto";
import { serverEnv } from "@/lib/env";
import { collectPaginatedRazorpayItems } from "@/lib/payment-safety";
import { constantTimeEqualHex } from "@/lib/security";

import type { SupportedCurrency } from "@/lib/currency";

const API = "https://api.razorpay.com/v1";

function credentials() {
  const keyId = serverEnv.razorpayKeyId();
  const keySecret = serverEnv.razorpayKeySecret();
  if (!keyId || !keySecret) throw new Error("Razorpay is not configured");
  return { keyId, keySecret };
}

export async function createRazorpayOrder(input: {
  amount: number;
  currency: SupportedCurrency;
  receipt: string;
  notes: Record<string, string>;
}) {
  const { keyId, keySecret } = credentials();
  const response = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Razorpay order creation failed (${response.status})`);
  return (await response.json()) as { id: string; amount: number; currency: string; status: string };
}

export async function fetchRazorpayPayment(paymentId: string) {
  const { keyId, keySecret } = credentials();
  const response = await fetch(`${API}/payments/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}` },
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Razorpay payment fetch failed (${response.status})`);
  return (await response.json()) as {
    id: string;
    order_id: string;
    amount: number;
    currency: string;
    status: "created" | "authorized" | "captured" | "refunded" | "failed";
    method?: string;
  };
}

export async function createRazorpayRefund(paymentId: string, input?: {
  amount?: number;
  notes?: Record<string, string>;
  receipt?: string;
}) {
  const { keyId, keySecret } = credentials();
  const response = await fetch(`${API}/payments/${encodeURIComponent(paymentId)}/refund`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input ?? {}),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Razorpay refund failed (${response.status}): ${errorText}`);
  }
  return (await response.json()) as { id: string; amount: number; currency: string; status: string; payment_id: string };
}

type RazorpayOrderPayment = {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "refunded" | "failed";
  method?: string;
};

export async function fetchRazorpayOrderPayments(orderId: string) {
  const { keyId, keySecret } = credentials();
  const authHeader = `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
  return collectPaginatedRazorpayItems<RazorpayOrderPayment>(async ({ count, skip }) => {
    const response = await fetch(
      `${API}/orders/${encodeURIComponent(orderId)}/payments?count=${count}&skip=${skip}`,
      {
        headers: { Authorization: authHeader },
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      },
    );
    if (!response.ok) throw new Error(`Razorpay order payments fetch failed (${response.status})`);
    const data = (await response.json()) as { items?: RazorpayOrderPayment[] };
    return data.items ?? [];
  });
}

export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
  const secret = credentials().keySecret;
  const expected = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return constantTimeEqualHex(expected, signature);
}

export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = serverEnv.razorpayWebhookSecret();
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return constantTimeEqualHex(expected, signature);
}
