import type { Metadata } from "next";
import { Suspense } from "react";
import { LearnPathsHome } from "@/components/learn/learn-paths-home";
import { metaDescription } from "@/utils/metadata";

const learnDescription = metaDescription(
  "Gamified Learn Hub — videos, articles, stories, official documents, learning paths, and quests for Kenya's budget.",
);

export const metadata: Metadata = {
  title: "Learn Hub — Budget, Finance Bill & Fiscal Policy | Budget Ndio Story",
  description: learnDescription,
  keywords: [
    "Kenya budget learning",
    "Finance Bill explained",
    "Appropriation Bill guide",
    "budget literacy hub Kenya",
    "fiscal policy education",
    "public finance learning paths",
  ],
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "Learn Hub — Budget, Finance Bill & Fiscal Policy | Budget Ndio Story",
    description: "Gamified learning hub with videos, articles, stories, and quests on Kenya's budget, Finance Bill, and parliamentary fiscal process.",
    url: "/learn",
  },
};

export const revalidate = 3600;

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] animate-pulse bg-muted/20" />}>
      <LearnPathsHome />
    </Suspense>
  );
}
