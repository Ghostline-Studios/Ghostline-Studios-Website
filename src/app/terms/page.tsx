import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, TopNav } from "@/components/sections";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for Ghostline Studios and the Ghostline ID account system.",
  alternates: { canonical: "https://www.ghostlinestudios.com/terms" },
  openGraph: {
    title: "Terms of Use | Ghostline Studios",
    description: "The terms governing use of Ghostline Studios and Ghostline ID.",
    images: [{ url: "/assets/ghostline-og.png" }],
  },
};

export default function TermsPage() {
  return (
    <SiteChrome>
      <TopNav />
      <main className="legal-page">
        <div className="container">
          <div className="legal-header">
            <div className="legal-eyebrow">Legal</div>
            <h1>Terms of Use</h1>
            <p className="legal-meta">Last updated: May 2026</p>
            <div className="legal-notice">
              <strong>Note for the site owner:</strong> This is a good-faith draft. Seek proper legal
              advice before a full public launch to ensure these terms are enforceable in your jurisdiction.
            </div>
          </div>

          <div className="legal-body">

            <section className="legal-section">
              <h2>1. Acceptance of terms</h2>
              <p>
                By accessing or using ghostlinestudios.com or creating a Ghostline ID account, you agree to
                these Terms of Use. If you do not agree, do not use the site or create an account.
              </p>
              <p>
                These terms apply to all users of the website, including visitors and registered Ghostline ID
                account holders.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. Ghostline ID accounts</h2>
              <p>
                Ghostline ID is the account system for Ghostline Studios. It currently supports:
              </p>
              <ul>
                <li>User profiles with a display name, username, and optional bio</li>
                <li>A friends system — you can connect with other users</li>
                <li>Direct messaging between accepted friends</li>
                <li>Game wishlisting on your public profile</li>
                <li>Newsletter opt-in preferences</li>
              </ul>
              <p>
                When you register an account, you agree to provide accurate information and keep your login
                credentials secure. You are responsible for all activity that occurs under your account.
              </p>
            </section>

            <section className="legal-section">
              <h2>3. Acceptable use</h2>
              <p>You agree not to use Ghostline Studios or Ghostline ID to:</p>
              <ul>
                <li>Post or send content that is abusive, harassing, threatening, defamatory, or illegal</li>
                <li>Impersonate any person or entity</li>
                <li>Attempt to gain unauthorised access to another user&apos;s account or data</li>
                <li>Interfere with the operation of the site or its infrastructure</li>
                <li>Use automated tools (bots, scrapers) to access or collect data without our permission</li>
                <li>Send unsolicited messages or spam to other users</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>4. Messaging and friend connections</h2>
              <p>
                Direct messaging is available only between accepted friends. You may only send messages to
                users who have accepted your friend request. This is a deliberate safety measure.
              </p>
              <p>
                You can report another user using the report tool available in the messaging interface.
                Reports are reviewed by our team and we reserve the right to suspend or remove accounts that
                violate these terms.
              </p>
            </section>

            <section className="legal-section">
              <h2>5. User content</h2>
              <p>
                Content you submit (profile bio, display name, messages) remains your own. By submitting
                content, you grant Ghostline Studios a limited licence to store, display, and transmit that
                content as necessary to operate the service.
              </p>
              <p>
                We do not claim ownership of your content. We do not use your content for advertising or
                monetisation purposes.
              </p>
            </section>

            <section className="legal-section">
              <h2>6. Privacy</h2>
              <p>
                Our <Link href="/privacy">Privacy Policy</Link> explains how we collect and handle your data.
                By using our service, you agree to our Privacy Policy.
              </p>
            </section>

            <section className="legal-section">
              <h2>7. Intellectual property</h2>
              <p>
                All content on ghostlinestudios.com — including but not limited to game artwork, logos,
                copy, and design — is the property of Ghostline Studios and may not be reproduced,
                distributed, or used without written permission.
              </p>
              <p>
                Press enquiries and media use: contact{" "}
                <a href="mailto:press@ghostlinestudios.com">press@ghostlinestudios.com</a>.
              </p>
            </section>

            <section className="legal-section">
              <h2>8. Disclaimers</h2>
              <p>
                The site is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee
                continuous uptime, and reserve the right to modify or discontinue features at any time.
              </p>
              <p>
                Games listed on this site are in development. Release dates, features, and platform
                availability may change. Nothing on this site constitutes a pre-order, purchase commitment,
                or guarantee of delivery.
              </p>
            </section>

            <section className="legal-section">
              <h2>9. Account termination</h2>
              <p>
                We reserve the right to suspend or permanently close accounts that violate these terms,
                with or without notice. You may request deletion of your account at any time by contacting{" "}
                <a href="mailto:studio@ghostlinestudios.com">studio@ghostlinestudios.com</a>.
              </p>
            </section>

            <section className="legal-section">
              <h2>10. Limitation of liability</h2>
              <p>
                To the fullest extent permitted by applicable law, Ghostline Studios shall not be liable for
                any indirect, incidental, or consequential damages arising from your use of the site or
                Ghostline ID.
              </p>
            </section>

            <section className="legal-section">
              <h2>11. Governing law</h2>
              <p>
                These terms are governed by the laws of England and Wales. Disputes shall be subject to the
                exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section className="legal-section">
              <h2>12. Changes to these terms</h2>
              <p>
                We may update these terms at any time. The &ldquo;last updated&rdquo; date will reflect
                changes. Continued use of the service after changes are posted constitutes acceptance.
              </p>
            </section>

            <section className="legal-section">
              <h2>13. Contact</h2>
              <p>
                Questions about these terms?{" "}
                <a href="mailto:studio@ghostlinestudios.com">studio@ghostlinestudios.com</a>
              </p>
            </section>

          </div>

          <div className="legal-footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/cookies">Cookie Policy</Link>
            <Link href="/">Home</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </SiteChrome>
  );
}
