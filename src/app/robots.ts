import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/account/", "/checkout/", "/login", "/signup", "/app/"],
      },
    ],
    sitemap: "https://www.manishabelvalkar.com/sitemap.xml",
    host: "https://www.manishabelvalkar.com",
  };
}
