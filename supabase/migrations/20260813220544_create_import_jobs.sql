create table public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  idempotency_key uuid not null,
  source_provider text not null default 'instagram'
    check (source_provider in ('instagram')),
  source_username text not null
    check (char_length(source_username) between 1 and 64),
  status text not null default 'awaiting_upload'
    check (status in (
      'awaiting_upload',
      'queued',
      'processing',
      'ready_for_review',
      'failed',
      'cancelled'
    )),
  media_count smallint not null default 0
    check (media_count between 0 and 50),
  draft_count smallint not null default 0
    check (draft_count between 0 and 50),
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint import_jobs_user_idempotency_unique
    unique (user_id, idempotency_key)
);

create index import_jobs_user_created_at_idx
  on public.import_jobs (user_id, created_at desc);

create index import_jobs_active_status_idx
  on public.import_jobs (status, updated_at)
  where status in ('awaiting_upload', 'queued', 'processing');

alter table public.import_jobs enable row level security;
alter table public.import_jobs force row level security;

revoke all on table public.import_jobs from anon;
revoke all on table public.import_jobs from authenticated;
grant select on table public.import_jobs to authenticated;
grant insert (
  user_id,
  idempotency_key,
  source_provider,
  source_username
) on table public.import_jobs to authenticated;

create policy "Users can read their own import jobs"
  on public.import_jobs
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own import jobs"
  on public.import_jobs
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);
