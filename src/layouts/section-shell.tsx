import React from "react";
import { cn } from "@/utils/helpers";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";

export const SECTION_SHELL_INNER = "max-w-[1400px] mx-auto px-6 md:px-16";

type SectionShellProps = React.ComponentProps<"section"> & {
  spacing?: "default" | "loose";
  innerClassName?: string;
};

export type { SectionShellProps };

export function SectionShell({
  children,
  className,
  innerClassName,
  spacing = "default",
  ...props
}: SectionShellProps) {
  const py = spacing === "loose" ? "py-20 md:py-36" : "py-20 md:py-32";

  return (
    <section className={cn(py, className)} {...props}>
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
        "mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end",
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
