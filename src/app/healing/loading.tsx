import { Skeleton } from "@/components/shadcn/skeleton";

export default function HealingLoading() {
  return (
    <div className="animate-pulse bg-[#fdf8f0]">
      <section className="px-4 pb-8 pt-20 sm:px-10 sm:pb-16 sm:pt-24 lg:pb-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-6 sm:gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
          <div>
            <Skeleton className="h-3 w-36 bg-ink/10 sm:w-44" />
            <Skeleton className="mt-3 h-10 w-5/6 rounded-xl bg-ink/10 sm:mt-6 sm:h-14" />
            <Skeleton className="mt-2 h-10 w-3/4 rounded-xl bg-ink/10 sm:mt-3 sm:h-14" />
            <Skeleton className="mt-3 h-3.5 w-full max-w-xl bg-ink/10 sm:mt-6 sm:h-4" />
            <Skeleton className="mt-2 h-3.5 w-4/5 max-w-lg bg-ink/10 sm:h-4" />
            <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-8 sm:flex sm:gap-3">
              <Skeleton className="h-10 w-full rounded-full bg-ink/10 sm:h-12 sm:w-48" />
              <Skeleton className="h-10 w-full rounded-full bg-ink/10 sm:h-12 sm:w-36" />
            </div>
          </div>
          <div className="mx-auto w-full max-w-[248px] sm:max-w-[440px]">
            <Skeleton className="aspect-[4/3.5] w-full rounded-t-[999px] rounded-b-[1.5rem] bg-ink/10 sm:aspect-[3/4] sm:rounded-b-[2rem]" />
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-10 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-[1200px]">
          <Skeleton className="h-8 w-64 rounded-xl bg-ink/10 sm:h-10 sm:w-80" />
          <div className="mt-5 grid gap-4 sm:mt-10 sm:gap-6 lg:grid-cols-12">
            <Skeleton className="h-[320px] rounded-2xl bg-ink/10 sm:h-[460px] sm:rounded-[2rem] lg:col-span-7" />
            <Skeleton className="h-[320px] rounded-2xl bg-ink/10 sm:h-[460px] sm:rounded-[2rem] lg:col-span-5" />
          </div>
        </div>
      </section>
    </div>
  );
}
