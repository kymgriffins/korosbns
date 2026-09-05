"use client";

import React from "react";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { StickyStackedCycle, type StickyCycleItem } from "@/components/motion";
import type { TimelineItemProps } from "@/components/shadcn-space/blocks/timeline-01/timeline";
import { timelineContent } from "@/content";

export const budgetCycleTimelineData: TimelineItemProps[] = timelineContent.items;

export interface TimelineBlock01Props {
  items?: TimelineItemProps[];
}

const TimelineBlock01 = ({ items = budgetCycleTimelineData }: TimelineBlock01Props) => {
  const cycleItems: StickyCycleItem[] = items.map((item, index) => {
    const isLast = index === items.length - 1;
    const isDelivery = isLast || item.title.toLowerCase().includes("delivery") || item.title.toLowerCase().includes("implementation");

    return {
      id: `stage-0${index + 1}`,
      step: `0${index + 1}`,
      title: item.title,
      description: item.description,
      date: item.date,
      badge: isDelivery
        ? "Ground Delivery & Oversight"
        : index === 0
          ? "Treasury Formulation"
          : index === 1
            ? "Citizen Barazas"
            : index === 2
              ? "Parliament Review"
              : "Executive Assent",
      image: item.image,
      imageAlt: item.title,
      stat: isDelivery
        ? {
            value: "KSh 4.82T",
            label: "Verified allocation-to-service execution across 47 counties",
          }
        : undefined,
      cta: isDelivery
        ? {
            label: "Track Live Delivery",
            href: "/reports",
          }
        : undefined,
    };
  });

  return (
    <section className="py-20 md:py-28 lg:py-36 bg-background border-y border-border/40 overflow-hidden">
      <div className={SECTION_SHELL_INNER}>
        <StickyStackedCycle
          eyebrow={timelineContent.eyebrow}
          title={
            <>
              {timelineContent.titleBefore}{" "}
              <span className={T.highlight}>{timelineContent.titleHighlight}</span>
            </>
          }
          description={timelineContent.description}
          items={cycleItems}
          cta={{
            label: timelineContent.footerCta.label,
            href: timelineContent.footerCta.href,
          }}
        />
      </div>
    </section>
  );
};

export default TimelineBlock01;

