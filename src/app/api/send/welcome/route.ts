import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";
import { getResend, FROM } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";
import WelcomeEmail from "@/emails/WelcomeEmail";

const WELCOME_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

// Truncate by code point; strip line breaks for single-line fields.
const line = (value: unknown, max: number) =>
  (typeof value === "string" ? Array.from(value).slice(0, max).join("") : "")
    .replace(/[\r\n\t]+/g, " ")
    .trim();

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const createdAt = Date.parse(user.created_at);
  if (!Number.isFinite(createdAt) || Date.now() - createdAt > WELCOME_WINDOW_MS) {
    return NextResponse.json({ error: "Account is too old for a welcome email" }, { status: 403 });
  }

  // Atomic claim on profiles.welcome_sent_at, which clients cannot write directly
  // (see the harden_rls migration). If the send below fails, no welcome is retried.
  const { data: claimed, error: claimError } = await supabase.rpc("claim_welcome_email");
  if (claimError) return NextResponse.json({ error: claimError.message }, { status: 500 });
  if (!claimed) return NextResponse.json({ error: "Welcome email already sent" }, { status: 409 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name")
    .eq("id", user.id)
    .maybeSingle();

  let username: string;
  let displayName: string;
  if (profile) {
    username = line(profile.username, 80);
    displayName = line(profile.display_name, 80) || username || "Player";
  } else {
    // Profile row missing: fall back to what the client sent.
    const body = await req.json().catch(() => null);
    username = line(body?.username, 80);
    displayName = line(body?.displayName, 80) || username || "Player";
  }

  const html = await render(
    WelcomeEmail({
      displayName,
      username,
      profileUrl: "https://www.ghostlinestudios.com/account",
    })
  );

  const { error } = await getResend().emails.send({
    from: FROM,
    to: user.email!,
    subject: `Welcome to Ghostline ID, ${displayName}`,
    html,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
