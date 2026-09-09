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
import { BNS_HERO_REEL } from "@/constants/bns-r2-reels";

const DEFAULT_HERO_VIDEO = {
  id: BNS_HERO_REEL.id,
  video_url:
    mediaContent.cloudinary.reelVideo || BNS_HERO_REEL.videoUrl,
  cover_image_url: BNS_HERO_REEL.posterUrl,
  embed_html: "",
  caption: BNS_HERO_REEL.caption,
  like_count: BNS_HERO_REEL.likes,
  tiktok_like_count: BNS_HERO_REEL.likes,
  tiktok_comment_count: BNS_HERO_REEL.comments,
  tiktok_share_count: BNS_HERO_REEL.shares,
  tiktok_play_count: BNS_HERO_REEL.plays,
};

/**
 * Phone-framed featured TikTok player — used in the landing hero.
 * Showcases Calvina Praise public debt story with authentic TikTok controls,
 * and plays Cloudflare MP4 inline when user taps play.
 */
export function LandingTikTokPhone({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const userInteractedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(DEFAULT_HERO_VIDEO.like_count);
  const [video, setVideo] = useState(DEFAULT_HERO_VIDEO);

  useEffect(() => {
    const videoUrl =
      mediaContent.cloudinary.reelVideo || BNS_HERO_REEL.videoUrl;
    const reelCoverPhoto = BNS_HERO_REEL.posterUrl;
    setVideo((prev) => ({
      ...prev,
      video_url: videoUrl,
      cover_image_url: reelCoverPhoto,
    }));
  }, []);

  // Always run in background muted first so video motion is immediate
  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    node.muted = true;
    setIsMuted(true);
    node
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsReady(true);
      })
      .catch(() => {
        // Handled by intersection observer or user gesture
      });
  }, [video.video_url]);

  useEffect(() => {
    const node = phoneRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const videoEl = videoRef.current;
        if (!videoEl) return;
        if (entry.isIntersecting && !userInteractedRef.current) {
          videoEl.muted = true;
          setIsMuted(true);
          videoEl
            .play()
            .then(() => {
              setIsPlaying(true);
              setIsReady(true);
            })
            .catch(() => {
              // Browser autoplay policy prevented muted playback
            });
        } else if (!entry.isIntersecting) {
          videoEl.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleUnmute = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      const node = videoRef.current;
      if (!node) return;
      userInteractedRef.current = true;
      node.muted = false;
      setIsMuted(false);
      node
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Unmuted play failed, falling back to muted:", err);
          node.muted = true;
          setIsMuted(true);
          node.play().then(() => setIsPlaying(true)).catch(() => {});
        });
    },
    [],
  );

  const togglePlay = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      const node = videoRef.current;
      if (!node) return;
      userInteractedRef.current = true;

      // If already playing and muted, a click on play should unmute
      if (!node.paused && isMuted) {
        handleUnmute(e);
        return;
      }

      if (node.paused || !isPlaying) {
        // Run muted first to guarantee immediate browser playback without blockage
        node.muted = isMuted;
        node
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            node.muted = true;
            setIsMuted(true);
            node
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false));
          });
      } else {
        node.pause();
        setIsPlaying(false);
      }
    },
    [handleUnmute, isMuted, isPlaying],
  );

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
        {/* Native video element — autoplays muted in background first */}
        <video
          ref={videoRef}
          src={video.video_url}
          poster={video.cover_image_url}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          onClick={togglePlay}
          onPlay={() => {
            setIsPlaying(true);
            setIsReady(true);
          }}
          onPlaying={() => {
            setIsPlaying(true);
            setIsReady(true);
          }}
          onPause={() => setIsPlaying(false)}
          onCanPlay={() => setIsReady(true)}
          onError={() => setIsReady(false)}
          className="absolute inset-0 size-full object-cover cursor-pointer z-0"
          aria-label="Calvina Praise debt explanation video"
        >
          <source src={video.video_url} type="video/mp4" />
        </video>

        {/* Thumbnail backdrop for initial load & tests — non-blocking so video streams through */}
        <div
          className={cn(
            "absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-700",
            isPlaying ? "opacity-0" : "opacity-100",
          )}
          data-testid="tiktok-hero-cover-image"
        >
          <Image
            src={video.cover_image_url}
            alt="Budget Ndio Story - Reel Preview"
            fill
            sizes="(max-width: 768px) 280px, 320px"
            className="object-cover"
            priority
            fetchPriority="high"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 z-10" />

        {/* Center Play Button if video is paused */}
        {!isPlaying ? (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
            aria-label="Play video"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-transform hover:scale-110 shadow-lg border border-white/20">
              <Play className="size-8 fill-white text-white ml-0.5" />
            </span>
          </button>
        ) : null}

        {/* Floating unmute icon indicator when running muted in background */}
        {isPlaying && isMuted ? (
          <button
            type="button"
            onClick={handleUnmute}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex size-14 items-center justify-center rounded-full bg-black/65 text-white shadow-2xl backdrop-blur-md transition-all hover:scale-110 hover:bg-black/85 border border-white/20 pointer-events-auto cursor-pointer"
            aria-label="Unmute video"
          >
            <VolumeX className="size-7 text-amber-400" />
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

        <div className="absolute bottom-4 left-4 right-14 z-20 space-y-2 text-white pointer-events-none">
          <a
            href={landingContent.tiktok.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold hover:underline inline-block pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            @budget.ndio.story
          </a>
          <p className="text-xs leading-relaxed text-white/90">{video.caption}</p>
          <p className="flex items-center gap-1.5 text-xs text-white/70">
            <Music2 className="size-3.5 shrink-0" />
            <span className="truncate">Original audio · Calvina Praise · Article 201 Watchdog</span>
          </p>
        </div>

        <div className="absolute right-3 top-3 z-20 flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isMuted) handleUnmute(e);
              else toggleMute();
            }}
            className="pointer-events-auto flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/80 border border-white/10 cursor-pointer"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="size-4.5 text-amber-400" />
            ) : (
              <Volume2 className="size-4.5 text-white" />
            )}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay(e);
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
