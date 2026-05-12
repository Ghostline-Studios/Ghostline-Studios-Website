import type { Metadata } from "next";
import { SiteNav, SiteFooter } from "@/components/sections";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Studio",
  description: "Ghostline Studios — a small studio building mobile games with thought, intention, and the player at the centre. Our manifesto and design principles.",
  alternates: { canonical: "https://www.ghostlinestudios.com/studio" },
  openGraph: {
    title: "Studio | Ghostline Studios",
    description: "Quiet craft. Loud intent. The Ghostline Studios manifesto.",
    images: [{ url: "/assets/ghostline-og.png" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function StudioPage() {
  return (
    <SiteChrome>
      <SiteNav />
      <main>
        <section className="studio-page-hero">
          <div className="container">
            <div className="section-head">
              <div>
                <h1>Quiet craft.<br />Loud intent.</h1>
              </div>
              <div className="meta-block">
                <strong>Manifesto</strong>
                We are a small studio building games we&apos;d want to play —
                <br />
                slowly, on purpose, with care.
              </div>
            </div>

            <div className="manifesto-grid">
              <div className="manifesto-statement">
                Ghostline draws the thin line between <em>player and world</em>. We build mobile games that
                respect your attention, your wallet, and your time — and reward it with worlds that feel alive
                long after you put the phone down.
              </div>
              <div className="manifesto-pillars">
                <div className="pillar">
                  <h2>Story before system</h2>
                  <p>Every loop, mechanic and menu starts with a question: what is this making the player feel?</p>
                </div>
                <div className="pillar">
                  <h2>Mobile, taken seriously</h2>
                  <p>
                    The phone is not a lesser screen. It&apos;s a more intimate one. We design for thumbs,
                    attention, and quiet moments.
                  </p>
                </div>
                <div className="pillar">
                  <h2>No dark patterns</h2>
                  <p>
                    No timers that nag, no energy that runs out, no FOMO event drops. If a system needs guilt
                    to function, we cut it.
                  </p>
                </div>
                <div className="pillar">
                  <h2>Ship the strange</h2>
                  <p>
                    If it has been done before, it has been done. We&apos;d rather be slightly wrong about
                    something new.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="studio-identity-section">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>What we are building.</h2>
              </div>
              <div className="meta-block">
                <strong>Two worlds. One line.</strong>
                Both games in pre-production.
                <br />
                Both mobile-first from day one.
              </div>
            </div>
            <div className="studio-projects-grid">
              <a className="studio-project-link" href="/scraplings">
                <div className="studio-project-tag studio-tag-scrap">Scraplings</div>
                <p>A cosy creature-collector. Salvage the forgotten — give it a soul.</p>
                <span className="studio-project-cta">View project →</span>
              </a>
              <a className="studio-project-link" href="/spectral-sabre">
                <div className="studio-project-tag studio-tag-sabre">Spectral Sabre</div>
                <p>A tactical stealth shooter. Lead the squad. Bend light. Vanish.</p>
                <span className="studio-project-cta">View project →</span>
              </a>
            </div>
          </div>
        </section>

        <section className="studio-values-section">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>How we work.</h2>
              </div>
              <div className="meta-block">
                <strong>Remote · Async-first</strong>
                No standups without purpose.
                <br />
                No meetings without agenda.
              </div>
            </div>
            <div className="studio-values-grid">
              <div className="studio-value">
                <h3>Small on purpose</h3>
                <p>
                  We are deliberately small. Not because we can&apos;t grow, but because small lets us stay
                  careful. Every decision can be revisited. Every person matters.
                </p>
              </div>
              <div className="studio-value">
                <h3>Player-respecting</h3>
                <p>
                  We do not build engagement traps. We build games worth returning to. The difference is
                  whether players feel good when they come back — not guilty when they don&apos;t.
                </p>
              </div>
              <div className="studio-value">
                <h3>Honest about where we are</h3>
                <p>
                  Both games are in pre-production. We are not close to a launch. We are building the right
                  thing slowly, rather than the wrong thing fast.
                </p>
              </div>
              <div className="studio-value">
                <h3>Est. 2026</h3>
                <p>
                  Ghostline Studios was founded in 2026 and operates fully remotely. We are not looking for
                  investment or a quick exit — we are looking for games worth finishing.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="studio-contact-cta">
          <div className="container">
            <h2>Get in touch.</h2>
            <p>
              For press enquiries, collaboration ideas, or just to say hello —
              we read everything that arrives at{" "}
              <a href="mailto:studio@ghostlinestudios.com">studio@ghostlinestudios.com</a>.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteChrome>
  );
}
