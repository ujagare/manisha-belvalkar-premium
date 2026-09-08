import {
  HeroSkeleton,
  SectionHeadingSkeleton,
  CardGridSkeleton,
  QuoteSkeleton,
} from "@/components/skeletons/PageSkeletons";
import { Skeleton } from "@/components/shadcn/skeleton";

export default function MentoringLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <QuoteSkeleton />
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <CardGridSkeleton count={6} cols={3} />
        </div>
      </section>
      <section className="bg-mist py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <SectionHeadingSkeleton align="left" />
          <div className="mt-12 space-y-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-6 w-6 rounded-full bg-primary-soft" />
                <Skeleton className="h-3 w-2/3 bg-ink/10" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}