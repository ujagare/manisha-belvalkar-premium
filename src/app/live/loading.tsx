import { HeroSkeleton, SectionHeadingSkeleton, CardGridSkeleton } from "@/components/skeletons/PageSkeletons";

export default function LiveLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <CardGridSkeleton count={2} cols={2} />
        </div>
      </section>
    </div>
  );
}