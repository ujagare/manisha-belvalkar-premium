import type { CartItem } from "@/lib/cart";

const WHATSAPP_BASE = "https://wa.me/919922246111";

export function manualReference(prefix = "MANUAL") {
  return `${prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export function whatsappUrl(message: string) {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
}

export function shouldUseManualFlow(serverConfigured: boolean, paymentsConfigured = serverConfigured) {
  return !serverConfigured || !paymentsConfigured;
}

export function contactWhatsAppMessage(input: {
  reference: string;
  name: string;
  phone: string;
  email: string;
  message: string;
}) {
  return `Namaste Manisha ji, I would like to send an enquiry.\n\nReference: ${input.reference}\nName: ${input.name}\nPhone: ${input.phone}\nEmail: ${input.email || "Not provided"}\n\nMessage:\n${input.message}\n\nPlease confirm the next steps.`;
}

export function leadWhatsAppMessage(input: {
  reference: string;
  kind: "waitlist" | "community";
  source?: string;
  name: string;
  email: string;
  phone: string;
  intention: string;
}) {
  const request = input.kind === "community" ? "Magic Community application" : "early access request";
  return `Namaste Manisha ji, I would like to submit a ${request}.\n\nReference: ${input.reference}\nName: ${input.name || "Not provided"}\nEmail: ${input.email || "Not provided"}\nPhone: ${input.phone || "Not provided"}${input.intention ? `\nIntention: ${input.intention}` : ""}${input.source ? `\nSource: ${input.source}` : ""}\n\nPlease confirm that you received this request.`;
}

export function eventWhatsAppMessage(title: string, reference: string) {
  return `Namaste Manisha ji, I would like to register my interest for ${title}.\n\nReference: ${reference}\n\nPlease share the next date, fee, and joining details.`;
}

export function cartWhatsAppMessage(input: {
  reference: string;
  items: CartItem[];
  subtotalLabel: string;
  name: string;
  email: string;
  address: string;
}) {
  const lines = input.items.map((item) => `- ${item.title} x ${item.quantity}`).join("\n");
  return `Namaste Manisha ji, I would like to confirm this order request.\n\nReference: ${input.reference}\nItems:\n${lines}\nEstimated subtotal: ${input.subtotalLabel}\n\nName: ${input.name}\nEmail: ${input.email || "Not provided"}\nDelivery address: ${input.address}\n\nPlease confirm availability, shipping, final amount, and payment instructions.`;
}

export function purchaseWhatsAppMessage(input: {
  reference: string;
  kind: "product" | "course";
  item: string;
  total: string;
  name: string;
  email: string;
  details?: string;
}) {
  return `Namaste Manisha ji, I would like to confirm my ${input.kind === "course" ? "enrollment request" : "order"}:\n\nOrder ID: ${input.reference}\nItem: ${input.item}\nTotal: ${input.total}\n\nName: ${input.name}\nEmail: ${input.email}${input.details ? `\n${input.details}` : ""}\n\nPlease share the next steps.`;
}

export function sessionWhatsAppMessage(input: { title: string; date: string; time: string; format: string; reference: string }) {
  return `Namaste Manisha ji, I have requested a booking:\n\nSession: ${input.title}\nDate/Time: ${input.date} at ${input.time} IST\nFormat: ${input.format}\nBooking ref: ${input.reference}\n\nPlease confirm.`;
}
