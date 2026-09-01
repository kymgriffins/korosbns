"use client";

import { BookOpen, Building2 } from "lucide-react";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import { cn } from "@/utils";

export type EvidenceView = "format" | "organisation";

type Props = {
  activeView: EvidenceView;
  onViewChange: (view: EvidenceView) => void;
};

export function StudioContentTypesNav({ activeView, onViewChange }: Props) {
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
        description="Filter evidence by production format or browse partner dossiers — one focused view at a time."
      />

      <LandingContent>
        <div
          role="tablist"
          aria-label="Evidence browse mode"
          className="inline-flex rounded-full border border-border bg-card p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "format"}
            onClick={() => onViewChange("format")}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeView === "format"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <BookOpen className="size-3.5" />
            By content type
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeView === "organisation"}
            onClick={() => onViewChange("organisation")}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              activeView === "organisation"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Building2 className="size-3.5" />
            By organisation
          </button>
        </div>
      </LandingContent>
    </LandingSection>
  );
}
