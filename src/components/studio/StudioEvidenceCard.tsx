"use client";

import Image from "next/image";
import { Building2, ChevronRight, Sparkles, TrendingUp } from "lucide-react";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { cn } from "@/utils";

type Props = {
  project: StudioProjectEvidence;
  onOpen: (project: StudioProjectEvidence) => void;
};

export function StudioEvidenceCard({ project, onOpen }: Props) {
  return (
    <article
      onClick={() => onOpen(project)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(project);
        }
      }}
      role="button"
      tabIndex={0}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
        <Image
          src={project.media.posterUrl}
          alt={project.title}
          fill
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-105",
            project.media.posterPosition || "object-center",
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            <Sparkles className="size-3 text-primary" />
            {project.contentType}
          </span>
          <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-md">
            {project.year}
          </span>
        </div>
        <div className="absolute inset-x-3.5 bottom-3">
          <p className="line-clamp-1 text-xs font-semibold text-white/95">
            {project.organization.name}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
            <Building2 className="size-3" />
            <span>{project.organization.sector}</span>
          </div>
          <h3 className="text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
            {project.title}
          </h3>
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {project.briefChallenge}
          </p>
        </div>

        {project.impactEvidence.primaryMetric && (
          <div className="mt-4 rounded-2xl border border-primary/25 bg-primary/10 p-3">
            <div className="flex items-start gap-2">
              <TrendingUp className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Documented outcome
                </p>
                <p className="text-xs font-bold leading-tight text-foreground">
                  {project.impactEvidence.primaryMetric}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-xs font-semibold text-primary">
          <span>View case study</span>
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </article>
  );
}
