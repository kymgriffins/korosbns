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
import { cn } from "@/utils";
import { EditorialPill } from "@/components/ui/editorial/editorial-pill";
import { DEFAULT_REELS, type ReelItem } from "@/components/learn/reels-scroller";
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
  const [structuredTab, setStructuredTab] = useState<"all" | "modules" | "videos" | "articles">("all");
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

  const filteredArticles = useMemo(
    () => articles.filter((a) => matchesQuery(a, query)),
    [articles, query],
  );

  const filteredModules = useMemo(
    () => modules.filter((m) => matchesQuery(m, query)),
    [modules, query],
  );

  return (
    <div className="w-full bg-background text-foreground">
      {/* ========================================================================= */}
      {/* 01 — HERO LANDING: EDITORIAL MASTHEAD & THE 4 OPERATIONAL DESKS           */}
      {/* ========================================================================= */}
      <section className="relative border-b border-border/40 bg-gradient-to-b from-primary/5 via-muted/10 to-background pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden">
        <div className={SECTION_SHELL_INNER}>
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <EditorialPill dot pulse>
                Civic Learning Hub
              </EditorialPill>
              <EditorialPill variant="outline">
                Article 201 Sovereign Standard · 0 Paywalls
              </EditorialPill>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.03]">
              Understand the budget. <br />
              <span className="text-primary">Protect the public shilling.</span>
            </h1>

            <p className="text-lg sm:text-xl font-medium text-foreground/80 leading-relaxed max-w-3xl">
              Kenya’s national balance sheet spans KSh 4.82 Trillion. We translate dense exchequer releases, debt amortization tables, and county health ledgers into forensic civic power across three modern media formats.
            </p>

            {/* Quick Format Navigation Jump Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#structured"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-foreground hover:border-primary/60 hover:bg-muted/60 transition-colors shadow-2xs"
              >
                <Layers className="size-3.5 text-primary" />
                <span>01 Structured Learning</span>
              </a>

              <a
                href="#reels"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-foreground hover:border-rose-500/60 hover:bg-muted/60 transition-colors shadow-2xs"
              >
                <PlaySquare className="size-3.5 text-rose-500" />
                <span>02 Reels (60s)</span>
              </a>

              <a
                href="#podcasts"
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-foreground hover:border-amber-500/60 hover:bg-muted/60 transition-colors shadow-2xs"
              >
                <Radio className="size-3.5 text-amber-500" />
                <span>03 Podcasts</span>
              </a>
            </div>

            {/* Universal Search Filter */}
            <div className="relative max-w-xl pt-4">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 mt-2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search modules, video masterclasses, or articles (e.g. debt, PFM Act, county)..."
                aria-label="Search curriculum"
                className="h-12 w-full rounded-full border border-border/70 bg-card pl-11 pr-11 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary shadow-xs transition-colors"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 mt-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
          </div>

          {/* Strategic Anchor: Where the 4 Programmes Breathe */}
          <div className="mt-16 pt-10 border-t border-border/50">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                The 4 Operational Desks Behind The Learning Engine
              </span>
              <Link
                href="/programmes"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>View Full Operational Mandates</span>
                <ArrowRight className="size-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Desk 01 */}
              <div className="p-6 rounded-2xl border border-border/60 bg-card/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                    Desk 01 · BNS Connect
                  </span>
                  <span className="size-2 rounded-full bg-rose-500" />
                </div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  Youth Reels & Digital Feeds
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Translates macro treasury sheets into 60s TikTok & vertical reels for 18–35 digital citizens.
                </p>
                <div className="pt-2 text-[11px] font-mono text-rose-600 dark:text-rose-400 font-semibold">
                  Powers Format 02 · Reels
                </div>
              </div>

              {/* Desk 02 */}
              <div className="p-6 rounded-2xl border border-border/60 bg-card/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                    Desk 02 · BNS Mashinani
                  </span>
                  <span className="size-2 rounded-full bg-emerald-500" />
                </div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  Baraza Audio & Radio
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Grassroots devolution town halls, vernacular radio dispatches, and county spending toolkits.
                </p>
                <div className="pt-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  Powers Format 03 · Podcasts
                </div>
              </div>

              {/* Desk 03 */}
              <div className="p-6 rounded-2xl border border-border/60 bg-card/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                    Desk 03 · Wanahabari Lab
                  </span>
                  <span className="size-2 rounded-full bg-amber-500" />
                </div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  Forensic Inquest & Leaks
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Year-round 364-day budget investigations, OCOB data scrapers, and video documentaries.
                </p>
                <div className="pt-2 text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                  Powers Documentaries & Articles
                </div>
              </div>

              {/* Desk 04 */}
              <div className="p-6 rounded-2xl border border-border/60 bg-card/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-wider">
                    Desk 04 · BNS Academy
                  </span>
                  <span className="size-2 rounded-full bg-primary" />
                </div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  Systematic Civic Curriculum
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Step-by-step modular syllabi, PFM Act certifications, and public participation paths.
                </p>
                <div className="pt-2 text-[11px] font-mono text-primary font-semibold">
                  Powers Civic Modules
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02 — SECTION 01: STRUCTURED LEARNING (Modules, Documentaries, Articles)   */}
      {/* ========================================================================= */}
      <section id="structured" className="py-20 md:py-32 border-b border-border/40 scroll-mt-14">
        <div className={SECTION_SHELL_INNER}>
          <div className="space-y-4 max-w-3xl mb-12">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">
              01 / Format One · Structured Learning & Curriculum
            </span>
            <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground leading-tight">
              Systematic civic literacy from foundation to forensic scrutiny.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Step-by-step learning modules, investigative video masterclasses, and verified policy articles designed for citizen oversight.
            </p>
          </div>

          {/* Segmented Filter Control */}
          <div className="flex flex-wrap items-center gap-2 pb-10 border-b border-border/40">
            {[
              { id: "all", label: "All Structured", count: filteredModules.length + filteredVideos.length + filteredArticles.length },
              { id: "modules", label: "Civic Modules (Academy)", count: filteredModules.length },
              { id: "videos", label: "Video Masterclasses (Wanahabari & Connect)", count: filteredVideos.length },
              { id: "articles", label: "In-Depth Articles (Wanahabari & Mashinani)", count: filteredArticles.length },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStructuredTab(tab.id as any)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer",
                  structuredTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border/60 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                <span>{tab.label}</span>
                <span className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px]",
                  structuredTab === tab.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tab 01 Content: Interactive Civic Modules */}
          {(structuredTab === "all" || structuredTab === "modules") && (
            <div className="py-12 border-b border-border/30 last:border-b-0 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
                    Core Syllabi · Desk 04: BNS Academy
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    Interactive Civic Modules
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-2xl">
                    Structured pathways through Kenya&apos;s budget calendar, public participation requirements, and the PFM Act.
                  </p>
                </div>

                <Link
                  href="/learn/modules"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:underline"
                >
                  <span>Explore All Modules</span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.slice(0, 6).map((m) => (
                  <article
                    key={m.id}
                    className="group rounded-3xl border border-border/60 bg-card p-6 sm:p-7 flex flex-col justify-between shadow-xs hover:border-primary/60 transition-all"
                  >
                    <div className="space-y-4">
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
            </div>
          )}

          {/* Tab 02 Content: Video Masterclasses & Documentaries */}
          {(structuredTab === "all" || structuredTab === "videos") && (
            <div className="py-12 border-b border-border/30 last:border-b-0 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-xs font-bold text-amber-500 uppercase tracking-wider">
                    Deep Dives · Desk 03: Wanahabari Lab & Desk 01
                  </span>
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                    Video Documentaries & Masterclasses
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-2xl">
                    Long-form video inquests, parliamentary committee debates, and town hall recordings.
                  </p>
                </div>

                <Link
                  href="/learn/videos"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:underline"
                >
                  <span>All Video Lectures</span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </div>

              {/* Active Video Player Screen if triggered */}
              {activeVideoId ? (
                <div className="overflow-hidden rounded-3xl border border-border/70 bg-black shadow-2xl">
                  <div className="aspect-video w-full">
                    <iframe
                      src={embedUrl(activeVideoId)}
                      title="Investigative Video"
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
                      className="text-xs font-mono font-bold text-muted-foreground hover:text-foreground px-3 py-1 rounded-full border border-border"
                    >
                      Close Player
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.slice(0, 6).map((video) => (
                  <div
                    key={video.id}
                    className="group rounded-3xl border border-border/60 bg-card overflow-hidden shadow-xs hover:border-primary/60 transition-all flex flex-col justify-between"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveVideoId(video.id)}
                      className="relative aspect-video w-full overflow-hidden bg-muted block text-left"
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
                        <div className="size-12 rounded-full bg-white/95 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="size-5 fill-current pl-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-sm bg-black/80 text-[10px] font-mono text-white font-bold">
                        Video Lecture
                      </span>
                    </button>

                    <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="font-mono text-[10px] uppercase font-bold text-amber-500">
                          Wanahabari Syndicate
                        </span>
                        <h4 className="font-heading text-lg font-bold text-foreground leading-snug line-clamp-2">
                          {video.title}
                        </h4>
                      </div>

                      <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono text-muted-foreground">
                        <span>{video.published_at ? new Date(video.published_at).toLocaleDateString("en-KE", { year: "numeric", month: "short" }) : "Verified"}</span>
                        <button
                          type="button"
                          onClick={() => setActiveVideoId(video.id)}
                          className="font-bold text-primary hover:underline cursor-pointer"
                        >
                          Watch Now →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 03 Content: In-Depth Articles & Forensic Briefs */}
          {(structuredTab === "all" || structuredTab === "articles") && (
            <div className="py-12 border-b border-border/30 last:border-b-0 space-y-8">
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-emerald-500 uppercase tracking-wider">
                  Prose Analyses · Desk 03 & Desk 02
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                  In-Depth Articles & Policy Briefs
                </h3>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Prose-aware journalistic investigations into contingent liabilities, supplementary budgets, and county spending anomalies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.slice(0, 4).map((art) => (
                  <Link
                    key={art.id}
                    href={`/learn/${art.slug || art.id}`}
                    className="group rounded-3xl border border-border/60 bg-card p-7 sm:p-8 flex flex-col justify-between shadow-xs hover:border-primary/60 transition-all space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                          Policy Brief
                        </span>
                        <span className="text-muted-foreground">
                          5 min read
                        </span>
                      </div>

                      <h4 className="font-heading text-xl sm:text-2xl font-black text-foreground group-hover:text-primary transition-colors leading-snug">
                        {art.title}
                      </h4>

                      <p className="text-sm sm:text-base text-foreground/80 leading-relaxed line-clamp-3">
                        {art.summary || "A detailed investigative breakdown by BNS fellows examining line-item disbursement realities."}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono">
                      <span className="text-muted-foreground">Audited Desk Dispatch</span>
                      <span className="font-bold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Read Full Analysis</span>
                        <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Cross-link to raw documents */}
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
      {/* 03 — SECTION 02: REELS (Vertical Shorts Gateway — No Inline Hijacking)     */}
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

          {/* 4 Sleek Vertical Reel Preview Cards (No full snap scroller inline) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEFAULT_REELS.slice(0, 4).map((reel) => (
              <Link
                key={reel.id}
                href="/learn/stories"
                className="group relative aspect-[9/16] overflow-hidden rounded-3xl border border-border/60 bg-black shadow-lg transition-transform hover:scale-[1.02]"
              >
                <Image
                  src={reel.posterUrl}
                  alt={reel.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
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
                  <Sparkles className="size-3.5" />
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
      {/* 04 — SECTION 03: PODCASTS (Audio Lounge & Field Dispatches)               */}
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

          {/* Interactive Waveform Podcast Player */}
          <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-10 shadow-sm">
            <PodcastPlayer />
          </div>

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
