"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Search, X } from "lucide-react";
import { LandingSection } from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { studiosEvidenceData } from "@/data/studios-evidence";
import {
  getReelsByProgramme,
  programmesContent,
  sanitizeMediaUrl,
  type ProgrammeSlug,
} from "@/content";
import { cn } from "@/utils";
import { MediaEmbed } from "@/components/ui/media-embed";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SEED_CTA = (
  programmesContent as {
    landing?: { featuredIntro?: { openProjectLabel?: string; watchReelLabel?: string } };
  }
).landing?.featuredIntro;

interface ProgrammeProjectGridProps {
  programmeSlug: ProgrammeSlug;
  eyebrow?: string;
  headline?: string;
  description?: string;
  openProjectLabel?: string;
  watchReelLabel?: string;
  showReels?: boolean;
  className?: string;
}

type GridItem = {
  type: "project" | "reel";
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  contentType: string;
  year: string;
  posterUrl: string;
  href: string;
  videoUrl?: string;
  metric?: string;
  tags?: string[];
};

export function ProgrammeProjectGrid({
  programmeSlug,
  eyebrow = "Verified outputs",
  headline = "Tangible projects from this programme",
  description = "Every claim is backed by a published documentary, dataset, explainer, or civic forum.",
  openProjectLabel = SEED_CTA?.openProjectLabel ?? "Open project",
  watchReelLabel = SEED_CTA?.watchReelLabel ?? "Watch reel",
  showReels = true,
  className,
}: ProgrammeProjectGridProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReel, setActiveReel] = useState<GridItem | null>(null);

  const projects = useMemo(
    () => studiosEvidenceData.getProjectsByProgramme(programmeSlug),
    [programmeSlug],
  );

  const reels = useMemo(
    () => getReelsByProgramme(programmeSlug),
    [programmeSlug],
  );

  const allContent = useMemo(() => {
    const projectItems: GridItem[] = projects.map((p) => ({
      type: "project" as const,
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      description: p.briefChallenge || p.description,
      contentType: p.contentType,
      year: p.year,
      posterUrl: p.media.posterUrl,
      href: `/bns-studio/${p.slug}`,
      metric: p.impactEvidence.primaryMetric,
      tags: p.tags,
    }));
    const reelItems: GridItem[] = showReels
      ? reels.map((r) => ({
          type: "reel" as const,
          id: r.id,
          title: r.title,
          subtitle: r.author,
          description: r.caption,
          contentType: "Social Reel",
          year: new Date().getFullYear().toString(),
          posterUrl: r.posterUrl,
          href: r.videoUrl,
          videoUrl: sanitizeMediaUrl(r.videoUrl),
          metric: `${(r.plays / 1000).toFixed(0)}K plays`,
          tags: r.hashtags,
        }))
      : [];
    return [...projectItems, ...reelItems];
  }, [projects, reels, showReels]);

  const filteredContent = useMemo(() => {
    let list = allContent;
    if (selectedFormat !== "all") {
      list = list.filter((item) => item.contentType === selectedFormat);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((item) => {
        const haystack = [
          item.title,
          item.subtitle || "",
          item.description,
          item.contentType,
          ...(item.tags || []),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }
    return list;
  }, [allContent, selectedFormat, searchQuery]);

  const availableFormats = useMemo(() => {
    const set = new Set<string>();
    for (const item of allContent) {
      set.add(item.contentType);
    }
    return Array.from(set);
  }, [allContent]);

  if (projects.length === 0 && reels.length === 0) return null;

  return (
    <LandingSection
      className={cn("border-t border-border/50", className)}
      aria-labelledby={`projects-heading-${programmeSlug}`}
    >
      <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className={cn(T.eyebrow, "text-muted-foreground")}>{eyebrow}</p>
          <h2
            id={`projects-heading-${programmeSlug}`}
            className={cn(T.sectionTitle, "text-balance text-foreground")}
          >
            {headline}
          </h2>
          <p className={cn(T.lead, "text-foreground/75")}>{description}</p>
        </div>

        <p className={cn(T.caption, "shrink-0 text-muted-foreground md:text-right")}>
          <span className="font-semibold text-foreground">{allContent.length}</span>{" "}
          {allContent.length === 1 ? "verified output" : "verified outputs"}
        </p>
      </div>

      <div className="mb-8 space-y-3">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, reels, videos..."
            className="w-full rounded-full border border-border/60 bg-muted/30 py-2 pl-9 pr-9 text-xs font-medium text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        {availableFormats.length > 1 && (
          <div className="scrollbar-none flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setSelectedFormat("all")}
              className={cn(
                "flex min-h-[34px] shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selectedFormat === "all"
                  ? "bg-foreground text-background"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              All
            </button>
            {availableFormats.map((format) => {
              const count = allContent.filter((i) => i.contentType === format).length;
              return (
                <button
                  key={format}
                  type="button"
                  onClick={() => setSelectedFormat(format)}
                  className={cn(
                    "flex min-h-[34px] shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selectedFormat === format
                      ? "bg-foreground text-background"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span>{format}</span>
                  <span className="font-mono text-[10px] opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {filteredContent.map((item) => (
          <article key={item.id} className="group flex flex-col gap-3">
            {item.type === "reel" ? (
              <button
                type="button"
                onClick={() => setActiveReel(item)}
                className="relative aspect-[4/3] w-full overflow-hidden bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Image
                  src={item.posterUrl}
                  alt={item.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm">
                    <Play className="size-5 fill-current" />
                  </span>
                </div>
              </button>
            ) : (
              <Link
                href={item.href}
                className="relative aspect-[4/3] w-full overflow-hidden bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Image
                  src={item.posterUrl}
                  alt={item.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </Link>
            )}

            <div className="space-y-2">
              <p className={cn(T.caption, "text-muted-foreground")}>
                {item.contentType}
                <span aria-hidden className="mx-1.5 text-border">
                  ·
                </span>
                {item.year}
              </p>
              <h3 className="font-heading text-base font-bold leading-snug text-foreground md:text-lg">
                {item.type === "reel" ? (
                  <button
                    type="button"
                    onClick={() => setActiveReel(item)}
                    className="text-left outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.title}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.title}
                  </Link>
                )}
              </h3>
              {item.subtitle ? (
                <p className={cn(T.caption, "text-muted-foreground")}>{item.subtitle}</p>
              ) : null}
              <p className={cn(T.caption, "line-clamp-3 leading-relaxed text-foreground/75")}>
                {item.description}
              </p>
              {item.metric ? (
                <p className={cn(T.caption, "pt-1 font-medium text-foreground")}>{item.metric}</p>
              ) : null}
              {item.type === "reel" ? (
                <button
                  type="button"
                  onClick={() => setActiveReel(item)}
                  className="group inline-flex items-center pt-1 text-sm font-medium text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {watchReelLabel}
                  <span
                    aria-hidden
                    className="ml-1 transition-transform duration-150 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="group inline-flex items-center pt-1 text-sm font-medium text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {openProjectLabel}
                  <span
                    aria-hidden
                    className="ml-1 transition-transform duration-150 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      <Dialog open={Boolean(activeReel)} onOpenChange={(open) => !open && setActiveReel(null)}>
        <DialogContent className="max-w-lg border-border bg-background p-0 sm:max-w-xl">
          <DialogHeader className="space-y-1 border-b border-border/60 px-5 py-4 text-left">
            <DialogTitle className="font-heading text-base font-bold">
              {activeReel?.title || "Social reel"}
            </DialogTitle>
            {activeReel?.subtitle ? (
              <p className="text-xs text-muted-foreground">{activeReel.subtitle}</p>
            ) : null}
          </DialogHeader>
          <div className="p-4 sm:p-5">
            {activeReel?.videoUrl ? (
              <MediaEmbed
                src={activeReel.videoUrl}
                type="tiktok"
                title={activeReel.title}
                caption={activeReel.description}
                poster={activeReel.posterUrl}
                controls
                autoPlay
              />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </LandingSection>
  );
}
