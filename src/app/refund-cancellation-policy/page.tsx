import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy",
  description: "Cancellation, rescheduling, return, and refund rules for sessions, courses, and products.",
  alternates: { canonical: "/refund-cancellation-policy" },
};

const sections: LegalSection[] = [
  { title: "Before you request a refund", paragraphs: ["Contact us promptly with your order or booking reference, registered email or phone number, the item or service concerned, and a clear reason. Eligibility depends on the type of purchase and the stage of fulfilment described below."] },
  { title: "Private sessions and consultations", items: ["A confirmed session may be rescheduled once without charge when at least 24 hours' notice is given, subject to availability.", "Cancellations made at least 24 hours before the confirmed start time may be considered for a refund after deducting any non-recoverable payment charges disclosed to you.", "Cancellations within 24 hours, late arrival, or non-attendance are normally non-refundable because the time was reserved exclusively for you.", "If we must cancel a session, you may choose a new date or a full refund of the amount paid for that session."] },
  { title: "Live workshops and group programmes", items: ["Cancellation terms stated on a workshop or programme page take priority where they are more specific.", "Unless stated otherwise, cancellation at least 72 hours before the start may be considered for a refund or transfer.", "After a live programme begins, missed sessions and partial attendance are not refundable. A recording or alternate batch may be offered when available, but is not guaranteed."] },
  { title: "Digital courses and downloads", items: ["Digital purchases are generally non-refundable once login access, a download, a recording, or substantial course material has been supplied.", "Contact us if access was not delivered, the file is materially defective, or a duplicate payment occurred. We will verify and provide access, replacement, credit, or refund as appropriate.", "A change of mind after digital access has been provided does not normally qualify for a refund."] },
  { title: "Physical products", items: ["Report a wrong, damaged, defective, or missing item within 48 hours of delivery and include the order reference, unboxing photographs or video, packaging, and product images.", "For an eligible change-of-mind return, contact us within 7 days of delivery. The product must be unused, unopened where sealed, complete, and in original saleable packaging.", "Personalised, consecrated, blessed, made-to-order, used, opened, damaged-after-delivery, or downloadable items cannot normally be returned unless defective or incorrectly supplied.", "Return shipping is normally paid by the customer for change-of-mind returns. We bear reasonable return or replacement cost where we supplied a wrong or verified defective item."] },
  { title: "Refund method and timing", paragraphs: ["Approved refunds are initiated to the original payment method wherever possible. Processing is normally initiated within 7 business days after approval or receipt and inspection of a returned product. Banks and payment providers may require additional time, commonly 5–10 business days, to show the credit."], items: ["Original delivery charges and payment fees are not refundable for a change-of-mind return unless required by law.", "For cash, bank transfer, or another manual payment, we may ask for verified account details through a secure channel."] },
  { title: "How to request help", paragraphs: ["Email manishabelvalkar@gmail.com or WhatsApp/call +91 99222 46111. Include your order or booking reference and do not send bank passwords, PINs, CVVs, or one-time passwords. If the matter is not resolved, use the Grievance Redressal page."] },
];

export default function RefundPolicyPage() {
  return <LegalPage eyebrow="Returns & cancellations" title="Refund and cancellation policy" introduction="This policy explains when a session may be rescheduled, when a product may be returned, and how an approved refund is processed." sections={sections} />;
}
