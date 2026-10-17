import { createClient } from "@supabase/supabase-js";

/**
 * Cookie-less Supabase client for public, anonymous reads during server
 * rendering. Unlike `./server`, it never touches cookies(), so pages that use
 * it can still be statically rendered / ISR-cached.
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
