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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const REPORT_WINDOW_MS = 10 * 60 * 1000;

// Truncate by code point; strip line breaks for single-line fields (names, reason, subject).
const clip = (value: unknown, max: number) =>
  typeof value === "string" ? Array.from(value).slice(0, max).join("") : "";
const line = (value: unknown, max: number) =>
  clip(value, max).replace(/[\r\n\t]+/g, " ").trim();

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const reportId = typeof body?.reportId === "string" ? body.reportId : "";
  if (!UUID_RE.test(reportId)) return NextResponse.json({ error: "Invalid reportId" }, { status: 400 });

  // RLS limits this read to the user's own reports, so a missing row is also a foreign one.
  const { data: report } = await supabase
    .from("reports")
    .select("id, reporter_id, reported_id, context, status, created_at")
    .eq("id", reportId)
    .maybeSingle();
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });
  if (report.reporter_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (report.status !== "pending") return NextResponse.json({ error: "Report is not pending" }, { status: 400 });

  const createdAt = Date.parse(report.created_at);
  const now = Date.now();
  if (!Number.isFinite(createdAt) || now - createdAt > REPORT_WINDOW_MS) {
    return NextResponse.json({ error: "Report is too old to notify" }, { status: 400 });
  }

  // Atomic, cross-instance claim on reports.notified_at (see the harden_rls migration).
  const { data: claimed, error: claimError } = await supabase.rpc("claim_report_notification", {
    p_report_id: report.id,
  });
  if (claimError) return NextResponse.json({ error: claimError.message }, { status: 500 });
  if (!claimed) return NextResponse.json({ error: "Already notified" }, { status: 409 });

  const profileIds = [report.reporter_id, report.reported_id].filter((id): id is string => !!id);
  const { data: profileRows } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .in("id", profileIds);
  const profileById = new Map((profileRows ?? []).map(p => [p.id, p]));
  const reporter = profileById.get(report.reporter_id);
  const reported = report.reported_id ? profileById.get(report.reported_id) : undefined;

  // Context is stored as `Reason: ${reason}\n\n${context}` by /report.
  const raw = report.context ?? "";
  const match = raw.match(/^Reason: ([^\n]*)\n\n([\s\S]*)$/);
  const reason = line(match ? match[1] : "Other", 100) || "Other";
  const context = clip(match ? match[2] : raw, 2000);

  const reporterName = line(reporter?.display_name || reporter?.username, 80) || "User";
  const reporterUsername = line(reporter?.username, 80);
  const reportedName = line(reported?.display_name || reported?.username, 80) || "User";
  const reportedUsername = line(reported?.username, 80);

  const html = await render(
    ReportNotificationEmail({
      reporterName,
      reporterUsername,
      reportedName,
      reportedUsername,
      reason,
      context,
      reportedAt: report.created_at,
      adminDashboardUrl: "https://www.ghostlinestudios.com/admin",
    })
  );

  const { error } = await getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAILS,
    subject: `[Report] ${reporterName} reported ${reportedName}`,
    html,
  });

  if (error) {
    // allow a retry after a failed send
    await supabase.rpc("release_report_notification", { p_report_id: report.id });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
