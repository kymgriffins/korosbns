"use client";

import Image from "next/image";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { findingsFor, galleryImagesFor, voicesFor } from "@/lib/studio-format-details";
import {
  FIELD_IMAGES,
  FormatCta,
  FormatMetric,
  FormatRelated,
  FormatShell,
} from "@/components/studio/format-pages/format-shared";
import { FormatReveal } from "@/components/studio/format-pages/format-motion";

export function FormatListeningPage({
  project,
}: {
  project: StudioProjectEvidence;
}) {
  const voices = voicesFor(project);
  const findings = findingsFor(project);
  const { gallery, extra } = galleryImagesFor(project, FIELD_IMAGES, 6);
  const sessions = [
    ...gallery.map((g) => ({ src: g.url, alt: g.caption ?? project.title })),
    ...extra,
  ];

  return (
    <FormatShell project={project}>
      <div className="fworld-listening">
        <div className="fpage-flow">
          {/* Header */}
          <header className="fw-listen-header">
            <p className="fw-eyebrow fw-accent">
              Listening · {project.organization.location} · {project.year}
            </p>
            <h1 className="fw-listen-header-title">{project.title}</h1>
            {project.subtitle ? (
              <p className="fw-listen-header-sub">{project.subtitle}</p>
            ) : null}
            <p className="studio-article-prose">{project.briefChallenge}</p>
          </header>

          {/* Voices - intimate cards */}
          <FormatReveal experience="stage" className="fpage-wide">
            <div style={{ padding: "0 1.5rem" }}>
              <p className="fw-eyebrow fw-accent">Voices</p>
              <div className="fw-listen-voices" style={{ marginTop: "1rem" }}>
                {voices.map((voice) => (
                  <blockquote key={voice.name} className="fw-listen-voice">
                    <p className="fw-listen-voice-quote">&ldquo;{voice.quote}&rdquo;</p>
                    <cite>
                      - {voice.name}
                      {voice.role ? ` · ${voice.role}` : ""}
                    </cite>
                  </blockquote>
                ))}
              </div>
            </div>
          </FormatReveal>

          {/* What we heard */}
          <section className="fw-listen-findings">
            <p className="fw-eyebrow fw-accent" style={{ marginBottom: "1rem" }}>
              What we heard
            </p>
            {findings.map((finding, i) => (
              <div key={finding.title} className="fw-listen-finding">
                <span className="fw-listen-finding-num">{i + 1}</span>
                <div>
                  <p className="fw-listen-finding-title">{finding.title}</p>
                  {finding.detail ? (
                    <p className="fw-listen-finding-detail">{finding.detail}</p>
                  ) : null}
                </div>
              </div>
            ))}
            <p className="studio-article-prose" style={{ marginTop: "1rem" }}>
              {project.description}
            </p>
          </section>

          {/* Sessions gallery */}
          <section className="fpage-wide" style={{ padding: "0 1.5rem" }}>
            <p className="fw-eyebrow fw-accent">Sessions</p>
            <div className="fw-listen-sessions" style={{ marginTop: "1rem" }}>
              {sessions.map((img) => (
                <figure key={img.src} className="fw-listen-session">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </figure>
              ))}
            </div>
          </section>

          {/* How it was run */}
          <section className="fpage-narrow" style={{ padding: "0 1.5rem" }}>
            <p className="fw-eyebrow fw-accent">How it was run</p>
            <p className="studio-article-prose" style={{ marginTop: "0.75rem" }}>
              {project.whatWeProduced}
            </p>
          </section>

          <FormatMetric project={project} />

          <FormatCta
            title="Need listening like this?"
            line="Participatory dialogues with evidence dossiers - tell us whose ground truth is missing."
          />
          <FormatRelated project={project} />
        </div>
      </div>
    </FormatShell>
  );
}
