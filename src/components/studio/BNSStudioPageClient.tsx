"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Play,
  ChevronDown,
} from "lucide-react";
import { StudioReelHero } from "@/components/studio/theatre/studio-reel-hero";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { DynamicSectionRenderer } from "@/components/studio/dynamic-section-renderer";
import { bnsStudioContent } from "@/content";

type StudioSection = {
  id: string;
  type: string;
  [key: string]: unknown;
};

type StudioPageData = {
  hero: {
    badge: string;
    swipeHint: string;
    reelImages?: Array<{ src: string; alt: string; caption?: string }>;
  };
  sections: StudioSection[];
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
};

const studioPage = bnsStudioContent as StudioPageData;

export function BNSStudioPageClient() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  return (
    <article className="w-full bg-background text-foreground selection:bg-primary/30">
      {/* 01 — THE ICONIC SWIPEABLE STUDIO REEL HERO */}
      <div className="relative h-[calc(100dvh-3.5rem)] md:h-[calc(100dvh-4rem)] mt-14 md:mt-16 w-full overflow-hidden bg-black text-white">
        <StudioReelHero />
        <div className="absolute bottom-6 inset-x-0 z-20 flex justify-center pointer-events-none">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-1.5 text-xs font-mono font-medium text-white/90 backdrop-blur-md animate-bounce">
            <span>{studioPage.hero.swipeHint}</span>
            <ChevronDown className="size-3.5" />
          </div>
        </div>
      </div>

      {/* 02 — CMS-DRIVEN DYNAMIC SECTIONS */}
      <DynamicSectionRenderer
        sections={studioPage.sections}
        extraProps={{
          screening: {
            isPlaying: isPlayingVideo,
            onPlay: () => setIsPlayingVideo(true),
          },
        }}
      />

      <StudioBookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
    </article>
  );
}
