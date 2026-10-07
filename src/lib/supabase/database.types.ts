/**
 * Typed Supabase schema for the Manisha Belvalkar platform.
 *
 * These types mirror supabase/schema.sql. If you change the SQL,
 * regenerate these with:
 *   npx supabase gen types typescript --project-id <ref> --schema public
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      /** Public profile — one row per auth.users row (auto-created). */
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      /** Purchase / booking intent raised from the login-gated checkout. */
      orders: {
        Row: {
          id: string;
          user_id: string;
          item_type: string;
          item_slug: string;
          item_title: string;
          amount: number | null;
          amount_subunits: number | null;
          currency: string;
          status: string;
          payment_status: string;
          fulfillment_status: string;
          gateway_order_id: string | null;
          idempotency_key: string | null;
          address_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_type: string;
          item_slug: string;
          item_title: string;
          amount?: number | null;
          amount_subunits?: number | null;
          currency?: string;
          status?: string;
          payment_status?: string;
          fulfillment_status?: string;
          gateway_order_id?: string | null;
          idempotency_key?: string | null;
          address_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_type?: string;
          item_slug?: string;
          item_title?: string;
          amount?: number | null;
          amount_subunits?: number | null;
          currency?: string;
          status?: string;
          payment_status?: string;
          fulfillment_status?: string;
          gateway_order_id?: string | null;
          idempotency_key?: string | null;
          address_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_address_id_fkey";
            columns: ["address_id"];
            isOneToOne: false;
            referencedRelation: "addresses";
            referencedColumns: ["id"];
          },
        ];
      };
      /** Saved customer delivery/contact addresses (per user). */
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          recipient_name: string;
          phone: string;
          line1: string;
          line2: string | null;
          city: string;
          state: string;
          postal_code: string;
          country_code: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label?: string;
          recipient_name: string;
          phone: string;
          line1: string;
          line2?: string | null;
          city: string;
          state: string;
          postal_code: string;
          country_code?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          label?: string;
          recipient_name?: string;
          phone?: string;
          line1?: string;
          line2?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          country_code?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      /** Line items belonging to an order. */
      order_items: {
        Row: {
          id: string;
          order_id: string;
          item_type: string;
          item_slug: string;
          title: string;
          quantity: number;
          unit_amount_subunits: number | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          item_type: string;
          item_slug: string;
          title: string;
          quantity?: number;
          unit_amount_subunits?: number | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          item_type?: string;
          item_slug?: string;
          title?: string;
          quantity?: number;
          unit_amount_subunits?: number | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      /** Payment attempts per order (Razorpay). */
      payments: {
        Row: {
          id: string;
          order_id: string;
          provider: string;
          provider_order_id: string;
          provider_payment_id: string | null;
          amount_subunits: number;
          currency: string;
          status: string;
          method: string | null;
          captured_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          provider?: string;
          provider_order_id: string;
          provider_payment_id?: string | null;
          amount_subunits: number;
          currency?: string;
          status?: string;
          method?: string | null;
          captured_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          provider?: string;
          provider_order_id?: string;
          provider_payment_id?: string | null;
          amount_subunits?: number;
          currency?: string;
          status?: string;
          method?: string | null;
          captured_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      /** Physical fulfilment / tracking per order. */
      shipments: {
        Row: {
          id: string;
          order_id: string;
          address_id: string | null;
          carrier: string | null;
          tracking_number: string | null;
          tracking_url: string | null;
          status: string;
          shipped_at: string | null;
          delivered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          address_id?: string | null;
          carrier?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          status?: string;
          shipped_at?: string | null;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          address_id?: string | null;
          carrier?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          status?: string;
          shipped_at?: string | null;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: true;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      /** Public storefront catalog — readable by all, writable via dashboard. */
      products: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          description: string;
          category: string;
          price: number;
          sale_price: number | null;
          badge: string | null;
          image: string | null;
          details: Json;
          featured: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          description: string;
          category: string;
          price: number;
          sale_price?: number | null;
          badge?: string | null;
          image?: string | null;
          details?: Json;
          featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          subtitle?: string | null;
          description?: string;
          category?: string;
          price?: number;
          sale_price?: number | null;
          badge?: string | null;
          image?: string | null;
          details?: Json;
          featured?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

/** Row types exported for ergonomic imports. */
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type AddressInsert = Database["public"]["Tables"]["addresses"]["Insert"];
export type Shipment = Database["public"]["Tables"]["shipments"]["Row"];
export type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];
export type PaymentRow = Database["public"]["Tables"]["payments"]["Row"];
export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

/** Supported purchasable item kinds. */
export type OrderItemType = "service" | "course" | "product" | "healing";

/** Order lifecycle status. */
export type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled";

/** Product storefront categories (mirrors products.category check). */
export type ProductCategory = "book" | "oracle" | "ritual";
