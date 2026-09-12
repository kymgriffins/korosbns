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

const PIPELINE = [
  {
    title: "Script",
    body: "Fiscal complexity translated into plain-language narration, verified line by line.",
  },
  {
    title: "Storyboard",
    body: "Every scene boarded before a single frame moves - pacing tuned for retention.",
  },
  {
    title: "Animate",
    body: "2D and motion graphics built from published tables and field footage.",
  },
  {
    title: "Sound",
    body: "Bilingual voice, sound design, and mastering for feeds and halls alike.",
  },
];

export function FormatAnimationPage({
  project,
}: {
  project: StudioProjectEvidence;
}) {
  const { gallery, extra } = galleryImagesFor(project, FIELD_IMAGES, 6);
  const frames = [
    ...gallery.map((g) => ({ src: g.url, alt: g.caption ?? project.title })),
    ...extra,
  ];

  return (
    <FormatShell project={project}>
      <div className="fworld-animation">
        <div className="fpage-flow">
          <header className="fpage-narrow">
            <p className="fw-eyebrow fw-accent">
              Animation · {project.year}
            </p>
            <h1 className="studio-about-title-xl" style={{ marginTop: "0.75rem" }}>
              {project.title}
            </h1>
            {project.subtitle ? (
              <p className="studio-article-lede">{project.subtitle}</p>
            ) : null}
          </header>

          {/* Pipeline - horizontal connected stages */}
          <FormatReveal experience="cinema" className="fpage-wide">
            <p className="fw-eyebrow fw-accent">The pipeline</p>
            <div className="fw-anim-pipeline">
              {PIPELINE.map((stage, i) => (
                <article key={stage.title} className="fw-anim-stage">
                  <p className="fw-anim-stage-num">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2 className="fw-anim-stage-title">{stage.title}</h2>
                  <p className="fw-anim-stage-desc">{stage.body}</p>
                </article>
              ))}
            </div>
            <p className="studio-article-prose" style={{ marginTop: "1.5rem" }}>
              {project.whatWeProduced}
            </p>
          </FormatReveal>

          {/* Style frames grid */}
          <section className="fpage-wide">
            <p className="fw-eyebrow fw-accent">Style frames</p>
            <div className="fw-anim-frames" style={{ marginTop: "1rem" }}>
              {frames.map((img) => (
                <figure key={img.src} className="fw-anim-frame">
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
            <p className="fw-eyebrow fw-accent">The brief</p>
            <p className="studio-article-prose-lg" style={{ marginTop: "0.75rem" }}>
              {project.briefChallenge}
            </p>
            <p className="fw-eyebrow fw-accent" style={{ marginTop: "1.5rem" }}>
              Deliverables
            </p>
            <ol className="studio-article-outputs" style={{ marginTop: "0.75rem" }}>
              {project.outputs.map((output, i) => (
                <li key={output} className="studio-article-output">
                  <span className="studio-article-output-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{output}</span>
                </li>
              ))}
            </ol>
          </section>

          <FormatMetric project={project} />

          <FormatCta
            title="Need motion like this?"
            line="High-retention 2D and motion explainers - tell us what words alone can't move."
          />
          <FormatRelated project={project} />
        </div>
      </div>
    </FormatShell>
  );
}
