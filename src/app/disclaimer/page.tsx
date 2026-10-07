import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important limitations relating to spiritual guidance, Tarot, healing, mentoring, and wellbeing content.",
  alternates: { canonical: "/disclaimer" },
};

const sections: LegalSection[] = [
  { title: "Purpose of the offerings", paragraphs: ["Tarot readings, spiritual mentoring, soul-purpose guidance, astrology, numerology, Vastu, Goddess practices, energy work, Chakra practices, courses, and related content are offered for personal reflection, spiritual exploration, education, and general wellbeing support."] },
  { title: "Not professional advice or treatment", items: ["The offerings do not diagnose, treat, cure, or prevent any physical or mental-health condition.", "They do not replace a doctor, psychologist, psychiatrist, counsellor, lawyer, accountant, financial adviser, or other appropriately licensed professional.", "Do not delay or discontinue professional care, medication, treatment, or emergency assistance because of anything on this website or in a session."] },
  { title: "Emergencies and safety", paragraphs: ["This website is not an emergency or crisis service. If you or another person may be in immediate danger, contact local emergency services or a qualified crisis or healthcare provider immediately. Energy-healing and wellbeing practices should be adapted or avoided where a qualified professional advises that they are unsuitable for you."] },
  { title: "No guaranteed outcome", paragraphs: ["Experiences and interpretations are subjective. No specific prediction, relationship, health, fertility, legal, financial, career, business, spiritual, or other outcome is promised or guaranteed. Testimonials describe individual experiences and should not be read as typical or assured results."] },
  { title: "Personal responsibility", paragraphs: ["You remain responsible for your choices, actions, wellbeing, and use of any information or practice. Consider your circumstances, seek professional advice where appropriate, and do not make a major medical, legal, financial, or safety decision solely on the basis of spiritual guidance or website content."] },
  { title: "Products and practices", paragraphs: ["Oracle cards, ritual items, crystals, books, meditations, attunements, and similar products or practices are not medical devices or guaranteed remedies. Product descriptions refer to traditional, spiritual, symbolic, or intended uses unless expressly stated otherwise."] },
  { title: "External links and information", paragraphs: ["External websites, social platforms, maps, payment services, and third-party materials are provided for convenience. We do not control their availability, security, accuracy, or privacy practices. References and website content may change and should not be treated as a substitute for current professional advice."] },
  { title: "Questions", paragraphs: ["If you are unsure whether an offering is appropriate for you, contact us before booking at manishabelvalkar@gmail.com or +91 99222 46111. By proceeding, you confirm that you understand the nature and limitations stated on this page."] },
];

export default function DisclaimerPage() {
  return <LegalPage eyebrow="Important information" title="Guidance and wellbeing disclaimer" introduction="Please read these limitations before relying on website content or booking a spiritual, healing, mentoring, or wellbeing offering." sections={sections} />;
}
