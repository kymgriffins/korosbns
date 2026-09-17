"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, User, ExternalLink, Sparkles, Share2, Check } from "lucide-react";
import { MediaEmbed } from "@/components/ui/media-embed";
import { renderWysiwygProseHtml } from "@/components/admin/WysiwygProseEditor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type ProjectEditorialData = {
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
  useYoutubeThumbnail?: boolean;
  publishedAt?: string;
  channelHandle?: string;
  funder?: string;
  hostInstitution?: string;
  tags?: string[];
  metrics?: Array<{ label: string; value: string }>;
  /** Media type: youtube, reel, audio, image, animation, none */
  mediaType?: string;
  /** Reel MP4 URL for vertical player */
  reelUrl?: string;
  /** Audio embed URL (Spotify, SoundCloud) */
  audioUrl?: string;
  /** Gallery images */
  gallery?: Array<{ url: string; caption?: string; alt?: string }>;
  /** Caption text below hero media */
  mediaCaption?: string;
  /** Hide caption/helper texts */
  hideCaptions?: boolean;
};

export interface ProjectEditorialViewProps {
  project: ProjectEditorialData;
  backHref?: string;
  backLabel?: string;
}

export function ProjectEditorialView({
  project,
  backHref = "/projects",
  backLabel = "All Projects",
}: ProjectEditorialViewProps) {
  const [copied, setCopied] = React.useState(false);

  const displayTitle = project.title || "Civic Evidence Project";
  const displayAuthor = project.authorName || "Budget Ndio Story Research Desk";
  const displayCategory = project.programmeLabel || project.programmeSlug || "Wanahabari Lab";
  const displayHost = project.hostInstitution || "House of Fiscal Wisdom";
  const displayFunder = project.funder || "Supported by Consortium Partners";
  const displayDate = project.publishedAt
    ? new Date(project.publishedAt).toLocaleDateString("en-KE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "2026 Fiscal Investigation";

  const proseHtml = project.wysiwygProse
    ? renderWysiwygProseHtml(project.wysiwygProse)
    : null;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* 1. Header & Breadcrumb */}
      <header className="border-b border-border/40 bg-muted/10 pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Top Bar Nav */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground"
            >
              <Link href="/" className="transition-colors hover:text-primary">
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link href={backHref} className="transition-colors hover:text-primary">
                {backLabel}
              </Link>
              <span aria-hidden>/</span>
              <span className="font-semibold text-foreground line-clamp-1 max-w-[200px] sm:max-w-xs">
                {displayTitle}
              </span>
            </nav>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="size-3.5" />
                  <span>Share Dossier</span>
                </>
              )}
            </button>
          </div>

          {/* Metadata Badges */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="default" className="bg-primary text-primary-foreground font-semibold">
              {displayCategory}
            </Badge>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3 py-0.5 text-xs text-muted-foreground font-mono">
              <span>{displayHost}</span>
              <span aria-hidden>·</span>
              <span>{displayFunder}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-mono">
              <Calendar className="size-3" />
              <span>{displayDate}</span>
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-balance text-3xl font-extrabold tracking-tight leading-[1.15] sm:text-4xl lg:text-5xl">
            {displayTitle}
          </h1>

          {/* Subtitle / Prose Overview */}
          {project.prose ? (
            <p className="mt-4 max-w-3xl text-base sm:text-lg leading-relaxed text-muted-foreground font-normal">
              {project.prose}
            </p>
          ) : null}

          {/* Author / Lead Attribution */}
          <div className="mt-8 flex items-center gap-3 border-t border-border/60 pt-6">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
              <User className="size-5" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Lead Investigator / Author
              </p>
              <p className="text-sm font-bold text-foreground">
                {displayAuthor}
                {project.channelHandle && (
                  <span className="ml-1.5 font-normal text-muted-foreground text-xs font-mono">
                    ({project.channelHandle})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Media Embed Hero Section */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
          {/* Reel player — vertical MP4 */}
          {(project as any).mediaType === "reel" && (project as any).reelUrl ? (
            <div className="flex justify-center bg-black">
              <video
                src={(project as any).reelUrl}
                controls
                playsInline
                preload="metadata"
                className="w-full max-w-[360px] aspect-[9/16] object-contain"
                poster={project.thumbnail}
              >
                <track kind="captions" />
              </video>
            </div>
          ) : (project as any).mediaType === "audio" && (project as any).audioUrl ? (
            /* Audio embed — Spotify/SoundCloud iframe */
            <div className="w-full aspect-[16/9] flex items-center justify-center bg-muted p-6">
              <iframe
                src={(project as any).audioUrl}
                className="w-full max-w-lg aspect-[16/9]"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={displayTitle}
              />
            </div>
          ) : (
            /* Default: YouTube/Vimeo/etc via MediaEmbed */
            <MediaEmbed
              src={project.url || (project.videoId ? `https://www.youtube.com/watch?v=${project.videoId}` : "")}
              title={displayTitle}
              poster={project.thumbnail}
              useYoutubeThumbnail={project.useYoutubeThumbnail ?? true}
              className="w-full aspect-video"
            />
          )}
          {!project.hideCaptions && (
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 bg-muted/20 px-6 py-3 text-xs text-muted-foreground font-mono">
              <span>{(project as any).mediaCaption || "Official Evidence Media · Budget Ndio Story Engine"}</span>
              {project.url && (project as any).mediaType !== "reel" && (project as any).mediaType !== "audio" && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 3. Key Findings / Metrics (if provided) */}
      {project.metrics && project.metrics.length > 0 ? (
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {project.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card p-4 text-center shadow-xs"
              >
                <div className="text-2xl font-extrabold text-primary sm:text-3xl font-mono">
                  {metric.value}
                </div>
                <div className="mt-1 text-xs text-muted-foreground font-medium">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* 3b. Project Gallery (if provided) */}
      {(project as any).gallery && (project as any).gallery.length > 0 ? (
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="mb-6 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Project Gallery
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(project as any).gallery.map((item: { url: string; caption?: string; alt?: string }, idx: number) => (
              <figure key={idx} className="group overflow-hidden rounded-xl border border-border bg-card">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.alt || `${displayTitle} — gallery ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {!project.hideCaptions && item.caption ? (
                  <figcaption className="px-4 py-3 text-xs text-muted-foreground font-mono">
                    {item.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {/* 4. Deep-Dive WYSIWYG Prose Editorial Content */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {proseHtml ? (
          <div
            className="wysiwyg-rendered prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: proseHtml }}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {project.prose || "Full editorial briefing and investigatory findings are being compiled by the editorial team."}
            </p>
          </div>
        )}
      </section>

      {/* 5. Institutional CTA & Collaboration */}
      <section className="border-t border-border/60 bg-muted/10 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            <span>Civic Partnership &amp; Research</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Collaborate on or Cite This Investigation
          </h2>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
            Budget Ndio Story produces peer-reviewed policy briefs, fiscal monographs, and video investigations
            in coalition with African research institutes. Newsrooms, civil society, and researchers are encouraged to adapt this work.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="gap-2">
              <a href="mailto:info@budgetndiostory.org?subject=Collaboration">
                <span>Partner with Research Desk</span>
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">Explore All Projects</Link>
            </Button>
          </div>

          <p className="font-mono text-xs text-muted-foreground pt-4">
            Master Research Registry · info@budgetndiostory.org
          </p>
        </div>
      </section>
    </article>
  );
}
