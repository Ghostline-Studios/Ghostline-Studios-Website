import React from "react";
/**
 * Supabase "Reset password" email template.
 * Render to HTML then paste into:
 *   Supabase → Authentication → Email Templates → Reset password
 *
 * Supabase replaces {{ .ConfirmationURL }} at send time.
 */
import { Text } from "@react-email/components";
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

export interface ResetPasswordEmailProps {
  confirmationUrl?: string;
}

export default function ResetPasswordEmail({
  confirmationUrl = "{{ .ConfirmationURL }}",
}: ResetPasswordEmailProps) {
  return (
    <GhostlineEmail preview="Reset your Ghostline ID password">
      <EmailLabel>Ghostline ID · Security</EmailLabel>
      <EmailHeading>Password reset request</EmailHeading>
      <EmailBody>
        We received a request to reset the password for your Ghostline ID.
        Tap the button below to choose a new password. This link expires in 1 hour.
      </EmailBody>

      <EmailButton href={confirmationUrl}>Reset password</EmailButton>

      <EmailDivider />

      <Text style={{ fontSize: 12, color: WRAITH, margin: "0 0 6px", lineHeight: 1.6 }}>
        Or copy and paste this link into your browser:
      </Text>
      <Text style={{
        fontFamily: MONO,
        fontSize: 11,
        color: SPECTRAL,
        wordBreak: "break-all",
        margin: 0,
        lineHeight: 1.6,
      }}>
        {confirmationUrl}
      </Text>

      <EmailDivider />

      <EmailMono>
        If you didn&apos;t request a password reset, you can safely ignore this email.
        Your current password will remain unchanged.
      </EmailMono>
    </GhostlineEmail>
  );
}
