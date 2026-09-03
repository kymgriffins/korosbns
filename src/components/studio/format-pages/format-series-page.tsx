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

/** Social series page — feed layout: phone hero, episode grid. */
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
      <header className="fpage-series-hero">
        <div className="studio-phone-frame relative shrink-0 bg-black">
          <Image
            src={hero.url}
            alt={project.title}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 70vw, 256px"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            <p className="text-xs font-semibold text-white/80">Short-form series</p>
            <p className="text-sm font-bold text-white">{project.title}</p>
          </div>
        </div>
        <div>
          <Eyebrow>
            Social series · {project.year} · {project.organization.name}
          </Eyebrow>
          <h1 className="studio-about-title-xl">{project.title}</h1>
          {project.subtitle ? (
            <p className="studio-article-lede">{project.subtitle}</p>
          ) : null}
          <p className="studio-article-prose">{project.briefChallenge}</p>
        </div>
      </header>

      <FormatReveal experience="vertical" className="fpage-wide">
        <Eyebrow>Episodes</Eyebrow>
        <div className="fpage-episodes">
          {project.outputs.map((output, i) => {
            const thumb = thumbs[i % Math.max(1, thumbs.length)];
            return (
              <article key={output} className="fpage-episode">
                {thumb ? (
                  <div className="fpage-episode-thumb">
                    <Image
                      src={thumb.src}
                      alt={thumb.alt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />
                    <span className="fpage-episode-num">
                      EP{String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                ) : null}
                <p className="fpage-episode-title">{output}</p>
              </article>
            );
          })}
        </div>
      </FormatReveal>

      <section className="fpage-narrow">
        <Eyebrow>Built for the feed</Eyebrow>
        <p className="studio-article-prose">{project.whatWeProduced}</p>
        <p className="studio-article-prose">{project.description}</p>
      </section>

      <FormatMetric project={project} />

      <FormatCta
        title="Need series like this?"
        line="Vertical video engineered for reach and civic action — tell us what the timeline ignores."
      />
      <FormatRelated project={project} />
    </FormatShell>
  );
}
