/**
 * Sent to every admin when a new user report is filed.
 * Triggered from /api/send/report-notify.
 */
import { Section, Text } from "@react-email/components";
import {
  GhostlineEmail,
  EmailHeading,
  EmailBody,
  EmailButton,
  EmailDivider,
  EmailLabel,
  EmailMono,
  WRAITH,
  SPECTRAL,
  MONO,
} from "./GhostlineEmail";

export interface ReportNotificationEmailProps {
  reporterName?: string;
  reporterUsername?: string;
  reportedName?: string;
  reportedUsername?: string;
  reason?: string;
  context?: string;
  reportedAt?: string;
  adminDashboardUrl?: string;
}

export default function ReportNotificationEmail({
  reporterName = "User",
  reporterUsername = "user",
  reportedName = "User",
  reportedUsername = "user",
  reason = "Other",
  context = "",
  reportedAt = new Date().toISOString(),
  adminDashboardUrl = "https://www.ghostlinestudios.com/admin",
}: ReportNotificationEmailProps) {
  const date = new Date(reportedAt).toLocaleString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZoneName: "short",
  });

  return (
    <GhostlineEmail preview={`New report filed: ${reporterName} reported ${reportedName}`}>
      <EmailLabel>Admin Alert · New Report</EmailLabel>
      <EmailHeading>A report has been filed</EmailHeading>
      <EmailBody>
        A Ghostline ID user has submitted a report. Review it in the admin
        dashboard and take appropriate action.
      </EmailBody>

      {/* Report summary */}
      <Section style={{
        backgroundColor: "rgba(255,80,80,0.06)",
        border: "1px solid rgba(255,80,80,0.2)",
        borderRadius: 10,
        padding: "18px 20px",
        margin: "0 0 20px",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            <ReportRow label="Reporter" value={`${reporterName} (@${reporterUsername})`} />
            <ReportRow label="Reported" value={`${reportedName} (@${reportedUsername})`} />
            <ReportRow label="Reason" value={reason} highlight />
            <ReportRow label="Filed" value={date} />
          </tbody>
        </table>
      </Section>

      {context ? (
        <>
          <EmailLabel>Context provided</EmailLabel>
          <Section style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            borderRadius: 8,
            padding: "14px 16px",
            margin: "0 0 28px",
          }}>
            <Text style={{ fontSize: 13, color: WRAITH, margin: 0, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {context}
            </Text>
          </Section>
        </>
      ) : null}

      <EmailButton href={adminDashboardUrl}>Review in dashboard</EmailButton>

      <EmailDivider />

      <EmailMono>
        This notification was sent to all Ghostline administrators.
        The full chat log is available in the admin dashboard.
      </EmailMono>
    </GhostlineEmail>
  );
}

function ReportRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <tr>
      <td style={{
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: "0.15em",
        color: SPECTRAL,
        textTransform: "uppercase",
        paddingBottom: 10,
        paddingRight: 16,
        verticalAlign: "top",
        whiteSpace: "nowrap",
      }}>
        {label}
      </td>
      <td style={{
        fontSize: 13,
        color: highlight ? "#ff8080" : "#f0f2f8",
        paddingBottom: 10,
        verticalAlign: "top",
        fontFamily: highlight ? MONO : undefined,
      }}>
        {value}
      </td>
    </tr>
  );
}
