import React from "react";
/**
 * Supabase "Confirm signup" email template.
 * Render to HTML via scripts/render-auth-emails.ts then paste into:
 *   Supabase → Authentication → Email Templates → Confirm signup
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

export interface ConfirmEmailProps {
  /** Replaced by Supabase at send time: {{ .ConfirmationURL }} */
  confirmationUrl?: string;
}

export default function ConfirmEmail({
  confirmationUrl = "{{ .ConfirmationURL }}",
}: ConfirmEmailProps) {
  return (
    <GhostlineEmail preview="Confirm your Ghostline ID to get started">
      <EmailLabel>Ghostline ID</EmailLabel>
      <EmailHeading>Confirm your email</EmailHeading>
      <EmailBody>
        Welcome to the network. Tap the button below to verify your email address
        and activate your Ghostline ID. This link expires in 24 hours.
      </EmailBody>

      <EmailButton href={confirmationUrl}>Confirm email address</EmailButton>

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
        If you didn&apos;t create a Ghostline ID, you can safely ignore this email.
        Nobody has access to your account without verifying this address.
      </EmailMono>
    </GhostlineEmail>
  );
}
