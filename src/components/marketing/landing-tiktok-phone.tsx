"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
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
import { landingContent, mediaContent } from "@/content";

/**
 * Phone-framed featured TikTok player — used in the landing hero.
 * Showcases Nelly Maina media cover photo when video is paused/loading,
 * and opens the TikTok page when user clicks play.
 */
export function LandingTikTokPhone({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [video, setVideo] = useState<{
    id: string;
    video_url: string;
    cover_image_url: string;
    embed_html: string;
    caption: string;
    like_count: number;
    tiktok_like_count: number;
    tiktok_comment_count: number;
    tiktok_share_count: number;
    tiktok_play_count: number;
  } | null>(null);

  useEffect(() => {
    const videoUrl =
      mediaContent.cloudinary.reelVideo ||
      mediaContent.cloudinary.countyBudgetSocialVideo ||
      "https://bns.stratapointadvisory.org/0cd8319a419e6b3749a7206ba4d68801.mp4";
    const nellyMediaPhoto =
      "/images/marketing%20newsletter%20subcribe/Nelly%20with%20The%20Mic.jpg";
    const mockVideo = {
      id: "tiktok-landing-video",
      video_url: videoUrl,
      cover_image_url: nellyMediaPhoto,
      embed_html: "",
      caption: "Budget Ndio Story - County Budget Explained",
      like_count: 12500,
      tiktok_like_count: 12500,
      tiktok_comment_count: 842,
      tiktok_share_count: 320,
      tiktok_play_count: 250000,
    };
    setVideo(mockVideo);
    setLikeCount(mockVideo.like_count);
  }, []);

  useEffect(() => {
    const node = phoneRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const openTikTokPage = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(landingContent.tiktok.profileUrl, "_blank", "noopener,noreferrer");
  }, []);

  const toggleMute = useCallback(() => {
    const node = videoRef.current;
    if (!node) return;
    node.muted = !node.muted;
    setIsMuted(node.muted);
  }, []);

  const handleLike = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!video) return;
      const newLiked = !liked;
      const prevCount = likeCount;
      setLiked(newLiked);
      setLikeCount(newLiked ? likeCount + 1 : Math.max(0, likeCount - 1));
      try {
        setLikeCount(newLiked ? likeCount + 1 : Math.max(0, likeCount - 1));
      } catch {
        setLiked(!newLiked);
        setLikeCount(prevCount);
        toast.error("Could not update like");
      }
    },
    [video, liked, likeCount],
  );

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!video) return;
      const url = `${window.location.origin}/tiktok/${video.id}`;
      if (navigator.share) {
        try {
          await navigator.share({ title: "Budget Ndio Story", url });
        } catch {
          /* dismissed */
        }
      } else if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(url);
          toast.success("Link copied");
        } catch {
          toast.error("Could not copy link");
        }
      }
    },
    [video],
  );

  const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));

  if (!video) {
    return (
      <div
        className={cn(
          "mx-auto aspect-[9/16] w-full max-w-[280px] animate-pulse rounded-[2rem] bg-muted md:max-w-[320px]",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <div ref={phoneRef} className={cn("mx-auto flex w-full max-w-[280px] flex-col md:max-w-[320px]", className)}>
      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[2rem] border-[3px] border-foreground/10 bg-card ring-1 ring-white/10">
        {/* Nelly Maina media cover image preview when video is paused/loading */}
        {(!isPlaying || !isReady) && (
          <div
            className="absolute inset-0 z-0 overflow-hidden cursor-pointer bg-black/40"
            onClick={openTikTokPage}
            data-testid="tiktok-hero-cover-image"
          >
            <Image
              src={video.cover_image_url}
              alt="Nelly Maina - Budget Ndio Story"
              fill
              sizes="(max-width: 768px) 280px, 320px"
              className="object-cover"
              priority
              fetchPriority="high"
            />
          </div>
        )}

        <video
          ref={videoRef}
          src={video.video_url}
          poster={video.cover_image_url}
          className="absolute inset-0 size-full object-cover"
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onClick={openTikTokPage}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onCanPlay={() => setIsReady(true)}
          onError={() => setIsReady(false)}
          aria-label="County budget social video"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

        {!isPlaying ? (
          <button
            type="button"
            onClick={openTikTokPage}
            className="absolute inset-0 z-10 flex items-center justify-center"
            aria-label="Play video"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-white/20 transition-transform hover:scale-110">
              <Play className="size-8 fill-white text-white" />
            </span>
          </button>
        ) : null}

        <div className="absolute bottom-24 right-3 z-20 flex flex-col items-center gap-5">
          <button
            type="button"
            aria-label="Like"
            className="pointer-events-auto flex flex-col items-center gap-1 text-white/90 transition-transform hover:scale-105"
            onClick={handleLike}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-black/25">
              <Heart
                className={cn("size-5 transition-colors", liked && "fill-red-500 text-red-500")}
                strokeWidth={1.75}
              />
            </span>
            <span className="text-[10px] font-medium">{formatCount(likeCount)}</span>
          </button>
          <a
            href={landingContent.tiktok.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto flex flex-col items-center gap-1 text-white/90 no-underline transition-transform hover:scale-105"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-black/25">
              <MessageCircle className="size-5" strokeWidth={1.75} />
            </span>
            <span className="text-[10px] font-medium">Comment</span>
          </a>
          <button
            type="button"
            aria-label="Share"
            className="pointer-events-auto flex flex-col items-center gap-1 text-white/90 transition-transform hover:scale-105"
            onClick={handleShare}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-black/25">
              <Share2 className="size-5" strokeWidth={1.75} />
            </span>
            <span className="text-[10px] font-medium">Share</span>
          </button>
          <div className="size-10 overflow-hidden rounded-full border-2 border-white bg-background">
            <Image src="/logo.svg" alt="BNS" width={36} height={36} className="size-full object-contain p-1" />
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-14 z-20 space-y-2 text-white">
          <p className="text-sm font-bold">@budget.ndio.story</p>
          <p className="text-xs leading-relaxed text-white/90">{video.caption}</p>
          <p className="flex items-center gap-1.5 text-xs text-white/70">
            <Music2 className="size-3.5 shrink-0" />
            <span className="truncate">Original audio · Budget Ndio Story</span>
          </p>
        </div>

        <div className="absolute right-3 top-3 z-20 flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMute();
            }}
            className="pointer-events-auto flex size-9 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openTikTokPage(e);
            }}
            className="pointer-events-auto flex size-9 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 fill-white" />}
          </button>
        </div>
      </div>
    </div>
  );
}
