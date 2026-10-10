-- Recorded-course access and account-synced lesson progress.
set lock_timeout = '5s';
set statement_timeout = '60s';

create table if not exists public.course_lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  lesson_id text not null,
  completed boolean not null default false,
  watched_seconds integer not null default 0 check (watched_seconds >= 0),
  last_watched_at timestamptz not null default now(),
  completed_at timestamptz,
  primary key (user_id, course_slug, lesson_id)
);

create index if not exists course_progress_recent_idx
  on public.course_lesson_progress(user_id, last_watched_at desc);

alter table public.course_lesson_progress enable row level security;
revoke all on public.course_lesson_progress from anon, authenticated;
grant select, insert, update on public.course_lesson_progress to authenticated;

create policy course_progress_select_own on public.course_lesson_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy course_progress_insert_own on public.course_lesson_progress
  for insert to authenticated with check (
    (select auth.uid()) = user_id and exists (
      select 1 from public.course_enrollments ce
      where ce.user_id = (select auth.uid())
        and ce.course_slug = course_slug
        and ce.status in ('active', 'completed')
    )
  );
create policy course_progress_update_own on public.course_lesson_progress
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

comment on table public.course_lesson_progress is
  'Per-account progress for recorded lessons, used for resume learning and course completion.';
