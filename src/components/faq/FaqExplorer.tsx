"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { faqItems } from "@/lib/phase-two-data";

const categories = ["All", "Bookings", "Sessions", "Courses", "Shop", "Account"] as const;

export default function FaqExplorer() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return faqItems.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesQuery = !needle || `${item.question} ${item.answer}`.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <label htmlFor="faq-search" className="text-sm font-semibold text-charcoal">Search answers</label>
        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-dark" />
          <input id="faq-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “reschedule”" className="w-full rounded-2xl border border-parchment bg-white py-3.5 pl-11 pr-4 text-sm text-charcoal outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25" />
        </div>
        <div className="mt-6 flex flex-wrap gap-2 lg:flex-col" aria-label="FAQ categories">
          {categories.map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${category === item ? "bg-primary text-white shadow-md shadow-primary/15" : "bg-white/70 text-warmgray hover:bg-primary-soft hover:text-primary"}`}>
              {item}
            </button>
          ))}
        </div>
      </aside>

      <div>
        <p className="text-sm text-warmgray">{results.length} {results.length === 1 ? "answer" : "answers"}</p>
        {results.length ? (
          <div className="mt-5 divide-y divide-parchment border-y border-parchment">
            {results.map((item, index) => (
              <article key={item.question} className="grid gap-4 py-8 sm:grid-cols-[3.25rem_1fr] sm:gap-6">
                <span className="font-serif text-sm italic text-gold-dark">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">{item.category}</p>
                  <h2 className="mt-2 text-balance font-display text-2xl font-bold text-charcoal">{item.question}</h2>
                  <p className="mt-3 max-w-[68ch] text-pretty leading-7 text-warmgray">{item.answer}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-[24px] border border-parchment bg-white p-10 text-center">
            <p className="font-display text-2xl font-bold text-charcoal">No matching answer</p>
            <p className="mt-2 text-warmgray">Try a shorter search or choose another category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
