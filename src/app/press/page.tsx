import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, TopNav } from "@/components/sections";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Press",
  description: "Press information, studio boilerplate, and project details for Ghostline Studios, Scraplings, and Spectral Sabre.",
  alternates: { canonical: "https://www.ghostlinestudios.com/press" },
  openGraph: {
    title: "Press | Ghostline Studios",
    description: "Studio facts, project summaries, and press contact for Ghostline Studios.",
    images: [{ url: "/assets/ghostline-og.png" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function PressPage() {
  return (
    <SiteChrome>
      <TopNav />
      <main className="press-page">
        <div className="container">

          <header className="press-page-header">
            <div className="press-page-eyebrow">Press</div>
            <h1>Ghostline Studios</h1>
            <p className="press-page-lead">
              Independent mobile game studio. Two games in development. No hype.
            </p>
          </header>

          {/* ── Studio boilerplate ── */}
          <section className="press-section">
            <h2>Short description</h2>
            <div className="press-copy press-copy-highlight">
              Ghostline Studios is an independent mobile game studio building games with thought, intention, and the player at the centre.
            </div>
          </section>

          <section className="press-section">
            <h2>Long description</h2>
            <div className="press-copy">
              <p>
                Ghostline Studios is a small independent studio focused entirely on mobile games. We believe
                the phone is not a lesser screen — it is a more intimate one. Every design decision starts
                with a single question: what is this making the player feel?
              </p>
              <p>
                We build slowly, on purpose. We have no dark patterns, no energy timers that nag, no FOMO
                event drops. If a system needs guilt to function, we cut it. Our games are designed to respect
                your attention, your wallet, and your time — and reward it with worlds that feel alive long
                after you put the phone down.
              </p>
              <p>
                Ghostline Studios was founded in 2026 and operates remotely.
              </p>
            </div>
          </section>

          {/* ── Factsheet ── */}
          <section className="press-section">
            <h2>Studio facts</h2>
            <table className="press-table">
              <tbody>
                <tr><td>Studio</td><td>Ghostline Studios</td></tr>
                <tr><td>Founded</td><td>2026</td></tr>
                <tr><td>Location</td><td>Remote</td></tr>
                <tr><td>Platform focus</td><td>iOS · Android</td></tr>
                <tr><td>Projects in development</td><td>Scraplings · Spectral Sabre</td></tr>
                <tr><td>Press contact</td><td><a href="mailto:press@ghostlinestudios.com">press@ghostlinestudios.com</a></td></tr>
                <tr><td>General contact</td><td><a href="mailto:studio@ghostlinestudios.com">studio@ghostlinestudios.com</a></td></tr>
                <tr><td>Website</td><td><a href="https://www.ghostlinestudios.com">ghostlinestudios.com</a></td></tr>
              </tbody>
            </table>
          </section>

          {/* ── Projects ── */}
          <section className="press-section">
            <h2>Projects</h2>

            <div className="press-project-grid">
              <div className="press-project-card">
                <div className="press-project-tag press-tag-scrap">Scraplings</div>
                <h3>Scraplings</h3>
                <p className="press-project-status">Status: Pre-Production · iOS · Android</p>
                <p>
                  Scraplings is a cosy creature-collector mobile game. Players salvage forgotten creatures,
                  give them a soul, and build a team across a quiet world filled with things worth finding.
                  Designed for vertical play, short sessions, and the kind of calm curiosity that makes a good
                  afternoon.
                </p>
                <p className="press-copy-detail">
                  <strong>Genre:</strong> Cosy / Collector<br />
                  <strong>Platform:</strong> iOS · Android<br />
                  <strong>Format:</strong> Vertical / portrait<br />
                  <strong>Status:</strong> Pre-Production
                </p>
                <Link href="/scraplings" className="press-project-link">Full project page →</Link>
              </div>

              <div className="press-project-card">
                <div className="press-project-tag press-tag-sabre">Spectral Sabre</div>
                <h3>Spectral Sabre</h3>
                <p className="press-project-status">Status: Pre-Production · Android · iOS</p>
                <p>
                  Spectral Sabre is a tactical stealth shooter for mobile. Command a four-person squad plus
                  KIP — a Kinetic Intelligence Platform — through short, high-stakes infiltrations.
                  Camo, recon, squad sync, and moment-to-moment tension compressed into a mobile-first format.
                </p>
                <p className="press-copy-detail">
                  <strong>Genre:</strong> Tactical Stealth<br />
                  <strong>Platform:</strong> Android · iOS<br />
                  <strong>Squad:</strong> 4 operators + KIP<br />
                  <strong>Status:</strong> Pre-Production
                </p>
                <Link href="/spectral-sabre" className="press-project-link">Full project page →</Link>
              </div>
            </div>
          </section>

          {/* ── Assets ── */}
          <section className="press-section">
            <h2>Press assets</h2>
            <p className="press-copy">
              Logo packs, key art, and screenshot sets are currently in preparation. Contact us directly
              and we will send what is available.
            </p>
            <div className="press-asset-grid">
              <div className="press-asset-item press-asset-coming">
                <div className="press-asset-label">Studio logos &amp; mark</div>
                <div className="press-asset-status">Coming soon</div>
              </div>
              <div className="press-asset-item press-asset-coming">
                <div className="press-asset-label">Scraplings — key art &amp; screenshots</div>
                <div className="press-asset-status">Coming soon</div>
              </div>
              <div className="press-asset-item press-asset-coming">
                <div className="press-asset-label">Spectral Sabre — key art &amp; screenshots</div>
                <div className="press-asset-status">Coming soon</div>
              </div>
              <div className="press-asset-item press-asset-coming">
                <div className="press-asset-label">Brand guidelines</div>
                <div className="press-asset-status">Coming soon</div>
              </div>
            </div>
            <p className="press-copy" style={{ marginTop: 24 }}>
              For immediate press requests, email{" "}
              <a href="mailto:press@ghostlinestudios.com">press@ghostlinestudios.com</a>.
            </p>
          </section>

          {/* ── Contact ── */}
          <section className="press-section">
            <h2>Contact</h2>
            <div className="press-contact-grid">
              <div>
                <strong>Press &amp; media</strong>
                <p><a href="mailto:press@ghostlinestudios.com">press@ghostlinestudios.com</a></p>
              </div>
              <div>
                <strong>General enquiries</strong>
                <p><a href="mailto:studio@ghostlinestudios.com">studio@ghostlinestudios.com</a></p>
              </div>
            </div>
          </section>

        </div>
      </main>
      <SiteFooter />
    </SiteChrome>
  );
}
