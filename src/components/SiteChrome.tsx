"use client";

import type { ReactNode } from "react";
import { CustomCursor, EnergyField, IntroOverlay } from "./Background";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

export function SiteChrome({
  children,
  showIntro = false,
}: {
  children: ReactNode;
  showIntro?: boolean;
}) {
  return (
    <AuthProvider>
      <CustomCursor />
      {showIntro ? <IntroOverlay /> : null}
      <EnergyField />
      <div className="bg-noise" />
      <div className="bg-vignette" />
      <div className="app">{children}</div>
      <AuthModal />
    </AuthProvider>
  );
}
