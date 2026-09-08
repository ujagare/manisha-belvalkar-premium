import {
  HeroSkeleton,
  SectionHeadingSkeleton,
  CardGridSkeleton,
  QuoteSkeleton,
} from "@/components/skeletons/PageSkeletons";

export default function CommunityLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <SectionHeadingSkeleton />
          <CardGridSkeleton count={4} cols={4} />
        </div>
      </section>
      <QuoteSkeleton />
    </div>
  );
}