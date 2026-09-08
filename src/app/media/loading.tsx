import { HeroSkeleton, SectionHeadingSkeleton } from "@/components/skeletons/PageSkeletons";
import { Skeleton } from "@/components/shadcn/skeleton";

export default function MediaLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="space-y-10">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="grid overflow-hidden rounded-3xl border border-parchment bg-white md:grid-cols-2"
              >
                <Skeleton className="h-64 w-full bg-ink/10 md:h-[380px]" />
                <div className="p-8 md:p-12">
                  <Skeleton className="h-3 w-28 bg-gold/40" />
                  <Skeleton className="mt-4 h-7 w-3/4 rounded-lg bg-ink/10" />
                  <Skeleton className="mt-4 h-3 w-full bg-ink/10" />
                  <Skeleton className="mt-2 h-3 w-5/6 bg-ink/10" />
                  <Skeleton className="mt-6 h-20 w-full rounded-xl bg-ivory" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 text-center">
            <Skeleton className="mx-auto h-12 w-52 rounded-full bg-gold/40" />
          </div>
        </div>
      </section>
    </div>
  );
}