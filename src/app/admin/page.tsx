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

// Access is already server-gated by middleware — no client-side admin check needed.
function AdminContent() {
  const { user, loading } = useAuth();
  const supabase = createClient();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [wishlistCounts, setWishlistCounts] = useState<Record<string, number>>({});
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading || !user) return;

    Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("wishlists").select("game_id"),
    ]).then(([{ data: p }, { data: w }]) => {
      if (p) setProfiles(p as Profile[]);
      if (w) {
        const counts: Record<string, number> = {};
        (w as WishlistRow[]).forEach(r => {
          counts[r.game_id] = (counts[r.game_id] || 0) + 1;
        });
        setWishlistCounts(counts);
      }
      setDataLoading(false);
    });
  }, [user, loading]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <div style={{ paddingTop: 40, marginBottom: 48 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "var(--phantom-glow)",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Admin
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 300 }}>
            Ghostline Dashboard
          </h1>
        </div>

        <div className="admin-stats">
          <div className="admin-stat glass">
            <div className="admin-stat-num">{profiles.length}</div>
            <div className="admin-stat-label">Registered accounts</div>
          </div>
          {Object.entries(wishlistCounts).map(([gameId, count]) => (
            <div key={gameId} className="admin-stat glass">
              <div className="admin-stat-num">{count}</div>
              <div className="admin-stat-label">
                {gameId === "scraplings" ? "Scraplings" : "Spectral Sabre"} wishlists
              </div>
            </div>
          ))}
        </div>

        <section className="account-card glass" style={{ marginTop: 24 }}>
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
                      <div style={{ fontWeight: 400, color: "white" }}>
                        {p.display_name || "—"}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--wraith)", fontFamily: "var(--font-mono)" }}>
                        @{p.username || "—"}
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: "var(--wraith)", fontFamily: "var(--font-mono)" }}>
                      {new Date(p.created_at).toLocaleDateString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
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
