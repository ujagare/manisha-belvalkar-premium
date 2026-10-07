import Link from "next/link";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { brand } from "@/lib/data";

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export default function LegalPage({
  eyebrow,
  title,
  introduction,
  sections,
  showContact = true,
}: {
  eyebrow: string;
  title: string;
  introduction: string;
  sections: LegalSection[];
  showContact?: boolean;
}) {
  return (
    <article className="relative overflow-hidden bg-ivory pb-24 pt-28 lg:pb-32 lg:pt-36">
      <div className="glow-gold pointer-events-none absolute -right-40 -top-36 h-[430px] w-[430px]" />
      <div className="glow-crimson pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] opacity-50" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-warmgray transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <header className="mt-10 max-w-4xl border-b border-gold/25 pb-10">
          <p className="eyebrow text-gold-dark">{eyebrow}</p>
          <h1 className="mt-4 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-pretty text-base leading-8 text-warmgray sm:text-lg">
            {introduction}
          </p>
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-warmgray/70">
            Last updated: 1 October 2026
          </p>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-20">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <section key={section.title} id={`section-${index + 1}`} className="scroll-mt-28">
                <div className="flex items-start gap-4">
                  <span className="mt-1 font-serif text-sm italic text-gold-dark">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-balance font-display text-2xl font-bold text-charcoal sm:text-3xl">
                      {section.title}
                    </h2>
                    {section.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="mt-4 max-w-[68ch] text-pretty leading-7 text-warmgray">
                        {paragraph}
                      </p>
                    ))}
                    {section.items ? (
                      <ul className="mt-5 max-w-[68ch] space-y-3 text-warmgray">
                        {section.items.map((item) => (
                          <li key={item} className="flex gap-3 leading-7">
                            <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </section>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[24px] border border-parchment bg-white/75 p-6 shadow-[0_20px_50px_-35px_rgba(91,62,42,0.35)] backdrop-blur">
              <p className="font-serif text-lg font-semibold text-charcoal">On this page</p>
              <nav aria-label={`${title} sections`} className="mt-4">
                <ol className="space-y-2.5">
                  {sections.map((section, index) => (
                    <li key={section.title}>
                      <a
                        href={`#section-${index + 1}`}
                        className="text-sm leading-5 text-warmgray transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            {showContact ? (
              <div className="mt-5 rounded-[24px] bg-charcoal p-6 text-ivory/75">
                <p className="font-serif text-lg font-semibold text-white">Need clarification?</p>
                <p className="mt-2 text-sm leading-6">Contact us before booking or placing an order.</p>
                <div className="mt-4 space-y-3 text-sm">
                  <a className="flex items-center gap-2 transition-colors hover:text-gold" href={brand.emailHref}>
                    <Mail className="h-4 w-4 text-gold" />
                    <span className="break-all">{brand.email}</span>
                  </a>
                  <a className="flex items-center gap-2 transition-colors hover:text-gold" href={brand.phoneHref}>
                    <Phone className="h-4 w-4 text-gold" />
                    {brand.phone}
                  </a>
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </article>
  );
}
