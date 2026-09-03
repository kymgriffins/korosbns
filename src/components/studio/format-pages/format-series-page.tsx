"use client";

import Image from "next/image";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { galleryImagesFor } from "@/lib/studio-format-details";
import {
  FIELD_IMAGES,
  FormatCta,
  FormatMetric,
  FormatRelated,
  FormatShell,
} from "@/components/studio/format-pages/format-shared";
import { FormatReveal } from "@/components/studio/format-pages/format-motion";

export function FormatSeriesPage({
  project,
}: {
  project: StudioProjectEvidence;
}) {
  const { gallery, extra } = galleryImagesFor(project, FIELD_IMAGES, 6);
  const hero = gallery[0];
  const thumbs = [
    ...gallery.slice(1).map((g) => ({ src: g.url, alt: g.caption ?? project.title })),
    ...extra,
  ];

  return (
    <FormatShell project={project}>
      <div className="fworld-series">
        <div className="fpage-flow">
          {/* Hero — phone + copy */}
          <header className="fw-series-hero">
            <div className="fw-series-phone relative shrink-0 bg-black">
              <Image
                src={hero.url}
                alt={project.title}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 768px) 60vw, 256px"
              />
              <div className="fw-series-phone-notch" aria-hidden />
              <div className="fw-series-phone-ui">
                <p className="fw-series-phone-label">Short-form series</p>
                <p className="fw-series-phone-title">{project.title}</p>
              </div>
            </div>
            <div>
              <p className="fw-eyebrow fw-accent">
                Social series · {project.year} · {project.organization.name}
              </p>
              <h1 className="studio-about-title-xl" style={{ marginTop: "0.75rem" }}>
                {project.title}
              </h1>
              {project.subtitle ? (
                <p className="studio-article-lede">{project.subtitle}</p>
              ) : null}
              <p className="studio-article-prose" style={{ marginTop: "1rem" }}>
                {project.briefChallenge}
              </p>
            </div>
          </header>

          {/* Episode grid */}
          <FormatReveal experience="vertical" className="fpage-wide">
            <p className="fw-eyebrow fw-accent">Episodes</p>
            <div className="fw-series-episodes" style={{ marginTop: "1rem" }}>
              {project.outputs.map((output, i) => {
                const thumb = thumbs[i % Math.max(1, thumbs.length)];
                return (
                  <article key={output} className="fw-series-ep">
                    {thumb ? (
                      <Image
                        src={thumb.src}
                        alt={thumb.alt}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 50vw, 20vw"
                      />
                    ) : null}
                    <div className="fw-series-ep-overlay">
                      <span className="fw-series-ep-num">
                        EP{String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="fw-series-ep-title">{output}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </FormatReveal>

          <section className="fpage-narrow">
            <p className="fw-eyebrow fw-accent">Built for the feed</p>
            <p className="studio-article-prose" style={{ marginTop: "0.75rem" }}>
              {project.whatWeProduced}
            </p>
            <p className="studio-article-prose" style={{ marginTop: "0.5rem" }}>
              {project.description}
            </p>
          </section>

          <FormatMetric project={project} />

          <FormatCta
            title="Need series like this?"
            line="Vertical video engineered for reach and civic action — tell us what the timeline ignores."
          />
          <FormatRelated project={project} />
        </div>
      </div>
    </FormatShell>
  );
}
