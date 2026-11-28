import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Which session should I start with?",
    answer:
      "If you want clarity around a present question, begin with a Tarot consultation. If you want deeper direction, choose Soul Purpose Reading or mentoring.",
  },
  {
    question: "Can I book if I am outside Mumbai or Pune?",
    answer:
      "Yes. Many offerings are available online through private video room, WhatsApp, or distance healing, so you can receive guidance from anywhere.",
  },
  {
    question: "Are Tarot readings predictive or guidance based?",
    answer:
      "The readings are designed for clarity, self-understanding, and conscious choices. They help you understand patterns and take grounded next steps.",
  },
  {
    question: "How do I confirm my booking?",
    answer:
      "Choose your offering, complete secure checkout or share your details on WhatsApp, and receive immediate confirmation along with preparation notes.",
  },
  {
    question: "Can I gift a deck, ritual or session?",
    answer:
      "Yes. Shop items and selected sessions can be gifted. Mention it while ordering so gift-ready sacred packaging or scheduling can be arranged.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function HomeFAQ() {
  return (
    <section className="border-t border-white/10 bg-[#1c1917] py-10 text-[#fdf8f0] sm:py-16 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs text-[#b8afa2] sm:text-sm">Common questions</p>
            <h2 className="mt-2 font-display text-[1.75rem] font-medium leading-[1.1] tracking-[-0.02em] text-[#fdf8f0] sm:text-4xl">
              Before you begin, feel clear
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#b8afa2] sm:text-base sm:leading-7">
              Clear answers on consultations, online sessions, gifting, and sacred tools before you choose your next step.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-7 sm:gap-3">
              <Link
                href="/faq"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-xs font-medium text-white transition-colors duration-150 hover:bg-primary-dark sm:h-11 sm:px-5 sm:text-sm"
              >
                Ask before booking
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
              <Link
                href="/products"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 text-xs font-medium text-[#fdf8f0] transition-colors duration-150 hover:bg-white/10 sm:h-11 sm:px-5 sm:text-sm"
              >
                Explore shop
              </Link>
            </div>
          </div>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {faqs.map((item, index) => (
              <details
                key={item.question}
                open={index === 0}
                className="group py-3.5 sm:py-5"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
                  <div className="flex items-baseline gap-3 sm:gap-5">
                    <span className="font-mono text-xs tabular-nums text-[#b8afa2]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-base font-medium leading-snug text-[#fdf8f0] transition-colors duration-150 group-hover:text-gold-light sm:text-xl">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className="mt-1 h-4 w-4 shrink-0 text-[#b8afa2] transition-transform duration-150 group-open:rotate-180"
                    strokeWidth={1.5}
                  />
                </summary>
                <p className="mt-2.5 pl-7 text-sm leading-6 text-[#c7bfb2] sm:pl-10 sm:text-base sm:leading-7">
                  {item.answer}
                </p>
              </details>
            ))}

            <div className="flex justify-end pt-4 sm:pt-5">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-xs font-medium text-[#e6dfd4] transition-colors duration-150 hover:text-gold-light sm:text-sm"
              >
                Browse all questions
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
