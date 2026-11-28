import type { Metadata } from "next";
import { socialMeta } from "@/lib/seo";

import ServicesChoreography from "@/components/services/ServicesChoreography";
import {
  courses,
  healingServices,
  mentoringAreas,
  services,
} from "@/lib/data";

export const metadata: Metadata = {

  title: "Tarot Consultation in Mumbai & Pune",
  description:
    "Personal Tarot consultation, chakra therapy and soul purpose reading with Dr. Manisha Belvalkar — 30+ years of practice in Mumbai, Pune and online.",
  alternates: { canonical: "/services" },
  ...socialMeta({ title: "Tarot Consultation in Mumbai & Pune", description: "Personal Tarot consultation, chakra therapy and soul purpose reading with Dr. Manisha Belvalkar — 30+ years of practice in Mumbai, Pune and online.", image: "/images/page-heroes/services-hero-luxury.webp", path: "/services" }),
};

export default function ServicesPage() {
  const tarotServices = services.filter(
    (service) => !service.slug.includes("well-being"),
  );
  const wellbeingServices = services.filter((service) =>
    service.slug.includes("well-being"),
  );
  const featuredCourse = courses.find(
    (course) => course.slug === "personalized-wellbeing",
  );

  return (
    <ServicesChoreography
      tarotServices={tarotServices}
      wellbeingServices={wellbeingServices}
      healingServices={healingServices}
      mentoringAreas={mentoringAreas}
      featuredCourse={featuredCourse}
    />
  );
}
