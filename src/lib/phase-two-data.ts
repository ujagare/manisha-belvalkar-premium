export interface FaqItem {
  category: "Bookings" | "Sessions" | "Courses" | "Shop" | "Account";
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  { category: "Bookings", question: "Which session should I start with?", answer: "Choose a Tarot consultation for clarity around a present question. Choose Soul Purpose Reading or mentoring when you want deeper direction, recurring-pattern work, or ongoing support. If you remain unsure, contact the team before booking." },
  { category: "Bookings", question: "How is a booking confirmed?", answer: "Select an offering, sign in, submit the booking request, and continue on WhatsApp. A booking is confirmed only after the team agrees the date, time, format, fee, and payment details with you." },
  { category: "Bookings", question: "Can I reschedule or cancel?", answer: "A private session may normally be rescheduled once with at least 24 hours' notice, subject to availability. Other timelines and refund conditions are explained in the Refund and Cancellation Policy." },
  { category: "Sessions", question: "Can I join from outside Mumbai or Pune?", answer: "Yes. Many Tarot, mentoring, healing, and workshop offerings are available online through an agreed video or communication platform. The format is confirmed before payment." },
  { category: "Sessions", question: "Are Tarot readings predictive?", answer: "Readings are offered as reflective guidance for self-understanding, patterns, choices, and grounded next steps. They do not guarantee a future outcome and do not replace professional medical, legal, financial, or psychological advice." },
  { category: "Sessions", question: "How should I prepare for a session?", answer: "Choose a quiet private space, keep your questions or intention nearby, join on time, and avoid recording unless everyone has expressly agreed. For healing work, follow any preparation guidance shared by the team." },
  { category: "Sessions", question: "Are sessions confidential?", answer: "Personal information and session coordination are handled with care and used for the requested service. Legal, safety, platform, and record-keeping limitations are described in the Privacy Policy and Terms." },
  { category: "Courses", question: "Do courses include live guidance or recordings?", answer: "The format differs by course. The course page and confirmation message will state whether an offering is live, recorded, cohort-based, or includes supporting material. Ask before payment if a required detail is not listed." },
  { category: "Courses", question: "Can course access be shared?", answer: "No. Course access and material are personal and may not be shared, copied, recorded, resold, or redistributed without written permission." },
  { category: "Shop", question: "Can I gift a deck, ritual item, or session?", answer: "Yes, selected products and sessions can be gifted. Mention the recipient and occasion while enquiring so availability, packaging, delivery, or booking details can be confirmed." },
  { category: "Shop", question: "When will a physical order arrive?", answer: "In-stock products are normally prepared within 2–5 business days, with estimated delivery in India generally 5–10 business days after dispatch. Carrier and destination delays can occur." },
  { category: "Shop", question: "What if an item arrives damaged or incorrect?", answer: "Contact the team within 48 hours of delivery with the order reference, shipping label, packaging photographs, product photographs, and an unedited unboxing video where available." },
  { category: "Account", question: "Why do I need an account to place a request?", answer: "An account securely associates booking and order requests with you, helps prevent misuse, and lets you view the request status from My Account." },
  { category: "Account", question: "Where can I see my order or booking status?", answer: "Sign in, open My Account, and select an order or booking. The detail page shows its reference, current stage, amount where applicable, and the appropriate next step." },
  { category: "Account", question: "How can I correct or delete my information?", answer: "Contact the privacy/grievance email from your registered email address. Reasonable verification may be required before account information is corrected, disclosed, or deleted." },
];

export interface EventOffering {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  format: string;
  duration: string;
  image: string;
  audience: string[];
  includes: string[];
  preparation: string[];
}

export const eventOfferings: EventOffering[] = [
  {
    slug: "online-guidance-session",
    title: "Online guidance session",
    eyebrow: "Private live experience",
    description: "A focused online conversation shaped around your present question, pattern, or intention, with the offering selected in consultation with the team.",
    format: "Live · One-to-one · Online",
    duration: "Duration depends on the selected offering",
    image: "/images/page-heroes/live-hero.png",
    audience: ["You want private guidance from another city or country", "You need clarity around a present decision or recurring pattern", "You prefer a live conversation over self-paced material"],
    includes: ["Pre-session confirmation of the offering and format", "A private live session at the agreed time", "Practical next steps or practices where relevant"],
    preparation: ["Keep a quiet, private space and reliable connection", "Write down the main question or intention", "Join five minutes early and do not record without permission"],
  },
  {
    slug: "live-online-workshop",
    title: "Live online workshop",
    eyebrow: "Small-group learning",
    description: "An interactive group workshop exploring Tarot, Shakti, healing, or self-development through teaching, guided practice, and shared reflection.",
    format: "Live · Group · Online",
    duration: "Schedule announced with each workshop",
    image: "/images/page-heroes/community-hero.png",
    audience: ["You learn best through guided, live practice", "You want to explore a focused spiritual or self-development theme", "You value a small-group experience and shared questions"],
    includes: ["Live teaching around the announced theme", "Guided practice, reflection, or demonstration", "Question time where the workshop format allows"],
    preparation: ["Review the confirmed date, time, and platform", "Keep a notebook and any materials listed in the confirmation", "Join from a quiet place and respect group confidentiality"],
  },
];

export const journeySteps = [
  { number: "01", title: "Choose your direction", description: "Explore sessions, healing, courses, products, or a live experience. Use the FAQ or contact the team if you are unsure." },
  { number: "02", title: "Review the details", description: "Read the format, duration, price or enquiry terms, preparation notes, disclaimer, and relevant cancellation or delivery policy." },
  { number: "03", title: "Submit your request", description: "Sign in, confirm the item, accept the applicable policies, and create a secure booking or order request." },
  { number: "04", title: "Confirm on WhatsApp", description: "The team verifies availability, timing, delivery, fee, and payment instructions through the official contact channel." },
  { number: "05", title: "Receive and prepare", description: "Attend the confirmed session, begin the course, or track the product delivery using the guidance shared with you." },
  { number: "06", title: "Get continued support", description: "View request status in My Account and contact Support with the reference if you need help, rescheduling, or escalation." },
];
