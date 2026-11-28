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
          guest_email: string | null;
          guest_name: string | null;
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
          guest_email?: string | null;
          guest_name?: string | null;
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
          guest_email?: string | null;
          guest_name?: string | null;
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
      /** Physical fulfilment / Shiprocket tracking per order. */
      shipments: {
        Row: {
          id: string;
          order_id: string;
          address_id: string | null;
          provider: string;
          shiprocket_order_id: number | null;
          shiprocket_shipment_id: number | null;
          courier_company_id: number | null;
          awb_code: string | null;
          carrier: string | null;
          tracking_number: string | null;
          tracking_url: string | null;
          pickup_location: string | null;
          pickup_scheduled_date: string | null;
          pickup_token_number: string | null;
          etd: string | null;
          weight_kg: number;
          length_cm: number;
          breadth_cm: number;
          height_cm: number;
          shipping_charge_subunits: number;
          label_url: string | null;
          manifest_url: string | null;
          invoice_url: string | null;
          current_status: string | null;
          current_status_id: number | null;
          last_location: string | null;
          tracking_events: Json;
          last_synced_at: string | null;
          rto_reason: string | null;
          cancelled_at: string | null;
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
          provider?: string;
          shiprocket_order_id?: number | null;
          shiprocket_shipment_id?: number | null;
          courier_company_id?: number | null;
          awb_code?: string | null;
          carrier?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          pickup_location?: string | null;
          pickup_scheduled_date?: string | null;
          pickup_token_number?: string | null;
          etd?: string | null;
          weight_kg?: number;
          length_cm?: number;
          breadth_cm?: number;
          height_cm?: number;
          shipping_charge_subunits?: number;
          label_url?: string | null;
          manifest_url?: string | null;
          invoice_url?: string | null;
          current_status?: string | null;
          current_status_id?: number | null;
          last_location?: string | null;
          tracking_events?: Json;
          last_synced_at?: string | null;
          rto_reason?: string | null;
          cancelled_at?: string | null;
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
          provider?: string;
          shiprocket_order_id?: number | null;
          shiprocket_shipment_id?: number | null;
          courier_company_id?: number | null;
          awb_code?: string | null;
          carrier?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          pickup_location?: string | null;
          pickup_scheduled_date?: string | null;
          pickup_token_number?: string | null;
          etd?: string | null;
          weight_kg?: number;
          length_cm?: number;
          breadth_cm?: number;
          height_cm?: number;
          shipping_charge_subunits?: number;
          label_url?: string | null;
          manifest_url?: string | null;
          invoice_url?: string | null;
          current_status?: string | null;
          current_status_id?: number | null;
          last_location?: string | null;
          tracking_events?: Json;
          last_synced_at?: string | null;
          rto_reason?: string | null;
          cancelled_at?: string | null;
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
      shipment_events: {
        Row: {
          id: string;
          provider: string;
          event_key: string;
          awb_code: string | null;
          shiprocket_order_id: number | null;
          status_code: number | null;
          status_label: string | null;
          payload: Json;
          processed_at: string | null;
          error: string | null;
          received_at: string;
        };
        Insert: {
          id?: string;
          provider?: string;
          event_key: string;
          awb_code?: string | null;
          shiprocket_order_id?: number | null;
          status_code?: number | null;
          status_label?: string | null;
          payload: Json;
          processed_at?: string | null;
          error?: string | null;
          received_at?: string;
        };
        Update: {
          processed_at?: string | null;
          error?: string | null;
        };
        Relationships: [];
      };
      shiprocket_tokens: {
        Row: {
          id: string;
          token: string;
          expires_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          token: string;
          expires_at: string;
          updated_at?: string;
        };
        Update: {
          token?: string;
          expires_at?: string;
          updated_at?: string;
        };
        Relationships: [];
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
          slot_id: string | null;
          notes: string | null;
          meeting_url: string | null;
          video_provider: string | null;
          daily_room_name: string | null;
          hold_expires_at: string | null;
          client_joined_at: string | null;
          host_joined_at: string | null;
          reschedule_count: number | null;
          reminder_24h_sent_at: string | null;
          reminder_1h_sent_at: string | null;
          aftercare_notes: string | null;
          aftercare_sent_at: string | null;
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
          slot_id?: string | null;
          notes?: string | null;
          meeting_url?: string | null;
          video_provider?: string | null;
          daily_room_name?: string | null;
          hold_expires_at?: string | null;
          client_joined_at?: string | null;
          host_joined_at?: string | null;
          reschedule_count?: number | null;
          reminder_24h_sent_at?: string | null;
          reminder_1h_sent_at?: string | null;
          aftercare_notes?: string | null;
          aftercare_sent_at?: string | null;
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
          slot_id?: string | null;
          notes?: string | null;
          meeting_url?: string | null;
          video_provider?: string | null;
          daily_room_name?: string | null;
          hold_expires_at?: string | null;
          client_joined_at?: string | null;
          host_joined_at?: string | null;
          reschedule_count?: number | null;
          reminder_24h_sent_at?: string | null;
          reminder_1h_sent_at?: string | null;
          aftercare_notes?: string | null;
          aftercare_sent_at?: string | null;
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
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          delivery_format: string;
          amount_subunits: number | null;
          currency: string;
          duration_label: string | null;
          image: string | null;
          highlights: Json;
          suitable_for: Json;
          pricing_options: Json;
          track_category: string;
          track_label: string | null;
          seo_title: string | null;
          seo_description: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          delivery_format?: string;
          amount_subunits?: number | null;
          currency?: string;
          duration_label?: string | null;
          image?: string | null;
          highlights?: Json;
          suitable_for?: Json;
          pricing_options?: Json;
          track_category?: string;
          track_label?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          slug?: string;
          title?: string;
          description?: string | null;
          delivery_format?: string;
          amount_subunits?: number | null;
          currency?: string;
          duration_label?: string | null;
          image?: string | null;
          highlights?: Json;
          suitable_for?: Json;
          pricing_options?: Json;
          track_category?: string;
          track_label?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          sort_order?: number;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      course_modules: {
        Row: {
          id: string;
          course_slug: string;
          title: string;
          description: string | null;
          sort_order: number;
          unlock_offset_days: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_slug: string;
          title: string;
          description?: string | null;
          sort_order?: number;
          unlock_offset_days?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          course_slug?: string;
          title?: string;
          description?: string | null;
          sort_order?: number;
          unlock_offset_days?: number;
          is_published?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      course_lessons: {
        Row: {
          id: string;
          module_id: string;
          course_slug: string;
          lesson_slug: string;
          title: string;
          duration_label: string;
          duration_seconds: number | null;
          description: string | null;
          notes_markdown: string | null;
          resources: Json;
          is_free_preview: boolean;
          video_provider: string;
          has_video: boolean;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          course_slug: string;
          lesson_slug: string;
          title: string;
          duration_label?: string;
          duration_seconds?: number | null;
          description?: string | null;
          notes_markdown?: string | null;
          resources?: Json;
          is_free_preview?: boolean;
          video_provider?: string;
          has_video?: boolean;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          module_id?: string;
          course_slug?: string;
          lesson_slug?: string;
          title?: string;
          duration_label?: string;
          duration_seconds?: number | null;
          description?: string | null;
          notes_markdown?: string | null;
          resources?: Json;
          is_free_preview?: boolean;
          video_provider?: string;
          has_video?: boolean;
          sort_order?: number;
          is_published?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      course_lesson_media: {
        Row: {
          lesson_id: string;
          course_slug: string;
          lesson_slug: string;
          video_provider: string;
          storage_path: string | null;
          vdocipher_video_id: string | null;
          bunny_library_id: string | null;
          bunny_video_id: string | null;
          external_source_url: string | null;
          updated_at: string;
        };
        Insert: {
          lesson_id: string;
          course_slug: string;
          lesson_slug: string;
          video_provider?: string;
          storage_path?: string | null;
          vdocipher_video_id?: string | null;
          bunny_library_id?: string | null;
          bunny_video_id?: string | null;
          external_source_url?: string | null;
          updated_at?: string;
        };
        Update: {
          video_provider?: string;
          storage_path?: string | null;
          vdocipher_video_id?: string | null;
          bunny_library_id?: string | null;
          bunny_video_id?: string | null;
          external_source_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      course_lesson_notes: {
        Row: {
          user_id: string;
          course_slug: string;
          lesson_id: string;
          content: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          course_slug: string;
          lesson_id: string;
          content?: string;
          updated_at?: string;
        };
        Update: {
          content?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      course_registered_devices: {
        Row: {
          id: string;
          user_id: string;
          device_id_hash: string;
          device_label: string | null;
          ip_hash: string | null;
          first_seen_at: string;
          last_seen_at: string;
          is_blocked: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          device_id_hash: string;
          device_label?: string | null;
          ip_hash?: string | null;
          first_seen_at?: string;
          last_seen_at?: string;
          is_blocked?: boolean;
        };
        Update: {
          device_label?: string | null;
          ip_hash?: string | null;
          last_seen_at?: string;
          is_blocked?: boolean;
        };
        Relationships: [];
      };
      course_playback_sessions: {
        Row: {
          id: string;
          user_id: string;
          course_slug: string;
          lesson_id: string;
          device_id_hash: string;
          ip_hash: string | null;
          user_agent: string | null;
          started_at: string;
          last_heartbeat_at: string;
          expires_at: string;
          revoked_at: string | null;
          revoke_reason: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_slug: string;
          lesson_id: string;
          device_id_hash: string;
          ip_hash?: string | null;
          user_agent?: string | null;
          started_at?: string;
          last_heartbeat_at?: string;
          expires_at: string;
          revoked_at?: string | null;
          revoke_reason?: string | null;
        };
        Update: {
          lesson_id?: string;
          last_heartbeat_at?: string;
          expires_at?: string;
          revoked_at?: string | null;
          revoke_reason?: string | null;
        };
        Relationships: [];
      };
      course_security_events: {
        Row: {
          id: number;
          user_id: string | null;
          course_slug: string;
          lesson_id: string | null;
          event_type: string;
          severity: string;
          ip_hash: string | null;
          device_id_hash: string | null;
          user_agent: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          course_slug: string;
          lesson_id?: string | null;
          event_type: string;
          severity?: string;
          ip_hash?: string | null;
          device_id_hash?: string | null;
          user_agent?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Record<string, never>;
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
