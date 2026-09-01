"use client";

import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { GsapReveal } from "@/motion/gsap";
import { cn } from "@/utils";

type MarketingPageShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function MarketingPageShell({ children, className }: MarketingPageShellProps) {
  return <div className={cn("w-full bg-background", className)}>{children}</div>;
}

type MarketingPageHeroProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  align?: "start" | "center";
};

export function MarketingPageHero({
  eyebrow,
  title,
  description,
  children,
  className,
  align = "start",
}: MarketingPageHeroProps) {
  const centered = align === "center";

  return (
    <section
      className={cn(
        SECTION_SHELL_PADDING,
        "border-b border-border/40 pt-24 md:pt-28",
        className,
      )}
    >
      <div className={SECTION_SHELL_INNER}>
        <GsapReveal
          className={cn(
            "space-y-5",
            centered && "mx-auto max-w-3xl text-center",
            !centered && "max-w-3xl",
          )}
        >
          {eyebrow ? (
            <span className={cn(T.eyebrow, centered && "block text-center")}>{eyebrow}</span>
          ) : null}
          <h1 className={cn(T.heroTitle, "text-balance")}>{title}</h1>
          {description ? (
            <p className={cn(T.lead, "text-foreground/75", centered && "mx-auto")}>
              {description}
            </p>
          ) : null}
          {children}
        </GsapReveal>
      </div>
    </section>
  );
}

type MarketingPageBodyProps = {
  children: React.ReactNode;
  className?: string;
};

export function MarketingPageBody({ children, className }: MarketingPageBodyProps) {
  return (
    <div className={cn(SECTION_SHELL_PADDING, SECTION_SHELL_INNER, className)}>
      {children}
    </div>
  );
}
