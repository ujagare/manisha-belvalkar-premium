import {
  HeroSkeleton,
  SectionHeadingSkeleton,
  QuoteSkeleton,
} from "@/components/skeletons/PageSkeletons";
import { Skeleton } from "@/components/shadcn/skeleton";

export default function HealingLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-6 rounded-2xl border border-parchment bg-white p-8 sm:flex-row sm:items-center sm:gap-8"
              >
                <Skeleton className="h-44 w-full shrink-0 rounded-xl bg-ink/10 sm:h-44 sm:w-44" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-2/3 rounded-lg bg-ink/10" />
                  <Skeleton className="mt-3 h-3 w-full bg-ink/10" />
                  <Skeleton className="mt-2 h-3 w-5/6 bg-ink/10" />
                  <Skeleton className="mt-4 h-3 w-24 bg-ink/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <QuoteSkeleton />
    </div>
  );
}