import {
  HeroSkeleton,
  SectionHeadingSkeleton,
  QuoteSkeleton,
} from "@/components/skeletons/PageSkeletons";
import { Skeleton } from "@/components/shadcn/skeleton";

export default function ShaktiLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <div className="mt-16 grid grid-flow-dense gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[420px] rounded-2xl bg-ink/10 lg:col-span-2 lg:row-span-2" />
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[200px] rounded-2xl bg-ink/10" />
            ))}
          </div>
        </div>
      </section>
      <QuoteSkeleton />
    </div>
  );
}