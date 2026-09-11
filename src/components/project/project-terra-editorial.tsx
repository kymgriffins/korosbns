"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Play } from "lucide-react";
import { MediaEmbed } from "@/components/ui/media-embed";
import { renderWysiwygProseHtml } from "@/components/admin/WysiwygProseEditor";
import { PROJECT_TERRA_METADATA as meta } from "@/content/projects";

const SECTION_COUNT = 5;

/**
 * Partner-facing Project TERRA dossier — ≤5 sections, media-led, no transcript dump.
 * Flow: hook → what it is → evidence media → outcomes/partners → CTA.
 */
export interface ProjectTerraEditorialProps {
  project?: {
    id?: string;
    title?: string;
    subtitle?: string;
    prose?: string;
    wysiwygProse?: string;
    authorName?: string;
    url?: string;
    videoId?: string;
    thumbnail?: string;
    useYoutubeThumbnail?: boolean;
    funder?: string;
  };
}

export function ProjectTerraEditorial({ project }: ProjectTerraEditorialProps = {}) {
  const displayTitle = project?.title || "Project TERRA: Technology, Equality, Regulatory Risk Assessment";
  const displayLead = project?.authorName || meta.leadInvestigator.name;
  const displayVideoUrl = project?.url || meta.video.watchUrl;
  const displayProseHtml = project?.wysiwygProse ? renderWysiwygProseHtml(project.wysiwygProse) : null;
  return (
    <article
      className="min-h-screen bg-background text-foreground"
      data-testid="project-terra-editorial"
      data-section-count={SECTION_COUNT}
    >
      {/* 1. Hook */}
      <header className="border-b border-border/40 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link
              href="/bns-project"
              className="transition-colors hover:text-primary"
            >
              Projects
            </Link>
            <span aria-hidden>/</span>
            <span className="font-semibold text-foreground">Project TERRA</span>
          </nav>

          <p className="mb-5 inline-flex flex-wrap items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary">
            <span>House of Fiscal Wisdom</span>
            <span className="text-muted-foreground/60" aria-hidden>
              ·
            </span>
            <span>Supported by Luminate</span>
            <span className="text-muted-foreground/60" aria-hidden>
              ·
            </span>
            <span className="font-mono">2026–2027</span>
          </p>

          <h1 className="mb-5 text-balance text-3xl font-extrabold tracking-tight leading-[1.1] sm:text-5xl lg:text-6xl">
            Project TERRA:{" "}
            <span className="mt-2 block text-xl font-normal italic text-primary sm:mt-0 sm:inline sm:text-3xl lg:text-4xl">
              Technology, Equality, Regulatory Risk Assessment
            </span>
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            How platform algorithms and data-centre tax holidays write African
            women workers out of the fiscal ledger — and how sandboxes can put
            them back in.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-border/60 pt-8 text-xs sm:grid-cols-4">
            <div>
              <dt className="mb-1 font-mono uppercase tracking-wider text-muted-foreground">
                Lead
              </dt>
              <dd className="text-sm font-semibold text-foreground">
                {displayLead}
              </dd>
            </div>
            <div>
              <dt className="mb-1 font-mono uppercase tracking-wider text-muted-foreground">
                Host
              </dt>
              <dd className="text-sm font-semibold text-foreground">
                {meta.institutionalHost.name}
              </dd>
            </div>
            <div>
              <dt className="mb-1 font-mono uppercase tracking-wider text-muted-foreground">
                Funder
              </dt>
              <dd className="text-sm font-semibold text-foreground">
                {meta.funder.name}
              </dd>
            </div>
            <div>
              <dt className="mb-1 font-mono uppercase tracking-wider text-muted-foreground">
                Scope
              </dt>
              <dd className="text-sm font-semibold text-foreground">
                Pan-African · Kenya pilot
              </dd>
            </div>
          </dl>
        </div>
      </header>

      {/* 2. What it is */}
      <section
        className="border-b border-border/40 py-14 md:py-20"
        aria-labelledby="terra-what-heading"
        data-project-section="what"
      >
        <div className="mx-auto max-w-4xl space-y-10 px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              What it is
            </p>
            <h2
              id="terra-what-heading"
              className="text-balance text-2xl font-extrabold tracking-tight sm:text-4xl"
            >
              Research that makes digital labour fiscally visible
            </h2>
            <p className="text-base leading-relaxed text-foreground/85 sm:text-lg">
              {meta.summary}
            </p>
          </div>

          <ul className="divide-y divide-border/50 border-y border-border/50">
            {meta.pillars.map((pillar, idx) => (
              <li key={pillar.id} className="grid gap-2 py-6 sm:grid-cols-12 sm:gap-8">
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary sm:col-span-3">
                  Pillar {idx + 1}
                </p>
                <div className="sm:col-span-9">
                  <h3 className="text-lg font-bold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {pillar.subtitle}. {pillar.body.slice(0, 180).trim()}
                    {pillar.body.length > 180 ? "…" : ""}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Evidence media */}
      <section
        className="border-b border-border/40 bg-muted/15 py-14 md:py-20"
        aria-labelledby="terra-media-heading"
        data-project-section="media"
      >
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
                Evidence
              </p>
              <h2
                id="terra-media-heading"
                className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl"
              >
                Documentary announcement
              </h2>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {meta.video.durationFormatted} · Watch the film, not a transcript
            </p>
          </div>

          <div className="relative aspect-video w-full overflow-hidden border border-border/60 bg-black">
            <iframe
              src={meta.video.embedUrl}
              title={meta.video.title}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <a
            href={meta.video.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground outline-none transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Play className="size-4" aria-hidden />
            Open on YouTube
            <ExternalLink className="size-3.5" aria-hidden />
          </a>
        </div>
      </section>

      {/* 4. Outcomes / partners */}
      <section
        className="border-b border-border/40 py-14 md:py-20"
        aria-labelledby="terra-outcomes-heading"
        data-project-section="outcomes"
      >
        <div className="mx-auto max-w-4xl space-y-12 px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
              Outcomes & partners
            </p>
            <h2
              id="terra-outcomes-heading"
              className="text-balance text-2xl font-extrabold tracking-tight sm:text-4xl"
            >
              From case files to open tools partners can brief against
            </h2>
            <p className="text-base leading-relaxed text-foreground/85 sm:text-lg">
              Empirical audits of domestic labour platforms (South Africa) and
              East African logistics corridors feed open trackers, simulators,
              and a Kenya data-centre risk sandbox — hosted at the{" "}
              {meta.institutionalHost.name} with support from {meta.funder.name}.
            </p>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2">
            {meta.toolsAndOutputs.map((tool) => (
              <li key={tool.name} className="border-t border-border/60 pt-4">
                <h3 className="text-sm font-bold text-foreground">{tool.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {tool.description}
                </p>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <a
              href={meta.institutionalHost.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
            >
              Visit {meta.institutionalHost.name}
              <ExternalLink className="size-3" aria-hidden />
            </a>
            <a
              href={`mailto:${meta.institutionalHost.email}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 px-4 py-2 text-xs font-medium outline-none transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring"
            >
              {meta.institutionalHost.email}
            </a>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <footer
        className="py-14 md:py-20"
        aria-labelledby="terra-cta-heading"
        data-project-section="cta"
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <h2
              id="terra-cta-heading"
              className="text-lg font-bold text-foreground sm:text-xl"
            >
              Partner on the next evidence brief
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Co-commission research films, sandboxes, or county briefings through
              Budget Ndio Story.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/contact?intent=partner"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
            >
              Discuss a partnership
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 rounded-full border border-border/80 px-4 py-2 text-xs font-medium outline-none transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring"
            >
              All work
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
