"use client";

import { Marquee } from "@/components/ui/marquee";
import {
  studiosEvidenceData
} from "@/data/studios-evidence";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";
import {
  ArrowUpRight,
  Clapperboard,
  FileSearch,
  Film,
  LayoutGrid,
  Play,
  Radio,
  Search,
  Users2,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

type DeskFilter =
  | "all"
  | "connect"
  | "mashinani"
  | "wanahabari-lab"
  | "studios";

interface FilterTab {
  id: DeskFilter;
  label: string;
  count: number;
}

const PROGRAMME_CONFIG: Record<
  string,
  {
    name: string;
    number: string;
    pillClass: string;
    accentClass: string;
    href: string;
  }
> = {
  connect: {
    name: "BNS Connect",
    number: "01",
    pillClass: "bg-emerald-600/90 text-white",
    accentClass: "text-emerald-400",
    href: "/programmes/connect",
  },
  mashinani: {
    name: "BNS Mashinani",
    number: "02",
    pillClass: "bg-amber-600/90 text-white",
    accentClass: "text-amber-400",
    href: "/programmes/mashinani",
  },
  "wanahabari-lab": {
    name: "Wanahabari Lab",
    number: "03",
    pillClass: "bg-rose-600/90 text-white",
    accentClass: "text-rose-400",
    href: "/programmes/wanahabari-lab",
  },
  studios: {
    name: "BNS Studio",
    number: "Studio",
    pillClass: "bg-primary text-primary-foreground",
    accentClass: "text-primary",
    href: "/bns-studio",
  },
};

function getFormatIcon(type: string, contentType: string) {
  if (type === "video" || contentType.toLowerCase().includes("video")) {
    return <Play className="size-3 fill-current" />;
  }
  if (type === "audio" || contentType.toLowerCase().includes("podcast")) {
    return <Radio className="size-3" />;
  }
  if (contentType.toLowerCase().includes("animation")) {
    return <Clapperboard className="size-3" />;
  }
  if (
    contentType.toLowerCase().includes("town hall") ||
    contentType.toLowerCase().includes("listening")
  ) {
    return <Users2 className="size-3" />;
  }
  return <FileSearch className="size-3" />;
}

export function ProgrammesProjectsLoop({ className }: { className?: string }) {
  const allProjects = useMemo(() => studiosEvidenceData.getAllProjects(), []);
  const [activeFilter, setActiveFilter] = useState<DeskFilter>("all");
  const [viewMode, setViewMode] = useState<"grid" | "reel">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredProjects = useMemo(() => {
    let list = allProjects;
    if (activeFilter !== "all") {
      list = list.filter((p) => p.programmeSlug === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const haystack = [
          p.title,
          p.subtitle || "",
          p.organization.name,
          p.contentType,
          p.briefChallenge,
          ...(p.tags || []),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }
    return list;
  }, [allProjects, activeFilter, searchQuery]);

  const filterTabs: FilterTab[] = useMemo(() => {
    return [
      { id: "all", label: "All Productions", count: allProjects.length },
      {
        id: "connect",
        label: " Connect",
        count: allProjects.filter((p) => p.programmeSlug === "connect").length,
      },
      {
        id: "mashinani",
        label: " Mashinani",
        count: allProjects.filter((p) => p.programmeSlug === "mashinani")
          .length,
      },
      {
        id: "wanahabari-lab",
        label: " Wanahabari",
        count: allProjects.filter((p) => p.programmeSlug === "wanahabari-lab")
          .length,
      },
      {
        id: "studios",
        label: " Studios",
        count: allProjects.filter((p) => p.programmeSlug === "studios").length,
      },
    ];
  }, [allProjects]);

  const isFiltered = activeFilter !== "all" || searchQuery.trim().length > 0;

  return (
    <section
      id="public-evidence-loop"
      className={cn(
        "py-12 sm:py-16 md:py-20 border-b border-border/40 overflow-hidden bg-background/50",
        className,
      )}
    >
      <div className={SECTION_SHELL_INNER}>
        {/* Section Identifier & Minimalist Editorial Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Public Evidence Archive · Programmes & Studio
              </span>
              <span className="h-px w-10 bg-primary/40" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
                {allProjects.length} Verified Productions
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-foreground leading-[1.06] tracking-tight">
              The work in motion. Screenings, barazas, animations, and audits.
            </h2>
          </div>

          <p className="text-sm text-muted-foreground max-w-sm sm:text-right font-normal">
            Swipe or search to inspect civic evidence. Click any project to open
            its dedicated case study or research dossier.
          </p>
        </div>

        {/* Search & Desk Filter Control Bar — Mobile Zero-Scroll Friendly */}
        <div className="space-y-3 pt-1 pb-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects (e.g. Terra, Treasury, Podcast, Nakuru)..."
                className="w-full rounded-full border border-border/60 bg-muted/30 pl-9 pr-9 py-2 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>

            {/* Results Counter & Reset */}
            {isFiltered && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground self-start sm:self-center">
                <span className="font-mono">
                  {filteredProjects.length} of {allProjects.length} shown
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter("all");
                    setSearchQuery("");
                  }}
                  className="text-primary hover:underline font-medium text-xs ml-1"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          {/* Controls row: Desk filter tabs + View mode switcher (Grid / Reel) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
            {/* Minimalist Desk Filter Tabs — Edge Scrollable on Mobile */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    data-testid={`filter-tab-${tab.id}`}
                    onClick={() => setActiveFilter(tab.id)}
                    className={cn(
                      "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer min-h-[34px]",
                      isActive
                        ? "bg-foreground text-background font-semibold shadow-xs"
                        : "bg-muted/50 border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {tab.label}{" "}
                    <span
                      className={cn(
                        "ml-1 font-mono text-[10px]",
                        isActive
                          ? "text-background/80"
                          : "text-muted-foreground/80",
                      )}
                    >
                      ({tab.count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* View Mode Toggle: Grid View vs Reel Loop */}
            <div className="flex items-center gap-1 self-start md:self-auto shrink-0 bg-muted/40 p-1 rounded-full border border-border/60">
              <button
                type="button"
                data-testid="view-toggle-grid"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer",
                  viewMode === "grid"
                    ? "bg-background text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={viewMode === "grid"}
              >
                <LayoutGrid className="size-3.5" />
                <span>Grid View</span>
              </button>
              <button
                type="button"
                data-testid="view-toggle-reel"
                onClick={() => setViewMode("reel")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all cursor-pointer",
                  viewMode === "reel"
                    ? "bg-background text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={viewMode === "reel"}
              >
                <Film className="size-3.5" />
                <span>Reel Loop</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Projects Display: Grid View (Default & when searching) OR Reel Loop */}
      {viewMode === "grid" || searchQuery.trim() ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, idx) => {
                const programmeMeta =
                  PROGRAMME_CONFIG[project.programmeSlug] || PROGRAMME_CONFIG.studios;
                const href = programmeMeta.href;

                return (
                  <Link
                    key={`${project.id}-grid-${idx}`}
                    href={href}
                    className="group relative aspect-[16/10] sm:aspect-[16/9] w-full cursor-pointer overflow-hidden rounded-2xl bg-muted shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:outline-hidden block"
                  >
                    <Image
                      src={project.media.posterUrl}
                      alt={project.title}
                      fill
                      className={cn(
                        "object-cover transition-transform duration-700 ease-out group-hover:scale-105",
                        project.media.posterPosition || "object-center",
                      )}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                    <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 z-10">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-sm",
                          programmeMeta.pillClass,
                        )}
                      >
                        <span className="font-mono text-[9px] opacity-80">
                          {programmeMeta.number}
                        </span>
                        <span>{programmeMeta.name}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/60 text-white/90 backdrop-blur-md border border-white/10">
                        {getFormatIcon(project.media.type, project.contentType)}
                        <span>{project.contentType}</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3.5 inset-x-3.5 z-10 space-y-1">
                      <p className="text-[11px] font-mono text-white/70 tracking-wider uppercase line-clamp-1">
                        {project.organization.name}
                      </p>
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug group-hover:text-primary-foreground transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      <div className="flex items-center justify-between text-[11px] text-white/60 pt-1 border-t border-white/10">
                        <span className="font-mono">{project.year}</span>
                        <span className="inline-flex items-center gap-1 text-white font-medium group-hover:translate-x-0.5 transition-transform">
                          View Programme <ArrowUpRight className="size-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center border border-dashed border-border/60 rounded-2xl p-8 bg-muted/20">
              <FileSearch className="size-12 mx-auto text-muted-foreground/40 mb-3" />
              <h3 className="text-lg font-bold text-foreground mb-1">
                No productions found matching &ldquo;{searchQuery}&rdquo;
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
                Try searching for another topic (e.g. &ldquo;Terra&rdquo;,
                &ldquo;Treasury&rdquo;, &ldquo;Podcast&rdquo;, or
                &ldquo;Nakuru&rdquo;).
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                Clear Search Query
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Flagship Horizontal Endless Loop / Swipe Reel When No Search Query Is Active */
        <div className="relative w-full min-w-0 max-w-full overflow-hidden pt-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-16 md:w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-16 md:w-24 bg-gradient-to-l from-background to-transparent" />

          <Marquee
            pauseOnHover
            repeat={Math.max(
              2,
              Math.ceil(8 / Math.max(1, filteredProjects.length)),
            )}
            className="py-2 [--duration:55s] [--gap:1.5rem]"
          >
            {filteredProjects.map((project, idx) => {
              const programmeMeta =
                PROGRAMME_CONFIG[project.programmeSlug] || PROGRAMME_CONFIG.studios;
              const href = programmeMeta.href;

              return (
                <Link
                  key={`${project.id}-${idx}`}
                  href={href}
                  className="group relative aspect-[16/10] sm:aspect-[16/9] w-[290px] sm:w-[370px] md:w-[410px] shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-muted shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:outline-hidden block"
                >
                  <Image
                    src={project.media.posterUrl}
                    alt={project.title}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-700 ease-out group-hover:scale-105",
                      project.media.posterPosition || "object-center",
                    )}
                    sizes="(max-width: 640px) 290px, (max-width: 1024px) 370px, 410px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 z-10">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-sm",
                        programmeMeta.pillClass,
                        )}
                      >
                        <span className="font-mono text-[9px] opacity-80">
                          {programmeMeta.number}
                        </span>
                        <span>{programmeMeta.name}</span>
                      </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/60 text-white/90 backdrop-blur-md border border-white/10">
                      {getFormatIcon(project.media.type, project.contentType)}
                      <span>{project.contentType}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 inset-x-3.5 z-10 space-y-1">
                    <p className="text-[11px] font-mono text-white/70 tracking-wider uppercase line-clamp-1">
                      {project.organization.name}
                    </p>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug group-hover:text-primary-foreground transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <div className="flex items-center justify-between text-[11px] text-white/60 pt-1 border-t border-white/10">
                      <span className="font-mono">{project.year}</span>
                      <span className="inline-flex items-center gap-1 text-white font-medium group-hover:translate-x-0.5 transition-transform">
                        Inspect <ArrowUpRight className="size-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </Marquee>
        </div>
      )}
    </section>
  );
}
