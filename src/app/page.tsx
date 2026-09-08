import HeroSlider from "@/components/home/HeroSlider";
import AboutSummary from "@/components/home/AboutSummary";
import ShaktiPreview from "@/components/home/ShaktiPreview";
import MentoringPreview from "@/components/home/MentoringPreview";
import HealingPreview from "@/components/home/HealingPreview";
import TransformationHighlight from "@/components/home/TransformationHighlight";
import ServicesPreview from "@/components/home/ServicesPreview";
import Testimonials from "@/components/home/Testimonials";
import EcosystemPreview from "@/components/home/EcosystemPreview";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <AboutSummary />
      <ShaktiPreview />
      <MentoringPreview />
      <HealingPreview />
      <TransformationHighlight />
      <ServicesPreview />
      <Testimonials />
      <EcosystemPreview />
      <CTASection />
    </>
  );
}