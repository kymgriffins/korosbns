"use client";

import React from "react";
import { cn } from "@/utils/helpers";
import { EditorialSectionHeader } from "@/components/ui/editorial";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  SECTION_SHELL_INNER,
  SectionShell,
  type SectionShellProps,
} from "@/layouts/section-shell";

/** Canonical landing section surface - breathable, no heavy borders */
export const LANDING_SECTION_SURFACE = "bg-background";

type LandingSectionProps = SectionShellProps & {
  /** @deprecated Motion is opt-in via GSAP primitives - kept for API compat */
  animateOnMount?: boolean;
};

/**
 * Static section shell. No uniform fade/stagger factory.
 * Add GsapReveal / GsapStaggerReveal per fold when motion earns its place.
 */
export function LandingSection({
  children,
  className,
  spacing = "default",
  animateOnMount: _animateOnMount,
  ...props
}: LandingSectionProps) {
  void _animateOnMount;
  return (
    <SectionShell
      className={cn(LANDING_SECTION_SURFACE, className)}
      spacing={spacing}
      {...props}
    >
      {children}
    </SectionShell>
  );
}

type LandingContentProps = React.ComponentProps<"div">;

/** Content block inside a landing section (no forced motion). */
export function LandingContent({ className, children, ...props }: LandingContentProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
  align?: "start" | "center";
  titleAs?: "h1" | "h2";
  mutedEyebrow?: boolean;
};

export function LandingSectionHeader(props: SectionHeaderProps) {
  return (
    <EditorialSectionHeader
      eyebrow={props.eyebrow}
      title={props.title}
      description={props.description}
      className={props.className}
      align={props.align}
      titleAs={props.titleAs}
    />
  );
}

export function LandingSectionEyebrow({
  children,
  className,
  muted = false,
}: {
  children: React.ReactNode;
  className?: string;
  muted?: boolean;
}) {
  return (
    <LandingContent className={cn("mb-8 text-center", className)}>
      <span className={cn(muted ? T.eyebrowMuted : T.eyebrow, "text-center")}>
        {children}
      </span>
    </LandingContent>
  );
}

export { SECTION_SHELL_INNER, SectionShell };
