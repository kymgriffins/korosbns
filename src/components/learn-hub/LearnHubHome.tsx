"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Film,
  Headphones,
  Heart,
  Layers,
  MessageCircle,
  Play,
  PlaySquare,
  Radio,
  Search,
  Trophy,
  X,
} from "lucide-react";
import type { CivicModule, LearnHubItem } from "@/types/learn";
import { contentData } from "@/data/content";
import { learningData } from "@/data/learning";
import { embedUrl, videoData } from "@/data/videos";
import { cn } from "@/utils";
import { EditorialPill } from "@/components/ui/editorial/editorial-pill";
import { DEFAULT_REELS } from "@/components/learn/reels-scroller";
import { PodcastPlayer } from "@/components/learn/podcast-player";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";

function matchesQuery(item: { title?: string; summary?: string; description?: string }, q: string): boolean {
  if (!q.trim()) return true;
  const query = q.trim().toLowerCase();
  return (
    (item.title?.toLowerCase().includes(query) ?? false) ||
    (item.summary?.toLowerCase().includes(query) ?? false) ||
    (item.description?.toLowerCase().includes(query) ?? false)
  );
}

export function LearnHubHome() {
  const [query, setQuery] = useState("");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

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

  const filteredVideos = useMemo(
    () => videos.filter((v) => matchesQuery(v, query)),
    [videos, query],
  );

  const filteredModules = useMemo(
    () => modules.filter((m) => matchesQuery(m, query)),
    [modules, query],
  );

  return (
    <div className="w-full bg-background text-foreground selection:bg-primary/20">
      {/* ========================================================================= */}
      {/* 01 — HERO LANDING: FULL VIEWPORT & UNNESTED TIKTOK-STYLE HIGHLIGHT        */}
      {/* ========================================================================= */}
      <section className="relative min-h-[calc(100dvh-4rem)] flex flex-col justify-center py-16 md:py-24 overflow-hidden bg-gradient-to-b from-primary/5 via-muted/10 to-background">
        <div className={SECTION_SHELL_INNER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <EditorialPill dot pulse>
                  Civic Learning Hub
                </EditorialPill>
                <EditorialPill variant="outline">
                  Article 201 Sovereign Standard · 0 Paywalls
                </EditorialPill>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.03]">
                Understand the budget. <br />
                <span className="text-primary">Protect the public shilling.</span>
              </h1>

              <p className="text-lg sm:text-xl font-normal text-foreground/80 leading-relaxed max-w-2xl">
                Kenya’s national balance sheet spans KSh 4.82 Trillion. We translate dense exchequer releases, debt amortization tables, and county health ledgers into forensic civic power across three modern media formats.
              </p>

              {/* Quick Format Navigation Jump Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="#modules"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:border-primary/60 hover:bg-muted/60 transition-colors shadow-2xs"
                >
                  <Layers className="size-3.5 text-primary" />
                  <span>01 Modules & Videos</span>
                </a>

                <a
                  href="#reels"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:border-rose-500/60 hover:bg-muted/60 transition-colors shadow-2xs"
                >
                  <PlaySquare className="size-3.5 text-rose-500" />
                  <span>02 Reels (60s)</span>
                </a>

                <a
                  href="#podcasts"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:border-amber-500/60 hover:bg-muted/60 transition-colors shadow-2xs"
                >
                  <Radio className="size-3.5 text-amber-500" />
                  <span>03 Podcasts</span>
                </a>
              </div>

              {/* Universal Search Filter */}
              <div className="relative max-w-xl pt-3">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 mt-1.5 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search modules, videos, or debt topics (e.g. PFM Act, devolution, debt)..."
                  aria-label="Search curriculum"
                  className="h-12 w-full rounded-full border border-border/70 bg-card pl-11 pr-11 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary shadow-xs transition-colors"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 mt-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Right Side: Standalone TikTok Layout Without Nested Card */}
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <Link
                href="/learn/stories"
                className="group relative block aspect-[9/16] w-full max-w-[280px] sm:max-w-[300px] overflow-hidden rounded-[2.2rem] bg-black shadow-2xl transition-all duration-500 hover:shadow-primary/25 hover:-translate-y-1.5"
              >
                {/* 9:16 Video Poster & Live Preview */}
                <video
                  src="https://bns.stratapointadvisory.org/0cd8319a419e6b3749a7206ba4d68801.mp4"
                  poster="/images/reels/reel-01-poster.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
                  aria-label="Highlight of the Week reel video"
                />
                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

                {/* Top Badge: SOTD / Highlight of the Week */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/20">
                    <Trophy className="size-3 text-amber-400" />
                    <span>Highlight of Week</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-white/90 font-bold bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>WK 36</span>
                  </div>
                </div>

                {/* Center Floating Play Glyph */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className="size-14 rounded-full bg-white/90 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                    <Play className="size-6 fill-current pl-1" />
                  </div>
                </div>

                {/* Floating Right Interaction Column (True TikTok UI) */}
                <div className="absolute right-3 bottom-20 flex flex-col items-center gap-3 z-10 text-white text-[10px] font-bold pointer-events-none">
                  <div className="flex flex-col items-center">
                    <div className="size-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-rose-500/80 transition-colors">
                      <Heart className="size-4 fill-white text-white" />
                    </div>
                    <span className="mt-0.5">12.4K</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="size-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
                      <MessageCircle className="size-4 text-white" />
                    </div>
                    <span className="mt-0.5">842</span>
                  </div>
                </div>

                {/* TikTok Bottom Metadata */}
                <div className="absolute bottom-4 left-4 right-14 z-10 text-white space-y-1 pointer-events-none">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                    <span>@nellymaina</span>
                    <span className="size-1 rounded-full bg-primary" />
                    <span className="text-[10px] text-white/70">BNS Lead</span>
                  </div>
                  <p className="text-sm font-bold leading-snug line-clamp-2">
                    County Budget Explained in 60s
                  </p>
                  <p className="text-[11px] text-white/75 line-clamp-1">
                    How KSh 420B moves from Treasury to local dispensaries.
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[10px] font-mono font-bold text-primary">
                    <span className="bg-primary/20 text-primary-foreground/90 px-1.5 py-0.5 rounded">2:16</span>
                    <span className="text-white/80">124K Views</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02 — FORMAT 01: PUNCHY INTERACTIVE MODULES & VIDEO MASTERCLASSES          */}
      {/* ========================================================================= */}
      <section id="modules" className="py-20 md:py-32 border-b border-border/40 scroll-mt-14">
        <div className={SECTION_SHELL_INNER}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-3xl">
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
                01 / Format One · Interactive Modules & Masterclasses
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground leading-tight">
                Systematic civic literacy with built-in videos & forensic prose.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                No fragmented tabs: each interactive module combines full video lectures, journalistic reading canvases, and interactive quizzes inside.
              </p>
            </div>

            <Link
              href="/learn/modules"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:underline shrink-0"
            >
              <span>Explore All Modules</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          {/* Active Video Lecture Screen if triggered */}
          {activeVideoId ? (
            <div className="mb-12 overflow-hidden rounded-3xl border border-border/70 bg-black shadow-2xl">
              <div className="aspect-video w-full">
                <iframe
                  src={embedUrl(activeVideoId)}
                  title="Investigative Video Lecture"
                  className="size-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-4 bg-card flex items-center justify-between">
                <p className="text-sm font-bold text-foreground">
                  {filteredVideos.find((v) => v.id === activeVideoId)?.title}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveVideoId(null)}
                  className="text-xs font-mono font-bold text-muted-foreground hover:text-foreground px-3 py-1 rounded-full border border-border cursor-pointer"
                >
                  Close Video Player
                </button>
              </div>
            </div>
          ) : null}

          {/* Punchy Modules Grid (Video + Prose + Quiz built right in) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.slice(0, 6).map((m) => (
              <article
                key={m.id}
                className="group rounded-3xl border border-border/60 bg-card p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-primary/60 hover:-translate-y-1 transition-all"
              >
                <div className="space-y-4">
                  {/* Metadata Row: Desk & Multi-Format Pill */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold">
                      {m.badge || m.badgeName || "Civic Core"}
                    </span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="size-3.5" />
                      <span>{m.steps?.[0]?.estimated_minutes || 15} mins</span>
                    </div>
                  </div>

                  <h4 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {m.title}
                  </h4>

                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {m.description}
                  </p>

                  {/* Multi-Modal Badge Indicator */}
                  <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-sm bg-muted/60 px-2 py-0.5 border border-border/60">
                      <Film className="size-3 text-amber-500" /> Video
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-sm bg-muted/60 px-2 py-0.5 border border-border/60">
                      <FileText className="size-3 text-emerald-500" /> Prose
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-sm bg-muted/60 px-2 py-0.5 border border-border/60">
                      <CheckCircle2 className="size-3 text-primary" /> Quiz
                    </span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">
                    {m.steps?.length || 4} Lessons
                  </span>
                  <Link
                    href={`/learn/modules/${m.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform"
                  >
                    <span>Start Module</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Integrated Video Masterclass Rail */}
          {filteredVideos.length > 0 && (
            <div className="mt-14 pt-10 border-t border-border/40 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                    Featured Video Masterclasses
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Documentaries & field town halls produced by Wanahabari Lab & BNS Connect.
                  </p>
                </div>
                <Link
                  href="/learn/videos"
                  className="text-xs font-mono font-bold text-primary uppercase hover:underline"
                >
                  All Videos →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.slice(0, 3).map((video) => (
                  <div
                    key={video.id}
                    className="group rounded-3xl border border-border/60 bg-card overflow-hidden shadow-xs hover:border-primary/60 transition-all flex flex-col justify-between"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveVideoId(video.id)}
                      className="relative aspect-video w-full overflow-hidden bg-muted block text-left cursor-pointer"
                      aria-label={`Play ${video.title}`}
                    >
                      {video.thumbnail_url ? (
                        <Image
                          src={video.thumbnail_url}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="size-11 rounded-full bg-white/95 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="size-4 fill-current pl-0.5 text-primary" />
                        </div>
                      </div>
                      <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-sm bg-black/80 text-[10px] font-mono text-white font-bold">
                        Masterclass
                      </span>
                    </button>

                    <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                      <h4 className="font-heading text-base font-bold text-foreground leading-snug line-clamp-2">
                        {video.title}
                      </h4>
                      <div className="pt-2 flex items-center justify-between text-xs font-mono text-muted-foreground">
                        <span>Wanahabari Lab</span>
                        <button
                          type="button"
                          onClick={() => setActiveVideoId(video.id)}
                          className="font-bold text-primary hover:underline cursor-pointer"
                        >
                          Play Now →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Open Document Archive Jump */}
          <div className="mt-12 rounded-2xl border border-border/60 bg-muted/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-heading text-base font-bold text-foreground">
                Looking for raw Treasury PDFs & County Budget Estimates?
              </p>
              <p className="text-xs text-muted-foreground">
                Browse our open, guest-accessible document archive with downloadable official publications.
              </p>
            </div>
            <Link
              href="/learn/documents"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-foreground hover:bg-muted transition-colors shrink-0"
            >
              <FileText className="size-3.5 text-primary" />
              <span>Open Document Vault</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04 — FORMAT 02: REELS (60-SECOND VERTICAL SHORTS GATEWAY)                  */}
      {/* ========================================================================= */}
      <section id="reels" className="py-20 md:py-32 border-b border-border/40 bg-muted/5 scroll-mt-14">
        <div className={SECTION_SHELL_INNER}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-rose-500 uppercase tracking-widest">
                  02 / Format Two · Fast Vertical Feeds
                </span>
                <span className="text-muted-foreground font-mono text-xs">· Powered by Desk 01: BNS Connect</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground leading-tight">
                Budget stories in 60 seconds.
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Bilingual Sheng & Swahili vertical explainers built for mobile feeds, breaking down 400-page accounting sheets into 60-second clarity.
              </p>
            </div>

            <Link
              href="/learn/stories"
              className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-rose-700 transition-colors shadow-xs shrink-0"
            >
              <PlaySquare className="size-4" />
              <span>Launch Reel Scroller</span>
            </Link>
          </div>

          {/* Vertical Reel Preview Cards — Single on mobile to avoid squeezing, 4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEFAULT_REELS.slice(0, 4).map((reel, idx) => (
              <Link
                key={reel.id}
                href="/learn/stories"
                className={cn(
                  "group relative aspect-[9/16] overflow-hidden rounded-3xl border border-border/60 bg-black shadow-lg transition-transform hover:scale-[1.02]",
                  idx > 0 && "hidden sm:block",
                  idx === 0 && "w-full max-w-[320px] mx-auto sm:max-w-none"
                )}
              >
                <Image
                  src={reel.posterUrl}
                  alt={reel.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40" />

                {/* Top Overlay Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-white font-bold">
                  <span className="px-2 py-0.5 rounded-full bg-rose-600/90 backdrop-blur-xs">
                    {reel.duration}
                  </span>
                  <span className="text-white/80">
                    {reel.likes.toLocaleString()} views
                  </span>
                </div>

                {/* Center Play Indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-12 rounded-full bg-white/90 text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="size-5 fill-current pl-0.5" />
                  </div>
                </div>

                {/* Bottom Metadata */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <span className="font-mono text-[9px] text-amber-400 font-bold uppercase tracking-wider">
                    {reel.category}
                  </span>
                  <h4 className="font-heading text-sm sm:text-base font-black leading-snug line-clamp-2">
                    {reel.title}
                  </h4>
                  <p className="text-[11px] text-white/75 font-mono">
                    {reel.author}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Fullscreen Reel Scroller Invitation Callout */}
          <div className="mt-12 rounded-3xl border border-border/70 bg-card p-6 sm:p-10 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-rose-500 uppercase tracking-wider">
                  <span>Independent Immersive Experience</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  Looking for continuous vertical swipe & keyboard controls?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our dedicated Reels Page features an uninterrupted TikTok-style snap-scroll canvas with audio controls, verified comments, like counters, and seamless keyboard navigation.
                </p>
              </div>

              <Link
                href="/learn/stories"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm shrink-0"
              >
                <span>Open Fullscreen Reel Feed</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05 — FORMAT 03: PODCASTS (AUDIO LOUNGE & FIELD DISPATCHES)                 */}
      {/* ========================================================================= */}
      <section id="podcasts" className="py-20 md:py-32 scroll-mt-14">
        <div className={SECTION_SHELL_INNER}>
          <div className="space-y-4 max-w-3xl mb-12">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-500 uppercase tracking-widest">
                03 / Format Three · Audio Lounge & Radio
              </span>
              <span className="text-muted-foreground font-mono text-xs">· Powered by Desk 02 & 03</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground leading-tight">
              The Budget Ndio Story Podcast.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Studio investigative audio, county baraza field ambiences, and vernacular radio dispatches capturing citizen voices from Kenya&apos;s 47 counties.
            </p>
          </div>

          {/* Interactive Waveform Podcast Player — Unnested, zero outer borders */}
          <PodcastPlayer />

          {/* Civic Commons Closing Sign-Off */}
          <div className="mt-16 pt-10 border-t border-border/40 flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs font-mono text-muted-foreground">
            <div className="space-y-1">
              <p className="font-bold text-foreground text-sm">
                Budget Ndio Story · Open Civic Learning Commons
              </p>
              <p>
                All curriculum materials published under Article 201 Constitution of Kenya. Zero paywalls.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-foreground">
              <Link href="/learn/forum" className="hover:text-primary transition-colors">
                Community Forum
              </Link>
              <span>·</span>
              <Link href="/learn/profile" className="hover:text-primary transition-colors">
                My Learning Hub
              </Link>
              <span>·</span>
              <Link href="/programmes" className="hover:text-primary transition-colors">
                The 4 Operational Desks
              </Link>
              <span>·</span>
              <Link href="/reports" className="hover:text-primary transition-colors">
                Audited Reports
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
