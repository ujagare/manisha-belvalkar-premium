import { HeroSkeleton, DetailSkeleton } from "@/components/skeletons/PageSkeletons";

export default function HealingDetailLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <DetailSkeleton />
    </div>
  );
}