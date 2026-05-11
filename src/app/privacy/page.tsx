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

              <h3>Account registration — email and password</h3>
              <p>When you create a Ghostline ID using email and password, we collect:</p>
              <ul>
                <li>Your email address</li>
                <li>A hashed password (we never store plain-text passwords)</li>
                <li>A display name and username (chosen by you during onboarding)</li>
                <li>An optional bio</li>
                <li>The date and time your account was created</li>
              </ul>

              <h3>Account registration — Google or Apple sign-in</h3>
              <p>
                Ghostline ID supports sign-in via Google and Apple as alternatives to email and password.
                When you use these options:
              </p>
              <ul>
                <li>We receive a unique identifier and, where permitted by you, your email address from Google or Apple</li>
                <li>We do not receive your password from these providers</li>
                <li>Google and Apple&rsquo;s own privacy policies govern the data they collect during sign-in. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a> and <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">Apple Privacy Policy</a></li>
              </ul>

              <h3>Profile data</h3>
              <p>
                Your public profile displays your display name, username, and bio. Your email address is
                never shown publicly.
              </p>

              <h3>Friends and connections</h3>
              <p>
                When you send or accept a friend request, we store the friendship relationship between your
                account and the other user&rsquo;s account, along with the date it was created.
              </p>

              <h3>Direct messages</h3>
              <p>
                Messages sent between friends are stored in our database. Messages are visible in the app
                only to the two participants in a conversation. Authorised Ghostline Studios administrators
                may access message records only where necessary for safety, support, legal compliance, or
                moderation following a report. We do not sell, share, or use message content for advertising.
              </p>

              <h3>Game wishlists</h3>
              <p>
                If you wishlist a game on your profile, we store which games you have wishlisted. This
                information is visible on your public profile page.
              </p>

              <h3>Newsletter</h3>
              <p>
                If you subscribe to our newsletter, we store your email address for the purpose of sending
                studio updates. You can unsubscribe at any time via your account settings or by contacting us.
              </p>

              <h3>Usage and server logs</h3>
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
                  See <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>.
                </li>
                <li>
                  <strong>Vercel</strong> — website hosting and serverless functions. See{" "}
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>.
                </li>
                <li>
                  <strong>Resend</strong> — transactional email delivery (confirmation emails, password resets, welcome emails). See{" "}
                  <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">resend.com/legal/privacy-policy</a>.
                </li>
                <li>
                  <strong>Google</strong> — optional sign-in provider. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.
                </li>
                <li>
                  <strong>Apple</strong> — optional sign-in provider. See <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">apple.com/legal/privacy</a>.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>5. Cookies and local storage</h2>
              <p>
                We use session cookies and browser local storage to maintain your login session. See our{" "}
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
                To exercise any of these rights, email{" "}
                <a href="mailto:studio@ghostlinestudios.com">studio@ghostlinestudios.com</a> with the subject
                &ldquo;Data request&rdquo;. We will respond within 30 days.
              </p>
            </section>

            <section className="legal-section">
              <h2>7. Account deletion</h2>
              <p>
                You can request deletion of your Ghostline ID account and all associated data by contacting{" "}
                <a href="mailto:studio@ghostlinestudios.com">studio@ghostlinestudios.com</a>. We will process
                deletion requests within 30 days. Note that messages exchanged with other users may remain
                visible to the other participant until their account is also deleted or their messages are removed.
              </p>
            </section>

            <section className="legal-section">
              <h2>8. Moderation and safety</h2>
              <p>
                Ghostline Studios reserves the right to review account activity, message records, and user
                reports where necessary to enforce our Terms of Use, respond to safety concerns, or comply
                with legal obligations. Reports can be submitted in-app using the report tool in the messaging
                interface, or by emailing{" "}
                <a href="mailto:studio@ghostlinestudios.com">studio@ghostlinestudios.com</a>.
              </p>
            </section>

            <section className="legal-section">
              <h2>9. Children</h2>
              <p>
                Ghostline ID is not intended for children under the age of 13. We do not knowingly collect
                personal data from children. If you believe a child has registered without parental consent,
                please contact us immediately.
              </p>
            </section>

            <section className="legal-section">
              <h2>10. Changes to this policy</h2>
              <p>
                We may update this policy from time to time. The &ldquo;last updated&rdquo; date at the top
                of this page will reflect any changes. Continued use of the site after changes are posted
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="legal-section">
              <h2>11. Contact</h2>
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
