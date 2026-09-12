"use client";

import { useState } from "react";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { DynamicSectionRenderer } from "@/components/studio/dynamic-section-renderer";
import { bnsStudioContent } from "@/content";
import type { BnsStudioContent, PartnerPageSectionsContent } from "@/lib/cms-live-data";
import { isSectionVisible } from "@/lib/partner-page-cms";

type StudioSection = {
  id: string;
  type: string;
  [key: string]: unknown;
};

export type BNSStudioPageClientProps = {
  studioData?: BnsStudioContent;
  sectionsConfig?: PartnerPageSectionsContent | null;
};

export function BNSStudioPageClient({
  studioData,
  sectionsConfig,
}: BNSStudioPageClientProps = {}) {
  const page = studioData ?? (bnsStudioContent as BnsStudioContent);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const sections = ((page.sections ?? []) as StudioSection[]).filter((section) =>
    isSectionVisible("studio", section.id, sectionsConfig),
  );

  return (
    <article className="w-full bg-background text-foreground selection:bg-primary/30">
      <DynamicSectionRenderer
        sections={sections}
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
