"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Building2, CheckCircle2, TrendingUp } from "lucide-react";
import { EditorialCtaBand, EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { LandingSection } from "@/layouts/landing-section";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  studiosEvidenceData,
  type StudioProjectEvidence,
} from "@/data/studios-evidence";
import { HERO_SECTION_PADDING, SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { cn } from "@/utils";

type Props = {
  project: StudioProjectEvidence;
};

export function StudioProjectDetail({ project }: Props) {
  const related = studiosEvidenceData.getRelatedProjects(project.id, 3);

  return (
    <div className="w-full scroll-smooth bg-background">
      <section
        className={cn(
          HERO_SECTION_PADDING,
          "border-b border-border/30 bg-background",
        )}
      >
        <div className={cn(SECTION_SHELL_INNER, "grid gap-8 lg:grid-cols-12 lg:gap-12")}>
          <div className="space-y-5 lg:col-span-7">
            <Link
              href="/bns-studio#projects"
              className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden />
              All projects
            </Link>
            <EditorialPill className="mb-0">{project.contentType}</EditorialPill>
            <h1 className={cn(T.heroTitle, "text-balance text-foreground")}>
              {project.title}
            </h1>
            {project.subtitle ? (
              <p className="text-base text-muted-foreground">{project.subtitle}</p>
            ) : null}
          </div>

          <aside className="rounded-3xl border border-border/40 bg-muted/25 p-5 lg:col-span-5 lg:self-end">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Building2 className="size-3.5 text-primary" />
              {project.organization.name}
            </div>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Sector</dt>
                <dd className="font-semibold text-foreground">
                  {project.organization.sector}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Year</dt>
                <dd className="font-semibold text-foreground">{project.year}</dd>
              </div>
            </dl>
            <div className="mt-5">
              <PillButtonGroup href="/bns-studio#booking" label="Commission BNS Studios" />
            </div>
          </aside>
        </div>
      </section>

      <div className={cn(SECTION_SHELL_INNER, "py-8 md:py-10")}>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border/30">
          <Image
            src={project.media.posterUrl}
            alt={project.title}
            fill
            priority
            className={cn("object-cover", project.media.posterPosition || "object-center")}
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      </div>

      <section className={cn(SECTION_SHELL_PADDING, "border-t border-border/30")}>
        <div className={cn(SECTION_SHELL_INNER, "grid gap-10 lg:grid-cols-12 lg:gap-16")}>
          <div className="space-y-8 lg:col-span-7">
            {project.impactEvidence.primaryMetric ? (
              <div className="rounded-3xl border border-primary/25 bg-primary/10 p-5">
                <div className="flex items-start gap-3">
                  <TrendingUp className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                      Documented outcome
                    </p>
                    <p className="text-base font-bold text-foreground">
                      {project.impactEvidence.primaryMetric}
                      {project.impactEvidence.secondaryMetric
                        ? ` · ${project.impactEvidence.secondaryMetric}`
                        : null}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {project.impactEvidence.context}
                    </p>
                    {project.impactEvidence.verificationOutcome ? (
                      <p className="text-xs text-foreground/80">
                        <span className="font-semibold">Verification: </span>
                        {project.impactEvidence.verificationOutcome}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/40 bg-muted/20 p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-foreground">
                  The brief
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.briefChallenge}
                </p>
              </div>
              <div className="rounded-2xl border border-border/40 bg-muted/20 p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-foreground">
                  What we produced
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.whatWeProduced}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Project narrative
              </p>
              <p className="text-base leading-relaxed text-foreground/85 md:text-lg">
                {project.description}
              </p>
            </div>

            {project.outputs.length > 0 ? (
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Delivered outputs
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {project.outputs.map((output) => (
                    <li
                      key={output}
                      className="flex items-start gap-2 text-sm text-foreground/85"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                      {output}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-3xl border border-border/40 bg-muted/20 p-5 text-sm">
              <p className="mb-2 font-semibold text-foreground">Partner</p>
              <p className="font-medium text-primary">{project.organization.name}</p>
              <p className="mt-2 text-muted-foreground">
                {project.organization.description}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {project.organization.location}
              </p>
            </div>
            {project.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/60 bg-background px-3 py-1 text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
          </aside>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-border/30 py-8 md:py-10">
          <div className={SECTION_SHELL_INNER}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Related projects
            </p>
            <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {related.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/bns-studio/${item.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

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
  );
}
