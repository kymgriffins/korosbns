"use client";

import { Suspense } from "react";
import { LearnContentLibraryView, useLearnSummary } from "@/features/learn/views/learn-content-library-view";
import { LearnStudioLoading } from "@/features/learn/views/learn-studio-states";

function StoriesContent() {
  const summary = useLearnSummary();
  return (
    <LearnContentLibraryView
      listKey="stories"
      title="Stories"
      description="Real-world budget stories from communities across Kenya."
      summary={summary}
    />
  );
}

export default function LearnStoriesPage() {
  return (
    <Suspense fallback={<LearnStudioLoading />}>
      <StoriesContent />
    </Suspense>
  );
}
