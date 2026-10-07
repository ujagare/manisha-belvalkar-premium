"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

/**
 * Shop search box. Writes the query to the URL (?q=) so results are
 * shareable and server-rendered. Mirrors the industry-standard "search
 * within the store" behaviour without leaking auth or order data.
 */
export default function ShopSearch({ defaultValue = "" }: { defaultValue?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);

  function submit(term: string) {
    const q = term.trim();
    const next = new URLSearchParams(searchParams.toString());
    if (q) next.set("q", q);
    else next.delete("q");
    next.delete("category");
    router.push(`/products?${next.toString()}`.replace(/\?$/, ""));
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit(value);
      }}
      className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-full border border-parchment bg-white py-2 pl-5 pr-2 shadow-[0_8px_30px_-18px_rgba(28,25,23,0.25)] focus-within:border-gold"
    >
      <Search className="h-5 w-5 shrink-0 text-gold-dark" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search decks, books, rituals…"
        aria-label="Search the shop"
        className="w-full bg-transparent text-charcoal outline-none placeholder:text-warmgray/70"
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            setValue("");
            submit("");
          }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/10 text-warmgray hover:bg-ink/20"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
      <button
        type="submit"
        className="shrink-0 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
      >
        Search
      </button>
    </form>
  );
}
