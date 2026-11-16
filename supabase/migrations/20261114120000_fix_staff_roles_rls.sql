-- ============================================================================
-- SECURITY FIX — public.staff_roles was reachable by any signed-in user.
--
-- Every other table in this project is protected by the same pair of steps:
--     revoke all on public.<table> from anon, authenticated;
--     alter table public.<table> enable row level security;
--
-- public.staff_roles was created without either one. Supabase grants the anon
-- and authenticated roles ALL privileges on tables in the public schema by
-- default, so any user who could sign up could write their own row:
--
--     supabase.from('staff_roles').upsert({ user_id: <own id>, role: 'owner' })
--
-- through the public anon key, then pass every requireStaff() / /api/admin/*
-- check and read all customers' orders, profiles and healing cases (the staff
-- policies call private.is_staff(null)). Two-factor auth is no obstacle: the
-- attacker simply enrols their own authenticator on their own account.
--
-- WHY THIS IS SAFE TO APPLY:
--   * All three staff_roles reads in the app (src/lib/supabase/staff.ts and the
--     two /api/admin routes) already go through createAdminClient(), i.e. the
--     service role, which bypasses RLS.
--   * private.is_staff() is SECURITY DEFINER, so it reads the table as its
--     owner and keeps working with RLS enabled and no policies.
-- ============================================================================

set lock_timeout = '5s';
set statement_timeout = '60s';

revoke all on public.staff_roles from anon, authenticated;
alter table public.staff_roles enable row level security;

-- Deliberately no policies: with RLS enabled and none defined, anon and
-- authenticated are denied everything while the service role and the table
-- owner still have full access.
