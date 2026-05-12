"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { GhostlineIDButton } from "@/components/auth/GhostlineIDButton";
import { useAuth } from "@/context/AuthContext";
import type { DevlogRow } from "@/lib/supabase/database.types";

export function AboutSection() {
  return (
    <section id="about" data-screen-label="03 About">
      <div className="container">
        <div className="section-head">
          <div>
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
              <h4>Story before system</h4>
              <p>Every loop, mechanic and menu starts with a question: what is this making the player feel?</p>
            </div>
            <div className="pillar">
              <h4>Mobile, taken seriously</h4>
              <p>
                The phone is not a lesser screen. It&apos;s a more intimate one. We design for thumbs, attention, and
                quiet moments.
              </p>
            </div>
            <div className="pillar">
              <h4>No dark patterns</h4>
              <p>No timers that nag, no energy that runs out, no FOMO event drops. If a system needs guilt to function, we cut it.</p>
            </div>
            <div className="pillar">
              <h4>Ship the strange</h4>
              <p>If it has been done before, it has been done. We&apos;d rather be slightly wrong about something new.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


const GAME_TAG: Record<string, { label: string; cls: string }> = {
  "scraplings":    { label: "SCRAPLINGS", cls: "scrap" },
  "spectral-sabre":{ label: "SABRE",      cls: "sabre" },
};

export function NewsSection() {
  const [posts, setPosts] = useState<DevlogRow[]>([]);

  useEffect(() => {
    import("@/lib/supabase/client").then(({ createClient }) => {
      createClient()
        .from("devlogs")
        .select("id, title, slug, game_id, published_at, created_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(6)
        .then(({ data }) => { if (data) setPosts(data as DevlogRow[]); });
    });
  }, []);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" }).toUpperCase().replace(" ", " · ");

  return (
    <section id="news" data-screen-label="04 News">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Devlog &amp; dispatches.</h2>
          </div>
          <div className="meta-block">
            <strong>Updated regularly</strong>
            Build notes, design rambling, occasional
            <br />
            screenshots, no hype cycles.
          </div>
        </div>
        <div className="devlog-list">
          {posts.map(p => {
            const tag = p.game_id ? GAME_TAG[p.game_id] : { label: "STUDIO", cls: "studio" };
            const date = fmtDate(p.published_at ?? p.created_at);
            return (
              <Link key={p.id} className="devlog-item" href={`/devlog/${p.slug}`}>
                <div className="date">{date}</div>
                <div className={"tag " + tag.cls}>{tag.label}</div>
                <h4>{p.title}</h4>
                <div className="arrow-cell">Read</div>
              </Link>
            );
          })}
          {posts.length === 0 && [0,1,2,3,4,5].map(i => (
            <div key={i} className="devlog-item devlog-item-skeleton" aria-hidden />
          ))}
        </div>
        <div style={{ marginTop: 32 }}>
          <Link href="/devlog" className="btn secondary"><span>All devlogs</span></Link>
        </div>
      </div>
    </section>
  );
}

const FUTURE_AREAS = [
  "Unity / mobile engineering",
  "Technical art & mobile VFX",
  "Game & systems design",
  "Narrative & world-building",
  "Community & player experience",
];

export function CareersSection() {
  return (
    <section id="careers" data-screen-label="05 Careers">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Join the line.</h2>
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
            <h3>We are not actively recruiting right now.</h3>
            <p>
              Ghostline Studios is early and intentional. We grow when the work genuinely requires it, not before.
              When we do hire, we hire slowly, treat people well, and make the work the thing.
            </p>
            <p style={{ marginTop: 16, color: "var(--wraith)" }}>
              Future opportunities may include areas such as Unity engineering, technical art, systems design,
              narrative, and community. If that sounds like you, introduce yourself.
            </p>
            <div style={{ marginTop: 28 }}>
              <a className="btn primary" href="mailto:studio@ghostlinestudios.com">
                <span>Introduce yourself</span>
              </a>
            </div>
          </div>
          <div className="role-list">
            {FUTURE_AREAS.map((area, i) => (
              <div key={i} className="role-item role-item-future">
                <div>
                  <h4>{area}</h4>
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
  );
}

export function NewsletterSignup() {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "ok" | "err">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // TODO: wire to real mailing list
    setStatus("ok");
    setEmail("");
  };

  return (
    <form className="signup" onSubmit={submit} aria-label="Newsletter signup">
      {status === "ok" ? (
        <p style={{ color: "var(--spectral)", fontSize: 14, margin: 0 }}>
          You&apos;re on the list — we&apos;ll be in touch when there&apos;s something real to say.
        </p>
      ) : (
        <>
          <input
            type="email"
            placeholder="you@somewhere.net"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <button type="submit">Join</button>
        </>
      )}
    </form>
  );
}

export function PressContactSection() {
  return (
    <section id="press" data-screen-label="06 Press & Contact">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>Press &amp; contact.</h2>
          </div>
          <div className="meta-block">
            <strong>
              For press, partners,
              <br />
              and friendly humans
            </strong>
            <a href="mailto:press@ghostlinestudios.com">press@ghostlinestudios.com</a>
            <br />
            <a href="mailto:studio@ghostlinestudios.com">studio@ghostlinestudios.com</a>
          </div>
        </div>

        <div className="press-wrap">
          <div className="press-card glass">
            <h3>Press assets &amp; fact sheet.</h3>
            <p>
              Studio boilerplate, project summaries, and key facts for Ghostline Studios, Scraplings, and Spectral Sabre.
              Logos and screenshot packs are in preparation.
            </p>
            <div className="links">
              <Link className="link-row" href="/press">
                <span>Full press page</span>
                <span className="size">ghostlinestudios.com/press</span>
              </Link>
              <div className="link-row link-row-coming">
                <span>Studio logos &amp; artwork</span>
                <span className="size">Coming soon</span>
              </div>
              <div className="link-row link-row-coming">
                <span>Scraplings — screenshots</span>
                <span className="size">Coming soon</span>
              </div>
              <div className="link-row link-row-coming">
                <span>Spectral Sabre — screenshots</span>
                <span className="size">Coming soon</span>
              </div>
            </div>
          </div>

          <div className="press-card glass" id="contact">
            <h3>One letter, every now and then.</h3>
            <p>No marketing. No countdown timers. Build notes, occasional screenshots, the rare announcement when we have something real to say.</p>
            <NewsletterSignup />
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
                — Contact
              </div>
              <div className="links">
                <a className="link-row" href="mailto:studio@ghostlinestudios.com">
                  <span>General enquiries</span>
                  <span className="size">studio@ghostlinestudios.com</span>
                </a>
                <a className="link-row" href="mailto:press@ghostlinestudios.com">
                  <span>Press &amp; media</span>
                  <span className="size">press@ghostlinestudios.com</span>
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
              <li><Link href="/scraplings">Scraplings</Link></li>
              <li><Link href="/spectral-sabre">Spectral Sabre</Link></li>
              <li><Link href="/projects">All projects</Link></li>
            </ul>
          </div>
          <div className="col">
            <h5>Studio</h5>
            <ul>
              <li><Link href="/studio">Manifesto</Link></li>
              <li><Link href="/devlog">Devlog</Link></li>
              <li><Link href="/press">Press</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/account">Ghostline ID</Link></li>
            </ul>
          </div>
          <div className="col">
            <h5>Legal &amp; contact</h5>
            <ul>
              <li><a href="mailto:studio@ghostlinestudios.com">studio@ghostlinestudios.com</a></li>
              <li><a href="mailto:press@ghostlinestudios.com">press@ghostlinestudios.com</a></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Use</Link></li>
              <li><Link href="/cookies">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Ghostline Studios — All ghosts reserved</span>
          <span>Built quietly</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Mobile drawer ─────────────────────────────────────────────── */
/* ─── Ghostline ID section inside mobile drawer ──────────────── */
function MobileGhostlineID({ onClose }: { onClose: () => void }) {
  const { user, profile, loading, openAuth, signOut } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <div className="drawer-gid-section">
        <button
          className="drawer-gid-signin"
          onClick={() => { openAuth("signin"); onClose(); }}
        >
          <span className="gid-mark" />
          <span>Sign in with Ghostline ID</span>
        </button>
      </div>
    );
  }

  const displayLabel = profile?.display_name || user.email || "G";
  const initials = displayLabel.slice(0, 2).toUpperCase();

  return (
    <div className="drawer-gid-section">
      <div className="drawer-gid-user">
        <div className="drawer-gid-avatar">{initials}</div>
        <div className="drawer-gid-info">
          <span className="drawer-gid-name">{profile?.display_name || user.email}</span>
          {profile?.username && (
            <span className="drawer-gid-username">@{profile.username}</span>
          )}
        </div>
      </div>
      <div className="drawer-gid-links">
        <Link href="/account" className="drawer-gid-link" onClick={onClose}>Profile</Link>
        <Link href="/social" className="drawer-gid-link" onClick={onClose}>Friends</Link>
        {profile?.is_admin && (
          <Link href="/admin" className="drawer-gid-link" onClick={onClose}>Admin</Link>
        )}
        <button
          className="drawer-gid-link drawer-gid-signout"
          onClick={() => { signOut(); onClose(); }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

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
        <MobileGhostlineID onClose={onClose} />
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

/* ─── Shared site navigation (all pages) ────────────────────────── */
const NAV_LINKS = [
  { href: "/",         label: "Home",     match: (p: string) => p === "/" },
  { href: "/projects", label: "Projects", match: (p: string) => p.startsWith("/projects") || p.startsWith("/scraplings") || p.startsWith("/spectral-sabre") },
  { href: "/studio",   label: "Studio",   match: (p: string) => p.startsWith("/studio") },
  { href: "/devlog",   label: "Devlog",   match: (p: string) => p.startsWith("/devlog") },
  { href: "/careers",  label: "Careers",  match: (p: string) => p.startsWith("/careers") },
  { href: "/press",    label: "Press",    match: (p: string) => p.startsWith("/press") },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="topnav">
        <Link href="/" className="brand">
          <div className="brand-mark" />
          <span>Ghostline / Studios</span>
        </Link>
        <nav className="topnav-desktop-nav" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label, match }) => (
            <Link
              key={href}
              href={href}
              className={match(pathname) ? "active" : ""}
              aria-current={match(pathname) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="meta" aria-hidden>
          <span className="live-dot" />
          <span>Live</span>
        </div>
        <GhostlineIDButton />
        <Hamburger onClick={() => setDrawerOpen(true)} />
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {NAV_LINKS.map(({ href, label, match }) => (
          <Link
            key={href}
            href={href}
            className={match(pathname) ? "active" : ""}
            aria-current={match(pathname) ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </MobileDrawer>
    </>
  );
}

/* Keep old names as aliases so existing imports continue to work */
export const TopNav = SiteNav;
export const ProjectsIndexNav = SiteNav;
