"use client";

import { useState } from "react";
import { StudioHero } from "@/components/studio/StudioHero";
import { StudioContentTypesNav } from "@/components/studio/StudioContentTypesNav";
import { StudioFeaturedWork } from "@/components/studio/StudioFeaturedWork";
import { StudioEvidenceByType } from "@/components/studio/StudioEvidenceByType";
import { StudioEvidenceByOrganisation } from "@/components/studio/StudioEvidenceByOrganisation";
import { StudioEvidenceModal } from "@/components/studio/StudioEvidenceModal";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { StudioContactCTA } from "@/components/studio/StudioContactCTA";
import { studiosEvidenceData } from "@/data/studios-evidence";
import type { StudioProjectEvidence } from "@/data/studios-evidence";

export function BNSStudioPageClient() {
  const hasFeatured = studiosEvidenceData.getFeaturedProjects().length > 0;
  const [selectedProject, setSelectedProject] =
    useState<StudioProjectEvidence | null>(null);

  return (
    <>
      <StudioHero />
      <StudioContentTypesNav />
      {hasFeatured && (
        <StudioFeaturedWork onSelectProject={setSelectedProject} />
      )}
      <StudioEvidenceByType onOpenProject={setSelectedProject} />
      <StudioEvidenceByOrganisation onOpenProject={setSelectedProject} />
      <StudioBookingForm />
      <StudioContactCTA />
      <StudioEvidenceModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenProject={setSelectedProject}
      />
    </>
  );
}
