"use client";

import Image from "next/image";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { chaptersFor } from "@/lib/studio-format-details";
import {
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
      <div className="fworld-explainer">
        <div className="fpage-flow">
          {/* Hero - copy + video */}
          <header className="fw-explainer-hero">
            <div className="fw-explainer-hero-copy">
              <p className="fw-eyebrow fw-accent">
                Explainer · {project.year}
              </p>
              <h1 className="fw-explainer-hero-title">
                {project.title}
              </h1>
              {project.subtitle ? (
                <p className="fw-explainer-hero-sub">{project.subtitle}</p>
              ) : null}
            </div>
          </header>

          {/* Video-first */}
          <figure className="fw-explainer-video" style={{ maxWidth: "76rem", margin: "0 auto", width: "100%", padding: "0 1.5rem" }}>
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

          {/* The confusion */}
          <section className="fw-explainer-content">
            <div>
              <p className="fw-explainer-section-title">The confusion</p>
              <p className="studio-article-prose-lg" style={{ marginTop: "0.75rem" }}>
                {project.briefChallenge}
              </p>
            </div>
          </section>

          {/* Chapter scrub bar */}
          <FormatReveal experience="cinema" className="fw-explainer-content">
            <div className="fw-explainer-chapters">
              <p className="fw-explainer-section-title" style={{ marginBottom: "1rem" }}>
                Chapters
              </p>
              <ol>
                {chapters.map((chapter, i) => (
                  <li key={chapter.title} className="fw-explainer-chapter">
                    <span className="fw-explainer-chapter-num">
                      CH {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="fw-explainer-chapter-title">{chapter.title}</p>
                      {chapter.note ? (
                        <p className="fw-explainer-chapter-note">{chapter.note}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </FormatReveal>

          {/* How it was built */}
          <section className="fw-explainer-content">
            <div>
              <p className="fw-explainer-section-title">How it was built</p>
              <p className="studio-article-prose" style={{ marginTop: "0.75rem" }}>
                {project.whatWeProduced}
              </p>
              <p className="studio-article-prose" style={{ marginTop: "0.5rem" }}>
                {project.description}
              </p>
            </div>
          </section>

          <FormatMetric project={project} />

          <FormatCta
            title="Need explainers like this?"
            line="Presenter-led clarity with motion graphics from published tables - tell us what confuses your audience."
          />
          <FormatRelated project={project} />
        </div>
      </div>
    </FormatShell>
  );
}
