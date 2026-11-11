export const CART_STORAGE_KEY = "mb-shop-cart-v1";

export interface CartItem {
  slug: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export const MAX_CART_QUANTITY = 20;

export function normalizeCartItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const candidate = item as Partial<CartItem>;
    if (
      typeof candidate.slug !== "string" ||
      typeof candidate.title !== "string" ||
      typeof candidate.image !== "string" ||
      typeof candidate.price !== "number" ||
      !Number.isFinite(candidate.price)
    ) return [];

    const quantity = typeof candidate.quantity === "number" && Number.isFinite(candidate.quantity)
      ? candidate.quantity
      : 1;

    return [{
      slug: candidate.slug.slice(0, 100),
      title: candidate.title.slice(0, 200),
      image: candidate.image,
      price: Math.max(0, candidate.price),
      quantity: Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(quantity))),
    }];
  });
}

export function cartState(items: CartItem[]) {
  return items.length === 0 ? "empty" as const : "ready" as const;
}
