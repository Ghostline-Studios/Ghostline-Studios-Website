/* global React */
const { useState, useEffect, useRef } = React;

function Hero() {
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
        We make <em>interactive mobile games with deep story</em> — built with thought, intention, and the player&apos;s experience at the center.
      </div>

      <div className="hero-bottom">
        <div className="hero-title">Ghostline</div>
        <div className="hero-subtitle">— Studios —</div>
      </div>

      <div className="hero-cta-row">
        <a className="btn primary" href="#games">
          <span>Enter the Worlds</span>
          <span className="arrow">→</span>
        </a>
        <a className="btn" href="#about">
          <span>The Studio</span>
        </a>
      </div>
    </section>
  );
}

/* ----- GAMES SECTION ----- */
const SCRAPLINGS = {
  id: "scraplings",
  title: "Scraplings",
  tagline: "A cosy collector. Salvage the forgotten — give it a soul.",
  blurb:
    "Scraplings is a vertical mobile game about scavenging discarded objects from a quiet, abandoned world and recycling them into Scraplings: tiny creatures stitched together from junk and small kindnesses. Build a sanctuary. Memorize their songs. Watch them remember you.",
  status: "In Production",
  genre: "Cosy / Collector",
  platform: "iOS · Android",
  release: "2026 — Early Access",
  features: [
    "100+ unique Scraplings to discover, name and bond with",
    "Hand-painted vertical worlds you peel back layer by layer",
    "Adaptive ambient soundtrack that learns your routine",
    "Offline-first — your sanctuary lives on your device",
    "No timers, no energy bars, no dark patterns. Ever.",
    "Cross-save between phones via your Ghostline ID",
  ],
  bestiary: [
    { id: "001", name: "Tinhart" },
    { id: "002", name: "Rustpaw" },
    { id: "003", name: "Bulb" },
    { id: "004", name: "Gearling" },
    { id: "005", name: "Spool" },
    { id: "006", name: "Flicker" },
    { id: "007", name: "Knotter" },
    { id: "008", name: "Ribbon" },
    { id: "009", name: "Seam" },
  ],
};

const SPECTRAL_SABRE = {
  id: "spectral-sabre",
  title: "Spectral Sabre",
  tagline: "Lead Sabre Unit. Bend light. Vanish before the alarm.",
  blurb:
    "Spectral Sabre is a mobile-first third-person tactical stealth shooter. Command a four-person black-ops squad equipped with hyperspectral camouflage — an experimental refraction system that distorts the operator's signature across visible light, thermal, infrared and drone optics. Plan with KIP, your digital infiltration companion. Tag with the recon drone. Sync four shots into one. Move like a rumour.",
  status: "Pre-Alpha",
  genre: "Tactical Stealth · Squad Shooter",
  platform: "Android first · iOS to follow",
  release: "2027 — Vertical Slice",
  features: [
    "Hyperspectral camouflage with real rules — heat, battery, scanner fields, weather",
    "Four operators commanded with a single thumb — Mark, Sync, Breach, Hold",
    "KIP, a digital infiltration companion — hacks cameras, doors, drones, alarms",
    "Sync shot system: queue up to four targets, fire as one",
    "3 to 8 minute missions designed for mobile — replayable tactical sandboxes",
    "No bullet sponges. No dark patterns. Stealth failures stay recoverable.",
  ],
  operators: [
    { id: "OP-01", img: "assets/op-wraith.png", codename: "Wraith", role: "Adaptive Commander", speciality: "Player-selected loadout", bio: "Player avatar and squad leader. Flexible all-round operator best suited to commanding squad flow. Uses an FPV recon drone to scout and tag. Strong link to camo stability and command pacing." },
    { id: "OP-02", img: "assets/op-vantage.png", codename: "Vantage", role: "Long-Range Overwatch", speciality: "Precision shots · drone-assisted targeting · thermal optics", bio: "Holds sightlines, covers the squad, eliminates marked threats. Excels at sync shots and silent guard removals. Reinforces patient, tactical mission pacing — strongest when holding a protected sightline." },
    { id: "OP-03", img: "assets/op-rook.png", codename: "Rook", role: "Close-Quarters Assault", speciality: "Door breaching · shield module · flash charges · heavy armour", bio: "The squad's frontline protector. Lead high-risk entries and absorb pressure when stealth breaks. Less subtle, but still built for stealth-team pacing. KIP hides behind Rook when explosions happen." },
    { id: "OP-04", img: "assets/op-echo.png", codename: "Echo", role: "Electronic Warfare", speciality: "EMP pulses · camera loops · turret hijacking · sensor spoofing", bio: "The squad's digital partner. Disables alarms, jams drones, marks enemies through walls for a limited duration. Reduces anti-camo pressure. Treats KIP like a colleague — translates its rapid technical chatter for the rest of the team." },
    { id: "OP-05", img: "assets/op-kip.png", codename: "KIP", role: "Digital Infiltration Companion", speciality: "Hacking · scouting · spoofing · device manipulation", bio: "Kinetic Intelligence Platform. Compact four-legged field crawler that exploits anything digital — cameras, doors, drones, alarms, turrets, anti-camo towers. Loyal to Sabre Unit and quietly attached to 'my humans.' Mildly offended when treated as equipment." },
  ],
  pillars: [
    { num: "01", title: "Tactical first, shooter second", body: "Power comes from observation, positioning and timing. Shooting is satisfying, but the best outcomes are planned." },
    { num: "02", title: "Stealth tech with rules", body: "Hyperspectral camo is the signature fantasy — but heat, water, sprinting, muzzle flash, scanner fields all break it. Tense, not magical." },
    { num: "03", title: "Mobile missions, console mood", body: "Three to eight minutes per infil. Cinematic, deliberate, tactical — but designed around thumbs and short sessions." },
    { num: "04", title: "Four operators, one mind", body: "Squad commands stay quick and readable. Mark, sync, breach, flank, hold — radial menus over micromanagement." },
    { num: "05", title: "KIP gives the game its heart", body: "The squad is professional and lethal. KIP is the spark of weirdness that makes them feel alive." },
  ],
  systems: [
    { tag: "01 · Camo", title: "Hyperspectral Adaptive Refraction", body: "Layered refraction panels, thermal masking gel and AI spectral prediction distort your signature across visible, thermal, infrared and drone bands. Battery-limited. States: Passive · Active · Overburn · Disrupted." },
    { tag: "02 · Squad", title: "Touch Squad Command", body: "One thumb commands four operators. Tap an enemy → Mark / Sync / Suppress / Flank. Tap a door → Breach / Stack / KIP Unlock. Squadmates take cover, suppress on order, revive when safe." },
    { tag: "03 · Sync Shot", title: "Four Shots, One Trigger", body: "Mark up to four targets. Each operator lines up their shot. When all sights are green, tap Execute. Four kills, one sound. The cleanest possible breach." },
    { tag: "04 · KIP", title: "The Digital Infiltration Loop", body: "Camera Loop. Door Whisper. Drone Hijack. Alarm Suppression. Sensor Spoof. Ghost Route. Panic Patch. KIP turns the enemy's own surveillance into your toolkit." },
    { tag: "05 · Recon", title: "Drone-First Awareness", body: "Tag enemies, identify patrols, mark loot, emit short EMP pulses. Scout · Orbit · Perch · Pulse modes. Your eyes long before your trigger." },
    { tag: "06 · Detection", title: "Stealth Is A Curve, Not A Switch", body: "Unaware → Suspicious → Searching → Alerted → Combat → Lockdown. Being spotted is recoverable: silence the spotter, jam the alarm, smoke the line of sight, re-enter stealth." },
  ],
  kipLines: [
    "Door is locked. Door is now embarrassed.",
    "Camera loop active. It is watching yesterday.",
    "Enemy drone sees heat. I made your heat boring.",
    "Stealth rating excellent. I feel proud in my circuits.",
    "This plan has many bullets in it. I suggest fewer bullets.",
    "Gate is open enough for heroic crouching.",
  ],
};

function GameCard({ game, expanded, onToggle }) {
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
        <div className="game-card-tag">{game.status} · {game.platform}</div>
        <h3 className="game-card-title">{game.title}</h3>
        <p className="game-card-tagline">{game.tagline}</p>
        <div className="game-card-stats">
          <div><strong>{game.genre.split("·")[0].trim()}</strong>Genre</div>
          <div><strong>{game.release}</strong>Window</div>
          <div><strong>Mobile</strong>Platform</div>
        </div>
        <div className="game-card-actions">
          <button className="btn primary" onClick={(e) => { e.stopPropagation(); onToggle(); }}>
            <span>Open Brief</span>
            <span className="arrow">↗</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function ExpandedGame({ game, onClose }) {
  return (
    <article className={`game-card expanded ${game.id} glass`}>
      <div className="game-card-expanded">
        <button className="close" onClick={onClose} aria-label="Close">×</button>
        <div className="left">
          <div>
            <div className="game-card-tag">{game.status} · {game.platform} · {game.release}</div>
            <h3 className="game-card-title" style={{ marginBottom: 18 }}>{game.title}</h3>
            <p className="game-card-tagline" style={{ fontSize: 17, maxWidth: 480, marginBottom: 24 }}>{game.tagline}</p>
            <p style={{ color: "var(--wraith)", fontSize: 14, lineHeight: 1.65, fontWeight: 300, maxWidth: 540 }}>{game.blurb}</p>
          </div>

          <div className="expanded-art" style={{ marginTop: 28 }}>
            <div className="placeholder">
              {game.id === "scraplings" ? <ScraplingsArt big /> : <SpectralSabreArt big />}
            </div>
            <div className="label">{game.id === "scraplings" ? "World 02 — The Quiet Bazaar" : "Op 14 — Riften Spire, Section C"}</div>
            <div className="frame-pin">FRAME · 0034</div>
          </div>

          <ul className="expanded-features">
            {game.features.map((f, i) => <li key={i}>{f}</li>)}
          </ul>

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button className="btn primary"><span>Wishlist</span><span className="arrow">↗</span></button>
            <button className="btn"><span>Press Kit</span></button>
          </div>
        </div>

        <div className="right">
          {game.id === "scraplings" ? (
            <ScraplingsBestiary game={game} />
          ) : (
            <SpectralSabreSquad game={game} />
          )}
        </div>
      </div>
    </article>
  );
}

function ScraplingsArt({ big }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <div style={{
        width: big ? "70%" : "60%", aspectRatio: 1,
        background: "radial-gradient(circle at 40% 40%, rgba(127, 227, 241, 0.55), transparent 60%)",
        filter: "blur(20px)",
      }} />
      <div style={{ position: "absolute", inset: 0, opacity: 0.7, mixBlendMode: "screen" }}>
        {[...Array(big ? 22 : 14)].map((_, i) => {
          const left = (i * 37) % 100;
          const top = (i * 53) % 100;
          const size = 4 + (i % 5) * 2;
          return (
            <div key={i} style={{
              position: "absolute",
              left: `${left}%`, top: `${top}%`,
              width: size, height: size,
              background: "var(--spectral)",
              borderRadius: i % 3 === 0 ? "50%" : "2px",
              boxShadow: "0 0 8px var(--spectral)",
              opacity: 0.6 + ((i * 7) % 4) * 0.1,
            }} />
          );
        })}
      </div>
      <div style={{
        position: "absolute", bottom: "8%", left: 0, right: 0, height: "1px",
        background: "linear-gradient(90deg, transparent, var(--spectral), transparent)",
        opacity: 0.4,
      }} />
    </div>
  );
}

function SpectralSabreArt({ big }) {
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <div style={{
        width: big ? "75%" : "65%", aspectRatio: 1,
        background: "radial-gradient(circle at 60% 40%, rgba(179, 136, 255, 0.6), rgba(124, 77, 255, 0.2) 50%, transparent 70%)",
        filter: "blur(24px)",
      }} />
      {/* targeting reticle */}
      <svg viewBox="0 0 200 200" style={{ position: "absolute", width: big ? "60%" : "70%", aspectRatio: 1, opacity: 0.7 }}>
        <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(179, 136, 255, 0.5)" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(179, 136, 255, 0.3)" strokeWidth="0.5" />
        <line x1="100" y1="20" x2="100" y2="40" stroke="rgba(179, 136, 255, 0.7)" />
        <line x1="100" y1="160" x2="100" y2="180" stroke="rgba(179, 136, 255, 0.7)" />
        <line x1="20" y1="100" x2="40" y2="100" stroke="rgba(179, 136, 255, 0.7)" />
        <line x1="160" y1="100" x2="180" y2="100" stroke="rgba(179, 136, 255, 0.7)" />
        <circle cx="100" cy="100" r="2" fill="var(--phantom-glow)" />
        <circle cx="100" cy="100" r="6" fill="none" stroke="var(--phantom)" />
      </svg>
      {/* signal lines */}
      <svg viewBox="0 0 400 400" style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
        <path d="M 30 80 Q 200 100 380 60" stroke="rgba(124, 77, 255, 0.5)" fill="none" strokeWidth="0.5" strokeDasharray="1 4" />
        <path d="M 30 320 Q 200 290 380 340" stroke="rgba(77, 208, 225, 0.4)" fill="none" strokeWidth="0.5" strokeDasharray="1 4" />
      </svg>
    </div>
  );
}

function ScraplingsBestiary({ game }) {
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div className="game-card-tag" style={{ marginBottom: 10 }}>Bestiary · 09 / 100+</div>
        <h4 style={{ fontSize: 22, fontWeight: 300, letterSpacing: 0.02, marginBottom: 6 }}>The First Nine</h4>
        <p style={{ fontSize: 12, color: "var(--wraith-soft)", lineHeight: 1.5, fontWeight: 300, maxWidth: 36 + "ch" }}>
          A handful of the Scraplings you&apos;ll meet in the prologue. Each is hand-painted, hand-named, hand-given a small song.
        </p>
      </div>
      <div className="scraplings-bestiary">
        {game.bestiary.map((b, i) => (
          <div className="scrapling-cell" key={b.id}>
            <span className="num">#{b.id}</span>
            <div className="scrapling-icon" style={{
              clipPath: [
                "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                "circle(45% at 50% 55%)",
                "polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)",
                "polygon(50% 0%, 100% 100%, 0% 100%)",
                "circle(40% at 50% 50%)",
                "polygon(0% 30%, 50% 0%, 100% 30%, 80% 100%, 20% 100%)",
                "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                "polygon(50% 5%, 90% 50%, 50% 95%, 10% 50%)",
              ][i],
              opacity: 0.6 + (i % 3) * 0.12,
              filter: i % 2 ? "hue-rotate(20deg)" : "hue-rotate(-15deg)",
            }} />
            <span className="name">{b.name}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 22, fontSize: 11, color: "var(--wraith-faint)", fontFamily: "var(--font-mono)", letterSpacing: 0.18 + "em", textTransform: "uppercase" }}>
        — More to be discovered —
      </div>
    </>
  );
}

function SpectralSabreSquad({ game }) {
  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div className="game-card-tag" style={{ marginBottom: 10, color: "var(--phantom-glow)" }}>Squad Roster · Sabre Cell</div>
        <h4 style={{ fontSize: 22, fontWeight: 300, letterSpacing: 0.02, marginBottom: 6 }}>Four Operators &amp; A Ghost</h4>
        <p style={{ fontSize: 12, color: "var(--wraith-soft)", lineHeight: 1.5, fontWeight: 300, maxWidth: 36 + "ch" }}>
          Each operator brings a discipline, a temperament, and a piece of your kit. The drone keeps the rest of you alive.
        </p>
      </div>
      <div className="operators">
        {game.operators.map((op) => (
          <div className="op-card" key={op.id}>
            <div className="portrait" style={{ backgroundImage: `url("${op.img}")`, backgroundSize: "cover", backgroundPosition: "center top" }} />
            <div className="info">
              <div className="codename">{op.codename}</div>
              <div className="role">{op.role}</div>
              {op.speciality && <div className="speciality">{op.speciality}</div>}
              <div className="bio">{op.bio}</div>
            </div>
            <div className="id">{op.id}</div>
          </div>
        ))}
      </div>
      {game.kipLines && (
        <div className="kip-lines">
          <div className="kip-lines-tag">— KIP, on comms</div>
          {game.kipLines.slice(0, 4).map((l, i) => (
            <div className="kip-line" key={i}>"{l}"</div>
          ))}
        </div>
      )}
    </>
  );
}

function GamesSection() {
  const [openId, setOpenId] = useState(null);
  const games = [SCRAPLINGS, SPECTRAL_SABRE];

  return (
    <section id="games" data-screen-label="02 Games">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="index">— 02 / In Production</div>
            <h2>Worlds in motion.</h2>
          </div>
          <div className="meta-block">
            <strong>Two projects</strong>
            Active development · Mobile-first
            <br />Hand-built · Player-respecting · No dark patterns
          </div>
        </div>

        <div className="games-grid">
          {games.map((g) => (
            (openId === null || openId === g.id) && (
              <GameCard
                key={g.id}
                game={g}
                expanded={openId === g.id}
                onToggle={() => setOpenId(openId === g.id ? null : g.id)}
              />
            )
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsTeaser() {
  return (
    <section id="projects" data-screen-label="02 Projects">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="index">— 02 / Active Projects</div>
            <h2>Two worlds in motion.</h2>
          </div>
          <div className="meta-block">
            <strong>In production · 2026</strong>
            Mobile-first · Player-respecting<br />Hand-built · No dark patterns
          </div>
        </div>
        <div className="projects-teaser">
          <a href="scraplings.html" className="teaser-card scraplings">
            <div className="teaser-art"><ScraplingsArt big /></div>
            <div className="teaser-meta">
              <div className="teaser-tag">In Production · iOS · Android</div>
              <h3 className="teaser-title">Scraplings</h3>
              <p className="teaser-line">A cosy collector. Salvage the forgotten — give it a soul.</p>
              <span className="teaser-cta">Open project <span className="arrow">↗</span></span>
            </div>
          </a>
          <a href="spectral-sabre.html" className="teaser-card spectral-sabre">
            <div className="teaser-art"><SpectralSabreArt big /></div>
            <div className="teaser-meta">
              <div className="teaser-tag">Pre-Alpha · Android first</div>
              <h3 className="teaser-title">Spectral Sabre</h3>
              <p className="teaser-line">Lead Sabre Unit. Bend light. Vanish before the alarm.</p>
              <span className="teaser-cta">Open project <span className="arrow">↗</span></span>
            </div>
          </a>
        </div>
        <div className="projects-link">
          <a className="btn primary" href="projects.html"><span>All Projects</span><span className="arrow">→</span></a>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, GamesSection, ProjectsTeaser, SCRAPLINGS, SPECTRAL_SABRE, ScraplingsArt, SpectralSabreArt, ScraplingsBestiary, SpectralSabreSquad });
