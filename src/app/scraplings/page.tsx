import Link from "next/link";
import { ScraplingsArt, ScraplingsBestiary } from "@/components/Games";
import { ProjectsIndexNav, SiteFooter } from "@/components/sections";
import { SiteChrome } from "@/components/SiteChrome";
import { SCRAPLINGS } from "@/data/games";

export const metadata = {
  title: "Scraplings — Ghostline Studios",
};

export default function ScraplingsPage() {
  const G = SCRAPLINGS;
  return (
    <SiteChrome>
      <ProjectsIndexNav />

      <section className="project-hero" data-screen-label="Scraplings Hero">
        <div className="container">
          <Link href="/projects" className="project-back">
            ← All projects
          </Link>
          <div className="project-hero-grid">
            <div>
              <div className="project-tag">In Production · iOS · Android · 2026 Early Access</div>
              <h1 className="project-title">Scraplings</h1>
              <p className="project-tagline">A cosy collector. Salvage the forgotten — give it a soul.</p>
              <p className="project-blurb">{G.blurb}</p>
              <div className="project-stats">
                <div>
                  <strong>Cosy / Collector</strong>Genre
                </div>
                <div>
                  <strong>Vertical</strong>Format
                </div>
                <div>
                  <strong>iOS · Android</strong>Platform
                </div>
                <div>
                  <strong>2026 EA</strong>Window
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a className="btn primary" href="#">
                  <span>Wishlist</span>
                  <span className="arrow">↗</span>
                </a>
                <a className="btn" href="#">
                  <span>Press Kit</span>
                </a>
              </div>
            </div>
            <div className="project-key-art">
              <div
                className="placeholder"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 70%, rgba(77, 208, 225, 0.35), transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(127, 227, 241, 0.22), transparent 50%), linear-gradient(180deg, #0a1518, #050a0c)",
                }}
              >
                <ScraplingsArt big />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="project-section" data-screen-label="Scraplings Features">
        <div className="container">
          <div className="project-section-head">
            <div>
              <div className="index">— 01 / What it is</div>
              <h2>The pillars of the loop.</h2>
            </div>
            <div className="meta-block">
              <strong>Design intent</strong>
              Slow. Quiet. Hand-painted.
              <br />
              Worth remembering.
            </div>
          </div>
          <div className="feature-grid">
            {G.features.map((f, i) => (
              <div className="feature-cell" key={i}>
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="project-section" data-screen-label="Scraplings Bestiary">
        <div className="container">
          <div className="project-section-head">
            <div>
              <div className="index">— 02 / Bestiary</div>
              <h2>The first nine.</h2>
            </div>
            <div className="meta-block">
              <strong>09 / 100+</strong>
              A handful of the Scraplings
              <br />
              you&apos;ll meet in the prologue.
            </div>
          </div>
          <ScraplingsBestiary game={G} />
        </div>
      </section>

      <SiteFooter />
    </SiteChrome>
  );
}
