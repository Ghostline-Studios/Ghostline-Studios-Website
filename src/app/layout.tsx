import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://www.ghostlinestudios.com";
const OG_IMAGE = `${SITE_URL}/assets/ghostline-og.png`;

export const viewport: Viewport = {
  themeColor: "#0b0c12",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ghostline Studios — Worlds in motion",
    template: "%s | Ghostline Studios",
  },
  description:
    "Ghostline Studios — a small studio building mobile games with thought, intention, and the player at the center.",
  openGraph: {
    type: "website",
    siteName: "Ghostline Studios",
    title: "Ghostline Studios — Worlds in motion",
    description:
      "Interactive mobile games with deep story — built with thought, intention, and the player's experience at the center.",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Ghostline Studios" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghostline Studios — Worlds in motion",
    description: "Interactive mobile games with deep story.",
    images: [OG_IMAGE],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
