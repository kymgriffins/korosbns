"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Music2,
  Pause,
  Play,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils";
import { getTikTokVideo, likeTikTokVideo } from "@/lib/tiktok-service";
// import { LandingTikTokLiveMarquee } from "@/components/marketing/landing-tiktok-live-marquee";
import type { TikTokVideoDetailApi } from "@/lib/api-client";

const TIKTOK_PROFILE = "https://www.tiktok.com/@budget.ndio.story";

export default function TikTokVideoPage({ params }: { params: Promise<{ uuid: string }> }) {
  const uuid = React.use(params).uuid;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState<TikTokVideoDetailApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (!uuid) return;
    let cancelled = false;
    getTikTokVideo(uuid)
      .then((data) => {
        if (!cancelled) {
          setVideo(data);
          setLikeCount(data.like_count);
        }
      })
      .catch(() => { if (!cancelled) setNotFound(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [uuid]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || !video || !isReady) return;
    void node.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [video, isReady]);

  const toggleMute = () => {
    const node = videoRef.current;
    if (!node) return;
    node.muted = !node.muted;
    setIsMuted(node.muted);
  };

  const togglePlay = () => {
    const node = videoRef.current;
    if (!node) return;
    if (node.paused) {
      void node.play().then(() => setIsPlaying(true));
    } else {
      node.pause();
      setIsPlaying(false);
    }
  };

  const handleLike = async () => {
    if (!video) return;
    const newLiked = !liked;
    const optimisticCount = newLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
    setLiked(newLiked);
    setLikeCount(optimisticCount);
    try {
      const result = await likeTikTokVideo(video.id, newLiked ? "like" : "unlike");
      setLikeCount(result.like_count);
    } catch {
      setLiked(!newLiked);
      setLikeCount(likeCount);
    }
  };

  const handleShare = async () => {
    if (!video) return;
    const url = `${window.location.origin}/tiktok/${video.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Budget Ndio Story", url }); } catch { }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      } catch {
        toast.error("Could not copy link");
      }
    }
  };

  const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="size-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  if (notFound || !video) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
        <p className="text-lg font-semibold">Video not found</p>
        <Link href="/" className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="relative w-full max-w-[400px]">
        <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-border bg-card">
          <video
            ref={videoRef}
            src={video.video_url}
            poster={video.cover_image_url}
            className="absolute inset-0 h-full w-full object-cover"
            loop
            muted
            playsInline
            preload="auto"
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onCanPlay={() => setIsReady(true)}
            aria-label="TikTok video"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute inset-0 z-10 flex items-center justify-center"
              aria-label="Play video"
            >
              <span className="flex size-16 items-center justify-center rounded-full bg-background/90">
                <Play className="size-8 fill-white text-white" />
              </span>
            </button>
          )}

          <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-5">
            <button
              type="button"
              aria-label="Like"
              className="flex flex-col items-center gap-1 text-white/90 transition-transform hover:scale-105"
              onClick={handleLike}
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-background/80">
                <Heart
                  className={cn("size-5 transition-colors", liked && "fill-red-500 text-red-500")}
                  strokeWidth={1.75}
                />
              </span>
              <span className="text-[10px] font-medium">{formatCount(likeCount)}</span>
            </button>
            <a
              href={TIKTOK_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-white/90 transition-transform hover:scale-105 no-underline"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-background/80">
                <MessageCircle className="size-5" strokeWidth={1.75} />
              </span>
              <span className="text-[10px] font-medium">Comment</span>
            </a>
            <button
              type="button"
              aria-label="Share"
              className="flex flex-col items-center gap-1 text-white/90 transition-transform hover:scale-105"
              onClick={handleShare}
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-background/80">
                <Share2 className="size-5" strokeWidth={1.75} />
              </span>
              <span className="text-[10px] font-medium">Share</span>
            </button>
            <div className="size-10 overflow-hidden rounded-full border-2 border-white bg-background">
              <Image src="/logo.svg" alt="BNS" width={36} height={36} className="size-full object-contain p-1" />
            </div>
          </div>

          <div className="absolute right-14 bottom-4 left-4 z-20 space-y-2 text-white">
            <p className="text-sm font-bold">@budget.ndio.story</p>
            <p className="text-xs leading-relaxed text-white/90">{video.caption}</p>
            <p className="flex items-center gap-1.5 text-xs text-white/70">
              <Music2 className="size-3.5 shrink-0" />
              <span className="truncate">Original audio · Budget Ndio Story</span>
            </p>
          </div>

          <div className="absolute top-3 right-3 z-20 flex gap-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground transition-colors hover:bg-accent"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground transition-colors hover:bg-accent"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 fill-white" />}
            </button>
          </div>
        </div>

        <div className="mt-12 w-full max-w-3xl">
          <div className="border-t border-border pt-8">
            {/* <LandingTikTokLiveMarquee /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
