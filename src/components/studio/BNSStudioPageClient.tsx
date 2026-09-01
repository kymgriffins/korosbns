"use client";

import { useState } from "react";
import { StudioHero } from "@/components/studio/StudioHero";
import {
  StudioContentTypesNav,
  type EvidenceView,
} from "@/components/studio/StudioContentTypesNav";
import { StudioFeaturedWork } from "@/components/studio/StudioFeaturedWork";
import { StudioEvidenceByType } from "@/components/studio/StudioEvidenceByType";
import { StudioEvidenceByOrganisation } from "@/components/studio/StudioEvidenceByOrganisation";
import { StudioEvidenceModal } from "@/components/studio/StudioEvidenceModal";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { StudioContactCTA } from "@/components/studio/StudioContactCTA";
import { StudioLearnBridge } from "@/components/studio/StudioLearnBridge";
import { studiosEvidenceData } from "@/data/studios-evidence";
import type { StudioProjectEvidence } from "@/data/studios-evidence";

export function BNSStudioPageClient() {
  const hasFeatured = studiosEvidenceData.getFeaturedProjects().length > 0;
  const [selectedProject, setSelectedProject] =
    useState<StudioProjectEvidence | null>(null);
  const [evidenceView, setEvidenceView] = useState<EvidenceView>("format");
  const [bookingOpen, setBookingOpen] = useState(false);

  const openBooking = () => {
    setBookingOpen(true);
    requestAnimationFrame(() => {
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <>
      <StudioHero />
      <StudioLearnBridge />
      <StudioContentTypesNav
        activeView={evidenceView}
        onViewChange={setEvidenceView}
      />
      {hasFeatured && evidenceView === "format" && (
        <StudioFeaturedWork onSelectProject={setSelectedProject} />
      )}
      {evidenceView === "format" ? (
        <StudioEvidenceByType onOpenProject={setSelectedProject} />
      ) : (
        <StudioEvidenceByOrganisation onOpenProject={setSelectedProject} />
      )}
      <StudioBookingForm open={bookingOpen} onOpenChange={setBookingOpen} />
      <StudioContactCTA onCommissionClick={openBooking} />
      <StudioEvidenceModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenProject={setSelectedProject}
        onCommissionClick={openBooking}
      />
    </>
  );
}
