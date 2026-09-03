"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { getFormatTheme } from "@/lib/studio-format-themes";
import { FormatPageMotion } from "@/components/studio/format-pages/format-motion";
import {
  StudioSiteFooter,
  StudioSiteNav,
} from "@/components/studio/theatre/studio-site-nav";
import {
  BNS_COMMUNITY_IMAGES,
  BNS_MEDIA_IMAGES,
} from "@/constants/bns-media-images";
import { cn } from "@/utils";

export const FIELD_IMAGES = [
  { src: BNS_MEDIA_IMAGES.productionA, alt: "On-set videography during production" },
  { src: BNS_MEDIA_IMAGES.productionB, alt: "Studio interview session" },
  { src: BNS_MEDIA_IMAGES.hall, alt: "Hall event coverage" },
  { src: BNS_COMMUNITY_IMAGES.forumA, alt: "Town hall forum with citizens" },
  { src: BNS_COMMUNITY_IMAGES.forumC, alt: "Community dialogue session" },
  { src: BNS_COMMUNITY_IMAGES.cohortA, alt: "Youth cohort groundworks" },
  { src: BNS_COMMUNITY_IMAGES.stakeholdersB, alt: "Stakeholder roundtable" },
  { src: BNS_COMMUNITY_IMAGES.forumB, alt: "Citizens in budget discussions" },
];

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="studio-about-index">{children}</p>;
}

export function FormatShell({
  project,
  children,
}: {
  project: StudioProjectEvidence;
  children: React.ReactNode;
}) {
  const theme = getFormatTheme(project.contentType);
  return (
    <div
      className={cn(
        "studio-about-page studio-about-borderless",
        theme.accentClass,
      )}
    >
      <StudioSiteNav active="work" />
      <div className="fpage-wrap">
        <Link href="/bns-studio/work" className="studio-article-back">
          <ArrowLeft className="size-4" aria-hidden />
          All work
        </Link>
        <FormatPageMotion experience={theme.experience}>
          <div className="fpage-flow">{children}</div>
        </FormatPageMotion>
      </div>
      <StudioSiteFooter />
    </div>
  );
}

export function FormatCta({
  title,
  line,
}: {
  title: string;
  line?: string;
}) {
  return (
    <section className="fpage-cta">
      <Eyebrow>Commission</Eyebrow>
      <h2 className="studio-about-h2-xl">{title}</h2>
      <p className="studio-about-standfirst">
        {line ??
          "Tell us your story, audience, and timeline — we respond with scope, references, and a production plan."}
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
  );
}

export function FormatRelated({ project }: { project: StudioProjectEvidence }) {
  const related = studiosEvidenceData.getRelatedProjects(project.id, 3);
  if (related.length === 0) return null;
  return (
    <section className="fpage-related">
      <Eyebrow>Keep watching</Eyebrow>
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
  );
}

export function FormatMetric({ project }: { project: StudioProjectEvidence }) {
  const { primaryMetric, secondaryMetric, context, verificationOutcome } =
    project.impactEvidence;
  return (
    <section className="fpage-metric">
      {primaryMetric ? (
        <p className="studio-article-metric">
          {primaryMetric}
          {secondaryMetric ? ` · ${secondaryMetric}` : null}
        </p>
      ) : null}
      <p className="studio-article-prose">{context}</p>
      {verificationOutcome ? (
        <p className="studio-article-prose-sm">
          <strong>Verification: </strong>
          {verificationOutcome}
        </p>
      ) : null}
    </section>
  );
}
