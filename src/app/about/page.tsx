import type { Metadata } from "next";
import { socialMeta } from "@/lib/seo";
import AboutChoreography from "@/components/about/AboutChoreography";
import { awards, brand } from "@/lib/data";

export const metadata: Metadata = {

  title: "Spiritual Mentor in Mumbai — 30+ Years",
  description:
    "Meet Dr. Manisha Belvalkar, a spiritual mentor in Mumbai with 30+ years of experience in Tarot, Soul Purpose Reading, Goddess Attunement and Chakra Therapy.",
  alternates: { canonical: "/about" },
  ...socialMeta({ title: "Spiritual Mentor in Mumbai — 30+ Years", description: "Meet Dr. Manisha Belvalkar, a spiritual mentor in Mumbai with 30+ years of experience in Tarot, Soul Purpose Reading, Goddess Attunement and Chakra Therapy.", image: "/images/manisha/manisha-about-presence.webp", path: "/about" }),
};

export default function AboutPage() {
  const award = awards[0];

  return (
    <AboutChoreography
      award={
        award
          ? { title: award.title, description: award.description }
          : undefined
      }
      whatsappHref={brand.whatsappHref}
    />
  );
}
