"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { cn } from "@/utils/helpers";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  SECTION_SHELL_INNER,
  SectionShell,
  type SectionShellProps,
} from "@/layouts/section-shell";

/** Canonical landing section surface — reference: landing-youtube */
export const LANDING_SECTION_SURFACE = "border-y border-border/40 bg-background";

export const LANDING_SECTION_VIEWPORT = {
  once: true,
  margin: "-80px",
} as const;

type LandingSectionProps = SectionShellProps & {
  animateOnMount?: boolean;
};

/** SectionShell + staggerContainer motion wrapper (YouTube reference pattern). */
export function LandingSection({
  children,
  className,
  spacing = "default",
  animateOnMount = false,
  ...props
}: LandingSectionProps) {
  return (
    <SectionShell
      className={cn(LANDING_SECTION_SURFACE, className)}
      spacing={spacing}
      {...props}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={animateOnMount ? "visible" : undefined}
        whileInView={animateOnMount ? undefined : "visible"}
        viewport={animateOnMount ? undefined : LANDING_SECTION_VIEWPORT}
      >
        {children}
      </motion.div>
    </SectionShell>
  );
}

type LandingContentProps = HTMLMotionProps<"div">;

/** fadeInUp content block inside a landing section. */
export function LandingContent({ className, children, ...props }: LandingContentProps) {
  return (
    <motion.div variants={fadeInUp} className={className} {...props}>
      {children}
    </motion.div>
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

export function LandingSectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "start",
  titleAs = "h2",
  mutedEyebrow = false,
}: SectionHeaderProps) {
  const TitleTag = titleAs;
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-6 md:mb-16",
        isCentered
          ? "items-center text-center"
          : "items-start justify-between md:flex-row md:items-end",
        className,
      )}
    >
      <div className={cn("max-w-2xl", isCentered && "mx-auto")}>
        {eyebrow ? (
          <span
            className={cn(
              mutedEyebrow ? T.eyebrowMuted : T.eyebrow,
              isCentered && "text-center",
            )}
          >
            {eyebrow}
          </span>
        ) : null}
        <TitleTag className={T.sectionTitle}>{title}</TitleTag>
        {description && isCentered ? (
          <p className={cn(T.lead, "mx-auto mt-4 max-w-2xl")}>{description}</p>
        ) : null}
      </div>
      {description && !isCentered ? <p className={T.lead}>{description}</p> : null}
    </div>
  );
}

/** Centered eyebrow-only label (e.g. partners sponsor row). */
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
