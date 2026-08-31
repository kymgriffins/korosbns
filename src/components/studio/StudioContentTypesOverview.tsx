"use client";

import { useCallback } from "react";
import {
  STUDIO_CONTENT_TYPES,
  type StudioContentType,
} from "@/constants/bns-studio-content";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { GsapReveal } from "@/motion/gsap";
import { cn } from "@/utils";

type Props = {
  activeType?: StudioContentType | "All";
  onSelectType?: (type: StudioContentType) => void;
};

export function StudioContentTypesOverview({
  activeType = "All",
  onSelectType,
}: Props) {
  const counts = studiosEvidenceData.getContentTypeCounts();
  const totalProjects = studiosEvidenceData.getAllProjects().length;

  const scrollToPortfolio = useCallback((type?: StudioContentType) => {
    if (type && onSelectType) {
      onSelectType(type);
    }
    document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
  }, [onSelectType]);

  return (
    <LandingSection id="content-types" className="border-t-0 bg-muted/20">
      <LandingSectionHeader
        eyebrow="8 Production Formats"
        title={
          <>
            Browse evidence by{" "}
            <span className={T.highlight}>content type</span>
          </>
        }
        description="Every BNS Studios commission fits one of eight formats. Select a format to explore documented work — or commission a new production."
      />

      <LandingContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STUDIO_CONTENT_TYPES.map((format, index) => {
            const Icon = format.icon;
            const count = counts[format.id] ?? 0;
            const isActive = activeType === format.id;

            return (
              <GsapReveal key={format.id} delay={index * 0.04}>
                <button
                  type="button"
                  onClick={() => scrollToPortfolio(format.id)}
                  className={cn(
                    "group flex h-full w-full flex-col rounded-2xl border p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
                      : "border-border/80 bg-card hover:border-primary/50 hover:bg-muted/30",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground",
                      )}
                    >
                      <Icon className="size-5" />
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        count > 0
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {count} {count === 1 ? "project" : "projects"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-foreground">
                    {format.label}
                  </h3>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-muted-foreground">
                    {format.shortDesc}
                  </p>

                  <span className="mt-4 text-xs font-semibold text-primary group-hover:underline">
                    {count > 0 ? "View evidence" : "Commission this format"}
                  </span>
                </button>
              </GsapReveal>
            );
          })}
        </div>

        {totalProjects === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/60 p-6 text-center sm:p-8">
            <p className="text-sm font-semibold text-foreground">
              Evidence library updating
            </p>
            <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-muted-foreground">
              Recent studio work is being catalogued by format and partner
              organisation. Select a format above to commission, or check back
              as new case studies are published.
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
              Commission BNS Studios
            </button>
          </div>
        )}
      </LandingContent>
    </LandingSection>
  );
}
