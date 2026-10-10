set lock_timeout = '5s';
set statement_timeout = '60s';

create table if not exists public.distance_healing_cases (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  submission_method text check (submission_method in ('website', 'whatsapp')),
  intention text check (intention is null or char_length(intention) between 10 and 2000),
  source_photo_path text,
  result_photo_path text,
  music_path text,
  status text not null default 'awaiting_submission' check (status in (
    'awaiting_submission', 'submitted', 'in_progress', 'ready', 'delivered', 'completed', 'cancelled'
  )),
  submitted_at timestamptz,
  processing_started_at timestamptz,
  ready_at timestamptz,
  delivered_at timestamptz,
  completed_at timestamptz,
  retention_delete_after timestamptz,
  staff_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (submission_method <> 'website' or source_photo_path is not null or status = 'awaiting_submission')
);

create index if not exists distance_healing_cases_user_created_idx
  on public.distance_healing_cases(user_id, created_at desc);
create index if not exists distance_healing_cases_status_created_idx
  on public.distance_healing_cases(status, created_at asc);

create table if not exists public.distance_healing_feedback (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null unique references public.distance_healing_cases(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  message text not null check (char_length(message) between 10 and 2000),
  publication_consent text not null default 'private' check (publication_consent in ('private', 'anonymous', 'first_name')),
  created_at timestamptz not null default now()
);

alter table public.distance_healing_cases enable row level security;
alter table public.distance_healing_feedback enable row level security;
revoke all on public.distance_healing_cases from anon, authenticated;
revoke all on public.distance_healing_feedback from anon, authenticated;
grant select on public.distance_healing_cases to authenticated;
grant select, insert on public.distance_healing_feedback to authenticated;

create policy distance_healing_cases_select_own
  on public.distance_healing_cases for select to authenticated
  using ((select auth.uid()) = user_id or private.is_staff(array['owner','admin','booking_manager','support']));

create policy distance_healing_feedback_select_own
  on public.distance_healing_feedback for select to authenticated
  using ((select auth.uid()) = user_id or private.is_staff(array['owner','admin','booking_manager','support']));

create policy distance_healing_feedback_insert_own
  on public.distance_healing_feedback for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.distance_healing_cases c
      where c.id = case_id and c.user_id = (select auth.uid()) and c.status in ('delivered','completed')
    )
  );

drop trigger if exists distance_healing_cases_set_updated_at on public.distance_healing_cases;
create trigger distance_healing_cases_set_updated_at
  before update on public.distance_healing_cases
  for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('distance-healing-private', 'distance-healing-private', false, 10485760, array['image/jpeg','image/png','image/webp']),
  ('distance-healing-deliveries', 'distance-healing-deliveries', false, 26214400, array['image/jpeg','image/png','image/webp','audio/mpeg','audio/mp4','audio/x-m4a','audio/wav'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

comment on table public.distance_healing_cases is 'Payment-gated Distance Healing submission, processing, and private delivery workflow.';
comment on column public.distance_healing_cases.retention_delete_after is 'Date after which private session media should be deleted under the retention policy.';
