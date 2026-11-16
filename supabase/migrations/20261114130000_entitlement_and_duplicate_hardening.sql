-- ============================================================================
-- Hardening: entitlement revocation on refund, duplicate-prevention keys, and
-- an index for the media-retention sweep.
--
-- 1. course_enrollments unique key did not actually prevent duplicate rows.
--    The constraint was unique(user_id, course_slug, cohort_id), but recorded
--    courses leave cohort_id NULL and Postgres treats NULLs as distinct, so a
--    repurchase inserted a second 'active' enrolment. A partial unique index
--    on the NULL-cohort case closes that hole without touching cohort rows.
--
-- 2. event_registrations had no uniqueness at all, so the same account could
--    register for one event repeatedly.
--
-- 3. distance_healing_cases.retention_delete_after is written on submission but
--    nothing ever swept it; the index makes the retention job cheap.
-- ============================================================================

set lock_timeout = '5s';
set statement_timeout = '60s';

-- 1. One live enrolment per learner per recorded course (cohort-less rows).
create unique index if not exists course_enrollments_user_course_nocohort_key
  on public.course_enrollments (user_id, course_slug)
  where cohort_id is null and status in ('active', 'completed');

-- 2. One registration per account per event.
create unique index if not exists event_registrations_user_event_key
  on public.event_registrations (user_id, event_slug)
  where status <> 'cancelled';

-- 3. Retention sweep support: private session media past its delete-after date.
create index if not exists distance_healing_cases_retention_idx
  on public.distance_healing_cases (retention_delete_after)
  where retention_delete_after is not null and source_photo_path is not null;

-- 4. Refund requests: at most one open request per order, so repeated POSTs
--    cannot queue the same refund several times.
create unique index if not exists refunds_one_open_per_order_key
  on public.refunds (order_id)
  where status in ('requested', 'approved', 'processing');
