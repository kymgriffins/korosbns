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

export interface LandingVideoOption {
  id: string;
  authorName: string;
  authorHandle: string;
  role: string;
  topic: string;
  badge: string;
  caption: string;
  video_url: string;
  cover_image_url: string;
  like_count: number;
  tiktok_like_count: number;
  tiktok_comment_count: number;
  tiktok_share_count: number;
  tiktok_play_count: number;
}

export const LANDING_HERO_VIDEOS: LandingVideoOption[] = [
  {
    id: "calvina-praise",
    authorName: "Calvina Praise",
    authorHandle: "@budget.ndio.story",
    role: "BNS Storyteller",
    topic: "12T Debt",
    badge: "Public Debt · Article 201",
    caption: "Kenya Owes Over 12 Trillion: Breaking down our sovereign debt under Article 201.",
    video_url: "https://bns.stratapointadvisory.org/0cd8319a419e6b3749a7206ba4d68801.mp4",
    cover_image_url: "/images/reels/reel-01-poster.jpg",
    like_count: 12500,
    tiktok_like_count: 12500,
    tiktok_comment_count: 842,
    tiktok_share_count: 320,
    tiktok_play_count: 250000,
  },
  {
    id: "nelly-maina",
    authorName: "Nelly Maina",
    authorHandle: "@budget.ndio.story",
    role: "BNS Lead & Co-Founder",
    topic: "County Socials",
    badge: "Devolution · Dispensaries",
    caption: "County & Budget Socials: Tracking KSh 420B equitable share and auditing pending bills in your ward.",
    video_url: "https://bns.stratapointadvisory.org/county%20%26%20budget%20socials%20new.mp4",
    cover_image_url: "/images/reels/reel-02-poster.jpg",
    like_count: 8930,
    tiktok_like_count: 8930,
    tiktok_comment_count: 412,
    tiktok_share_count: 195,
    tiktok_play_count: 180000,
  },
];

/**
 * Phone-framed featured TikTok player — used in the landing hero.
 * Showcases authentic video frames for Calvina Praise and Nelly Maina,
 * and plays Cloudflare videos instantly on click.
 */
export function LandingTikTokPhone({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(LANDING_HERO_VIDEOS[0].like_count);
  const [progress, setProgress] = useState(0);

  const video = LANDING_HERO_VIDEOS[activeVideoIndex];

  // Sync mute state directly on HTMLMediaElement to overcome React prop bug
  useEffect(() => {
    const node = videoRef.current;
    if (node) {
      node.muted = isMuted;
    }
  }, [isMuted, activeVideoIndex]);

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

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const node = videoRef.current;
    if (!node) return;
    if (node.paused) {
      node.muted = isMuted;
      const playPromise = node.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Hero video playback error:", err);
            node.muted = true;
            setIsMuted(true);
            node.play().then(() => setIsPlaying(true)).catch((e2) => {
              console.error("Muted playback also failed:", e2);
            });
          });
      }
    } else {
      node.pause();
      setIsPlaying(false);
    }
  }, [isMuted]);

  // Autoplay muted when phone enters viewport
  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (isInView) {
      node.muted = true;
      node.play().then(() => setIsPlaying(true)).catch(() => {
        // Autoplay policy prevented; wait for user tap
      });
    } else {
      node.pause();
      setIsPlaying(false);
    }
  }, [isInView, activeVideoIndex]);

  const switchVideo = (index: number) => {
    if (index === activeVideoIndex) return;
    setActiveVideoIndex(index);
    setLiked(false);
    setLikeCount(LANDING_HERO_VIDEOS[index].like_count);
    setProgress(0);
    const node = videoRef.current;
    if (node) {
      node.currentTime = 0;
      node.src = LANDING_HERO_VIDEOS[index].video_url;
      node.muted = isMuted;
      node.load();
      if (isPlaying) {
        node.play().catch(() => {
          node.muted = true;
          setIsMuted(true);
          node.play().catch(console.warn);
        });
      }
    }
  };

  const toggleMute = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const node = videoRef.current;
    if (!node) return;
    const nextMuted = !node.muted;
    node.muted = nextMuted;
    setIsMuted(nextMuted);
    if (node.paused && !nextMuted) {
      node.play().then(() => setIsPlaying(true)).catch(console.warn);
    }
  }, []);

  const handleLike = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
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
    [liked, likeCount],
  );

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      const url = `${window.location.origin}/learn/stories`;
      if (navigator.share) {
        try {
          await navigator.share({ title: "Budget Ndio Story - " + video.authorName, url });
        } catch {
          /* dismissed */
        }
      } else if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard");
        } catch {
          toast.error("Could not copy link");
        }
      }
    },
    [video],
  );

  const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));

  return (
    <div ref={phoneRef} className={cn("mx-auto flex w-full max-w-[280px] flex-col items-center md:max-w-[320px]", className)}>
      {/* Video Switcher Tabs (Calvina Praise vs Nelly Maina) */}
      <div className="mb-3 flex items-center gap-1.5 p-1 rounded-full bg-muted/80 border border-border/60 shadow-xs backdrop-blur-md">
        {LANDING_HERO_VIDEOS.map((v, idx) => {
          const isActive = activeVideoIndex === idx;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => switchVideo(idx)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50",
              )}
            >
              <span>{v.authorName}</span>
              <span className="ml-1 text-[10px] opacity-75 hidden sm:inline">({v.topic})</span>
            </button>
          );
        })}
      </div>

      <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[2rem] border-[3px] border-foreground/10 bg-black ring-1 ring-white/10 shadow-2xl">
        {/* Cover image preview when video is paused/loading */}
        {!isPlaying && (
          <div
            className="absolute inset-0 z-10 overflow-hidden cursor-pointer bg-black"
            onClick={togglePlay}
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
        )}

        <video
          ref={videoRef}
          src={video.video_url}
          poster={video.cover_image_url}
          className="absolute inset-0 size-full object-cover cursor-pointer"
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onCanPlay={() => setIsReady(true)}
          onError={() => setIsReady(false)}
          onTimeUpdate={() => {
            const node = videoRef.current;
            if (node && node.duration) {
              setProgress((node.currentTime / node.duration) * 100);
            }
          }}
          aria-label="County budget social video"
        />

        {/* Ambient Gradient Vignette */}
        <div className="pointer-events-none absolute inset-0 z-15 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

        {/* Play Button Overlay (when paused) */}
        {!isPlaying ? (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/30 transition-colors"
            aria-label="Play video"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl transition-transform hover:scale-110 active:scale-95 border-2 border-white/30">
              <Play className="size-8 fill-current ml-0.5" />
            </span>
          </button>
        ) : null}

        {/* Top Header: Badge & Controls */}
        <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between">
          <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
            {video.badge}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMute}
              className="flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70 cursor-pointer border border-white/10"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70 cursor-pointer border border-white/10"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 fill-white ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Right Interaction Sidebar */}
        <div className="absolute bottom-20 right-3 z-30 flex flex-col items-center gap-4">
          <button
            type="button"
            aria-label="Like"
            className="flex flex-col items-center gap-1 text-white/90 transition-transform hover:scale-105 cursor-pointer"
            onClick={handleLike}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <Heart
                className={cn("size-5 transition-colors", liked && "fill-red-500 text-red-500")}
                strokeWidth={1.75}
              />
            </span>
            <span className="text-[10px] font-mono font-medium">{formatCount(likeCount)}</span>
          </button>
          <a
            href={landingContent.tiktok.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 text-white/90 no-underline transition-transform hover:scale-105 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <MessageCircle className="size-5" strokeWidth={1.75} />
            </span>
            <span className="text-[10px] font-mono font-medium">Chat</span>
          </a>
          <button
            type="button"
            aria-label="Share"
            className="flex flex-col items-center gap-1 text-white/90 transition-transform hover:scale-105 cursor-pointer"
            onClick={handleShare}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <Share2 className="size-5" strokeWidth={1.75} />
            </span>
            <span className="text-[10px] font-mono font-medium">Share</span>
          </button>
          <div className="size-9 overflow-hidden rounded-full border-2 border-white/80 bg-background shadow-md">
            <Image src="/logo.svg" alt="BNS" width={36} height={36} className="size-full object-contain p-1" />
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="absolute bottom-4 left-4 right-14 z-30 space-y-1.5 text-white pointer-events-none">
          <div className="pointer-events-auto">
            <a
              href={landingContent.tiktok.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold hover:underline inline-block text-white"
              onClick={(e) => e.stopPropagation()}
            >
              @budget.ndio.story
            </a>
            <span className="ml-1.5 text-[10px] font-mono text-white/80 bg-white/10 px-1.5 py-0.5 rounded">
              {video.authorName}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-white/90 line-clamp-2">{video.caption}</p>
          <p className="flex items-center gap-1.5 text-[10px] font-mono text-white/70">
            <Music2 className="size-3 shrink-0" />
            <span className="truncate">Original audio · Article 201 Watchdog</span>
          </p>
        </div>

        {/* Real-time Progress Bar */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 z-40">
          <div
            className="h-full bg-primary transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
