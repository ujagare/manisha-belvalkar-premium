-- Shiprocket end-to-end e-commerce shipping, courier serviceability, AWB, pickup,
-- label/manifest/invoice URLs, real-time webhook events, and JWT token cache.

alter table public.shipments
  add column if not exists provider text not null default 'shiprocket',
  add column if not exists shiprocket_order_id bigint,
  add column if not exists shiprocket_shipment_id bigint,
  add column if not exists courier_company_id integer,
  add column if not exists awb_code text,
  add column if not exists pickup_location text,
  add column if not exists pickup_scheduled_date timestamptz,
  add column if not exists pickup_token_number text,
  add column if not exists etd timestamptz,
  add column if not exists weight_kg numeric(6,2) not null default 0.50,
  add column if not exists length_cm numeric(6,2) not null default 20.00,
  add column if not exists breadth_cm numeric(6,2) not null default 15.00,
  add column if not exists height_cm numeric(6,2) not null default 6.00,
  add column if not exists shipping_charge_subunits bigint not null default 0,
  add column if not exists label_url text,
  add column if not exists manifest_url text,
  add column if not exists invoice_url text,
  add column if not exists current_status text,
  add column if not exists current_status_id integer,
  add column if not exists last_location text,
  add column if not exists tracking_events jsonb not null default '[]'::jsonb,
  add column if not exists last_synced_at timestamptz,
  add column if not exists rto_reason text,
  add column if not exists cancelled_at timestamptz;

alter table public.shipments drop constraint if exists shipments_status_check;
alter table public.shipments add constraint shipments_status_check check (
  status in (
    'pending',
    'created',
    'awb_assigned',
    'pickup_scheduled',
    'packed',
    'shipped',
    'in_transit',
    'out_for_delivery',
    'delivered',
    'rto_initiated',
    'returned',
    'cancelled',
    'exception'
  )
);

create unique index if not exists shipments_awb_code_uidx
  on public.shipments(awb_code)
  where awb_code is not null;

create index if not exists shipments_shiprocket_order_idx
  on public.shipments(shiprocket_order_id)
  where shiprocket_order_id is not null;

create index if not exists shipments_shiprocket_shipment_idx
  on public.shipments(shiprocket_shipment_id)
  where shiprocket_shipment_id is not null;

create index if not exists shipments_status_updated_idx
  on public.shipments(status, updated_at desc);

-- Idempotent log of incoming Shiprocket webhooks (mirrors public.payment_events).
create table if not exists public.shipment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'shiprocket',
  event_key text not null,
  awb_code text,
  shiprocket_order_id bigint,
  status_code integer,
  status_label text,
  payload jsonb not null,
  processed_at timestamptz,
  error text,
  received_at timestamptz not null default now(),
  unique(provider, event_key)
);

alter table public.shipment_events enable row level security;
revoke all on public.shipment_events from anon, authenticated;

-- Server-only JWT token cache so serverless routes reuse Shiprocket's 10-day token.
create table if not exists public.shiprocket_tokens (
  id text primary key default 'default',
  token text not null,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.shiprocket_tokens enable row level security;
revoke all on public.shiprocket_tokens from anon, authenticated;

-- Physical parcel specs on products (for accurate Shiprocket rate/courier selection).
alter table public.products
  add column if not exists weight_kg numeric(6,2) not null default 0.50,
  add column if not exists length_cm numeric(6,2) not null default 20.00,
  add column if not exists breadth_cm numeric(6,2) not null default 15.00,
  add column if not exists height_cm numeric(6,2) not null default 6.00;

update public.products set weight_kg = 0.45, length_cm = 16, breadth_cm = 12, height_cm = 5 where slug = 'shakti-oracle-deck';
update public.products set weight_kg = 0.65, length_cm = 22, breadth_cm = 16, height_cm = 6 where slug = 'shakti-deck-guidebook';
update public.products set weight_kg = 0.85, length_cm = 24, breadth_cm = 18, height_cm = 8 where slug = 'shakti-combo-pack';
update public.products set weight_kg = 1.20, length_cm = 26, breadth_cm = 22, height_cm = 10 where slug = 'sacred-salt-frame';
