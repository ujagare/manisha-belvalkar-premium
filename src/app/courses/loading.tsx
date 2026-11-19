import { Skeleton } from "@/components/shadcn/skeleton";

export default function CoursesLoading() {
  return (
    <div className="animate-pulse bg-[#fdf8f0]">
      <section className="px-4 pb-12 pt-20 sm:px-10 sm:pb-20 sm:pt-24 lg:pb-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
          <div className="space-y-5">
            <Skeleton className="h-3 w-44 bg-[#981313]/20" />
            <Skeleton className="h-12 w-3/4 rounded-lg bg-[#292524]/10 sm:h-16" />
            <Skeleton className="h-12 w-2/3 rounded-lg bg-[#b41414]/15 sm:h-16" />
            <Skeleton className="h-4 w-full max-w-lg bg-[#292524]/10" />
            <Skeleton className="h-4 w-4/5 max-w-md bg-[#292524]/10" />
            <div className="flex gap-3 pt-3">
              <Skeleton className="h-12 w-44 rounded-full bg-[#b41414]/20" />
              <Skeleton className="h-12 w-40 rounded-full bg-[#a8871a]/20" />
            </div>
          </div>
          <div className="mx-auto w-full max-w-[470px]">
            <Skeleton className="aspect-[4/4.2] w-full rounded-t-[999px] rounded-b-[2rem] bg-[#efe5d2]" />
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto max-w-[1200px] space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-10 w-80 rounded-lg bg-[#292524]/10" />
            <Skeleton className="h-4 w-full max-w-xl bg-[#292524]/10" />
          </div>
          <div className="flex flex-wrap gap-2.5 border-b border-[#6b0b0b]/10 pb-6">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-11 w-36 rounded-full bg-[#efe5d2]" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <Skeleton className="h-[520px] rounded-[2rem] bg-[#efe5d2]/80 lg:col-span-7" />
            <Skeleton className="h-[520px] rounded-[2rem] bg-[#efe5d2]/80 lg:col-span-5" />
          </div>
        </div>
      </section>
    </div>
  );
}
