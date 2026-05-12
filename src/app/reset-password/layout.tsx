import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password — Ghostline Studios",
  description: "Reset your Ghostline ID password.",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
