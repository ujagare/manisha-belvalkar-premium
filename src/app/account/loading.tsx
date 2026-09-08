import { Skeleton } from "@/components/shadcn/skeleton";

export default function AccountLoading() {
  return (
    <section className="relative overflow-hidden bg-ivory pb-20 pt-32 lg:pt-40">
      <div className="mx-auto max-w-5xl px-6 lg:px-10">
        <div className="flex items-center gap-6 rounded-3xl border border-parchment bg-white p-8 sm:gap-8">
          <Skeleton className="h-20 w-20 shrink-0 rounded-full bg-ink/10" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-56 rounded-lg bg-ink/10" />
            <Skeleton className="h-3 w-64 bg-ink/10" />
          </div>
          <Skeleton className="h-10 w-28 rounded-full bg-ink/10" />
        </div>
        <div className="mt-12 space-y-4">
          <Skeleton className="h-6 w-52 rounded-lg bg-ink/10" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-2xl border border-parchment bg-white p-5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-48 bg-ink/10" />
                <Skeleton className="h-3 w-28 bg-ink/10" />
              </div>
              <Skeleton className="h-8 w-20 rounded-full bg-ink/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
