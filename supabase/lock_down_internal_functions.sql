-- Applied 2026-11-09 (Supabase security advisor): internal functions off the public API.

-- handle_new_user: the trigger on auth.users that creates a profile on sign-up. It names
-- its tables in full, so an empty search_path is safe; nobody should call it through the
-- API (the trigger still fires: triggers don't need EXECUTE).
alter function public.handle_new_user() set search_path = '';
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- rls_auto_enable: the event trigger that switches RLS on for new tables; never an API call.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- is_admin() stays callable: the RLS policies on profiles, wishlists, devlogs and reports
-- call it as the querying user, and it only says whether the caller is an admin.
