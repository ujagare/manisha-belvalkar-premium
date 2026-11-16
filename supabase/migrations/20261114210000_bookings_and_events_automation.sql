-- Migration: Bookings availability slots, event registration unique constraint, and meeting URL support
-- 1. Add slot_id reference to public.bookings
alter table public.bookings add column if not exists slot_id uuid references public.availability_slots(id) on delete set null;
create index if not exists bookings_slot_id_idx on public.bookings(slot_id);

-- 2. Prevent duplicate active registrations for the same event
create unique index if not exists event_registrations_user_event_active_idx 
on public.event_registrations (user_id, event_slug) 
where status in ('pending', 'confirmed');

-- 3. Seed upcoming availability slots for the next 14 days so the calendar has live slots
insert into public.availability_slots (starts_at, ends_at, format, capacity, reserved_count, status)
select
  d + time '10:00:00' as starts_at,
  d + time '11:00:00' as ends_at,
  'online' as format,
  1 as capacity,
  0 as reserved_count,
  'available' as status
from generate_series(
  current_date + interval '1 day',
  current_date + interval '14 days',
  interval '1 day'
) as d
where extract(dow from d) between 1 and 6 -- Mon-Sat
on conflict do nothing;

insert into public.availability_slots (starts_at, ends_at, format, capacity, reserved_count, status)
select
  d + time '15:00:00' as starts_at,
  d + time '16:00:00' as ends_at,
  'online' as format,
  1 as capacity,
  0 as reserved_count,
  'available' as status
from generate_series(
  current_date + interval '1 day',
  current_date + interval '14 days',
  interval '1 day'
) as d
where extract(dow from d) between 1 and 6 -- Mon-Sat
on conflict do nothing;
