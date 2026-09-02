"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Building2 } from "lucide-react";
import {
  STUDIO_CONTENT_TYPES,
  type StudioContentType,
} from "@/constants/bns-studio-content";
import {
  studiosEvidenceData,
  type StudioProjectEvidence,
} from "@/data/studios-evidence";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { GsapReveal } from "@/motion/gsap";
import { SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { cn } from "@/utils";

type FilterState = {
  contentType: StudioContentType | "all";
  organization: string;
};

function ProjectCard({ project }: { project: StudioProjectEvidence }) {
  return (
    <Link
      href={`/bns-studio/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border/40 bg-card transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={project.media.posterUrl}
          alt={project.title}
          fill
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-[1.02]",
            project.media.posterPosition || "object-center",
          )}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
            {project.contentType}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Building2 className="size-3" />
            {project.organization.name}
          </span>
        </div>
        <h3 className="font-heading text-base font-bold leading-snug text-foreground group-hover:text-primary">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {project.briefChallenge}
        </p>
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold text-foreground">
          View project
          <ArrowUpRight className="size-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function StudioProjectsSection() {
  const [filters, setFilters] = useState<FilterState>({
    contentType: "all",
    organization: "all",
  });

  const organizations = studiosEvidenceData.getOrganizationsWithProjects();
  const allProjects = studiosEvidenceData.getAllProjects();

  const filtered = useMemo(() => {
    return allProjects.filter((project) => {
      if (
        filters.contentType !== "all" &&
        project.contentType !== filters.contentType
      ) {
        return false;
      }
      if (
        filters.organization !== "all" &&
        project.organization.slug !== filters.organization
      ) {
        return false;
      }
      return true;
    });
  }, [allProjects, filters]);

  return (
    <section
      id="projects"
      className={cn(SECTION_SHELL_PADDING, "border-t border-border/30 bg-background")}
      aria-labelledby="studio-projects-heading"
    >
      <div className={SECTION_SHELL_INNER}>
        <GsapReveal className="mb-8 md:mb-10">
          <p className={T.eyebrow}>Evidence library</p>
          <h2 id="studio-projects-heading" className={T.sectionTitle}>
            Commissioned work
          </h2>
          <p className={cn(T.lead, "mt-3 max-w-2xl")}>
            Browse BNS Studios projects by content type or partner organisation.
            Each case links to a full project dossier.
          </p>
        </GsapReveal>

        <div className="mb-8 space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Content type
            </p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={filters.contentType === "all"}
                onClick={() =>
                  setFilters((f) => ({ ...f, contentType: "all" }))
                }
                label="All formats"
              />
              {STUDIO_CONTENT_TYPES.map((type) => (
                <FilterChip
                  key={type.id}
                  active={filters.contentType === type.id}
                  onClick={() =>
                    setFilters((f) => ({ ...f, contentType: type.id }))
                  }
                  label={type.label}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Organisation
            </p>
            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={filters.organization === "all"}
                onClick={() =>
                  setFilters((f) => ({ ...f, organization: "all" }))
                }
                label="All partners"
              />
              {organizations.map((org) => (
                <FilterChip
                  key={org.slug}
                  active={filters.organization === org.slug}
                  onClick={() =>
                    setFilters((f) => ({ ...f, organization: org.slug }))
                  }
                  label={org.name}
                />
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-12 text-center text-sm text-muted-foreground">
            No projects match these filters yet. Try another format or organisation.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border/60 bg-background text-muted-foreground hover:border-primary/30 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
