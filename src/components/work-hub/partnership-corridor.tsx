import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type {
  StudioDeliveryMode,
  StudioPartnerOrg,
  StudioProjectEvidence,
} from "@/data/studios-evidence";
import { WorkProjectCard } from "@/components/work-hub/work-project-card";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

const MODE_COPY: Record<
  StudioDeliveryMode,
  { eyebrow: string; verb: string }
> = {
  "bns-led": {
    eyebrow: "BNS-led",
    verb: "We lead",
  },
  "co-produced": {
    eyebrow: "Co-produced",
    verb: "We build with",
  },
  commissioned: {
    eyebrow: "Commissioned",
    verb: "We deliver for",
  },
};

type PartnershipCorridorProps = {
  id: string;
  org: StudioPartnerOrg;
  projects: StudioProjectEvidence[];
  mode: StudioDeliveryMode;
  missionLine?: string;
};

export function PartnershipCorridor({
  id,
  org,
  projects,
  mode,
  missionLine,
}: PartnershipCorridorProps) {
  const copy = MODE_COPY[mode];

  return (
    <section
      id={id}
      className="scroll-mt-36 border-t border-border/30 py-12 md:py-16"
      aria-labelledby={`${id}-heading`}
    >
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4 lg:sticky lg:top-36 lg:self-start">
          <p className={T.eyebrow}>{copy.eyebrow}</p>
          <h3
            id={`${id}-heading`}
            className="mt-3 font-heading text-2xl font-bold text-foreground md:text-3xl"
          >
            {copy.verb}{" "}
            <span className="text-primary">{org.name}</span>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {org.description}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{org.sector}</p>
          {missionLine ? (
            <p className="mt-4 border-l-2 border-primary/30 pl-4 text-sm leading-relaxed text-foreground/80">
              {missionLine}
            </p>
          ) : null}
          <p className="mt-4 text-xs font-semibold text-muted-foreground">
            {projects.length} production{projects.length === 1 ? "" : "s"} in this corridor
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide md:gap-5">
            {projects.map((project, index) => (
              <WorkProjectCard
                key={project.id}
                project={project}
                priority={index === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type ProgrammeLaneProps = {
  id: string;
  programmeName: string;
  programmeHref: string;
  programmeLine: string;
  projects: StudioProjectEvidence[];
};

export function ProgrammeWorkLane({
  id,
  programmeName,
  programmeHref,
  programmeLine,
  projects,
}: ProgrammeLaneProps) {
  if (projects.length === 0) return null;

  return (
    <section
      id={id}
      className="scroll-mt-36 border-t border-border/30 py-10 md:py-12"
      aria-labelledby={`${id}-heading`}
    >
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className={T.eyebrow}>Programme lane</p>
          <h3
            id={`${id}-heading`}
            className="mt-2 font-heading text-xl font-bold text-foreground md:text-2xl"
          >
            {programmeName}
          </h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{programmeLine}</p>
        </div>
        <Link
          href={programmeHref}
          className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary"
        >
          Programme page
          <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {projects.map((project) => (
          <WorkProjectCard key={project.id} project={project} variant="compact" />
        ))}
      </div>
    </section>
  );
}
