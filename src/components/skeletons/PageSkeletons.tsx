import { Skeleton } from "@/components/shadcn/skeleton";
import { cn } from "@/lib/utils";

/* ============ Shared skeleton primitives ============ */

/** Warm-toned skeleton block that reads on cream/ivory backgrounds. */
function Tone({ className, ...props }: React.ComponentProps<typeof Skeleton>) {
  return <Skeleton className={cn("bg-ink/10", className)} {...props} />;
}

/** Skeleton matching the PageHero layout. */
export function HeroSkeleton({ dark = false }: { dark?: boolean }) {
  return (
    <section
      className={cn(
        "relative overflow-hidden pb-16 pt-32 lg:pb-20 lg:pt-40",
        dark ? "bg-charcoal" : "bg-ivory",
      )}
    >
      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
        <div className="mb-5 flex items-center justify-center gap-4">
          <Skeleton className={cn("h-px w-10", dark ? "bg-white/20" : "bg-gold/40")} />
          <Skeleton className={cn("h-3 w-20", dark ? "bg-white/15" : "bg-ink/10")} />
          <Skeleton className={cn("h-px w-10", dark ? "bg-white/20" : "bg-gold/40")} />
        </div>
        <Skeleton className={cn("mx-auto h-12 w-3/4 rounded-lg sm:h-14", dark ? "bg-white/15" : "bg-ink/10")} />
        <Skeleton className={cn("mx-auto mt-4 h-12 w-1/2 rounded-lg sm:h-14", dark ? "bg-white/15" : "bg-ink/10")} />
        <div className="mx-auto mt-6 max-w-2xl space-y-2">
          <Skeleton className={cn("h-3 w-full", dark ? "bg-white/10" : "bg-ink/10")} />
          <Skeleton className={cn("h-3 w-2/3 mx-auto", dark ? "bg-white/10" : "bg-ink/10")} />
        </div>
      </div>
    </section>
  );
}

/** Centered section heading skeleton. */
export function SectionHeadingSkeleton({
  align = "center",
}: {
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <div className={cn("max-w-3xl", centered && "mx-auto text-center")}>
      <div className={cn("mb-4 flex items-center gap-4", centered && "justify-center")}>
        <Skeleton className="h-3 w-16 bg-gold/40" />
        <Skeleton className="h-px w-8 bg-gold/40" />
      </div>
      <Skeleton className={cn("h-10 w-3/4 rounded-lg sm:h-12", centered && "mx-auto", align === "left" && "")} />
      <Skeleton className={cn("mt-4 h-3 w-full max-w-xl", centered && "mx-auto")} />
      <Skeleton className={cn("mt-2 h-3 w-2/3 max-w-md", centered && "mx-auto")} />
    </div>
  );
}

/** Card skeleton (icon + lines) for card grids. */
export function CardSkeleton() {
  return (
    <div className="h-full rounded-2xl border border-parchment bg-white p-7">
      <Skeleton className="mb-5 h-12 w-12 rounded-xl bg-ink/10" />
      <Skeleton className="h-5 w-2/3 rounded-lg bg-ink/10" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-full bg-ink/10" />
        <Skeleton className="h-3 w-5/6 bg-ink/10" />
      </div>
      <Skeleton className="mt-5 h-4 w-20 bg-ink/10" />
    </div>
  );
}

/** Image card skeleton for image-based cards (courses, books). */
export function ImageCardSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className="h-full overflow-hidden rounded-2xl border border-parchment bg-white">
      <Skeleton className={cn("w-full bg-ink/10", tall ? "h-64" : "h-48")} />
      <div className="p-6">
        <Skeleton className="h-5 w-3/4 rounded-lg bg-ink/10" />
        <Skeleton className="mt-3 h-3 w-full bg-ink/10" />
        <Skeleton className="mt-2 h-3 w-2/3 bg-ink/10" />
        <Skeleton className="mt-5 h-10 w-32 rounded-full bg-gold/30" />
      </div>
    </div>
  );
}

/** Grid wrapper of card skeletons. */
export function CardGridSkeleton({
  count = 3,
  image = false,
  tall = false,
  cols = 3,
}: {
  count?: number;
  image?: boolean;
  tall?: boolean;
  cols?: 2 | 3 | 4;
}) {
  const colClass =
    cols === 2
      ? "md:grid-cols-2"
      : cols === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={cn("mt-12 grid gap-7", colClass)}>
      {Array.from({ length: count }).map((_, i) =>
        image ? (
          <ImageCardSkeleton key={i} tall={tall} />
        ) : (
          <CardSkeleton key={i} />
        ),
      )}
    </div>
  );
}

/** Split layout skeleton for [slug] detail pages (image + text). */
export function DetailSkeleton() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-2 lg:items-center lg:px-10">
        <Skeleton className="h-72 w-full rounded-2xl bg-ink/10 lg:h-[480px]" />
        <div>
          <Skeleton className="h-3 w-24 bg-gold/40" />
          <Skeleton className="mt-4 h-9 w-3/4 rounded-lg bg-ink/10 sm:h-11" />
          <div className="mt-5 space-y-2">
            <Skeleton className="h-3 w-full bg-ink/10" />
            <Skeleton className="h-3 w-full bg-ink/10" />
            <Skeleton className="h-3 w-2/3 bg-ink/10" />
          </div>
          <div className="mt-7 space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full bg-primary-soft" />
                <Skeleton className="h-3 w-40 bg-ink/10" />
              </div>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap gap-4">
            <Skeleton className="h-11 w-44 rounded-full bg-gold/40" />
            <Skeleton className="h-11 w-36 rounded-full bg-ink/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Dark cinematic quote band skeleton. */
export function QuoteSkeleton() {
  return (
    <section className="bg-charcoal py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-10">
        <Skeleton className="mx-auto mb-8 h-10 w-10 rounded-full bg-gold/20" />
        <Skeleton className="mx-auto h-8 w-full max-w-2xl rounded-lg bg-white/10" />
        <Skeleton className="mx-auto mt-3 h-8 w-2/3 rounded-lg bg-white/10" />
        <Skeleton className="mx-auto mt-8 h-3 w-32 bg-white/15" />
      </div>
    </section>
  );
}