-- ================================================================
-- Ghostline — harden RLS / DB correctness
-- Idempotent: safe to paste into the Supabase SQL editor on top of
-- the existing database (and safe to run more than once).
--
-- Fixes
--   1. is_admin privilege escalation on public.profiles
--   2. friendships: only the addressee may accept/decline
--   3. messages: recipients may only change read_at
--   4. DMs require an accepted friendship (conversation + message)
--   5. admins can read the chat log of reported conversations
--   6. handle_new_user(): unique username on signup + search_path
--   8. reports.notified_at / profiles.welcome_sent_at server markers,
--      claim_* functions, report rate limit
--   7. length limits, username format, reports.status/conversation checks
--
-- Convention used by the guard triggers: they only restrict the
-- API roles `anon` / `authenticated`. The SQL editor (postgres),
-- service_role and SECURITY DEFINER functions are unaffected, so the
-- documented "make yourself an admin" statement keeps working.
-- ================================================================

begin;

alter table public.profiles add column if not exists welcome_sent_at timestamptz;
alter table public.reports  add column if not exists notified_at     timestamptz;

-- ── 1. profiles: block is_admin escalation (+ protect id/created_at,
--      enforce length limits and username format on change) ───────
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

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

-- ── 2. friendships: only the addressee can accept / decline ─────
-- Requester may only cancel (delete). New requests must start 'pending'.
drop policy if exists "Users can send friend requests" on public.friendships;
create policy "Users can send friend requests"
  on public.friendships for insert
  with check (auth.uid() = requester_id and status = 'pending');

drop policy if exists "Users can update own friendships" on public.friendships;
drop policy if exists "Addressee can respond to friend requests" on public.friendships;
create policy "Addressee can respond to friend requests"
  on public.friendships for update
  using (auth.uid() = addressee_id)
  with check (auth.uid() = addressee_id);

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

-- ── 3 + 4. conversations & messages ─────────────────────────────
-- Conversations: creation requires an accepted friendship between the
-- two participants; updates may only touch last_message_at.
drop policy if exists "Participants can create conversations" on public.conversations;
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

drop policy if exists "Participants can update conversations" on public.conversations;
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

-- Messages: sending requires being a participant AND an accepted
-- friendship between the participants; content 1..4000 chars.
drop policy if exists "Participants can send messages" on public.messages;
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
drop policy if exists "Participants can mark messages read" on public.messages;
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

-- ── 5. admins can read chat logs of reported conversations ──────
-- Scoped to conversations that have at least one report, so admins
-- cannot browse arbitrary private DMs.
drop policy if exists "Admins can read reported messages" on public.messages;
create policy "Admins can read reported messages"
  on public.messages for select
  using (
    public.is_admin()
    and exists (select 1 from public.reports r
      where r.conversation_id = messages.conversation_id)
  );

-- ── 7. reports: status must start 'pending', conversation must be the
--      reporter's own, bounded context ─────────────────────────────
drop policy if exists "Users can submit reports" on public.reports;
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

-- ── 6. handle_new_user(): always pick a free, valid username ────
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 8. reports.notified_at + rate limit; profiles.welcome_sent_at ──
-- Server-controlled markers. Clients cannot write them directly; they go
-- through the SECURITY DEFINER claim_* functions below.
alter table public.reports  add column if not exists notified_at    timestamptz;
alter table public.profiles add column if not exists welcome_sent_at timestamptz;

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

commit;
