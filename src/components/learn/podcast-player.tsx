"use client";

import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  SkipForward,
  SkipBack,
  Clock,
} from "lucide-react";
import { cn } from "@/utils";

export interface PodcastEpisode {
  id: string;
  title: string;
  subtitle: string;
  guest: string;
  duration: string;
  audioUrl?: string;
  coverUrl: string;
  date: string;
  summary: string;
}

export const DEFAULT_EPISODES: PodcastEpisode[] = [
  {
    id: "ep-01",
    title: "Where Did KSh 4.82 Trillion Go?",
    subtitle: "Season 1 · Episode 01",
    guest: "With National Debt Analysts & Youth Trackers",
    duration: "34:12",
    audioUrl: "https://pub-f17936ca338a4ebcbdaa81475beda374.r2.dev/county%20%26%20budget%20socials%20new.mp4",
    coverUrl: "/images/marketing newsletter subcribe/Nelly with The Mic.jpg",
    date: "Sep 2025",
    summary: "Breaking down the Consolidated Fund Services: why over KSh 1.2 Trillion is locked in debt interest before a single teacher is paid.",
  },
  {
    id: "ep-02",
    title: "The Locked Maternity Wing Trap",
    subtitle: "Season 1 · Episode 02",
    guest: "With Shaimaa Hassan (Kilifi) & Subukia Monitors",
    duration: "28:45",
    audioUrl: "https://pub-f17936ca338a4ebcbdaa81475beda374.r2.dev/county%20%26%20budget%20socials%20new.mp4",
    coverUrl: "/images/towwnhallmay/129A4056.jpg",
    date: "Aug 2025",
    summary: "An on-the-ground investigation into county pending bills, contractor disputes, and how citizen barazas force facility doors open.",
  },
  {
    id: "ep-03",
    title: "Vernacular Radio: Budget in Mother Tongue",
    subtitle: "Season 1 · Episode 03",
    guest: "Grassroots Radio Broadcasters Network",
    duration: "22:18",
    audioUrl: "https://pub-f17936ca338a4ebcbdaa81475beda374.r2.dev/county%20%26%20budget%20socials%20new.mp4",
    coverUrl: "/images/media/129A3905.jpg",
    date: "Jul 2025",
    summary: "How community FM stations in Dholuo, Giriama, Somali, and Luhya translate fiscal policy for 800,000 rural listeners.",
  },
];

export function PodcastPlayer({ className }: { className?: string }) {
  const [activeEpisode, setActiveEpisode] = useState(DEFAULT_EPISODES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(24);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left: Active Episode Details & Audio Console — Zero Outer Card Nesting */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold tracking-wider">
                <Radio className="size-3.5 animate-pulse" />
                <span>PODCAST & FIELD AUDIO</span>
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {activeEpisode.subtitle}
              </span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-foreground leading-tight tracking-tight">
              {activeEpisode.title}
            </h3>

            <p className="text-xs sm:text-sm font-mono text-amber-600 dark:text-amber-400 font-bold">
              {activeEpisode.guest}
            </p>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {activeEpisode.summary}
            </p>
          </div>

          {/* Direct Interactive Audio Scrubber & Controls */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>08:14</span>
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                <Clock className="size-3.5" />
                <span>{activeEpisode.duration}</span>
              </div>
            </div>

            {/* Interactive Scrubber Bar */}
            <div
              className="relative h-2.5 w-full rounded-full bg-muted cursor-pointer overflow-hidden"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                setProgress(pct);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Playback Buttons Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsMuted((prev) => !prev)}
                className="text-muted-foreground hover:text-foreground transition-colors p-2"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
              </button>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setProgress((p) => Math.max(0, p - 10))}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted cursor-pointer"
                  aria-label="Skip backward 10s"
                >
                  <SkipBack className="size-5" />
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-transform active:scale-95 cursor-pointer"
                  aria-label={isPlaying ? "Pause podcast" : "Play podcast"}
                >
                  {isPlaying ? (
                    <Pause className="size-6 fill-current" />
                  ) : (
                    <Play className="size-6 fill-current pl-1" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setProgress((p) => Math.min(100, p + 10))}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted cursor-pointer"
                  aria-label="Skip forward 10s"
                >
                  <SkipForward className="size-5" />
                </button>
              </div>

              <div className="w-9" />
            </div>
          </div>
        </div>

        {/* Right: Unnested Season 1 Playlist */}
        <div className="lg:col-span-5 space-y-3 pt-2">
          <div className="flex items-center justify-between pb-1">
            <p className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
              Season 1 Broadcasts
            </p>
            <span className="font-mono text-xs text-muted-foreground">3 Episodes</span>
          </div>

          <div className="space-y-2.5">
            {DEFAULT_EPISODES.map((ep) => {
              const isActive = ep.id === activeEpisode.id;
              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => {
                    setActiveEpisode(ep);
                    setIsPlaying(true);
                    setProgress(0);
                  }}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 cursor-pointer",
                    isActive
                      ? "border-primary bg-primary/5 shadow-xs"
                      : "border-border/60 bg-card/60 hover:border-primary/40 hover:bg-muted/40",
                  )}
                >
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <div
                      className={cn(
                        "size-9 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isActive && isPlaying ? (
                        <div className="flex gap-0.5 items-end h-3">
                          <span className="w-0.5 bg-current h-2 animate-bounce" />
                          <span className="w-0.5 bg-current h-3 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-0.5 bg-current h-1.5 animate-bounce [animation-delay:0.4s]" />
                        </div>
                      ) : (
                        <Play className="size-3.5 fill-current pl-0.5" />
                      )}
                    </div>
                    <div className="truncate">
                      <p className="text-xs sm:text-sm font-bold text-foreground truncate">{ep.title}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{ep.guest}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground shrink-0 font-medium">
                    {ep.duration}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
