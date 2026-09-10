"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Radio,
  FileSearch,
  Users2,
  Clapperboard,
  Sparkles,
} from "lucide-react";
import { LandingSection } from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  studiosEvidenceData,
  type StudioContentType,
} from "@/data/studios-evidence";
import type { ProgrammeSlug } from "@/content";
import { resolveProjectId } from "@/lib/programme-project-ids";
import { cn } from "@/utils";

interface ProgrammeProjectGridProps {
  programmeSlug: ProgrammeSlug;
  eyebrow?: string;
  headline?: string;
  description?: string;
  className?: string;
}

function getFormatIcon(contentType: StudioContentType) {
  switch (contentType) {
    case "Explainer Videos":
    case "Documentaries":
      return <Play className="size-3.5 fill-current" />;
    case "Podcast & Audio":
      return <Radio className="size-3.5" />;
    case "Animations":
      return <Clapperboard className="size-3.5" />;
    case "Town Hall Design & Facilitation":
    case "Community Listening Sessions":
      return <Users2 className="size-3.5" />;
    case "Research Spotlights":
      return <FileSearch className="size-3.5" />;
    default:
      return <Sparkles className="size-3.5" />;
  }
}

function getProjectUrl(slug: string) {
  const canonical = resolveProjectId(slug);
  if (canonical === "project-terra") {
    return "/bns-project/terra";
  }
  return `/bns-studio/${canonical}`;
}

export function ProgrammeProjectGrid({
  programmeSlug,
  eyebrow = "Verified outputs",
  headline = "Tangible projects from this programme",
  description = "Every claim is backed by a published documentary, dataset, explainer, or civic forum.",
  className,
}: ProgrammeProjectGridProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>("all");

  const projects = useMemo(
    () => studiosEvidenceData.getProjectsByProgramme(programmeSlug),
    [programmeSlug],
  );

  const availableFormats = useMemo(() => {
    const set = new Set<StudioContentType>();
    for (const p of projects) {
      set.add(p.contentType);
    }
    return Array.from(set);
  }, [projects]);

  const displayedProjects = useMemo(() => {
    if (selectedFormat === "all") return projects;
    return projects.filter((p) => p.contentType === selectedFormat);
  }, [projects, selectedFormat]);

  if (projects.length === 0) return null;

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
          <span className="font-semibold text-foreground">{projects.length}</span>{" "}
          {projects.length === 1 ? "verified output" : "verified outputs"}
        </p>
      </div>

      {availableFormats.length > 1 && (
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedFormat("all")}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer min-h-[34px] flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selectedFormat === "all"
                ? "bg-foreground text-background font-semibold"
                : "border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <span>All formats</span>
            <span className="font-mono text-[10px] opacity-70">({projects.length})</span>
          </button>
          {availableFormats.map((format) => {
            const count = projects.filter((p) => p.contentType === format).length;
            const isActive = selectedFormat === format;
            return (
              <button
                key={format}
                type="button"
                onClick={() => setSelectedFormat(format)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer min-h-[34px] flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-foreground text-background font-semibold"
                    : "border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {getFormatIcon(format)}
                <span>{format}</span>
                <span className="font-mono text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {displayedProjects.map((project) => {
          const href = getProjectUrl(project.slug);
          return (
            <article key={project.id} className="group flex flex-col gap-3">
              <Link
                href={href}
                className="relative aspect-[4/3] w-full overflow-hidden bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Image
                  src={project.media.posterUrl}
                  alt={project.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </Link>

              <div className="space-y-2">
                <p className={cn(T.caption, "text-muted-foreground")}>
                  {project.contentType}
                  <span aria-hidden className="mx-1.5 text-border">
                    ·
                  </span>
                  {project.year}
                </p>
                <h3 className="font-heading text-base font-bold leading-snug text-foreground md:text-lg">
                  <Link
                    href={href}
                    className="outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {project.title}
                  </Link>
                </h3>
                {project.subtitle ? (
                  <p className={cn(T.caption, "text-muted-foreground")}>
                    {project.subtitle}
                  </p>
                ) : null}
                <p className={cn(T.caption, "leading-relaxed text-foreground/75 line-clamp-3")}>
                  {project.briefChallenge || project.description}
                </p>
                {project.impactEvidence?.primaryMetric ? (
                  <p className={cn(T.caption, "pt-1 font-medium text-foreground")}>
                    {project.impactEvidence.primaryMetric}
                  </p>
                ) : null}
                <Link
                  href={href}
                  className="inline-flex items-center pt-1 text-sm font-medium text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Open project
                  <span aria-hidden className="ml-1">
                    →
                  </span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </LandingSection>
  );
}
