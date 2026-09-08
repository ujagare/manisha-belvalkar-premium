import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/data";

/** Premium testimonial card with serif pull-quote styling. */
export default function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <div className="gold-border-gradient relative rounded-2xl bg-cream p-8 sm:p-10">
      <Quote className="absolute right-6 top-6 h-8 w-8 text-gold/20" />
      <blockquote className="relative">
        <p className="font-serif text-xl font-medium italic leading-relaxed text-charcoal sm:text-2xl">
          &ldquo;{testimonial.text}&rdquo;
        </p>
      </blockquote>
      <div className="mt-8 flex items-center gap-4 border-t border-parchment pt-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-charcoal">{testimonial.name}</p>
          <p className="text-xs text-warmgray">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}