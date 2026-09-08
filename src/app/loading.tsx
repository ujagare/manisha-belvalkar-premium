import {
  HeroSkeleton,
  SectionHeadingSkeleton,
  CardGridSkeleton,
  QuoteSkeleton,
} from "@/components/skeletons/PageSkeletons";
import { Skeleton } from "@/components/shadcn/skeleton";

export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      {/* HeroSlider skeleton */}
      <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden bg-charcoal">
        <Skeleton className="absolute inset-0 rounded-none bg-ink/40" />
        <div className="relative z-10 flex h-full items-center px-6 lg:px-20">
          <div className="max-w-2xl">
            <Skeleton className="h-3 w-28 bg-gold/40" />
            <Skeleton className="mt-5 h-12 w-3/4 rounded-lg bg-white/20 sm:h-16" />
            <Skeleton className="mt-3 h-12 w-1/2 rounded-lg bg-white/20 sm:h-16" />
            <Skeleton className="mt-6 h-3 w-full max-w-lg bg-white/10" />
            <Skeleton className="mt-2 h-3 w-2/3 max-w-md bg-white/10" />
            <div className="mt-9 flex gap-4">
              <Skeleton className="h-12 w-44 rounded-full bg-gold/40" />
              <Skeleton className="h-12 w-36 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </section>

      {/* About summary */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-3">
              <Skeleton className="h-3 w-full bg-ink/10" />
              <Skeleton className="h-3 w-5/6 bg-ink/10" />
              <Skeleton className="h-3 w-full bg-ink/10" />
              <Skeleton className="h-3 w-2/3 bg-ink/10" />
            </div>
            <Skeleton className="h-72 w-full rounded-2xl bg-ink/10" />
          </div>
        </div>
      </section>

      {/* Shakti preview */}
      <section className="bg-ivory py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <CardGridSkeleton count={4} cols={4} />
        </div>
      </section>

      {/* Mentoring preview */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <CardGridSkeleton count={3} image tall />
        </div>
      </section>

      {/* Healing preview */}
      <section className="bg-mist py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <CardGridSkeleton count={4} cols={4} />
        </div>
      </section>

      <QuoteSkeleton />

      {/* Services preview */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <CardGridSkeleton count={3} />
        </div>
      </section>

      {/* Ecosystem */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <CardGridSkeleton count={3} image />
        </div>
      </section>
    </div>
  );
}