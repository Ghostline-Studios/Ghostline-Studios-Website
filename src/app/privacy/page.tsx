import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, TopNav } from "@/components/sections";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Ghostline Studios privacy policy — what data we collect, how we use it, and your rights as a user of Ghostline ID.",
  alternates: { canonical: "https://www.ghostlinestudios.com/privacy" },
  openGraph: {
    title: "Privacy Policy | Ghostline Studios",
    description: "How Ghostline Studios handles your data.",
    images: [{ url: "/assets/ghostline-og.png" }],
  },
};

export default function PrivacyPage() {
  return (
    <SiteChrome>
      <TopNav />
      <main className="legal-page">
        <div className="container">
          <div className="legal-header">
            <div className="legal-eyebrow">Legal</div>
            <h1>Privacy Policy</h1>
            <p className="legal-meta">Last updated: May 2026</p>
            <div className="legal-notice">
              <strong>Note for the site owner:</strong> This document is a good-faith draft. You should seek
              proper legal advice before a full public launch to ensure this policy meets all applicable data
              protection laws in your jurisdiction (e.g. GDPR, UK GDPR, CCPA).
            </div>
          </div>

          <div className="legal-body">

            <section className="legal-section">
              <h2>1. Who we are</h2>
              <p>
                Ghostline Studios (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the
                website at <a href="https://www.ghostlinestudios.com">ghostlinestudios.com</a> and the
                Ghostline ID account system. For questions about this policy, contact us at{" "}
                <a href="mailto:studio@ghostlinestudios.com">studio@ghostlinestudios.com</a>.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. What data we collect</h2>

              <h3>Account registration</h3>
              <p>When you create a Ghostline ID, we collect:</p>
              <ul>
                <li>Your email address</li>
                <li>A hashed password (we never store plain-text passwords)</li>
                <li>A display name and username (chosen by you during onboarding)</li>
                <li>An optional bio</li>
                <li>The date and time your account was created</li>
              </ul>

              <h3>Profile data</h3>
              <p>
                Your public profile displays your display name, username, and bio. Your email address is
                never shown publicly.
              </p>

              <h3>Friends and connections</h3>
              <p>
                When you send or accept a friend request, we store the friendship relationship between your
                account and the other user&apos;s account, along with the date it was created.
              </p>

              <h3>Direct messages</h3>
              <p>
                Messages sent between friends are stored in our database. Messages are only accessible to the
                two participants in a conversation. We do not read, sell, or share your private messages
                except where required by law or in the context of a moderation action following a report.
              </p>

              <h3>Game wishlists</h3>
              <p>
                If you wishlist a game on your profile, we store which games you have wishlisted. This
                information is visible on your public profile page.
              </p>

              <h3>Newsletter</h3>
              <p>
                If you subscribe to our newsletter (either via the homepage form or through account
                preferences), we store your email address for the purpose of sending studio updates. You can
                unsubscribe at any time via your account settings or by contacting us.
              </p>

              <h3>Usage data</h3>
              <p>
                Our hosting provider (Vercel) and authentication provider (Supabase) may collect standard
                server logs including IP addresses, browser type, and request timestamps. We do not currently
                use third-party analytics services.
              </p>
            </section>

            <section className="legal-section">
              <h2>3. How we use your data</h2>
              <p>We use your data to:</p>
              <ul>
                <li>Operate and secure your Ghostline ID account</li>
                <li>Enable you to connect with friends and send messages</li>
                <li>Send authentication and account-related emails (e.g. email confirmation, password reset)</li>
                <li>Send studio updates if you have opted in to the newsletter</li>
                <li>Investigate reports of misuse or violations of our Terms of Use</li>
              </ul>
              <p>We do not sell your data. We do not use your data for advertising.</p>
            </section>

            <section className="legal-section">
              <h2>4. Data storage and processors</h2>
              <p>Your data is stored and processed using the following third-party services:</p>
              <ul>
                <li>
                  <strong>Supabase</strong> — database, authentication, and real-time features.
                  Supabase stores data on AWS infrastructure. See{" "}
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
                    supabase.com/privacy
                  </a>.
                </li>
                <li>
                  <strong>Vercel</strong> — website hosting and serverless functions. See{" "}
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                    vercel.com/legal/privacy-policy
                  </a>.
                </li>
                <li>
                  <strong>Resend</strong> — transactional email delivery. See{" "}
                  <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                    resend.com/legal/privacy-policy
                  </a>.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>5. Cookies</h2>
              <p>
                We use cookies and local storage to maintain your login session. See our{" "}
                <Link href="/cookies">Cookie Policy</Link> for full details.
              </p>
            </section>

            <section className="legal-section">
              <h2>6. Your rights</h2>
              <p>Depending on your location, you may have the right to:</p>
              <ul>
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and associated data</li>
                <li>Object to certain uses of your data</li>
                <li>Withdraw consent for newsletter communications at any time</li>
              </ul>
              <p>
                To exercise any of these rights, email us at{" "}
                <a href="mailto:studio@ghostlinestudios.com">studio@ghostlinestudios.com</a> with the subject
                line &ldquo;Data request&rdquo;.
              </p>
            </section>

            <section className="legal-section">
              <h2>7. Account deletion</h2>
              <p>
                You can request deletion of your Ghostline ID account and all associated data by contacting{" "}
                <a href="mailto:studio@ghostlinestudios.com">studio@ghostlinestudios.com</a>. We will process
                deletion requests within 30 days. Note that some data (such as messages exchanged with other
                users) may be retained in anonymised form or may remain visible to the other participant until
                their account is also deleted.
              </p>
            </section>

            <section className="legal-section">
              <h2>8. Children</h2>
              <p>
                Ghostline ID is not intended for children under the age of 13. We do not knowingly collect
                personal data from children. If you believe a child has registered without parental consent,
                please contact us immediately.
              </p>
            </section>

            <section className="legal-section">
              <h2>9. Changes to this policy</h2>
              <p>
                We may update this policy from time to time. The &ldquo;last updated&rdquo; date at the top
                of this page will reflect any changes. Continued use of the site after changes are posted
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="legal-section">
              <h2>10. Contact</h2>
              <p>
                For any questions about this Privacy Policy, email{" "}
                <a href="mailto:studio@ghostlinestudios.com">studio@ghostlinestudios.com</a>.
              </p>
            </section>

          </div>

          <div className="legal-footer-links">
            <Link href="/terms">Terms of Use</Link>
            <Link href="/cookies">Cookie Policy</Link>
            <Link href="/">Home</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </SiteChrome>
  );
}
