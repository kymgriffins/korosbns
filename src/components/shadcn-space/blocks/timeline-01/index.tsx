"use client";

import Timeline from "@/components/shadcn-space/blocks/timeline-01/timeline";
import { Badge } from "@/components/ui/badge";
import type { TimelineItemProps } from "@/components/shadcn-space/blocks/timeline-01/timeline";

export const budgetCycleTimelineData: TimelineItemProps[] = [
  {
    title: "National Treasury — Budget Formulation",
    description:
      "Treasury sets the fiscal frame for FY2026/27: MTEF ceilings to ministries and counties, then the Budget Policy Statement projecting KES 3.3T revenue and KES 4.2T expenditure under the BETA agenda.",
    date: "Aug 2025 – Feb 2026",
    image: "/images/explainer-formulation.png",
  },
  {
    title: "Citizens — Public Participation",
    description:
      "Kenyans engage through county hearings, memoranda, and civic forums. Communities and civil society submit input while the Budget and Appropriations Committee is still reviewing estimates.",
    date: "May – Jun 2026",
    image: "/images/towwnhallmay/129A3863.jpg",
  },
  {
    title: "Parliament — Review & Approval",
    description:
      "After public hearings, the National Assembly scrutinises the estimates (KES 4.82T), adopts amendments, and approves the budget — including KES 781.4B for education and KES 175.5B for health.",
    date: "Jun 2026",
    image: "/images/landing/budget-reading-2026.jpg",
  },
  {
    title: "Executive — Budget Reading & Assent",
    description:
      "Cabinet Secretary John Mbadi presents the KES 4.82T Budget Statement to Parliament. The President assents to the Finance Bill and Appropriation Act, authorising spending for the new financial year.",
    date: "Jun 2026",
    image: "/images/media/129A3905.jpg",
  },
  {
    title: "Government — Implementation Begins",
    description:
      "FY2026/27 starts on 1 July. Ministries, counties, and agencies execute Parliament-approved programmes under the national budget — tracked by citizens through BNS.",
    date: "Jul 2026",
    image: "/images/explainer-implementation.png",
  },
];

export interface TimelineBlock01Props {
  items?: TimelineItemProps[];
}

const TimelineBlock01 = ({ items = budgetCycleTimelineData }: TimelineBlock01Props) => {
  return (
    <section className="overflow-hidden border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16">
        <div className="border-x border-b border-border px-6 py-10 md:px-10 md:py-16 lg:px-16 lg:py-20">
          <div className="max-w-2xl space-y-4">
            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 font-normal"
            >
              FY 2026/27 Budget Cycle
            </Badge>
            <div className="space-y-3">
              <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
                Budget Tracker &{" "}
                <span className="font-heading italic text-primary">Allocations</span>
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Who moves Kenya&apos;s budget forward — Treasury, citizens,
                Parliament, the Executive, and implementation — in five clear stages
                for FY2026/27.
              </p>
            </div>
          </div>
        </div>
        <div className="border-r border-border md:border-x">
          <Timeline items={items} />
        </div>
        <div className="h-18 border-x border-t border-border md:h-28" />
      </div>
    </section>
  );
};

export default TimelineBlock01;
