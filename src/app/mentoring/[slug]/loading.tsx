import { HeroSkeleton, DetailSkeleton } from "@/components/skeletons/PageSkeletons";

export default function MentoringDetailLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <DetailSkeleton />
    </div>
  );
}