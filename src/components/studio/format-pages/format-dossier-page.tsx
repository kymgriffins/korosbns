"use client";

import Image from "next/image";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { findingsFor, galleryImagesFor } from "@/lib/studio-format-details";
import {
  FIELD_IMAGES,
  FormatCta,
  FormatMetric,
  FormatRelated,
  FormatShell,
} from "@/components/studio/format-pages/format-shared";
import { FormatReveal } from "@/components/studio/format-pages/format-motion";
import { cn } from "@/utils";

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
      <div className="fworld-dossier">
        <div className="fpage-flow">
          {/* Document header - classified style */}
          <header className="fw-dossier-header">
            <span className="fw-dossier-header-stamp">Research spotlight</span>
            <h1 className="fw-dossier-header-title">{project.title}</h1>
            {project.subtitle ? (
              <p className="studio-article-lede">{project.subtitle}</p>
            ) : null}
            <dl className="fw-dossier-header-meta">
              <div className="fw-dossier-meta-item">
                <dt>Partner</dt>
                <dd>{project.organization.name}</dd>
              </div>
              <div className="fw-dossier-meta-item">
                <dt>Date</dt>
                <dd>{project.date}</dd>
              </div>
              <div className="fw-dossier-meta-item">
                <dt>Delivery</dt>
                <dd className="capitalize">{project.deliveryMode.replace("-", " ")}</dd>
              </div>
            </dl>
          </header>

          {/* Findings index */}
          <FormatReveal experience="brief" className="fw-dossier-findings">
            <p className="fw-eyebrow fw-accent" style={{ marginBottom: "1rem" }}>
              Key findings
            </p>
            {findings.map((finding, i) => (
              <div key={finding.title} className="fw-dossier-finding">
                <span className="fw-dossier-finding-num">{i + 1}</span>
                <div>
                  <p className="fw-dossier-finding-title">{finding.title}</p>
                  {finding.detail ? (
                    <p className="fw-dossier-finding-detail">{finding.detail}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </FormatReveal>

          {/* Methodology grid */}
          <section className="fw-dossier-method">
            <div className="fw-dossier-cover">
              <Image
                src={cover.url}
                alt={project.title}
                fill
                priority
                className={cn("object-cover", cover.position || "object-center")}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
            <div className="fw-dossier-method-text">
              <p className="fw-eyebrow fw-accent">Methodology</p>
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

          {/* Sources & verification */}
          <section className="fpage-narrow">
            <p className="fw-eyebrow fw-accent">Sources &amp; verification</p>
            <p className="studio-article-prose" style={{ marginTop: "0.75rem" }}>
              {project.description}
            </p>
            {project.impactEvidence.verificationOutcome ? (
              <p className="studio-article-prose-sm" style={{ marginTop: "0.5rem" }}>
                <strong>Verification: </strong>
                {project.impactEvidence.verificationOutcome}
              </p>
            ) : null}
            {project.tags.length > 0 ? (
              <div className="studio-article-tags" style={{ marginTop: "0.75rem" }}>
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
            line="Institutional research, translated for real audiences - tell us what needs digesting."
          />
          <FormatRelated project={project} />
        </div>
      </div>
    </FormatShell>
  );
}
