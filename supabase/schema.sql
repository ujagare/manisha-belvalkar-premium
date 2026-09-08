-- ============================================================
-- Manisha Belvalkar — Supabase schema
-- Run this in Supabase Dashboard → SQL Editor (one time).
-- ============================================================

-- ---------- PROFILES ----------
-- One public profile row per auth.users row.
-- Created automatically on sign-up via the trigger below.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read/update only their own profile.
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create the profile row on sign-up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- ORDERS ----------
-- Login-gated purchases: session booking, course enrollment, book orders,
-- healing sessions. Created from /api/orders by an authenticated user.

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_type text not null check (item_type in ('service', 'course', 'product', 'healing')),
  item_slug text not null,
  item_title text not null,
  amount numeric(12, 2),
  currency text not null default 'INR',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_item_idx on public.orders (item_type, item_slug);

alter table public.orders enable row level security;

-- Users can read and create their own orders.
create policy "orders_select_own"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "orders_insert_own"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- (Optional) staff access via a private key in the service role — not exposed.

-- ---------- PRODUCTS ----------
-- Public storefront catalog. Anyone (even signed-out visitors) can read;
-- writes happen only from the Supabase dashboard / SQL editor via the
-- service role, so the anon key can never mutate the catalog.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  description text not null,
  category text not null check (category in ('book', 'oracle', 'ritual')),
  price numeric(12, 2) not null check (price >= 0),
  sale_price numeric(12, 2) check (sale_price is null or sale_price >= 0),
  badge text,
  image text,
  details jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_featured_idx on public.products (featured, sort_order);

alter table public.products enable row level security;

-- Catalog is public read-only through the anon key.
create policy "products_select_all"
  on public.products for select
  using (true);

-- No insert/update/delete policies: only the service role (dashboard /
-- SQL editor) can change products. Safe by construction.

-- Keep updated_at fresh on every edit.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------- PRODUCT SEED ----------
-- The current storefront catalog. Idempotent: safe to re-run.
-- New products can be added later from the Supabase dashboard —
-- the site picks them up automatically.

insert into public.products (slug, title, subtitle, description, category, price, sale_price, badge, image, details, featured, sort_order)
values
  (
    'shakti-oracle-deck',
    'SHAKTI Oracle Deck',
    'Inspired by 51 Shakti Peethas',
    'Inspired by the sacred 51 Shakti Peethas, the Shakti Oracle Cards are a powerful tool for connecting with the divine feminine. Created from Dr. Manisha S. Belvalkar''s profound experiences and meditations with the Goddesses, this beautifully illustrated deck offers daily guidance, positivity, and spiritual insights.',
    'oracle', 2993, 3533, 'Best Seller', '/images/shakti-book-front.png',
    '["52 oracle cards","Information booklet included","Divine feminine wisdom","Daily guidance & affirmations"]'::jsonb,
    true, 10
  ),
  (
    'shakti-deck-guidebook',
    'SHAKTI Deck + Guidebook',
    'Complete set · Cards & companion book',
    'The complete SHAKTI experience — a beautifully illustrated 52-card oracle deck paired with its companion guidebook, holding the wisdom of the 51 Shakti Peethas for your daily practice. Gift-ready sacred packaging.',
    'oracle', 2993, 3533, 'Complete Set', '/images/shakti-cards-and-book.png',
    '["52 oracle cards","Companion guidebook included","Gift-ready sacred packaging","Inspired by 51 Shakti Peethas"]'::jsonb,
    false, 15
  ),
  (
    'shakti-combo-pack',
    'SHAKTI Combo Pack',
    'Deck + Guidebook · Gift-ready packaging',
    'Gift the divine — the SHAKTI Oracle Deck and guidebook presented together as one sacred combo, handcrafted with intention and blessed before it reaches your altar. A complete spiritual toolkit for daily guidance.',
    'oracle', 2993, 3533, 'Sacred Combo', '/images/shakti-combo-book.png',
    '["Deck + guidebook combo","Handcrafted with intention","Blessed before shipping","Gift-ready packaging"]'::jsonb,
    false, 16
  ),
  (
    'sacred-salt-frame',
    'Sacred Salt Frame',
    'Cleanse your space with Himalayan crystal salt',
    'A handcrafted Himalayan crystal salt frame infused with intention — a living tool for space clearing, protection and gentle energy cleansing. Place it near your entrance, altar or meditation corner to hold your space calm, clear and protected.',
    'ritual', 899, 1099, 'Handcrafted', '/images/shakti-salt-frame.png',
    '["Authentic Himalayan crystal salt","Handcrafted with intention","For space clearing & protection","Altar & décor ready"]'::jsonb,
    false, 50
  )
on conflict (slug) do nothing;
