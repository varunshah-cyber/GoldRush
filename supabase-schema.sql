-- ─────────────────────────────────────────────────────────────
-- GOLDRUSH QUIZ  ·  Supabase Schema
-- Paste this into Supabase → SQL Editor → Run
-- ─────────────────────────────────────────────────────────────

-- 1. PROFILES TABLE
--    Auto-populated when a user signs up via the trigger below.
create table if not exists public.profiles (
  id          uuid        primary key references auth.users on delete cascade,
  name        text        not null,
  email       text        not null,
  created_at  timestamptz default now()
);

-- 2. DAILY ATTEMPTS TABLE
--    One row per user per calendar day (IST date stored as quiz_date).
create table if not exists public.daily_attempts (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references public.profiles(id) on delete cascade,
  quiz_date    date        not null default current_date,
  score        integer     not null check (score between 0 and 10),
  time_seconds integer     not null check (time_seconds >= 0),
  rank         integer     default 99,
  points       integer     default 1,
  answers      jsonb,
  completed_at timestamptz default now(),
  unique (user_id, quiz_date)
);

-- Index for fast leaderboard queries
create index if not exists idx_daily_attempts_date
  on public.daily_attempts (quiz_date, score desc, time_seconds asc);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────

alter table public.profiles       enable row level security;
alter table public.daily_attempts enable row level security;

-- Profiles: anyone can read; users can only insert/update their own row
create policy "profiles_select_all"
  on public.profiles for select using (true);

create policy "profiles_insert_own"
  on public.profiles for insert with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update using (auth.uid() = id);

-- Attempts: anyone can read leaderboard; users can only write their own row
create policy "attempts_select_all"
  on public.daily_attempts for select using (true);

create policy "attempts_insert_own"
  on public.daily_attempts for insert with check (auth.uid() = user_id);

create policy "attempts_update_own"
  on public.daily_attempts for update using (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- TRIGGER: auto-create profile on signup
-- ─────────────────────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- DONE. Your database is ready.
-- ─────────────────────────────────────────────────────────────
