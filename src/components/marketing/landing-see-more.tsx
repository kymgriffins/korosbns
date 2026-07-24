"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

type LandingSeeMoreProps = {
  href: string;
  label?: string;
  className?: string;
  external?: boolean;
};

/**
 * Canonical landing section CTA — pill Signal Blue + arrow.
 * All section footers should use this (not one-off button variants).
 */
export function LandingSeeMore({
  href,
  label = "See more",
  className,
  external = false,
}: LandingSeeMoreProps) {
  const linkProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Button asChild className={cn(T.btnPrimary, className)}>
      <Link href={href} {...linkProps}>
        {label}
        <ArrowRight className="size-4" aria-hidden />
      </Link>
    </Button>
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
