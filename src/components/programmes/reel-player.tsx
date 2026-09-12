"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, Heart, Share2, ExternalLink } from "lucide-react";
import { cn } from "@/utils";
import type { ProgrammeReel } from "@/content";

interface ReelPlayerProps {
  reel: ProgrammeReel;
  className?: string;
  size?: "sm" | "md" | "lg";
  showControls?: boolean;
}

export function ReelPlayer({
  reel,
  className,
  size = "md",
  showControls = true,
}: ReelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const sizeClasses = {
    sm: "aspect-[9/16] max-h-[400px]",
    md: "aspect-[9/16] max-h-[600px]",
    lg: "aspect-[9/16] max-h-[800px]",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-black group",
        sizeClasses[size],
        className,
      )}
    >
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.posterUrl}
        muted={isMuted}
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 size-full object-cover"
        onClick={togglePlay}
      />

      {/* Play/Pause overlay */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-opacity",
          isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100",
        )}
        onClick={togglePlay}
      >
        <div className="flex items-center justify-center size-16 rounded-full bg-black/60 text-white backdrop-blur-sm cursor-pointer hover:bg-black/80 transition-colors">
          {isPlaying ? (
            <Pause className="size-7" />
          ) : (
            <Play className="size-7 fill-current ml-1" />
          )}
        </div>
      </div>

      {/* Bottom gradient + info */}
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-white/70 uppercase tracking-wider">
              {reel.category} · {reel.duration}
            </p>
            <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
              {reel.title}
            </h3>
            <p className="text-[11px] text-white/60">{reel.author}</p>
          </div>
        </div>

        {showControls && (
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleMute}
                className="text-white/80 hover:text-white transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
              <span className="flex items-center gap-1 text-[11px] text-white/70">
                <Heart className="size-3" />
                {(reel.likes / 1000).toFixed(1)}K
              </span>
              <span className="flex items-center gap-1 text-[11px] text-white/70">
                <Share2 className="size-3" />
                {(reel.shares / 1000).toFixed(1)}K
              </span>
            </div>
            <a
              href={reel.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-white/70 hover:text-white transition-colors"
            >
              <ExternalLink className="size-3" />
              Open
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
