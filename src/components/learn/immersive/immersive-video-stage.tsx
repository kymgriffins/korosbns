"use client";

import { useState } from "react";
import { cn } from "@/utils";

function buildEmbedUrl(videoId: string) {
  const origin =
    typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : "";
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&origin=${origin}`;
}

export function ImmersiveVideoStage({
  videos,
  stepTitle,
}: {
  videos: { videoId: string; title: string }[];
  stepTitle: string;
}) {
  const [index, setIndex] = useState(0);
  const current = videos[index];

  if (!videos.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <p className="text-sm text-muted-foreground">Video for this lesson is coming soon.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-4 space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-bold leading-tight text-foreground">{stepTitle}</h1>
        <p className="text-sm text-muted-foreground">{current.title}</p>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
        <iframe
          key={current.videoId}
          src={buildEmbedUrl(current.videoId)}
          title={current.title}
          className="absolute inset-0 size-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {videos.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {videos.map((vid, i) => (
            <button
              key={vid.videoId}
              type="button"
              onClick={() => setIndex(i)}
              className={cn(
                "shrink-0 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
                i === index
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border/60 text-muted-foreground",
              )}
            >
              Part {i + 1}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
