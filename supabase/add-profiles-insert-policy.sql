-- Run once in Supabase SQL Editor if profile bootstrap fails (black screen / redirect loop).
-- Lets logged-in users insert their own profiles row when the signup trigger missed.

drop policy if exists "profiles_insert_own" on public.profiles;

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);
