"use client";

import Image from "next/image";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { galleryImagesFor } from "@/lib/studio-format-details";
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

const PIPELINE = [
  {
    title: "Script",
    body: "Fiscal complexity translated into plain-language narration, verified line by line.",
  },
  {
    title: "Storyboard",
    body: "Every scene boarded before a single frame moves — pacing tuned for retention.",
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

/** Animation page — pipeline layout: stages, style frames, deliverables. */
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
      <header className="fpage-narrow">
        <Eyebrow>Animation · {project.year}</Eyebrow>
        <h1 className="studio-about-title-xl">{project.title}</h1>
        {project.subtitle ? (
          <p className="studio-article-lede">{project.subtitle}</p>
        ) : null}
      </header>

      <FormatReveal experience="cinema" className="fpage-wide">
        <Eyebrow>The pipeline</Eyebrow>
        <div className="fpage-pipeline">
          {PIPELINE.map((stage, i) => (
            <article key={stage.title} className="fpage-pipeline-stage">
              <p className="fpage-pipeline-num">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="fpage-pipeline-title">{stage.title}</h2>
              <p className="studio-article-prose-sm">{stage.body}</p>
            </article>
          ))}
        </div>
        <p className="studio-article-prose">{project.whatWeProduced}</p>
      </FormatReveal>

      <section className="fpage-wide">
        <Eyebrow>Style frames</Eyebrow>
        <div className="fpage-frames">
          {frames.map((img) => (
            <figure key={img.src} className="fpage-frame">
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
        <Eyebrow>The brief</Eyebrow>
        <p className="studio-article-prose-lg">{project.briefChallenge}</p>
        <Eyebrow>Deliverables</Eyebrow>
        <ol className="studio-article-outputs">
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
        line="High-retention 2D and motion explainers — tell us what words alone can't move."
      />
      <FormatRelated project={project} />
    </FormatShell>
  );
}
