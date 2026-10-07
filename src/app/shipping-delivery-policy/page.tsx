import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Shipping and Delivery Policy",
  description: "Dispatch, delivery, tracking, and damaged parcel information for physical products.",
  alternates: { canonical: "/shipping-delivery-policy" },
};

const sections: LegalSection[] = [
  { title: "Where we deliver", paragraphs: ["Physical products are currently delivered within serviceable locations in India. International shipping is available only when expressly confirmed before payment. Digital courses, consultations, and online sessions are delivered electronically and do not incur physical shipping."] },
  { title: "Processing and dispatch", items: ["In-stock orders are normally prepared for dispatch within 2–5 business days after payment confirmation.", "Weekends, public holidays, made-to-order items, personalisation, blessing or preparation rituals, launches, and high-demand periods may require additional time.", "If an item cannot be fulfilled within a reasonable period, we will contact you with a revised estimate, alternative, or cancellation option."] },
  { title: "Delivery estimates and charges", paragraphs: ["Estimated transit within India is generally 5–10 business days after dispatch, depending on the destination and carrier. These are estimates rather than guaranteed dates. The applicable shipping charge, if any, will be communicated before the order is confirmed."], items: ["Remote-area, weather, carrier, security, holiday, or regulatory delays may extend delivery.", "Any customs duty, import tax, or local charge for a specifically approved international shipment is the recipient's responsibility unless agreed otherwise in writing."] },
  { title: "Address and delivery attempts", items: ["Provide a complete address, landmark where useful, PIN code, and reachable phone number.", "Contact us immediately if an address needs correction. A change may not be possible after dispatch.", "Additional shipping cost caused by an incorrect address, refusal, repeated failed delivery, or an unclaimed parcel may be charged before redispatch.", "Delivery is treated as completed when the carrier records delivery at the address or to an authorised recipient."] },
  { title: "Tracking", paragraphs: ["Where the carrier provides tracking, the details will be shared by email, WhatsApp, or another confirmed channel after dispatch. Tracking may take up to 48 hours to show movement. Contact us if there is no update for an unusual period."] },
  { title: "Damage, shortage, or wrong item", items: ["Inspect the package promptly and retain all outer and inner packaging.", "Report visible damage, a shortage, or a wrong item within 48 hours of delivery.", "Send the order reference, shipping label, clear photographs, and an unedited unboxing video where available.", "After verification, we may arrange a replacement, missing-item dispatch, credit, or refund in line with the Refund and Cancellation Policy."] },
  { title: "Lost or returned parcels", paragraphs: ["If tracking suggests a parcel is lost, we will raise an enquiry with the carrier. Replacement or refund is considered after the carrier confirms the outcome. Parcels returned to us may be redispatched after address confirmation and payment of any applicable second-shipping charge, unless the return resulted from our error."] },
  { title: "Contact", paragraphs: ["For delivery support, email manishabelvalkar@gmail.com or call/WhatsApp +91 99222 46111 with your order reference. Never share a payment PIN, CVV, password, or one-time password with anyone claiming to arrange delivery."] },
];

export default function ShippingPolicyPage() {
  return <LegalPage eyebrow="Orders & fulfilment" title="Shipping and delivery policy" introduction="This policy covers the preparation, dispatch, tracking, and delivery of physical products purchased from Manisha Belvalkar." sections={sections} />;
}
