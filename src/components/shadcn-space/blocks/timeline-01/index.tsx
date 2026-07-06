"use client";

import Timeline from "@/components/shadcn-space/blocks/timeline-01/timeline";
import { Badge } from "@/components/ui/badge";
import type { TimelineItemProps } from "@/components/shadcn-space/blocks/timeline-01/timeline";

export const budgetCycleTimelineData: TimelineItemProps[] = [
  {
    title: "MTEF Budget Circular Issued",
    description:
      "Treasury issued spending ceilings to all MDAs for FY2026/27. Sector Working Groups began reviewing bids against strategic priorities under BETA.",
    date: "Aug 30, 2025",
    image: "/images/explainer-formulation.png",
  },
  {
    title: "BPS 2026 Tabled in Parliament",
    description:
      "Cabinet Secretary John Mbadi submitted the Budget Policy Statement — theme: Consolidating Gains Under BETA. Projected revenue KES 3.3T, expenditure KES 4.2T.",
    date: "Feb 15, 2026",
    image: "/images/media/129A3905.jpg",
  },
  {
    title: "BPS Approved by Parliament",
    description:
      "National Assembly approved BPS 2026, setting sector spending ceilings. County equitable share fixed at KES 420B after MP amendments.",
    date: "Mar 10, 2026",
    image: "/images/media/129A4039.jpg",
  },
  {
    title: "Budget Estimates Published",
    description:
      "Detailed revenue and expenditure estimates tabled at KES 4.82 trillion — Education KES 781.4B, Security KES 308.6B, Health KES 175.5B, Infrastructure KES 230B.",
    date: "Apr 30, 2026",
    image: "/images/explainer-approval.png",
  },
  {
    title: "Budget & Committee Review",
    description:
      "Budget and Appropriations Committee hearings ran across counties. Civil society submitted memoranda on sector allocations during public participation windows.",
    date: "May–Jun 2026",
    image: "/images/towwnhallmay/129A3863.jpg",
  },
  {
    title: "Parliament Approves Budget",
    description:
      "National Assembly approved FY2026/27 expenditure estimates at KES 4.82T, prioritising health and education allocations ahead of the June budget reading.",
    date: "Jun 2, 2026",
    image: "/images/towwnhallmay/129A4056.jpg",
  },
  {
    title: "CS Mbadi Presents KES 4.82T Budget",
    description:
      "Budget Statement delivered under theme Sustaining BETA for Resilient and Inclusive Growth. Revenue KES 3.63T, deficit KES 1.15T (5.5% of GDP), debt interest KES 1.2T.",
    date: "Jun 11, 2026",
    image: "/images/landing/budget-reading-2026.jpg",
  },
  {
    title: "FY 2026/27 Begins",
    description:
      "New financial year starts under Parliament-approved estimates. Government transitions to FY2026/27 spending across ministries, counties, and agencies.",
    date: "Jul 1, 2026",
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
                Tracking Kenya&apos;s FY2026/27 budget from formulation through
                implementation — with verified milestones and sector allocations.
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
