"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Heart,
  Play,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  Music2,
} from "lucide-react";
import { Marquee } from "@/ui/marquee";
import { cn } from "@/utils";
import type { TikTokLiveFeedResponse, TikTokOembedResult } from "@/app/api/tiktok/live/route";

function TikTokLiveCard({ video }: { video: TikTokOembedResult }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative aspect-[9/16] w-[160px] shrink-0 overflow-hidden rounded-xl border border-border/40 bg-black sm:w-[180px] md:w-[200px]"
    >
      {video.thumbnail_url ? (
        <>
          <Image
            src={video.thumbnail_url}
            alt={video.title || "TikTok video"}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              imageLoaded ? "opacity-100" : "opacity-0",
              "group-hover:scale-105",
            )}
            sizes="200px"
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <RefreshCw className="size-5 animate-spin text-muted-foreground/40" />
            </div>
          )}
        </>
      ) : (
        <div className="flex h-full items-center justify-center bg-muted p-4">
          <p className="text-center text-[10px] text-muted-foreground">{video.author_name}</p>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-100 scale-90">
            <Play className="size-6 fill-white text-white" />
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 pt-10">
        <p className="truncate text-[11px] font-medium text-white/90">
          @{video.author_name}
        </p>
        {video.title && (
          <p className="mt-0.5 line-clamp-1 text-[10px] text-white/60">{video.title}</p>
        )}
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="flex size-7 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
          <ExternalLink className="size-3.5 text-white" />
        </span>
      </div>
    </a>
  );
}

function TikTokLiveSkeleton() {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-[9/16] w-[160px] shrink-0 animate-pulse rounded-xl bg-muted sm:w-[180px] md:w-[200px]"
        >
          <div className="flex h-full items-center justify-center">
            <RefreshCw className="size-5 animate-spin text-muted-foreground/20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TikTokLiveError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <AlertCircle className="size-8 text-muted-foreground/40 mb-2" />
      <p className="text-xs text-muted-foreground mb-3">Could not load live TikTok feed</p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <RefreshCw className="size-3" />
        Retry
      </button>
    </div>
  );
}

export function LandingTikTokLiveMarquee() {
  const [videos, setVideos] = useState<TikTokOembedResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const retryKey = useRef(0);

  const fetchFeed = () => {
    setLoading(true);
    setError(false);
    retryKey.current += 1;

    fetch("/api/tiktok/live")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json() as Promise<TikTokLiveFeedResponse>;
      })
      .then((data) => {
        const valid = data.videos.filter((v) => v.thumbnail_url && !v.error);
        setVideos(valid);
        if (valid.length === 0) setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="mt-10">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-foreground/40">
          Live from TikTok
        </p>
        <TikTokLiveSkeleton />
      </div>
    );
  }

  if (error || videos.length === 0) {
    return (
      <div className="mt-10">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-foreground/40">
          Live from TikTok
        </p>
        <TikTokLiveError onRetry={fetchFeed} />
      </div>
    );
  }

  return (
    <div className="mt-10 overflow-hidden">
      <div className="mb-4 flex items-center justify-center gap-2">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-green-500" />
        </span>
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-foreground/40">
          Live from TikTok
        </p>
      </div>
      <Marquee pauseOnHover repeat={Math.max(2, Math.ceil(12 / videos.length))}>
        {videos.map((video, i) => (
          <TikTokLiveCard key={video.url + i} video={video} />
        ))}
      </Marquee>
    </div>
  );
}
