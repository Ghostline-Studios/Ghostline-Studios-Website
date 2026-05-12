import type { Metadata } from "next";
import { SiteNav, SiteFooter } from "@/components/sections";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Careers",
  description: "Ghostline Studios is not actively hiring yet. Future opportunities may include Unity engineering, technical art, systems design, community, and narrative.",
  alternates: { canonical: "https://www.ghostlinestudios.com/careers" },
  openGraph: {
    title: "Careers | Ghostline Studios",
    description: "Ghostline Studios is not actively hiring yet — but future areas include Unity engineering, technical art, systems design, and narrative.",
    images: [{ url: "/assets/ghostline-og.png" }],
  },
  twitter: { card: "summary_large_image" },
};

const FUTURE_AREAS = [
  { area: "Unity / mobile engineering", detail: "Building and optimising mobile game systems for iOS and Android." },
  { area: "Technical art & mobile VFX", detail: "Shaders, particle systems, and visual effects designed for mobile constraints." },
  { area: "Game & systems design", detail: "Designing loops, economies, and mechanics that feel intentional and player-respecting." },
  { area: "Narrative & world-building", detail: "Writing that earns its place — story that lives in the gaps between mechanics." },
  { area: "Community & player experience", detail: "Building relationships with the people who play our games." },
];

export default function CareersPage() {
  return (
    <SiteChrome>
      <SiteNav />
      <main>
        <section className="careers-page-hero">
          <div className="container">
            <div className="section-head">
              <div>
                <h1>Join the line.</h1>
              </div>
              <div className="meta-block">
                <strong>Not hiring yet</strong>
                Small studio. Building in the quiet.
                <br />
                We&apos;ll open when the work needs it.
              </div>
            </div>

            <div className="careers-wrap">
              <div className="careers-intro">
                <h2>We are not actively recruiting right now.</h2>
                <p>
                  Ghostline Studios is early and intentional. We grow when the work genuinely requires it,
                  not before. When we do hire, we hire slowly, treat people well, and make the work the thing.
                </p>
                <p>
                  Future opportunities may include areas such as Unity engineering, technical art, systems
                  design, narrative, and community. If that sounds like you — introduce yourself now. We keep
                  every message we receive.
                </p>
                <div style={{ marginTop: 32, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a className="btn primary" href="mailto:studio@ghostlinestudios.com">
                    <span>Introduce yourself</span>
                  </a>
                  <a className="btn" href="/studio">
                    <span>About the studio</span>
                  </a>
                </div>
              </div>

              <div className="role-list">
                {FUTURE_AREAS.map((item, i) => (
                  <div key={i} className="role-item role-item-future">
                    <div>
                      <h3 className="role-title">{item.area}</h3>
                      <p className="role-detail">{item.detail}</p>
                      <div className="role-meta">
                        <span>Future area</span>
                        <span className="dot">●</span>
                        <span>Remote</span>
                      </div>
                    </div>
                    <div className="role-cta role-cta-planned">Planned</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="careers-values-section">
          <div className="container">
            <div className="section-head">
              <div>
                <h2>How we work when we do hire.</h2>
              </div>
              <div className="meta-block">
                <strong>Async-first · Remote</strong>
                Senior people who can run
                <br />
                with a brief and bring it back.
              </div>
            </div>
            <div className="careers-values-grid">
              <div className="careers-value">
                <h3>Calendars protected</h3>
                <p>
                  We do not fill your week with standups. If a meeting happens, it&apos;s because text
                  genuinely couldn&apos;t solve it.
                </p>
              </div>
              <div className="careers-value">
                <h3>Craft over headcount</h3>
                <p>
                  We would rather have three people who care deeply about the work than ten people who
                  are going through the motions.
                </p>
              </div>
              <div className="careers-value">
                <h3>Mobile-first from the start</h3>
                <p>
                  Every role at Ghostline touches mobile in some way. We are not porting — we are building
                  for the platform from the ground up.
                </p>
              </div>
              <div className="careers-value">
                <h3>Player-respecting by default</h3>
                <p>
                  No dark patterns, no engagement traps. If you&apos;ve ever felt uncomfortable shipping
                  something, you&apos;ll feel comfortable here.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </SiteChrome>
  );
}
