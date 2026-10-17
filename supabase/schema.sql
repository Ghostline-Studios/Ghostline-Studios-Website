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
  welcome_sent_at timestamptz, -- server-controlled, see claim_welcome_email()
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
  on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- Guard: API users (anon/authenticated) can never set or change is_admin,
-- and cannot change id/created_at. postgres / service_role / SQL editor
-- are unaffected, so the "Make yourself an admin" statement below works.
create or replace function public.guard_profile_write()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  -- Only restrict API callers. postgres / service_role / SQL editor pass.
  if current_user not in ('anon', 'authenticated') then
    return new;
  end if;

  -- Privileged columns are silently pinned (not rejected): the account/welcome
  -- pages upsert whole rows, and an upsert that hits an existing row re-sends the
  -- INSERT values as the UPDATE, so rejecting would break legitimate saves.
  if tg_op = 'INSERT' then
    new.is_admin := false;
    new.welcome_sent_at := null;
  else
    -- Promote/demote admins from the SQL editor or with the service role.
    new.is_admin := old.is_admin;
    new.welcome_sent_at := old.welcome_sent_at;  -- see claim_welcome_email()
    new.id := old.id;
    new.created_at := old.created_at;
  end if;

  -- Validate only values being written, so legacy rows never block unrelated edits.
  if new.username is not null
     and (tg_op = 'INSERT' or new.username is distinct from old.username)
     and new.username !~ '^[a-z0-9_-]{3,32}$' then
    raise exception 'username must be 3-32 characters: lowercase letters, numbers, _ and -'
      using errcode = '23514';
  end if;
  if (tg_op = 'INSERT' or new.display_name is distinct from old.display_name)
     and char_length(new.display_name) > 80 then
    raise exception 'display_name too long (max 80)' using errcode = '23514';
  end if;
  if (tg_op = 'INSERT' or new.bio is distinct from old.bio)
     and char_length(new.bio) > 500 then
    raise exception 'bio too long (max 500)' using errcode = '23514';
  end if;
  if (tg_op = 'INSERT' or new.avatar_url is distinct from old.avatar_url)
     and char_length(new.avatar_url) > 2048 then
    raise exception 'avatar_url too long (max 2048)' using errcode = '23514';
  end if;

  return new;
end;
$$;

drop trigger if exists guard_profile_write on public.profiles;
create trigger guard_profile_write
  before insert or update on public.profiles
  for each row execute function public.guard_profile_write();

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

-- Wishlists are publicly visible (for /u/[username] profile pages)
create policy "Wishlists are publicly readable"
  on public.wishlists for select using (true);

-- Newsletter: owner only
create policy "Users can read own newsletter prefs"
  on public.newsletter_preferences for select using (auth.uid() = user_id);

create policy "Users can insert own newsletter prefs"
  on public.newsletter_preferences for insert with check (auth.uid() = user_id);

create policy "Users can update own newsletter prefs"
  on public.newsletter_preferences for update using (auth.uid() = user_id);

-- ── Auto-create profile + newsletter prefs on signup ─────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_base text;
  v_name text;
  v_try  int := 0;
begin
  -- lowercase, keep [a-z0-9_-], cap length, enforce min 3 chars
  v_base := lower(coalesce(
    nullif(new.raw_user_meta_data->>'username', ''),
    split_part(coalesce(new.email, ''), '@', 1)
  ));
  v_base := left(regexp_replace(v_base, '[^a-z0-9_-]', '', 'g'), 24);
  if char_length(v_base) < 3 then
    v_base := 'user' || v_base;
  end if;
  v_name := v_base;

  loop
    if not exists (select 1 from public.profiles where lower(username) = v_name) then
      begin
        insert into public.profiles (id, username, display_name, avatar_url)
        values (
          new.id,
          v_name,
          coalesce(
            new.raw_user_meta_data->>'display_name',
            new.raw_user_meta_data->>'full_name',
            split_part(coalesce(new.email, ''), '@', 1)
          ),
          new.raw_user_meta_data->>'avatar_url'
        )
        on conflict (id) do nothing;
        exit;
      exception when unique_violation then
        null; -- lost a race for the username: fall through and pick another
      end;
    end if;
    v_try := v_try + 1;
    v_name := v_base || '_' ||
      case when v_try < 10
           then lpad((floor(random() * 10000))::int::text, 4, '0')
           else substr(md5(random()::text || new.id::text), 1, 8) end;
  end loop;

  insert into public.newsletter_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

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
  with check (auth.uid() = requester_id and status = 'pending');

-- Only the addressee may accept/decline; the requester can only cancel (delete).
create policy "Addressee can respond to friend requests"
  on public.friendships for update
  using (auth.uid() = addressee_id)
  with check (auth.uid() = addressee_id);

create policy "Users can delete own friendships"
  on public.friendships for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create or replace function public.guard_friendship_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user not in ('anon', 'authenticated') then
    return new;
  end if;
  if new.requester_id is distinct from old.requester_id
     or new.addressee_id is distinct from old.addressee_id then
    raise exception 'friendship participants cannot be changed' using errcode = '42501';
  end if;
  new.id := old.id;
  new.created_at := old.created_at;
  return new;
end;
$$;

drop trigger if exists guard_friendship_update on public.friendships;
create trigger guard_friendship_update
  before update on public.friendships
  for each row execute function public.guard_friendship_update();

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
-- Creating a conversation requires an accepted friendship between the two.
create policy "Participants can create conversations"
  on public.conversations for insert
  with check (
    (auth.uid() = participant_1 or auth.uid() = participant_2)
    and exists (
      select 1 from public.friendships f
      where f.status = 'accepted'
        and ((f.requester_id = participant_1 and f.addressee_id = participant_2)
          or (f.requester_id = participant_2 and f.addressee_id = participant_1))
    )
  );
create policy "Participants can update conversations"
  on public.conversations for update
  using (auth.uid() = participant_1 or auth.uid() = participant_2)
  with check (auth.uid() = participant_1 or auth.uid() = participant_2);

create or replace function public.guard_conversation_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user not in ('anon', 'authenticated') then
    return new;
  end if;
  if new.participant_1 is distinct from old.participant_1
     or new.participant_2 is distinct from old.participant_2 then
    raise exception 'conversation participants cannot be changed' using errcode = '42501';
  end if;
  new.id := old.id;
  new.created_at := old.created_at;
  return new;
end;
$$;

drop trigger if exists guard_conversation_update on public.conversations;
create trigger guard_conversation_update
  before update on public.conversations
  for each row execute function public.guard_conversation_update();

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
  with check (
    auth.uid() = sender_id
    and char_length(content) between 1 and 4000
    and exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.participant_1 = auth.uid() or c.participant_2 = auth.uid())
        and exists (
          select 1 from public.friendships f
          where f.status = 'accepted'
            and ((f.requester_id = c.participant_1 and f.addressee_id = c.participant_2)
              or (f.requester_id = c.participant_2 and f.addressee_id = c.participant_1))
        )
    )
  );

-- Mark-read: recipient only, and the trigger below restricts the change to read_at.
create policy "Participants can mark messages read"
  on public.messages for update
  using (
    auth.uid() != sender_id
    and exists (select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.participant_1 = auth.uid() or c.participant_2 = auth.uid()))
  )
  with check (
    auth.uid() != sender_id
    and exists (select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.participant_1 = auth.uid() or c.participant_2 = auth.uid()))
  );

create or replace function public.guard_message_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user not in ('anon', 'authenticated') then
    return new;
  end if;
  if new.id is distinct from old.id
     or new.conversation_id is distinct from old.conversation_id
     or new.sender_id is distinct from old.sender_id
     or new.content is distinct from old.content
     or new.created_at is distinct from old.created_at then
    raise exception 'only read_at can be changed on a message' using errcode = '42501';
  end if;
  -- read receipts are write-once
  if old.read_at is not null then
    new.read_at := old.read_at;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_message_update on public.messages;
create trigger guard_message_update
  before update on public.messages
  for each row execute function public.guard_message_update();

-- ── Reports ──────────────────────────────────────────────────────────
create table if not exists public.reports (
  id              uuid default gen_random_uuid() primary key,
  reporter_id     uuid references auth.users on delete set null,
  reported_id     uuid references auth.users on delete set null,
  conversation_id uuid references public.conversations on delete set null,
  context         text,
  notified_at     timestamptz, -- server-controlled, see claim_report_notification()
  status          text check (status in ('pending','reviewed','dismissed')) default 'pending',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table public.reports enable row level security;

create policy "Users can submit reports"
  on public.reports for insert
  with check (
    auth.uid() = reporter_id
    and status = 'pending'
    and char_length(coalesce(context, '')) <= 5000
    and (
      conversation_id is null
      or exists (select 1 from public.conversations c
        where c.id = reports.conversation_id
          and (c.participant_1 = auth.uid() or c.participant_2 = auth.uid()))
    )
  );

create policy "Users can view own reports"
  on public.reports for select
  using (auth.uid() = reporter_id);

create policy "Admins can manage reports"
  on public.reports for all
  using (public.is_admin()) with check (public.is_admin());

-- Admins can read chat logs, but only for conversations that have been reported.
create policy "Admins can read reported messages"
  on public.messages for select
  using (
    public.is_admin()
    and exists (select 1 from public.reports r
      where r.conversation_id = messages.conversation_id)
  );

create or replace function public.guard_report_write()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user not in ('anon', 'authenticated') then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if not public.is_admin() and (
      select count(*) from public.reports r
      where r.reporter_id = new.reporter_id
        and r.created_at > now() - interval '1 hour'
    ) >= 5 then
      raise exception 'too many reports, try again later' using errcode = '54000';
    end if;
    new.status := 'pending';
    new.notified_at := null;
  else
    if new.notified_at is distinct from old.notified_at and not public.is_admin() then
      raise exception 'notified_at cannot be changed by clients' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists guard_report_write on public.reports;
create trigger guard_report_write
  before insert or update on public.reports
  for each row execute function public.guard_report_write();

-- Atomically claim the right to send the admin notification email for a report.
create or replace function public.claim_report_notification(p_report_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  update public.reports
     set notified_at = now()
   where id = p_report_id
     and reporter_id = auth.uid()
     and status = 'pending'
     and notified_at is null
     and created_at > now() - interval '10 minutes'
  returning id into v_id;
  return v_id is not null;
end;
$$;

-- Undo a claim (e.g. the email send failed) for the caller's own report.
create or replace function public.release_report_notification(p_report_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.reports
     set notified_at = null
   where id = p_report_id and reporter_id = auth.uid();
end;
$$;

-- Atomically claim the welcome email for the calling user (true = you claimed it).
create or replace function public.claim_welcome_email()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  update public.profiles
     set welcome_sent_at = now()
   where id = auth.uid() and welcome_sent_at is null
  returning id into v_id;
  return v_id is not null;
end;
$$;

revoke all on function public.claim_report_notification(uuid)   from public, anon;
revoke all on function public.release_report_notification(uuid) from public, anon;
revoke all on function public.claim_welcome_email()             from public, anon;
grant execute on function public.claim_report_notification(uuid)   to authenticated;
grant execute on function public.release_report_notification(uuid) to authenticated;
grant execute on function public.claim_welcome_email()             to authenticated;

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
