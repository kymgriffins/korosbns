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
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import {
  studiosEvidenceData,
  type StudioProjectEvidence,
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
  eyebrow = "Verified Outputs & Flagship Work",
  headline = "Tangible Projects from This Desk",
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
    <section
      className={cn(
        "py-12 sm:py-16 md:py-20 border-t border-border/40 bg-muted/15",
        className,
      )}
      aria-labelledby={`projects-heading-${programmeSlug}`}
    >
      <div className={SECTION_SHELL_INNER}>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="size-3.5" />
              <span>{eyebrow}</span>
            </div>
            <h2
              id={`projects-heading-${programmeSlug}`}
              className="font-heading text-2xl sm:text-4xl font-black tracking-tight text-foreground"
            >
              {headline}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          <div className="shrink-0 font-mono text-xs text-muted-foreground">
            <span className="font-bold text-foreground">{projects.length}</span>{" "}
            {projects.length === 1 ? "Verified Output" : "Verified Outputs"}
          </div>
        </div>

        {/* Optional Format Filter Strip if more than 1 format exists */}
        {availableFormats.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-6 mb-2">
            <button
              type="button"
              onClick={() => setSelectedFormat("all")}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer min-h-[34px] flex items-center gap-1.5",
                selectedFormat === "all"
                  ? "bg-foreground text-background font-semibold shadow-xs"
                  : "bg-muted/50 border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <span>All Formats</span>
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
                    "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer min-h-[34px] flex items-center gap-1.5",
                    isActive
                      ? "bg-foreground text-background font-semibold shadow-xs"
                      : "bg-muted/50 border border-border/60 text-muted-foreground hover:bg-muted hover:text-foreground",
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

        {/* Unified Projects Cards Grid — All items rendered together in balanced responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project) => {
            const href = getProjectUrl(project.slug);
            return (
              <article
                key={project.id}
                className="group flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
              >
                {/* Media Poster */}
                <Link
                  href={href}
                  className="relative aspect-video w-full overflow-hidden bg-muted block"
                >
                  <Image
                    src={project.media.posterUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Pills */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                      {getFormatIcon(project.contentType)}
                      <span>{project.contentType}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-mono font-bold uppercase tracking-wider">
                      {project.year}
                    </span>
                  </div>

                  {/* Bottom Partner Pill */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-[11px] font-mono font-semibold text-white/90 truncate">
                      Partner: {project.organization.name}
                    </p>
                  </div>
                </Link>

                {/* Content Body */}
                <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-heading text-base sm:text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      <Link href={href}>{project.title}</Link>
                    </h4>
                    {project.subtitle && (
                      <p className="text-xs font-medium text-muted-foreground">
                        {project.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3">
                      {project.briefChallenge || project.description}
                    </p>
                  </div>

                  {/* Impact Outcome & Action */}
                  <div className="pt-3 border-t border-border/40 space-y-3">
                    {project.impactEvidence?.primaryMetric && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-primary font-bold">
                        <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">
                          {project.impactEvidence.primaryMetric}
                        </span>
                      </div>
                    )}

                    <Link
                      href={href}
                      className="inline-flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors pt-1"
                    >
                      <span>Open Project Dossier</span>
                      <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
