"use client";

import type { ScraplingsGame, SpectralSabreGame } from "@/data/games";
import { SCRAPLINGS, SPECTRAL_SABRE } from "@/data/games";
import Link from "next/link";
import { useState, type MouseEvent } from "react";

export type { ScraplingsGame, SpectralSabreGame } from "@/data/games";
export { SCRAPLINGS, SPECTRAL_SABRE } from "@/data/games";

export function Hero() {
  return (
    <section id="home" className="hero" data-screen-label="01 Hero">
      <div className="hero-eclipse-wrap">
        <svg className="hero-eclipse-rings" viewBox="0 0 800 800" aria-hidden>
          <circle cx="400" cy="400" r="395" />
          <circle cx="400" cy="400" r="370" strokeDasharray="2 6" />
          <circle cx="400" cy="400" r="340" />
          <line x1="400" y1="0" x2="400" y2="40" stroke="rgba(77, 208, 225, 0.5)" />
          <line x1="400" y1="760" x2="400" y2="800" stroke="rgba(179, 136, 255, 0.5)" />
        </svg>
        <div className="hero-eclipse" role="img" aria-label="Ghostline eclipse mark"></div>

        <div className="hero-text">
          <div className="hero-headline">A studio between worlds</div>
        </div>

        <div className="hero-hud" aria-hidden>
          <div className="pin tl">
            <div className="num">02</div>
            <div className="label">Active worlds</div>
          </div>
          <div className="pin tr">
            <div className="num">2026</div>
            <div className="label">Founded</div>
          </div>
          <div className="pin bl">
            <div className="num">∞</div>
            <div className="label">Ghostlines drawn</div>
          </div>
          <div className="pin br">
            <div className="num">07</div>
            <div className="label">Crew aboard</div>
          </div>
        </div>
      </div>

      <div className="hero-pitch">
        We make <em>interactive mobile games with deep story</em> — built with thought, intention, and the
        player&apos;s experience at the center.
      </div>

      <div className="hero-bottom">
        <div className="hero-title">Ghostline</div>
        <div className="hero-subtitle">— Studios —</div>
      </div>

      <div className="hero-cta-row">
        <a className="btn primary" href="#games">
          <span>Enter the Worlds</span>
        </a>
        <a className="btn" href="#about">
          <span>The Studio</span>
        </a>
      </div>
    </section>
  );
}

type GameUnion = ScraplingsGame | SpectralSabreGame;

function GameCard({
  game,
  expanded,
  onToggle,
}: {
  game: GameUnion;
  expanded: boolean;
  onToggle: () => void;
}) {
  if (expanded) return <ExpandedGame game={game} onClose={onToggle} />;
  return (
    <article className={`game-card ${game.id}`} onClick={onToggle}>
      <div className="game-card-art">
        <div className="placeholder">
          {game.id === "scraplings" && <ScraplingsArt />}
          {game.id === "spectral-sabre" && <SpectralSabreArt />}
        </div>
        <div className="grid-pattern" />
      </div>
      <div className="game-card-overlay" />
      <div className="game-card-content">
        <div className="game-card-tag">
          {game.status} · {game.platform}
        </div>
        <h3 className="game-card-title">{game.title}</h3>
        <p className="game-card-tagline">{game.tagline}</p>
        <div className="game-card-stats">
          <div>
            <strong>{game.genre.split("·")[0].trim()}</strong>Genre
          </div>
          <div>
            <strong>{game.release}</strong>Window
          </div>
          <div>
            <strong>Mobile</strong>Platform
          </div>
        </div>
        <div className="game-card-actions">
          <button
            type="button"
            className="btn primary"
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            <span>Open Brief</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function ExpandedGame({ game, onClose }: { game: GameUnion; onClose: () => void }) {
  return (
    <article className={`game-card expanded ${game.id} glass`}>
      <div className="game-card-expanded">
        <button type="button" className="close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="left">
          <div>
            <div className="game-card-tag">
              {game.status} · {game.platform} · {game.release}
            </div>
            <h3 className="game-card-title" style={{ marginBottom: 18 }}>
              {game.title}
            </h3>
            <p className="game-card-tagline" style={{ fontSize: 17, maxWidth: 480, marginBottom: 24 }}>
              {game.tagline}
            </p>
            <p style={{ color: "var(--wraith)", fontSize: 14, lineHeight: 1.65, fontWeight: 300, maxWidth: 540 }}>
              {game.blurb}
            </p>
          </div>

          <div className="expanded-art" style={{ marginTop: 28 }}>
            <div className="placeholder">
              {game.id === "scraplings" ? <ScraplingsArt big /> : <SpectralSabreArt big />}
            </div>
            <div className="label">
              {game.id === "scraplings" ? "World 02 — The Quiet Bazaar" : "Op 14 — Riften Spire, Section C"}
            </div>
            <div className="frame-pin">FRAME · 0034</div>
          </div>

          <ul className="expanded-features">
            {game.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button type="button" className="btn primary">
              <span>Wishlist</span>
            </button>
            <button type="button" className="btn">
              <span>Press Kit</span>
            </button>
          </div>
        </div>

        <div className="right">
          {game.id === "scraplings" ? (
            <ScraplingsBestiary game={game as ScraplingsGame} />
          ) : (
            <SpectralSabreSquad game={game as SpectralSabreGame} />
          )}
        </div>
      </div>
    </article>
  );
}

export function ScraplingsArt({ big }: { big?: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <div
        className="scrap-glow"
        style={{
          width: big ? "70%" : "60%",
          aspectRatio: 1,
          background: "radial-gradient(circle at 40% 40%, rgba(127, 227, 241, 0.55), transparent 60%)",
          filter: "blur(20px)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, opacity: 0.7, mixBlendMode: "screen" }}>
        {[...Array(big ? 22 : 14)].map((_, i) => {
          const left = (i * 37) % 100;
          const top = (i * 53) % 100;
          const size = 4 + (i % 5) * 2;
          return (
            <div
              key={i}
              className="scrap-particle"
              style={{
                position: "absolute",
                left: `${left}%`,
                top: `${top}%`,
                width: size,
                height: size,
                background: "var(--spectral)",
                borderRadius: i % 3 === 0 ? "50%" : "2px",
                boxShadow: "0 0 8px var(--spectral)",
                opacity: 0.6 + ((i * 7) % 4) * 0.1,
                animationDuration: `${2.2 + (i % 5) * 0.45}s`,
                animationDelay: `-${(i * 0.19).toFixed(2)}s`,
              }}
            />
          );
        })}
      </div>
      <div
        className="scrap-scan"
        style={{
          position: "absolute",
          bottom: "8%",
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--spectral), transparent)",
          opacity: 0.4,
        }}
      />
    </div>
  );
}

export function SpectralSabreArt({ big }: { big?: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <div
        className="sabre-glow"
        style={{
          width: big ? "75%" : "65%",
          aspectRatio: 1,
          background:
            "radial-gradient(circle at 60% 40%, rgba(179, 136, 255, 0.6), rgba(124, 77, 255, 0.2) 50%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />
      {/* outer ring — slow clockwise spin */}
      <div
        className="sabre-ring-outer"
        style={{ position: "absolute", width: big ? "60%" : "70%", aspectRatio: 1 }}
      >
        <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", opacity: 0.7 }}>
          <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(179, 136, 255, 0.3)" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(179, 136, 255, 0.5)" strokeWidth="1" strokeDasharray="2 4" />
        </svg>
      </div>
      {/* inner detail — counter-clockwise spin */}
      <div
        className="sabre-ring-inner"
        style={{ position: "absolute", width: big ? "38%" : "44%", aspectRatio: 1 }}
      >
        <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%", opacity: 0.9 }}>
          <line x1="100" y1="20" x2="100" y2="40" stroke="rgba(179, 136, 255, 0.7)" />
          <line x1="100" y1="160" x2="100" y2="180" stroke="rgba(179, 136, 255, 0.7)" />
          <line x1="20" y1="100" x2="40" y2="100" stroke="rgba(179, 136, 255, 0.7)" />
          <line x1="160" y1="100" x2="180" y2="100" stroke="rgba(179, 136, 255, 0.7)" />
          <circle cx="100" cy="100" r="2" fill="var(--phantom-glow)" />
          <circle cx="100" cy="100" r="6" fill="none" stroke="var(--phantom)" />
        </svg>
      </div>
      <svg viewBox="0 0 400 400" style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        <path d="M 30 80 Q 200 100 380 60" stroke="rgba(124, 77, 255, 0.5)" fill="none" strokeWidth="0.5" strokeDasharray="1 4" />
        <path d="M 30 320 Q 200 290 380 340" stroke="rgba(77, 208, 225, 0.4)" fill="none" strokeWidth="0.5" strokeDasharray="1 4" />
      </svg>
    </div>
  );
}

export function ScraplingsBestiary({ game }: { game: ScraplingsGame }) {
  const clipPaths = [
    "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
    "circle(45% at 50% 55%)",
    "polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)",
    "polygon(50% 0%, 100% 100%, 0% 100%)",
    "circle(40% at 50% 50%)",
    "polygon(0% 30%, 50% 0%, 100% 30%, 80% 100%, 20% 100%)",
    "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
    "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
    "polygon(50% 5%, 90% 50%, 50% 95%, 10% 50%)",
  ];
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div className="game-card-tag" style={{ marginBottom: 10 }}>
          Bestiary · 09 / 100+
        </div>
        <h4 style={{ fontSize: 22, fontWeight: 300, letterSpacing: 0.02, marginBottom: 6 }}>The First Nine</h4>
        <p
          style={{
            fontSize: 12,
            color: "var(--wraith-soft)",
            lineHeight: 1.5,
            fontWeight: 300,
            maxWidth: "36ch",
          }}
        >
          A handful of the Scraplings you&apos;ll meet in the prologue. Each is hand-painted, hand-named, hand-given a
          small song.
        </p>
      </div>
      <div className="scraplings-bestiary">
        {game.bestiary.map((b, i) => (
          <div className="scrapling-cell" key={b.id}>
            <span className="num">#{b.id}</span>
            <div
              className="scrapling-icon"
              style={{
                clipPath: clipPaths[i],
                opacity: 0.6 + (i % 3) * 0.12,
                filter: i % 2 ? "hue-rotate(20deg)" : "hue-rotate(-15deg)",
              }}
            />
            <span className="name">{b.name}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 22,
          fontSize: 11,
          color: "var(--wraith-faint)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        — More to be discovered —
      </div>
    </>
  );
}

export function SpectralSabreSquad({ game }: { game: SpectralSabreGame }) {
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div className="game-card-tag" style={{ marginBottom: 10, color: "var(--phantom-glow)" }}>
          Squad Roster · Sabre Cell
        </div>
        <h4 style={{ fontSize: 22, fontWeight: 300, letterSpacing: 0.02, marginBottom: 6 }}>Four Operators &amp; A Ghost</h4>
        <p
          style={{
            fontSize: 12,
            color: "var(--wraith-soft)",
            lineHeight: 1.5,
            fontWeight: 300,
            maxWidth: "36ch",
          }}
        >
          Each operator brings a discipline, a temperament, and a piece of your kit. The drone keeps the rest of you
          alive.
        </p>
      </div>
      <div className="operators">
        {game.operators.map((op) => (
          <div className="op-card" key={op.id}>
            <div
              className="portrait"
              style={{
                backgroundImage: `url("${op.img}")`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
              }}
            />
            <div className="info">
              <div className="codename">{op.codename}</div>
              <div className="role">{op.role}</div>
              {op.speciality ? <div className="speciality">{op.speciality}</div> : null}
              <div className="bio">{op.bio}</div>
            </div>
            <div className="id">{op.id}</div>
          </div>
        ))}
      </div>
      {game.kipLines ? (
        <div className="kip-lines">
          <div className="kip-lines-tag">— KIP, on comms</div>
          {game.kipLines.slice(0, 4).map((l, i) => (
            <div className="kip-line" key={i}>
              &quot;{l}&quot;
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

export function GamesSection() {
  const [openId, setOpenId] = useState<string | null>(null);
  const games: GameUnion[] = [SCRAPLINGS, SPECTRAL_SABRE];

  return (
    <section id="games" data-screen-label="02 Games">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Worlds in motion.</h2>
          </div>
          <div className="meta-block">
            <strong>Two projects</strong>
            Active development · Mobile-first
            <br />
            Hand-built · Player-respecting · No dark patterns
          </div>
        </div>

        <div className="games-grid">
          {games.map((g) =>
            (openId === null || openId === g.id) && (
              <GameCard
                key={g.id}
                game={g}
                expanded={openId === g.id}
                onToggle={() => setOpenId(openId === g.id ? null : g.id)}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export function ProjectsTeaser() {
  return (
    <section id="projects" data-screen-label="02 Projects">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Two worlds in motion.</h2>
          </div>
          <div className="meta-block">
            <strong>In production · 2026</strong>
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
              <div className="teaser-tag">In Production · iOS · Android</div>
              <h3 className="teaser-title">Scraplings</h3>
              <p className="teaser-line">A cosy collector. Salvage the forgotten — give it a soul.</p>
              <span className="teaser-cta">Open project</span>
            </div>
          </Link>
          <Link href="/spectral-sabre" className="teaser-card spectral-sabre">
            <div className="teaser-art">
              <SpectralSabreArt big />
            </div>
            <div className="teaser-meta">
              <div className="teaser-tag">Pre-Alpha · Android first</div>
              <h3 className="teaser-title">Spectral Sabre</h3>
              <p className="teaser-line">Lead Sabre Unit. Bend light. Vanish before the alarm.</p>
              <span className="teaser-cta">Open project</span>
            </div>
          </Link>
        </div>
        <div className="projects-link">
          <Link className="btn primary" href="/projects">
            <span>All Projects</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
