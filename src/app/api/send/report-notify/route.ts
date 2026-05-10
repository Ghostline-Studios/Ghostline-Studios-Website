import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";
import { getResend, FROM } from "@/lib/resend";
import { createClient } from "@/lib/supabase/server";
import ReportNotificationEmail from "@/emails/ReportNotificationEmail";

// Comma-separated admin emails, e.g. "studio@ghostlinestudios.com"
const ADMIN_EMAILS = (process.env.ADMIN_NOTIFICATION_EMAIL ?? "studio@ghostlinestudios.com")
  .split(",")
  .map(e => e.trim())
  .filter(Boolean);

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { reporterName, reporterUsername, reportedName, reportedUsername, reason, context, reportedAt } = await req.json();

  const html = await render(
    ReportNotificationEmail({
      reporterName,
      reporterUsername,
      reportedName,
      reportedUsername,
      reason,
      context,
      reportedAt,
      adminDashboardUrl: "https://www.ghostlinestudios.com/admin",
    })
  );

  const { error } = await getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAILS,
    subject: `[Report] ${reporterName} reported ${reportedName}`,
    html,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
