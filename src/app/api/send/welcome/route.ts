import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";
import { getResend, FROM } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";
import WelcomeEmail from "@/emails/WelcomeEmail";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { displayName, username } = await req.json();

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
