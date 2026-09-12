"use client";

import type { ProgrammeBlock, ProgrammeReel } from "@/content";
import {
  CIVIC_PROGRAMMES,
  PROGRAMMES_CLOSING,
} from "@/content";
import { ProgrammeLandingLayout } from "@/components/programmes/programme-landing-layout";
import type { PartnerPageSectionsContent, ProgrammesContent } from "@/lib/cms-live-data";

/**
 * Programme detail entry — landing-format layout for all desks.
 * Legacy scrollytelling composers remain under `scrollytelling/` (muted, not deleted).
 */
export function ProgrammeDetail({
  programme,
  civicProgrammes = CIVIC_PROGRAMMES,
  closing = PROGRAMMES_CLOSING,
  sectionsConfig,
  reels,
}: {
  programme: ProgrammeBlock;
  civicProgrammes?: ProgrammeBlock[];
  closing?: ProgrammesContent["closing"];
  sectionsConfig?: PartnerPageSectionsContent | null;
  reels?: ProgrammeReel[];
}) {
  return (
    <ProgrammeLandingLayout
      programme={programme}
      civicProgrammes={civicProgrammes}
      closing={closing}
      sectionsConfig={sectionsConfig}
      reels={reels}
    />
  );
}
