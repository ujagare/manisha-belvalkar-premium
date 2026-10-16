const PRODUCTION_SITE_URL = "https://www.manishabelvalkar.com";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return window.location.origin;
  }
  return PRODUCTION_SITE_URL;
}
