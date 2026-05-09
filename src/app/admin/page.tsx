"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { SiteChrome } from "@/components/SiteChrome";
import { ProjectsIndexNav, SiteFooter } from "@/components/sections";

type Profile = {
  id: string;
  username: string;
  display_name: string;
  is_admin: boolean;
  created_at: string;
};

type WishlistRow = { game_id: string };

type Devlog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  game_id: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
};

const GAMES = [
  { id: "", label: "Studio update" },
  { id: "scraplings", label: "Scraplings" },
  { id: "spectral-sabre", label: "Spectral Sabre" },
];

const toSlug = (title: string) =>
  title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

const emptyDraft = (): Partial<Devlog> => ({
  title: "", slug: "", excerpt: "", content: "", game_id: "", is_published: false,
});

function AdminContent() {
  const { user, loading } = useAuth();
  const supabase = createClient();

  const [tab, setTab] = useState<"accounts" | "devlogs">("accounts");

  // Accounts
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [wishlistCounts, setWishlistCounts] = useState<Record<string, number>>({});

  // Devlogs
  const [devlogs, setDevlogs] = useState<Devlog[]>([]);
  const [editingDevlog, setEditingDevlog] = useState<Partial<Devlog> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [devlogSaving, setDevlogSaving] = useState(false);
  const [devlogError, setDevlogError] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading || !user) return;

    Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("wishlists").select("game_id"),
      supabase.from("devlogs").select("*").order("created_at", { ascending: false }),
    ]).then(([{ data: p }, { data: w }, { data: d }]) => {
      if (p) setProfiles(p as Profile[]);
      if (w) {
        const counts: Record<string, number> = {};
        (w as WishlistRow[]).forEach(r => { counts[r.game_id] = (counts[r.game_id] || 0) + 1; });
        setWishlistCounts(counts);
      }
      if (d) setDevlogs(d as Devlog[]);
      setDataLoading(false);
    });
  }, [user, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-slug from title when creating
  useEffect(() => {
    if (!isNew || slugEdited || !editingDevlog?.title) return;
    setEditingDevlog(d => d ? { ...d, slug: toSlug(d.title ?? "") } : d);
  }, [editingDevlog?.title, isNew, slugEdited]);

  const openNew = () => {
    setEditingDevlog(emptyDraft());
    setIsNew(true);
    setSlugEdited(false);
    setDevlogError("");
    setTab("devlogs");
  };

  const openEdit = (devlog: Devlog) => {
    setEditingDevlog({ ...devlog });
    setIsNew(false);
    setSlugEdited(true);
    setDevlogError("");
  };

  const cancelEdit = () => { setEditingDevlog(null); setDevlogError(""); };

  const saveDevlog = async () => {
    if (!editingDevlog?.title || !editingDevlog.slug) {
      setDevlogError("Title and slug are required.");
      return;
    }
    setDevlogSaving(true);
    setDevlogError("");

    const payload = {
      ...editingDevlog,
      game_id: editingDevlog.game_id || null,
      published_at: editingDevlog.is_published && !editingDevlog.published_at
        ? new Date().toISOString()
        : editingDevlog.published_at ?? null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = isNew
      ? await supabase.from("devlogs").insert(payload).select().single()
      : await supabase.from("devlogs").update(payload).eq("id", editingDevlog.id ?? "").select().single();

    setDevlogSaving(false);
    if (error) { setDevlogError(error.message); return; }
    if (data) {
      setDevlogs(prev =>
        isNew ? [data as Devlog, ...prev] : prev.map(d => d.id === data.id ? data as Devlog : d)
      );
    }
    setEditingDevlog(null);
  };

  const deleteDevlog = async (id: string) => {
    if (!confirm("Delete this devlog? This cannot be undone.")) return;
    await supabase.from("devlogs").delete().eq("id", id);
    setDevlogs(prev => prev.filter(d => d.id !== id));
    if (editingDevlog?.id === id) setEditingDevlog(null);
  };

  if (loading || dataLoading) {
    return (
      <div style={{ padding: "180px 0", textAlign: "center", color: "var(--wraith)" }}>
        Loading…
      </div>
    );
  }

  return (
    <main className="account-page">
      <div className="container">

        {/* Header */}
        <div className="admin-header">
          <div>
            <div className="admin-eyebrow">Admin</div>
            <h1 className="admin-title">Ghostline Dashboard</h1>
          </div>
          <button className="profile-save-btn" onClick={openNew}>
            + New devlog
          </button>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat glass">
            <div className="admin-stat-num">{profiles.length}</div>
            <div className="admin-stat-label">Registered accounts</div>
          </div>
          <div className="admin-stat glass">
            <div className="admin-stat-num">{devlogs.length}</div>
            <div className="admin-stat-label">Devlogs total</div>
          </div>
          <div className="admin-stat glass">
            <div className="admin-stat-num">{devlogs.filter(d => d.is_published).length}</div>
            <div className="admin-stat-label">Published</div>
          </div>
          {Object.entries(wishlistCounts).map(([gameId, count]) => (
            <div key={gameId} className="admin-stat glass">
              <div className="admin-stat-num">{count}</div>
              <div className="admin-stat-label">
                {gameId === "scraplings" ? "Scraplings" : "Spectral Sabre"} watchlist
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={"admin-tab" + (tab === "accounts" ? " active" : "")} onClick={() => setTab("accounts")}>
            Accounts
          </button>
          <button className={"admin-tab" + (tab === "devlogs" ? " active" : "")} onClick={() => setTab("devlogs")}>
            Devlogs
          </button>
        </div>

        {/* ── Devlog editor ───────────────────────────────────── */}
        {editingDevlog && (
          <div className="devlog-editor glass">
            <div className="devlog-editor-head">
              <h3>{isNew ? "New devlog" : "Edit devlog"}</h3>
              <button className="profile-cancel-btn" onClick={cancelEdit}>Cancel</button>
            </div>

            <div className="devlog-editor-grid">
              <label className="auth-label" style={{ gridColumn: "1 / -1" }}>
                Title
                <input
                  className="auth-input"
                  value={editingDevlog.title || ""}
                  onChange={e => setEditingDevlog(d => d ? { ...d, title: e.target.value } : d)}
                  placeholder="Devlog title…"
                  autoFocus
                />
              </label>

              <label className="auth-label">
                Slug
                <input
                  className="auth-input"
                  value={editingDevlog.slug || ""}
                  onChange={e => { setSlugEdited(true); setEditingDevlog(d => d ? { ...d, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") } : d); }}
                  placeholder="url-slug"
                />
              </label>

              <label className="auth-label">
                Game
                <select
                  className="auth-input"
                  value={editingDevlog.game_id || ""}
                  onChange={e => setEditingDevlog(d => d ? { ...d, game_id: e.target.value } : d)}
                >
                  {GAMES.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}
                </select>
              </label>

              <label className="auth-label" style={{ gridColumn: "1 / -1" }}>
                Excerpt
                <textarea
                  className="auth-input auth-textarea"
                  rows={2}
                  value={editingDevlog.excerpt || ""}
                  onChange={e => setEditingDevlog(d => d ? { ...d, excerpt: e.target.value } : d)}
                  placeholder="Short summary shown in listings…"
                />
              </label>

              <label className="auth-label" style={{ gridColumn: "1 / -1" }}>
                Content <span style={{ color: "var(--wraith)", fontSize: 11, marginLeft: 6 }}>Markdown supported</span>
                <textarea
                  className="auth-input auth-textarea devlog-content-input"
                  rows={16}
                  value={editingDevlog.content || ""}
                  onChange={e => setEditingDevlog(d => d ? { ...d, content: e.target.value } : d)}
                  placeholder="Write your devlog in Markdown…"
                />
              </label>

              <label className="devlog-publish-toggle">
                <input
                  type="checkbox"
                  checked={editingDevlog.is_published || false}
                  onChange={e => setEditingDevlog(d => d ? { ...d, is_published: e.target.checked } : d)}
                />
                <span className="toggle-track" />
                <span>Published</span>
              </label>
            </div>

            {devlogError && <p className="profile-save-error">{devlogError}</p>}

            <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
              <button className="profile-save-btn" onClick={saveDevlog} disabled={devlogSaving}>
                {devlogSaving ? "Saving…" : isNew ? "Publish devlog" : "Save changes"}
              </button>
              <button className="profile-cancel-btn" onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        )}

        {/* ── Accounts tab ────────────────────────────────────── */}
        {tab === "accounts" && (
          <section className="admin-section glass">
            <h3>Accounts</h3>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>User</th>
                    <th>Joined</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="admin-avatar">
                          {(p.display_name || p.username || "?").slice(0, 2).toUpperCase()}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 400, color: "white" }}>{p.display_name || "—"}</div>
                        <div style={{ fontSize: 12, color: "var(--wraith)", fontFamily: "var(--font-mono)" }}>
                          @{p.username || "—"}
                        </div>
                      </td>
                      <td style={{ fontSize: 12, color: "var(--wraith)", fontFamily: "var(--font-mono)" }}>
                        {new Date(p.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td>
                        <span className={"admin-badge" + (p.is_admin ? " admin" : "")}>
                          {p.is_admin ? "Admin" : "Member"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Devlogs tab ─────────────────────────────────────── */}
        {tab === "devlogs" && (
          <section className="admin-section glass">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ margin: 0 }}>Devlogs</h3>
              <button className="profile-save-btn" style={{ fontSize: 12 }} onClick={openNew}>+ New</button>
            </div>
            {devlogs.length === 0 ? (
              <p style={{ color: "var(--wraith)", textAlign: "center", padding: "32px 0" }}>No devlogs yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Game</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {devlogs.map(d => (
                      <tr key={d.id}>
                        <td>
                          <span style={{ color: "white", fontWeight: 400 }}>{d.title}</span>
                          <div style={{ fontSize: 11, color: "var(--wraith)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                            /{d.slug}
                          </div>
                        </td>
                        <td style={{ fontSize: 12, color: "var(--wraith)" }}>
                          {GAMES.find(g => g.id === (d.game_id ?? ""))?.label ?? "Studio"}
                        </td>
                        <td>
                          <span className={"admin-badge" + (d.is_published ? " published" : "")}>
                            {d.is_published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td style={{ fontSize: 12, color: "var(--wraith)", fontFamily: "var(--font-mono)" }}>
                          {new Date(d.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button className="admin-action-btn" onClick={() => openEdit(d)}>Edit</button>
                            <button className="admin-action-btn danger" onClick={() => deleteDevlog(d.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

      </div>
    </main>
  );
}

export default function AdminPage() {
  return (
    <SiteChrome>
      <ProjectsIndexNav />
      <AdminContent />
      <SiteFooter />
    </SiteChrome>
  );
}
