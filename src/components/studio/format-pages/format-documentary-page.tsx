"use client";

import Image from "next/image";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { creditsFor, galleryImagesFor, voicesFor } from "@/lib/studio-format-details";
import {
  FIELD_IMAGES,
  FormatCta,
  FormatMetric,
  FormatRelated,
  FormatShell,
} from "@/components/studio/format-pages/format-shared";
import { FormatReveal } from "@/components/studio/format-pages/format-motion";
import { cn } from "@/utils";

export function FormatDocumentaryPage({
  project,
}: {
  project: StudioProjectEvidence;
}) {
  const { gallery, extra } = galleryImagesFor(project, FIELD_IMAGES, 5);
  const hero = gallery[0];
  const voices = voicesFor(project);
  const credits = creditsFor(project);
  const fieldShots = [
    ...gallery.slice(1).map((g) => ({ src: g.url, alt: g.caption ?? project.title })),
    ...extra,
  ];

  return (
    <FormatShell project={project}>
      <div className="fworld-documentary">
        {/* Cinematic letterbox hero */}
        <header className="fw-doc-hero">
          <Image
            src={hero.url}
            alt={project.title}
            fill
            priority
            className={cn("object-cover", hero.position || "object-center")}
            sizes="100vw"
          />
          <div className="fw-doc-hero-scrim" aria-hidden />
          <div className="fw-doc-hero-copy">
            <p className="fw-doc-hero-eyebrow">
              Documentary · {project.year} · {project.organization.location}
            </p>
            <h1 className="fw-doc-hero-title">{project.title}</h1>
            {project.subtitle ? (
              <p className="fw-doc-hero-sub">{project.subtitle}</p>
            ) : null}
          </div>
        </header>

        <div className="fpage-flow">
          {/* Synopsis */}
          <section className="fw-doc-synopsis">
            <p className="fw-doc-synopsis-eyebrow">Synopsis</p>
            <p className="fw-doc-synopsis-prose">{project.briefChallenge}</p>
            <p className="fw-doc-synopsis-prose">{project.description}</p>
          </section>

          {/* Full-bleed field shot */}
          {fieldShots.slice(0, 1).map((img) => (
            <figure key={img.src} className="fw-doc-fullbleed">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-center"
                sizes="100vw"
              />
            </figure>
          ))}

          {/* Voices */}
          <FormatReveal experience="cinema" className="fw-doc-voices">
            <p className="fw-doc-hero-eyebrow">Voices in the film</p>
            {voices.map((voice) => (
              <div key={voice.name} className="fw-doc-voice">
                <blockquote>
                  {voice.quote}
                  <cite>
                    — {voice.name}
                    {voice.role ? ` · ${voice.role}` : ""}
                  </cite>
                </blockquote>
              </div>
            ))}
          </FormatReveal>

          {/* Credits roll */}
          <section className="fw-doc-credits">
            <p className="fw-doc-credits-title">Credits</p>
            <dl>
              {credits.map((credit) => (
                <div key={credit.role} className="fw-doc-credit-row">
                  <dt>{credit.role}</dt>
                  <dd>{credit.name}</dd>
                </div>
              ))}
            </dl>
          </section>

          <FormatMetric project={project} />

          <FormatCta
            title="Need film like this?"
            line="Character-driven documentary, shot on location — tell us whose reality needs a lens."
          />
          <FormatRelated project={project} />
        </div>
      </div>
    </FormatShell>
  );
}
