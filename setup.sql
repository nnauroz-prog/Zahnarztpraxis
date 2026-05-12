-- ============================================================
-- DentalHarmonie · Supabase-Schema
-- Etappe 1 — im SQL-Editor des Supabase-Projekts ausführen.
-- ============================================================

-- ---------- content ----------
create table if not exists public.content (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.content enable row level security;

drop policy if exists "content read"  on public.content;
drop policy if exists "content write" on public.content;

create policy "content read"  on public.content
  for select using (true);

create policy "content write" on public.content
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ---------- appointment_requests ----------
create table if not exists public.appointment_requests (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  phone text not null,
  email text,
  request_type text not null,
  preferred_date date,
  preferred_time text,
  message text,
  privacy_accepted boolean not null default false,
  status text not null default 'new',
  received_at timestamptz not null default now()
);

alter table public.appointment_requests enable row level security;

drop policy if exists "ar insert" on public.appointment_requests;
drop policy if exists "ar read"   on public.appointment_requests;
drop policy if exists "ar update" on public.appointment_requests;
drop policy if exists "ar delete" on public.appointment_requests;

create policy "ar insert" on public.appointment_requests
  for insert
  with check (privacy_accepted = true);

create policy "ar read" on public.appointment_requests
  for select
  using (auth.role() = 'authenticated');

create policy "ar update" on public.appointment_requests
  for update
  using (auth.role() = 'authenticated');

create policy "ar delete" on public.appointment_requests
  for delete
  using (auth.role() = 'authenticated');

-- ---------- Realtime ----------
alter publication supabase_realtime add table public.appointment_requests;
alter publication supabase_realtime add table public.content;

-- ---------- Storage-Bucket images ----------
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

drop policy if exists "images read"   on storage.objects;
drop policy if exists "images upload" on storage.objects;
drop policy if exists "images update" on storage.objects;
drop policy if exists "images delete" on storage.objects;

create policy "images read" on storage.objects
  for select
  using (bucket_id = 'images');

create policy "images upload" on storage.objects
  for insert
  with check (bucket_id = 'images' and auth.role() = 'authenticated');

create policy "images update" on storage.objects
  for update
  using (bucket_id = 'images' and auth.role() = 'authenticated');

create policy "images delete" on storage.objects
  for delete
  using (bucket_id = 'images' and auth.role() = 'authenticated');
