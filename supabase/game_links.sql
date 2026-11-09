-- Ghostline ID: sign a game in with a link code.
--
-- A game (GoFPV first, any Ghostline game after) can't do Google / Apple sign-in itself,
-- so it shows a short code instead. The player opens ghostlinestudios.com/link, signs in
-- however they like, and enters the code. The game, which has been polling with a secret
-- only it knows, then receives a session for that account.
--
--   1. game  -> edge function game-link {action: "start"}  -> a code (e.g. "K7QM-4XPD"),
--               valid for 10 minutes; the row stores a hash of the game's device secret
--   2. player on the website (signed in) -> rpc link_approve(code) -> row.user_id = them
--   3. game  -> edge function game-link {action: "poll", code, secret} -> once approved,
--               a session (access + refresh token) for that account, exactly once
--
-- Only the edge function (service role) and the security-definer function below touch
-- the table: there are no RLS policies, so nobody can read or write rows directly.
-- Nothing existing is changed.

create table if not exists public.game_links (
  code               text primary key,             -- 8 characters, stored without the dash
  game_id            text not null,                -- e.g. 'gofpv'
  device_secret_hash text not null,                -- sha256 of the game's secret, hex
  device_name        text,                         -- shown on the website: "GoFPV on Pixel 8"
  user_id            uuid references auth.users(id) on delete cascade,
  created_at         timestamptz not null default now(),
  expires_at         timestamptz not null default now() + interval '10 minutes',
  approved_at        timestamptz,
  consumed_at        timestamptz
);

alter table public.game_links enable row level security;
-- (no policies on purpose)

create index if not exists game_links_expires_at_idx on public.game_links (expires_at);

-- Approve a code for the signed-in player. Codes are case-insensitive and the dash is
-- optional. Returns {ok, error?, game_id?, device_name?}.
create or replace function public.link_approve(p_code text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid  uuid := auth.uid();
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
  r      public.game_links;
begin
  if v_uid is null then
    return json_build_object('ok', false, 'error', 'not_signed_in');
  end if;
  select * into r from public.game_links where code = v_code for update;
  if not found then
    return json_build_object('ok', false, 'error', 'not_found');
  end if;
  if r.expires_at < now() then
    return json_build_object('ok', false, 'error', 'expired');
  end if;
  if r.approved_at is not null then
    return json_build_object('ok', false, 'error', 'already_used');
  end if;
  update public.game_links set user_id = v_uid, approved_at = now() where code = v_code;
  return json_build_object('ok', true, 'game_id', r.game_id, 'device_name', r.device_name);
end;
$$;

revoke all on function public.link_approve(text) from public, anon;
grant execute on function public.link_approve(text) to authenticated;
