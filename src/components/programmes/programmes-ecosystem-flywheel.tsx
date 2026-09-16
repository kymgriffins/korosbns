"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Newspaper,
  Video,
  type LucideIcon,
} from "lucide-react";
import { LandingSection } from "@/layouts/landing-section";
import { EditorialPill } from "@/components/ui/editorial";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  Building2,
  Newspaper,
  Video,
};

export type FlywheelNode = {
  step: string;
  name: string;
  eyebrow: string;
  icon: string;
  href: string;
  role: string;
  description: string;
  feedsTo: string;
};

export type FlywheelContent = {
  eyebrow?: string;
  headline?: string;
  lede?: string;
  nodes?: FlywheelNode[];
};

export function ProgrammesEcosystemFlywheel({
  content,
}: {
  content?: FlywheelContent | null;
}) {
  const nodes = content?.nodes ?? [];
  if (nodes.length === 0) return null;

  return (
    <LandingSection
      id="ecosystem-flywheel"
      aria-labelledby="flywheel-heading"
      className="border-t border-border/50 bg-muted/20"
    >
      <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <EditorialPill variant="default">
            {content?.eyebrow ?? "The Closed-Loop Ecosystem"}
          </EditorialPill>
          <h2 id="flywheel-heading" className={T.sectionTitle}>
            {content?.headline ?? "How the programmes connect"}
          </h2>
        </div>
        <p className={cn(T.lead, "max-w-md md:text-right")}>
          {content?.lede ??
            "One continuous accountability engine: national data informs local scrutiny, newsrooms broadcast the findings, and Studios craft keeps the civic story visible."}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {nodes.map((node, index) => {
          const Icon = ICON_MAP[node.icon] ?? BarChart3;
          const isLast = index === nodes.length - 1;

          return (
            <div
              key={node.step}
              className="relative flex flex-col justify-between border border-border/60 bg-background p-6 transition-all hover:border-primary/50"
            >
              <div>
                <div className="flex items-center justify-end border-b border-border/40 pb-4">
                  <Icon className="size-5 text-primary" aria-hidden />
                </div>
                <p className={cn(T.eyebrow, "mt-4 text-muted-foreground")}>
                  {node.eyebrow}
                </p>
                <h3 className="mt-1 font-heading text-lg font-bold text-foreground">
                  {node.name}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  {node.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                  {node.description}
                </p>
              </div>
              <div className="mt-6 space-y-3 border-t border-border/40 pt-4">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {node.feedsTo}
                </p>
                <Link
                  href={node.href}
                  className="inline-flex items-center text-sm font-semibold text-foreground transition-colors hover:text-primary"
                >
                  Open dossier
                  <ArrowRight className="ml-1 size-4" aria-hidden />
                </Link>
              </div>
              {!isLast ? (
                <span
                  className="pointer-events-none absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-primary lg:block"
                  aria-hidden
                >
                  →
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </LandingSection>
  );
}
