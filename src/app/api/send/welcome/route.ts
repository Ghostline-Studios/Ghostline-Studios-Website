import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";
import { getResend, FROM } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";
import WelcomeEmail from "@/emails/WelcomeEmail";

const WELCOME_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

// Best-effort guard against parallel requests on one server instance.
// The durable marker is user_metadata.welcome_sent_at.
const welcomeInFlight = new Set<string>();

// Truncate by code point; strip line breaks for single-line fields.
const line = (value: unknown, max: number) =>
  (typeof value === "string" ? Array.from(value).slice(0, max).join("") : "")
    .replace(/[\r\n\t]+/g, " ")
    .trim();

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (typeof user.user_metadata?.welcome_sent_at === "string") {
    return NextResponse.json({ error: "Welcome email already sent" }, { status: 409 });
  }

  const createdAt = Date.parse(user.created_at);
  if (!Number.isFinite(createdAt) || Date.now() - createdAt > WELCOME_WINDOW_MS) {
    return NextResponse.json({ error: "Account is too old for a welcome email" }, { status: 403 });
  }

  if (welcomeInFlight.has(user.id)) {
    return NextResponse.json({ error: "Welcome email already sent" }, { status: 409 });
  }
  welcomeInFlight.add(user.id);

  try {
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

    // updateUser merges `data` keys, so display_name/username set by the welcome page are kept.
    const { error: markError } = await supabase.auth.updateUser({
      data: { welcome_sent_at: new Date().toISOString() },
    });
    if (markError) console.error("welcome_sent_at write failed", markError.message);

    return NextResponse.json({ ok: true });
  } finally {
    welcomeInFlight.delete(user.id);
  }
}
