"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import {
  defaultStudioPanel,
  getStudioPanels,
  panelLabel,
  projectGallery,
  projectHasAudio,
  projectHasVideo,
  type StudioPanelId,
} from "@/lib/studio-presentation";
import { getFormatTheme } from "@/lib/studio-format-themes";
import { cn } from "@/utils";

type Props = {
  project: StudioProjectEvidence;
};

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/,
  );
  if (!match?.[1]) return null;
  return `https://www.youtube.com/embed/${match[1]}`;
}

function AudioPlayer({ project }: { project: StudioProjectEvidence }) {
  const theme = getFormatTheme(project.contentType);
  const src = project.media.audioUrl;

  return (
    <div
      className={cn(
        "studio-format-podcast flex min-h-[min(70vh,32rem)] flex-col items-center justify-center gap-6 px-4 py-12",
        theme.accentClass,
      )}
    >
      <div className="relative size-48 overflow-hidden rounded-2xl shadow-2xl md:size-56">
        <Image
          src={project.media.posterUrl}
          alt={project.title}
          fill
          className={cn("object-cover", project.media.posterPosition || "object-center")}
          sizes="14rem"
          priority
        />
      </div>
      <div className="studio-waveform" aria-hidden>
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} />
        ))}
      </div>
      {src ? (
        <audio
          controls
          className="w-full max-w-md"
          src={src}
          preload="metadata"
        >
          <track kind="captions" />
        </audio>
      ) : (
        <p className="max-w-md text-center text-sm text-[var(--studio-theatre-muted)]">
          Stream on partner platforms — contact BNS Studios for episode access.
        </p>
      )}
    </div>
  );
}

function VideoPlayer({ project }: { project: StudioProjectEvidence }) {
  const embed = project.media.videoUrl
    ? youtubeEmbedUrl(project.media.videoUrl)
    : null;

  if (embed) {
    return (
      <div className="aspect-video w-full bg-black">
        <iframe
          src={embed}
          title={project.title}
          className="size-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black">
      <Image
        src={project.media.posterUrl}
        alt={project.title}
        fill
        className={cn("object-cover", project.media.posterPosition || "object-center")}
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/35">
        <span className="flex size-16 items-center justify-center rounded-full bg-white/95 text-black">
          <Play className="size-7 fill-current pl-0.5" aria-hidden />
        </span>
      </div>
      {project.media.caption ? (
        <p className="absolute bottom-4 left-4 right-4 text-xs text-white/80 md:text-sm">
          {project.media.caption}
        </p>
      ) : null}
    </div>
  );
}

function GalleryCarousel({ project }: { project: StudioProjectEvidence }) {
  const images = projectGallery(project);
  const [index, setIndex] = useState(0);
  const current = images[index];

  const prev = useCallback(() => {
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  if (!current) return null;

  return (
    <div className="relative flex min-h-[min(75vh,40rem)] flex-col items-center justify-center bg-[var(--studio-theatre-bg)] px-4 py-10">
      <div className="relative aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-2xl border border-[var(--studio-theatre-border)] bg-black shadow-2xl">
        <Image
          key={current.url}
          src={current.url}
          alt={current.caption ?? project.title}
          fill
          className={cn("object-cover", current.position || "object-center")}
          sizes="(max-width: 1024px) 100vw, 896px"
          priority
        />
      </div>
      {current.caption ? (
        <p className="mt-4 max-w-2xl text-center text-sm text-[var(--studio-theatre-muted)]">
          {current.caption}
        </p>
      ) : null}
      {images.length > 1 ? (
        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={prev}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--studio-theatre-border)] text-[var(--studio-theatre-fg)]"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-5" />
          </button>
          <span className="text-xs font-semibold text-[var(--studio-theatre-muted)]">
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={next}
            className="flex size-10 items-center justify-center rounded-full border border-[var(--studio-theatre-border)] text-[var(--studio-theatre-fg)]"
            aria-label="Next image"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function OverviewPanel({ project }: { project: StudioProjectEvidence }) {
  const theme = getFormatTheme(project.contentType);

  return (
    <div className={cn("max-w-2xl space-y-5 px-4 py-8 md:px-8 md:py-12", theme.accentClass)}>
      <h2 className="text-2xl font-bold text-[var(--studio-theatre-fg)] md:text-3xl">
        Overview
      </h2>
      <p className="text-base leading-relaxed text-[var(--studio-theatre-muted)] md:text-lg">
        {project.description}
      </p>
      <div className="space-y-2 text-sm">
        <p>
          <span className="font-semibold text-[var(--studio-format-accent)]">
            {project.organization.name}
          </span>
          <span className="text-[var(--studio-theatre-muted)]">
            {" "}
            · {project.organization.location}
          </span>
        </p>
        <p className="text-[var(--studio-theatre-muted)]">{project.year}</p>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[var(--studio-theatre-border)] px-3 py-1 text-xs text-[var(--studio-theatre-muted)]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function BehindPanel({ project }: { project: StudioProjectEvidence }) {
  return (
    <div className="max-w-2xl space-y-6 px-4 py-8 md:px-8 md:py-12">
      <h2 className="text-2xl font-bold text-[var(--studio-theatre-fg)]">Behind the scenes</h2>
      <div className="space-y-4 text-sm leading-relaxed text-[var(--studio-theatre-muted)]">
        <p>
          <span className="font-semibold text-[var(--studio-theatre-fg)]">Brief: </span>
          {project.briefChallenge}
        </p>
        <p>
          <span className="font-semibold text-[var(--studio-theatre-fg)]">Delivered: </span>
          {project.whatWeProduced}
        </p>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {project.outputs.map((output) => (
          <li
            key={output}
            className="rounded-lg border border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-surface)] px-3 py-2 text-xs text-[var(--studio-theatre-fg)]"
          >
            {output}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StudioProjectViewer({ project }: Props) {
  const searchParams = useSearchParams();
  const panels = getStudioPanels(project);
  const panelParam = searchParams.get("panel") as StudioPanelId | null;
  const initial =
    panelParam && panels.includes(panelParam) ? panelParam : defaultStudioPanel(project);
  const [panel, setPanel] = useState<StudioPanelId>(initial);

  const activePanel = panels.includes(panel) ? panel : defaultStudioPanel(project);

  const backdropStyle = useMemo(
    () => ({
      backgroundImage: `url(${project.media.posterUrl})`,
    }),
    [project.media.posterUrl],
  );

  return (
    <div className="relative min-h-dvh">
      <div
        className="pointer-events-none fixed inset-0 scale-105 bg-cover bg-center opacity-20 blur-2xl"
        style={backdropStyle}
        aria-hidden
      />
      <div className="relative z-10 flex min-h-dvh flex-col lg:flex-row">
        <aside className="flex flex-col border-b border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-bg)]/90 px-4 py-4 backdrop-blur-md lg:w-64 lg:border-b-0 lg:border-r lg:py-8">
          <Link
            href="/bns-studio"
            className="mb-6 inline-flex w-fit items-center gap-1.5 text-sm text-[var(--studio-theatre-muted)] hover:text-[var(--studio-theatre-fg)]"
          >
            <ArrowLeft className="size-4" />
            Close
          </Link>
          <nav className="flex flex-row gap-4 overflow-x-auto lg:flex-col lg:gap-1">
            {panels.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setPanel(id)}
                className={cn(
                  "shrink-0 text-left text-sm font-medium transition-colors lg:px-2 lg:py-2",
                  activePanel === id
                    ? "text-[var(--studio-theatre-fg)] lg:border-l-2 lg:border-[var(--studio-theatre-accent)] lg:pl-3"
                    : "text-[var(--studio-theatre-muted)] hover:text-[var(--studio-theatre-fg)]",
                )}
              >
                {activePanel === id ? (
                  <span className="mr-2 inline-block size-1.5 rounded-full bg-[var(--studio-theatre-accent)] lg:hidden" />
                ) : null}
                {panelLabel(id)}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 bg-[var(--studio-theatre-bg)]/85 backdrop-blur-sm">
          <header className="border-b border-[var(--studio-theatre-border)] px-4 py-4 md:px-8">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--studio-theatre-muted)]">
              {project.contentType}
            </p>
            <h1 className="text-xl font-bold text-[var(--studio-theatre-fg)] md:text-2xl">
              {project.title}
            </h1>
          </header>

          {activePanel === "overview" ? <OverviewPanel project={project} /> : null}
          {activePanel === "watch" && projectHasVideo(project) ? (
            <VideoPlayer project={project} />
          ) : null}
          {activePanel === "listen" && projectHasAudio(project) ? (
            <AudioPlayer project={project} />
          ) : null}
          {activePanel === "gallery" ? <GalleryCarousel project={project} /> : null}
          {activePanel === "behind" ? <BehindPanel project={project} /> : null}
        </div>
      </div>
    </div>
  );
}
