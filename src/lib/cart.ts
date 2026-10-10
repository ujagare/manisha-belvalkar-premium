export const CART_STORAGE_KEY = "mb-shop-cart-v1";

export interface CartItem {
  slug: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export const MAX_CART_QUANTITY = 20;

export function cartState(items: CartItem[]) {
  return items.length === 0 ? "empty" as const : "ready" as const;
}
