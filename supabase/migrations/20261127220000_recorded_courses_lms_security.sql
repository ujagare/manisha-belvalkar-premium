-- ============================================================================
-- Enterprise Recorded Courses LMS & Multi-Layer Anti-Piracy Security
-- - Dynamic DB-backed courses, modules (series parts), and lessons (episodes)
-- - Strict separation of public syllabus metadata vs service-role-only media secrets
-- - Single-stream playback session lock & per-student registered device cap
-- - Forensic piracy/tamper telemetry & private video storage vault
-- ============================================================================

set lock_timeout = '5s';
set statement_timeout = '60s';

-- 1. Expand public.courses for full storefront + classroom metadata
alter table public.courses add column if not exists duration_label text;
alter table public.courses add column if not exists image text;
alter table public.courses add column if not exists highlights jsonb not null default '[]'::jsonb;
alter table public.courses add column if not exists suitable_for jsonb not null default '[]'::jsonb;
alter table public.courses add column if not exists pricing_options jsonb not null default '[]'::jsonb;
alter table public.courses add column if not exists track_category text not null default 'sadhana'
  check (track_category in ('practitioner', 'sadhana'));
alter table public.courses add column if not exists track_label text;
alter table public.courses add column if not exists seo_title text;
alter table public.courses add column if not exists seo_description text;
alter table public.courses add column if not exists sort_order integer not null default 0;

drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

-- 2. Course Modules (Series Chapters / Parts)
create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null,
  title text not null,
  description text,
  sort_order integer not null default 0,
  unlock_offset_days integer not null default 0 check (unlock_offset_days >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists course_modules_slug_order_idx
  on public.course_modules (course_slug, sort_order asc, created_at asc);

alter table public.course_modules enable row level security;
revoke all on public.course_modules from public, anon, authenticated;
grant select on public.course_modules to anon, authenticated;

drop policy if exists course_modules_public_read on public.course_modules;
create policy course_modules_public_read
  on public.course_modules for select to anon, authenticated
  using (is_published = true);

drop trigger if exists course_modules_set_updated_at on public.course_modules;
create trigger course_modules_set_updated_at
  before update on public.course_modules
  for each row execute function public.set_updated_at();

-- 3. Course Lessons (Safe Syllabus Metadata ONLY — zero raw video URLs or DRM keys)
create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.course_modules(id) on delete cascade,
  course_slug text not null,
  lesson_slug text not null,
  title text not null,
  duration_label text not null default '15 min',
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  description text,
  notes_markdown text,
  resources jsonb not null default '[]'::jsonb,
  is_free_preview boolean not null default false,
  video_provider text not null default 'supabase_private'
    check (video_provider in ('supabase_private', 'vdocipher', 'bunny', 'external_signed')),
  has_video boolean not null default false,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_slug, lesson_slug)
);

create index if not exists course_lessons_module_order_idx
  on public.course_lessons (module_id, sort_order asc, created_at asc);
create index if not exists course_lessons_course_slug_idx
  on public.course_lessons (course_slug, sort_order asc);

alter table public.course_lessons enable row level security;
revoke all on public.course_lessons from public, anon, authenticated;
grant select on public.course_lessons to anon, authenticated;

drop policy if exists course_lessons_public_read on public.course_lessons;
create policy course_lessons_public_read
  on public.course_lessons for select to anon, authenticated
  using (is_published = true);

drop trigger if exists course_lessons_set_updated_at on public.course_lessons;
create trigger course_lessons_set_updated_at
  before update on public.course_lessons
  for each row execute function public.set_updated_at();

-- 4. Protected Media Vault Table (SERVICE ROLE ONLY — never readable from browser/PostgREST)
create table if not exists public.course_lesson_media (
  lesson_id uuid primary key references public.course_lessons(id) on delete cascade,
  course_slug text not null,
  lesson_slug text not null,
  video_provider text not null default 'supabase_private'
    check (video_provider in ('supabase_private', 'vdocipher', 'bunny', 'external_signed')),
  storage_path text,
  vdocipher_video_id text,
  bunny_library_id text,
  bunny_video_id text,
  external_source_url text,
  updated_at timestamptz not null default now(),
  unique (course_slug, lesson_slug)
);

alter table public.course_lesson_media enable row level security;
revoke all on public.course_lesson_media from public, anon, authenticated;

drop trigger if exists course_lesson_media_set_updated_at on public.course_lesson_media;
create trigger course_lesson_media_set_updated_at
  before update on public.course_lesson_media
  for each row execute function public.set_updated_at();

-- 5. Learner Personal Reflection Notes per Lesson
create table if not exists public.course_lesson_notes (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  lesson_id text not null,
  content text not null default '' check (char_length(content) <= 8000),
  updated_at timestamptz not null default now(),
  primary key (user_id, course_slug, lesson_id)
);

alter table public.course_lesson_notes enable row level security;
revoke all on public.course_lesson_notes from public, anon, authenticated;
grant select, insert, update on public.course_lesson_notes to authenticated;

drop policy if exists course_lesson_notes_select_own on public.course_lesson_notes;
create policy course_lesson_notes_select_own
  on public.course_lesson_notes for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists course_lesson_notes_insert_own on public.course_lesson_notes;
create policy course_lesson_notes_insert_own
  on public.course_lesson_notes for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.course_enrollments ce
      where ce.user_id = (select auth.uid())
        and ce.course_slug = course_slug
        and ce.status in ('active', 'completed')
    )
  );

drop policy if exists course_lesson_notes_update_own on public.course_lesson_notes;
create policy course_lesson_notes_update_own
  on public.course_lesson_notes for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 6. Registered Learner Devices (Anti-Credential Sharing Cap)
create table if not exists public.course_registered_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_id_hash text not null,
  device_label text,
  ip_hash text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  is_blocked boolean not null default false,
  unique (user_id, device_id_hash)
);

create index if not exists course_registered_devices_user_idx
  on public.course_registered_devices (user_id, last_seen_at desc);

alter table public.course_registered_devices enable row level security;
revoke all on public.course_registered_devices from public, anon, authenticated;

-- 7. Active Playback Sessions (Single Concurrent Stream Enforcement)
create table if not exists public.course_playback_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  lesson_id text not null,
  device_id_hash text not null,
  ip_hash text,
  user_agent text,
  started_at timestamptz not null default now(),
  last_heartbeat_at timestamptz not null default now(),
  expires_at timestamptz not null,
  revoked_at timestamptz,
  revoke_reason text
);

create index if not exists course_playback_sessions_active_idx
  on public.course_playback_sessions (user_id, expires_at desc)
  where revoked_at is null;

alter table public.course_playback_sessions enable row level security;
revoke all on public.course_playback_sessions from public, anon, authenticated;

-- 8. Anti-Piracy & Tamper Security Events Log
create table if not exists public.course_security_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  course_slug text not null,
  lesson_id text,
  event_type text not null,
  severity text not null default 'warning'
    check (severity in ('info', 'warning', 'critical')),
  ip_hash text,
  device_id_hash text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists course_security_events_created_idx
  on public.course_security_events (created_at desc);
create index if not exists course_security_events_user_idx
  on public.course_security_events (user_id, created_at desc);

alter table public.course_security_events enable row level security;
revoke all on public.course_security_events from public, anon, authenticated;

-- 9. Private Supabase Storage Bucket for Recorded Course Videos & Workbooks
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'course-videos-private',
  'course-videos-private',
  false,
  536870912,
  array['video/mp4', 'video/webm', 'video/quicktime', 'application/pdf']
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

comment on table public.course_lesson_media is
  'Service-role-only vault storing private storage paths, VdoCipher DRM video IDs, and Bunny stream keys.';
comment on table public.course_playback_sessions is
  'Tracks live playback heartbeats to enforce single-stream concurrency and short-lived stream tokens.';
