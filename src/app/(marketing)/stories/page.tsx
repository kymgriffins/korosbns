"use client";

import { Suspense } from "react";
import { LearnHubStories } from "@/components/learn-hub/LearnHubStories";

export default function StoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] animate-pulse bg-muted/20" />}>
      <LearnHubStories />
    </Suspense>
  );
}
