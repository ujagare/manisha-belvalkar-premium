import { Skeleton } from "@/components/shadcn/skeleton";

/**
 * Minimal loading state for auth pages (login/signup/forgot-password etc.).
 * Mirrors the AuthShell split layout — left panel dark, right form skeleton.
 */
export default function AuthLoading() {
  return (
    <section className="relative min-h-screen bg-cream">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        {/* Brand panel skeleton */}
        <div className="relative hidden items-end overflow-hidden bg-charcoal p-14 lg:flex">
          <div className="relative z-10 w-full">
            <Skeleton className="h-3 w-20 bg-gold/40" />
            <Skeleton className="mt-5 h-16 w-3/4 rounded-xl bg-white/15" />
            <Skeleton className="mt-3 h-16 w-1/2 rounded-xl bg-white/10" />
            <Skeleton className="mt-8 h-3 w-28 bg-white/15" />
          </div>
        </div>

        {/* Form panel skeleton */}
        <div className="flex items-center justify-center px-6 py-16 sm:px-10 lg:py-24">
          <div className="w-full max-w-md space-y-8">
            <Skeleton className="h-3 w-24 bg-gold/40" />
            <Skeleton className="h-12 w-4/5 rounded-xl bg-ink/10" />
            <Skeleton className="h-3 w-2/3 bg-ink/10" />
            <div className="space-y-5">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <Skeleton className="mb-2 h-3 w-20 bg-ink/10" />
                  <Skeleton className="h-11 w-full rounded-xl bg-ink/10" />
                </div>
              ))}
              <Skeleton className="h-11 w-full rounded-full bg-gold/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}