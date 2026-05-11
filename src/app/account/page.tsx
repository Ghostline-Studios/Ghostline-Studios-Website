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
  created_at?: string;
};

type NewsletterPrefs = {
  subscribed: boolean;
  studio_updates: boolean;
  devlog_scraplings: boolean;
  devlog_spectral_sabre: boolean;
};

function AccountContent() {
  const { user, loading, openAuth, refreshProfile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [editDraft, setEditDraft] = useState<Profile | null>(null);
  const [newsletter, setNewsletter] = useState<NewsletterPrefs | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Password change state
  const [pwOpen, setPwOpen] = useState(false);
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      openAuth("signin");
      router.push("/");
    }
  }, [user, loading, openAuth, router]);

  useEffect(() => {
    if (loading) return;
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

  const startEdit = () => {
    setEditDraft(profile ? { ...profile } : null);
    setEditing(true);
    setSaveError("");
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditDraft(null);
    setSaveError("");
  };

  const saveProfile = async () => {
    if (!user || !editDraft) return;
    setSaving(true);
    setSaveError("");
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...editDraft,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      setSaving(false);
      setSaveError("Save failed — " + error.message);
      return;
    }
    // Keep Supabase Auth metadata in sync so the Users dashboard shows the right display name
    await supabase.auth.updateUser({
      data: {
        display_name: editDraft.display_name,
        username: editDraft.username,
      },
    });
    setSaving(false);
    setProfile(editDraft);
    setEditing(false);
    setEditDraft(null);
    setSaved(true);
    await refreshProfile();
    setTimeout(() => setSaved(false), 2500);
  };

  const changePassword = async () => {
    if (!user) return;
    if (pwNew.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    if (pwNew !== pwConfirm) { setPwError("Passwords don't match."); return; }
    setPwSaving(true);
    setPwError("");
    // Re-authenticate with current password first
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: pwCurrent,
    });
    if (signInErr) { setPwError("Current password is incorrect."); setPwSaving(false); return; }
    const { error } = await supabase.auth.updateUser({ password: pwNew });
    if (error) { setPwError(error.message); setPwSaving(false); return; }
    setPwSaving(false);
    setPwSaved(true);
    setPwCurrent(""); setPwNew(""); setPwConfirm("");
    setTimeout(() => { setPwSaved(false); setPwOpen(false); }, 2500);
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
  const draft = editDraft ?? p;

  const memberSince = p.created_at
    ? new Date(p.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : null;

  return (
    <main className="account-page">
      <div className="container">

        {/* ── Profile hero ─────────────────────────────────────── */}
        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {(p.display_name || user.email || "G").slice(0, 2).toUpperCase()}
            </div>
          </div>

          <div className="profile-identity">
            <div className="profile-meta-row">
              <span className="profile-gid-label">Ghostline ID</span>
              {memberSince && <span className="profile-since">Member since {memberSince}</span>}
            </div>
            <h1 className="profile-display-name">{p.display_name || "Ghostrunner"}</h1>
            {p.username && <p className="profile-username">@{p.username}</p>}
            {p.bio && <p className="profile-bio">{p.bio}</p>}
            {!p.bio && !editing && (
              <p className="profile-bio profile-bio-empty">No bio yet.</p>
            )}
          </div>

          <div className="profile-actions">
            {saved && <span className="profile-saved-toast">Saved</span>}
            {!editing ? (
              <button className="profile-edit-btn" onClick={startEdit}>
                Edit profile
              </button>
            ) : (
              <div className="profile-edit-controls">
                <button className="profile-cancel-btn" onClick={cancelEdit} disabled={saving}>
                  Cancel
                </button>
                <button className="profile-save-btn" onClick={saveProfile} disabled={saving}>
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Inline edit panel ────────────────────────────────── */}
        {editing && (
          <div className="profile-edit-panel glass">
            <div className="profile-edit-grid">
              <label className="auth-label">
                Display name
                <input
                  className="auth-input"
                  value={draft.display_name || ""}
                  onChange={e => setEditDraft(d => d ? { ...d, display_name: e.target.value } : d)}
                  autoFocus
                />
              </label>
              <label className="auth-label">
                Username
                <input
                  className="auth-input"
                  value={draft.username || ""}
                  onChange={e => setEditDraft(d => d ? { ...d, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") } : d)}
                />
              </label>
              <label className="auth-label" style={{ gridColumn: "1 / -1" }}>
                Bio
                <textarea
                  className="auth-input auth-textarea"
                  value={draft.bio || ""}
                  onChange={e => setEditDraft(d => d ? { ...d, bio: e.target.value } : d)}
                  rows={3}
                  placeholder="A few words about you…"
                />
              </label>
            </div>
            {saveError && (
              <p className="profile-save-error">{saveError}</p>
            )}
          </div>
        )}

        {/* ── Change password ──────────────────────────────────── */}
        <div className="pw-change-section">
          <button
            className="pw-change-toggle"
            onClick={() => { setPwOpen(v => !v); setPwError(""); }}
          >
            {pwOpen ? "Cancel" : "Change password"}
          </button>
          {pwOpen && (
            <div className="pw-change-panel glass">
              {pwSaved ? (
                <p className="pw-saved">Password updated successfully.</p>
              ) : (
                <>
                  <div className="auth-field">
                    <label className="auth-label">Current password</label>
                    <input type="password" className="auth-input" value={pwCurrent}
                      onChange={e => setPwCurrent(e.target.value)} autoComplete="current-password" />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">New password</label>
                    <input type="password" className="auth-input" value={pwNew}
                      onChange={e => setPwNew(e.target.value)} autoComplete="new-password" />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Confirm new password</label>
                    <input type="password" className="auth-input" value={pwConfirm}
                      onChange={e => setPwConfirm(e.target.value)} autoComplete="new-password" />
                  </div>
                  {pwError && <p className="profile-save-error">{pwError}</p>}
                  <button className="profile-save-btn" onClick={changePassword} disabled={pwSaving || !pwCurrent || !pwNew || !pwConfirm}>
                    {pwSaving ? "Saving…" : "Update password"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Lower sections ───────────────────────────────────── */}
        <div className="account-lower">

          {/* Wishlist */}
          <section className="account-section glass">
            <div className="account-section-head">
              <h3>Watchlist</h3>
              <span className="account-section-sub">Get notified when these launch</span>
            </div>
            <div className="wishlist-grid">
              {GAMES.map(g => (
                <button
                  key={g.id}
                  className={"wishlist-card" + (wishlist.includes(g.id) ? " active" : "")}
                  style={{ "--wish-color": g.color } as React.CSSProperties}
                  onClick={() => toggleWishlist(g.id)}
                >
                  <span className="wishlist-card-check">{wishlist.includes(g.id) ? "✓" : "+"}</span>
                  <span className="wishlist-card-name">{g.name}</span>
                  <span className="wishlist-card-status">{wishlist.includes(g.id) ? "On watchlist" : "Add to watchlist"}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Newsletter */}
          {newsletter && (
            <section className="account-section glass">
              <div className="account-section-head">
                <h3>Newsletter</h3>
                <span className="account-section-sub">Choose what lands in your inbox</span>
              </div>
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
