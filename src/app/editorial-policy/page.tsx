import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: "How Manisha Belvalkar's educational and reflective website content is written, reviewed, corrected, and kept within responsible boundaries.",
  alternates: { canonical: "/editorial-policy" },
};

const principles = [
  ["Purpose", "Insights are educational and reflective. They are intended to help readers prepare questions and explore personal themes, not to diagnose, prescribe, predict guaranteed outcomes, or replace qualified care."],
  ["Authorship and review", "Articles are published under Dr. Manisha Belvalkar's name and reflect her professional experience in spiritual mentoring and holistic wellbeing. Service-specific statements are checked against the offerings described on this website."],
  ["Health and safety boundaries", "We avoid presenting spiritual or energy practices as medical treatment. When a subject touches health, mental health, safety, law, or finance, readers are directed to appropriately qualified professionals."],
  ["Evidence and tradition", "We distinguish reflective or traditional spiritual frameworks from established clinical evidence. Symbolic language is presented as a lens for self-inquiry, not as fact about a reader's condition."],
  ["Corrections", "We correct material factual errors and clarify wording that could be misunderstood. To flag a concern, use the contact page and include the article title and the passage in question."],
  ["Commercial transparency", "An insight may link to a relevant session, course, or product on this website. These links are clearly presented and do not change the educational boundaries of the article."],
  ["Privacy", "We do not publish an identifiable client story or testimonial without appropriate permission. Examples in educational articles are kept general and do not disclose private session information."],
];

export default function EditorialPolicyPage() {
  return (
    <div className="bg-cream px-6 pb-24 pt-32 lg:px-10 lg:pt-40">
      <div className="mx-auto max-w-5xl">
        <Link href="/insights" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft className="h-4 w-4" />Back to insights</Link>
        <header className="mt-10 max-w-3xl"><p className="eyebrow text-gold-deep">Trust &amp; transparency</p><h1 className="mt-5 text-balance font-display text-5xl font-bold tracking-tight text-charcoal sm:text-7xl">Editorial policy</h1><p className="mt-6 text-pretty text-lg leading-8 text-warmgray">The standards used for educational and reflective content published on this website.</p></header>
        <div className="mt-14 border-t border-parchment">{principles.map(([title, copy]) => <section key={title} className="grid gap-4 border-b border-parchment py-8 sm:grid-cols-[2rem_13rem_1fr]"><CheckCircle2 className="mt-1 h-5 w-5 text-gold-deep" /><h2 className="font-display text-2xl font-bold text-charcoal">{title}</h2><p className="max-w-[66ch] text-pretty leading-7 text-warmgray">{copy}</p></section>)}</div>
        <div className="mt-12 rounded-[24px] bg-white p-7 sm:p-9"><h2 className="font-display text-2xl font-bold text-charcoal">Suggest a correction</h2><p className="mt-3 max-w-2xl leading-7 text-warmgray">Please identify the page, the statement, and why you believe it should be reviewed. We may contact you if clarification is needed.</p><Link href="/contact" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark active:scale-[0.98]">Contact us</Link></div>
      </div>
    </div>
  );
}
