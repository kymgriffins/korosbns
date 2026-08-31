"use client";

import {
  STUDIO_CONTENT_TYPES,
  type StudioContentType,
} from "@/constants/bns-studio-content";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { contentTypeSlug } from "@/components/studio/studio-evidence-utils";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { cn } from "@/utils";

export function StudioContentTypesNav() {
  const counts = studiosEvidenceData.getContentTypeCounts();

  const scrollToType = (type: StudioContentType) => {
    document
      .getElementById(`evidence-${contentTypeSlug(type)}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToOrganisations = () => {
    document
      .getElementById("evidence-by-organisation")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <LandingSection id="content-types" className="border-t-0 bg-muted/20">
      <LandingSectionHeader
        eyebrow="Browse the library"
        title={
          <>
            Eight formats.{" "}
            <span className={T.highlight}>Two ways in.</span>
          </>
        }
        description="Jump straight to evidence by content type or scroll to partner organisations. Each section surfaces recent work as it is catalogued."
      />

      <LandingContent className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            By content type
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {STUDIO_CONTENT_TYPES.map((format) => {
              const Icon = format.icon;
              const count = counts[format.id] ?? 0;

              return (
                <button
                  key={format.id}
                  type="button"
                  onClick={() => scrollToType(format.id)}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2.5 text-left transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="size-4 text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    {format.label}
                  </span>
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
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            By organisation
          </p>
          <button
            type="button"
            onClick={scrollToOrganisations}
            className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            View partner dossiers
          </button>
        </div>
      </LandingContent>
    </LandingSection>
  );
}
