"use client";

import { Building2, MapPin } from "lucide-react";
import {
  STUDIO_ORGANIZATION_TYPES,
} from "@/constants/bns-studio-content";
import {
  studiosEvidenceData,
  type StudioPartnerOrg,
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
};

function OrganisationBlock({
  org,
  projects,
  onOpenProject,
}: {
  org: StudioPartnerOrg;
  projects: StudioProjectEvidence[];
  onOpenProject: (project: StudioProjectEvidence) => void;
}) {
  return (
    <GsapReveal
      id={`org-${org.slug}`}
      className="scroll-mt-24 rounded-3xl border border-border/80 bg-card p-6 sm:p-8"
    >
      <div className="mb-6 flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
              {org.sector}
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">
              {projects.length}{" "}
              {projects.length === 1 ? "production" : "productions"}
            </span>
          </div>
          <h3 className="text-xl font-bold text-foreground sm:text-2xl">
            {org.name}
          </h3>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {org.description}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            <span>{org.location}</span>
          </div>
        </div>
        <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted text-sm font-bold text-foreground">
          {org.logoText}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <StudioEvidenceCard
            key={project.id}
            project={project}
            onOpen={onOpenProject}
          />
        ))}
      </div>
    </GsapReveal>
  );
}

export function StudioEvidenceByOrganisation({ onOpenProject }: Props) {
  const organizations = studiosEvidenceData.getOrganizationsWithProjects();
  const allProjects = studiosEvidenceData.getAllProjects();

  return (
    <LandingSection
      id="evidence-by-organisation"
      className="border-t-0 bg-muted/20 scroll-mt-24"
    >
      <LandingSectionHeader
        eyebrow="Evidence by organisation"
        title={
          <>
            Partner work grouped by{" "}
            <span className={T.highlight}>client</span>
          </>
        }
        description="Every commission is tied to a partner organisation. Browse dossiers below to see all documented work for each client — across any of the eight content formats."
      />

      <LandingContent className="space-y-8">
        {organizations.length > 0 ? (
          organizations.map((org) => (
            <OrganisationBlock
              key={org.id}
              org={org}
              projects={studiosEvidenceData.getProjectsByOrgSlug(org.slug)}
              onOpenProject={onOpenProject}
            />
          ))
        ) : (
          <div className="space-y-8">
            <div className="rounded-3xl border border-dashed border-border bg-card/50 p-8 text-center sm:p-12">
              <Building2 className="mx-auto mb-4 size-10 text-muted-foreground/60" />
              <p className="text-base font-bold text-foreground">
                Partner dossiers are being built
              </p>
              <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
                As recent studio commissions are catalogued, each partner
                organisation will get a dossier here showing all their documented
                work — regardless of content format.
              </p>
              {allProjects.length === 0 && (
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("booking")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className={cn(
                    T.btnPrimary,
                    "mt-6 rounded-full px-6 py-2.5 text-xs font-semibold",
                  )}
                >
                  Start a commission
                </button>
              )}
            </div>

            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Partner sectors we work with
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {STUDIO_ORGANIZATION_TYPES.map((sector) => (
                  <div
                    key={sector.id}
                    className="rounded-2xl border border-border/80 bg-card p-4"
                  >
                    <h4 className="text-sm font-bold text-foreground">
                      {sector.label}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {sector.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </LandingContent>
    </LandingSection>
  );
}
