import {
  HeroSkeleton,
  SectionHeadingSkeleton,
  CardGridSkeleton,
} from "@/components/skeletons/PageSkeletons";

export default function ProductsLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <CardGridSkeleton count={3} cols={3} image />
        </div>
      </section>
    </div>
  );
}
