import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Manisha Belvalkar collects, uses, protects, and manages personal information.",
  alternates: { canonical: "/privacy-policy" },
};

const sections: LegalSection[] = [
  {
    title: "Information we collect",
    paragraphs: ["We collect only the information reasonably needed to respond to you, provide an account, record an order or booking, and deliver the service you request."],
    items: [
      "Identity and contact details, such as your name, email address, phone number, and city.",
      "Account and authentication information when you sign up with email or Google.",
      "Booking, order, course, product, and communication details that you choose to provide.",
      "Basic technical information such as browser, device, security logs, and necessary cookie data.",
      "Assessment answers or wellbeing information that you voluntarily submit. Please avoid sharing medical records or highly sensitive information unless specifically requested through a secure channel.",
    ],
  },
  {
    title: "How we use information",
    items: [
      "To create and secure your account and maintain your signed-in session.",
      "To respond to enquiries and coordinate bookings, payments, delivery, or support.",
      "To maintain order history, prevent misuse, troubleshoot problems, and improve the website.",
      "To send service-related messages. Promotional messages will be sent only where permitted and may be opted out of.",
      "To meet legal, accounting, fraud-prevention, and grievance-handling obligations.",
    ],
  },
  {
    title: "Consent and your choices",
    paragraphs: [
      "Where processing is based on your consent, the request will identify the information and purpose in clear language. You may withdraw consent by contacting us. Withdrawal does not affect processing already completed and may limit our ability to provide a requested service.",
      "You may choose not to provide optional information. Fields required for an account, order, or booking must be provided for that feature to work.",
    ],
  },
  {
    title: "Service providers and sharing",
    paragraphs: ["We do not sell personal information. Information may be shared only as needed with service providers working on our behalf or where disclosure is required by law."],
    items: [
      "Supabase for authentication and database services.",
      "Hosting, website security, analytics, email, and technical service providers used to operate the website.",
      "Google, if you choose Google sign-in, subject to Google's own privacy practices.",
      "WhatsApp/Meta when you choose to continue a conversation or booking on WhatsApp.",
      "Razorpay when you choose online payment; payment credentials are entered into Razorpay's checkout and are not stored by this website.",
      "Payment, delivery, professional advisers, or government authorities where relevant and lawful.",
    ],
  },
  {
    title: "Cookies and security",
    paragraphs: [
      "The website uses cookies or similar storage needed for sign-in, session security, preferences, and reliable operation. If optional analytics or advertising cookies are introduced, an appropriate consent choice will be provided where required.",
      "We use reasonable administrative and technical safeguards, but no internet transmission or storage system can be guaranteed completely secure. Please use a strong password and do not share it.",
    ],
  },
  {
    title: "Retention and deletion",
    paragraphs: ["We retain information only for as long as needed for the purpose collected, account operation, support, legitimate business records, dispute resolution, and applicable legal requirements. Data that is no longer required is deleted or anonymised where reasonably possible."],
  },
  {
    title: "Your rights",
    items: [
      "Ask for a summary of personal information being processed and relevant processing activities.",
      "Request correction, completion, updating, or erasure of personal information, subject to lawful retention requirements.",
      "Withdraw consent and raise a grievance about how personal information is handled.",
      "Nominate another individual to exercise applicable rights in the event of death or incapacity, where provided by law.",
    ],
  },
  {
    title: "Children and external services",
    paragraphs: [
      "This website and its paid offerings are not directed to children. A parent or lawful guardian should contact us before providing information about a person under 18.",
      "Links to WhatsApp, Google, maps, social platforms, or other external services are governed by those providers' policies. Review them before submitting information.",
    ],
  },
  {
    title: "Contact and grievance",
    paragraphs: ["For privacy questions, correction, withdrawal, account deletion, or a grievance, email manishabelvalkar@gmail.com or call +91 99222 46111. You may also use the details on our Grievance Redressal page."],
  },
];

export default function PrivacyPolicyPage() {
  return <LegalPage eyebrow="Privacy & data" title="Privacy policy" introduction="This policy explains what personal information we collect, why we use it, who may process it, and the choices available to you." sections={sections} />;
}
