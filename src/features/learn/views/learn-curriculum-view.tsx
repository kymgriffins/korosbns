"use client";

import { ChevronRight, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StudioPage } from "../components/studio-page";
import { StudioPageHeader } from "../components/studio-page-header";
import type { CivicModule } from "@/types/learn";
import { readProgress } from "@/lib/module-progress";
import { cn } from "@/lib/utils";

export function LearnCurriculumView({
  stages,
  currentStage,
  onSelectStage,
  onRefresh,
}: {
  stages: CivicModule[];
  currentStage: CivicModule | null;
  onSelectStage: (stage: CivicModule) => void;
  onRefresh?: () => void;
}) {
  return (
    <StudioPage width="default">
      <StudioPageHeader
        eyebrow="Curriculum"
        title="Learning path"
        description="Structured modules from budget basics to citizen action. Open any module to start reading."
        illustration={
          <div className="flex size-24 items-center justify-center rounded-2xl border border-border/50 bg-primary/5">
            <Map className="size-10 text-primary/60" />
          </div>
        }
        actions={
          onRefresh ? (
            <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={onRefresh}>
              Refresh modules
            </Button>
          ) : undefined
        }
      />

      <ol className="relative space-y-3 border-l border-border/50 pl-6">
        {stages.map((stage, index) => {
          const p = readProgress(stage.slug, stage.order);
          const total = stage.steps?.length ?? 0;
          const done = total ? Object.values(p.stepsCompleted ?? {}).filter(Boolean).length : 0;
          const pct = total ? Math.round((done / total) * 100) : 0;
          const active = currentStage?.slug === stage.slug;

          return (
            <li key={stage.slug} className="relative">
              <span
                className={cn(
                  "absolute -left-[1.65rem] top-5 size-3 rounded-full border-2 border-background",
                  active ? "bg-primary" : pct === 100 ? "bg-success" : "bg-muted",
                )}
                aria-hidden
              />
              <button
                type="button"
                onClick={() => onSelectStage(stage)}
                className={cn(
                  "group w-full rounded-2xl border border-border/40 bg-card p-5 text-left shadow-sm transition-all hover:border-border hover:shadow-md",
                  active && "border-primary/30 ring-1 ring-primary/20",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Module {index + 1}
                    </p>
                    <p className="mt-1 text-lg font-semibold tracking-tight">{stage.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{stage.description}</p>
                  </div>
                  <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                {total > 0 && (
                  <div className="mt-4 space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{done}/{total} steps</span>
                      <span>{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1" />
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </StudioPage>
  );
}
