"use client";

import { StudioReelHero } from "@/components/studio/theatre/studio-reel-hero";
import { StudioSiteFooter, StudioSiteNav } from "@/components/studio/theatre/studio-site-nav";
import { StudioViewportLock } from "@/components/studio/theatre/studio-viewport-lock";

export function BNSStudioPageClient() {
  return (
    <>
      <StudioViewportLock active />
      <div className="studio-reel-viewport">
        <StudioSiteNav variant="overlay" active="home" />
        <StudioReelHero />
        <StudioSiteFooter variant="overlay" />
      </div>
    </>
  );
}
