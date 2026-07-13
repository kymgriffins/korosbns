import type { Metadata } from "next";
import { Suspense } from "react";
import { LearnPathsHome } from "@/components/learn/learn-paths-home";
import { canonicalUrl, metaDescription } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Learning Profile",
  description: metaDescription(
    "Your Budget Ndio Story learning profile — progress, badges, streak, and account settings.",
  ),
  alternates: { canonical: canonicalUrl("/learn/profile") },
};

export default function LearnProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] animate-pulse bg-muted/20" />}>
      <LearnPathsHome tab="profile" />
    </Suspense>
  );
}
