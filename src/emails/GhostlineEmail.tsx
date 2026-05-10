import React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
} from "@react-email/components";
import type { ReactNode } from "react";

// ── Brand tokens ─────────────────────────────────────────────────
const BG       = "#0b0c12";
const CARD     = "#11131d";
const SPECTRAL = "#4dd0e1";
const WRAITH   = "#8892a4";
const WHITE    = "#f0f2f8";
const RIM      = "rgba(255,255,255,0.08)";
const MONO     = "SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace";
const SANS     = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

// ── Shared email wrapper ──────────────────────────────────────────
export function GhostlineEmail({
  preview,
  children,
}: {
  preview: string;
  children: ReactNode;
}) {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: BG, margin: 0, padding: "40px 0", fontFamily: SANS }}>
        <Container style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px" }}>

          {/* Logo bar */}
          <Section style={{ textAlign: "center", marginBottom: 32 }}>
            <Text style={{
              margin: 0,
              fontSize: 13,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: SPECTRAL,
              fontFamily: MONO,
            }}>
              GHOSTLINE STUDIOS
            </Text>
          </Section>

          {/* Card */}
          <Section style={{
            backgroundColor: CARD,
            border: `1px solid ${RIM}`,
            borderRadius: 14,
            padding: "40px 36px",
          }}>
            {children}
          </Section>

          {/* Footer */}
          <Section style={{ textAlign: "center", marginTop: 32 }}>
            <Text style={{ fontSize: 11, color: WRAITH, fontFamily: MONO, letterSpacing: "0.08em", margin: "0 0 6px" }}>
              GHOSTLINE ID — SECURE AUTH
            </Text>
            <Text style={{ fontSize: 11, color: WRAITH, margin: "0 0 4px" }}>
              This email was sent by Ghostline Studios.
            </Text>
            <Text style={{ fontSize: 11, color: WRAITH, margin: 0 }}>
              <Link href="https://www.ghostlinestudios.com" style={{ color: SPECTRAL, textDecoration: "none" }}>
                ghostlinestudios.com
              </Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

// ── Reusable sub-components ───────────────────────────────────────

export function EmailHeading({ children }: { children: ReactNode }) {
  return (
    <Text style={{
      fontSize: 26,
      fontWeight: 300,
      color: WHITE,
      margin: "0 0 12px",
      lineHeight: 1.3,
    }}>
      {children}
    </Text>
  );
}

export function EmailBody({ children }: { children: ReactNode }) {
  return (
    <Text style={{
      fontSize: 15,
      color: WRAITH,
      lineHeight: 1.7,
      margin: "0 0 28px",
    }}>
      {children}
    </Text>
  );
}

export function EmailButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Section style={{ textAlign: "center", margin: "28px 0" }}>
      <Link
        href={href}
        style={{
          display: "inline-block",
          backgroundColor: SPECTRAL,
          color: "#0b0c12",
          fontFamily: MONO,
          fontSize: 12,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontWeight: 700,
          textDecoration: "none",
          padding: "14px 36px",
          borderRadius: 8,
        }}
      >
        {children}
      </Link>
    </Section>
  );
}

export function EmailDivider() {
  return <Hr style={{ borderColor: RIM, margin: "24px 0" }} />;
}

export function EmailMono({ children }: { children: ReactNode }) {
  return (
    <Text style={{
      fontFamily: MONO,
      fontSize: 12,
      color: WRAITH,
      letterSpacing: "0.05em",
      margin: 0,
    }}>
      {children}
    </Text>
  );
}

export function EmailLabel({ children }: { children: ReactNode }) {
  return (
    <Text style={{
      fontFamily: MONO,
      fontSize: 10,
      color: SPECTRAL,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      margin: "0 0 6px",
    }}>
      {children}
    </Text>
  );
}

// Re-export brand tokens for use in individual templates
export { BG, CARD, SPECTRAL, WRAITH, WHITE, RIM, MONO, SANS };
