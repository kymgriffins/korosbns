"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/utils";
import { motion, AnimatePresence } from "motion/react";

export interface ReelItem {
  id: string;
  title: string;
  caption: string;
  category: string;
  author: string;
  authorAvatar?: string;
  videoUrl: string;
  posterUrl: string;
  likes: number;
  comments: number;
  shares: number;
  duration: string;
  hashtags: string[];
}

import { BNS_R2_REELS } from "@/constants/bns-r2-reels";

export const DEFAULT_REELS: ReelItem[] = BNS_R2_REELS.map((r) => ({
  id: r.id,
  title: r.title,
  caption: r.caption,
  category: r.category,
  author: r.author,
  authorAvatar: r.authorAvatar,
  videoUrl: r.videoUrl,
  posterUrl: r.posterUrl,
  likes: r.likes,
  comments: r.comments,
  shares: r.shares,
  duration: r.duration,
  hashtags: r.hashtags,
}));

interface ReelsScrollerProps {
  reels?: ReelItem[];
  className?: string;
  isFixedFullscreen?: boolean;
  initialIndex?: number;
}

export function ReelsScroller({
  reels = DEFAULT_REELS,
  className,
  isFixedFullscreen = false,
  initialIndex = 0,
}: ReelsScrollerProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>(() =>
    reels.reduce(
      (acc, r) => ({ ...acc, [r.id]: r.likes }),
      {} as Record<string, number>,
    ),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Scroll to active index on button click
  const scrollToReel = (index: number) => {
    if (index < 0 || index >= reels.length) return;
    setActiveIndex(index);
    const container = containerRef.current;
    if (!container) return;
    const target = container.children[index] as HTMLElement;
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  // Scroll to initial index on mount if specified
  useEffect(() => {
    if (initialIndex > 0 && initialIndex < reels.length) {
      scrollToReel(initialIndex);
    }
  }, [initialIndex, reels.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        scrollToReel(activeIndex + 1);
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        scrollToReel(activeIndex - 1);
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        togglePlay(reels[activeIndex]?.id);
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, reels]);

  // Handle intersection observer to auto-play active video in background muted first
  useEffect(() => {
    const currentReel = reels[activeIndex];
    videoRefs.current.forEach((videoEl, id) => {
      if (id === currentReel?.id) {
        videoEl.muted = isMuted;
        videoEl
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay with sound restricted, run in background muted first
            videoEl.muted = true;
            setIsMuted(true);
            videoEl
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => setIsPlaying(false));
          });
      } else {
        videoEl.pause();
      }
    });
  }, [activeIndex, isMuted, reels]);

  // Sync mute state across all video elements
  useEffect(() => {
    videoRefs.current.forEach((videoEl) => {
      videoEl.muted = isMuted;
    });
  }, [isMuted]);

  const togglePlay = (id: string) => {
    const videoEl = videoRefs.current.get(id);
    if (!videoEl) return;

    // If currently running in background muted, clicking play or the screen unmutes
    if (!videoEl.paused && isMuted) {
      videoEl.muted = false;
      setIsMuted(false);
      videoEl
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          videoEl.muted = true;
          setIsMuted(true);
          videoEl.play().then(() => setIsPlaying(true)).catch(() => {});
        });
      return;
    }

    if (videoEl.paused || !isPlaying) {
      videoEl.muted = isMuted;
      setIsPlaying(true);
      videoEl
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Reel video playback failed, retrying muted:", err);
          videoEl.muted = true;
          setIsMuted(true);
          videoEl
            .play()
            .then(() => setIsPlaying(true))
            .catch((e2) => {
              console.warn("Playback completely failed:", e2);
              setIsPlaying(false);
            });
        });
    } else {
      videoEl.pause();
      setIsPlaying(false);
    }
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const wasLiked = !!likedMap[id];
    setLikedMap((prev) => ({ ...prev, [id]: !wasLiked }));
    setLikeCountMap((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + (wasLiked ? -1 : 1),
    }));
  };

  const handleShare = async (reel: ReelItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: reel.title,
          text: reel.caption,
          url: shareUrl,
        });
      } catch {
        /* user dismissed share dialog */
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Story link copied to clipboard");
      } catch {
        toast.error("Could not copy link");
      }
    }
  };

  return (
    <div
      className={cn(
        isFixedFullscreen
          ? "relative mx-auto flex h-full w-full max-w-[460px] flex-col items-center justify-center"
          : "relative mx-auto flex w-full max-w-lg flex-col items-center",
        className,
      )}
    >
      {/* Desktop Navigation Floating Chevrons */}
      <div className="absolute -right-16 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        <button
          type="button"
          onClick={() => scrollToReel(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="Previous story reel"
          className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-md backdrop-blur-md transition-all hover:bg-white/20 disabled:opacity-30"
        >
          <ChevronUp className="size-5" />
        </button>
        <div className="text-center font-mono text-xs font-bold text-white/70">
          {activeIndex + 1}/{reels.length}
        </div>
        <button
          type="button"
          onClick={() => scrollToReel(activeIndex + 1)}
          disabled={activeIndex === reels.length - 1}
          aria-label="Next story reel"
          className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-md backdrop-blur-md transition-all hover:bg-white/20 disabled:opacity-30"
        >
          <ChevronDown className="size-5" />
        </button>
      </div>

      {/* Snap-scroll container */}
      <div
        ref={containerRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          const index = Math.round(el.scrollTop / el.clientHeight);
          if (index !== activeIndex && index >= 0 && index < reels.length) {
            setActiveIndex(index);
          }
        }}
        className={cn(
          "w-full snap-y snap-mandatory overflow-y-auto overscroll-contain bg-black shadow-2xl scrollbar-none",
          isFixedFullscreen
            ? "h-full rounded-none sm:rounded-[2rem] border-0 sm:border sm:border-white/15"
            : "h-[78vh] max-h-[720px] min-h-[540px] rounded-3xl border border-border/60",
        )}
      >
        {reels.map((reel, idx) => {
          const isCurrent = idx === activeIndex;
          const isLiked = !!likedMap[reel.id];
          const likesCount = likeCountMap[reel.id] ?? reel.likes;

          return (
            <div
              key={reel.id}
              className="relative flex h-full w-full snap-start snap-always items-center justify-center overflow-hidden bg-zinc-950"
            >
              {/* Background Video Element */}
              <video
                ref={(el) => {
                  if (el) videoRefs.current.set(reel.id, el);
                  else videoRefs.current.delete(reel.id);
                }}
                src={reel.videoUrl}
                poster={reel.posterUrl}
                loop
                playsInline
                muted={isMuted}
                preload="auto"
                onPlay={() => {
                  if (isCurrent) setIsPlaying(true);
                }}
                onPlaying={() => {
                  if (isCurrent) setIsPlaying(true);
                }}
                onPause={() => {
                  if (isCurrent) setIsPlaying(false);
                }}
                onClick={() => togglePlay(reel.id)}
                className="h-full w-full object-cover cursor-pointer"
              >
                <source src={reel.videoUrl} type="video/mp4" />
              </video>

              {/* Ambient Vignette Gradients */}
              <div
                onClick={() => togglePlay(reel.id)}
                className="pointer-events-auto absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 cursor-pointer"
              />

              {/* Center Play/Pause Floating Icon Indicator */}
              <AnimatePresence>
                {!isPlaying && isCurrent && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay(reel.id);
                      }}
                      aria-label="Play story reel"
                      className="pointer-events-auto flex size-16 items-center justify-center rounded-full bg-black/60 text-white shadow-2xl backdrop-blur-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <Play className="size-8 fill-current pl-1" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Prominent floating unmute pill when running muted in background */}
              {isPlaying && isCurrent && isMuted ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const videoEl = videoRefs.current.get(reel.id);
                    if (videoEl) {
                      videoEl.muted = false;
                      setIsMuted(false);
                      videoEl.play().catch(() => {});
                    }
                  }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-2 rounded-full bg-black/75 px-4 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur-md transition-all hover:bg-black hover:scale-105 border border-white/20 pointer-events-auto cursor-pointer"
                  aria-label="Click to unmute"
                >
                  <VolumeX className="size-4 animate-pulse text-amber-400" />
                  <span>Click for sound</span>
                </button>
              ) : null}

              {/* Top Header Overlays */}
              <div className="pointer-events-none absolute inset-x-4 top-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-red-600 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider">
                    {reel.category}
                  </span>
                  <span className="font-mono text-xs text-white/70">
                    {reel.duration}
                  </span>
                </div>
                <div className="pointer-events-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted((prev) => !prev);
                    }}
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    className="flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
                  >
                    {isMuted ? (
                      <VolumeX className="size-4" />
                    ) : (
                      <Volume2 className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Right Side Interactive Action Bar */}
              <div className="pointer-events-auto absolute bottom-20 right-3 z-20 flex flex-col items-center gap-5 text-white">
                {/* Like Button */}
                <button
                  type="button"
                  onClick={(e) => handleLike(reel.id, e)}
                  aria-label="Like story"
                  className="group flex flex-col items-center gap-1 focus-visible:outline-none"
                >
                  <div
                    className={cn(
                      "flex size-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-md transition-transform group-hover:scale-110",
                      isLiked ? "text-rose-500" : "text-white",
                    )}
                  >
                    <Heart
                      className={cn("size-6", isLiked && "fill-current")}
                    />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-white/90">
                    {likesCount > 999
                      ? `${(likesCount / 1000).toFixed(1)}k`
                      : likesCount}
                  </span>
                </button>

                {/* Comments indicator */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex size-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md">
                    <MessageCircle className="size-5" />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-white/90">
                    {reel.comments}
                  </span>
                </div>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={(e) => handleShare(reel, e)}
                  aria-label="Share story"
                  className="group flex flex-col items-center gap-1 focus-visible:outline-none"
                >
                  <div className="flex size-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-transform group-hover:scale-110">
                    <Share2 className="size-5" />
                  </div>
                  <span className="font-mono text-[11px] font-bold text-white/90">
                    {reel.shares}
                  </span>
                </button>
              </div>

              {/* Bottom Information Overlay */}
              <div className="pointer-events-auto absolute inset-x-4 bottom-4 z-10 space-y-2 pr-14 text-white">
                <div className="flex items-center gap-2">
                  <div className="relative size-7 overflow-hidden rounded-full border border-white/40">
                    <Image
                      src={reel.authorAvatar || reel.posterUrl}
                      alt={reel.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold text-white/95">
                    {reel.author}
                  </span>
                </div>

                <h3 className="font-heading text-base font-extrabold leading-snug text-white">
                  {reel.title}
                </h3>

                <p className="line-clamp-2 text-xs text-white/80 leading-relaxed">
                  {reel.caption}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {reel.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] font-medium text-amber-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Touch swipe hint footer */}
      <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
        <span>Swipe / Drag or use Arrow Keys to scroll</span>
      </div>
    </div>
  );
}
