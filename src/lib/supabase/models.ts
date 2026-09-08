import type {
  Database,
  Order,
  OrderItemType,
  OrderStatus,
  ProductCategory,
  ProductRow,
  Profile,
} from "@/lib/supabase/database.types";

/* ============================================================
   Domain models — the single source of truth for the auth/user
   and checkout data shapes used across the app.

   Components, pages and API routes import THESE types instead of
   hand-rolling shapes, so a later change is caught by the compiler
   everywhere it matters.
   ============================================================ */

/** What the rest of the app may rely on about a signed-in user. */
export interface SessionUser {
  /** Supabase auth.users id (UUID). */
  id: string;
  /** Primary email. */
  email: string | null;
  /** Display name from user metadata or the profiles table. */
  fullName: string | null;
  /** Avatar URL from the OAuth provider, if any. */
  avatarUrl: string | null;
  /** When the account was created. */
  createdAt: string | null;
}

/** Full profile row as stored in public.profiles. */
export type UserProfile = Profile;

/** Profile fields the account page may update. */
export interface ProfileUpdateInput {
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
}

/** A purchase/booking order as returned to the UI. */
export type UserOrder = Order;

/** Row shape accepted when inserting an order. */
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];

/** Payload accepted by POST /api/orders. */
export interface CreateOrderRequest {
  type: OrderItemType;
  slug: string;
}

/** Success payload of POST /api/orders. */
export interface CreateOrderResponse {
  order: Order;
}

/** Standard error payload shared by API routes. */
export interface ApiErrorResponse {
  error: string;
}

/* ============================================================
   Product catalog models (public.products)
   ============================================================ */

/** Raw catalog row as stored in public.products. */
export type ProductRecord = ProductRow;

/** Row shape accepted when inserting/updating a product (dashboard / seed). */
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

/** Storefront categories (single source of truth — mirrors the SQL check). */
export const PRODUCT_CATEGORIES: readonly ProductCategory[] = [
  "book",
  "oracle",
  "ritual",
] as const;

export type { ProductCategory };

/** Order statuses exposed to the UI (single source of truth). */
export const ORDER_STATUSES: readonly OrderStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type { OrderItemType, OrderStatus };
