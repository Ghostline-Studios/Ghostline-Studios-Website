import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, TopNav } from "@/components/sections";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Ghostline Studios uses cookies and local storage on this website.",
  alternates: { canonical: "https://www.ghostlinestudios.com/cookies" },
  openGraph: {
    title: "Cookie Policy | Ghostline Studios",
    description: "How cookies are used on ghostlinestudios.com.",
    images: [{ url: "/assets/ghostline-og.png" }],
  },
};

export default function CookiesPage() {
  return (
    <SiteChrome>
      <TopNav />
      <main className="legal-page">
        <div className="container">
          <div className="legal-header">
            <div className="legal-eyebrow">Legal</div>
            <h1>Cookie Policy</h1>
            <p className="legal-meta">Last updated: May 2026</p>
            <div className="legal-notice">
              <strong>Note for the site owner:</strong> Review this policy and implement a proper cookie
              consent mechanism before a full public launch, particularly if you add analytics or
              advertising cookies in the future.
            </div>
          </div>

          <div className="legal-body">

            <section className="legal-section">
              <h2>1. What are cookies?</h2>
              <p>
                Cookies are small text files stored on your device by a website. We also use browser
                local storage for similar purposes. Both are used to remember information between page
                visits.
              </p>
            </section>

            <section className="legal-section">
              <h2>2. What we use cookies for</h2>

              <h3>Authentication (strictly necessary)</h3>
              <p>
                If you create a Ghostline ID account and sign in, we use cookies and local storage tokens to
                maintain your session. These are essential for the account system to function. Without them,
                you would be logged out every time you navigate to a new page.
              </p>
              <p>
                These cookies are set by our authentication provider (Supabase) and expire when your session
                ends or after a defined period. They are not used for advertising.
              </p>

              <h3>We do not currently use:</h3>
              <ul>
                <li>Analytics cookies (e.g. Google Analytics)</li>
                <li>Advertising or tracking cookies</li>
                <li>Social media tracking pixels</li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>3. Cookies set by third parties</h2>
              <p>
                Our service uses the following third-party providers which may set their own cookies or use
                server-side storage:
              </p>
              <ul>
                <li>
                  <strong>Supabase</strong> — session tokens and authentication state. See{" "}
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
                    supabase.com/privacy
                  </a>.
                </li>
                <li>
                  <strong>Vercel</strong> — performance and infrastructure. See{" "}
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                    vercel.com/legal/privacy-policy
                  </a>.
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>4. How to control cookies</h2>
              <p>
                You can control and delete cookies through your browser settings. Note that disabling
                session cookies will prevent you from signing in to Ghostline ID.
              </p>
              <p>Common browser controls:</p>
              <ul>
                <li>
                  <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data
                </li>
                <li>
                  <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
                </li>
                <li>
                  <strong>Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data
                </li>
              </ul>
            </section>

            <section className="legal-section">
              <h2>5. Changes to this policy</h2>
              <p>
                If we add analytics or other non-essential cookies in the future, this policy will be updated
                and a consent mechanism will be added to the site. The &ldquo;last updated&rdquo; date at the
                top of this page will reflect any changes.
              </p>
            </section>

            <section className="legal-section">
              <h2>6. Contact</h2>
              <p>
                Questions about cookies?{" "}
                <a href="mailto:studio@ghostlinestudios.com">studio@ghostlinestudios.com</a>
              </p>
            </section>

          </div>

          <div className="legal-footer-links">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Use</Link>
            <Link href="/">Home</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </SiteChrome>
  );
}
