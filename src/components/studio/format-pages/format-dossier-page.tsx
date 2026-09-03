"use client";

import Image from "next/image";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { findingsFor, galleryImagesFor } from "@/lib/studio-format-details";
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

/** Research page — dossier layout: doc header, findings, methodology. */
export function FormatDossierPage({
  project,
}: {
  project: StudioProjectEvidence;
}) {
  const findings = findingsFor(project);
  const { gallery, extra } = galleryImagesFor(project, FIELD_IMAGES, 3);
  const cover = gallery[0];

  return (
    <FormatShell project={project}>
      <header className="fpage-doc">
        <Eyebrow>
          Research spotlight · {project.organization.name} · {project.year}
        </Eyebrow>
        <h1 className="fpage-doc-title">{project.title}</h1>
        {project.subtitle ? (
          <p className="studio-article-lede">{project.subtitle}</p>
        ) : null}
        <dl className="fpage-doc-meta">
          <div>
            <dt>Partner</dt>
            <dd>{project.organization.name}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{project.date}</dd>
          </div>
          <div>
            <dt>Delivery</dt>
            <dd className="capitalize">{project.deliveryMode.replace("-", " ")}</dd>
          </div>
        </dl>
      </header>

      <FormatReveal experience="brief" className="fpage-narrow">
        <Eyebrow>Key findings</Eyebrow>
        <ol className="fpage-findings">
          {findings.map((finding, i) => (
            <li key={finding.title} className="fpage-finding">
              <span className="fpage-finding-num">{i + 1}</span>
              <div>
                <p className="fpage-finding-title">{finding.title}</p>
                {finding.detail ? (
                  <p className="studio-article-prose-sm">{finding.detail}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </FormatReveal>

      <section className="fpage-doc-grid">
        <div className="fpage-doc-cover">
          <Image
            src={cover.url}
            alt={project.title}
            fill
            priority
            className={cn("object-cover", cover.position || "object-center")}
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
        <div>
          <Eyebrow>Methodology</Eyebrow>
          <p className="studio-article-prose">{project.briefChallenge}</p>
          <p className="studio-article-prose">{project.whatWeProduced}</p>
          {extra.slice(0, 1).map((img) => (
            <div key={img.src} className="fpage-doc-extra">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="fpage-narrow">
        <Eyebrow>Sources & verification</Eyebrow>
        <p className="studio-article-prose">{project.description}</p>
        {project.impactEvidence.verificationOutcome ? (
          <p className="studio-article-prose-sm">
            <strong>Verification: </strong>
            {project.impactEvidence.verificationOutcome}
          </p>
        ) : null}
        {project.tags.length > 0 ? (
          <div className="studio-article-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="studio-article-tag">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <FormatMetric project={project} />

      <FormatCta
        title="Need dossiers like this?"
        line="Institutional research, translated for real audiences — tell us what needs digesting."
      />
      <FormatRelated project={project} />
    </FormatShell>
  );
}
