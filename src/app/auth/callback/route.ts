import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Only allow same-origin relative paths; anything else falls back to "/".
function safeNext(raw: string | null): string {
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return "/";
  if (raw.includes("\\") || /[\u0000-\u001f\u007f]/.test(raw)) return "/";
  return raw;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // /welcome writes user_metadata.username on completion. OAuth users
      // (Google/Apple) never hit it via `next`, so send them there until they have one,
      // keeping a `next` that already points at /welcome (e.g. ?returnTo=scicrime).
      const needsWelcome = data.user && !data.user.user_metadata?.username;
      const dest = needsWelcome && !next.startsWith("/welcome") ? "/welcome" : next;
      const target = new URL(dest, origin);
      return NextResponse.redirect(
        target.origin === origin ? target : new URL("/", origin)
      );
    }
  }

  return NextResponse.redirect(`${origin}/?auth=error`);
}
