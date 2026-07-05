"use client";

import { Suspense } from "react";
import { LearnContentLibraryView, useLearnSummary } from "@/features/learn/views/learn-content-library-view";
import { LearnStudioLoading } from "@/features/learn/views/learn-studio-states";

function VideosContent() {
  const summary = useLearnSummary();
  return (
    <LearnContentLibraryView
      listKey="videos"
      title="Videos"
      description="Budget explainers, lectures, and civic education from across Kenya."
      summary={summary}
    />
  );
}

export default function LearnVideosPage() {
  return (
    <Suspense fallback={<LearnStudioLoading />}>
      <VideosContent />
    </Suspense>
  );
}
