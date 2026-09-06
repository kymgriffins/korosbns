"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Radio,
  FileSearch,
  Users2,
  Film,
  Clapperboard,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import {
  studiosEvidenceData,
  type StudioProjectEvidence,
} from "@/data/studios-evidence";
import { cn } from "@/utils";

type DeskFilter = "all" | "connect" | "mashinani" | "wanahabari-lab" | "studios";

interface FilterTab {
  id: DeskFilter;
  label: string;
  count: number;
}

const DESK_CONFIG: Record<
  string,
  {
    name: string;
    number: string;
    pillClass: string;
    accentClass: string;
  }
> = {
  connect: {
    name: "BNS Connect",
    number: "01",
    pillClass: "bg-emerald-600/90 text-white",
    accentClass: "text-emerald-400",
  },
  mashinani: {
    name: "BNS Mashinani",
    number: "02",
    pillClass: "bg-amber-600/90 text-white",
    accentClass: "text-amber-400",
  },
  "wanahabari-lab": {
    name: "Wanahabari Lab",
    number: "03",
    pillClass: "bg-rose-600/90 text-white",
    accentClass: "text-rose-400",
  },
  studios: {
    name: "BNS Studios",
    number: "04",
    pillClass: "bg-primary text-primary-foreground",
    accentClass: "text-primary",
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
  if (contentType.toLowerCase().includes("town hall") || contentType.toLowerCase().includes("listening")) {
    return <Users2 className="size-3" />;
  }
  return <FileSearch className="size-3" />;
}

export function ProgrammesProjectsLoop({
  className,
}: {
  className?: string;
}) {
  const allProjects = useMemo(() => studiosEvidenceData.getAllProjects(), []);
  const [activeFilter, setActiveFilter] = useState<DeskFilter>("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return allProjects;
    return allProjects.filter((p) => p.programmeSlug === activeFilter);
  }, [allProjects, activeFilter]);

  const filterTabs: FilterTab[] = useMemo(() => {
    return [
      { id: "all", label: "All Productions", count: allProjects.length },
      {
        id: "connect",
        label: "Desk 01 · Connect",
        count: allProjects.filter((p) => p.programmeSlug === "connect").length,
      },
      {
        id: "mashinani",
        label: "Desk 02 · Mashinani",
        count: allProjects.filter((p) => p.programmeSlug === "mashinani").length,
      },
      {
        id: "wanahabari-lab",
        label: "Desk 03 · Wanahabari",
        count: allProjects.filter((p) => p.programmeSlug === "wanahabari-lab").length,
      },
      {
        id: "studios",
        label: "Desk 04 · Studios",
        count: allProjects.filter((p) => p.programmeSlug === "studios").length,
      },
    ];
  }, [allProjects]);

  return (
    <section
      id="public-evidence-loop"
      className={cn("py-14 sm:py-18 md:py-20 border-b border-border/40 overflow-hidden", className)}
    >
      <div className={SECTION_SHELL_INNER}>
        {/* Section Identifier & Minimalist Editorial Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Public Evidence Archive · All 4 Desks
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
            Swipe or hover to pause the endless public evidence stream. Click any project to open its dedicated case study.
          </p>
        </div>

        {/* Minimalist Desk Filter Tabs — Edge Scrollable on Mobile */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-4 pt-1">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                data-testid={`filter-tab-${tab.id}`}
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {tab.label}{" "}
                <span
                  className={cn(
                    "ml-1 font-mono text-[10px]",
                    isActive ? "text-background/80" : "text-muted-foreground/80",
                  )}
                >
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Flagship Horizontal Endless Loop / Swipe Reel — No Nested Cards */}
      <div className="relative w-full min-w-0 max-w-full overflow-hidden pt-4">
        {/* Subtle Ambient Left/Right Edge Masks for High-End Gliding */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 sm:w-16 md:w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 sm:w-16 md:w-24 bg-gradient-to-l from-background to-transparent" />

        <Marquee
          pauseOnHover
          repeat={Math.max(2, Math.ceil(8 / Math.max(1, filteredProjects.length)))}
          className="py-2 [--duration:55s] [--gap:1.5rem]"
        >
          {filteredProjects.map((project, idx) => {
            const desk = DESK_CONFIG[project.programmeSlug] || DESK_CONFIG.studios;
            const hasVideo = !!project.media.videoUrl || project.media.type === "video";
            const isAudio = project.media.type === "audio";

            return (
              <Link
                key={`${project.id}-${idx}`}
                href={`/bns-studio/${project.slug}`}
                className="group relative aspect-[16/10] sm:aspect-[16/9] w-[290px] sm:w-[370px] md:w-[410px] shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-muted shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl focus:outline-hidden block"
              >
                {/* Visual Imagery */}
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

                {/* Dark Editorial Gradient Layer */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                {/* Top Info Bar: Desk Pill & Format Pill */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span
                    className={cn(
                      "text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-xs",
                      desk.pillClass,
                    )}
                  >
                    Desk {desk.number} · {desk.name}
                  </span>

                  <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-white/90 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1 border border-white/10">
                    {getFormatIcon(project.media.type, project.contentType)}
                    <span>{project.contentType}</span>
                  </span>
                </div>

                {/* Center Action Indicator (Play / Audio / Inspect) */}
                {(hasVideo || isAudio) && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <span className="flex size-11 sm:size-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md border border-white/25 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground shadow-lg">
                      {hasVideo ? (
                        <Play className="size-5 fill-current ml-0.5" />
                      ) : (
                        <Radio className="size-5" />
                      )}
                    </span>
                  </div>
                )}

                {/* Bottom Captions & Verified Impact Metrics */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10 space-y-1 text-white">
                  {project.impactEvidence?.primaryMetric && (
                    <p className={cn("text-[11px] font-mono font-bold tracking-wide uppercase", desk.accentClass)}>
                      {project.impactEvidence.primaryMetric}
                    </p>
                  )}

                  <h3 className="text-base sm:text-lg font-bold leading-tight tracking-tight text-white line-clamp-1 group-hover:text-white/95">
                    {project.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-white/70">
                    <span className="truncate max-w-[80%]">
                      {project.subtitle || project.organization.name}
                    </span>
                    <span className="flex items-center gap-0.5 text-primary text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                      View <ArrowUpRight className="size-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </Marquee>
      </div>
    </section>
  );
}
