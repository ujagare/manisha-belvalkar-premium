import type { MetadataRoute } from "next";
import {
  services,
  healingServices,
  mentoringAreas,
  products,
} from "@/lib/data";
import { insights } from "@/lib/insights";
import { getCourses } from "@/lib/supabase/courses";

const BASE = "https://www.manishabelvalkar.com";

/** Slugs that are catalog stubs only and must never be indexed. */
const UNPUBLISHED_PRODUCT_SLUGS = new Set(["shakti-combo-pack", "whatsapp-workshops"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Each deploy rebuilds the sitemap, so this is the real last-modified time
  // for static/catalog URLs. Insights below use their own dateModified.
  const now = new Date();
  const courses = await getCourses();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/shakti`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/mentoring`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/healing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/courses`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/collections/oracle`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/collections/book`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/collections/ritual`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/community`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/media`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/testimonials`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/track-order`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/events`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/insights`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/editorial-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms-and-conditions`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/refund-cancellation-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/shipping-delivery-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/grievance-redressal`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
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

  const productPages: MetadataRoute.Sitemap = products
    .filter((p) => !UNPUBLISHED_PRODUCT_SLUGS.has(p.slug))
    .map((p) => ({
      url: `${BASE}/products/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const eventPages: MetadataRoute.Sitemap = [
    "online-guidance-session",
    "live-online-workshop",
  ].map((slug) => ({
    url: `${BASE}/events/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const insightPages: MetadataRoute.Sitemap = insights.map((article) => ({
    url: `${BASE}/insights/${article.slug}`,
    lastModified: new Date(article.dateModified),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...servicePages,
    ...coursePages,
    ...healingPages,
    ...mentoringPages,
    ...productPages,
    ...eventPages,
    ...insightPages,
  ];
}
