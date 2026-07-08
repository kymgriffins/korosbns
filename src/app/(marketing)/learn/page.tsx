import type { Metadata } from "next";
import { Suspense } from "react";
import { LearnHubEntry } from "@/components/budget-hub/pages/learn-hub-entry";
import { HubSkeleton } from "@/components/budget-hub/states/hub-skeleton";
import { metaDescription, canonicalUrl } from "@/utils/metadata";

const learnDescription = metaDescription(
  "Budget Hub — Kenya FY2026/27 budget sector-by-sector breakdown. Education KES 781.4B, Health KES 175.5B, Infrastructure KES 230B, Agriculture KES 106.8B, Housing KES 135.8B. Editorial civic learning with videos, articles, and quests.",
);

export const metadata: Metadata = {
  title: "Budget Hub — FY2026/27 Budget Sector Breakdown | Budget Ndio Story",
  description: learnDescription,
  keywords: [
    "Kenya budget learning",
    "FY2026/27 budget breakdown",
    "Kenya education budget 781 billion",
    "Kenya health budget allocations",
    "Finance Bill explained",
    "Appropriation Bill guide",
    "budget literacy hub Kenya",
    "fiscal policy education",
    "public finance learning paths",
    "Kenya budget sector by sector",
  ],
  alternates: { canonical: canonicalUrl("/learn") },
  openGraph: {
    title: "Budget Hub — FY2026/27 Kenya Budget Sector Breakdown | Budget Ndio Story",
    description: "Complete FY2026/27 budget breakdown: Education KES 781.4B, Health KES 175.5B, Security KES 308.6B, Infrastructure KES 230B, Agriculture KES 106.8B, Housing KES 135.8B. Learn through interactive modules and quizzes.",
    url: canonicalUrl("/learn"),
    images: [{ url: "/logo.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Budget Hub — FY2026/27 Kenya Budget Sector Breakdown | Budget Ndio Story",
    description: "Education KES 781.4B, Health KES 175.5B, Security KES 308.6B, Infrastructure KES 230B. Interactive budget learning with videos, articles, and quests.",
    images: ["/logo.svg"],
  },
};

export const revalidate = 3600;

export default function LearnPage() {
  return (
    <Suspense fallback={<HubSkeleton className="p-8" />}>
      <LearnHubEntry />
    </Suspense>
  );
}
