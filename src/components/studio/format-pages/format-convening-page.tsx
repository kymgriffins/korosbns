"use client";

import Image from "next/image";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { agendaFor, galleryImagesFor, voicesFor } from "@/lib/studio-format-details";
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

/** Town hall page — event layout: banner, mandate, agenda timeline. */
export function FormatConveningPage({
  project,
}: {
  project: StudioProjectEvidence;
}) {
  const agenda = agendaFor(project);
  const voices = voicesFor(project).slice(0, 1);
  const { gallery, extra } = galleryImagesFor(project, FIELD_IMAGES, 6);
  const banner = gallery[0];
  const roomShots = [
    ...gallery.slice(1).map((g) => ({ src: g.url, alt: g.caption ?? project.title })),
    ...extra,
  ];

  return (
    <FormatShell project={project}>
      <header className="fpage-stage-banner">
        <Image
          src={banner.url}
          alt={project.title}
          fill
          priority
          className={cn("object-cover", banner.position || "object-center")}
          sizes="100vw"
        />
        <div className="fpage-stage-scrim" aria-hidden />
        <div className="fpage-stage-copy">
          <Eyebrow>
            Live convening · {project.organization.location} · {project.year}
          </Eyebrow>
          <h1 className="fpage-stage-title">{project.title}</h1>
        </div>
      </header>

      <section className="fpage-narrow">
        <Eyebrow>The mandate</Eyebrow>
        <p className="studio-article-prose-lg">{project.briefChallenge}</p>
        <p className="studio-article-prose">{project.description}</p>
      </section>

      <FormatReveal experience="stage" className="fpage-narrow">
        <Eyebrow>On the agenda</Eyebrow>
        <ol className="fpage-timeline">
          {agenda.map((item, i) => (
            <li key={item.title} className="fpage-timeline-row">
              <span className="fpage-timeline-dot" aria-hidden />
              <div>
                <p className="fpage-timeline-step">
                  Session {String(i + 1).padStart(2, "0")}
                </p>
                <p className="fpage-timeline-title">{item.title}</p>
                {item.detail ? (
                  <p className="studio-article-prose-sm">{item.detail}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </FormatReveal>

      {roomShots.length > 0 ? (
        <section className="fpage-wide">
          <Eyebrow>In the room</Eyebrow>
          <div className="fpage-room-grid">
            {roomShots.slice(0, 4).map((img) => (
              <figure key={img.src} className="fpage-room-item">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {voices.map((voice) => (
        <section key={voice.name} className="fpage-narrow">
          <blockquote className="studio-article-quote">
            {voice.quote}
            <cite>
              — {voice.name}
              {voice.role ? ` · ${voice.role}` : ""}
            </cite>
          </blockquote>
        </section>
      ))}

      <FormatMetric project={project} />

      <FormatCta
        title="Need convenings like this?"
        line="Designed, facilitated, and documented end to end — tell us which room has to meet."
      />
      <FormatRelated project={project} />
    </FormatShell>
  );
}
