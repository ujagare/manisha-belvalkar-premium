import { Skeleton } from "@/components/shadcn/skeleton";

export default function ContactLoading() {
  return (
    <div className="animate-pulse overflow-x-clip bg-[#fdf8f0]">
      {/* Split Hero Skeleton */}
      <section className="px-4 pb-12 pt-20 sm:px-10 sm:pb-20 sm:pt-24 lg:min-h-[calc(100dvh-1rem)] lg:pb-24">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:gap-16">
          <div className="space-y-6">
            <Skeleton className="h-3.5 w-48 rounded-full bg-[#efe5d2]" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-4/5 rounded-xl bg-[#efe5d2]" />
              <Skeleton className="h-12 w-3/5 rounded-xl bg-[#b41414]/15" />
            </div>
            <Skeleton className="h-5 w-full max-w-lg rounded-lg bg-[#efe5d2]" />
            <div className="flex flex-wrap gap-3 pt-2">
              <Skeleton className="h-12 w-48 rounded-full bg-[#b41414]/20" />
              <Skeleton className="h-12 w-44 rounded-full bg-[#efe5d2]" />
            </div>
            <div className="grid grid-cols-3 gap-5 border-t border-[#6b0b0b]/10 pt-6">
              {[0, 1, 2].map((item) => (
                <div key={item} className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-[#efe5d2]" />
                  <Skeleton className="h-3.5 w-32 bg-[#efe5d2]/70" />
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[460px]">
            <div className="rounded-t-[999px] rounded-b-[2rem] bg-[#efe5d2]/70 p-2">
              <Skeleton className="aspect-[3/4] w-full rounded-t-[999px] rounded-b-[1.5rem] bg-[#e6d9bf]" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Desk Skeleton */}
      <section className="bg-[#f8f3e9] px-4 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4 rounded-xl bg-[#efe5d2]" />
            <Skeleton className="h-5 w-full max-w-md rounded-lg bg-[#efe5d2]" />
            <div className="border-t border-[#6b0b0b]/10 pt-2">
              {[0, 1, 2, 3].map((row) => (
                <div key={row} className="flex items-center justify-between border-b border-[#6b0b0b]/10 py-5">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24 bg-[#efe5d2]" />
                    <Skeleton className="h-5 w-52 bg-[#efe5d2]" />
                  </div>
                  <Skeleton className="size-8 rounded-full bg-[#efe5d2]" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#efe5d2]/70 p-2">
            <div className="space-y-5 rounded-[1.5rem] bg-[#fffdf9] p-8 sm:p-10">
              <Skeleton className="h-8 w-56 rounded-lg bg-[#efe5d2]" />
              <div className="grid gap-5 sm:grid-cols-2">
                <Skeleton className="h-12 w-full rounded-xl bg-[#f7f0e3]" />
                <Skeleton className="h-12 w-full rounded-xl bg-[#f7f0e3]" />
              </div>
              <Skeleton className="h-12 w-full rounded-xl bg-[#f7f0e3]" />
              <Skeleton className="h-32 w-full rounded-xl bg-[#f7f0e3]" />
              <Skeleton className="h-12 w-full rounded-full bg-[#b41414]/20" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
