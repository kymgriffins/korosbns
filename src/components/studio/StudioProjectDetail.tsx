"use client";

import Link from "next/link";
import { ArrowLeft, Building2, CheckCircle2, TrendingUp } from "lucide-react";
import { EditorialCtaBand } from "@/components/ui/editorial";
import { StudioFormatStage } from "@/components/studio/theatre/studio-format-stage";
import { StudioTheatreRail } from "@/components/studio/theatre/studio-theatre-rail";
import { LandingSection } from "@/layouts/landing-section";
import {
  studiosEvidenceData,
  type StudioProjectEvidence,
} from "@/data/studios-evidence";
import { getFormatTheme } from "@/lib/studio-format-themes";
import { cn } from "@/utils";

type Props = {
  project: StudioProjectEvidence;
};

export function StudioProjectDetail({ project }: Props) {
  const related = studiosEvidenceData.getRelatedProjects(project.id, 6);
  const theme = getFormatTheme(project.contentType);
  const sameFormat = studiosEvidenceData
    .getProjectsByContentType(project.contentType)
    .filter((p) => p.id !== project.id);

  return (
    <div className="studio-theatre w-full scroll-smooth">
      <header className="border-b border-[var(--studio-theatre-border)] px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-5xl items-start justify-between gap-4">
          <div className="space-y-3">
            <Link
              href="/bns-studio#theatre"
              className={cn(
                "inline-flex w-fit items-center gap-1.5 text-sm text-[var(--studio-theatre-muted)]",
                "transition-colors hover:text-[var(--studio-theatre-fg)]",
              )}
            >
              <ArrowLeft className="size-4" aria-hidden />
              BNS Studios
            </Link>
            <div className={theme.accentClass}>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--studio-format-accent)]">
                {project.contentType}
              </span>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-[var(--studio-theatre-fg)] md:text-4xl">
                {project.title}
              </h1>
              {project.subtitle ? (
                <p className="mt-1 text-sm text-[var(--studio-theatre-muted)] md:text-base">
                  {project.subtitle}
                </p>
              ) : null}
            </div>
          </div>
          <aside className="hidden shrink-0 rounded-2xl border border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-surface)] p-4 text-sm sm:block">
            <div className="mb-2 flex items-center gap-2 text-xs text-[var(--studio-theatre-muted)]">
              <Building2 className="size-3.5 text-[var(--studio-format-accent)]" />
              {project.organization.name}
            </div>
            <p className="text-xs text-[var(--studio-theatre-muted)]">{project.year}</p>
          </aside>
        </div>
      </header>

      <StudioFormatStage project={project} />

      <section className="px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-8 lg:col-span-7">
            {project.impactEvidence.primaryMetric ? (
              <div className="rounded-2xl border border-[var(--studio-format-accent)]/30 bg-[var(--studio-theatre-surface)] p-5">
                <div className="flex items-start gap-3">
                  <TrendingUp className="mt-0.5 size-5 shrink-0 text-[var(--studio-format-accent)]" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--studio-format-accent)]">
                      Documented outcome
                    </p>
                    <p className="text-base font-bold text-[var(--studio-theatre-fg)]">
                      {project.impactEvidence.primaryMetric}
                      {project.impactEvidence.secondaryMetric
                        ? ` · ${project.impactEvidence.secondaryMetric}`
                        : null}
                    </p>
                    <p className="text-sm text-[var(--studio-theatre-muted)]">
                      {project.impactEvidence.context}
                    </p>
                    {project.impactEvidence.verificationOutcome ? (
                      <p className="text-xs text-[var(--studio-theatre-fg)]/80">
                        <span className="font-semibold">Verification: </span>
                        {project.impactEvidence.verificationOutcome}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-surface)] p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--studio-theatre-fg)]">
                  The brief
                </p>
                <p className="text-sm leading-relaxed text-[var(--studio-theatre-muted)]">
                  {project.briefChallenge}
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-surface)] p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--studio-theatre-fg)]">
                  What we produced
                </p>
                <p className="text-sm leading-relaxed text-[var(--studio-theatre-muted)]">
                  {project.whatWeProduced}
                </p>
              </div>
            </div>

            {theme.experience !== "brief" ? (
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--studio-theatre-muted)]">
                  Project narrative
                </p>
                <p className="text-base leading-relaxed text-[var(--studio-theatre-fg)]/90 md:text-lg">
                  {project.description}
                </p>
              </div>
            ) : null}

            {project.outputs.length > 0 ? (
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--studio-theatre-muted)]">
                  Delivered outputs
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {project.outputs.map((output) => (
                    <li
                      key={output}
                      className="flex items-start gap-2 text-sm text-[var(--studio-theatre-fg)]/90"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[var(--studio-format-accent)]" />
                      {output}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-surface)] p-5 text-sm sm:hidden">
              <p className="mb-2 font-semibold text-[var(--studio-theatre-fg)]">Partner</p>
              <p className="font-medium text-[var(--studio-format-accent)]">
                {project.organization.name}
              </p>
              <p className="mt-2 text-[var(--studio-theatre-muted)]">
                {project.organization.description}
              </p>
            </div>
            <div className="hidden rounded-2xl border border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-surface)] p-5 text-sm sm:block">
              <p className="mb-2 font-semibold text-[var(--studio-theatre-fg)]">Partner</p>
              <p className="font-medium text-[var(--studio-format-accent)]">
                {project.organization.name}
              </p>
              <p className="mt-2 text-[var(--studio-theatre-muted)]">
                {project.organization.description}
              </p>
              <p className="mt-2 text-xs text-[var(--studio-theatre-muted)]">
                {project.organization.location}
              </p>
            </div>
            {project.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--studio-theatre-border)] bg-[var(--studio-theatre-elevated)] px-3 py-1 text-xs text-[var(--studio-theatre-muted)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {sameFormat.length > 0 ? (
        <StudioTheatreRail
          id="related-format"
          title={`More ${project.contentType}`}
          contentType={project.contentType}
          projects={sameFormat}
        />
      ) : related.length > 0 ? (
        <StudioTheatreRail
          id="related-projects"
          title="You may also like"
          projects={related}
        />
      ) : null}

      <div className="bg-background">
        <LandingSection>
          <EditorialCtaBand
            eyebrow="BNS Studios"
            title="Need a similar production for your organisation?"
            description="Commission evidence-based podcasts, explainers, town halls, and campaigns — with proceeds reinvested into Kenya's civic budget literacy mission."
            ctaHref="/bns-studio#booking"
            ctaLabel="Commission BNS Studios"
          />
        </LandingSection>
      </div>
    </div>
  );
}
