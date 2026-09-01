"use client";

import { PillButtonGroup } from "@/components/ui/editorial";
import { cn } from "@/utils";

type LandingSeeMoreProps = {
  href: string;
  label?: string;
  className?: string;
  external?: boolean;
};

/**
 * Canonical landing section CTA — editorial pill + arrow companion.
 */
export function LandingSeeMore({
  href,
  label = "See more",
  className,
  external = false,
}: LandingSeeMoreProps) {
  return (
    <PillButtonGroup
      href={href}
      label={label}
      external={external}
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
