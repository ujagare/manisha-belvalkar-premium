import { Skeleton } from "@/components/shadcn/skeleton";

export default function CoursesLoading() {
  return (
    <div className="animate-pulse bg-[#fdf8f0]">
      <section className="px-4 pb-7 pt-20 sm:px-10 sm:pb-20 sm:pt-24 lg:pb-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-5 sm:gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
          <div className="space-y-3 sm:space-y-5">
            <Skeleton className="h-3 w-36 bg-[#981313]/20 sm:w-44" />
            <Skeleton className="h-10 w-3/4 rounded-lg bg-[#292524]/10 sm:h-16" />
            <Skeleton className="h-10 w-2/3 rounded-lg bg-[#b41414]/15 sm:h-16" />
            <Skeleton className="h-3.5 w-full max-w-lg bg-[#292524]/10 sm:h-4" />
            <Skeleton className="h-3.5 w-4/5 max-w-md bg-[#292524]/10 sm:h-4" />
            <div className="grid grid-cols-2 gap-2 pt-2 sm:flex sm:gap-3 sm:pt-3">
              <Skeleton className="h-10 w-full rounded-full bg-[#b41414]/20 sm:h-12 sm:w-44" />
              <Skeleton className="h-10 w-full rounded-full bg-[#a8871a]/20 sm:h-12 sm:w-40" />
            </div>
          </div>
          <div className="mx-auto w-full max-w-[248px] sm:max-w-[470px]">
            <Skeleton className="aspect-[4/3.5] w-full rounded-t-[999px] rounded-b-[1.5rem] bg-[#efe5d2] sm:aspect-[4/4.2] sm:rounded-b-[2rem]" />
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-[1200px] space-y-5 sm:space-y-8">
          <div className="space-y-2.5 sm:space-y-4">
            <Skeleton className="h-8 w-64 rounded-lg bg-[#292524]/10 sm:h-10 sm:w-80" />
            <Skeleton className="h-3.5 w-full max-w-xl bg-[#292524]/10 sm:h-4" />
          </div>
          <div className="flex flex-wrap gap-1.5 border-b border-[#6b0b0b]/10 pb-4 sm:gap-2.5 sm:pb-6">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-9 w-28 rounded-full bg-[#efe5d2] sm:h-11 sm:w-36" />
            ))}
          </div>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-12 lg:gap-8">
            <Skeleton className="h-[340px] rounded-2xl bg-[#efe5d2]/80 sm:h-[520px] sm:rounded-[2rem] lg:col-span-7" />
            <Skeleton className="h-[340px] rounded-2xl bg-[#efe5d2]/80 sm:h-[520px] sm:rounded-[2rem] lg:col-span-5" />
          </div>
        </div>
      </section>
    </div>
  );
}
