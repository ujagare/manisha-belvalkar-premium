set lock_timeout = '5s';
set statement_timeout = '60s';

-- This dashboard helper is SECURITY DEFINER and must not be callable via the Data API.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Cover foreign keys used by joins, cascades, and parent-row updates/deletes.
create index if not exists audit_logs_actor_user_id_fkey_idx on public.audit_logs (actor_user_id);
create index if not exists availability_slots_offering_id_fkey_idx on public.availability_slots (offering_id);
create index if not exists bookings_slot_id_fkey_idx on public.bookings (slot_id);
create index if not exists community_applications_user_id_fkey_idx on public.community_applications (user_id);
create index if not exists consent_records_user_id_fkey_idx on public.consent_records (user_id);
create index if not exists course_enrollments_cohort_id_fkey_idx on public.course_enrollments (cohort_id);
create index if not exists course_sessions_cohort_id_fkey_idx on public.course_sessions (cohort_id);
create index if not exists distance_healing_feedback_user_id_fkey_idx on public.distance_healing_feedback (user_id);
create index if not exists enquiries_user_id_fkey_idx on public.enquiries (user_id);
create index if not exists event_instances_event_id_fkey_idx on public.event_instances (event_id);
create index if not exists event_registrations_event_instance_id_fkey_idx on public.event_registrations (event_instance_id);
create index if not exists event_registrations_user_id_fkey_idx on public.event_registrations (user_id);
create index if not exists inventory_movements_order_id_fkey_idx on public.inventory_movements (order_id);
create index if not exists inventory_movements_variant_id_fkey_idx on public.inventory_movements (variant_id);
create index if not exists orders_address_id_fkey_idx on public.orders (address_id);
create index if not exists product_variants_product_id_fkey_idx on public.product_variants (product_id);
create index if not exists refunds_order_id_fkey_idx on public.refunds (order_id);
create index if not exists refunds_payment_id_fkey_idx on public.refunds (payment_id);
create index if not exists refunds_requested_by_fkey_idx on public.refunds (requested_by);
create index if not exists shipments_address_id_fkey_idx on public.shipments (address_id);
create index if not exists support_tickets_order_id_fkey_idx on public.support_tickets (order_id);
create index if not exists support_tickets_user_id_fkey_idx on public.support_tickets (user_id);
