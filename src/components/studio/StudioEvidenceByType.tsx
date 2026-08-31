"use client";

import { STUDIO_CONTENT_TYPES } from "@/constants/bns-studio-content";
import {
  studiosEvidenceData,
  type StudioProjectEvidence,
} from "@/data/studios-evidence";
import { StudioEvidenceCard } from "@/components/studio/StudioEvidenceCard";
import { contentTypeSlug } from "@/components/studio/studio-evidence-utils";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { GsapReveal } from "@/motion/gsap";
import { cn } from "@/utils";

type Props = {
  onOpenProject: (project: StudioProjectEvidence) => void;
};

function TypeSection({
  format,
  index,
  onOpenProject,
}: {
  format: (typeof STUDIO_CONTENT_TYPES)[number];
  index: number;
  onOpenProject: (project: StudioProjectEvidence) => void;
}) {
  const Icon = format.icon;
  const projects = studiosEvidenceData.getProjectsByContentType(format.id);
  const slug = contentTypeSlug(format.id);

  return (
    <LandingSection
      id={`evidence-${slug}`}
      className={cn(
        "border-t-0 scroll-mt-24",
        index % 2 === 0 ? "bg-background" : "bg-muted/20",
      )}
    >
      <LandingContent>
        <GsapReveal className="mb-8 flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon className="size-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Content type {index + 1} of 8
              </p>
              <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                {format.label}
              </h3>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {format.shortDesc}
              </p>
            </div>
          </div>
          <p className="text-xs font-semibold text-muted-foreground">
            {projects.length}{" "}
            {projects.length === 1 ? "case study" : "case studies"}
          </p>
        </GsapReveal>

        {projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <StudioEvidenceCard
                key={project.id}
                project={project}
                onOpen={onOpenProject}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
            <p className="text-sm font-semibold text-foreground">
              Evidence for {format.label} is being catalogued
            </p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
              Recent commissions in this format will appear here as they are
              documented. Have work to share or need this format produced?
            </p>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("booking")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className={cn(
                T.btnPrimary,
                "mt-5 rounded-full px-6 py-2.5 text-xs font-semibold",
              )}
            >
              Commission {format.label}
            </button>
          </div>
        )}
      </LandingContent>
    </LandingSection>
  );
}

export function StudioEvidenceByType({ onOpenProject }: Props) {
  return (
    <>
      <LandingSection id="evidence-by-type" className="border-t-0 bg-background">
        <LandingSectionHeader
          eyebrow="Evidence by content type"
          title={
            <>
              Recent work across{" "}
              <span className={T.highlight}>eight formats</span>
            </>
          }
          description="Each section below surfaces documented commissions for one production format — podcasts, animations, explainers, research spotlights, documentaries, social series, town halls, and listening sessions."
        />
      </LandingSection>

      {STUDIO_CONTENT_TYPES.map((format, index) => (
        <TypeSection
          key={format.id}
          format={format}
          index={index}
          onOpenProject={onOpenProject}
        />
      ))}
    </>
  );
}
