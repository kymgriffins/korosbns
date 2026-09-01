"use client";

import { useMemo, useState } from "react";
import {
  STUDIO_CONTENT_TYPES,
  type StudioContentType,
} from "@/constants/bns-studio-content";
import {
  studiosEvidenceData,
  type StudioProjectEvidence,
} from "@/data/studios-evidence";
import { StudioEvidenceCard } from "@/components/studio/StudioEvidenceCard";
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
  activeFormat?: StudioContentType;
  onFormatChange?: (format: StudioContentType) => void;
};

function firstFormatWithProjects(): StudioContentType {
  const counts = studiosEvidenceData.getContentTypeCounts();
  const withWork = STUDIO_CONTENT_TYPES.find((format) => (counts[format.id] ?? 0) > 0);
  return withWork?.id ?? STUDIO_CONTENT_TYPES[0].id;
}

export function StudioEvidenceByType({
  onOpenProject,
  activeFormat: controlledFormat,
  onFormatChange,
}: Props) {
  const [internalFormat, setInternalFormat] = useState<StudioContentType>(
    firstFormatWithProjects,
  );

  const activeFormat = controlledFormat ?? internalFormat;
  const setActiveFormat = onFormatChange ?? setInternalFormat;

  const counts = studiosEvidenceData.getContentTypeCounts();
  const activeMeta = STUDIO_CONTENT_TYPES.find((f) => f.id === activeFormat);
  const projects = useMemo(
    () => studiosEvidenceData.getProjectsByContentType(activeFormat),
    [activeFormat],
  );

  return (
    <LandingSection id="evidence-by-type" className="border-t-0 bg-background">
      <LandingSectionHeader
        eyebrow="Evidence library"
        title={
          <>
            Recent work across{" "}
            <span className={T.highlight}>eight formats</span>
          </>
        }
        description="Select a format to browse documented commissions. One catalogue at a time — no endless scroll through every category."
      />

      <LandingContent className="space-y-8">
        <div
          role="tablist"
          aria-label="Content format filter"
          className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {STUDIO_CONTENT_TYPES.map((format) => {
            const Icon = format.icon;
            const count = counts[format.id] ?? 0;
            const isActive = activeFormat === format.id;

            return (
              <button
                key={format.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFormat(format.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/80 bg-card text-foreground hover:border-primary/50 hover:bg-primary/5",
                )}
              >
                <Icon className="size-4 text-primary" />
                <span className="text-xs font-semibold">{format.label}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    count > 0
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {activeMeta && (
          <GsapReveal
            key={activeFormat}
            className="flex flex-col gap-6 border-b border-border/60 pb-8 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <activeMeta.icon className="size-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground sm:text-2xl">
                  {activeMeta.label}
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {activeMeta.shortDesc}
                </p>
              </div>
            </div>
            <p className="text-xs font-semibold text-muted-foreground">
              {projects.length}{" "}
              {projects.length === 1 ? "case study" : "case studies"}
            </p>
          </GsapReveal>
        )}

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
              Evidence for {activeMeta?.label} is being catalogued
            </p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
              Recent commissions in this format will appear here as they are
              documented.
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
              Commission {activeMeta?.label}
            </button>
          </div>
        )}
      </LandingContent>
    </LandingSection>
  );
}
