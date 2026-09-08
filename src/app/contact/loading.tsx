import { HeroSkeleton, SectionHeadingSkeleton } from "@/components/skeletons/PageSkeletons";
import { Skeleton } from "@/components/shadcn/skeleton";

export default function ContactLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-2">
            {/* Info column */}
            <div className="space-y-8">
              <SectionHeadingSkeleton align="left" />
              <div className="space-y-5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-5 rounded-2xl border border-parchment bg-white p-6"
                  >
                    <Skeleton className="h-11 w-11 shrink-0 rounded-full bg-primary-soft" />
                    <div className="flex-1">
                      <Skeleton className="h-3 w-24 bg-ink/10" />
                      <Skeleton className="mt-2 h-3 w-2/3 bg-ink/10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Form column */}
            <div className="rounded-3xl border border-parchment bg-white p-8 sm:p-10">
              <Skeleton className="h-7 w-1/2 rounded-lg bg-ink/10" />
              <div className="mt-8 space-y-6">
                {[0, 1].map((i) => (
                  <div key={i}>
                    <Skeleton className="mb-2 h-3 w-20 bg-ink/10" />
                    <Skeleton className="h-11 w-full rounded-xl bg-ink/10" />
                  </div>
                ))}
                <div>
                  <Skeleton className="mb-2 h-3 w-20 bg-ink/10" />
                  <Skeleton className="h-32 w-full rounded-xl bg-ink/10" />
                </div>
                <Skeleton className="h-12 w-full rounded-full bg-gold/40" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}