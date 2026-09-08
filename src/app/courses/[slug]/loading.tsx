import { HeroSkeleton, DetailSkeleton } from "@/components/skeletons/PageSkeletons";

export default function CoursesDetailLoading() {
  return (
    <div className="animate-pulse">
      <HeroSkeleton />
      <DetailSkeleton />
    </div>
  );
}