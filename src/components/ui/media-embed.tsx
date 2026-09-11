"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils";
import { Play, Volume2, VolumeX, Maximize2 } from "lucide-react";

export type MediaEmbedProps = {
  src?: string;
  type?: "auto" | "video" | "youtube" | "image";
  alt?: string;
  title?: string;
  caption?: string;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  aspectRatio?: "video" | "square" | "wide" | "auto";
};

export function parseYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/,
  );
  return match ? match[1] : null;
}

export function parseVimeoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:vimeo\.com\/)(\d+)/);
  return match ? match[1] : null;
}

export function detectMediaType(src: string): "youtube" | "vimeo" | "video" | "image" {
  if (!src) return "image";
  if (parseYouTubeId(src)) return "youtube";
  if (parseVimeoId(src)) return "vimeo";

  const clean = src.split("?")[0].toLowerCase();
  if (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m4v") ||
    clean.endsWith(".ogv") ||
    src.includes(".mp4") ||
    src.includes(".webm")
  ) {
    return "video";
  }

  return "image";
}

export function MediaEmbed({
  src,
  type = "auto",
  alt = "Media content",
  title,
  caption,
  poster,
  autoPlay = false,
  controls = true,
  loop = false,
  muted = false,
  className,
  aspectRatio = "video",
}: MediaEmbedProps) {
  if (!src) return null;

  const resolvedType = type === "auto" ? detectMediaType(src) : type;

  const aspectClass =
    aspectRatio === "video"
      ? "aspect-video"
      : aspectRatio === "wide"
        ? "aspect-21/9"
        : aspectRatio === "square"
          ? "aspect-square"
          : "";

  return (
    <figure className={cn("relative w-full overflow-hidden bg-muted/40", className)}>
      {resolvedType === "youtube" ? (
        <div className={cn("relative w-full overflow-hidden bg-black", aspectClass || "aspect-video")}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${parseYouTubeId(src) || src}?rel=0&modestbranding=1`}
            title={title || alt || "YouTube video"}
            className="absolute inset-0 size-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : resolvedType === "vimeo" ? (
        <div className={cn("relative w-full overflow-hidden bg-black", aspectClass || "aspect-video")}>
          <iframe
            src={`https://player.vimeo.com/video/${parseVimeoId(src) || src}?dnt=1`}
            title={title || alt || "Vimeo video"}
            className="absolute inset-0 size-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : resolvedType === "video" ? (
        <div className={cn("relative w-full overflow-hidden bg-black flex items-center justify-center", aspectClass || "aspect-video")}>
          <video
            src={src}
            poster={poster}
            controls={controls}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            playsInline
            preload="metadata"
            className="size-full object-contain"
            aria-label={title || alt}
          >
            <source src={src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className={cn("relative w-full overflow-hidden", aspectClass || "min-h-[260px]")}>
          <img
            src={src}
            alt={alt}
            className="size-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {(caption || title) ? (
        <figcaption className="p-3 text-xs text-muted-foreground border-t border-border/40 bg-background/95">
          {title ? <span className="font-semibold text-foreground mr-1.5">{title}</span> : null}
          {caption ? <span>{caption}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
