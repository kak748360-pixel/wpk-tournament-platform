create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nickname text not null,
  avatar_url text,
  country text default 'CN',
  created_at timestamptz default now()
);

create table if not exists public.tournaments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  entry_fee numeric(10,2) default 0,
  prize_pool numeric(10,2) default 0,
  start_time timestamptz not null,
  registration_deadline timestamptz,
  status text default 'draft',
  rules text,
  created_at timestamptz default now()
);

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  payment_status text default 'pending',
  payment_method text default 'USDT',
  created_at timestamptz default now(),
  unique(user_id, tournament_id)
);

create table if not exists public.results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  tournament_id uuid not null references public.tournaments(id) on delete cascade,
  rank integer not null,
  points integer default 0,
  prize numeric(10,2) default 0,
  proof_url text,
  created_at timestamptz default now(),
  unique(user_id, tournament_id)
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text default 'general',
  created_at timestamptz default now()
);

alter table public.users enable row level security;
alter table public.tournaments enable row level security;
alter table public.registrations enable row level security;
alter table public.results enable row level security;
alter table public.announcements enable row level security;

create policy "Users can read own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);
create policy "Anyone can read tournaments" on public.tournaments for select using (true);
create policy "Admins can manage tournaments" on public.tournaments for all using (auth.role() = 'authenticated');
create policy "Anyone can read announcements" on public.announcements for select using (true);
create policy "Admins can manage announcements" on public.announcements for all using (auth.role() = 'authenticated');
