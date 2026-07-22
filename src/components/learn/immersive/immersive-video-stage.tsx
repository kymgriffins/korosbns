"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="text-[15px] font-medium text-muted-foreground">Video for this step is coming soon.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-5 pt-2">
        <p className="text-[13px] font-medium uppercase tracking-wide text-primary">Watch</p>
        <h1 className="mt-1 text-[length:var(--immersive-title)] font-semibold tracking-tight">{stepTitle}</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {current.title}
          {videos.length > 1 ? ` · ${index + 1} of ${videos.length}` : ""}
        </p>
      </div>

      <div className="relative mx-4 mt-4 aspect-video overflow-hidden rounded-[var(--immersive-radius)] bg-black shadow-lg ring-1 ring-border/20">
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
        <div className="mt-4 flex items-center justify-center gap-4 px-4">
          <button
            type="button"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="flex size-11 items-center justify-center rounded-full bg-muted disabled:opacity-30"
            aria-label="Previous video"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex gap-2">
            {videos.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "block h-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30",
                )}
              />
            ))}
          </div>
          <button
            type="button"
            disabled={index >= videos.length - 1}
            onClick={() => setIndex((i) => Math.min(videos.length - 1, i + 1))}
            className="flex size-11 items-center justify-center rounded-full bg-muted disabled:opacity-30"
            aria-label="Next video"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
