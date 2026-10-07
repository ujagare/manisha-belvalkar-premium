import type { Metadata } from "next";
import HomeBelowFold from "@/components/home/HomeBelowFold";
import ShaktiCardReading from "@/components/shakti/ShaktiCardReading";

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
      <div id="oracle-reading" className="scroll-mt-24">
        <ShaktiCardReading showBuyButton />
      </div>
      <HomeBelowFold />
    </>
  );
}
