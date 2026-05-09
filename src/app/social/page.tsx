"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { SiteChrome } from "@/components/SiteChrome";
import { ProjectsIndexNav, SiteFooter } from "@/components/sections";

type FriendProfile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
};

type Friendship = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  other: FriendProfile;
};

type SearchResult = FriendProfile & { friendshipStatus?: "none" | "pending_sent" | "pending_received" | "accepted" };

function SocialContent() {
  const { user, loading, openAuth } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [tab, setTab] = useState<"friends" | "requests" | "find">("friends");
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [incoming, setIncoming] = useState<Friendship[]>([]);
  const [outgoing, setOutgoing] = useState<Friendship[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Search
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!loading && !user) { openAuth("signin"); router.push("/"); }
  }, [user, loading, openAuth, router]);

  const loadFriendships = useCallback(async () => {
    if (!user) return;

    // Fetch all friendships involving this user
    const { data: rows } = await supabase
      .from("friendships")
      .select("id, requester_id, addressee_id, status, created_at")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .neq("status", "declined");

    if (!rows) { setDataLoading(false); return; }

    // Collect all other-party IDs
    const otherIds = [...new Set(rows.map(r => r.requester_id === user.id ? r.addressee_id : r.requester_id))];

    // Fetch their profiles
    const profileMap: Record<string, FriendProfile> = {};
    if (otherIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .in("id", otherIds);
      (profiles ?? []).forEach((p: FriendProfile) => { profileMap[p.id] = p; });
    }

    const enrich = (r: typeof rows[0]): Friendship => ({
      ...r,
      status: r.status as Friendship["status"],
      other: profileMap[r.requester_id === user.id ? r.addressee_id : r.requester_id] ?? { id: "", username: null, display_name: null, avatar_url: null },
    });

    setFriends(rows.filter(r => r.status === "accepted").map(enrich));
    setIncoming(rows.filter(r => r.status === "pending" && r.addressee_id === user.id).map(enrich));
    setOutgoing(rows.filter(r => r.status === "pending" && r.requester_id === user.id).map(enrich));
    setDataLoading(false);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loading && user) loadFriendships();
  }, [user, loading, loadFriendships]);

  // Realtime updates
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("social-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "friendships" }, loadFriendships)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, loadFriendships]); // eslint-disable-line react-hooks/exhaustive-deps

  // Search with debounce
  useEffect(() => {
    if (!query.trim() || !user) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      const { data: results } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .ilike("username", `%${query.trim()}%`)
        .neq("id", user.id)
        .limit(8);

      if (!results) { setSearching(false); return; }

      // Annotate with friendship status
      const allFriendships = [...friends, ...incoming, ...outgoing];
      const annotated: SearchResult[] = (results as FriendProfile[]).map(p => {
        const existing = allFriendships.find(f => f.other.id === p.id);
        let friendshipStatus: SearchResult["friendshipStatus"] = "none";
        if (existing) {
          if (existing.status === "accepted") friendshipStatus = "accepted";
          else if (existing.requester_id === user.id) friendshipStatus = "pending_sent";
          else friendshipStatus = "pending_received";
        }
        return { ...p, friendshipStatus };
      });

      setSearchResults(annotated);
      setSearching(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [query, user, friends, incoming, outgoing]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendRequest = async (addresseeId: string) => {
    if (!user) return;
    await supabase.from("friendships").insert({ requester_id: user.id, addressee_id: addresseeId });
    loadFriendships();
    setSearchResults(prev => prev.map(r => r.id === addresseeId ? { ...r, friendshipStatus: "pending_sent" } : r));
  };

  const acceptRequest = async (friendshipId: string) => {
    await supabase.from("friendships").update({ status: "accepted", updated_at: new Date().toISOString() }).eq("id", friendshipId);
    loadFriendships();
  };

  const declineRequest = async (friendshipId: string) => {
    await supabase.from("friendships").update({ status: "declined", updated_at: new Date().toISOString() }).eq("id", friendshipId);
    loadFriendships();
  };

  const removeFriend = async (friendshipId: string) => {
    await supabase.from("friendships").delete().eq("id", friendshipId);
    loadFriendships();
  };

  if (loading || dataLoading) {
    return <div style={{ padding: "180px 0", textAlign: "center", color: "var(--wraith)" }}>Loading…</div>;
  }
  if (!user) return null;

  const Avatar = ({ p, size = 44 }: { p: FriendProfile; size?: number }) => (
    <div className="social-avatar" style={{ width: size, height: size, fontSize: size * 0.35 }}>
      {(p.display_name || p.username || "?").slice(0, 2).toUpperCase()}
    </div>
  );

  return (
    <main className="social-page">
      <div className="container">

        <div className="social-header">
          <h1 className="social-title">Friends</h1>
          <p className="social-sub">Connect with other Ghostline players.</p>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={"admin-tab" + (tab === "friends" ? " active" : "")} onClick={() => setTab("friends")}>
            Friends {friends.length > 0 && <span className="tab-count">{friends.length}</span>}
          </button>
          <button className={"admin-tab" + (tab === "requests" ? " active" : "")} onClick={() => setTab("requests")}>
            Requests {incoming.length > 0 && <span className="tab-count tab-count-alert">{incoming.length}</span>}
          </button>
          <button className={"admin-tab" + (tab === "find" ? " active" : "")} onClick={() => setTab("find")}>
            Find people
          </button>
        </div>

        {/* ── Friends ─────────────────────────────────────────── */}
        {tab === "friends" && (
          <section className="social-section glass">
            {friends.length === 0 ? (
              <div className="social-empty">
                <p>No friends yet.</p>
                <button className="profile-save-btn" onClick={() => setTab("find")}>Find people</button>
              </div>
            ) : (
              <div className="social-list">
                {friends.map(f => (
                  <div key={f.id} className="social-row">
                    <Avatar p={f.other} />
                    <div className="social-row-info">
                      <span className="social-row-name">{f.other.display_name || f.other.username || "Unknown"}</span>
                      {f.other.username && <span className="social-row-username">@{f.other.username}</span>}
                    </div>
                    <button className="admin-action-btn danger" onClick={() => removeFriend(f.id)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Requests ────────────────────────────────────────── */}
        {tab === "requests" && (
          <div className="social-requests-wrap">
            {incoming.length > 0 && (
              <section className="social-section glass">
                <h3 className="social-section-title">Incoming</h3>
                <div className="social-list">
                  {incoming.map(f => (
                    <div key={f.id} className="social-row">
                      <Avatar p={f.other} />
                      <div className="social-row-info">
                        <span className="social-row-name">{f.other.display_name || f.other.username || "Unknown"}</span>
                        {f.other.username && <span className="social-row-username">@{f.other.username}</span>}
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="profile-save-btn" style={{ fontSize: 12, padding: "7px 16px" }} onClick={() => acceptRequest(f.id)}>
                          Accept
                        </button>
                        <button className="admin-action-btn danger" onClick={() => declineRequest(f.id)}>
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {outgoing.length > 0 && (
              <section className="social-section glass">
                <h3 className="social-section-title">Sent</h3>
                <div className="social-list">
                  {outgoing.map(f => (
                    <div key={f.id} className="social-row">
                      <Avatar p={f.other} />
                      <div className="social-row-info">
                        <span className="social-row-name">{f.other.display_name || f.other.username || "Unknown"}</span>
                        {f.other.username && <span className="social-row-username">@{f.other.username}</span>}
                      </div>
                      <span className="social-pending-label">Pending</span>
                      <button className="admin-action-btn" onClick={() => removeFriend(f.id)}>Cancel</button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incoming.length === 0 && outgoing.length === 0 && (
              <section className="social-section glass">
                <div className="social-empty">
                  <p>No pending requests.</p>
                </div>
              </section>
            )}
          </div>
        )}

        {/* ── Find people ─────────────────────────────────────── */}
        {tab === "find" && (
          <section className="social-section glass">
            <div className="social-search-wrap">
              <div className="social-search-field">
                <span className="social-search-icon">@</span>
                <input
                  className="auth-input social-search-input"
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search by username…"
                  autoFocus
                />
              </div>
            </div>

            {searching && <p style={{ color: "var(--wraith)", padding: "16px 0", fontSize: 13 }}>Searching…</p>}

            {!searching && query && searchResults.length === 0 && (
              <p style={{ color: "var(--wraith)", padding: "16px 0", fontSize: 14 }}>No players found for &ldquo;{query}&rdquo;</p>
            )}

            {searchResults.length > 0 && (
              <div className="social-list" style={{ marginTop: 20 }}>
                {searchResults.map(p => (
                  <div key={p.id} className="social-row">
                    <Avatar p={p} />
                    <div className="social-row-info">
                      <span className="social-row-name">{p.display_name || p.username || "Unknown"}</span>
                      {p.username && <span className="social-row-username">@{p.username}</span>}
                    </div>
                    {p.friendshipStatus === "accepted" && (
                      <span className="social-friend-label">Friends</span>
                    )}
                    {p.friendshipStatus === "pending_sent" && (
                      <span className="social-pending-label">Requested</span>
                    )}
                    {p.friendshipStatus === "pending_received" && (
                      <button className="profile-save-btn" style={{ fontSize: 12, padding: "7px 16px" }}
                        onClick={() => { const f = incoming.find(f => f.other.id === p.id); if (f) acceptRequest(f.id); }}>
                        Accept
                      </button>
                    )}
                    {p.friendshipStatus === "none" && (
                      <button className="profile-edit-btn" onClick={() => sendRequest(p.id)}>
                        Add friend
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!query && (
              <p style={{ color: "var(--wraith)", fontSize: 14, padding: "8px 0" }}>
                Type a username to search for players.
              </p>
            )}
          </section>
        )}

      </div>
    </main>
  );
}

export default function SocialPage() {
  return (
    <SiteChrome>
      <ProjectsIndexNav />
      <SocialContent />
      <SiteFooter />
    </SiteChrome>
  );
}
