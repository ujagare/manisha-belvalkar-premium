import Link from "next/link";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { formatINR, cn } from "@/lib/utils";
import type { Service } from "@/lib/data";

/** Premium service card — gold aura bloom, glass chips, ornamental divider. */
export default function ServiceCard({
  service,
  compact = false,
}: {
  service: Service;
  compact?: boolean;
}) {
  const Icon = Sparkles;
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-parchment bg-gradient-to-b from-white to-cream/70 p-4 shadow-[0_10px_40px_-20px_rgba(28,25,23,0.18)] transition-all duration-500 sm:rounded-[28px] sm:p-6 lg:p-7 hover:-translate-y-2 hover:border-gold/50 hover:shadow-[0_35px_80px_-30px_rgba(221,184,41,0.45)]",
        !compact && "min-h-0 lg:min-h-[320px]",
      )}
    >
      {/* Gold aura bloom on hover */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/15 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(ellipse_70%_100%_at_50%_100%,rgba(221,184,41,0.12),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <div className="mb-4 flex items-start justify-between gap-2 sm:mb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg shadow-primary/25 ring-1 ring-gold/30 transition-all duration-500 group-hover:scale-105 group-hover:shadow-primary/40 sm:h-14 sm:w-14 sm:rounded-2xl">
          <Icon className="h-5 w-5 text-gold-light sm:h-6 sm:w-6" />
        </div>
        {service.badge ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-gold-dark px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-deeper shadow-lg shadow-gold/30 sm:px-3.5 sm:py-1.5">
            ✦ {service.badge}
          </span>
        ) : null}
      </div>

      <h3 className="font-display text-xl font-bold leading-tight text-charcoal transition-colors duration-300 group-hover:text-primary sm:text-2xl">
        {service.title}
      </h3>

      <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-parchment bg-white/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-warmgray backdrop-blur sm:mt-2.5 sm:px-3 sm:py-1">
        <Clock className="h-3 w-3 text-gold" />
        {service.duration}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-warmgray sm:mt-4">
        {service.short}
      </p>

      {/* Ornamental divider */}
      <div className="mt-4 flex items-center gap-3 sm:mt-6" aria-hidden="true">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/40" />
        <span className="font-serif text-sm text-gold">✦</span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-gold/40" />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 sm:mt-5">
        <div className="flex items-baseline gap-2">
          {service.price > 0 ? (
            <span className="font-display text-xl font-bold text-primary sm:text-2xl">
              {formatINR(service.price)}
            </span>
          ) : (
            <span className="font-display text-base font-bold text-primary sm:text-lg">
              By Appointment
            </span>
          )}
        </div>
        <span className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-dark px-4 py-2 text-xs font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/40 group-hover:brightness-110 sm:px-5 sm:py-2.5">
          Explore
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
