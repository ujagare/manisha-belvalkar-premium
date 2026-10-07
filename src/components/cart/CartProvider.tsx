"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CART_STORAGE_KEY, MAX_CART_QUANTITY, type CartItem } from "@/lib/cart";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  ready: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function validItems(value: unknown): CartItem[] {
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
    return [{
      slug: candidate.slug.slice(0, 100),
      title: candidate.title.slice(0, 200),
      image: candidate.image,
      price: Math.max(0, candidate.price),
      quantity: Math.min(MAX_CART_QUANTITY, Math.max(1, Math.floor(candidate.quantity ?? 1))),
    }];
  });
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let restored: CartItem[] = [];
    try {
      restored = validItems(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]"));
    } catch {
      restored = [];
    }
    const restore = window.setTimeout(() => {
      setItems(restored);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.slug === item.slug);
      if (!existing) return [...current, { ...item, quantity: Math.min(MAX_CART_QUANTITY, Math.max(1, quantity)) }];
      return current.map((entry) => entry.slug === item.slug
        ? { ...entry, quantity: Math.min(MAX_CART_QUANTITY, entry.quantity + Math.max(1, quantity)) }
        : entry);
    });
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) setItems((current) => current.filter((item) => item.slug !== slug));
    else setItems((current) => current.map((item) => item.slug === slug
      ? { ...item, quantity: Math.min(MAX_CART_QUANTITY, Math.floor(quantity)) }
      : item));
  }, []);
  const removeItem = useCallback((slug: string) => setItems((current) => current.filter((item) => item.slug !== slug)), []);
  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => ({
    items,
    ready,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }), [items, ready, addItem, updateQuantity, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
