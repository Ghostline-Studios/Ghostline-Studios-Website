import type { Metadata } from "next";
import { Hero, ProjectsTeaser } from "@/components/Games";
import { JsonLd } from "@/components/JsonLd";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { NewsSection, SiteFooter, SiteNav } from "@/components/sections";
import { SiteChrome } from "@/components/SiteChrome";

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

export default function HomePage() {
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
      <NewsSection />
      <SiteFooter />
    </SiteChrome>
  );
}
