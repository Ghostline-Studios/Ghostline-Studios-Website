import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devlog",
  description: "Build notes, design thinking, and occasional screenshots from Ghostline Studios. No hype cycles.",
  alternates: { canonical: "https://www.ghostlinestudios.com/devlog" },
  openGraph: {
    title: "Devlog | Ghostline Studios",
    description: "Behind-the-scenes updates from Ghostline Studios.",
    images: [{ url: "/assets/ghostline-og.png" }],
  },
  twitter: { card: "summary_large_image" },
};

export default function DevlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
