import type { Metadata } from "next";
import { socialMeta } from "@/lib/seo";
import HomeBelowFold from "@/components/home/HomeBelowFold";
import ShaktiCardReading from "@/components/shakti/ShaktiCardReading";

export const metadata: Metadata = {

  title: {
    absolute: "Manisha Belvalkar — Spiritual Mentor | Guidance For the Soul",
  },
  description:
    "Tarot consultation, soul purpose reading, Goddess attunement and chakra therapy with Dr. Manisha Belvalkar — 30+ years of practice. Mumbai, Pune and online.",
  alternates: { canonical: "/" },
  ...socialMeta({ title: "Manisha Belvalkar — Spiritual Mentor | Guidance For the Soul", description: "Tarot consultation, soul purpose reading, Goddess attunement and chakra therapy with Dr. Manisha Belvalkar — 30+ years of practice. Mumbai, Pune and online.", image: "/images/manisha/manisha-courses-mentor.webp", path: "/" }),
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
