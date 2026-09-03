"use client";

import { Suspense } from "react";
import { LearnHubVideos } from "@/components/learn-hub/LearnHubVideos";

export default function LearnVideosPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] animate-pulse bg-muted/20" />}>
      <LearnHubVideos />
    </Suspense>
  );
}
