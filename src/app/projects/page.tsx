import Link from "next/link";
import { ScraplingsArt, SpectralSabreArt } from "@/components/Games";
import { ProjectsIndexNav, SiteFooter } from "@/components/sections";
import { SiteChrome } from "@/components/SiteChrome";

export const metadata = {
  title: "Projects",
  description: "Ghostline Studios has two games in pre-production: Scraplings, a cosy mobile collector, and Spectral Sabre, a tactical stealth shooter.",
  alternates: { canonical: "https://www.ghostlinestudios.com/projects" },
  openGraph: {
    title: "Projects | Ghostline Studios",
    description: "Two games in pre-production: Scraplings and Spectral Sabre.",
    images: [{ url: "/assets/ghostline-og.png" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function ProjectsPage() {
  return (
    <SiteChrome>
      <ProjectsIndexNav />
      <section data-screen-label="Projects Index">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="index">— Index / Active Projects</div>
              <h2>Two worlds, in motion.</h2>
            </div>
            <div className="meta-block">
              <strong>Currently in pre-production</strong>
              Mobile-first · Player-respecting
              <br />
              Hand-built · No dark patterns
            </div>
          </div>

          <div className="projects-teaser">
            <Link href="/scraplings" className="teaser-card scraplings">
              <div className="teaser-art">
                <ScraplingsArt big />
              </div>
              <div className="teaser-meta">
                <div className="teaser-tag">Pre-production · iOS · Android</div>
                <h3 className="teaser-title">Scraplings</h3>
                <p className="teaser-line">A cosy collector. Salvage the forgotten — give it a soul.</p>
                <span className="teaser-cta">
                  Open project <span className="arrow">↗</span>
                </span>
              </div>
            </Link>
            <Link href="/spectral-sabre" className="teaser-card spectral-sabre">
              <div className="teaser-art">
                <SpectralSabreArt big />
              </div>
              <div className="teaser-meta">
                <div className="teaser-tag">Pre-production · Android · iOS</div>
                <h3 className="teaser-title">Spectral Sabre</h3>
                <p className="teaser-line">Lead Sabre Unit. Bend light. Vanish before the alarm.</p>
                <span className="teaser-cta">
                  Open project <span className="arrow">↗</span>
                </span>
              </div>
            </Link>
          </div>

          <div
            style={{
              padding: "60px 0 120px",
              textAlign: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--wraith-faint)",
            }}
          >
            — More worlds awaiting their first ghostline —
          </div>
        </div>
      </section>
      <SiteFooter />
    </SiteChrome>
  );
}
