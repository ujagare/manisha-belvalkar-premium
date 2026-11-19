-- Migration: Online healing full Razorpay (INR + USD), Daily.co private rooms,
-- 15-minute slot hold TTL, consent audit log, and reminder tracking.

-- 1. Seed all 4 healing offerings so checkout never returns "Price setup pending"
-- Preserves any existing customized pricing via ON CONFLICT DO NOTHING.
insert into public.offerings (type, slug, title, amount_subunits, currency, payment_mode, is_active)
values
  ('healing', 'healing-sessions', 'Energy Healing', 2400000, 'INR', 'full', true),
  ('healing', 'distance-healing', 'Distance Healing', 1500000, 'INR', 'full', true),
  ('healing', 'shakti-healing', 'Shakti Healing', 2400000, 'INR', 'full', true),
  ('healing', 'mind-reprogramming', 'Reprogramming Your Mind (Through Guided Meditation)', 9900000, 'INR', 'full', true)
on conflict (type, slug) do nothing;

-- 2. Extend bookings with 15-min hold TTL, Daily.co room metadata, attendance proof,
-- reschedule counter, and automated reminder timestamps.
alter table public.bookings
  add column if not exists hold_expires_at timestamptz,
  add column if not exists video_provider text not null default 'daily',
  add column if not exists daily_room_name text,
  add column if not exists client_joined_at timestamptz,
  add column if not exists host_joined_at timestamptz,
  add column if not exists reschedule_count integer not null default 0,
  add column if not exists reminder_24h_sent_at timestamptz,
  add column if not exists reminder_1h_sent_at timestamptz;

create index if not exists bookings_hold_expires_idx
  on public.bookings (hold_expires_at)
  where status = 'payment_pending';

create index if not exists bookings_reminder_lookup_idx
  on public.bookings (requested_start)
  where status = 'confirmed' and format = 'online';

-- 3. Immutable checkout consent & non-medical waiver audit log (chargeback defense)
create table if not exists public.booking_consents (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  item_type text not null,
  item_slug text not null,
  currency text not null default 'INR',
  amount_subunits integer not null,
  disclaimer_version text not null default '2026-11',
  refund_policy_version text not null default '2026-11',
  ip_hash text,
  user_agent text,
  accepted_at timestamptz not null default now()
);

create unique index if not exists booking_consents_order_id_idx
  on public.booking_consents (order_id);

alter table public.booking_consents enable row level security;

drop policy if exists "booking_consents_owner_read" on public.booking_consents;
create policy "booking_consents_owner_read"
  on public.booking_consents for select
  using (auth.uid() = user_id);
