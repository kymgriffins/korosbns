"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  Building2,
  CheckCircle2,
  TrendingUp,
  X,
} from "lucide-react";
import type { StudioProjectEvidence } from "@/data/studios-evidence";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { fadeIn, scaleIn } from "@/motion/variants";
import { cn } from "@/utils";

type Props = {
  project: StudioProjectEvidence | null;
  onClose: () => void;
  onOpenProject: (project: StudioProjectEvidence) => void;
  onCommissionClick?: () => void;
};

export function StudioEvidenceModal({
  project,
  onClose,
  onOpenProject,
  onCommissionClick,
}: Props) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-16/9 w-full bg-muted sm:aspect-21/9">
              <Image
                src={project.media.posterUrl}
                alt={project.title}
                fill
                className={cn(
                  "object-cover",
                  project.media.posterPosition || "object-center",
                )}
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-black/40 to-transparent" />
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md transition-colors hover:bg-black/90"
                aria-label="Close case study"
              >
                <X className="size-4" />
              </button>
              <div className="absolute right-6 bottom-4 left-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {project.contentType}
                  </span>
                  <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    {project.organization.sector}
                  </span>
                  <span className="rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
                    {project.year}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  <Building2 className="size-3.5" />
                  <span>{project.organization.name}</span>
                </div>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {project.title}
                </h2>
                {project.subtitle && (
                  <p className="mt-1 text-sm font-medium text-muted-foreground">
                    {project.subtitle}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5">
                <div className="flex items-start gap-3">
                  <TrendingUp className="mt-1 size-5 shrink-0 text-primary" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                      Impact and reach
                    </p>
                    {project.impactEvidence.primaryMetric && (
                      <p className="text-base font-bold text-foreground">
                        {project.impactEvidence.primaryMetric}
                        {project.impactEvidence.secondaryMetric &&
                          ` • ${project.impactEvidence.secondaryMetric}`}
                      </p>
                    )}
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {project.impactEvidence.context}
                    </p>
                    {project.impactEvidence.verificationOutcome && (
                      <p className="pt-1 text-xs font-medium text-foreground/90">
                        <span className="font-bold text-primary">
                          Verification:{" "}
                        </span>
                        {project.impactEvidence.verificationOutcome}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 rounded-2xl border border-border bg-muted/20 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                    The brief
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {project.briefChallenge}
                  </p>
                </div>
                <div className="space-y-2 rounded-2xl border border-border bg-muted/20 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                    What we produced
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {project.whatWeProduced}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Project narrative
                </p>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {project.description}
                </p>
              </div>

              {project.outputs.length > 0 && (
                <div className="space-y-3 border-t border-border pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Delivered outputs
                  </p>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {project.outputs.map((output) => (
                      <li
                        key={output}
                        className="flex items-start gap-2 text-xs text-foreground/85"
                      >
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        <span>{output}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {studiosEvidenceData.getRelatedProjects(project.id, 2).length > 0 && (
                <div className="space-y-3 border-t border-border pt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Related work
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {studiosEvidenceData
                      .getRelatedProjects(project.id, 2)
                      .map((related) => (
                        <button
                          key={related.id}
                          type="button"
                          onClick={() => onOpenProject(related)}
                          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition-all hover:border-primary/50 hover:bg-muted/30"
                        >
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                            <Image
                              src={related.media.posterUrl}
                              alt={related.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="line-clamp-1 text-[10px] font-semibold text-primary">
                              {related.contentType}
                            </span>
                            <p className="line-clamp-1 text-xs font-bold text-foreground">
                              {related.title}
                            </p>
                            <p className="line-clamp-1 text-[11px] text-muted-foreground">
                              {related.organization.name}
                            </p>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                <p className="text-xs text-muted-foreground">
                  Need a similar production for your team?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onCommissionClick?.();
                  }}
                  className={cn(
                    T.btnPrimary,
                    "rounded-full px-6 py-2.5 text-xs font-semibold shadow-sm",
                  )}
                >
                  Commission this format
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
