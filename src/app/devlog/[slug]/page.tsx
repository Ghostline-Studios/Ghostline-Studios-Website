import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/server";
import { SiteChrome } from "@/components/SiteChrome";
import { ProjectsIndexNav, SiteFooter } from "@/components/sections";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const GAME_LABELS: Record<string, string> = {
  "scraplings": "Scraplings",
  "spectral-sabre": "Spectral Sabre",
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("devlogs")
    .select("title, excerpt, game_id")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!post) return {};
  const game = post.game_id ? ` · ${GAME_LABELS[post.game_id] ?? post.game_id}` : "";
  const description = post.excerpt ?? `A devlog post from Ghostline Studios${game}.`;
  return {
    title: `${post.title} | Ghostline Devlog`,
    description,
    openGraph: {
      title: post.title,
      description,
      images: [{ url: "/assets/ghostline-og.png" }],
    },
    twitter: { card: "summary_large_image", title: post.title, description },
  };
}

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

          <div className="devlog-post-body devlog-prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h2 className="devlog-h2">{children}</h2>,
                h2: ({ children }) => <h3 className="devlog-h3">{children}</h3>,
                h3: ({ children }) => <h4 className="devlog-h4">{children}</h4>,
                p:  ({ children }) => <p  className="devlog-para">{children}</p>,
                ul: ({ children }) => <ul className="devlog-prose-list">{children}</ul>,
                ol: ({ children }) => <ol className="devlog-prose-list">{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                a:  ({ href, children }) => (
                  <a href={href} className="devlog-prose-link" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="devlog-blockquote">{children}</blockquote>
                ),
                code: ({ children, className }) => {
                  const isBlock = className?.includes("language-");
                  return isBlock
                    ? <pre className="devlog-code-block"><code>{children}</code></pre>
                    : <code className="devlog-code-inline">{children}</code>;
                },
                strong: ({ children }) => <strong style={{ color: "white", fontWeight: 600 }}>{children}</strong>,
                hr: () => <hr className="devlog-hr" />,
              }}
            >
              {post.content ?? ""}
            </ReactMarkdown>
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
