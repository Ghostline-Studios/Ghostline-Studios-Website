-- ================================================================
-- Ghostline ID — Supabase Schema
-- Run this entire file in your Supabase dashboard:
--   Project → SQL Editor → New query → paste → Run
-- ================================================================

-- ── Profiles ────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid references auth.users on delete cascade primary key,
  username      text unique,
  display_name  text,
  avatar_url    text,
  bio           text,
  is_admin      boolean default false,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── Wishlists ────────────────────────────────────────────────────
create table if not exists public.wishlists (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users on delete cascade not null,
  game_id    text not null,
  created_at timestamptz default now(),
  unique (user_id, game_id)
);

-- ── Newsletter preferences ───────────────────────────────────────
create table if not exists public.newsletter_preferences (
  user_id               uuid references auth.users on delete cascade primary key,
  subscribed            boolean default true,
  studio_updates        boolean default true,
  devlog_scraplings     boolean default true,
  devlog_spectral_sabre boolean default true,
  updated_at            timestamptz default now()
);

-- ── Row-Level Security ───────────────────────────────────────────
alter table public.profiles             enable row level security;
alter table public.wishlists            enable row level security;
alter table public.newsletter_preferences enable row level security;

-- SECURITY DEFINER helper — avoids infinite recursion in RLS policies
-- that would occur if the policy itself queried the profiles table.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

-- Profiles: public read, owner write
create policy "Profiles are publicly readable"
  on public.profiles for select using (true);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Admins can read all profiles (needed for admin dashboard)
create policy "Admins can read all profiles"
  on public.profiles for select using (public.is_admin());

-- Wishlists: owner only
create policy "Users can read own wishlist"
  on public.wishlists for select using (auth.uid() = user_id);

create policy "Users can add to own wishlist"
  on public.wishlists for insert with check (auth.uid() = user_id);

create policy "Users can remove from own wishlist"
  on public.wishlists for delete using (auth.uid() = user_id);

-- Admins can read all wishlists (for admin dashboard counts)
create policy "Admins can read all wishlists"
  on public.wishlists for select using (public.is_admin());

-- Newsletter: owner only
create policy "Users can read own newsletter prefs"
  on public.newsletter_preferences for select using (auth.uid() = user_id);

create policy "Users can insert own newsletter prefs"
  on public.newsletter_preferences for insert with check (auth.uid() = user_id);

create policy "Users can update own newsletter prefs"
  on public.newsletter_preferences for update using (auth.uid() = user_id);

-- ── Auto-create profile + newsletter prefs on signup ─────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  insert into public.newsletter_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if it already exists, then recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Devlogs ──────────────────────────────────────────────────────
create table if not exists public.devlogs (
  id           uuid default gen_random_uuid() primary key,
  title        text not null,
  slug         text unique not null,
  excerpt      text,
  content      text,
  game_id      text, -- 'scraplings' | 'spectral-sabre' | null = studio update
  author_id    uuid references auth.users on delete set null,
  is_published boolean default false,
  published_at timestamptz,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.devlogs enable row level security;

create policy "Published devlogs are public"
  on public.devlogs for select using (is_published = true);

create policy "Admins can manage devlogs"
  on public.devlogs for all
  using (public.is_admin()) with check (public.is_admin());

-- ── Friendships ─────────────────────────────────────────────────
create table if not exists public.friendships (
  id           uuid default gen_random_uuid() primary key,
  requester_id uuid references auth.users on delete cascade not null,
  addressee_id uuid references auth.users on delete cascade not null,
  status       text check (status in ('pending','accepted','declined')) default 'pending',
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  unique (requester_id, addressee_id),
  check (requester_id != addressee_id)
);

alter table public.friendships enable row level security;

create policy "Users can view own friendships"
  on public.friendships for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "Users can send friend requests"
  on public.friendships for insert
  with check (auth.uid() = requester_id);

create policy "Users can update own friendships"
  on public.friendships for update
  using (auth.uid() = addressee_id or auth.uid() = requester_id);

create policy "Users can delete own friendships"
  on public.friendships for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- ── Conversations & Messages (DM system) ────────────────────────
create table if not exists public.conversations (
  id            uuid default gen_random_uuid() primary key,
  participant_1 uuid references auth.users on delete cascade not null,
  participant_2 uuid references auth.users on delete cascade not null,
  last_message_at timestamptz default now(),
  created_at    timestamptz default now(),
  unique (participant_1, participant_2),
  check (participant_1 < participant_2)
);
alter table public.conversations enable row level security;
create policy "Participants can view their conversations"
  on public.conversations for select
  using (auth.uid() = participant_1 or auth.uid() = participant_2);
create policy "Participants can create conversations"
  on public.conversations for insert
  with check (auth.uid() = participant_1 or auth.uid() = participant_2);
create policy "Participants can update conversations"
  on public.conversations for update
  using (auth.uid() = participant_1 or auth.uid() = participant_2);

create table if not exists public.messages (
  id              uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.conversations on delete cascade not null,
  sender_id       uuid references auth.users on delete cascade not null,
  content         text not null,
  created_at      timestamptz default now(),
  read_at         timestamptz
);
alter table public.messages enable row level security;
create policy "Participants can read messages"
  on public.messages for select
  using (exists (select 1 from public.conversations where id = conversation_id
    and (participant_1 = auth.uid() or participant_2 = auth.uid())));
create policy "Participants can send messages"
  on public.messages for insert
  with check (auth.uid() = sender_id and exists (
    select 1 from public.conversations where id = conversation_id
    and (participant_1 = auth.uid() or participant_2 = auth.uid())));

-- ── Reports ──────────────────────────────────────────────────────────
create table if not exists public.reports (
  id              uuid default gen_random_uuid() primary key,
  reporter_id     uuid references auth.users on delete set null,
  reported_id     uuid references auth.users on delete set null,
  conversation_id uuid references public.conversations on delete set null,
  context         text,
  status          text check (status in ('pending','reviewed','dismissed')) default 'pending',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.reports enable row level security;

create policy "Users can submit reports"
  on public.reports for insert
  with check (auth.uid() = reporter_id);

create policy "Users can view own reports"
  on public.reports for select
  using (auth.uid() = reporter_id);

create policy "Admins can manage reports"
  on public.reports for all
  using (public.is_admin()) with check (public.is_admin());

-- Enable realtime
alter publication supabase_realtime add table public.friendships;
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.reports;

-- ── Make yourself an admin ───────────────────────────────────────
-- After signing up, run this (replace with your actual email):
-- update public.profiles
--   set is_admin = true
--   where id = (select id from auth.users where email = 'your@email.com');
