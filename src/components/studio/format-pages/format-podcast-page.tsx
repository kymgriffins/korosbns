"use client";

import Image from "next/image";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { projectHasAudio } from "@/lib/studio-presentation";
import { chaptersFor, galleryImagesFor } from "@/lib/studio-format-details";
import {
  Eyebrow,
  FIELD_IMAGES,
  FormatCta,
  FormatMetric,
  FormatRelated,
  FormatShell,
} from "@/components/studio/format-pages/format-shared";
import { FormatReveal } from "@/components/studio/format-pages/format-motion";
import { cn } from "@/utils";

/** Podcast page — episode layout: art + player, show notes, chapters. */
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
      <header className="fpage-podcast-hero">
        <div className="fpage-podcast-art">
          <Image
            src={poster.url}
            alt={project.title}
            fill
            priority
            className={cn("object-cover", poster.position || "object-center")}
            sizes="(max-width: 768px) 70vw, 320px"
          />
        </div>
        <div>
          <Eyebrow>
            Podcast & Audio · {project.year} · {project.organization.name}
          </Eyebrow>
          <h1 className="studio-about-title-xl">{project.title}</h1>
          {project.subtitle ? (
            <p className="studio-article-lede">{project.subtitle}</p>
          ) : null}
          <div className="studio-waveform" aria-hidden>
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
            <p className="studio-article-note">
              Full episode available on request — contact BNS Studios.
            </p>
          )}
        </div>
      </header>

      <div className="fpage-podcast-grid">
        <section>
          <Eyebrow>Show notes</Eyebrow>
          <h2 className="fpage-h2">Why this episode exists.</h2>
          <p className="studio-article-prose-lg">{project.briefChallenge}</p>
          <p className="studio-article-prose">{project.description}</p>
          <blockquote className="studio-article-quote">
            {project.organization.description}
            <cite>— {project.organization.name}</cite>
          </blockquote>
        </section>
        <FormatReveal experience="podcast" className="fpage-podcast-chapters">
          <Eyebrow>In this episode</Eyebrow>
          <ol>
            {chapters.map((chapter, i) => (
              <li key={chapter.title} className="fpage-podcast-chapter">
                <span className="fpage-podcast-chapter-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{chapter.title}</span>
              </li>
            ))}
          </ol>
          {project.tags.length > 0 ? (
            <div className="studio-article-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="studio-article-tag">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </FormatReveal>
      </div>

      <FormatMetric project={project} />

      {(gallery.length > 1 || extra.length > 0) && (
        <section className="fpage-gallery-strip">
          <Eyebrow>From the booth</Eyebrow>
          <div className="fpage-strip-row">
            {boothShots.map((img) => (
              <div key={img.src} className="fpage-strip-item">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 60vw, 25vw"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <FormatCta title="Need audio like this?" />
      <FormatRelated project={project} />
    </FormatShell>
  );
}
