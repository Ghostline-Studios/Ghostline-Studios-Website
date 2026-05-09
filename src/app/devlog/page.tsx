import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteChrome } from "@/components/SiteChrome";
import { ProjectsIndexNav, SiteFooter } from "@/components/sections";

export const dynamic = "force-dynamic";

const GAME_LABELS: Record<string, string> = {
  "scraplings": "Scraplings",
  "spectral-sabre": "Spectral Sabre",
};

export default async function DevlogIndexPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("devlogs")
    .select("id, title, slug, excerpt, game_id, published_at, created_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  return (
    <SiteChrome>
      <ProjectsIndexNav />
      <main className="devlog-index-page">
        <div className="container">
          <div className="devlog-index-header">
            <div className="devlog-eyebrow">Devlog</div>
            <h1 className="devlog-index-title">From the studio</h1>
            <p className="devlog-index-sub">
              Behind-the-scenes updates on our games and the people making them.
            </p>
          </div>

          {!posts || posts.length === 0 ? (
            <p style={{ color: "var(--wraith)", textAlign: "center", padding: "60px 0" }}>
              No posts yet — check back soon.
            </p>
          ) : (
            <div className="devlog-grid">
              {posts.map(post => (
                <Link key={post.id} href={`/devlog/${post.slug}`} className="devlog-card glass">
                  {post.game_id && (
                    <span className="devlog-card-tag">
                      {GAME_LABELS[post.game_id] ?? post.game_id}
                    </span>
                  )}
                  <h2 className="devlog-card-title">{post.title}</h2>
                  {post.excerpt && (
                    <p className="devlog-card-excerpt">{post.excerpt}</p>
                  )}
                  <span className="devlog-card-date">
                    {new Date(post.published_at ?? post.created_at).toLocaleDateString("en-GB", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </SiteChrome>
  );
}
