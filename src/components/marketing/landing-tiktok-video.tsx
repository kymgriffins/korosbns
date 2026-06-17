"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
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
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { CLOUDINARY_COUNTY_BUDGET_SOCIAL_VIDEO } from "@/constants/cloudinary";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";
import { cn } from "@/utils";

const TIKTOK_PROFILE = "https://www.tiktok.com/@budget.ndio.story";

const SIDE_ACTIONS = [
  { icon: Heart, label: "Like" },
  { icon: MessageCircle, label: "Comment" },
  { icon: Share2, label: "Share" },
] as const;

export default function LandingTikTokVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = phoneRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.45 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isInView) {
      void video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [isInView]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play().then(() => setIsPlaying(true));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  return (
    <SectionShell className="border-y border-border/40 bg-background">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16"
      >
        <div>
          <SectionHeader
            eyebrow="Short-form civic media"
            title={
              <>
                County budgets,{" "}
                <span className="font-heading italic text-primary">TikTok</span>{" "}
                style.
              </>
            }
            description="Snackable explainers that meet youth where they scroll — turning county fiscal data into stories anyone can share."
            className="mb-0 md:mb-0"
          />

          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-4">
            <Link
              href={TIKTOK_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Follow @budget.ndio.story
            </Link>
          </motion.div>
        </div>

        <motion.div variants={fadeInUp} className="flex justify-center lg:justify-end">
          <div
            ref={phoneRef}
            className="relative w-[min(100%,280px)] sm:w-[300px]"
          >
            <div className="relative aspect-[9/16] overflow-hidden rounded-[2rem] border-[3px] border-foreground/10 bg-black shadow-2xl shadow-black/30 ring-1 ring-white/10">
              <video
                ref={videoRef}
                src={CLOUDINARY_COUNTY_BUDGET_SOCIAL_VIDEO}
                className="absolute inset-0 h-full w-full object-cover"
                loop
                muted
                playsInline
                preload="metadata"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                aria-label="County budget social video"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 z-10 flex items-center justify-center"
                  aria-label="Play video"
                >
                  <span className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <Play className="size-8 fill-white text-white" />
                  </span>
                </button>
              )}

              <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-5">
                <div className="size-10 overflow-hidden rounded-full border-2 border-white bg-primary/80">
                  <span className="flex size-full items-center justify-center text-[10px] font-bold text-white">
                    BNS
                  </span>
                </div>
                {SIDE_ACTIONS.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={label}
                    className="pointer-events-auto flex flex-col items-center gap-1 text-white/90 transition-transform hover:scale-105"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="flex size-10 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <span className="text-[10px] font-medium">{label}</span>
                  </button>
                ))}
                <div
                  className={cn(
                    "mt-1 size-9 animate-spin rounded-full border-2 border-white/30 bg-gradient-to-br from-primary to-purple-500",
                    isPlaying ? "[animation-duration:3s]" : "animate-none"
                  )}
                  aria-hidden
                />
              </div>

              <div className="absolute right-14 bottom-4 left-4 z-20 space-y-2 text-white">
                <p className="text-sm font-bold">@budget.ndio.story</p>
                <p className="text-xs leading-relaxed text-white/90">
                  County budgets explained in under a minute — follow the money where
                  you live.
                </p>
                <p className="flex items-center gap-1.5 text-xs text-white/70">
                  <Music2 className="size-3.5 shrink-0" />
                  <span className="truncate">Original audio · Budget Ndio Story</span>
                </p>
              </div>

              <div className="absolute top-3 right-3 z-20 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="pointer-events-auto flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? (
                    <VolumeX className="size-4" />
                  ) : (
                    <Volume2 className="size-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                  className="pointer-events-auto flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <Pause className="size-4" />
                  ) : (
                    <Play className="size-4 fill-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
