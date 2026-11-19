import { Skeleton } from "@/components/shadcn/skeleton";

export default function HealingLoading() {
  return (
    <div className="animate-pulse bg-[#fdf8f0]">
      <section className="px-4 pb-16 pt-24 sm:px-10 lg:pb-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
          <div>
            <Skeleton className="h-3 w-44 bg-ink/10" />
            <Skeleton className="mt-6 h-14 w-5/6 rounded-xl bg-ink/10" />
            <Skeleton className="mt-3 h-14 w-3/4 rounded-xl bg-ink/10" />
            <Skeleton className="mt-6 h-4 w-full max-w-xl bg-ink/10" />
            <Skeleton className="mt-2 h-4 w-4/5 max-w-lg bg-ink/10" />
            <div className="mt-8 flex gap-3">
              <Skeleton className="h-12 w-48 rounded-full bg-ink/10" />
              <Skeleton className="h-12 w-36 rounded-full bg-ink/10" />
            </div>
          </div>
          <div className="mx-auto w-full max-w-[440px]">
            <Skeleton className="aspect-[3/4] w-full rounded-t-[999px] rounded-b-[2rem] bg-ink/10" />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-10 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <Skeleton className="h-10 w-80 rounded-xl bg-ink/10" />
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <Skeleton className="h-[460px] rounded-[2rem] bg-ink/10 lg:col-span-7" />
            <Skeleton className="h-[460px] rounded-[2rem] bg-ink/10 lg:col-span-5" />
          </div>
        </div>
      </section>
    </div>
  );
}
