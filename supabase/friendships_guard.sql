-- Friend requests must be accepted by the person they're sent to.
--
-- The friendships policies let the requester insert a row that's already 'accepted', or
-- update their own request to 'accepted', which made anyone your friend without you
-- saying yes (and friends see each other's GoFPV times and ghosts). This trigger keeps
-- the website and games working as they do, and closes that:
--   * a new request is always 'pending'
--   * only the person it was sent to can accept or decline it
--   * who sent it and who it's to can't be changed afterwards
create or replace function public.friendships_guard()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  -- the service role (dashboard, edge functions) isn't restricted
  if auth.uid() is null then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.status := 'pending';
    return new;
  end if;
  if new.requester_id <> old.requester_id or new.addressee_id <> old.addressee_id then
    raise exception 'a friendship''s people can''t be changed' using errcode = '42501';
  end if;
  if new.status is distinct from old.status and auth.uid() <> old.addressee_id then
    raise exception 'only the person a request was sent to can answer it' using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke execute on function public.friendships_guard() from public, anon, authenticated;

drop trigger if exists friendships_guard on public.friendships;
create trigger friendships_guard
  before insert or update on public.friendships
  for each row execute function public.friendships_guard();
