"use client";

import {
  PARTNER_LANDING_THESIS,
  resolvePartnerThesis,
} from "@/content/partner-landing";
import { LandingSection } from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

export interface PartnerLandingThesisProps {
  thesis?: {
    eyebrow?: string;
    title?: string;
    body?: string;
    method?: string;
  };
}

/**
 * Thin thesis + who/how band — programme clarity without dashboard chrome.
 * Sits between hero reel and the three numbered programmes.
 */
export function PartnerLandingThesis({ thesis }: PartnerLandingThesisProps = {}) {
  const { eyebrow, title, body, method } = resolvePartnerThesis(thesis);

  return (
    <LandingSection
      id="who-we-are"
      aria-labelledby="who-we-are-heading"
      className="border-t border-border/50"
    >
      <div className="max-w-2xl space-y-5">
        <p className={cn(T.eyebrow, "text-muted-foreground")}>{eyebrow}</p>
        <h2
          id="who-we-are-heading"
          className={cn(T.sectionTitle, "text-balance text-foreground")}
        >
          {title}
        </h2>
        <p className={cn(T.lead, "text-foreground/75")}>{body}</p>
        <p className="text-xs font-medium tracking-wide text-muted-foreground md:text-sm">
          {method}
        </p>
      </div>
    </LandingSection>
  );
}
