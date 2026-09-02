"use client";

import Link from "next/link";
import Image from "next/image";
import { Play, Mic, FileText } from "lucide-react";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { getFormatTheme } from "@/lib/studio-format-themes";
import { cn } from "@/utils";

type Props = {
  project: StudioProjectEvidence;
};

function Waveform() {
  return (
    <div className="studio-waveform" aria-hidden>
      {Array.from({ length: 7 }).map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

export function StudioFormatStage({ project }: Props) {
  const theme = getFormatTheme(project.contentType);
  const posterClass = cn(
    "object-cover",
    project.media.posterPosition || "object-center",
  );

  if (theme.experience === "podcast") {
    return (
      <section
        className={cn(
          "studio-format-podcast border-b border-[var(--studio-theatre-border)] py-10 md:py-14",
          theme.accentClass,
        )}
      >
        <div className="mx-auto grid max-w-5xl gap-8 px-4 md:grid-cols-[12rem_1fr] md:items-center md:gap-12">
          <div className="relative mx-auto aspect-square w-full max-w-[12rem] overflow-hidden rounded-2xl shadow-2xl">
            <Image
              src={project.media.posterUrl}
              alt={project.title}
              fill
              priority
              className={posterClass}
              sizes="12rem"
            />
          </div>
          <div className="space-y-5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-surface)] px-3 py-1 text-xs font-semibold text-[var(--studio-format-accent)]">
              <Mic className="size-3.5" aria-hidden />
              Podcast & Audio
            </div>
            <Waveform />
            <p className="text-sm text-[var(--studio-theatre-muted)]">
              {project.whatWeProduced}
            </p>
            {project.media.audioUrl || project.media.videoUrl ? (
              <a
                href={project.media.audioUrl ?? project.media.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--studio-format-accent)] px-5 py-2.5 text-sm font-bold text-black"
              >
                <Play className="size-4 fill-current" aria-hidden />
                Listen now
              </a>
            ) : (
              <p className="text-xs text-[var(--studio-theatre-muted)]">
                Full episode available on request — contact BNS Studios.
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (theme.experience === "vertical") {
    return (
      <section
        className={cn(
          "studio-format-vertical flex justify-center border-b border-[var(--studio-theatre-border)] py-10 md:py-14",
          theme.accentClass,
        )}
      >
        <div className="studio-phone-frame relative bg-black">
          <Image
            src={project.media.posterUrl}
            alt={project.title}
            fill
            priority
            className={posterClass}
            sizes="16rem"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            <p className="text-xs font-semibold text-white/80">Social series</p>
            <p className="text-sm font-bold text-white">{project.title}</p>
          </div>
        </div>
      </section>
    );
  }

  if (theme.experience === "brief") {
    return (
      <section
        className={cn(
          "studio-format-brief border-b border-[var(--studio-theatre-border)] py-10 md:py-14",
          theme.accentClass,
        )}
      >
        <div className="mx-auto grid max-w-5xl gap-8 px-4 md:grid-cols-2 md:items-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--studio-theatre-border)]">
            <Image
              src={project.media.posterUrl}
              alt={project.title}
              fill
              priority
              className={posterClass}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-4 rounded-2xl border border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-surface)] p-6">
            <div className="flex items-center gap-2 text-[var(--studio-format-accent)]">
              <FileText className="size-5" aria-hidden />
              <span className="text-xs font-bold uppercase tracking-wider">Research spotlight</span>
            </div>
            <p className="text-base leading-relaxed text-[var(--studio-theatre-fg)]">
              {project.description}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (theme.experience === "stage") {
    return (
      <section
        className={cn(
          "studio-format-stage border-b border-[var(--studio-theatre-border)]",
          theme.accentClass,
        )}
      >
        <div className="relative aspect-[21/9] w-full max-h-[28rem] overflow-hidden">
          <Image
            src={project.media.posterUrl}
            alt={project.title}
            fill
            priority
            className={posterClass}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--studio-theatre-bg)] via-black/30 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--studio-format-accent)]">
              Live convening · {project.organization.name}
            </p>
            <p className="mt-2 max-w-2xl text-lg text-white/90 md:text-xl">
              {project.whatWeProduced}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "studio-format-cinema border-b border-[var(--studio-theatre-border)]",
        theme.accentClass,
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <Image
          src={project.media.posterUrl}
          alt={project.title}
          fill
          priority
          className={posterClass}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/25" />
        {project.media.videoUrl ? (
          <a
            href={project.media.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center"
            aria-label={`Watch ${project.title}`}
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-white/95 text-black shadow-xl transition-transform hover:scale-105">
              <Play className="size-7 fill-current pl-0.5" aria-hidden />
            </span>
          </a>
        ) : null}
        {project.media.caption ? (
          <p className="absolute bottom-4 left-4 right-4 text-xs text-white/75 md:text-sm">
            {project.media.caption}
          </p>
        ) : null}
      </div>
    </section>
  );
}
