"use client";

import Link from "next/link";
import Timeline from "@/components/shadcn-space/blocks/timeline-01/timeline";
import { Button } from "@/components/ui/button";
import { Routes } from "@/constants/routes";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
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
    image: "/images/treasury/budget-reading-2026.jpg",
  },
  {
    title: "Executive — Budget Reading & Assent",
    description:
      "Cabinet Secretary John Mbadi presents the KES 4.82T Budget Statement to Parliament. The President assents to the Finance Bill and Appropriation Act, authorising spending for the new financial year.",
    date: "Jun 2026",
    image: "/images/treasury/budget-reading-2026.jpg",
  },
  {
    title: "Government — Implementation Begins",
    description:
      "FY2026/27 starts on 1 July under the Treasury’s Budget Sasa ni Delivery push — ministries, counties, and agencies turn approved allocations into services citizens can track through BNS.",
    date: "Jul 2026",
    image: "/images/treasury/budget%20sasa%20ni%20delivery.jpg",
  },
];

export interface TimelineBlock01Props {
  items?: TimelineItemProps[];
}

const TimelineBlock01 = ({ items = budgetCycleTimelineData }: TimelineBlock01Props) => {
  return (
    <LandingSection className="overflow-hidden">
      <LandingContent>
        <div className="border-x border-b border-border px-6 py-10 md:px-10 md:py-16 lg:px-16 lg:py-20">
          <LandingSectionHeader
            eyebrow="FY 2026/27 Budget Cycle"
            title={
              <>
                Budget Tracker &{" "}
                <span className={T.highlight}>Allocations</span>
              </>
            }
            description="Who moves Kenya&apos;s budget forward — Treasury, citizens, Parliament, the Executive, and implementation — in five clear stages for FY2026/27."
            className="mb-0 md:mb-0"
          />
        </div>
        <div className="border-r border-border md:border-x">
          <Timeline items={items} />
        </div>
        <div className="border-x border-border px-6 py-10 md:px-10 md:py-14 lg:px-16 lg:py-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <p className={T.body}>
              We&apos;ll take you through the full budget-making process — from
              Treasury formulation to implementation — and show you how you, as a
              Mwananchi, can take part at every stage.
            </p>
            <Button asChild className={T.btnPrimary}>
              <Link href={Routes.Learn}>Explore the learning hub</Link>
            </Button>
          </div>
        </div>
        <div className="h-18 border-x border-t border-border md:h-28" />
      </LandingContent>
    </LandingSection>
  );
};

export default TimelineBlock01;
