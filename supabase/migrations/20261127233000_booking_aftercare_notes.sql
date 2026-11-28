-- Migration: Post-session aftercare / remedies notes on bookings
-- Allows Dr. Manisha / staff to share personalized post-session guidance
-- visible in /account/bookings and delivered via transactional email.

alter table public.bookings
  add column if not exists aftercare_notes text,
  add column if not exists aftercare_sent_at timestamptz;
