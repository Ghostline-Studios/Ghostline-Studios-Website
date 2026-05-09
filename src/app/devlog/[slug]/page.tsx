import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteChrome } from "@/components/SiteChrome";
import { ProjectsIndexNav, SiteFooter } from "@/components/sections";

export const dynamic = "force-dynamic";

const GAME_LABELS: Record<string, string> = {
  "scraplings": "Scraplings",
  "spectral-sabre": "Spectral Sabre",
};

export default async function DevlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("devlogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) notFound();

  // Render markdown as plain paragraphs (no extra deps)
  const paragraphs = (post.content ?? "").split(/\n{2,}/).filter(Boolean) as string[];

  return (
    <SiteChrome>
      <ProjectsIndexNav />
      <main className="devlog-post-page">
        <div className="container">
          <div className="devlog-post-header">
            <Link href="/devlog" className="devlog-back">← All devlogs</Link>
            <div className="devlog-post-meta">
              {post.game_id && (
                <span className="devlog-card-tag">
                  {GAME_LABELS[post.game_id] ?? post.game_id}
                </span>
              )}
              <span className="devlog-post-date">
                {new Date(post.published_at ?? post.created_at).toLocaleDateString("en-GB", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </span>
            </div>
            <h1 className="devlog-post-title">{post.title}</h1>
            {post.excerpt && <p className="devlog-post-excerpt">{post.excerpt}</p>}
          </div>

          <div className="devlog-post-body">
            {paragraphs.map((para: string, i: number) => {
              if (para.startsWith("# "))    return <h2 key={i} className="devlog-h2">{para.slice(2)}</h2>;
              if (para.startsWith("## "))   return <h3 key={i} className="devlog-h3">{para.slice(3)}</h3>;
              if (para.startsWith("### "))  return <h4 key={i} className="devlog-h4">{para.slice(4)}</h4>;
              if (para.startsWith("- ") || para.startsWith("* ")) {
                const items = para.split("\n").filter((l: string) => l.match(/^[-*] /));
                return <ul key={i} className="devlog-list">{items.map((item: string, j: number) => <li key={j}>{item.replace(/^[-*] /, "")}</li>)}</ul>;
              }
              return <p key={i} className="devlog-para">{para}</p>;
            })}
          </div>

          <div className="devlog-post-footer">
            <Link href="/devlog" className="devlog-back">← Back to devlogs</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </SiteChrome>
  );
}
