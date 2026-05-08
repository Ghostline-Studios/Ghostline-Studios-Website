"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

export function AboutSection() {
  return (
    <section id="about" data-screen-label="03 About">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="index">— 03 / The Studio</div>
            <h2>Quiet craft. Loud intent.</h2>
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
            Ghostline draws the thin line between <em>player and world</em>. We build mobile games that respect your
            attention, your wallet, and your time — and reward it with worlds that feel alive long after you put the
            phone down.
          </div>
          <div className="manifesto-pillars">
            <div className="pillar">
              <div className="num">PILLAR · 01</div>
              <h4>Story before system</h4>
              <p>Every loop, mechanic and menu starts with a question: what is this making the player feel?</p>
            </div>
            <div className="pillar">
              <div className="num">PILLAR · 02</div>
              <h4>Mobile, taken seriously</h4>
              <p>
                The phone is not a lesser screen. It&apos;s a more intimate one. We design for thumbs, attention, and
                quiet moments.
              </p>
            </div>
            <div className="pillar">
              <div className="num">PILLAR · 03</div>
              <h4>No dark patterns</h4>
              <p>No timers that nag, no energy that runs out, no FOMO event drops. If a system needs guilt to function, we cut it.</p>
            </div>
            <div className="pillar">
              <div className="num">PILLAR · 04</div>
              <h4>Ship the strange</h4>
              <p>If it has been done before, it has been done. We&apos;d rather be slightly wrong about something new.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const NEWS = [
  { date: "MAY · 2026", tag: "STUDIO", tagClass: "studio", title: "Ghostline Studios opens its doors. Two projects, one direction." },
  { date: "APR · 2026", tag: "SCRAPLINGS", tagClass: "scrap", title: "Devlog 04 — Tinhart, the first Scrapling we ever made." },
  { date: "APR · 2026", tag: "SABRE", tagClass: "sabre", title: "How Sabre-9 learned to argue: writing a drone with a personality." },
  { date: "MAR · 2026", tag: "SCRAPLINGS", tagClass: "scrap", title: "Building a vertical world: notes on portrait-first level design." },
  { date: "MAR · 2026", tag: "SABRE", tagClass: "sabre", title: "Touch ganging — commanding four operators with one thumb." },
  { date: "FEB · 2026", tag: "STUDIO", tagClass: "studio", title: "Why we&apos;re a remote-first, async-first, slack-last studio." },
];

export function NewsSection() {
  return (
    <section id="news" data-screen-label="04 News">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="index">— 04 / Field Notes</div>
            <h2>Devlog &amp; dispatches.</h2>
          </div>
          <div className="meta-block">
            <strong>Updated weekly</strong>
            Build notes, design rambling, occasional
            <br />
            screenshots, no hype cycles.
          </div>
        </div>
        <div className="devlog-list">
          {NEWS.map((n, i) => (
            <a key={i} className="devlog-item" href="#">
              <div className="date">{n.date}</div>
              <div className={"tag " + n.tagClass}>{n.tag}</div>
              <h4 dangerouslySetInnerHTML={{ __html: n.title }} />
              <div className="arrow-cell">READ →</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const ROLES = [
  { title: "Senior Mobile Engineer (Unity)", team: "Spectral Sabre", location: "Remote · UK / EU", type: "Full time" },
  { title: "Game Designer — Cosy Systems", team: "Scraplings", location: "Remote · Anywhere", type: "Full time" },
  { title: "Technical Artist — Mobile FX", team: "Both projects", location: "Remote · UK / EU", type: "Full time" },
  { title: "Narrative Designer", team: "Spectral Sabre", location: "Remote · Anywhere", type: "Contract" },
  { title: "Open application", team: "Studio", location: "Remote · Anywhere", type: "Tell us why" },
];

export function CareersSection() {
  return (
    <section id="careers" data-screen-label="05 Careers">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="index">— 05 / Crew</div>
            <h2>Join the line.</h2>
          </div>
          <div className="meta-block">
            <strong>Currently 7 aboard</strong>
            Small studio. Senior people.
            <br />
            Async-first. Calendars protected.
          </div>
        </div>
        <div className="careers-wrap">
          <div className="careers-intro">
            <h3>We hire slowly. We treat people well. We make the work the thing.</h3>
            <p>
              If you&apos;ve shipped before, if you care about the small details no-one notices, if you can read a build
              log without flinching — there&apos;s probably a chair here for you.
            </p>
            <div style={{ marginTop: 28 }}>
              <a className="btn primary" href="#contact">
                <span>Open Application</span>
                <span className="arrow">↗</span>
              </a>
            </div>
          </div>
          <div className="role-list">
            {ROLES.map((r, i) => (
              <a key={i} className="role-item" href="#">
                <div>
                  <h4>{r.title}</h4>
                  <div className="role-meta">
                    <span>{r.team}</span>
                    <span className="dot">●</span>
                    <span>{r.location}</span>
                    <span className="dot">●</span>
                    <span>{r.type}</span>
                  </div>
                </div>
                <div className="role-cta">View →</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PressContactSection() {
  return (
    <section id="press" data-screen-label="06 Press & Contact">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="index">— 06 / Materials</div>
            <h2>Press &amp; contact.</h2>
          </div>
          <div className="meta-block">
            <strong>
              For press, partners,
              <br />
              and friendly humans
            </strong>
            press@ghostline.studio
            <br />
            hello@ghostline.studio
          </div>
        </div>

        <div className="press-wrap">
          <div className="press-card glass">
            <div className="num">— 06.1 / Press kit</div>
            <h3>Logos, screenshots, fact sheets, b-roll.</h3>
            <p>Everything you need to write about Ghostline or either game. Updated whenever something interesting ships.</p>
            <div className="links">
              <a className="link-row" href="#">
                <span>Studio Press Kit</span>
                <span className="size">ZIP · 184 MB</span>
              </a>
              <a className="link-row" href="#">
                <span>Scraplings — Press Kit</span>
                <span className="size">ZIP · 92 MB</span>
              </a>
              <a className="link-row" href="#">
                <span>Spectral Sabre — Press Kit</span>
                <span className="size">ZIP · 156 MB</span>
              </a>
              <a className="link-row" href="#">
                <span>Brand Guidelines</span>
                <span className="size">PDF · 6 MB</span>
              </a>
            </div>
          </div>

          <div className="press-card glass" id="contact">
            <div className="num">— 06.2 / Stay in the loop</div>
            <h3>One letter, every now and then.</h3>
            <p>No marketing. No countdown timers. Build notes, occasional screenshots, the rare announcement when we have something real to say.</p>
            <form
              className="signup"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Subscribed — keep an eye on your inbox.");
              }}
            >
              <input type="email" placeholder="you@somewhere.net" required />
              <button type="submit">Join →</button>
            </form>
            <div style={{ marginTop: 28 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.3em",
                  color: "var(--wraith-soft)",
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                — Or find us
              </div>
              <div className="links">
                <a className="link-row" href="#">
                  <span>Discord — Ghostline Crew</span>
                  <span className="size">3,402 members</span>
                </a>
                <a className="link-row" href="#">
                  <span>Bluesky — @ghostline.studio</span>
                  <span className="size">@ghostline</span>
                </a>
                <a className="link-row" href="#">
                  <span>YouTube — Devlog channel</span>
                  <span className="size">/ghostlinestudios</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="col">
            <h5>— Ghostline Studios</h5>
            <p style={{ fontSize: 14, color: "var(--wraith)", lineHeight: 1.6, fontWeight: 300, maxWidth: "36ch" }}>
              A small studio drawing thin lines between players and worlds. Mobile games made with thought, intention, and time.
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: "0.24em",
                color: "var(--wraith-faint)",
                textTransform: "uppercase",
                marginTop: 24,
              }}
            >
              Est. 2026 · Remote · Anywhere with a quiet morning.
            </p>
          </div>
          <div className="col">
            <h5>Worlds</h5>
            <ul>
              <li>
                <Link href="/scraplings">Scraplings</Link>
              </li>
              <li>
                <Link href="/spectral-sabre">Spectral Sabre</Link>
              </li>
              <li>
                <Link href="/#games">Future projects</Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <h5>Studio</h5>
            <ul>
              <li>
                <Link href="/#about">Manifesto</Link>
              </li>
              <li>
                <Link href="/#news">Devlog</Link>
              </li>
              <li>
                <Link href="/#careers">Careers</Link>
              </li>
              <li>
                <Link href="/#press">Press kit</Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <h5>Contact</h5>
            <ul>
              <li>
                <a href="mailto:hello@ghostline.studio">hello@ghostline.studio</a>
              </li>
              <li>
                <a href="mailto:press@ghostline.studio">press@ghostline.studio</a>
              </li>
              <li>
                <a href="#">Discord</a>
              </li>
              <li>
                <a href="#">Bluesky</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Ghostline Studios — All ghosts reserved</span>
          <span>v0.7.4 · Built quietly</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Mobile drawer ─────────────────────────────────────────────── */
function MobileDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* backdrop */}
      <div
        className={"mobile-drawer-backdrop" + (open ? " open" : "")}
        onClick={onClose}
        aria-hidden
      />
      {/* drawer panel */}
      <div className={"mobile-drawer" + (open ? " open" : "")} aria-label="Navigation menu">
        <div className="mobile-drawer-header">
          <Link href="/" className="brand" onClick={onClose}>
            <div className="brand-mark" />
            <span>Ghostline / Studios</span>
          </Link>
          <button type="button" className="mobile-drawer-close" onClick={onClose} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="mobile-drawer-nav" onClick={onClose}>
          {children}
        </nav>
        <div className="mobile-drawer-footer">
          <span className="live-dot" />
          <span>Live · 2026.05.08</span>
        </div>
      </div>
    </>
  );
}

/* ─── Hamburger button ───────────────────────────────────────────── */
function Hamburger({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="mobile-hamburger" onClick={onClick} aria-label="Open menu">
      <span /><span /><span />
    </button>
  );
}

/* ─── TopNav (home page) ─────────────────────────────────────────── */
export function TopNav() {
  const [active, setActive] = useState("home");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const ids = ["home", "games", "about", "news", "careers", "press"];
    const onScroll = () => {
      const y = window.scrollY + 200;
      let cur = "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const link = (id: string, label: string) => (
    <a key={id} href={`#${id}`} className={active === id ? "active" : ""}>
      {label}
    </a>
  );

  return (
    <>
      <header className="topnav">
        <Link href="/" className="brand">
          <div className="brand-mark" />
          <span>Ghostline / Studios</span>
        </Link>
        {/* desktop nav */}
        <nav className="topnav-desktop-nav">
          <a href="#home" className={active === "home" ? "active" : ""}>01 Home</a>
          <Link href="/projects">02 Projects</Link>
          {link("about", "03 Studio")}
          {link("news", "04 Devlog")}
          {link("careers", "05 Careers")}
          {link("press", "06 Press")}
        </nav>
        <div className="meta">
          <span className="live-dot" />
          <span>Live · 2026.05.08</span>
        </div>
        <Hamburger onClick={() => setDrawerOpen(true)} />
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <a href="#home">01 Home</a>
        <Link href="/projects">02 Projects</Link>
        <a href="#about">03 Studio</a>
        <a href="#news">04 Devlog</a>
        <a href="#careers">05 Careers</a>
        <a href="#press">06 Press</a>
      </MobileDrawer>
    </>
  );
}

/* ─── ProjectsIndexNav (project pages) ──────────────────────────── */
export function ProjectsIndexNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="topnav">
        <Link href="/" className="brand">
          <div className="brand-mark" />
          <span>Ghostline / Studios</span>
        </Link>
        <nav className="topnav-desktop-nav">
          <Link href="/">01 Home</Link>
          <Link href="/projects" className="active">02 Projects</Link>
          <Link href="/#about">03 Studio</Link>
          <Link href="/#news">04 Devlog</Link>
          <Link href="/#careers">05 Careers</Link>
          <Link href="/#press">06 Press</Link>
        </nav>
        <div className="meta">
          <span className="live-dot" />
          <span>Live · 2026.05.08</span>
        </div>
        <Hamburger onClick={() => setDrawerOpen(true)} />
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Link href="/">01 Home</Link>
        <Link href="/projects">02 Projects</Link>
        <Link href="/#about">03 Studio</Link>
        <Link href="/#news">04 Devlog</Link>
        <Link href="/#careers">05 Careers</Link>
        <Link href="/#press">06 Press</Link>
      </MobileDrawer>
    </>
  );
}
