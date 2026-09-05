"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  LayoutGrid,
  PlaySquare,
  Search,
  X,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { PageBreadcrumbs } from "@/components/global/page-breadcrumbs";
import { Routes } from "@/constants/routes";
import { ReelsScroller, DEFAULT_REELS, type ReelItem } from "@/components/learn/reels-scroller";
import { cn } from "@/utils";
import Image from "next/image";

const CATEGORIES = ["All", "Devolution", "Healthcare", "Tax & Budget", "Investigative"];

export function LearnHubStories() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"reel" | "grid">("reel");

  const filtered = useMemo(() => {
    return DEFAULT_REELS.filter((r) => {
      const matchesCat =
        selectedCategory === "All" || r.category.toLowerCase() === selectedCategory.toLowerCase();
      if (!matchesCat) return false;
      if (!query.trim()) return true;
      const q = query.trim().toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.caption.toLowerCase().includes(q) ||
        r.hashtags.some((h) => h.toLowerCase().includes(q))
      );
    });
  }, [query, selectedCategory]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      {/* Context-aware Breadcrumbs */}
      <PageBreadcrumbs
        items={[
          { label: "Learn", href: Routes.Learn },
          { label: "Stories & Reels" },
        ]}
      />

      {/* Header with Title & View Switcher */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border/40 pb-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            <Sparkles className="size-3" />
            <span>Format 01 · 60-Second Short Scrolls</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Budget Stories in Motion
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Swipeable, playable civic explainers breaking down multi-billion shilling policy decisions into 60-second clarity.
          </p>
        </div>

        {/* Action controls: View toggle & Back to Learn */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="inline-flex rounded-full border border-border/60 bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => setViewMode("reel")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                viewMode === "reel"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <PlaySquare className="size-3.5" />
              <span>Reel Feed</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="size-3.5" />
              <span>Grid View</span>
            </button>
          </div>

          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground rounded-full border border-border/60 px-3 py-2"
          >
            <ArrowLeft className="size-3.5" />
            <span>Learn Hub</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-all",
                selectedCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reels & topics…"
            aria-label="Search reels"
            className="h-9 w-full rounded-full border border-border/60 bg-card pl-9 pr-8 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/60"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <p className="font-heading text-lg font-bold text-foreground">No reels found</p>
            <p className="text-xs text-muted-foreground">Try adjusting your search query or category filter.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedCategory("All");
              }}
              className="text-xs font-bold text-primary hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : viewMode === "reel" ? (
          <div className="py-4">
            <ReelsScroller reels={filtered} />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((reel) => (
              <div
                key={reel.id}
                onClick={() => setViewMode("reel")}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div className="relative aspect-[9/16] max-h-[420px] w-full overflow-hidden bg-black">
                  <Image
                    src={reel.posterUrl}
                    alt={reel.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  <span className="absolute top-3 left-3 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-white">
                    {reel.category}
                  </span>

                  <span className="absolute top-3 right-3 font-mono text-[11px] text-white/80 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {reel.duration}
                  </span>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex size-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl">
                      <PlaySquare className="size-7 fill-current pl-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                    <p className="text-xs font-semibold text-amber-400">{reel.author}</p>
                    <h3 className="font-heading text-base font-bold leading-snug line-clamp-2">
                      {reel.title}
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-2">{reel.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
