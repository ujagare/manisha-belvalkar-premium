import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database, ProductRow } from "@/lib/supabase/database.types";
import type { ProductCategory } from "@/lib/supabase/models";
import { products as staticProducts } from "@/lib/data";
import type { Product } from "@/lib/data";

/**
 * Typed product-catalog helpers (the products counterpart of session.ts).
 *
 * Reads the public.products catalog through an anonymous client — catalog
 * data is public and never needs the visitor's auth cookies, so these
 * calls do not force routes into dynamic rendering. When Supabase is not
 * configured yet (placeholder env) or the fetch fails, the static catalog
 * from data.ts is returned so the storefront always renders.
 */

/** Anonymous, read-only Supabase client for public catalog reads. */
function createCatalogClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // Read-only public access — no session cookies to persist.
        },
      },
    },
  );
}

/** Map a DB row (numeric → string, jsonb → Json) onto the UI Product shape. */
function toProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? "",
    description: row.description,
    category: row.category as ProductCategory,
    price: Number(row.price),
    salePrice: row.sale_price != null ? Number(row.sale_price) : undefined,
    badge: row.badge ?? undefined,
    image: row.image ?? "/images/gold-abstract.jpg",
    details: Array.isArray(row.details)
      ? row.details.filter((d): d is string => typeof d === "string")
      : [],
    featured: row.featured,
  };
}

/**
 * All active storefront products (DB-backed when configured, static
 * fallback otherwise). Ordered by sort_order, then creation time.
 */
export const getProducts = cache(async (): Promise<Product[]> => {
  if (!isSupabaseConfigured()) return staticProducts;

  try {
    const supabase = createCatalogClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw error;
    if (!data || data.length === 0) return staticProducts;

    return data.map(toProduct);
  } catch (err) {
    // Catalog read failed (network/permissions) — fall back to the static
    // catalog so the storefront never breaks because of the DB.
    console.warn("[products] DB read failed, using static catalog:", err);
    return staticProducts;
  }
});

/** One active product by slug (null when unknown/inactive). */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}
