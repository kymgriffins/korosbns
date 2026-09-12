"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils";
import { Play } from "lucide-react";

export type MediaEmbedProps = {
  src?: string;
  type?: "auto" | "video" | "youtube" | "image";
  alt?: string;
  title?: string;
  caption?: string;
  poster?: string;
  useYoutubeThumbnail?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  aspectRatio?: "video" | "square" | "wide" | "auto";
};

export const DEFAULT_MEDIA_FALLBACK_THUMBNAIL = "/images/media/129A4039.jpg";

export function parseYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/,
  );
  return match ? match[1] : null;
}

export function parseYouTubePlaylistId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

export function parseVimeoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:vimeo\.com\/)(\d+)/);
  return match ? match[1] : null;
}

export function getYouTubeThumbnail(
  urlOrId: string,
  quality: "maxres" | "hq" | "mq" = "hq",
): string | null {
  const id = parseYouTubeId(urlOrId) || (urlOrId.length === 11 ? urlOrId : null);
  if (!id) return null;
  const filename =
    quality === "maxres"
      ? "maxresdefault.jpg"
      : quality === "hq"
        ? "hqdefault.jpg"
        : "mqdefault.jpg";
  return `https://img.youtube.com/vi/${id}/${filename}`;
}

export function resolveMediaThumbnail(params: {
  src?: string;
  url?: string;
  thumbnail?: string;
  useYoutubeThumbnail?: boolean;
  fallback?: string;
}): string {
  const targetUrl = params.url || params.src || "";
  const ytId = parseYouTubeId(targetUrl);
  const fallback = params.fallback || DEFAULT_MEDIA_FALLBACK_THUMBNAIL;

  // 1. Custom provided thumbnail takes first priority
  if (params.thumbnail && params.thumbnail.trim() !== "") {
    return params.thumbnail;
  }

  // 2. If explicit YouTube thumbnail requested and ID found
  if (params.useYoutubeThumbnail && ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }

  // 3. If it's a YouTube URL and no custom thumbnail given, default to YouTube thumbnail
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }

  // 4. Safe fallback
  return fallback;
}

export function detectMediaType(src: string): "youtube" | "vimeo" | "video" | "image" {
  if (!src) return "image";
  if (parseYouTubeId(src) || parseYouTubePlaylistId(src)) return "youtube";
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
  useYoutubeThumbnail = false,
  autoPlay = false,
  controls = true,
  loop = false,
  muted = false,
  className,
  aspectRatio = "video",
}: MediaEmbedProps) {
  if (!src) return null;

  const resolvedType = type === "auto" ? detectMediaType(src) : type;

  const ytId = parseYouTubeId(src);
  const playlistId = parseYouTubePlaylistId(src);

  const aspectClass =
    aspectRatio === "video"
      ? "aspect-video"
      : aspectRatio === "wide"
        ? "aspect-21/9"
        : aspectRatio === "square"
          ? "aspect-square"
          : "";

  let youtubeEmbedUrl = "";
  if (resolvedType === "youtube") {
    if (ytId && playlistId) {
      youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?list=${playlistId}&rel=0&modestbranding=1`;
    } else if (playlistId) {
      youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`;
    } else if (ytId) {
      youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?rel=0&modestbranding=1`;
    } else {
      youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/${src}?rel=0&modestbranding=1`;
    }
  }

  return (
    <figure className={cn("relative w-full overflow-hidden bg-muted/40", className)}>
      {resolvedType === "youtube" ? (
        <div className={cn("relative w-full overflow-hidden bg-black", aspectClass || "aspect-video")}>
          <iframe
            src={youtubeEmbedUrl}
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
            poster={poster || (useYoutubeThumbnail && ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : undefined)}
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
