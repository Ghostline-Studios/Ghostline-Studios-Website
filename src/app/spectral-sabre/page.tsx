import Link from "next/link";
import { SpectralSabreArt } from "@/components/Games";
import { JsonLd } from "@/components/JsonLd";
import { ProjectsIndexNav, SiteFooter } from "@/components/sections";
import { SiteChrome } from "@/components/SiteChrome";
import { SPECTRAL_SABRE } from "@/data/games";

export const metadata = {
  title: "Spectral Sabre — Tactical Stealth Shooter",
  description: "Spectral Sabre is a tactical stealth shooter for mobile from Ghostline Studios. Command a four-person squad plus KIP through short, high-stakes infiltrations.",
  alternates: { canonical: "https://www.ghostlinestudios.com/spectral-sabre" },
  openGraph: {
    title: "Spectral Sabre — Tactical Stealth Shooter | Ghostline Studios",
    description: "Command a squad. Stay in shadow. Trust KIP.",
    images: [{ url: "/assets/ghostline-og.png" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function SpectralSabrePage() {
  const G = SPECTRAL_SABRE;
  return (
    <SiteChrome>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "VideoGame",
          name: "Spectral Sabre",
          description: "A tactical stealth shooter for mobile. Command a four-person squad plus KIP through short, high-stakes infiltrations.",
          url: "https://www.ghostlinestudios.com/spectral-sabre",
          publisher: {
            "@type": "Organization",
            name: "Ghostline Studios",
            url: "https://www.ghostlinestudios.com",
          },
          applicationCategory: "Game",
          operatingSystem: "iOS, Android",
          genre: "Tactical Stealth",
        }}
      />
      <ProjectsIndexNav />

      <section className="project-hero" data-screen-label="Sabre Hero">
        <div className="container">
          <Link href="/projects" className="project-back">
            ← All projects
          </Link>
          <div className="project-hero-grid">
            <div>
              <div className="project-tag" style={{ color: "var(--phantom-glow)" }}>
                Pre-Production · Android · iOS
              </div>
              <h1 className="project-title">Spectral Sabre</h1>
              <p className="project-tagline">{G.tagline}</p>
              <p className="project-blurb">{G.blurb}</p>
              <div className="project-stats">
                <div>
                  <strong>Tactical Stealth</strong>Genre
                </div>
                <div>
                  <strong>4 + KIP</strong>Squad
                </div>
                <div>
                  <strong>Android · iOS</strong>Platform
                </div>
                <div>
                  <strong>Pre-Production</strong>Status
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a className="btn primary" href="mailto:press@ghostlinestudios.com">
                  <span>Press enquiry</span>
                </a>
                <Link className="btn" href="/press">
                  <span>Press info</span>
                </Link>
              </div>
            </div>
            <div className="project-key-art">
              <div
                className="placeholder"
                style={{
                  background:
                    "radial-gradient(ellipse at 70% 30%, rgba(179, 136, 255, 0.35), transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(124, 77, 255, 0.22), transparent 55%), linear-gradient(180deg, #0d0a18, #06040c)",
                }}
              >
                <SpectralSabreArt big />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="project-section" data-screen-label="Sabre Pillars">
        <div className="container">
          <div className="project-section-head">
            <div>
              <h2>Five rules we follow.</h2>
            </div>
            <div className="meta-block">
              <strong>Design intent</strong>
              Tactical first.
              <br />
              Shooter second.
            </div>
          </div>
          <div className="feature-grid">
            {G.pillars.map((p, i) => (
              <div
                className="feature-cell"
                key={i}
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  paddingTop: 32,
                  paddingBottom: 32,
                  minHeight: 0,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    color: "var(--phantom)",
                    textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                </div>
                <div style={{ fontSize: 18, fontWeight: 400, color: "white", marginBottom: 10, letterSpacing: "0.02em" }}>
                  {p.title}
                </div>
                <div style={{ fontSize: 14, color: "var(--wraith)", lineHeight: 1.55 }}>{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="project-section" data-screen-label="Sabre Squad">
        <div className="container">
          <div className="project-section-head">
            <div>
              <h2>Four operators &amp; a ghost.</h2>
            </div>
            <div className="meta-block">
              <strong>Sabre Unit roster</strong>
              Each one a discipline,
              <br />a temperament, a piece of the kit.
            </div>
          </div>
          <div className="squad-grid">
            {G.operators.map((op) => (
              <div className="squad-card" key={op.id}>
                <div className="squad-portrait" style={{ backgroundImage: `url("${op.img}")` }} />
                <div className="squad-meta">
                  <div className="squad-id">{op.id}</div>
                  <div className="squad-name">{op.codename}</div>
                  <div className="squad-role">{op.role}</div>
                  <div className="squad-spec">{op.speciality}</div>
                  <div className="squad-bio">{op.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="project-section" data-screen-label="Sabre Systems">
        <div className="container">
          <div className="project-section-head">
            <div>
              <h2>How an infil holds together.</h2>
            </div>
            <div className="meta-block">
              <strong>Six core systems</strong>
              Camo · Squad · Sync · KIP
              <br />
              Recon · Detection
            </div>
          </div>
          <div className="feature-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            {G.systems.map((s, i) => (
              <div
                className="feature-cell"
                key={i}
                style={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  paddingTop: 36,
                  paddingBottom: 36,
                  minHeight: 0,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    color: "var(--spectral)",
                    textTransform: "uppercase",
                    marginBottom: 14,
                  }}
                >
                  {s.tag}
                </div>
                <div style={{ fontSize: 20, fontWeight: 400, color: "white", marginBottom: 12, letterSpacing: "0.02em" }}>
                  {s.title}
                </div>
                <div style={{ fontSize: 14, color: "var(--wraith)", lineHeight: 1.6 }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="project-section" data-screen-label="Sabre KIP comms">
        <div className="container">
          <div className="project-section-head">
            <div>
              <h2>KIP, in their own words.</h2>
            </div>
            <div className="meta-block">
              <strong>Voice samples</strong>
              Kinetic Intelligence Platform
              <br />
              Field log · KIP channel
            </div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {G.kipLines.map((line, i) => (
              <div
                key={i}
                style={{
                  padding: "22px 28px",
                  borderRadius: 14,
                  border: "1px solid rgba(179, 136, 255, 0.18)",
                  background: "linear-gradient(90deg, rgba(124, 77, 255, 0.06), rgba(255,255,255,0.0))",
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: 24,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.24em",
                    color: "var(--phantom-glow)",
                    textTransform: "uppercase",
                  }}
                >
                  KIP
                </div>
                <div style={{ fontSize: 16, color: "var(--wraith)", fontWeight: 300, lineHeight: 1.5, fontStyle: "italic" }}>
                  “{line}”
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </SiteChrome>
  );
}
