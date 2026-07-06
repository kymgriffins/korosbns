"use client";

import { Suspense } from "react";
import { LearnTabPage, useLearnSummary } from "@/components/learn/learn-tab-page";

function StoriesContent() {
  const summary = useLearnSummary();
  return <LearnTabPage listKey="stories" summary={summary} />;
}

export default function LearnStoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] animate-pulse bg-muted/20" />}>
      <StoriesContent />
    </Suspense>
  );
}
