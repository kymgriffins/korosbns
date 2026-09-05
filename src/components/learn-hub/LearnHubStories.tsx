"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  LayoutGrid,
  PlaySquare,
  Search,
  X,
} from "lucide-react";
import { ReelsScroller, DEFAULT_REELS, type ReelItem } from "@/components/learn/reels-scroller";
import { cn } from "@/utils";
import Image from "next/image";

const CATEGORIES = ["All", "Devolution", "Healthcare", "Tax & Budget", "Investigative"];

export function LearnHubStories() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"reel" | "grid">("reel");
  const [activeReelIndex, setActiveReelIndex] = useState(0);

  // Lock body scroll so reels page is 100% fixed with zero outer page movement
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

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
    <div className="fixed inset-0 z-50 h-dvh w-screen overflow-hidden bg-black text-white flex flex-col select-none">
      {/* 01 — FLOATING GLASS HEADER */}
      <header className="absolute top-0 left-0 right-0 z-30 flex h-14 sm:h-16 items-center justify-between gap-4 px-4 sm:px-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-auto">
        {/* Exit to Learn */}
        <div className="flex items-center gap-3">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 px-3.5 py-1.5 text-xs font-bold text-white transition-colors backdrop-blur-md border border-white/10"
            title="Exit to Learn Hub"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden xs:inline">Exit to</span>
            <span>Learn</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 pl-2">
            <span className="text-xs font-bold text-white/90">Stories &amp; Reels</span>
            <span className="text-[11px] font-mono text-white/60">· 60s Civic Mobile</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[50vw] py-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                selectedCategory === cat
                  ? "bg-white text-black shadow-xs"
                  : "bg-black/50 text-white/70 hover:bg-white/15 hover:text-white border border-white/15",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full bg-black/60 p-0.5 border border-white/15 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewMode("reel")}
              aria-label="Feed mode"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-colors",
                viewMode === "reel" ? "bg-white text-black" : "text-white/70 hover:text-white",
              )}
            >
              <PlaySquare className="size-3.5" />
              <span className="hidden sm:inline">Feed</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid mode"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition-colors",
                viewMode === "grid" ? "bg-white text-black" : "text-white/70 hover:text-white",
              )}
            >
              <LayoutGrid className="size-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>
      </header>

      {/* 02 — REELS FEED VIEW (FIXED FULLSCREEN) */}
      {viewMode === "reel" ? (
        <div className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center pt-14 sm:pt-16 pb-2">
          {filtered.length === 0 ? (
            <div className="text-center space-y-3 p-6 max-w-sm">
              <p className="text-base font-bold text-white">No reels found</p>
              <p className="text-xs text-white/60">Try selecting &ldquo;All&rdquo; categories.</p>
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className="text-xs font-bold text-primary hover:underline"
              >
                Reset filter
              </button>
            </div>
          ) : (
            <ReelsScroller key={`scroller-${activeReelIndex}`} reels={filtered} isFixedFullscreen={true} initialIndex={activeReelIndex} />
          )}
        </div>
      ) : (
        /* 03 — GRID VIEW */
        <div className="flex-1 w-full overflow-y-auto pt-20 pb-12 px-4 sm:px-8 max-w-5xl mx-auto scrollbar-none">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((reel, idx) => (
              <div
                key={reel.id}
                onClick={() => {
                  setActiveReelIndex(idx);
                  setViewMode("reel");
                }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-zinc-950 shadow-md transition-all hover:border-primary/60 hover:scale-[1.01]"
              >
                <div className="relative aspect-[9/16] max-h-[440px] w-full overflow-hidden bg-black">
                  <Image
                    src={reel.posterUrl}
                    alt={reel.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40" />

                  <span className="absolute top-3 left-3 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase text-white">
                    {reel.category}
                  </span>

                  <span className="absolute top-3 right-3 font-mono text-[11px] text-white/80 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-xs">
                    {reel.duration}
                  </span>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-xl">
                      <PlaySquare className="size-7 fill-current pl-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1.5">
                    <p className="text-xs font-semibold text-amber-400">{reel.author}</p>
                    <h3 className="text-base font-bold leading-snug line-clamp-2">
                      {reel.title}
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-2">{reel.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

