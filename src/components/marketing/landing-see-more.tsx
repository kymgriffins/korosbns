"use client";

import { PillButtonGroup } from "@/components/ui/editorial";
import { cn } from "@/utils";

type LandingSeeMoreProps = {
  href: string;
  label?: string;
  className?: string;
  external?: boolean;
  "aria-label"?: string;
};

/**
 * Canonical landing section CTA - editorial pill + arrow companion.
 */
export function LandingSeeMore({
  href,
  label = "See more",
  className,
  external = false,
  "aria-label": ariaLabel,
}: LandingSeeMoreProps) {
  return (
    <PillButtonGroup
      href={href}
      label={label}
      external={external}
      aria-label={ariaLabel}
      className={className}
    />
  );
}

/** Consistent footer slot under landing section bodies */
export function LandingSectionCta({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-10 flex flex-wrap items-center gap-3 md:mt-12", className)}>
      {children}
    </div>
  );
}
