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
      /** A user's enrollment in a course (My Courses library). */
      course_enrollments: {
        Row: {
          id: string;
          user_id: string;
          order_id: string | null;
          course_slug: string;
          cohort_id: string | null;
          status: string;
          enrolled_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_id?: string | null;
          course_slug: string;
          cohort_id?: string | null;
          status?: string;
          enrolled_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_id?: string | null;
          course_slug?: string;
          cohort_id?: string | null;
          status?: string;
          enrolled_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_enrollments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      /** Per-user progress for recorded course lessons. */
      course_lesson_progress: {
        Row: {
          user_id: string;
          course_slug: string;
          lesson_id: string;
          completed: boolean;
          watched_seconds: number;
          last_watched_at: string;
          completed_at: string | null;
        };
        Insert: {
          user_id: string;
          course_slug: string;
          lesson_id: string;
          completed?: boolean;
          watched_seconds?: number;
          last_watched_at?: string;
          completed_at?: string | null;
        };
        Update: {
          completed?: boolean;
          watched_seconds?: number;
          last_watched_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      /** A healing/mentoring service session booking request. */
      bookings: {
        Row: {
          id: string;
          user_id: string;
          order_id: string | null;
          offering_type: string;
          offering_slug: string;
          format: string;
          requested_start: string | null;
          timezone: string;
          notes: string | null;
          meeting_url: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_id?: string | null;
          offering_type: string;
          offering_slug: string;
          format?: string;
          requested_start?: string | null;
          timezone?: string;
          notes?: string | null;
          meeting_url?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          order_id?: string | null;
          offering_type?: string;
          offering_slug?: string;
          format?: string;
          requested_start?: string | null;
          timezone?: string;
          notes?: string | null;
          meeting_url?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      distance_healing_cases: {
        Row: {
          id: string; order_id: string; user_id: string;
          submission_method: "website" | "whatsapp" | null;
          intention: string | null; source_photo_path: string | null;
          result_photo_path: string | null; music_path: string | null;
          status: "awaiting_submission" | "submitted" | "in_progress" | "ready" | "delivered" | "completed" | "cancelled";
          submitted_at: string | null; processing_started_at: string | null;
          ready_at: string | null; delivered_at: string | null; completed_at: string | null;
          retention_delete_after: string | null; staff_notes: string | null;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; order_id: string; user_id: string;
          submission_method?: "website" | "whatsapp" | null;
          intention?: string | null; source_photo_path?: string | null;
          result_photo_path?: string | null; music_path?: string | null;
          status?: "awaiting_submission" | "submitted" | "in_progress" | "ready" | "delivered" | "completed" | "cancelled";
          submitted_at?: string | null; processing_started_at?: string | null;
          ready_at?: string | null; delivered_at?: string | null; completed_at?: string | null;
          retention_delete_after?: string | null; staff_notes?: string | null;
          created_at?: string; updated_at?: string;
        };
        Update: {
          submission_method?: "website" | "whatsapp" | null; intention?: string | null;
          source_photo_path?: string | null; result_photo_path?: string | null; music_path?: string | null;
          status?: "awaiting_submission" | "submitted" | "in_progress" | "ready" | "delivered" | "completed" | "cancelled";
          submitted_at?: string | null; processing_started_at?: string | null;
          ready_at?: string | null; delivered_at?: string | null; completed_at?: string | null;
          retention_delete_after?: string | null; staff_notes?: string | null; updated_at?: string;
        };
        Relationships: [];
      };
      distance_healing_feedback: {
        Row: { id: string; case_id: string; user_id: string; rating: number; message: string; publication_consent: "private" | "anonymous" | "first_name"; created_at: string };
        Insert: { id?: string; case_id: string; user_id: string; rating: number; message: string; publication_consent?: "private" | "anonymous" | "first_name"; created_at?: string };
        Update: Record<string, never>;
        Relationships: [];
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
export type CourseEnrollmentRow = Database["public"]["Tables"]["course_enrollments"]["Row"];
export type CourseLessonProgressRow = Database["public"]["Tables"]["course_lesson_progress"]["Row"];
export type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
export type DistanceHealingCase = Database["public"]["Tables"]["distance_healing_cases"]["Row"];
export type DistanceHealingFeedback = Database["public"]["Tables"]["distance_healing_feedback"]["Row"];
export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

/** Supported purchasable item kinds. */
export type OrderItemType = "service" | "course" | "product" | "healing" | "mentoring";

/** Order lifecycle status. */
export type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled";

/** Product storefront categories (mirrors products.category check). */
export type ProductCategory = "book" | "oracle" | "ritual";
