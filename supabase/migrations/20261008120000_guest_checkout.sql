-- Guest checkout: let visitors place an order without an account.
-- Orders keep a nullable user_id (auth attach later) + guest contact columns.
set lock_timeout = '5s';
set statement_timeout = '60s';

alter table public.orders alter column user_id drop not null;
alter table public.orders add column if not exists guest_email text;
alter table public.orders add column if not exists guest_name text;

-- Guest orders carry a one-time delivery address that has no account owner.
alter table public.addresses alter column user_id drop not null;
create index if not exists orders_guest_email_idx on public.orders(guest_email) where guest_email is not null;

-- Guest checkout writes orders only through validated, server-side routes
-- (admin/service role), so RLS stays lock-tight and anonymous roles get nothing.
comment on column public.orders.guest_email is
  'Contact email for orders placed without an account (guest checkout).';
comment on column public.orders.guest_name is
  'Contact name for orders placed without an account (guest checkout).';
