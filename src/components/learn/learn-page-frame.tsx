"use client";

import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { GsapReveal } from "@/motion/gsap";
import { cn } from "@/utils";

type LearnPageFrameProps = {
  children: React.ReactNode;
  className?: string;
};

/** Width comes from LearnAppShell — this wrapper only groups content. */
export function LearnPageFrame({ children, className }: LearnPageFrameProps) {
  return <div className={cn("w-full", className)}>{children}</div>;
}

type LearnPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function LearnPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: LearnPageHeaderProps) {
  return (
    <GsapReveal className={cn("space-y-5", className)}>
      {eyebrow ? <span className={T.eyebrow}>{eyebrow}</span> : null}
      <div className="space-y-4">
        <h1 className={cn(T.heroTitle, "max-w-3xl text-balance")}>{title}</h1>
        {description ? (
          <p className={cn(T.lead, "max-w-2xl text-foreground/75")}>{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </GsapReveal>
  );
}

type LearnSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
};

export function LearnSection({
  title,
  description,
  children,
  className,
  action,
}: LearnSectionProps) {
  return (
    <section
      className={cn("border-t border-border/40 py-16 md:py-24", className)}
      aria-label={title}
    >
      <GsapReveal className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl space-y-3">
          <h2 className={T.sectionTitle}>{title}</h2>
          {description ? (
            <p className={cn(T.lead, "text-foreground/75")}>{description}</p>
          ) : null}
        </div>
        {action}
      </GsapReveal>
      {children}
    </section>
  );
}
