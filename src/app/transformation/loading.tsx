import {
  HeroSkeleton,
  SectionHeadingSkeleton,
} from "@/components/skeletons/PageSkeletons";
import { Skeleton } from "@/components/shadcn/skeleton";

export default function TransformationLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      {/* Meta strip */}
      <section className="bg-mist py-14 lg:py-16">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 lg:px-10">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full bg-gold/40" />
              <div>
                <Skeleton className="h-3 w-32 bg-ink/10" />
                <Skeleton className="mt-2 h-3 w-24 bg-ink/10" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <div className="relative mt-16 space-y-12">
            <Skeleton className="absolute left-5 top-0 h-full w-px bg-gold/30 md:left-1/2" />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const left = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`relative flex items-start gap-6 md:w-1/2 ${
                    left ? "md:mr-auto md:pr-10" : "md:ml-auto md:pl-10"
                  }`}
                >
                  <Skeleton className="absolute left-5 z-10 h-11 w-11 -translate-x-1/2 rounded-full bg-charcoal md:left-auto md:right-0 md:translate-x-1/2" />
                  <div className="ml-14 flex-1 rounded-2xl border border-parchment bg-white p-7 md:ml-0">
                    <Skeleton className="h-3 w-20 bg-gold/40" />
                    <Skeleton className="mt-3 h-6 w-2/3 rounded-lg bg-ink/10" />
                    <Skeleton className="mt-3 h-3 w-full bg-ink/10" />
                    <Skeleton className="mt-2 h-3 w-4/5 bg-ink/10" />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-16 text-center">
            <Skeleton className="mx-auto h-12 w-64 rounded-full bg-gold/40" />
          </div>
        </div>
      </section>
    </div>
  );
}