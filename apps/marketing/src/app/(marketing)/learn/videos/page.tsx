"use client";

import { Suspense } from "react";
import { LearnTabPage, useLearnSummary } from "@/components/learn/learn-tab-page";

function VideosContent() {
  const summary = useLearnSummary();
  return (
    <LearnTabPage
      listKey="videos"
      title="Videos"
      description="Explainers and edition companions from our YouTube channel and learning paths."
      summary={summary}
    />
  );
}

export default function LearnVideosPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] animate-pulse bg-muted/20" />}>
      <VideosContent />
    </Suspense>
  );
}
