"use client";

import Image from "next/image";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { creditsFor, galleryImagesFor, voicesFor } from "@/lib/studio-format-details";
import {
  Eyebrow,
  FIELD_IMAGES,
  FormatCta,
  FormatMetric,
  FormatRelated,
  FormatShell,
} from "@/components/studio/format-pages/format-shared";
import { cn } from "@/utils";

/** Documentary page — film layout: full-bleed hero, synopsis, credits roll. */
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
      <header className="fpage-film-hero">
        <Image
          src={hero.url}
          alt={project.title}
          fill
          priority
          className={cn("object-cover", hero.position || "object-center")}
          sizes="100vw"
        />
        <div className="fpage-film-scrim" aria-hidden />
        <div className="fpage-film-copy">
          <Eyebrow>
            Documentary · {project.year} · {project.organization.location}
          </Eyebrow>
          <h1 className="fpage-film-title">{project.title}</h1>
          {project.subtitle ? (
            <p className="fpage-film-sub">{project.subtitle}</p>
          ) : null}
        </div>
      </header>

      <section className="fpage-narrow">
        <Eyebrow>Synopsis</Eyebrow>
        <p className="studio-article-prose-lg">{project.briefChallenge}</p>
        <p className="studio-article-prose">{project.description}</p>
      </section>

      {fieldShots.slice(0, 1).map((img) => (
        <figure key={img.src} className="fpage-fullbleed">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        </figure>
      ))}

      <section className="fpage-narrow">
        <Eyebrow>Voices in the film</Eyebrow>
        {voices.map((voice) => (
          <blockquote key={voice.name} className="fpage-film-quote">
            {voice.quote}
            <cite>
              — {voice.name}
              {voice.role ? ` · ${voice.role}` : ""}
            </cite>
          </blockquote>
        ))}
      </section>

      <section className="fpage-narrow">
        <Eyebrow>Credits</Eyebrow>
        <dl className="fpage-credits">
          {credits.map((credit) => (
            <div key={credit.role} className="fpage-credit-row">
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
    </FormatShell>
  );
}
