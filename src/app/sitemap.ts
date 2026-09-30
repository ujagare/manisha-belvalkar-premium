import type { MetadataRoute } from "next";
import {
  services,
  courses,
  healingServices,
  mentoringAreas,
  products,
} from "@/lib/data";

const BASE = "https://manishabelvalkar.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/shakti`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/mentoring`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/healing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/courses`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/community`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/media`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/live`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${BASE}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const coursePages: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${BASE}/courses/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const healingPages: MetadataRoute.Sitemap = healingServices.map((h) => ({
    url: `${BASE}/healing/${h.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const mentoringPages: MetadataRoute.Sitemap = mentoringAreas.map((m) => ({
    url: `${BASE}/mentoring/${m.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...servicePages,
    ...coursePages,
    ...healingPages,
    ...mentoringPages,
    ...productPages,
  ];
}
