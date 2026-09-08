import { HeroSkeleton } from "@/components/skeletons/PageSkeletons";
import { Skeleton } from "@/components/shadcn/skeleton";

export default function ServicesLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="space-y-24">
            {[0, 1, 2].map((cat) => (
              <div key={cat}>
                <div className="mx-auto max-w-3xl text-center">
                  <div className="mb-4 flex items-center justify-center gap-4">
                    <Skeleton className="h-3 w-8 bg-gold/40" />
                    <Skeleton className="h-3 w-12 bg-gold/40" />
                    <Skeleton className="h-3 w-8 bg-gold/40" />
                  </div>
                  <Skeleton className="mx-auto h-10 w-2/3 rounded-lg bg-ink/10 sm:h-12" />
                  <Skeleton className="mx-auto mt-3 h-3 w-1/2 bg-ink/10" />
                </div>
                <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-full rounded-2xl border border-parchment bg-white p-7">
                      <div className="flex gap-5">
                        <Skeleton className="h-16 w-16 shrink-0 rounded-full bg-ink/10" />
                        <div className="flex-1 space-y-2 pt-1">
                          <Skeleton className="h-3 w-16 bg-ink/10" />
                          <Skeleton className="h-5 w-3/4 rounded-lg bg-ink/10" />
                        </div>
                      </div>
                      <div className="mt-5 space-y-2">
                        <Skeleton className="h-3 w-full bg-ink/10" />
                        <Skeleton className="h-3 w-5/6 bg-ink/10" />
                      </div>
                      <div className="mt-5 flex gap-3">
                        <Skeleton className="h-8 w-28 rounded-full bg-primary-soft" />
                        <Skeleton className="h-8 w-8 rounded-full bg-primary-soft" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}