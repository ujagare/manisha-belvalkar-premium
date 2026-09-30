import type { Metadata } from "next";
import HeroSlider from "@/components/home/HeroSlider";
import ServicesPreview from "@/components/home/ServicesPreview";
import HomeFAQ from "@/components/home/HomeFAQ";
import Testimonials from "@/components/home/Testimonials";
import ChakraAssessment from "@/components/home/ChakraAssessment";
import DistanceHealingExperience from "@/components/home/DistanceHealingExperience";

export const metadata: Metadata = {
  title: {
    absolute: "Manisha Belvalkar — Spiritual Mentor | Guidance For the Soul",
  },
  description:
    "Book a Tarot Consultation, Soul Purpose Reading, Goddess Attunement or Chakra Therapy session with Dr. Manisha Belvalkar — 30+ years of experience. Mumbai & Pune.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <ServicesPreview />
      <DistanceHealingExperience />
      <ChakraAssessment />
      <HomeFAQ />
      <Testimonials />
    </>
  );
}
