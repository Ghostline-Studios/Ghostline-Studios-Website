import type { Metadata } from "next";
import { Hero, ProjectsTeaser } from "@/components/Games";
import { JsonLd } from "@/components/JsonLd";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { NewsSection, SiteFooter, SiteNav } from "@/components/sections";
import { SiteChrome } from "@/components/SiteChrome";
import { NEWS_COLUMNS, NEWS_LIMIT, type NewsPost } from "@/lib/devlog-news";
import { createPublicClient } from "@/lib/supabase/public";

export const metadata: Metadata = {
  title: "Ghostline Studios — Mobile-First Game Studio",
  description:
    "Ghostline Studios is an independent mobile game studio building games with thought, intention, and the player at the centre. Two games in development: Scraplings and Spectral Sabre.",
  alternates: { canonical: "https://www.ghostlinestudios.com" },
  openGraph: {
    title: "Ghostline Studios — Mobile-First Game Studio",
    description:
      "Independent mobile games built with thought, intention, and the player at the centre.",
    images: [{ url: "/assets/ghostline-og.png", width: 1200, height: 630, alt: "Ghostline Studios" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghostline Studios — Mobile-First Game Studio",
    description: "Independent mobile games. Two worlds in development.",
    images: ["/assets/ghostline-og.png"],
  },
};

const SITE_URL = "https://www.ghostlinestudios.com";

// Static render, revalidated every 5 minutes (ISR).
export const revalidate = 300;

/**
 * Latest published devlogs, fetched on the server so they appear in the HTML.
 * Returns null on failure (e.g. Supabase unreachable at build time) so the
 * build does not break and NewsSection falls back to a client-side fetch.
 */
async function getNewsPosts(): Promise<NewsPost[] | null> {
  try {
    const { data, error } = await createPublicClient()
      .from("devlogs")
      .select(NEWS_COLUMNS)
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(NEWS_LIMIT);
    if (error) throw error;
    return (data ?? []) as NewsPost[];
  } catch (err) {
    console.error("[home] devlog fetch failed, falling back to client fetch", err);
    return null;
  }
}

export default async function HomePage() {
  const posts = await getNewsPosts();

  return (
    <SiteChrome showIntro>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "Ghostline Studios",
              url: SITE_URL,
              logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/ghostline-og.png` },
              contactPoint: { "@type": "ContactPoint", email: "studio@ghostlinestudios.com", contactType: "Customer Support" },
              sameAs: [],
            },
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: "Ghostline Studios",
              publisher: { "@id": `${SITE_URL}/#organization` },
            },
          ],
        }}
      />
      <RevealOnScroll />
      <SiteNav />
      <Hero />
      <ProjectsTeaser />
      <NewsSection posts={posts} />
      <SiteFooter />
    </SiteChrome>
  );
}
