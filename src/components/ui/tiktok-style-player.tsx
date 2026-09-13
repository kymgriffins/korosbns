"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/utils";

export type TikTokStylePlayerProps = {
  src: string;
  poster?: string;
  title?: string;
  caption?: string;
  className?: string;
};

/**
 * Vertical phone-framed reel player for programme heroes and in-grid playback.
 * Plays R2 / MP4 inline (TikTok look) without leaving the app.
 */
export function TikTokStylePlayer({
  src,
  poster,
  title,
  caption,
  className,
}: TikTokStylePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    const node = videoRef.current;
    if (!node) return;
    node.muted = true;
    setIsMuted(true);
    void Promise.resolve(node.play())
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [src]);

  const togglePlay = () => {
    const node = videoRef.current;
    if (!node) return;
    if (node.paused) {
      void Promise.resolve(node.play())
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      node.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const node = videoRef.current;
    if (!node) return;
    node.muted = !node.muted;
    setIsMuted(node.muted);
  };

  if (failed || !src) {
    return (
      <div
        className={cn(
          "relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-[1.5rem] border border-border bg-muted",
          className,
        )}
      >
        {poster ? (
          <Image src={poster} alt={title || "Reel"} fill className="object-cover" sizes="280px" />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
            Reel unavailable
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-[1.5rem] border border-border/80 bg-black shadow-lg",
        className,
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        muted={isMuted}
        loop
        preload="metadata"
        className="absolute inset-0 size-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setFailed(true)}
        aria-label={title || "Social reel"}
      />

      <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-16">
        {title ? (
          <p className="text-sm font-semibold leading-snug text-white">{title}</p>
        ) : null}
        {caption ? (
          <p className="line-clamp-2 text-xs leading-relaxed text-white/80">{caption}</p>
        ) : null}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex size-9 items-center justify-center rounded-full bg-white/15 text-white outline-none backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-white"
            aria-label={isPlaying ? "Pause reel" : "Play reel"}
          >
            {isPlaying ? (
              <Pause className="size-4 fill-current" />
            ) : (
              <Play className="size-4 fill-current" />
            )}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="inline-flex size-9 items-center justify-center rounded-full bg-white/15 text-white outline-none backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-white"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
