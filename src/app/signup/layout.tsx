import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a Ghostline ID — Ghostline Studios",
  description:
    "Sign up for a Ghostline ID to access your profile, friends, and the Ghostline ecosystem.",
};

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
