"use client";

import type { ProgrammeBlock } from "@/content";
import { ProgrammeLandingLayout } from "@/components/programmes/programme-landing-layout";

/**
 * Programme detail entry — landing-format layout for all desks.
 * Legacy scrollytelling composers remain under `scrollytelling/` (muted, not deleted).
 */
export function ProgrammeDetail({ programme }: { programme: ProgrammeBlock }) {
  return <ProgrammeLandingLayout programme={programme} />;
}
