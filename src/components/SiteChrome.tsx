"use client";

import type { ReactNode } from "react";
import { CustomCursor, EnergyField, IntroOverlay } from "./Background";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { ChatProvider } from "@/context/ChatContext";
import { ChatOverlay } from "@/components/chat/ChatOverlay";
import { NotificationCenter } from "@/components/chat/NotificationCenter";

export function SiteChrome({
  children,
  showIntro = false,
}: {
  children: ReactNode;
  showIntro?: boolean;
}) {
  return (
    <AuthProvider>
      <ChatProvider>
        <CustomCursor />
        {showIntro ? <IntroOverlay /> : null}
        <EnergyField />
        <div className="bg-noise" />
        <div className="bg-vignette" />
        <div className="app">{children}</div>
        <AuthModal />
        <ChatOverlay />
        <NotificationCenter />
      </ChatProvider>
    </AuthProvider>
  );
}
