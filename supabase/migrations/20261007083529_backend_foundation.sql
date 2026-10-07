set lock_timeout = '5s';
set statement_timeout = '60s';

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- Baseline objects retained from the original one-off schema so a fresh
-- environment can be created entirely from migrations.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('service','course','product','healing')),
  item_slug text not null,
  item_title text not null,
  amount numeric(12,2),
  currency text not null default 'INR',
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text not null,
  category text not null check (category in ('book','oracle','ritual')),
  price numeric(12,2) not null check (price >= 0),
  sale_price numeric(12,2) check (sale_price is null or sale_price >= 0),
  badge text,
  image text,
  details jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  insert into public.profiles(id, full_name, email, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture'))
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products for each row execute function public.set_updated_at();

-- Staff authorization lives in a protected table, never user-editable metadata.
create table if not exists public.staff_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'booking_manager', 'catalog_manager', 'support')),
  created_at timestamptz not null default now()
);

create or replace function private.is_staff(allowed_roles text[] default null)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.staff_roles sr
    where sr.user_id = (select auth.uid())
      and (allowed_roles is null or sr.role = any(allowed_roles))
  );
$$;
revoke all on function private.is_staff(text[]) from public, anon, authenticated;
grant execute on function private.is_staff(text[]) to authenticated;

-- Harden existing profile access and add customer address support.
alter table public.profiles enable row level security;
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated
  using ((select auth.uid()) = id or private.is_staff(null));
create policy profiles_update_own on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
revoke all on public.profiles from anon, authenticated;
grant select, update on public.profiles to authenticated;

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Home',
  recipient_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country_code text not null default 'IN',
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists addresses_user_idx on public.addresses(user_id);
alter table public.addresses enable row level security;
revoke all on public.addresses from anon, authenticated;
grant select, insert, update, delete on public.addresses to authenticated;
create policy addresses_select_own on public.addresses for select to authenticated using ((select auth.uid()) = user_id);
create policy addresses_insert_own on public.addresses for insert to authenticated with check ((select auth.uid()) = user_id);
create policy addresses_update_own on public.addresses for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy addresses_delete_own on public.addresses for delete to authenticated using ((select auth.uid()) = user_id);

-- Expand the current order table without breaking existing records.
alter table public.orders add column if not exists amount_subunits bigint;
alter table public.orders add column if not exists payment_status text not null default 'not_required';
alter table public.orders add column if not exists fulfillment_status text not null default 'unfulfilled';
alter table public.orders add column if not exists gateway_order_id text;
alter table public.orders add column if not exists idempotency_key text;
alter table public.orders add column if not exists address_id uuid references public.addresses(id) on delete set null;
alter table public.orders add column if not exists updated_at timestamptz not null default now();
alter table public.orders drop constraint if exists orders_item_type_check;
alter table public.orders add constraint orders_item_type_check check (item_type in ('service','course','product','healing','mentoring','event','community'));
alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders add constraint orders_payment_status_check check (payment_status in ('not_required','created','authorized','paid','failed','refunded','partially_refunded'));
alter table public.orders drop constraint if exists orders_fulfillment_status_check;
alter table public.orders add constraint orders_fulfillment_status_check check (fulfillment_status in ('unfulfilled','scheduled','processing','shipped','delivered','completed','cancelled'));
create unique index if not exists orders_gateway_order_uidx on public.orders(gateway_order_id) where gateway_order_id is not null;
create unique index if not exists orders_user_idempotency_uidx on public.orders(user_id, idempotency_key) where idempotency_key is not null;
create index if not exists orders_user_created_idx on public.orders(user_id, created_at desc);
revoke all on public.orders from anon, authenticated;
grant select, insert on public.orders to authenticated;
drop policy if exists orders_select_own on public.orders;
drop policy if exists orders_insert_own on public.orders;
create policy orders_select_own on public.orders for select to authenticated using ((select auth.uid()) = user_id or private.is_staff(null));
create policy orders_insert_own on public.orders for insert to authenticated with check ((select auth.uid()) = user_id);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  item_type text not null check (item_type in ('service','course','product','healing','mentoring','event','community')),
  item_slug text not null,
  title text not null,
  quantity integer not null default 1 check (quantity > 0 and quantity <= 20),
  unit_amount_subunits bigint check (unit_amount_subunits is null or unit_amount_subunits >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists order_items_order_idx on public.order_items(order_id);
alter table public.order_items enable row level security;
revoke all on public.order_items from anon, authenticated;
grant select on public.order_items to authenticated;
create policy order_items_select_own on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = (select auth.uid()) or private.is_staff(null))));

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null default 'razorpay' check (provider in ('razorpay')),
  provider_order_id text not null,
  provider_payment_id text,
  amount_subunits bigint not null check (amount_subunits > 0),
  currency text not null default 'INR',
  status text not null check (status in ('created','authorized','captured','failed','refunded','partially_refunded')),
  method text,
  captured_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists payments_provider_order_uidx on public.payments(provider_order_id);
create unique index if not exists payments_provider_payment_uidx on public.payments(provider_payment_id) where provider_payment_id is not null;
create index if not exists payments_order_idx on public.payments(order_id);
alter table public.payments enable row level security;
revoke all on public.payments from anon, authenticated;
grant select on public.payments to authenticated;
create policy payments_select_own on public.payments for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = (select auth.uid()) or private.is_staff(null))));

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'razorpay',
  event_id text not null,
  event_type text not null,
  payload jsonb not null,
  processed_at timestamptz,
  error text,
  received_at timestamptz not null default now(),
  unique(provider, event_id)
);
alter table public.payment_events enable row level security;
revoke all on public.payment_events from anon, authenticated;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  offering_type text not null check (offering_type in ('service','healing','mentoring')),
  offering_slug text not null,
  format text not null default 'online' check (format in ('online','mumbai','pune','other')),
  requested_start timestamptz,
  timezone text not null default 'Asia/Kolkata',
  notes text,
  meeting_url text,
  status text not null default 'requested' check (status in ('requested','payment_pending','confirmed','completed','cancelled','reschedule_requested')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists bookings_user_created_idx on public.bookings(user_id, created_at desc);
create unique index if not exists bookings_order_uidx on public.bookings(order_id);
alter table public.bookings enable row level security;
revoke all on public.bookings from anon, authenticated;
grant select, insert on public.bookings to authenticated;
create policy bookings_select_own on public.bookings for select to authenticated using ((select auth.uid()) = user_id or private.is_staff(null));
create policy bookings_insert_own on public.bookings for insert to authenticated with check ((select auth.uid()) = user_id);

create table if not exists public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  course_slug text not null,
  cohort_id uuid,
  status text not null default 'pending' check (status in ('pending','active','completed','cancelled','refunded')),
  enrolled_at timestamptz,
  created_at timestamptz not null default now(),
  unique(user_id, course_slug, cohort_id)
);
create unique index if not exists course_enrollments_order_uidx on public.course_enrollments(order_id);
alter table public.course_enrollments enable row level security;
revoke all on public.course_enrollments from anon, authenticated;
grant select on public.course_enrollments to authenticated;
create policy enrollments_select_own on public.course_enrollments for select to authenticated using ((select auth.uid()) = user_id or private.is_staff(null));

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  event_slug text not null,
  status text not null default 'pending' check (status in ('pending','confirmed','attended','cancelled','refunded')),
  joining_url text,
  created_at timestamptz not null default now()
);
create unique index if not exists event_registrations_order_uidx on public.event_registrations(order_id);
alter table public.event_registrations enable row level security;
revoke all on public.event_registrations from anon, authenticated;
grant select on public.event_registrations to authenticated;
create policy event_registrations_select_own on public.event_registrations for select to authenticated using ((select auth.uid()) = user_id or private.is_staff(null));

-- Public forms are written only through validated server routes using the secret key.
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  category text not null default 'general',
  name text not null,
  phone text,
  email text,
  message text not null,
  source_path text,
  consented_at timestamptz not null,
  status text not null default 'new' check (status in ('new','contacted','resolved','spam')),
  created_at timestamptz not null default now()
);
create index if not exists enquiries_created_idx on public.enquiries(created_at desc);
alter table public.enquiries enable row level security;
revoke all on public.enquiries from anon, authenticated;

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text,
  phone text,
  source text not null default 'shakti-app',
  consented_at timestamptz not null,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  check (email is not null or phone is not null)
);
create unique index if not exists waitlist_email_source_uidx on public.waitlist_signups(lower(email), source) where email is not null and unsubscribed_at is null;
alter table public.waitlist_signups enable row level security;
revoke all on public.waitlist_signups from anon, authenticated;

create table if not exists public.community_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text,
  phone text,
  intention text,
  consented_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','approved','declined','waitlisted')),
  created_at timestamptz not null default now(),
  check (email is not null or phone is not null)
);
alter table public.community_applications enable row level security;
revoke all on public.community_applications from anon, authenticated;

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.audit_logs enable row level security;
revoke all on public.audit_logs from anon, authenticated;

create table if not exists public.api_rate_limits (
  bucket_key text not null,
  window_start timestamptz not null,
  request_count integer not null default 1,
  primary key (bucket_key, window_start)
);
alter table public.api_rate_limits enable row level security;
revoke all on public.api_rate_limits from anon, authenticated;

create or replace function public.consume_api_rate_limit(
  p_bucket_key text,
  p_limit integer,
  p_window_seconds integer
) returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_window timestamptz;
  v_count integer;
begin
  if p_limit < 1 or p_window_seconds < 1 or length(p_bucket_key) > 200 then
    return false;
  end if;
  v_window := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  insert into public.api_rate_limits(bucket_key, window_start, request_count)
  values (p_bucket_key, v_window, 1)
  on conflict (bucket_key, window_start)
  do update set request_count = public.api_rate_limits.request_count + 1
  returning request_count into v_count;
  return v_count <= p_limit;
end;
$$;
revoke all on function public.consume_api_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_api_rate_limit(text, integer, integer) to service_role;

create table if not exists public.offerings (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('service','healing','mentoring')),
  slug text not null,
  title text not null,
  description text,
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  amount_subunits bigint check (amount_subunits is null or amount_subunits >= 0),
  currency text not null default 'INR',
  payment_mode text not null default 'full' check (payment_mode in ('full','deposit','consultation')),
  formats text[] not null default array['online']::text[],
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(type, slug)
);
alter table public.offerings enable row level security;
revoke all on public.offerings from anon, authenticated;
grant select on public.offerings to anon, authenticated;
create policy offerings_public_read on public.offerings for select to anon, authenticated using (is_active = true);

create table if not exists public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  offering_id uuid references public.offerings(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  format text not null check (format in ('online','mumbai','pune','other')),
  capacity integer not null default 1 check (capacity > 0),
  reserved_count integer not null default 0 check (reserved_count >= 0 and reserved_count <= capacity),
  status text not null default 'available' check (status in ('available','held','booked','blocked','cancelled')),
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index if not exists availability_open_idx on public.availability_slots(starts_at) where status = 'available';
alter table public.availability_slots enable row level security;
revoke all on public.availability_slots from anon, authenticated;
grant select on public.availability_slots to authenticated;
create policy availability_authenticated_read on public.availability_slots for select to authenticated using (status = 'available' and starts_at > now());

alter table public.bookings add column if not exists slot_id uuid references public.availability_slots(id) on delete set null;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  delivery_format text not null default 'live' check (delivery_format in ('live','recorded','hybrid','whatsapp','private')),
  amount_subunits bigint check (amount_subunits is null or amount_subunits >= 0),
  currency text not null default 'INR',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.courses enable row level security;
revoke all on public.courses from anon, authenticated;
grant select on public.courses to anon, authenticated;
create policy courses_public_read on public.courses for select to anon, authenticated using (is_active = true);

create table if not exists public.course_cohorts (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  enrollment_closes_at timestamptz,
  timezone text not null default 'Asia/Kolkata',
  capacity integer check (capacity is null or capacity > 0),
  enrolled_count integer not null default 0 check (enrolled_count >= 0),
  status text not null default 'draft' check (status in ('draft','open','full','in_progress','completed','cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists course_cohorts_course_idx on public.course_cohorts(course_id, starts_at);
alter table public.course_cohorts enable row level security;
revoke all on public.course_cohorts from anon, authenticated;
grant select on public.course_cohorts to anon, authenticated;
create policy cohorts_public_read on public.course_cohorts for select to anon, authenticated using (status in ('open','full','in_progress'));

create table if not exists public.course_sessions (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.course_cohorts(id) on delete cascade,
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  joining_url text,
  recording_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at > starts_at)
);
alter table public.course_sessions enable row level security;
revoke all on public.course_sessions from anon, authenticated;
grant select on public.course_sessions to authenticated;
create policy course_sessions_enrolled_read on public.course_sessions for select to authenticated using (
  exists (select 1 from public.course_enrollments ce where ce.cohort_id = cohort_id and ce.user_id = (select auth.uid()) and ce.status in ('active','completed'))
  or private.is_staff(null)
);

alter table public.course_enrollments drop constraint if exists course_enrollments_cohort_id_fkey;
alter table public.course_enrollments add constraint course_enrollments_cohort_id_fkey foreign key (cohort_id) references public.course_cohorts(id) on delete set null;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.events enable row level security;
revoke all on public.events from anon, authenticated;
grant select on public.events to anon, authenticated;
create policy events_public_read on public.events for select to anon, authenticated using (is_active = true);

create table if not exists public.event_instances (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz,
  timezone text not null default 'Asia/Kolkata',
  capacity integer check (capacity is null or capacity > 0),
  registered_count integer not null default 0 check (registered_count >= 0),
  amount_subunits bigint check (amount_subunits is null or amount_subunits >= 0),
  currency text not null default 'INR',
  registration_closes_at timestamptz,
  joining_url text,
  status text not null default 'scheduled' check (status in ('draft','scheduled','full','completed','cancelled')),
  created_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at)
);
create index if not exists event_instances_start_idx on public.event_instances(starts_at) where status = 'scheduled';
alter table public.event_instances enable row level security;
revoke all on public.event_instances from anon, authenticated;
grant select on public.event_instances to anon, authenticated;
create policy event_instances_public_read on public.event_instances for select to anon, authenticated using (status in ('scheduled','full'));

alter table public.event_registrations add column if not exists event_instance_id uuid references public.event_instances(id) on delete set null;

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  title text not null,
  amount_subunits bigint not null check (amount_subunits >= 0),
  stock_on_hand integer not null default 0 check (stock_on_hand >= 0),
  reserved_stock integer not null default 0 check (reserved_stock >= 0 and reserved_stock <= stock_on_hand),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.product_variants enable row level security;
revoke all on public.product_variants from anon, authenticated;
grant select on public.product_variants to anon, authenticated;
create policy product_variants_public_read on public.product_variants for select to anon, authenticated using (is_active = true);

create table if not exists public.inventory_movements (
  id bigint generated always as identity primary key,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  order_id uuid references public.orders(id) on delete set null,
  quantity_delta integer not null check (quantity_delta <> 0),
  reason text not null check (reason in ('restock','reserve','release','sale','return','adjustment')),
  note text,
  created_at timestamptz not null default now()
);
alter table public.inventory_movements enable row level security;
revoke all on public.inventory_movements from anon, authenticated;

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete restrict,
  address_id uuid references public.addresses(id) on delete set null,
  carrier text,
  tracking_number text,
  tracking_url text,
  status text not null default 'pending' check (status in ('pending','packed','shipped','in_transit','delivered','returned','cancelled')),
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.shipments enable row level security;
revoke all on public.shipments from anon, authenticated;
grant select on public.shipments to authenticated;
create policy shipments_select_own on public.shipments for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = (select auth.uid()) or private.is_staff(null)))
);

create table if not exists public.refunds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  payment_id uuid references public.payments(id) on delete set null,
  provider_refund_id text unique,
  amount_subunits bigint not null check (amount_subunits > 0),
  reason text,
  status text not null default 'requested' check (status in ('requested','approved','processing','processed','failed','declined')),
  requested_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.refunds enable row level security;
revoke all on public.refunds from anon, authenticated;
grant select, insert on public.refunds to authenticated;
create policy refunds_select_own on public.refunds for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = (select auth.uid()) or private.is_staff(null)))
);
create policy refunds_request_own on public.refunds for insert to authenticated with check (
  requested_by = (select auth.uid()) and exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid()))
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open','in_progress','waiting_customer','resolved','closed')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.support_tickets enable row level security;
revoke all on public.support_tickets from anon, authenticated;
grant select, insert on public.support_tickets to authenticated;
create policy support_tickets_select_own on public.support_tickets for select to authenticated using ((select auth.uid()) = user_id or private.is_staff(array['owner','admin','support']));
create policy support_tickets_insert_own on public.support_tickets for insert to authenticated with check ((select auth.uid()) = user_id);

create table if not exists public.consent_records (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  subject_identifier_hash text,
  consent_type text not null,
  policy_version text not null,
  source text not null,
  granted_at timestamptz not null default now(),
  withdrawn_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);
alter table public.consent_records enable row level security;
revoke all on public.consent_records from anon, authenticated;
grant select on public.consent_records to authenticated;
create policy consent_records_select_own on public.consent_records for select to authenticated using ((select auth.uid()) = user_id or private.is_staff(array['owner','admin','support']));

-- Existing products remain public read-only; make grants explicit.
alter table public.products enable row level security;
revoke all on public.products from anon, authenticated;
grant select on public.products to anon, authenticated;
drop policy if exists products_select_all on public.products;
create policy products_select_active on public.products for select to anon, authenticated using (is_active = true);

-- Trigger functions must not be generally callable.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;

comment on schema private is 'Server-only authorization helpers; not exposed through the Data API.';
