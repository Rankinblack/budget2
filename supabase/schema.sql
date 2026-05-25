-- ============================================================
-- ميزانيتي — Supabase schema (run in: Dashboard → SQL Editor)
-- ============================================================

-- 1) PROFILES: one row per user. Holds global settings + plan.
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  settings    jsonb not null default '{}'::jsonb,
  plan        text  not null default 'free',          -- 'free' | 'pro'
  stripe_customer_id text,
  updated_at  timestamptz not null default now()
);

-- 2) BUDGETS: one row per user + month. Holds that month's data.
create table if not exists public.budgets (
  user_id     uuid not null references auth.users(id) on delete cascade,
  year        int  not null,
  month       text not null,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (user_id, year, month)
);

-- 3) Row Level Security: users can only touch their own rows.
alter table public.profiles enable row level security;
alter table public.budgets  enable row level security;

drop policy if exists "own profile read"   on public.profiles;
drop policy if exists "own profile write"  on public.profiles;
drop policy if exists "own profile update" on public.profiles;
create policy "own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "own profile write"  on public.profiles for insert with check (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

drop policy if exists "own budgets read"   on public.budgets;
drop policy if exists "own budgets write"  on public.budgets;
drop policy if exists "own budgets update" on public.budgets;
drop policy if exists "own budgets delete" on public.budgets;
create policy "own budgets read"   on public.budgets for select using (auth.uid() = user_id);
create policy "own budgets write"  on public.budgets for insert with check (auth.uid() = user_id);
create policy "own budgets update" on public.budgets for update using (auth.uid() = user_id);
create policy "own budgets delete" on public.budgets for delete using (auth.uid() = user_id);

-- 4) Auto-create a profile row when a new user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, settings, plan)
  values (new.id, '{}'::jsonb, 'free')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- NOTE: the webhook flips plan -> 'pro' using the SERVICE ROLE key,
-- which bypasses RLS, so no client can grant itself Pro.
