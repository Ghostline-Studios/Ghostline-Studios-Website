import type { MetadataRoute } from "next";

const SITE_URL = "https://www.ghostlinestudios.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/account",
          "/account/",
          "/social",
          "/social/",
          "/welcome",
          "/welcome/",
          "/auth/",
          "/api/",
          "/report",
          "/report/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
