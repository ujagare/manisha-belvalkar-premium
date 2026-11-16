import type { Metadata } from "next";
import HomeBelowFold from "@/components/home/HomeBelowFold";
import ShaktiCardReading from "@/components/shakti/ShaktiCardReading";

export const metadata: Metadata = {
  title: {
    absolute: "Manisha Belvalkar — Spiritual Mentor | Guidance For the Soul",
  },
  description:
    "Tarot consultation, soul purpose reading, Goddess attunement and chakra therapy with Dr. Manisha Belvalkar — 30+ years of practice. Mumbai, Pune and online.",
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
