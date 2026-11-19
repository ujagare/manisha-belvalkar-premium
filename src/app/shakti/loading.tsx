import {
  SectionHeadingSkeleton,
  QuoteSkeleton,
} from "@/components/skeletons/PageSkeletons";
import { Skeleton } from "@/components/shadcn/skeleton";

export default function ShaktiLoading() {
  return (
    <div className="animate-pulse">
      <section className="min-h-[40rem] bg-[#260b0a] pt-16 sm:min-h-[56rem] lg:min-h-[48rem]">
        <div className="mx-auto flex h-full max-w-7xl flex-col items-center justify-center gap-8 px-6 py-20 lg:flex-row lg:justify-between">
          <Skeleton className="h-72 w-60 rounded-2xl bg-white/10 lg:h-[28rem] lg:w-80" />
          <Skeleton className="h-72 w-52 rounded-2xl bg-gold/15 lg:h-[22rem] lg:w-64" />
        </div>
      </section>

      <div className="h-14 border-y border-gold/20 bg-[#1c0807]" />

      <section className="bg-cream py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:px-10">
          <Skeleton className="h-[420px] rounded-[46%_46%_1.75rem_1.75rem] bg-ink/10" />
          <div className="space-y-4">
            <SectionHeadingSkeleton />
            <Skeleton className="h-24 rounded-2xl bg-ink/8" />
            <Skeleton className="h-12 w-48 rounded-full bg-ink/12" />
          </div>
        </div>
      </section>

      <QuoteSkeleton />
    </div>
  );
}
