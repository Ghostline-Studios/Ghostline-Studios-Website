import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devlog",
  description: "Behind-the-scenes updates on Ghostline Studios games.",
  openGraph: {
    title: "Ghostline Devlog",
    description: "Behind-the-scenes updates from Ghostline Studios.",
    images: [{ url: "/assets/ghostline-og.png" }],
  },
};

export default function DevlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
