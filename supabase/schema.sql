-- =============================================
-- FORMED DESIGN — Team Target Planner Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension (usually already enabled)
create extension if not exists "pgcrypto";

-- =============================================
-- PROFILES TABLE
-- Extends auth.users automatically via trigger
-- =============================================
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text not null default '',
  avatar_url  text,
  current_vibe text not null default '🚀'
    check (current_vibe in ('🚀', '☕', '🐢')),
  role        text not null default 'member'
    check (role in ('member', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- =============================================
-- TASKS TABLE
-- =============================================
create table if not exists public.tasks (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  title         text not null,
  timeframe     text not null
    check (timeframe in ('daily', 'weekly', 'monthly')),
  target_value  numeric not null default 100,
  actual_value  numeric not null default 0,
  status        text not null default 'pending'
    check (status in ('pending', 'in_progress', 'complete', 'at_risk')),
  due_date      date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================
-- AUTO-UPDATE updated_at TRIGGER
-- =============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
  before update on public.tasks
  for each row execute function public.handle_updated_at();

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- =============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================
-- ROW LEVEL SECURITY (idempotent — safe to re-run)
-- =============================================
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "profiles_select_authenticated" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "tasks_select_authenticated" on public.tasks;
drop policy if exists "tasks_insert_own" on public.tasks;
drop policy if exists "tasks_update_own" on public.tasks;
drop policy if exists "tasks_delete_own" on public.tasks;
drop policy if exists "tasks_admin_update" on public.tasks;

-- Profiles: all authenticated users can read; only owner can update
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Allow users to create their own profile (fixes missing trigger / legacy signups)
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Tasks: all authenticated users can read all tasks
create policy "tasks_select_authenticated"
  on public.tasks for select
  to authenticated
  using (true);

-- Users can insert/update/delete their own tasks
create policy "tasks_insert_own"
  on public.tasks for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "tasks_update_own"
  on public.tasks for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "tasks_delete_own"
  on public.tasks for delete
  to authenticated
  using (auth.uid() = user_id);

-- Admins can update any task (for high-five / notes feature)
create policy "tasks_admin_update"
  on public.tasks for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- =============================================
-- REALTIME PUBLICATIONS (skip if already added)
-- =============================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'profiles'
  ) then
    alter publication supabase_realtime add table public.profiles;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tasks'
  ) then
    alter publication supabase_realtime add table public.tasks;
  end if;
end $$;

-- =============================================
-- INDEXES
-- =============================================
create index if not exists tasks_user_id_idx on public.tasks(user_id);
create index if not exists tasks_timeframe_idx on public.tasks(timeframe);
create index if not exists tasks_status_idx on public.tasks(status);
create index if not exists tasks_updated_at_idx on public.tasks(updated_at desc);

-- =============================================
-- SEED DEMO DATA (optional — comment out for production)
-- =============================================
-- NOTE: Insert auth users first via Supabase Auth, then run this.
-- The trigger will auto-create profiles, but you can update them:
--
-- update public.profiles set full_name = 'Alex Rivera', role = 'admin'
--   where id = '<user-uuid>';
