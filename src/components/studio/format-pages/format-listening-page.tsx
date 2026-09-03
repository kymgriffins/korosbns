"use client";

import Image from "next/image";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { findingsFor, galleryImagesFor, voicesFor } from "@/lib/studio-format-details";
import {
  Eyebrow,
  FIELD_IMAGES,
  FormatCta,
  FormatMetric,
  FormatRelated,
  FormatShell,
} from "@/components/studio/format-pages/format-shared";
import { FormatReveal } from "@/components/studio/format-pages/format-motion";

/** Listening page — field-notes layout: voices first, findings, sessions. */
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
      <header className="fpage-narrow">
        <Eyebrow>
          Listening · {project.organization.location} · {project.year}
        </Eyebrow>
        <h1 className="studio-about-title-xl">{project.title}</h1>
        {project.subtitle ? (
          <p className="studio-article-lede">{project.subtitle}</p>
        ) : null}
        <p className="studio-article-prose">{project.briefChallenge}</p>
      </header>

      <FormatReveal experience="stage" className="fpage-wide">
        <Eyebrow>Voices</Eyebrow>
        <div className="fpage-voices">
          {voices.map((voice) => (
            <blockquote key={voice.name} className="fpage-voice-card">
              <p className="fpage-voice-quote">“{voice.quote}”</p>
              <cite>
                — {voice.name}
                {voice.role ? ` · ${voice.role}` : ""}
              </cite>
            </blockquote>
          ))}
        </div>
      </FormatReveal>

      <section className="fpage-narrow">
        <Eyebrow>What we heard</Eyebrow>
        <ol className="fpage-heard">
          {findings.map((finding, i) => (
            <li key={finding.title} className="fpage-heard-row">
              <span className="fpage-heard-num">{i + 1}</span>
              <div>
                <p className="fpage-heard-title">{finding.title}</p>
                {finding.detail ? (
                  <p className="studio-article-prose-sm">{finding.detail}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        <p className="studio-article-prose">{project.description}</p>
      </section>

      <section className="fpage-wide">
        <Eyebrow>Sessions</Eyebrow>
        <div className="fpage-sessions">
          {sessions.map((img) => (
            <figure key={img.src} className="fpage-session-item">
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

      <section className="fpage-narrow">
        <Eyebrow>How it was run</Eyebrow>
        <p className="studio-article-prose">{project.whatWeProduced}</p>
      </section>

      <FormatMetric project={project} />

      <FormatCta
        title="Need listening like this?"
        line="Participatory dialogues with evidence dossiers — tell us whose ground truth is missing."
      />
      <FormatRelated project={project} />
    </FormatShell>
  );
}
