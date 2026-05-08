"use client";

import type { ReactNode } from "react";
import { CustomCursor, EnergyField, IntroOverlay } from "./Background";

export function SiteChrome({
  children,
  showIntro = false,
}: {
  children: ReactNode;
  showIntro?: boolean;
}) {
  return (
    <>
      <CustomCursor />
      {showIntro ? <IntroOverlay /> : null}
      <EnergyField />
      <div className="bg-noise" />
      <div className="bg-vignette" />
      <div className="app">{children}</div>
    </>
  );
}
