"use client";

import { useMemo } from "react";
import { EditorialSectionHeader } from "@/components/ui/editorial";
import { HubSectionNav } from "@/components/work-hub/hub-section-nav";
import {
  PartnershipCorridor,
  ProgrammeWorkLane,
} from "@/components/work-hub/partnership-corridor";
import { WorkProjectCard } from "@/components/work-hub/work-project-card";
import {
  PROGRAMME_CARD_BLURBS,
  PROGRAMMES,
  programmeHref,
} from "@/content";
import {
  studiosEvidenceData,
  type StudioProjectEvidence,
} from "@/data/studios-evidence";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { GsapReveal } from "@/motion/gsap";
import { SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { cn } from "@/utils";

const BNS_LED_ORG = studiosEvidenceData
  .getAllOrganizations()
  .find((org) => org.slug === "bns-youth-trackers");

function WorkSpotlight({ projects }: { projects: StudioProjectEvidence[] }) {
  if (projects.length === 0) return null;
  const [lead, ...rest] = projects;

  return (
    <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
      <div className="lg:col-span-7">
        <WorkProjectCard project={lead} variant="spotlight" priority />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
        {rest.slice(0, 2).map((project) => (
          <WorkProjectCard key={project.id} project={project} variant="compact" />
        ))}
      </div>
    </div>
  );
}

export function MissionWorkHub() {
  const stats = studiosEvidenceData.getMissionStats();
  const featured = studiosEvidenceData.getFeaturedProjects();
  const bnsLed = studiosEvidenceData.getBnsLedProjects();
  const corridors = studiosEvidenceData.getPartnerCorridors();
  const programmeLanes = studiosEvidenceData.getProgrammeLanes();

  const sections = useMemo(() => {
    const links = [
      { id: "work-spotlight", label: "Spotlight" },
      { id: "work-bns-led", label: "BNS-led" },
      ...corridors.map((corridor) => ({
        id: `work-partner-${corridor.org.slug}`,
        label: corridor.org.logoText || corridor.org.name,
      })),
      { id: "work-programmes", label: "By programme" },
    ];
    return links;
  }, [corridors]);

  return (
    <div id="projects" className="border-t border-border/30 bg-background">
      <section className={cn(SECTION_SHELL_PADDING, "pb-10 md:pb-12")}>
        <div className={SECTION_SHELL_INNER}>
          <GsapReveal>
            <EditorialSectionHeader
              eyebrow="Impact production hub"
              title="Work that advances the mission"
              description="BNS Studios produces evidence-based storytelling — solo, co-produced with civic partners, and commissioned by institutions that share our standard for fiscal honesty."
            />
          </GsapReveal>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-border/40 py-6 md:grid-cols-4 md:gap-6">
            {[
              { label: "Productions", value: stats.productionCount },
              { label: "Partner corridors", value: stats.partnerCount },
              { label: "Programmes fed", value: stats.programmeCount },
              { label: "BNS-led field work", value: stats.bnsLedCount },
            ].map((item) => (
              <div key={item.label}>
                <dt className={cn(T.caption, "text-muted-foreground")}>{item.label}</dt>
                <dd className="mt-1 font-heading text-2xl font-bold tabular-nums text-foreground md:text-3xl">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <HubSectionNav sections={sections} />

      <div className={SECTION_SHELL_INNER}>
        <section
          id="work-spotlight"
          className="scroll-mt-36 py-12 md:py-16"
          aria-labelledby="work-spotlight-heading"
        >
          <h2 id="work-spotlight-heading" className="sr-only">
            Spotlight productions
          </h2>
          <p className={cn(T.eyebrow, "mb-6")}>Spotlight</p>
          <WorkSpotlight projects={featured} />
        </section>

        {bnsLed.length > 0 && BNS_LED_ORG ? (
          <PartnershipCorridor
            id="work-bns-led"
            org={BNS_LED_ORG}
            projects={bnsLed}
            mode="bns-led"
            missionLine="Youth trackers, social series, and county documentaries we originate — feeding Connect and Mashinani with verified field evidence."
          />
        ) : null}

        {corridors.map((corridor) => (
          <PartnershipCorridor
            key={corridor.org.slug}
            id={`work-partner-${corridor.org.slug}`}
            org={corridor.org}
            projects={corridor.projects}
            mode={corridor.dominantMode}
            missionLine={`Shared work with ${corridor.org.name} — each dossier links to sources, outputs, and documented outcomes.`}
          />
        ))}

        <section
          id="work-programmes"
          className="scroll-mt-36 border-t border-border/30 pb-16 md:pb-20"
          aria-labelledby="work-programmes-heading"
        >
          <div className="py-10 md:py-12">
            <EditorialSectionHeader
              eyebrow="Mission lanes"
              title="How productions map to programmes"
              description="Every commission or co-production reinforces at least one BNS programme — national tracking, county depth, journalist training, or studio revenue that funds civic literacy."
            />
          </div>
          {programmeLanes.map((lane) => {
            const programme = PROGRAMMES.find((p) => p.slug === lane.programmeSlug);
            if (!programme) return null;
            return (
              <ProgrammeWorkLane
                key={lane.programmeSlug}
                id={`work-programme-${lane.programmeSlug}`}
                programmeName={programme.name}
                programmeHref={programmeHref(lane.programmeSlug)}
                programmeLine={PROGRAMME_CARD_BLURBS[lane.programmeSlug]}
                projects={lane.projects}
              />
            );
          })}
        </section>
      </div>
    </div>
  );
}
