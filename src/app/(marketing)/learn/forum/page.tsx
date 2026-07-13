import type { Metadata } from "next";
import { Suspense } from "react";
import { LearnPathsHome } from "@/components/learn/learn-paths-home";
import { canonicalUrl, metaDescription } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Community Forum",
  description: metaDescription(
    "Discuss Kenya's budget, Finance Bill, and public finance with other citizens on Budget Ndio Story.",
  ),
  alternates: { canonical: canonicalUrl("/learn/forum") },
};

export default function LearnForumPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] animate-pulse bg-muted/20" />}>
      <LearnPathsHome tab="forum" />
    </Suspense>
  );
}
