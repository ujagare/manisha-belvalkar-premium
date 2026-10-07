import Link from "next/link";
import { ArrowRight, MessageCircle, Moon } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SacredSectionBackdrop from "@/components/home/SacredSectionBackdrop";

const faqs = [
  {
    question: "Which session should I start with?",
    answer:
      "If you want clarity around a present question, begin with a Tarot consultation. If you want deeper direction, choose Soul Purpose Reading or mentoring.",
  },
  {
    question: "Can I book if I am outside Mumbai or Pune?",
    answer:
      "Yes. Many offerings are available online through WhatsApp, Zoom or distance healing, so you can receive guidance from anywhere.",
  },
  {
    question: "Are Tarot readings predictive or guidance based?",
    answer:
      "The readings are designed for clarity, self-understanding and conscious choices. They help you understand patterns and take grounded next steps.",
  },
  {
    question: "How do I confirm my booking?",
    answer:
      "Choose the offering you want, share your details and continue on WhatsApp. The final timing and payment confirmation happen directly with the team.",
  },
  {
    question: "Can I gift a deck, ritual or session?",
    answer:
      "Yes. Shop items and selected sessions can be gifted. Mention it while enquiring so the packaging or booking can be arranged with care.",
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
    <section className="relative overflow-hidden bg-[#211815] py-24 text-white lg:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <SacredSectionBackdrop motif="petals" className="opacity-[0.12]" />
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('/images/page-heroes/mentoring-hero.png')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(28,25,23,0.98)_0%,rgba(44,28,24,0.92)_46%,rgba(107,11,11,0.72)_100%)]" />
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <div>
                <div className="eyebrow mb-5 flex items-center gap-4 text-gold-light">
                  <span className="hairline-gold w-10" />
                  Premium FAQ
                </div>
                <h2 className="font-display text-4xl font-bold leading-[1.04] text-white sm:text-5xl lg:text-6xl">
                  Before you begin,{" "}
                  <span className="text-gold-shimmer">feel clear</span>
                </h2>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-white/68 sm:text-lg">
                  A refined guide to sessions, online bookings, gifts and sacred
                  tools before you choose your next step.
                </p>
              </div>

              <div className="mt-10 overflow-hidden rounded-[2rem] border border-gold/25 bg-white/[0.08] shadow-[0_35px_90px_-45px_rgba(0,0,0,0.75)] backdrop-blur-xl">
                <div className="relative min-h-[320px] bg-[url('/images/candle.jpg')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/45 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold-light backdrop-blur-md">
                      <Moon className="h-4 w-4" />
                      Gentle first step
                    </div>
                    <p className="font-display text-2xl font-bold leading-tight text-white">
                      Not sure what to book?
                    </p>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/72">
                      Share your intention and the team will guide you toward
                      the right session, ritual or shop item.
                    </p>
                  </div>
                </div>

                <div className="grid divide-y divide-gold/15 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  <Link
                    href="/contact"
                    className="group flex items-center justify-between gap-4 p-5 text-sm font-semibold text-gold-light transition-colors hover:bg-white/[0.06] hover:text-gold"
                  >
                    Ask before booking
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/products"
                    className="group flex items-center justify-between gap-4 p-5 text-sm font-semibold text-white/78 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    Explore the shop
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.07] shadow-[0_40px_110px_-60px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/12 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.24em] text-gold-light">
                <MessageCircle className="h-4 w-4" />
                Asked often
              </div>
              <span className="hidden text-xs uppercase tracking-[0.22em] text-white/38 sm:inline">
                Clear answers
              </span>
            </div>

            {faqs.map((item, index) => (
              <Reveal key={item.question} delay={index * 0.07}>
                <article className="group grid gap-4 border-b border-white/10 px-5 py-6 transition-colors duration-300 last:border-b-0 hover:bg-white/[0.045] sm:grid-cols-[4.5rem_1fr] sm:gap-6 sm:px-7 sm:py-7">
                  <div className="flex items-center gap-3 sm:block">
                    <span className="font-display text-3xl font-bold text-gold/80 sm:text-4xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-12 bg-gradient-to-r from-gold/70 to-transparent sm:mt-3 sm:block" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold leading-snug text-white transition-colors duration-300 group-hover:text-gold-light sm:text-2xl">
                      {item.question}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/64 sm:text-base">
                      {item.answer}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 flex justify-end lg:col-start-2">
            <Link href="/faq" className="group inline-flex items-center gap-2 text-sm font-semibold text-gold-light transition-colors hover:text-gold">
              Browse all questions
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
