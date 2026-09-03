"use client";

import Image from "next/image";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { chaptersFor } from "@/lib/studio-format-details";
import {
  Eyebrow,
  FormatCta,
  FormatMetric,
  FormatRelated,
  FormatShell,
} from "@/components/studio/format-pages/format-shared";
import { FormatReveal } from "@/components/studio/format-pages/format-motion";
import { cn } from "@/utils";

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/,
  );
  if (!match?.[1]) return null;
  return `https://www.youtube.com/embed/${match[1]}`;
}

/** Explainer page — chapter layout: video, confusion, numbered chapters. */
export function FormatExplainerPage({
  project,
}: {
  project: StudioProjectEvidence;
}) {
  const chapters = chaptersFor(project);
  const embed = project.media.videoUrl
    ? youtubeEmbedUrl(project.media.videoUrl)
    : null;

  return (
    <FormatShell project={project}>
      <header className="fpage-narrow">
        <Eyebrow>Explainer · {project.year}</Eyebrow>
        <h1 className="studio-about-title-xl">{project.title}</h1>
        {project.subtitle ? (
          <p className="studio-article-lede">{project.subtitle}</p>
        ) : null}
      </header>

      <figure className="fpage-video">
        {embed ? (
          <iframe
            src={embed}
            title={project.title}
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="relative size-full">
            <Image
              src={project.media.posterUrl}
              alt={project.title}
              fill
              priority
              className={cn(
                "object-cover",
                project.media.posterPosition || "object-center",
              )}
              sizes="100vw"
            />
          </div>
        )}
      </figure>

      <section className="fpage-narrow">
        <Eyebrow>The confusion</Eyebrow>
        <p className="studio-article-prose-lg">{project.briefChallenge}</p>
      </section>

      <FormatReveal experience="cinema" className="fpage-narrow">
        <Eyebrow>Chapters</Eyebrow>
        <ol className="fpage-chapters">
          {chapters.map((chapter, i) => (
            <li key={chapter.title} className="fpage-chapter">
              <span className="fpage-chapter-num">
                CH {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="fpage-chapter-title">{chapter.title}</p>
                {chapter.note ? (
                  <p className="studio-article-prose-sm">{chapter.note}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </FormatReveal>

      <section className="fpage-narrow">
        <Eyebrow>How it was built</Eyebrow>
        <p className="studio-article-prose">{project.whatWeProduced}</p>
        <p className="studio-article-prose">{project.description}</p>
      </section>

      <FormatMetric project={project} />

      <FormatCta
        title="Need explainers like this?"
        line="Presenter-led clarity with motion graphics from published tables — tell us what confuses your audience."
      />
      <FormatRelated project={project} />
    </FormatShell>
  );
}
