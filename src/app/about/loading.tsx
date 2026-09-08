import {
  HeroSkeleton,
  SectionHeadingSkeleton,
  CardGridSkeleton,
  QuoteSkeleton,
} from "@/components/skeletons/PageSkeletons";
import { Skeleton } from "@/components/shadcn/skeleton";

export default function AboutLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <section className="py-20 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2 lg:gap-20 lg:px-10">
          <Skeleton className="h-[520px] w-full rounded-3xl bg-ink/10 sm:h-[620px]" />
          <div>
            <Skeleton className="h-3 w-24 bg-gold/40" />
            <Skeleton className="mt-4 h-11 w-4/5 rounded-lg bg-ink/10 sm:h-14" />
            <div className="mt-6 space-y-3">
              <Skeleton className="h-3 w-full bg-ink/10" />
              <Skeleton className="h-3 w-full bg-ink/10" />
              <Skeleton className="h-3 w-5/6 bg-ink/10" />
              <Skeleton className="h-3 w-full bg-ink/10" />
            </div>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border-l-2 border-gold/60 pl-4">
                  <Skeleton className="h-7 w-16 bg-ink/10" />
                  <Skeleton className="mt-2 h-3 w-full bg-ink/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <QuoteSkeleton />

      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <CardGridSkeleton count={4} cols={4} />
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-ivory py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <div className="mt-16 grid grid-flow-dense gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[340px] rounded-3xl bg-ink/10 md:row-span-2 lg:h-[480px]" />
            <Skeleton className="h-[340px] rounded-3xl bg-ink/10" />
            <Skeleton className="h-[340px] rounded-3xl bg-ink/10" />
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="py-20 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <div className="mt-16 space-y-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="grid overflow-hidden rounded-3xl border border-parchment bg-white md:grid-cols-5"
              >
                <Skeleton className="h-64 w-full bg-ink/10 md:col-span-2 md:h-auto" />
                <div className="p-8 md:col-span-3 md:p-12">
                  <Skeleton className="h-3 w-24 bg-gold/40" />
                  <Skeleton className="mt-4 h-7 w-3/4 rounded-lg bg-ink/10" />
                  <Skeleton className="mt-4 h-3 w-full bg-ink/10" />
                  <Skeleton className="mt-2 h-3 w-5/6 bg-ink/10" />
                  <Skeleton className="mt-6 h-16 w-full rounded-xl bg-ivory" />
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