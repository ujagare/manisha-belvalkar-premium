import { HeroSkeleton, DetailSkeleton } from "@/components/skeletons/PageSkeletons";

export default function ProductDetailLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <DetailSkeleton />
    </div>
  );
}
