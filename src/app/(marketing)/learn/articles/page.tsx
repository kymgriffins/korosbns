"use client";

import { Suspense } from "react";
import { LearnTabPage, useLearnSummary } from "@/components/learn/learn-tab-page";

function ArticlesContent() {
  const summary = useLearnSummary();
  return (
    <LearnTabPage
      listKey="articles"
      title="Articles"
      description="Standalone budget explainers outside structured learning paths."
      summary={summary}
    />
  );
}

export default function LearnArticlesPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] animate-pulse bg-muted/20" />}>
      <ArticlesContent />
    </Suspense>
  );
}
