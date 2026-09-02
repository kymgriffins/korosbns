"use client";

import { EditorialSectionHeader } from "@/components/ui/editorial";
import { ProgrammeScorecard } from "@/components/programmes/programme-scorecard";
import { ProgrammeWorkLane } from "@/components/work-hub/partnership-corridor";
import {
  PROGRAMME_CARD_BLURBS,
  PROGRAMMES,
  PROGRAMMES_LANDING,
  programmeHref,
} from "@/content";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { GsapReveal, GsapStaggerReveal } from "@/motion/gsap";
import { SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { cn } from "@/utils";

export function ProgrammesImpactHub() {
  const stats = studiosEvidenceData.getMissionStats();
  const programmeLanes = studiosEvidenceData.getProgrammeLanes();

  return (
    <>
      <section
        id="programmes"
        className={cn(SECTION_SHELL_PADDING, "bg-background")}
        aria-labelledby="programmes-ecosystem-heading"
      >
        <div className={SECTION_SHELL_INNER}>
          <GsapReveal className="mb-8 md:mb-10">
            <EditorialSectionHeader
              eyebrow="Programme ecosystem"
              title="Four lanes. One civic mission."
              description={PROGRAMMES_LANDING.subhead}
            />
          </GsapReveal>

          <dl className="mb-10 grid grid-cols-2 gap-4 border-y border-border/40 py-6 md:grid-cols-4">
            {[
              { label: "Programmes", value: PROGRAMMES.length },
              { label: "Field productions", value: stats.productionCount },
              { label: "Active partners", value: stats.partnerCount },
              { label: "BNS-led initiatives", value: stats.bnsLedCount },
            ].map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </dt>
                <dd className="mt-1 font-heading text-2xl font-bold tabular-nums text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <GsapStaggerReveal className="grid gap-5 md:grid-cols-2 lg:gap-6">
            {PROGRAMMES.map((programme, index) => (
              <div key={programme.slug} data-gsap-item>
                <ProgrammeScorecard programme={programme} priority={index < 2} />
              </div>
            ))}
          </GsapStaggerReveal>
        </div>
      </section>

      <section
        id="field-work"
        className={cn(SECTION_SHELL_PADDING, "border-t border-border/30 bg-muted/15")}
        aria-labelledby="field-work-heading"
      >
        <div className={SECTION_SHELL_INNER}>
          <GsapReveal className="mb-8">
            <EditorialSectionHeader
              eyebrow="Work in the field"
              title="Solo work and partnerships in practice"
              description="Programmes are not slide decks — they show up as productions BNS leads alone, co-builds with partners, or delivers on commission. Each dossier documents sources and outcomes."
            />
          </GsapReveal>

          {programmeLanes.map((lane) => {
            const programme = PROGRAMMES.find((p) => p.slug === lane.programmeSlug);
            if (!programme) return null;
            return (
              <ProgrammeWorkLane
                key={lane.programmeSlug}
                id={`field-${lane.programmeSlug}`}
                programmeName={programme.name}
                programmeHref={programmeHref(lane.programmeSlug)}
                programmeLine={PROGRAMME_CARD_BLURBS[lane.programmeSlug]}
                projects={lane.projects}
              />
            );
          })}
        </div>
      </section>
    </>
  );
}
