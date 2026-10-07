"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, Search } from "lucide-react";
import { insightCategories, insights, type InsightCategory } from "@/lib/insights";

export default function InsightExplorer() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | InsightCategory>("All");
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return insights.filter((article) => {
      const matchesCategory = category === "All" || article.category === category;
      const matchesQuery = !term || `${article.title} ${article.description} ${article.category}`.toLowerCase().includes(term);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div>
      <div className="grid gap-5 border-y border-parchment py-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <label className="relative block max-w-xl">
          <span className="sr-only">Search insights</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-deep" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by topic or question" className="h-12 w-full rounded-xl border border-parchment bg-white pl-11 pr-4 text-sm text-charcoal shadow-[0_12px_35px_-28px_rgba(91,62,42,0.55)] outline-none transition focus:border-gold" />
        </label>
        <div className="flex flex-wrap gap-2" aria-label="Filter insights by category">
          {insightCategories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-[0.98] ${category === item ? "bg-primary text-white" : "bg-white text-warmgray hover:bg-gold-soft hover:text-charcoal"}`}>{item}</button>)}
        </div>
      </div>

      {visible.length ? (
        <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2">
          {visible.map((article, index) => (
            <article key={article.slug} className={index === 0 && visible.length > 2 ? "md:col-span-2 md:grid md:grid-cols-[1.15fr_.85fr] md:gap-8" : ""}>
              <Link href={`/insights/${article.slug}`} className="group relative block aspect-[16/10] overflow-hidden rounded-[26px] bg-parchment">
                <Image src={article.image} alt={article.imageAlt} fill sizes={index === 0 ? "(min-width: 768px) 55vw, 100vw" : "(min-width: 768px) 45vw, 100vw"} className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/35 to-transparent" />
              </Link>
              <div className={index === 0 && visible.length > 2 ? "flex flex-col justify-center py-6 md:py-0" : "pt-6"}>
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold-deep"><span>{article.category}</span><span className="h-1 w-1 rotate-45 bg-gold" /><span className="inline-flex items-center gap-1.5 normal-case tracking-normal text-warmgray"><Clock3 className="h-3.5 w-3.5" />{article.readTime}</span></div>
                <h2 className="mt-4 text-balance font-display text-3xl font-bold leading-tight text-charcoal lg:text-4xl"><Link href={`/insights/${article.slug}`} className="transition-colors hover:text-primary">{article.title}</Link></h2>
                <p className="mt-4 max-w-[62ch] text-pretty leading-7 text-warmgray">{article.description}</p>
                <Link href={`/insights/${article.slug}`} className="group mt-6 inline-flex w-fit items-center gap-2 font-semibold text-primary">Read insight <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[24px] bg-white px-6 py-14 text-center"><p className="font-display text-2xl font-bold text-charcoal">No matching insight found</p><p className="mt-2 text-warmgray">Try a broader search or choose another category.</p><button type="button" onClick={() => { setQuery(""); setCategory("All"); }} className="mt-5 font-semibold text-primary underline decoration-gold underline-offset-4">Clear filters</button></div>
      )}
    </div>
  );
}
