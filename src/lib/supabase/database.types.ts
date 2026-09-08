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
          currency: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_type: string;
          item_slug: string;
          item_title: string;
          amount?: number | null;
          currency?: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_type?: string;
          item_slug?: string;
          item_title?: string;
          amount?: number | null;
          currency?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
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
export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

/** Supported purchasable item kinds. */
export type OrderItemType = "service" | "course" | "product" | "healing";

/** Order lifecycle status. */
export type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled";

/** Product storefront categories (mirrors products.category check). */
export type ProductCategory = "book" | "oracle" | "ritual";
