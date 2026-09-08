import { HeroSkeleton, SectionHeadingSkeleton } from "@/components/skeletons/PageSkeletons";
import { Skeleton } from "@/components/shadcn/skeleton";

export default function AppLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Phone mockup */}
            <div className="mx-auto flex h-96 w-64 flex-col items-center justify-center rounded-[2.5rem] bg-charcoal p-8">
              <Skeleton className="h-16 w-16 rounded-full bg-gold/20" />
              <Skeleton className="mt-6 h-5 w-28 rounded-lg bg-white/20" />
              <Skeleton className="mt-3 h-3 w-40 bg-white/10" />
              <Skeleton className="mt-8 h-px w-24 bg-white/20" />
              <Skeleton className="mt-6 h-3 w-32 bg-white/10" />
            </div>
            <div>
              <SectionHeadingSkeleton align="left" />
              <div className="mt-8 space-y-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="mt-1 h-7 w-7 shrink-0 rounded-full bg-primary-soft" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 bg-ink/10" />
                      <Skeleton className="mt-2 h-3 w-2/3 bg-ink/10" />
                    </div>
                  </div>
                ))}
              </div>
              <Skeleton className="mt-9 h-12 w-52 rounded-full bg-gold/40" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}