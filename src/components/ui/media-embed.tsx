"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils";
import { Play } from "lucide-react";
import { TikTokStylePlayer } from "@/components/ui/tiktok-style-player";
import { sanitizeMediaUrl } from "@/content";

export type MediaEmbedProps = {
  src?: string;
  type?: "auto" | "video" | "youtube" | "image" | "tiktok";
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
  aspectRatio?: "video" | "square" | "wide" | "auto" | "portrait";
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

export function detectMediaType(src: string): "youtube" | "vimeo" | "video" | "image" | "tiktok" {
  if (!src) return "image";
  if (/tiktok\.com/i.test(src)) return "tiktok";
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

export function parseTikTokVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/i);
  return match ? match[1] : null;
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
  const cleanSrc = sanitizeMediaUrl(src);
  if (!cleanSrc) return null;

  const resolvedType = type === "auto" ? detectMediaType(cleanSrc) : type;

  const ytId = parseYouTubeId(cleanSrc);
  const playlistId = parseYouTubePlaylistId(cleanSrc);
  const tiktokId = parseTikTokVideoId(cleanSrc);

  const aspectClass =
    aspectRatio === "video"
      ? "aspect-video"
      : aspectRatio === "wide"
        ? "aspect-21/9"
        : aspectRatio === "square"
          ? "aspect-square"
          : aspectRatio === "portrait"
            ? "aspect-[9/16]"
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
      youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/${cleanSrc}?rel=0&modestbranding=1`;
    }
  }

  if (resolvedType === "tiktok") {
    // Native TikTok video page → official embed; otherwise vertical MP4 player (R2 reels)
    if (tiktokId) {
      return (
        <figure className={cn("relative w-full overflow-hidden bg-muted/40", className)}>
          <div className="relative mx-auto aspect-[9/16] w-full max-w-[320px] overflow-hidden rounded-[1.25rem] bg-black">
            <iframe
              src={`https://www.tiktok.com/embed/v2/${tiktokId}`}
              title={title || alt || "TikTok video"}
              className="absolute inset-0 size-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {(caption || title) ? (
            <figcaption className="border-t border-border/40 bg-background/95 p-3 text-xs text-muted-foreground">
              {title ? <span className="mr-1.5 font-semibold text-foreground">{title}</span> : null}
              {caption ? <span>{caption}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      );
    }

    return (
      <figure className={cn("relative w-full overflow-hidden bg-muted/40", className)}>
        <TikTokStylePlayer
          src={cleanSrc}
          poster={poster}
          title={title}
          caption={caption}
        />
      </figure>
    );
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
            src={`https://player.vimeo.com/video/${parseVimeoId(cleanSrc) || cleanSrc}?dnt=1`}
            title={title || alt || "Vimeo video"}
            className="absolute inset-0 size-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : resolvedType === "video" ? (
        <div className={cn("relative flex w-full items-center justify-center overflow-hidden bg-black", aspectClass || "aspect-video")}>
          <video
            src={cleanSrc}
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
            <source src={cleanSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div
          className={cn(
            "relative w-full overflow-hidden bg-muted",
            aspectClass || "aspect-[4/3]",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cleanSrc}
            alt={alt}
            className="size-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {(caption || title) ? (
        <figcaption className="border-t border-border/40 bg-background/95 p-3 text-xs text-muted-foreground">
          {title ? <span className="mr-1.5 font-semibold text-foreground">{title}</span> : null}
          {caption ? <span>{caption}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
