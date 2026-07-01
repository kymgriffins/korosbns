"use client";

import { Suspense } from "react";
import { VideoGallery } from "@/components/learn/video-gallery";

export default function LearnVideosPage() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] animate-pulse bg-muted/20" />}>
      <VideoGallery />
    </Suspense>
  );
}
