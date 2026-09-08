import TestimonialsMarquee from "@/components/home/TestimonialsMarquee";
import GoldDivider from "@/components/ui/GoldDivider";

/**
 * Testimonials section — heading plus the premium light marquee of
 * client words scrolling in two opposing rows.
 */
export default function TestimonialsSection() {
  return (
    <>
      <TestimonialsMarquee />
      <GoldDivider />
    </>
  );
}
