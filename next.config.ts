import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [], // no remote images; all local in /public
  },
  async redirects() {
    // /books was renamed to the Products storefront. These must be real HTTP
    // 308s served from config — a permanentRedirect() inside a page component
    // only redirects client-side, which leaves crawlers on an HTTP 200 page
    // with an empty <main> and no canonical (a soft 404).
    return [
      { source: "/books", destination: "/products", permanent: true },
      { source: "/books/:slug", destination: "/products/:slug", permanent: true },
      // Catalog stubs that were never published: real 308s, no soft 404s.
      { source: "/products/shakti-combo-pack", destination: "/products", permanent: true },
      { source: "/products/whatsapp-workshops", destination: "/products", permanent: true },
    ];
  },
  async headers() {
    // Content-Security-Policy is generated per-request in src/proxy.ts
    // (nonce-based strict CSP — no 'unsafe-inline' for scripts).
    return [{
      source: "/(.*)",
      headers: [
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      ],
    }, {
      // Allow camera/microphone strictly inside the authenticated Daily.co video session room.
      source: "/account/bookings/:id/room",
      headers: [
        { key: "Permissions-Policy", value: "camera=*, microphone=*, fullscreen=*, display-capture=*, geolocation=()" },
      ],
    }, {
      source: "/images/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
    }, {
      source: "/videos/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
    }];
  },
};

export default nextConfig;