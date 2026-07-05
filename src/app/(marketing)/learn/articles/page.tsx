"use client";

import { Suspense } from "react";
import { LearnContentLibraryView, useLearnSummary } from "@/features/learn/views/learn-content-library-view";
import { LearnStudioLoading } from "@/features/learn/views/learn-studio-states";

function ArticlesContent() {
  const summary = useLearnSummary();
  return (
    <LearnContentLibraryView
      listKey="articles"
      title="Articles"
      description="Standalone budget explainers outside structured learning paths."
      summary={summary}
    />
  );
}

export default function LearnArticlesPage() {
  return (
    <Suspense fallback={<LearnStudioLoading />}>
      <ArticlesContent />
    </Suspense>
  );
}
