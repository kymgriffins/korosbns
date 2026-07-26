import React from "react";
import { cn } from "@/utils/helpers";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";

export const SECTION_SHELL_INNER = "mx-auto w-full max-w-[1400px] px-6 md:px-16";

/** Canonical landing vertical rhythm — same padding on every marketing fold */
export const SECTION_SHELL_PADDING = "py-16 md:py-24";

type SectionShellProps = React.ComponentProps<"section"> & {
  /** @deprecated Prefer default — landing uses one rhythm */
  spacing?: "default" | "loose";
  innerClassName?: string;
};

export type { SectionShellProps };

export function SectionShell({
  children,
  className,
  innerClassName,
  spacing: _spacing = "default",
  ...props
}: SectionShellProps) {
  void _spacing;

  return (
    <section className={cn(SECTION_SHELL_PADDING, className)} {...props}>
      <div className={cn(SECTION_SHELL_INNER, innerClassName)}>{children}</div>
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col items-start justify-between gap-4 md:mb-10 md:flex-row md:items-end",
        className
      )}
    >
      <div className="max-w-2xl">
        <span className={T.eyebrow}>
          {eyebrow}
        </span>
        <h2 className={T.sectionTitle}>{title}</h2>
      </div>
      {description ? (
        <p className={T.lead}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
