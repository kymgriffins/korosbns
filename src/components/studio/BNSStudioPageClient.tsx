"use client";

import { useState } from "react";
import { StudioHero } from "@/components/studio/StudioHero";
import { StudioContentTypesOverview } from "@/components/studio/StudioContentTypesOverview";
import { StudioFeaturedWork } from "@/components/studio/StudioFeaturedWork";
import { StudioPortfolio } from "@/components/studio/StudioPortfolio";
import { StudioServices } from "@/components/studio/StudioServices";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { StudioContactCTA } from "@/components/studio/StudioContactCTA";
import { studiosEvidenceData } from "@/data/studios-evidence";
import type { StudioContentType } from "@/constants/bns-studio-content";
import type { StudioProjectEvidence } from "@/data/studios-evidence";

export function BNSStudioPageClient() {
  const hasFeatured = studiosEvidenceData.getFeaturedProjects().length > 0;
  const [portfolioContentType, setPortfolioContentType] = useState<
    StudioContentType | undefined
  >();
  const [selectedProject, setSelectedProject] =
    useState<StudioProjectEvidence | null>(null);

  return (
    <>
      <StudioHero />
      <StudioContentTypesOverview
        activeType={portfolioContentType ?? "All"}
        onSelectType={setPortfolioContentType}
      />
      {hasFeatured && (
        <StudioFeaturedWork onSelectProject={setSelectedProject} />
      )}
      <StudioPortfolio
        initialContentType={portfolioContentType}
        selectedProject={selectedProject}
        onOpenProject={setSelectedProject}
        onCloseProject={() => setSelectedProject(null)}
      />
      <StudioServices />
      <StudioBookingForm />
      <StudioContactCTA />
    </>
  );
}
