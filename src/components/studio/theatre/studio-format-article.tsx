"use client";

import Image from "next/image";
import { Mic, Play } from "lucide-react";
import type { StudioContentType } from "@/constants/bns-studio-content";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { projectHasAudio } from "@/lib/studio-presentation";
import { getFormatTheme } from "@/lib/studio-format-themes";
import { cn } from "@/utils";

export type FormatArticleCopy = {
  /** Small line above the title — sets the vibe per category. */
  kicker: string;
  /** Hero media section label. */
  mediaLabel: string;
  briefIndex: string;
  briefTitle: string;
  processIndex: string;
  processTitle: string;
  processIntro: string;
  deliverablesTitle: string;
  galleryIndex: string;
  galleryTitle: string;
  impactIndex: string;
  impactTitle: string;
  ctaTitle: string;
};

export const FORMAT_ARTICLE_COPY: Record<StudioContentType, FormatArticleCopy> = {
  "Podcast & Audio": {
    kicker: "A BNS Studios audio production",
    mediaLabel: "Listen",
    briefIndex: "01 / The brief",
    briefTitle: "What needed a microphone.",
    processIndex: "02 / How we recorded it",
    processTitle: "Pitch. Record. Master. Syndicate.",
    processIntro:
      "Studio interviews, field ambience, and mastering — built for repeat listening, not background noise.",
    deliverablesTitle: "The season package.",
    galleryIndex: "03 / From the booth",
    galleryTitle: "Sessions & sound.",
    impactIndex: "04 / Reach",
    impactTitle: "Who pressed play.",
    ctaTitle: "Need audio like this?",
  },
  Animations: {
    kicker: "A BNS Studios motion piece",
    mediaLabel: "Watch",
    briefIndex: "01 / The brief",
    briefTitle: "What words alone couldn't move.",
    processIndex: "02 / How we animated it",
    processTitle: "Script. Storyboard. Animate. Sound.",
    processIntro:
      "Complex legislation in, high-retention motion out — every frame verified before it moves.",
    deliverablesTitle: "The cut-down package.",
    galleryIndex: "03 / Frames & motion",
    galleryTitle: "Stills from the timeline.",
    impactIndex: "04 / Retention",
    impactTitle: "What stuck.",
    ctaTitle: "Need motion like this?",
  },
  "Explainer Videos": {
    kicker: "A BNS Studios explainer",
    mediaLabel: "Watch",
    briefIndex: "01 / The confusion",
    briefTitle: "What people couldn't follow.",
    processIndex: "02 / How we broke it down",
    processTitle: "Simplify. Visualise. Present. Cut down.",
    processIntro:
      "Presenter-led clarity with motion graphics built from published tables — no synthetic scaling of figures.",
    deliverablesTitle: "The explainer package.",
    galleryIndex: "03 / On set",
    galleryTitle: "Presenters & graphics.",
    impactIndex: "04 / Comprehension",
    impactTitle: "What clicked.",
    ctaTitle: "Need explainers like this?",
  },
  "Research Spotlights": {
    kicker: "A BNS Studios research dossier",
    mediaLabel: "The file",
    briefIndex: "01 / The question",
    briefTitle: "What the brief asked.",
    processIndex: "02 / How we packaged it",
    processTitle: "Digest. Visualise. Cite. Publish.",
    processIntro:
      "Institutional research translated into multimedia a non-specialist can finish — every claim cited.",
    deliverablesTitle: "The dossier contents.",
    galleryIndex: "03 / Evidence wall",
    galleryTitle: "Charts, briefs & fieldwork.",
    impactIndex: "04 / Uptake",
    impactTitle: "Who cited it.",
    ctaTitle: "Need dossiers like this?",
  },
  Documentaries: {
    kicker: "A BNS Studios documentary",
    mediaLabel: "Watch the film",
    briefIndex: "01 / The story",
    briefTitle: "Whose reality needed a lens.",
    processIndex: "02 / How we filmed it",
    processTitle: "Embed. Shoot. Cut. Grade.",
    processIntro:
      "Character-driven and shot on location — grassroots realities, cinematically held, never staged.",
    deliverablesTitle: "The release package.",
    galleryIndex: "03 / From the field",
    galleryTitle: "Frames from location.",
    impactIndex: "04 / After the credits",
    impactTitle: "What endured.",
    ctaTitle: "Need film like this?",
  },
  "Social Media Series": {
    kicker: "A BNS Studios short-form series",
    mediaLabel: "Watch vertical",
    briefIndex: "01 / The feed problem",
    briefTitle: "What the timeline ignored.",
    processIndex: "02 / How we engineered it",
    processTitle: "Hook. Shoot vertical. Caption. Post.",
    processIntro:
      "Bite-sized vertical video engineered for reach and civic action — cut for the scroll, captioned for sound-off.",
    deliverablesTitle: "The series drop.",
    galleryIndex: "03 / On the grid",
    galleryTitle: "Episodes & stills.",
    impactIndex: "04 / Reach",
    impactTitle: "What travelled.",
    ctaTitle: "Need series like this?",
  },
  "Town Hall Design & Facilitation": {
    kicker: "A BNS Studios convening",
    mediaLabel: "In the room",
    briefIndex: "01 / The mandate",
    briefTitle: "Why the room had to meet.",
    processIndex: "02 / How we convened it",
    processTitle: "Design. Invite. Facilitate. Document.",
    processIntro:
      "Curated multi-stakeholder convening with live recording — high-trust dialogue, broadcast-grade capture.",
    deliverablesTitle: "The convening record.",
    galleryIndex: "03 / In the room",
    galleryTitle: "Faces & forums.",
    impactIndex: "04 / After the hall",
    impactTitle: "What the room changed.",
    ctaTitle: "Need convenings like this?",
  },
  "Community Listening Sessions": {
    kicker: "A BNS Studios listening record",
    mediaLabel: "Voices",
    briefIndex: "01 / Why listen",
    briefTitle: "Whose ground truth was missing.",
    processIndex: "02 / How we listened",
    processTitle: "Enter. Listen. Record. Dossier.",
    processIntro:
      "Hyper-local participatory dialogues — ground-level budget evidence, captured with consent and care.",
    deliverablesTitle: "The evidence dossier.",
    galleryIndex: "03 / On the ground",
    galleryTitle: "Sessions & streets.",
    impactIndex: "04 / What we heard",
    impactTitle: "What the ground said.",
    ctaTitle: "Need listening like this?",
  },
};

export function getFormatArticleCopy(contentType: StudioContentType): FormatArticleCopy {
  return FORMAT_ARTICLE_COPY[contentType];
}

function youtubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/,
  );
  if (!match?.[1]) return null;
  return `https://www.youtube.com/embed/${match[1]}`;
}

function Waveform() {
  return (
    <div className="studio-waveform" aria-hidden>
      {Array.from({ length: 7 }).map((_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

/**
 * Per-experience hero media — podcast feels like audio, vertical feels
 * like a phone, stage feels like a hall, brief feels like a dossier.
 */
export function FormatHeroMedia({ project }: { project: StudioProjectEvidence }) {
  const theme = getFormatTheme(project.contentType);
  const copy = getFormatArticleCopy(project.contentType);
  const embed = project.media.videoUrl
    ? youtubeEmbedUrl(project.media.videoUrl)
    : null;
  const posterClass = cn(
    "object-cover",
    project.media.posterPosition || "object-center",
  );

  if (theme.experience === "podcast") {
    return (
      <figure className="studio-article-feature">
        <div className={cn("studio-format-hero-podcast", theme.accentClass)}>
          <div className="studio-format-hero-podcast-art">
            <Image
              src={project.media.posterUrl}
              alt={project.title}
              fill
              priority
              className={posterClass}
              sizes="(max-width: 768px) 60vw, 320px"
            />
          </div>
          <div className="studio-format-hero-podcast-copy">
            <p className="studio-format-hero-media-label">
              <Mic className="size-3.5" aria-hidden />
              {copy.mediaLabel}
            </p>
            <Waveform />
            {projectHasAudio(project) && project.media.audioUrl ? (
              <audio
                controls
                className="studio-article-audio-el"
                src={project.media.audioUrl}
                preload="metadata"
              >
                <track kind="captions" />
              </audio>
            ) : (
              <p className="studio-article-note">
                Full episode available on request — contact BNS Studios.
              </p>
            )}
          </div>
        </div>
        {project.media.caption ? (
          <figcaption className="studio-article-caption">
            {project.media.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (theme.experience === "vertical") {
    return (
      <figure className="studio-article-feature studio-format-hero-vertical-wrap">
        <div className="studio-phone-frame relative bg-black">
          {embed ? (
            <iframe
              src={embed}
              title={project.title}
              className="size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <Image
              src={project.media.posterUrl}
              alt={project.title}
              fill
              priority
              className={posterClass}
              sizes="(max-width: 768px) 70vw, 256px"
            />
          )}
          {!embed ? (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
              <p className="text-xs font-semibold text-white/80">{copy.mediaLabel}</p>
              <p className="text-sm font-bold text-white">{project.title}</p>
            </div>
          ) : null}
        </div>
        <div className="studio-format-hero-vertical-copy">
          <p className="studio-about-index">{copy.mediaLabel}</p>
          <p className="studio-article-prose">{project.whatWeProduced}</p>
          {project.media.videoUrl && !embed ? (
            <a
              href={project.media.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="studio-about-ghost"
            >
              Watch the series
              <Play className="size-4" aria-hidden />
            </a>
          ) : null}
        </div>
      </figure>
    );
  }

  if (theme.experience === "stage") {
    return (
      <figure className="studio-article-feature">
        <div className="studio-format-hero-stage">
          <Image
            src={project.media.posterUrl}
            alt={project.title}
            fill
            priority
            className={posterClass}
            sizes="100vw"
          />
          <div className="studio-format-hero-stage-scrim" aria-hidden />
          <div className="studio-format-hero-stage-copy">
            <p className="studio-format-hero-media-label">
              {copy.mediaLabel} · {project.organization.name}
            </p>
            <p className="studio-format-hero-stage-line">{project.whatWeProduced}</p>
          </div>
        </div>
        {project.media.caption ? (
          <figcaption className="studio-article-caption">
            {project.media.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (theme.experience === "brief") {
    return (
      <figure className="studio-article-feature studio-format-hero-brief-grid">
        <div className="studio-format-hero-brief-media">
          <Image
            src={project.media.posterUrl}
            alt={project.title}
            fill
            priority
            className={posterClass}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className={cn("studio-format-hero-brief-card", theme.accentClass)}>
          <p className="studio-format-hero-media-label">{copy.mediaLabel}</p>
          <p className="studio-format-hero-brief-text">{project.description}</p>
          {project.impactEvidence.primaryMetric ? (
            <p className="studio-format-hero-brief-metric">
              {project.impactEvidence.primaryMetric}
            </p>
          ) : null}
        </div>
      </figure>
    );
  }

  return (
    <figure className="studio-article-feature">
      <div className="studio-article-video">
        {embed ? (
          <iframe
            src={embed}
            title={project.title}
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="relative size-full">
            <Image
              src={project.media.posterUrl}
              alt={project.title}
              fill
              priority
              className={posterClass}
              sizes="100vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/35">
              <span className="flex size-16 items-center justify-center rounded-full bg-white/95 text-black">
                <Play className="size-7 fill-current pl-0.5" aria-hidden />
              </span>
            </div>
          </div>
        )}
      </div>
      <figcaption className="studio-article-caption">
        {project.media.caption ?? project.whatWeProduced}
      </figcaption>
    </figure>
  );
}
