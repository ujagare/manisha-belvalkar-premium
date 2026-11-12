import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import { getInsight, insights } from "@/lib/insights";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/JsonLd";

const BASE = "https://www.manishabelvalkar.com";

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
    openGraph: { type: "article", title: article.title, description: article.description, url: `${BASE}/insights/${article.slug}`, publishedTime: article.datePublished, modifiedTime: article.dateModified, authors: [`${BASE}/about`], images: [{ url: article.image, alt: article.imageAlt }] },
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
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    inLanguage: "en-IN",
  };

  return (
    <article className="bg-cream pb-14 pt-20 sm:pb-20 sm:pt-28 lg:pb-28 lg:pt-36">
      <JsonLd data={schema} />
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }, { name: article.title, path: `/insights/${article.slug}` }]} />
      <header className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <Link href="/insights" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-primary transition hover:-translate-x-1"><ArrowLeft className="h-4 w-4" />All insights</Link>
        <div className="mt-5 sm:mt-10 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep"><span>{article.category}</span><span className="h-1 w-1 rotate-45 bg-gold" /><span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-warmgray"><Clock3 className="h-3.5 w-3.5" />{article.readTime}</span></div>
        <h1 className="mt-3 sm:mt-5 max-w-4xl text-balance font-display text-[1.85rem] font-bold leading-[1.1] tracking-tight text-charcoal sm:text-5xl lg:text-7xl">{article.title}</h1>
        <p className="mt-4 sm:mt-7 max-w-3xl text-pretty text-base sm:text-lg leading-7 sm:leading-8 text-warmgray">{article.description}</p>
        <div className="mt-5 sm:mt-8 flex items-center gap-3 border-t border-parchment pt-4 sm:pt-6"><div className="relative h-10 w-10 sm:h-11 sm:w-11 overflow-hidden rounded-xl"><Image src="/images/manisha-portrait.webp" alt="Dr. Manisha Belvalkar" fill sizes="44px" className="object-cover object-top" /></div><div><p className="text-sm font-semibold text-charcoal">Dr. Manisha Belvalkar</p><p className="text-xs text-warmgray">Spiritual mentor &amp; holistic wellbeing coach</p></div></div>
      </header>
      <div className="mx-auto mt-7 sm:mt-12 max-w-7xl px-4 sm:px-6 lg:px-10"><div className="relative aspect-[16/10] sm:aspect-[16/8] overflow-hidden rounded-2xl sm:rounded-[30px] bg-parchment"><Image src={article.image} alt={article.imageAlt} fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" /></div></div>
      <div className="mx-auto mt-8 sm:mt-14 grid max-w-5xl gap-8 sm:gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:px-10">
        <div className="min-w-0">
          <p className="text-pretty font-serif text-xl sm:text-2xl leading-8 sm:leading-9 text-charcoal first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-bold first-letter:leading-[.85] first-letter:text-primary">{article.introduction}</p>
          <div className="mt-8 sm:mt-12 space-y-8 sm:space-y-12">{article.sections.map((section) => <section key={section.heading}><h2 className="text-balance font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal">{section.heading}</h2><div className="mt-3 sm:mt-5 space-y-3 sm:space-y-4">{section.paragraphs.map((paragraph) => <p key={paragraph} className="text-pretty text-base leading-7 sm:leading-8 text-warmgray">{paragraph}</p>)}</div>{section.points ? <ul className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3 border-l-2 border-gold/60 pl-4 sm:pl-6">{section.points.map((point) => <li key={point} className="text-sm sm:text-base leading-6 sm:leading-7 text-ink">{point}</li>)}</ul> : null}</section>)}</div>
          <aside className="mt-9 sm:mt-14 rounded-2xl sm:rounded-[24px] bg-primary px-5 py-6 sm:px-9 sm:py-8 text-white"><p className="eyebrow text-gold-light">Keep with you</p><p className="mt-3 sm:mt-4 text-pretty font-serif text-xl sm:text-2xl leading-8 sm:leading-9">{article.takeaway}</p></aside>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start"><div className="border-t border-parchment pt-5"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep">Continue exploring</p><Link href={article.relatedHref} className="group mt-4 inline-flex items-start gap-2 font-display text-xl font-bold leading-snug text-charcoal hover:text-primary">{article.relatedLabel}<ArrowUpRight className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link></div><div className="mt-8 border-t border-parchment pt-5"><Link href="/editorial-policy" className="text-sm font-semibold text-primary underline decoration-gold/50 underline-offset-4">Read our editorial policy</Link></div></aside>
      </div>
    </article>
  );
}
