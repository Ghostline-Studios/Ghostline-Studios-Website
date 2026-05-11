"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SiteChrome } from "@/components/SiteChrome";
import { ProjectsIndexNav, SiteFooter } from "@/components/sections";

const FILTERS = [
  { id: "",               label: "All" },
  { id: "scraplings",     label: "Scraplings" },
  { id: "spectral-sabre", label: "Spectral Sabre" },
  { id: "__studio__",     label: "Studio" },
] as const;

const GAME_LABELS: Record<string, string> = {
  "scraplings": "Scraplings",
  "spectral-sabre": "Spectral Sabre",
};

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  game_id: string | null;
  published_at: string | null;
  created_at: string;
};

export default function DevlogIndexPage() {
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    let query = supabase
      .from("devlogs")
      .select("id, title, slug, excerpt, game_id, published_at, created_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (filter === "__studio__") {
      query = query.is("game_id", null);
    } else if (filter !== "") {
      query = query.eq("game_id", filter);
    }

    query.then(({ data }) => {
      setPosts((data as Post[]) ?? []);
      setLoading(false);
    });
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = posts;

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

          {/* Filter bar */}
          <div className="devlog-filter-bar">
            {FILTERS.map(f => (
              <button
                key={f.id}
                className={"devlog-filter-btn" + (filter === f.id ? " active" : "")}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="devlog-grid">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="devlog-card devlog-card-skeleton glass" aria-hidden />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <p style={{ color: "var(--wraith)", textAlign: "center", padding: "60px 0" }}>
              No posts yet — check back soon.
            </p>
          ) : (
            <div className="devlog-grid">
              {visible.map(post => (
                <Link key={post.id} href={`/devlog/${post.slug}`} className="devlog-card glass">
                  {post.game_id && (
                    <span className="devlog-card-tag">
                      {GAME_LABELS[post.game_id] ?? post.game_id}
                    </span>
                  )}
                  {!post.game_id && (
                    <span className="devlog-card-tag studio">Studio</span>
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
