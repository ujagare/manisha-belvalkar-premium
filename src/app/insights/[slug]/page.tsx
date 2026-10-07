import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import { getInsight, insights } from "@/lib/insights";

const BASE = "https://manishabelvalkar.com";

export function generateStaticParams() {
  return insights.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/insights/${article.slug}` },
    openGraph: { type: "article", title: article.title, description: article.description, url: `${BASE}/insights/${article.slug}`, images: [{ url: article.image, alt: article.imageAlt }] },
  };
}

export default async function InsightArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: `${BASE}${article.image}`,
    author: { "@type": "Person", name: "Dr. Manisha Belvalkar", url: `${BASE}/about` },
    publisher: { "@type": "Organization", name: "Manisha Belvalkar", url: BASE },
    mainEntityOfPage: `${BASE}/insights/${article.slug}`,
    inLanguage: "en-IN",
  };

  return (
    <article className="bg-cream pb-20 pt-28 lg:pb-28 lg:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <header className="mx-auto max-w-5xl px-6 lg:px-10">
        <Link href="/insights" className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:-translate-x-1"><ArrowLeft className="h-4 w-4" />All insights</Link>
        <div className="mt-10 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep"><span>{article.category}</span><span className="h-1 w-1 rotate-45 bg-gold" /><span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-warmgray"><Clock3 className="h-3.5 w-3.5" />{article.readTime}</span></div>
        <h1 className="mt-5 max-w-4xl text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight text-charcoal sm:text-6xl lg:text-7xl">{article.title}</h1>
        <p className="mt-7 max-w-3xl text-pretty text-lg leading-8 text-warmgray">{article.description}</p>
        <div className="mt-8 flex items-center gap-3 border-t border-parchment pt-6"><div className="relative h-11 w-11 overflow-hidden rounded-xl"><Image src="/images/manisha-portrait.jpg" alt="Dr. Manisha Belvalkar" fill sizes="44px" className="object-cover object-top" /></div><div><p className="text-sm font-semibold text-charcoal">Dr. Manisha Belvalkar</p><p className="text-xs text-warmgray">Spiritual mentor &amp; holistic wellbeing coach</p></div></div>
      </header>
      <div className="mx-auto mt-12 max-w-7xl px-6 lg:px-10"><div className="relative aspect-[16/8] overflow-hidden rounded-[30px] bg-parchment"><Image src={article.image} alt={article.imageAlt} fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" /></div></div>
      <div className="mx-auto mt-14 grid max-w-5xl gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:px-10">
        <div className="min-w-0">
          <p className="text-pretty font-serif text-2xl leading-9 text-charcoal first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:leading-[.85] first-letter:text-primary">{article.introduction}</p>
          <div className="mt-12 space-y-12">{article.sections.map((section) => <section key={section.heading}><h2 className="text-balance font-display text-3xl font-bold text-charcoal sm:text-4xl">{section.heading}</h2><div className="mt-5 space-y-4">{section.paragraphs.map((paragraph) => <p key={paragraph} className="text-pretty text-base leading-8 text-warmgray">{paragraph}</p>)}</div>{section.points ? <ul className="mt-6 space-y-3 border-l-2 border-gold/60 pl-6">{section.points.map((point) => <li key={point} className="leading-7 text-ink">{point}</li>)}</ul> : null}</section>)}</div>
          <aside className="mt-14 rounded-[24px] bg-primary px-7 py-8 text-white sm:px-9"><p className="eyebrow text-gold-light">Keep with you</p><p className="mt-4 text-pretty font-serif text-2xl leading-9">{article.takeaway}</p></aside>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start"><div className="border-t border-parchment pt-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">Continue exploring</p><Link href={article.relatedHref} className="group mt-4 inline-flex items-start gap-2 font-display text-xl font-bold leading-snug text-charcoal hover:text-primary">{article.relatedLabel}<ArrowUpRight className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link></div><div className="mt-8 border-t border-parchment pt-5"><Link href="/editorial-policy" className="text-sm font-semibold text-primary underline decoration-gold/50 underline-offset-4">Read our editorial policy</Link></div></aside>
      </div>
    </article>
  );
}
