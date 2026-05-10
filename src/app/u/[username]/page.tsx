import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SiteChrome } from "@/components/SiteChrome";
import { ProjectsIndexNav, SiteFooter } from "@/components/sections";

export const dynamic = "force-dynamic";

const GAME_LABELS: Record<string, string> = {
  "scraplings": "Scraplings",
  "spectral-sabre": "Spectral Sabre",
};

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name, bio, avatar_url, created_at")
    .eq("username", username)
    .single();

  if (!profile) notFound();

  const { data: wishlist } = await supabase
    .from("wishlists")
    .select("game_id")
    .eq("user_id", profile.id);

  const initials = (profile.display_name || profile.username || "?").slice(0, 2).toUpperCase();
  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : null;

  return (
    <SiteChrome>
      <ProjectsIndexNav />
      <main className="public-profile-page">
        <div className="container">
          <div className="public-profile-card glass">
            <div className="public-profile-avatar">{initials}</div>
            <div className="public-profile-info">
              <div className="public-profile-meta">
                <span className="profile-gid-label">Ghostline ID</span>
                {memberSince && <span className="profile-since">Member since {memberSince}</span>}
              </div>
              <h1 className="public-profile-name">{profile.display_name || profile.username}</h1>
              <p className="public-profile-username">@{profile.username}</p>
              {profile.bio && <p className="public-profile-bio">{profile.bio}</p>}
            </div>
          </div>

          {wishlist && wishlist.length > 0 && (
            <section className="public-profile-section">
              <h3 className="public-profile-section-title">Watching</h3>
              <div className="public-profile-games">
                {wishlist.map((w: { game_id: string }) => (
                  <span key={w.game_id} className="public-profile-game-tag">
                    {GAME_LABELS[w.game_id] ?? w.game_id}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <SiteFooter />
    </SiteChrome>
  );
}
