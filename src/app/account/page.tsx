"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { SiteChrome } from "@/components/SiteChrome";
import { ProjectsIndexNav, SiteFooter } from "@/components/sections";

const GAMES = [
  { id: "scraplings", name: "Scraplings", color: "var(--spectral)" },
  { id: "spectral-sabre", name: "Spectral Sabre", color: "var(--phantom-glow)" },
];

type Profile = {
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
};

type NewsletterPrefs = {
  subscribed: boolean;
  studio_updates: boolean;
  devlog_scraplings: boolean;
  devlog_spectral_sabre: boolean;
};

// Auth logic lives here — inside the SiteChrome/AuthProvider tree
function AccountContent() {
  const { user, loading, openAuth, refreshProfile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [newsletter, setNewsletter] = useState<NewsletterPrefs | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      openAuth("signin");
      router.push("/");
    }
  }, [user, loading, openAuth, router]);

  useEffect(() => {
    if (loading) return; // wait for auth to resolve
    if (!user) { setDataLoading(false); return; }

    const fallbackUsername = (user.email ?? "ghost").split("@")[0].replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
    const fallbackDisplay =
      user.user_metadata?.display_name ||
      user.user_metadata?.full_name ||
      fallbackUsername;

    Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase.from("newsletter_preferences").select("*").eq("user_id", user.id).single(),
      supabase.from("wishlists").select("game_id").eq("user_id", user.id),
    ]).then(async ([{ data: p }, { data: n }, { data: w }]) => {
      // Auto-create profile if trigger didn't fire
      if (!p) {
        const { data: created } = await supabase
          .from("profiles")
          .upsert({ id: user.id, username: fallbackUsername, display_name: fallbackDisplay })
          .select()
          .single();
        setProfile((created as Profile) ?? { username: fallbackUsername, display_name: fallbackDisplay, avatar_url: null, bio: null });
      } else {
        setProfile(p as Profile);
      }

      // Auto-create newsletter prefs if missing
      if (!n) {
        const { data: created } = await supabase
          .from("newsletter_preferences")
          .upsert({ user_id: user.id })
          .select()
          .single();
        setNewsletter((created as NewsletterPrefs) ?? { subscribed: false, studio_updates: false, devlog_scraplings: false, devlog_spectral_sabre: false });
      } else {
        setNewsletter(n as NewsletterPrefs);
      }

      if (w) setWishlist((w as { game_id: string }[]).map(r => r.game_id));
      setDataLoading(false);
    }).catch(() => setDataLoading(false));
  }, [user, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveProfile = async () => {
    if (!user || !profile) return;
    setSaving(true);
    setSaveError("");
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...profile,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) {
      setSaveError("Save failed — " + error.message);
    } else {
      setSaved(true);
      await refreshProfile();
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const saveNewsletter = async (prefs: NewsletterPrefs) => {
    if (!user) return;
    setNewsletter(prefs);
    await supabase.from("newsletter_preferences").upsert({
      user_id: user.id,
      ...prefs,
      updated_at: new Date().toISOString(),
    });
  };

  const toggleWishlist = async (gameId: string) => {
    if (!user) return;
    if (wishlist.includes(gameId)) {
      setWishlist(w => w.filter(id => id !== gameId));
      await supabase.from("wishlists").delete().eq("user_id", user.id).eq("game_id", gameId);
    } else {
      setWishlist(w => [...w, gameId]);
      await supabase.from("wishlists").insert({ user_id: user.id, game_id: gameId });
    }
  };

  if (loading || dataLoading) {
    return (
      <div style={{ padding: "180px 0", textAlign: "center", color: "var(--wraith)" }}>
        Loading…
      </div>
    );
  }

  if (!user) return null;

  const p = profile ?? { username: "", display_name: "", avatar_url: null, bio: null };

  return (
    <main className="account-page">
      <div className="container">
        <div className="account-header">
          <div className="account-avatar">
            {(p.display_name || user.email || "G").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="account-name">{p.display_name || "Ghostrunner"}</h1>
            <p className="account-id">Ghostline ID · {user.email}</p>
          </div>
        </div>

        <div className="account-grid">
          <section className="account-card glass">
            <h3>Profile</h3>
            <div className="account-fields">
              <label className="auth-label">
                Display name
                <input
                  className="auth-input"
                  value={p.display_name || ""}
                  onChange={e => setProfile(prev => prev ? { ...prev, display_name: e.target.value } : { ...p, display_name: e.target.value })}
                />
              </label>
              <label className="auth-label">
                Username
                <input
                  className="auth-input"
                  value={p.username || ""}
                  onChange={e => setProfile(prev => prev ? { ...prev, username: e.target.value } : { ...p, username: e.target.value })}
                />
              </label>
              <label className="auth-label">
                Bio
                <textarea
                  className="auth-input auth-textarea"
                  value={p.bio || ""}
                  onChange={e => setProfile(prev => prev ? { ...prev, bio: e.target.value } : { ...p, bio: e.target.value })}
                  rows={3}
                  placeholder="A few words about you…"
                />
              </label>
            </div>
            <button className="auth-submit" onClick={saveProfile} disabled={saving}>
              {saved ? "Saved" : saving ? "Saving…" : "Save profile"}
            </button>
            {saveError && (
              <p style={{ color: "var(--ember)", fontSize: 13, marginTop: 8 }}>{saveError}</p>
            )}
          </section>

          <section className="account-card glass">
            <h3>Game Wishlist</h3>
            <p style={{ color: "var(--wraith)", fontSize: 14, marginBottom: 20 }}>
              Get notified when these launch.
            </p>
            <div className="account-wishlist">
              {GAMES.map(g => (
                <button
                  key={g.id}
                  className={"account-wish-btn" + (wishlist.includes(g.id) ? " active" : "")}
                  style={{ "--wish-color": g.color } as React.CSSProperties}
                  onClick={() => toggleWishlist(g.id)}
                >
                  <span className="wish-check">{wishlist.includes(g.id) ? "✓" : "+"}</span>
                  {g.name}
                </button>
              ))}
            </div>
          </section>

          {newsletter && (
            <section className="account-card glass">
              <h3>Newsletter</h3>
              <div className="account-toggles">
                {(
                  [
                    ["subscribed", "All newsletters"],
                    ["studio_updates", "Studio updates"],
                    ["devlog_scraplings", "Scraplings devlog"],
                    ["devlog_spectral_sabre", "Spectral Sabre devlog"],
                  ] as [keyof NewsletterPrefs, string][]
                ).map(([key, label]) => (
                  <label key={key} className="account-toggle">
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={newsletter[key] as boolean}
                      onChange={e => saveNewsletter({ ...newsletter, [key]: e.target.checked })}
                    />
                    <span className="toggle-track" />
                  </label>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <SiteChrome>
      <ProjectsIndexNav />
      <AccountContent />
      <SiteFooter />
    </SiteChrome>
  );
}
