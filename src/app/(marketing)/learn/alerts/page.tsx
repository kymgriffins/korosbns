import type { Metadata } from "next";
import { Suspense } from "react";
import { LearnPathsHome } from "@/components/learn/learn-paths-home";
import { canonicalUrl, metaDescription } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Participation Alerts",
  description: metaDescription(
    "Budget participation alerts and call-to-action drafts for citizens engaging Kenya's budget process.",
  ),
  alternates: { canonical: canonicalUrl("/learn/alerts") },
};

export default function LearnAlertsPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] animate-pulse bg-muted/20" />}>
      <LearnPathsHome tab="alerts" />
    </Suspense>
  );
}
