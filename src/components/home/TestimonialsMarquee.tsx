"use client";

import { Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

/**
 * Premium light-mode testimonial marquee. Two rows of cream cards scroll
 * in opposite directions on an infinite CSS keyframe loop; hovering a
 * row pauses it. Falls back to nothing when there are no testimonials.
 */
export default function TestimonialsMarquee() {
  if (testimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Soft light backdrop */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(221,184,41,0.07),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6 text-center lg:px-10">
        <div className="eyebrow mb-4 flex items-center justify-center gap-4 text-gold-dark">
          <span className="hairline-gold w-10" />
          Testimonials
          <span className="hairline-gold w-10" />
        </div>
        <h2 className="font-display text-4xl font-bold leading-tight text-charcoal sm:text-5xl">
          Words of <span className="text-crimson-gradient">trust</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-warmgray sm:text-lg">
          Souls we have walked with — in their own words.
        </p>
      </div>

      {/* Marquee rows — full-bleed with soft edge fades */}
      <div className="relative mt-14">
        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-cream to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-cream to-transparent sm:w-40" />

        {/* Row — scrolls left, pauses on hover */}
        <div className="group relative overflow-hidden">
          <div className="flex w-max gap-6 animate-marquee-left group-hover:[animation-play-state:paused]">
            {[...testimonials, ...testimonials].map((t, i) => (
              <MarqueeCard key={`t-${i}`} name={t.name} role={t.role} text={t.text} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** One cream testimonial card inside the marquee. */
function MarqueeCard({
  name,
  role,
  text,
}: {
  name: string;
  role: string;
  text: string;
}) {
  return (
    <figure className="relative flex w-[320px] shrink-0 flex-col rounded-2xl border border-parchment bg-white/80 p-6 shadow-[0_18px_45px_-25px_rgba(180,20,20,0.18)] backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-gold/50 hover:shadow-[0_28px_60px_-25px_rgba(221,184,41,0.35)] sm:w-[380px]">
      <Quote className="absolute right-5 top-5 h-6 w-6 text-gold/25" />
      <div className="mb-3 flex gap-1 text-gold" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
            <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.29 3.96a1 1 0 0 0 .95.69h4.16c.97 0 1.37 1.24.59 1.81l-3.37 2.45a1 1 0 0 0-.36 1.12l1.28 3.96c.3.92-.75 1.69-1.54 1.12l-3.36-2.44a1 1 0 0 0-1.18 0l-3.36 2.44c-.78.57-1.84-.2-1.54-1.12l1.29-3.96a1 1 0 0 0-.37-1.12L2.07 9.39c-.78-.57-.38-1.81.59-1.81h4.16a1 1 0 0 0 .95-.69l1.28-3.96Z" />
          </svg>
        ))}
      </div>
      <blockquote className="flex-1">
        <p className="text-sm leading-relaxed text-warmgray sm:text-[0.95rem]">
          &ldquo;{text}&rdquo;
        </p>
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-parchment pt-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-white ring-1 ring-gold/40">
          {name.charAt(0)}
        </span>
        <span>
          <span className="block text-sm font-semibold text-charcoal">{name}</span>
          <span className="block text-xs text-warmgray">{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
