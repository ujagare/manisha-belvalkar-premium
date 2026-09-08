import { HeroSkeleton, DetailSkeleton } from "@/components/skeletons/PageSkeletons";

export default function ServicesDetailLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <DetailSkeleton />
    </div>
  );
}