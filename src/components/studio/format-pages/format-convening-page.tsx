"use client";

import Image from "next/image";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { agendaFor, galleryImagesFor, voicesFor } from "@/lib/studio-format-details";
import {
  FIELD_IMAGES,
  FormatCta,
  FormatMetric,
  FormatRelated,
  FormatShell,
} from "@/components/studio/format-pages/format-shared";
import { FormatReveal } from "@/components/studio/format-pages/format-motion";
import { cn } from "@/utils";

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
      <div className="fworld-convening">
        {/* Stage banner */}
        <header className="fw-stage-banner">
          <Image
            src={banner.url}
            alt={project.title}
            fill
            priority
            className={cn("object-cover", banner.position || "object-center")}
            sizes="100vw"
          />
          <div className="fw-stage-banner-scrim" aria-hidden />
          <div className="fw-stage-banner-copy">
            <p className="fw-stage-banner-eyebrow">
              Live convening · {project.organization.location} · {project.year}
            </p>
            <h1 className="fw-stage-banner-title">{project.title}</h1>
          </div>
        </header>

        <div className="fpage-flow">
          {/* The mandate */}
          <section className="fpage-narrow" style={{ padding: "3rem 1.5rem" }}>
            <p className="fw-eyebrow fw-accent">The mandate</p>
            <p className="studio-article-prose-lg" style={{ marginTop: "0.75rem" }}>
              {project.briefChallenge}
            </p>
            <p className="studio-article-prose" style={{ marginTop: "0.5rem" }}>
              {project.description}
            </p>
          </section>

          {/* Agenda timeline */}
          <FormatReveal experience="stage" className="fw-stage-agenda">
            <p className="fw-stage-agenda-title">On the agenda</p>
            <ol className="fw-stage-agenda-list">
              {agenda.map((item, i) => (
                <li key={item.title} className="fw-stage-agenda-item">
                  <span className="fw-stage-agenda-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="fw-stage-agenda-title-text">{item.title}</p>
                    {item.detail ? (
                      <p className="fw-stage-agenda-detail">{item.detail}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </FormatReveal>

          {/* Room photos */}
          {roomShots.length > 0 ? (
            <div className="fw-stage-room">
              {roomShots.slice(0, 4).map((img) => (
                <figure key={img.src} className="fw-stage-room-item">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </figure>
              ))}
            </div>
          ) : null}

          {/* Voice */}
          {voices.map((voice) => (
            <section key={voice.name} className="fpage-narrow" style={{ padding: "0 1.5rem" }}>
              <blockquote className="studio-article-quote">
                {voice.quote}
                <cite>
                  - {voice.name}
                  {voice.role ? ` · ${voice.role}` : ""}
                </cite>
              </blockquote>
            </section>
          ))}

          <FormatMetric project={project} />

          <FormatCta
            title="Need convenings like this?"
            line="Designed, facilitated, and documented end to end - tell us which room has to meet."
          />
          <FormatRelated project={project} />
        </div>
      </div>
    </FormatShell>
  );
}
