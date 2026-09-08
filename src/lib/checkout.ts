import { services, courses, healingServices } from "@/lib/data";
import type { OrderItemType } from "@/lib/supabase/database.types";
import { getProductBySlug } from "@/lib/supabase/products";

/**
 * Unified purchasable item view used by the login-gated checkout.
 * Resolves a (type, slug) pair from the site's static catalog.
 */
export interface CatalogItem {
  type: OrderItemType;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
  price: number | null;
  priceLabel: string;
  href: string;
}

function itemHref(type: OrderItemType, slug: string) {
  return `/${type === "healing" ? "healing" : `${type}s`}/${slug}`;
}

/** Look up an item across the whole catalog. Returns null when unknown. */
export async function getCatalogItem(
  type: OrderItemType,
  slug: string,
): Promise<CatalogItem | null> {
  if (type === "service") {
    const s = services.find((x) => x.slug === slug);
    if (!s) return null;
    return {
      type,
      slug: s.slug,
      title: s.title,
      description: s.description,
      image: s.image,
      price: s.price > 0 ? s.price : null,
      priceLabel: s.price > 0 ? `₹${s.price.toLocaleString("en-IN")}` : "By Appointment",
      href: itemHref(type, s.slug),
    };
  }

  if (type === "course") {
    const c = courses.find((x) => x.slug === slug);
    if (!c) return null;
    return {
      type,
      slug: c.slug,
      title: c.title,
      description: c.description,
      image: c.image,
      price: null,
      priceLabel: "By consultation",
      href: itemHref(type, c.slug),
    };
  }

  if (type === "product") {
    // DB-backed catalog (dashboard products included), static fallback.
    const p = await getProductBySlug(slug);
    if (!p) return null;
    return {
      type,
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle,
      description: p.description,
      image: p.image,
      price: p.price > 0 ? p.price : null,
      priceLabel: p.price > 0 ? `₹${p.price.toLocaleString("en-IN")}` : "On request",
      href: itemHref(type, p.slug),
    };
  }

  if (type === "healing") {
    const h = healingServices.find((x) => x.slug === slug);
    if (!h) return null;
    return {
      type,
      slug: h.slug,
      title: h.title,
      description: h.description,
      image: h.image,
      price: null,
      priceLabel: "By consultation",
      href: itemHref(type, h.slug),
    };
  }

  return null;
}

/** Valid order types (matches the orders.item_type check constraint). */
export const orderTypes: OrderItemType[] = ["service", "course", "product", "healing"];
