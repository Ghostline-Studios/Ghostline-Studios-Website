/**
 * Sent after a user completes the /welcome onboarding flow.
 * Triggered from the /api/send/welcome API route.
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
  SPECTRAL,
  MONO,
} from "./GhostlineEmail";

export interface WelcomeEmailProps {
  displayName?: string;
  username?: string;
  profileUrl?: string;
}

export default function WelcomeEmail({
  displayName = "Player",
  username = "player",
  profileUrl = "https://www.ghostlinestudios.com/account",
}: WelcomeEmailProps) {
  return (
    <GhostlineEmail preview={`Welcome to Ghostline ID, ${displayName}`}>
      <EmailLabel>Ghostline ID · Welcome</EmailLabel>
      <EmailHeading>You&apos;re in, {displayName}.</EmailHeading>
      <EmailBody>
        Your Ghostline ID is live. Follow Scraplings and Spectral Sabre for
        devlog updates, build your wishlist, and connect with other players.
        We&apos;re just getting started.
      </EmailBody>

      {/* Profile card */}
      <Section style={{
        backgroundColor: "rgba(77,208,225,0.06)",
        border: "1px solid rgba(77,208,225,0.2)",
        borderRadius: 10,
        padding: "18px 20px",
        margin: "0 0 28px",
      }}>
        <EmailLabel>Your ID</EmailLabel>
        <Text style={{ fontSize: 20, fontWeight: 300, color: "#f0f2f8", margin: "4px 0 2px" }}>
          {displayName}
        </Text>
        <Text style={{ fontFamily: MONO, fontSize: 12, color: SPECTRAL, margin: 0 }}>
          @{username}
        </Text>
      </Section>

      <EmailButton href={profileUrl}>View your profile</EmailButton>

      <EmailDivider />

      <EmailMono>
        Questions? Reach us at studio@ghostlinestudios.com
      </EmailMono>
    </GhostlineEmail>
  );
}
