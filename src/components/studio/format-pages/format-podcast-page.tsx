"use client";

import Image from "next/image";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { projectHasAudio } from "@/lib/studio-presentation";
import { chaptersFor, galleryImagesFor } from "@/lib/studio-format-details";
import {
  FIELD_IMAGES,
  FormatCta,
  FormatMetric,
  FormatRelated,
  FormatShell,
} from "@/components/studio/format-pages/format-shared";
import { FormatReveal } from "@/components/studio/format-pages/format-motion";
import { cn } from "@/utils";

export function FormatPodcastPage({ project }: { project: StudioProjectEvidence }) {
  const chapters = chaptersFor(project);
  const { gallery, extra } = galleryImagesFor(project, FIELD_IMAGES, 4);
  const poster = gallery[0];
  const boothShots = [
    ...gallery.slice(1, 3).map((g) => ({ src: g.url, alt: g.caption ?? project.title })),
    ...extra.slice(0, 2),
  ];

  return (
    <FormatShell project={project}>
      <div className="fworld-podcast">
        <div className="fpage-flow">
          {/* Hero - vinyl art + copy */}
          <header className="fw-podcast-hero">
            <div className="fw-podcast-vinyl">
              <Image
                src={poster.url}
                alt={project.title}
                fill
                priority
                className={cn("object-cover", poster.position || "object-center")}
                sizes="(max-width: 768px) 70vw, 320px"
              />
            </div>
            <div className="fw-podcast-meta">
              <p className="fw-eyebrow fw-accent">
                Podcast &amp; Audio · {project.year} · {project.organization.name}
              </p>
              <h1 className="fw-podcast-title">{project.title}</h1>
              {project.subtitle ? (
                <p className="fw-podcast-subtitle">{project.subtitle}</p>
              ) : null}

              {/* Waveform player */}
              <div className="fw-podcast-player">
                <div className="fw-podcast-wave" aria-hidden>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <span key={i} />
                  ))}
                </div>
                {projectHasAudio(project) && project.media.audioUrl ? (
                  <audio
                    controls
                    className="studio-article-audio-el"
                    src={project.media.audioUrl}
                    preload="metadata"
                  >
                    <track kind="captions" />
                  </audio>
                ) : (
                  <p className="fw-podcast-note">
                    Full episode available on request - contact BNS Studios.
                  </p>
                )}
              </div>
            </div>
          </header>

          {/* Tracklist + show notes */}
          <div className="fpage-wide">
            <div className="fw-podcast-about">
              <section>
                <p className="fw-eyebrow fw-accent">Show notes</p>
                <h2 className="fpage-h2" style={{ marginTop: "0.75rem" }}>
                  Why this episode exists.
                </h2>
                <p className="studio-article-prose-lg" style={{ marginTop: "1rem" }}>
                  {project.briefChallenge}
                </p>
                <p className="studio-article-prose" style={{ marginTop: "0.75rem" }}>
                  {project.description}
                </p>
                <blockquote className="fw-podcast-blockquote">
                  {project.organization.description}
                  <cite>- {project.organization.name}</cite>
                </blockquote>
              </section>

              <FormatReveal experience="podcast">
                <div className="fw-podcast-tracklist">
                  <p className="fw-eyebrow fw-accent" style={{ marginBottom: "1rem" }}>
                    In this episode
                  </p>
                  <ol>
                    {chapters.map((chapter, i) => (
                      <li key={chapter.title} className="fw-podcast-track">
                        <span className="fw-podcast-track-num">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="fw-podcast-track-title">{chapter.title}</span>
                      </li>
                    ))}
                  </ol>
                  {project.tags.length > 0 ? (
                    <div className="studio-article-tags" style={{ marginTop: "1rem" }}>
                      {project.tags.map((tag) => (
                        <span key={tag} className="studio-article-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </FormatReveal>
            </div>
          </div>

          <FormatMetric project={project} />

          {/* Booth gallery */}
          {boothShots.length > 0 && (
            <section className="fpage-wide">
              <p className="fw-eyebrow fw-accent">From the booth</p>
              <div className="fw-podcast-gallery">
                {boothShots.map((img) => (
                  <div key={img.src} className="fw-podcast-gallery-item">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <FormatCta title="Need audio like this?" />
          <FormatRelated project={project} />
        </div>
      </div>
    </FormatShell>
  );
}
