-- Migration: GST tax fields, HSN/SAC codes, and sequential tax invoice numbering
-- 1. Add GST breakdown and invoice columns to public.orders
alter table public.orders add column if not exists invoice_number text unique;
alter table public.orders add column if not exists invoice_date timestamptz;
alter table public.orders add column if not exists subtotal_subunits bigint;
alter table public.orders add column if not exists tax_subunits bigint default 0;
alter table public.orders add column if not exists cgst_subunits bigint default 0;
alter table public.orders add column if not exists sgst_subunits bigint default 0;
alter table public.orders add column if not exists igst_subunits bigint default 0;
alter table public.orders add column if not exists customer_gstin text;

-- 2. Add HSN/SAC and tax rates to public.order_items
alter table public.order_items add column if not exists hsn_sac_code text;
alter table public.order_items add column if not exists tax_rate numeric(5,2) default 18.00;
alter table public.order_items add column if not exists tax_subunits bigint default 0;

-- 3. Atomic invoice sequence tracking table
create table if not exists public.invoice_sequences (
  financial_year text primary key,
  last_number bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.invoice_sequences enable row level security;
revoke all on public.invoice_sequences from anon, authenticated;

-- 4. Atomic invoice sequence generator function
create or replace function public.next_invoice_number(fy text)
returns text
language plpgsql
security definer
as $$
declare
  seq bigint;
begin
  insert into public.invoice_sequences (financial_year, last_number, updated_at)
  values (fy, 1, now())
  on conflict (financial_year)
  do update set 
    last_number = public.invoice_sequences.last_number + 1,
    updated_at = now()
  returning last_number into seq;

  return 'INV/' || fy || '/' || lpad(seq::text, 5, '0');
end;
$$;
