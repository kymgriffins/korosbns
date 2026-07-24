"use client";

import Link from "next/link";
import Timeline from "@/components/shadcn-space/blocks/timeline-01/timeline";
import { Button } from "@/components/ui/button";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import type { TimelineItemProps } from "@/components/shadcn-space/blocks/timeline-01/timeline";
import { timelineContent } from "@/content";

export const budgetCycleTimelineData: TimelineItemProps[] = timelineContent.items;

export interface TimelineBlock01Props {
  items?: TimelineItemProps[];
}

const TimelineBlock01 = ({ items = budgetCycleTimelineData }: TimelineBlock01Props) => {
  return (
    <LandingSection className="overflow-hidden">
      <LandingContent>
        <div className="border-x border-b border-border px-6 py-10 md:px-10 md:py-16 lg:px-16 lg:py-20">
          <LandingSectionHeader
            eyebrow={timelineContent.eyebrow}
            title={
              <>
                {timelineContent.titleBefore}{" "}
                <span className={T.highlight}>{timelineContent.titleHighlight}</span>
              </>
            }
            description={timelineContent.description}
            className="mb-0 md:mb-0"
          />
        </div>
        <div className="border-r border-border md:border-x">
          <Timeline items={items} />
        </div>
        <div className="border-x border-border px-6 py-10 md:px-10 md:py-14 lg:px-16 lg:py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <p className={T.body}>{timelineContent.footerBody}</p>
            <Button asChild className={T.btnPrimary}>
              <Link href={timelineContent.footerCta.href}>{timelineContent.footerCta.label}</Link>
            </Button>
          </div>
        </div>
        <div className="h-18 border-x border-t border-border md:h-28" />
      </LandingContent>
    </LandingSection>
  );
};

export default TimelineBlock01;
