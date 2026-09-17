"use client";

import React, { type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  ExternalLink,
  ShieldCheck,
  Share2,
  Building2,
  Play,
  FileSearch,
} from "lucide-react";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { EditorialPill } from "@/components/ui/editorial";
import { MediaEmbed } from "@/components/ui/media-embed";
import { renderWysiwygProseHtml } from "@/components/admin/WysiwygProseEditor";
import { type LayoutArchetype, resolveLayoutArchetype } from "./types";

export interface ProjectData {
  id: string;
  slug?: string;
  title: string;
  subtitle?: string;
  prose?: string;
  wysiwygProse?: string;
  authorName?: string;
  programmeSlug?: string;
  programmeLabel?: string;
  url?: string;
  videoId?: string;
  thumbnail?: string;
  publishedAt?: string;
  funder?: string;
  hostInstitution?: string;
  metrics?: Array<{ label: string; value: string }>;
  mediaType?: string;
  reelUrl?: string;
  audioUrl?: string;
  gallery?: Array<{ url: string; caption?: string; alt?: string }>;
  mediaCaption?: string;
}

export interface ProjectShellProps {
  project: ProjectData;
  archetype?: LayoutArchetype | string | null;
  backHref?: string;
  backLabel?: string;
  children?: ReactNode;
}

export function ProjectShell({
  project,
  archetype = "sovereign",
  backHref = "/projects",
  backLabel = "Back to Projects",
  children,
}: ProjectShellProps) {
  const config = resolveLayoutArchetype(archetype);
  const mediaSrc = project.reelUrl || project.url || (project.videoId ? `https://www.youtube.com/watch?v=${project.videoId}` : "");

  // 1. CINEMATIC THEATRE ARCHETYPE
  if (config.id === "cinematic") {
    return (
      <div className="w-full bg-[#04060a] text-slate-100 min-h-screen pb-24">
        {/* Full-width Screen Reel Hero */}
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 pt-8 space-y-6">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:underline"
          >
            <ArrowLeft className="size-3.5" /> {backLabel}
          </Link>

          <div className="relative rounded-3xl overflow-hidden border border-sky-500/30 bg-black shadow-2xl">
            {mediaSrc ? (
              <div className="aspect-[21/9] sm:aspect-[16/9] w-full">
                <MediaEmbed
                  src={mediaSrc}
                  type={project.mediaType as any}
                  title={project.title}
                  caption={project.mediaCaption}
                  controls
                />
              </div>
            ) : (
              <div className="aspect-[21/9] w-full bg-slate-900/60 flex items-center justify-center">
                <Play className="size-16 text-sky-400 opacity-60" />
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto space-y-4 pt-6">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              {project.programmeLabel || "EVIDENCE REEL"}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>
            {project.subtitle ? (
              <p className="text-lg text-slate-300 leading-relaxed">{project.subtitle}</p>
            ) : null}

            <div className="prose prose-invert max-w-none text-slate-200 pt-6">
              {project.wysiwygProse ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderWysiwygProseHtml(project.wysiwygProse),
                  }}
                />
              ) : (
                <p>{project.prose}</p>
              )}
            </div>

            {children}
          </div>
        </div>
      </div>
    );
  }

  // 2. BRUTALIST WATCHDOG ARCHETYPE
  if (config.id === "brutalist") {
    return (
      <div className="w-full bg-[#fffdf5] dark:bg-black text-black dark:text-white min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 font-mono text-xs font-bold uppercase hover:underline"
          >
            ← {backLabel}
          </Link>

          <div className="border-4 border-current p-6 bg-card shadow-[6px_6px_0px_0px_currentColor] space-y-4">
            <div className="flex justify-between items-center font-mono text-xs font-bold border-b-2 border-current pb-2">
              <span>CASE ID // {project.id.toUpperCase()}</span>
              <span>DEPT // {project.programmeLabel || "CIVIC MONITOR"}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-mono font-black uppercase">
              {project.title}
            </h1>
            {project.subtitle ? (
              <p className="font-mono text-sm sm:text-base">{project.subtitle}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 border-2 border-current p-6 bg-card space-y-6">
              {mediaSrc ? (
                <div className="border-2 border-current overflow-hidden">
                  <MediaEmbed src={mediaSrc} type={project.mediaType as any} title={project.title} controls />
                </div>
              ) : null}

              <div className="font-mono text-sm leading-relaxed">
                {project.wysiwygProse ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderWysiwygProseHtml(project.wysiwygProse),
                    }}
                  />
                ) : (
                  <p>{project.prose}</p>
                )}
              </div>
              {children}
            </div>

            <div className="lg:col-span-4 border-2 border-current p-4 bg-muted/20 space-y-4 font-mono text-xs">
              <div className="font-bold border-b-2 border-current pb-1 uppercase">DOSSIER INDEX</div>
              <div>SUPERVISING ENTITY: {project.hostInstitution || "BNS EVIDENCE LAB"}</div>
              <div>FUNDING SOURCE: {project.funder || "CONSORTIUM PARTNERS"}</div>
              <div>DATE: {project.publishedAt || "FY2026"}</div>
              {project.metrics?.map((m, idx) => (
                <div key={idx} className="border-t border-current/40 pt-1 flex justify-between">
                  <span>{m.label}:</span>
                  <span className="font-bold">{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. EDITORIAL & SOVEREIGN CIVIC ARCHETYPES
  return (
    <div className="w-full bg-background text-foreground min-h-screen py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="size-3" /> {backLabel}
        </Link>

        {/* Header */}
        <header className="space-y-4 border-b border-border/80 pb-6">
          {project.programmeLabel ? (
            <EditorialPill variant="default">{project.programmeLabel}</EditorialPill>
          ) : null}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {project.title}
          </h1>
          {project.subtitle ? (
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {project.subtitle}
            </p>
          ) : null}
        </header>

        {/* 2-Column Split Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-6">
            {mediaSrc ? (
              <div className="rounded-2xl overflow-hidden border border-border/80 shadow-md">
                <MediaEmbed
                  src={mediaSrc}
                  type={project.mediaType as any}
                  title={project.title}
                  caption={project.mediaCaption}
                  controls
                />
              </div>
            ) : null}

            <div className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed">
              {project.wysiwygProse ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderWysiwygProseHtml(project.wysiwygProse),
                  }}
                />
              ) : (
                <p>{project.prose}</p>
              )}
            </div>

            {children}
          </div>

          <aside className="lg:col-span-4 space-y-6 border-l border-border/60 pl-6 hidden lg:block">
            <div className="rounded-xl border border-border/80 bg-card p-5 space-y-4 shadow-xs">
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                Case Study Metadata
              </h4>

              {project.authorName ? (
                <div className="space-y-1 text-xs">
                  <span className="text-muted-foreground">Lead Researcher</span>
                  <p className="font-semibold text-foreground">{project.authorName}</p>
                </div>
              ) : null}

              {project.hostInstitution ? (
                <div className="space-y-1 text-xs">
                  <span className="text-muted-foreground">Host Institution</span>
                  <p className="font-semibold text-foreground">{project.hostInstitution}</p>
                </div>
              ) : null}

              {project.funder ? (
                <div className="space-y-1 text-xs">
                  <span className="text-muted-foreground">Funding Support</span>
                  <p className="font-semibold text-foreground">{project.funder}</p>
                </div>
              ) : null}

              {project.metrics && project.metrics.length > 0 ? (
                <div className="space-y-2 pt-3 border-t border-border/40">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                    Key Indicators
                  </span>
                  {project.metrics.map((m, i) => (
                    <div key={i} className="flex justify-between items-baseline text-xs">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="font-mono font-bold text-foreground">{m.value}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
