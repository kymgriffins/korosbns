"use client";

import { useMemo } from "react";
import { STUDIO_CONTENT_TYPES } from "@/constants/bns-studio-content";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { StudioTheatreHero } from "@/components/studio/theatre/studio-theatre-hero";
import { StudioTheatreRail } from "@/components/studio/theatre/studio-theatre-rail";
import { cn } from "@/utils";

type Props = {
  onCommissionClick?: () => void;
};

function formatSectionId(contentType: string) {
  return `format-${contentType.replace(/\s+/g, "-").toLowerCase()}`;
}

export function StudioTheatreHub({ onCommissionClick }: Props) {
  const featured = studiosEvidenceData.getFeaturedProjects();
  const bnsLed = studiosEvidenceData.getBnsLedProjects();

  const formatRows = useMemo(
    () =>
      STUDIO_CONTENT_TYPES.map((type) => ({
        type,
        projects: studiosEvidenceData.getProjectsByContentType(type.id),
      })).filter((row) => row.projects.length > 0),
    [],
  );

  const genreLinks = useMemo(
    () => [
      { id: "rail-bns-originals", label: "BNS Originals" },
      ...formatRows.map((row) => ({
        id: formatSectionId(row.type.id),
        label: row.type.label,
      })),
    ],
    [formatRows],
  );

  return (
    <div id="theatre" className="studio-theatre w-full">
      <StudioTheatreHero
        projects={featured.length > 0 ? featured : studiosEvidenceData.getAllProjects().slice(0, 4)}
        onCommissionClick={onCommissionClick}
      />

      <nav
        aria-label="Browse by format"
        className="studio-theatre-genre-nav -mt-2 pb-2"
      >
        <div className="studio-theatre-rail-track !gap-2 py-3">
          {genreLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={cn(
                "shrink-0 scroll-m-20 rounded-full border border-[var(--studio-theatre-border)]",
                "bg-[var(--studio-theatre-surface)] px-4 py-2 text-xs font-semibold text-[var(--studio-theatre-muted)]",
                "transition-colors hover:border-[var(--studio-theatre-accent)] hover:text-[var(--studio-theatre-fg)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--studio-theatre-accent)]",
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>

      {bnsLed.length > 0 ? (
        <StudioTheatreRail
          id="rail-bns-originals"
          title="BNS Originals"
          subtitle="Youth-led and mission-first productions from our own tracker network."
          projects={bnsLed}
        />
      ) : null}

      {formatRows.map(({ type, projects }) => (
        <StudioTheatreRail
          key={type.id}
          id={formatSectionId(type.id)}
          title={type.label}
          subtitle={type.shortDesc}
          contentType={type.id}
          projects={projects}
        />
      ))}

      <section className="border-t border-[var(--studio-theatre-border)] px-[var(--studio-rail-pad)] py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--studio-theatre-accent)]">
            BNS Studios
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[var(--studio-theatre-fg)] md:text-3xl">
            A theatre arm for civic storytelling
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--studio-theatre-muted)] md:text-base">
            Podcasts, explainers, documentaries, town halls, and listening sessions —
            each format gets its own stage. Commission work that reinvests in Kenya&apos;s
            budget literacy mission.
          </p>
          <button
            type="button"
            onClick={onCommissionClick}
            className="mt-6 inline-flex rounded-full bg-[var(--studio-theatre-accent)] px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--studio-theatre-accent)]"
          >
            Start a commission
          </button>
        </div>
      </section>
    </div>
  );
}
