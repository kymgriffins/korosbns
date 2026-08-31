"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Play, Clapperboard } from "lucide-react";
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
        <p className="text-sm font-mono text-muted-foreground">Video for this lesson is coming soon.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-4 space-y-5">
      {/* Specimen Header */}
      <div className="space-y-2 border-b border-foreground/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            VIDEO SPECIMEN
          </span>
          <span className="text-xs font-mono text-muted-foreground">
            Part {index + 1} of {videos.length}
          </span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          {stepTitle}
        </h1>
        <p className="text-xs sm:text-sm font-mono text-muted-foreground">
          Now Playing: <strong className="text-foreground">{current.title}</strong>
        </p>
      </div>

      {/* 16:9 Video Frame */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl border border-foreground/10">
        <iframe
          key={current.videoId}
          src={buildEmbedUrl(current.videoId)}
          title={current.title}
          className="absolute inset-0 size-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Playlist Navigation Strip */}
      {videos.length > 1 ? (
        <div className="space-y-2 pt-2">
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Playlist Series ({videos.length} Episodes)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {videos.map((vid, i) => (
              <button
                key={vid.videoId}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all cursor-pointer",
                  i === index
                    ? "border-primary/50 bg-primary/10 text-foreground shadow-xs"
                    : "border-foreground/10 bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold",
                    i === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <span className="truncate text-xs font-mono font-semibold">{vid.title}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
