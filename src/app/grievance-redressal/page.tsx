import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Grievance Redressal",
  description: "How to raise and escalate a consumer or privacy grievance with Manisha Belvalkar.",
  alternates: { canonical: "/grievance-redressal" },
};

const sections: LegalSection[] = [
  { title: "Grievance officer", paragraphs: ["Grievance Officer: Dr. Manisha Belvalkar", "Email: manishabelvalkar@gmail.com", "Phone: +91 99222 46111", "Postal address: 501, New Pushpanjali, Prabhadevi, Mumbai 400028, Maharashtra, India"] },
  { title: "What you may report", items: ["An order, delivery, return, refund, payment, booking, or service concern.", "A website, account, authentication, accessibility, or security issue.", "A question about personal information, consent, correction, erasure, or suspected misuse.", "Content, intellectual-property, misleading-information, conduct, or another consumer concern."] },
  { title: "Information to include", items: ["Your name and a reliable email address or phone number.", "Order, booking, account, or transaction reference where applicable.", "A concise description of the issue, relevant dates, and the resolution you are seeking.", "Supporting screenshots, receipts, delivery images, or correspondence. Do not send passwords, PINs, CVVs, or one-time passwords."] },
  { title: "Response process", paragraphs: ["We aim to acknowledge a consumer grievance within 48 hours of receipt and resolve it within one month. Some matters involving a bank, carrier, platform, evidence review, or another third party may require additional coordination; if so, we will communicate the available status and next steps."], items: ["A reference may be assigned so that the matter can be tracked.", "We may request reasonable identity or transaction verification before disclosing account information or making a change.", "Urgent account-security or privacy concerns are prioritised according to risk."] },
  { title: "Escalation", paragraphs: ["If the initial response does not resolve the matter, reply to the same email thread with the grievance reference and the word ‘Escalation’ in the subject. This internal process does not limit any right available to you under applicable consumer or data-protection law."] },
];

export default function GrievancePage() {
  return <LegalPage eyebrow="Customer care" title="Grievance redressal" introduction="We take consumer, account, and privacy concerns seriously. This page explains where to write, what to include, and what response timeline to expect." sections={sections} />;
}
