"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Film,
  Headphones,
  Layers,
  Play,
  PlaySquare,
  Radio,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import type { CivicModule, LearnHubItem } from "@/types/learn";
import { contentData } from "@/data/content";
import { learningData } from "@/data/learning";
import { embedUrl, videoData } from "@/data/videos";
import { learnItemHref, type LearnHubItem as HubNavItem } from "@/lib/learn-hub";
import { cn } from "@/utils";
import { ReelsScroller, DEFAULT_REELS } from "@/components/learn/reels-scroller";
import { PodcastPlayer } from "@/components/learn/podcast-player";

function matchesQuery(item: LearnHubItem, q: string): boolean {
  if (!q.trim()) return true;
  const query = q.trim().toLowerCase();
  return (
    item.title?.toLowerCase().includes(query) ||
    item.summary?.toLowerCase().includes(query) ||
    false
  );
}

function itemHref(item: LearnHubItem): string {
  return learnItemHref(item as unknown as HubNavItem);
}

function VideoCard({
  video,
  active,
  onPlay,
}: {
  video: LearnHubItem;
  active: boolean;
  onPlay: (id: string) => void;
}) {
  const videoId = video.id;
  if (active) {
    return (
      <div className="w-[85vw] max-w-xl shrink-0 snap-start overflow-hidden rounded-2xl border border-border/40 bg-black sm:w-[28rem]">
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl(videoId)}
            title={video.title}
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="p-4 text-sm font-semibold text-white">{video.title}</p>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onPlay(videoId)}
      className="group w-[70vw] max-w-sm shrink-0 snap-start overflow-hidden rounded-2xl border border-border/40 bg-card text-left transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-80"
      aria-label={`Play ${video.title}`}
    >
      <div className="relative aspect-video overflow-hidden">
        {video.thumbnail_url ? (
          <Image
            src={video.thumbnail_url}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 70vw, 320px"
          />
        ) : null}
        <span className="absolute inset-0 flex items-center justify-center bg-black/25">
          <span className="flex size-12 items-center justify-center rounded-full bg-white/95 text-black shadow-lg">
            <Play className="size-5 fill-current pl-0.5" aria-hidden />
          </span>
        </span>
      </div>
      <div className="p-4">
        <p className="line-clamp-2 text-sm font-bold leading-snug">{video.title}</p>
        {video.published_at ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(video.published_at).toLocaleDateString("en-KE", {
              year: "numeric",
              month: "short",
            })}
          </p>
        ) : null}
      </div>
    </button>
  );
}

export function LearnHubHome() {
  const [query, setQuery] = useState("");
  const [activeFormatFilter, setActiveFormatFilter] = useState<"all" | "reels" | "videos" | "podcasts" | "modules">("all");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [videos, setVideos] = useState<LearnHubItem[]>([]);
  const [articles, setArticles] = useState<LearnHubItem[]>([]);
  const [modules, setModules] = useState<CivicModule[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [v, a, m] = await Promise.all([
          videoData.fetch(),
          contentData.articles.fetch(),
          learningData.modules.fetch(),
        ]);
        if (!cancelled) {
          setVideos(v);
          setArticles(a);
          setModules(m);
        }
      } catch {
        /* seed fallbacks keep UI functional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredVideos = useMemo(() => videos.filter((v) => matchesQuery(v, query)), [videos, query]);
  const filteredArticles = useMemo(() => articles.filter((a) => matchesQuery(a, query)), [articles, query]);
  const filteredModules = useMemo(() => {
    if (!query.trim()) return modules;
    const q = query.trim().toLowerCase();
    return modules.filter(
      (m) =>
        m.title?.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q),
    );
  }, [modules, query]);

  const featured = filteredVideos[0] ?? videos[0];

  return (
    <div className="w-full bg-background pb-20">
      {/* 00 — Hero with Search & Modern Format Switcher */}
      <section className="border-b border-border/40 bg-gradient-to-b from-primary/5 via-muted/10 to-background">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary">
                <Sparkles className="size-3" />
                <span>3 Civic Media Formats · 0 Paywalls</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.08]">
                Understand the budget. <br />
                <span className="text-primary">Keep the civic story.</span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                Experience Kenya&apos;s public finance through 3 distinct formats: 60-second vertical reels, deep-dive investigative videos, and studio audio podcasts.
              </p>

              {/* Format Pills Filter */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {[
                  { id: "all", label: "All Formats" },
                  { id: "reels", label: "01 Reels (60s)", icon: PlaySquare },
                  { id: "videos", label: "02 Videos (Deep)", icon: Film },
                  { id: "podcasts", label: "03 Podcasts (Audio)", icon: Headphones },
                  { id: "modules", label: "04 Modules & Guides", icon: BookOpen },
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setActiveFormatFilter(fmt.id as any)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all",
                      activeFormatFilter === fmt.id
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "border border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {fmt.icon && <fmt.icon className="size-3.5" />}
                    <span>{fmt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Reel Spotlight / Feature Teaser */}
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <Link
                href="/learn/stories"
                className="group relative aspect-[9/15] w-full max-w-[260px] overflow-hidden rounded-3xl border border-border/70 bg-black shadow-2xl transition-transform hover:scale-[1.02]"
              >
                <Image
                  src="/images/marketing newsletter subcribe/Nelly with The Mic.jpg"
                  alt="Watch 60-second budget stories"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-mono font-bold text-white uppercase">
                  <span className="size-1.5 rounded-full bg-white animate-ping" />
                  REELS FEED
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-white/90 text-black shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="size-6 fill-current pl-1" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <p className="font-mono text-[10px] text-amber-400 font-bold uppercase">
                    Format 01 · TikTok & Reels
                  </p>
                  <p className="font-heading text-sm font-extrabold leading-snug">
                    County Budget in 60s
                  </p>
                  <p className="text-[11px] text-white/80 line-clamp-1">
                    Swipeable vertical feed for mobile citizens.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FORMAT 01: REELS & STORIES SCROLL                                         */}
      {/* ========================================================================= */}
      {(activeFormatFilter === "all" || activeFormatFilter === "reels") && (
        <section className="border-b border-border/30 py-12 md:py-16 bg-muted/10">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div className="space-y-1">
                <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
                  01 / Format One · Fast Vertical Scrolls
                </p>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Budget Stories in 60 Seconds
                </h2>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Scroll, drag, or swipe through verifiable civic breakdowns built for mobile feeds.
                </p>
              </div>

              <Link
                href="/learn/stories"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <span>Open Fullscreen Reel Scroller</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* Interactive Reels Scroller Embedded */}
            <div className="pt-2">
              <ReelsScroller reels={DEFAULT_REELS.slice(0, 3)} />
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* FORMAT 02: VIDEOS & DOCUMENTARIES                                         */}
      {/* ========================================================================= */}
      {(activeFormatFilter === "all" || activeFormatFilter === "videos") && (
        <section className="border-b border-border/30 py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div className="space-y-1">
                <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary">
                  02 / Format Two · Deep-Dive Watch
                </p>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Investigative Video Documentaries
                </h2>
                <p className="text-sm text-muted-foreground">
                  Full-length YouTube investigations, town hall debates, and line-item analysis.
                </p>
              </div>

              <Link
                href="/learn/videos"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <span>All videos</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            {/* Featured Master Video */}
            {featured ? (
              <div className="mb-10 overflow-hidden rounded-3xl border border-border/60 bg-black shadow-xl">
                <div className="aspect-[21/9] sm:aspect-[2.4/1] w-full">
                  <iframe
                    src={embedUrl(featured.id)}
                    title={featured.title}
                    className="size-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-5 sm:p-6 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-mono text-xs text-primary font-bold uppercase">
                      Featured Master Documentary
                    </span>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground mt-0.5">
                      {featured.title}
                    </h3>
                  </div>
                  <Link
                    href="/learn/videos"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 shrink-0"
                  >
                    <Play className="size-3.5 fill-current" />
                    <span>Watch Archive</span>
                  </Link>
                </div>
              </div>
            ) : null}

            {/* Video Horizontal Rail */}
            {filteredVideos.length > 0 ? (
              <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:-mx-8 md:px-8 scrollbar-none">
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    active={activeVideo === video.id}
                    onPlay={setActiveVideo}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No videos found.</p>
            )}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* FORMAT 03: PODCASTS & AUDIO DISPATCHES                                    */}
      {/* ========================================================================= */}
      {(activeFormatFilter === "all" || activeFormatFilter === "podcasts") && (
        <section className="border-b border-border/30 py-12 md:py-16 bg-muted/10">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <div className="space-y-1 mb-8">
              <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
                03 / Format Three · Audio & Radio
              </p>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                The Budget Ndio Story Podcast
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl">
                Studio audio breakdowns, county baraza field ambiences, and vernacular radio dispatches.
              </p>
            </div>

            {/* Waveform Podcast Player */}
            <PodcastPlayer />
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* FORMAT 04: STRUCTURED CIVIC MODULES & GUIDES                             */}
      {/* ========================================================================= */}
      {(activeFormatFilter === "all" || activeFormatFilter === "modules") && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div className="space-y-1">
                <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-primary">
                  04 / Format Four · Structured Learning
                </p>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Interactive Modules & Guides
                </h2>
                <p className="text-sm text-muted-foreground">
                  Step-by-step pathways across Kenya&apos;s budget calendar, public participation, and PFM Act laws.
                </p>
              </div>

              <Link
                href="/learn/modules"
                className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <span>All modules</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            {/* Modules Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredModules.slice(0, 6).map((m) => (
                <Link
                  key={m.id}
                  href={`/learn/modules/${m.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                        {m.badge || m.badgeName || "Civic Core"}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {m.steps?.[0]?.estimated_minutes || 15} mins
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {m.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/40 mt-4 flex items-center justify-between text-xs font-bold text-primary">
                    <span>Start Module</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
