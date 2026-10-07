export type InsightCategory = "Foundations" | "Self-reflection" | "Preparation" | "Everyday practice";

export interface InsightSection {
  heading: string;
  paragraphs: string[];
  points?: string[];
}

export interface InsightArticle {
  slug: string;
  title: string;
  description: string;
  category: InsightCategory;
  readTime: string;
  image: string;
  imageAlt: string;
  introduction: string;
  sections: InsightSection[];
  takeaway: string;
  relatedHref: string;
  relatedLabel: string;
}

export const insightCategories: Array<"All" | InsightCategory> = [
  "All",
  "Foundations",
  "Self-reflection",
  "Preparation",
  "Everyday practice",
];

export const insights: InsightArticle[] = [
  {
    slug: "choosing-the-right-spiritual-guidance-session",
    title: "How to choose the right guidance session for you",
    description: "A grounded way to match your present question with the kind of support you are seeking.",
    category: "Preparation",
    readTime: "6 min read",
    image: "/images/page-heroes/services-hero.png",
    imageAlt: "A quiet consultation space prepared for reflection",
    introduction: "A useful session begins before the appointment. Being clear about what you want to explore helps you choose an offering with realistic expectations and arrive ready to participate in the process.",
    sections: [
      {
        heading: "Begin with the question, not the method",
        paragraphs: ["You do not need to know every difference between Tarot, mentoring, energy work, or a soul-purpose reading. Start by naming the area that feels unclear: a decision, a repeating pattern, emotional wellbeing, direction, or a wish for deeper self-understanding."],
        points: ["What would I like more clarity about?", "Do I want a single reflective conversation or ongoing support?", "Am I looking for insight, a practice, or both?"],
      },
      {
        heading: "Know what a session can and cannot do",
        paragraphs: ["Spiritual guidance can offer reflection, language for an experience, and practices for personal exploration. It does not replace medical, mental-health, legal, or financial care, and it cannot guarantee a particular outcome.", "A responsible practitioner should leave room for your agency. You remain the person making decisions about your life."],
      },
      {
        heading: "Choose the level of support",
        paragraphs: ["A focused consultation may suit one clear question. Mentoring can be more appropriate when you want continuity, accountability, and space to work with a theme over time. A workshop may suit those who value shared learning and a defined topic."],
      },
      {
        heading: "Ask before you book",
        paragraphs: ["Confirm the format, duration, price, preparation, cancellation terms, and whether the session is private or group-based. If you are uncertain, send a short enquiry describing what you hope to explore; personal or clinical details are not necessary at this stage."],
      },
    ],
    takeaway: "The right starting point is the offering that fits your current question, preferred level of support, and practical boundaries.",
    relatedHref: "/how-it-works",
    relatedLabel: "See how bookings work",
  },
  {
    slug: "chakra-reflection-without-self-diagnosis",
    title: "A grounded approach to chakra reflection",
    description: "Use chakra language as a reflective framework without turning it into a diagnosis or promise.",
    category: "Foundations",
    readTime: "7 min read",
    image: "/images/chakra.png",
    imageAlt: "Colourful chakra-inspired artwork used as a reflective symbol",
    introduction: "Chakra traditions offer a symbolic vocabulary for noticing themes in our lives. The most responsible way to work with that vocabulary is as an invitation to reflect—not as a medical test, fixed label, or explanation for every difficulty.",
    sections: [
      {
        heading: "Treat the framework as a lens",
        paragraphs: ["A lens helps you notice; it does not deliver a clinical conclusion. You might use a chakra theme to ask about safety, expression, relationships, confidence, or meaning while staying open to other explanations and forms of support."],
      },
      {
        heading: "Notice patterns with curiosity",
        paragraphs: ["Instead of deciding that a chakra is ‘blocked’, describe what you actually observe. Specific language keeps reflection useful and avoids turning a temporary experience into an identity."],
        points: ["What situations bring this feeling forward?", "What changes in my body, thoughts, or behaviour?", "What already helps me feel steadier?", "Is there practical or professional support I may need?"],
      },
      {
        heading: "Pair symbolism with ordinary care",
        paragraphs: ["Rest, nourishing food, movement appropriate for your body, supportive relationships, and qualified healthcare remain important. A reflective ritual can sit alongside these foundations; it should not be used to delay care."],
      },
      {
        heading: "Keep the practice gentle",
        paragraphs: ["Short journaling, calm breathing, colour contemplation, or a quiet walk may be enough. Stop any practice that causes distress or physical discomfort and seek appropriate professional guidance when needed."],
      },
    ],
    takeaway: "Chakra reflection is most helpful when it expands curiosity, respects uncertainty, and stays connected to everyday care.",
    relatedHref: "/healing",
    relatedLabel: "Explore wellbeing offerings",
  },
  {
    slug: "preparing-for-a-tarot-consultation",
    title: "Preparing for a Tarot consultation",
    description: "Thoughtful questions, realistic expectations, and a simple way to retain what feels useful.",
    category: "Preparation",
    readTime: "5 min read",
    image: "/images/tarot.jpg",
    imageAlt: "Tarot cards arranged on a cloth for a consultation",
    introduction: "You do not need special knowledge to attend a Tarot consultation. A little preparation can help the conversation stay focused and make it easier to distinguish meaningful reflection from the pressure to find certainty.",
    sections: [
      {
        heading: "Frame open, useful questions",
        paragraphs: ["Questions that invite perspective tend to create a richer conversation than questions that demand a fixed prediction."],
        points: ["What am I not seeing clearly in this situation?", "What can I learn from this repeating pattern?", "What choices and boundaries are available to me?", "What deserves my attention next?"],
      },
      {
        heading: "Bring context, protect your privacy",
        paragraphs: ["Share enough background for the question to make sense, but do not feel obliged to reveal sensitive information. You can set a boundary around any subject and decline to discuss it."],
      },
      {
        heading: "Leave room for your own judgment",
        paragraphs: ["Cards can support reflection; they do not remove uncertainty or make decisions for you. For health, legal, financial, or safety concerns, speak with an appropriately qualified professional."],
      },
      {
        heading: "After the session",
        paragraphs: ["Write down two or three observations that felt relevant and one small action you want to consider. Revisit them after a few days. You do not need to act on every idea immediately."],
      },
    ],
    takeaway: "Come with a theme, ask open questions, keep your agency, and carry forward only what supports considered action.",
    relatedHref: "/services/tarot-consultation-60",
    relatedLabel: "View Tarot consultation",
  },
  {
    slug: "building-a-simple-daily-reflection-practice",
    title: "A simple daily reflection practice that can last",
    description: "A quiet ten-minute rhythm for noticing, writing, and choosing one intentional next step.",
    category: "Everyday practice",
    readTime: "4 min read",
    image: "/images/candle.jpg",
    imageAlt: "A lit candle beside a journal in a calm room",
    introduction: "A sustainable practice does not need to be elaborate. Consistency is often easier when the ritual is short, specific, and flexible enough to fit an ordinary day.",
    sections: [
      {
        heading: "Create a small container",
        paragraphs: ["Choose a familiar time and a place where you can sit safely for ten minutes. A notebook and pen are enough. A candle or other object can mark the transition, but it is optional."],
      },
      {
        heading: "Use three prompts",
        paragraphs: ["Write briefly without trying to produce a perfect answer."],
        points: ["What am I noticing right now?", "What feels important beneath the noise?", "What is one kind, practical next step?"],
      },
      {
        heading: "End with orientation",
        paragraphs: ["Look around the room, feel your feet supported, and return your attention to the day ahead. Reflection should help you re-enter daily life, not disconnect from it."],
      },
      {
        heading: "Adapt instead of abandoning",
        paragraphs: ["On a busy day, write one sentence. If stillness feels uncomfortable, reflect while walking. If journaling repeatedly increases distress, pause and consider support from a qualified mental-health professional."],
      },
    ],
    takeaway: "Make the practice small enough to repeat and useful enough to return to: notice, name, and choose one next step.",
    relatedHref: "/products",
    relatedLabel: "Explore reflective tools",
  },
];

export function getInsight(slug: string) {
  return insights.find((article) => article.slug === slug);
}
