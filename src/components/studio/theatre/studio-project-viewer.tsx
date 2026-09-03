"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { studiosEvidenceData } from "@/data/studios-evidence";
import {
  projectGallery,
  projectHasAudio,
  projectHasVideo,
} from "@/lib/studio-presentation";
import {
  StudioSiteFooter,
  StudioSiteNav,
} from "@/components/studio/theatre/studio-site-nav";
import {
  BNS_COMMUNITY_IMAGES,
  BNS_MEDIA_IMAGES,
} from "@/constants/bns-media-images";
import { cn } from "@/utils";

type Props = {
  project: StudioProjectEvidence;
};

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/,
  );
  if (!match?.[1]) return null;
  return `https://www.youtube.com/embed/${match[1]}`;
}

const FIELD_IMAGES = [
  { src: BNS_MEDIA_IMAGES.productionA, alt: "On-set videography during production" },
  { src: BNS_MEDIA_IMAGES.productionB, alt: "Studio interview session" },
  { src: BNS_MEDIA_IMAGES.hall, alt: "Hall event coverage" },
  { src: BNS_COMMUNITY_IMAGES.forumA, alt: "Town hall forum with citizens" },
  { src: BNS_COMMUNITY_IMAGES.forumC, alt: "Community dialogue session" },
  { src: BNS_COMMUNITY_IMAGES.cohortA, alt: "Youth cohort groundworks" },
];

export function StudioProjectViewer({ project }: Props) {
  const gallery = projectGallery(project);
  const hasVideo = projectHasVideo(project);
  const hasAudio = projectHasAudio(project);
  const embed = project.media.videoUrl
    ? youtubeEmbedUrl(project.media.videoUrl)
    : null;

  const galleryImages = [
    {
      url: project.media.posterUrl,
      caption: project.media.caption ?? project.title,
      position: project.media.posterPosition,
    },
    ...gallery,
  ];

  const extraImages = FIELD_IMAGES.slice(
    0,
    Math.max(0, 6 - galleryImages.length),
  );

  const related = studiosEvidenceData.getRelatedProjects(project.id, 3);

  const processSteps = [
    {
      title: "Listen first",
      body: `We started inside the brief — sitting with ${project.organization.name} to understand who this had to move and what misunderstanding it had to fix. Field notes from forums and newsroom conversations shaped the treatment before a single frame was shot.`,
    },
    {
      title: "Verify everything",
      body: `Every figure traces to a published source — Treasury tables, county documents, or partner research cited in our production notes. If a line could not be verified, it did not survive the edit. That is the BNS standard for ${project.contentType.toLowerCase()} work.`,
    },
    {
      title: "Produce for the feed",
      body: project.whatWeProduced,
    },
    {
      title: "Distribute with partners",
      body: project.impactEvidence.context,
    },
  ];

  return (
    <div className="studio-about-page studio-about-borderless studio-article">
      <StudioSiteNav active="work" />

      <article className="studio-article-body">
        {/* Hero */}
        <header className="studio-article-hero">
          <Link href="/bns-studio/work" className="studio-article-back">
            <ArrowLeft className="size-4" aria-hidden />
            All work
          </Link>
          <p className="studio-about-index">
            {project.contentType} · {project.year}
          </p>
          <h1 className="studio-about-title-xl">{project.title}</h1>
          {project.subtitle ? (
            <p className="studio-article-lede">{project.subtitle}</p>
          ) : null}
          <div className="studio-article-meta">
            <div>
              <p className="studio-article-meta-label">Partner</p>
              <p className="studio-article-meta-value">{project.organization.name}</p>
              <p className="studio-article-meta-sub">{project.organization.location}</p>
            </div>
            <div>
              <p className="studio-article-meta-label">Delivery</p>
              <p className="studio-article-meta-value studio-article-capitalize">
                {project.deliveryMode.replace("-", " ")}
              </p>
              <p className="studio-article-meta-sub">{project.date}</p>
            </div>
            <div>
              <p className="studio-article-meta-label">Format</p>
              <p className="studio-article-meta-value">{project.contentType}</p>
              <p className="studio-article-meta-sub">
                {project.outputs.length} deliverables
              </p>
            </div>
          </div>
        </header>

        {/* Feature media */}
        {embed ? (
          <figure className="studio-article-feature">
            <div className="studio-article-video">
              <iframe
                src={embed}
                title={project.title}
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <figcaption className="studio-article-caption">
              {project.media.caption ?? project.whatWeProduced}
            </figcaption>
          </figure>
        ) : (
          <figure className="studio-article-feature">
            <div className="studio-article-hero-image">
              <Image
                src={project.media.posterUrl}
                alt={project.title}
                fill
                priority
                className={cn(
                  "object-cover",
                  project.media.posterPosition || "object-center",
                )}
                sizes="100vw"
              />
            </div>
            {project.media.caption ? (
              <figcaption className="studio-article-caption">
                {project.media.caption}
              </figcaption>
            ) : null}
          </figure>
        )}

        {hasAudio && project.media.audioUrl ? (
          <div className="studio-article-audio">
            <p className="studio-about-index">Listen</p>
            <audio
              controls
              className="studio-article-audio-el"
              src={project.media.audioUrl}
              preload="metadata"
            >
              <track kind="captions" />
            </audio>
          </div>
        ) : null}

        {hasAudio && !project.media.audioUrl ? (
          <p className="studio-article-note">
            Full audio available on request — contact BNS Studios for episode
            access.
          </p>
        ) : null}

        {/* 01 — The brief */}
        <section className="studio-article-section">
          <p className="studio-about-index">01 / The brief</p>
          <h2 className="studio-about-h2">What needed to change.</h2>
          <p className="studio-article-prose-lg">{project.briefChallenge}</p>
          <p className="studio-article-prose">{project.description}</p>
          <blockquote className="studio-article-quote">
            {project.organization.description}
            <cite>— {project.organization.name}</cite>
          </blockquote>
        </section>

        {/* Image break */}
        <div className="studio-article-image-grid">
          {galleryImages.slice(0, 2).map((img) => (
            <figure key={img.url} className="studio-article-grid-item">
              <Image
                src={img.url}
                alt={img.caption ?? project.title}
                fill
                className={cn("object-cover", img.position || "object-center")}
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </figure>
          ))}
          {extraImages.slice(0, Math.max(0, 2 - galleryImages.length)).map((img) => (
            <figure key={img.src} className="studio-article-grid-item">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </figure>
          ))}
        </div>

        {/* 02 — How we worked */}
        <section className="studio-article-section">
          <p className="studio-about-index">02 / How we worked</p>
          <h2 className="studio-about-h2">Listen. Verify. Produce. Distribute.</h2>
          <p className="studio-article-prose">
            Every BNS Studios commission follows the same civic-production
            method — built for accuracy first, reach second. Here is how it
            played out on this {project.contentType.toLowerCase()} with{" "}
            {project.organization.name}.
          </p>
          <div className="studio-article-steps">
            {processSteps.map((step, i) => (
              <div key={step.title} className="studio-article-step">
                <p className="studio-article-step-num">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="studio-article-step-title">{step.title}</h3>
                <p className="studio-article-prose-sm">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 03 — What we delivered */}
        <section className="studio-article-section">
          <p className="studio-about-index">03 / What we delivered</p>
          <h2 className="studio-about-h2">The full package.</h2>
          <p className="studio-article-prose">{project.whatWeProduced}</p>
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

        {/* Full gallery */}
        <section className="studio-article-section">
          <p className="studio-about-index">04 / In pictures</p>
          <h2 className="studio-about-h2">From set to screen.</h2>
          <div className="studio-article-gallery">
            {galleryImages.map((img) => (
              <figure key={img.url} className="studio-article-gallery-item">
                <Image
                  src={img.url}
                  alt={img.caption ?? project.title}
                  fill
                  className={cn("object-cover", img.position || "object-center")}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {img.caption ? (
                  <figcaption className="studio-article-gallery-caption">
                    {img.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
            {extraImages.map((img) => (
              <figure key={img.src} className="studio-article-gallery-item">
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

        {/* 05 — Impact */}
        <section className="studio-article-section">
          <p className="studio-about-index">05 / Impact</p>
          <h2 className="studio-about-h2">What moved.</h2>
          {project.impactEvidence.primaryMetric ? (
            <p className="studio-article-metric">
              {project.impactEvidence.primaryMetric}
              {project.impactEvidence.secondaryMetric
                ? ` · ${project.impactEvidence.secondaryMetric}`
                : null}
            </p>
          ) : null}
          <p className="studio-article-prose">{project.impactEvidence.context}</p>
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

        {/* Commission CTA */}
        <section className="studio-article-section studio-article-cta">
          <p className="studio-about-index">06 / Commission</p>
          <h2 className="studio-about-h2-xl">
            Need {project.contentType.toLowerCase()} like this?
          </h2>
          <p className="studio-about-standfirst">
            Tell us your story, audience, and timeline — we respond with scope,
            references, and a production plan.
          </p>
          <div className="studio-about-hero-ctas">
            <Link href="/bns-studio/about#contact" className="studio-about-cta">
              Commission BNS Studios
            </Link>
            <Link href="/bns-studio/work" className="studio-about-ghost">
              Back to all work
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
        </section>

        {/* Keep reading */}
        {related.length > 0 ? (
          <section className="studio-article-section">
            <p className="studio-about-index">Keep reading</p>
            <div className="studio-article-related">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/bns-studio/${item.slug}`}
                  className="studio-article-related-card"
                >
                  <div className="studio-article-related-media">
                    <Image
                      src={item.media.posterUrl}
                      alt={item.title}
                      fill
                      className={cn(
                        "object-cover",
                        item.media.posterPosition || "object-center",
                      )}
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <p className="studio-article-related-type">{item.contentType}</p>
                  <h3 className="studio-article-related-title">{item.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>

      <StudioSiteFooter />
    </div>
  );
}
