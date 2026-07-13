import type { Metadata } from "next";
import { Suspense } from "react";
import { LearnPathsHome } from "@/components/learn/learn-paths-home";
import { canonicalUrl, metaDescription } from "@/utils/metadata";

export const metadata: Metadata = {
  title: "Learning Modules — Kenya Budget Literacy",
  description: metaDescription(
    "Browse civic learning modules on Kenya's public finance, budget cycle, and citizen participation.",
  ),
  alternates: { canonical: canonicalUrl("/learn/modules") },
};

export default function LearnModulesListPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] animate-pulse bg-muted/20" />}>
      <LearnPathsHome tab="learn" />
    </Suspense>
  );
}
