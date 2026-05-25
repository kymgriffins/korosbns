import React from "react";
import { cn } from "@/utils/helpers";

export const SECTION_SHELL_INNER = "max-w-[1400px] mx-auto px-6 md:px-16";

type SectionShellProps = React.ComponentProps<"section"> & {
  spacing?: "default" | "loose";
  innerClassName?: string;
};

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
        <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
        <h2 className="gusto-heading">{title}</h2>
      </div>
      {description ? (
        <p className="max-w-sm text-sm leading-relaxed text-foreground/60">
          {description}
        </p>
      ) : null}
    </div>
  );
}
