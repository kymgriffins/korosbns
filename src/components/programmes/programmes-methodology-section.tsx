"use client";

import {
  CheckCircle,
  FileText,
  Landmark,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";
import { LandingSection } from "@/layouts/landing-section";
import { EditorialPill } from "@/components/ui/editorial";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Landmark,
  Search,
  FileText,
  Users,
  CheckCircle,
};

export type MethodologyStep = {
  step: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  highlight: string;
};

export type MethodologyContent = {
  eyebrow?: string;
  headline?: string;
  lede?: string;
  steps?: MethodologyStep[];
};

export function ProgrammesMethodologySection({
  asSubSection = false,
  content,
}: {
  asSubSection?: boolean;
  content?: MethodologyContent | null;
}) {
  const steps = content?.steps ?? [];
  if (steps.length === 0) return null;

  const body = (
    <>
      <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <EditorialPill variant="default">
            {content?.eyebrow ?? "Methodology & Standards"}
          </EditorialPill>
          <h2 id="methodology-heading" className={T.sectionTitle}>
            {content?.headline ?? "How we verify before we publish"}
          </h2>
        </div>
        {content?.lede ? (
          <p className={cn(T.lead, "max-w-md md:text-right")}>{content.lede}</p>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? Landmark;
          return (
            <article
              key={item.step}
              className="flex flex-col border border-border/60 bg-background p-5"
            >
              <div className="flex items-center justify-end border-b border-border/40 pb-3">
                <Icon className="size-4 text-muted-foreground" aria-hidden />
              </div>
              <h3 className="mt-4 font-heading text-base font-bold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {item.subtitle}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/75">
                {item.description}
              </p>
              <p className="mt-4 border-t border-border/40 pt-3 text-xs text-muted-foreground">
                {item.highlight}
              </p>
            </article>
          );
        })}
      </div>
    </>
  );

  if (asSubSection) {
    return (
      <div className="mt-16 border-t border-border/50 pt-14" aria-labelledby="methodology-heading">
        {body}
      </div>
    );
  }

  return (
    <LandingSection
      id="methodology"
      aria-labelledby="methodology-heading"
      className="border-t border-border/50"
    >
      {body}
    </LandingSection>
  );
}
