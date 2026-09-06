import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/utils";

export type PillButtonVariant =
  | "primary"
  | "outline"
  | "secondary"
  | "invert"
  | "ghost";

export type PillButtonSize = "default" | "sm" | "lg";

export type PillCtaProps = {
  href: string;
  label: React.ReactNode;
  className?: string;
  external?: boolean;
  variant?: PillButtonVariant;
  size?: PillButtonSize;
  icon?: React.ReactNode;
};

export type PillButtonProps = {
  onClick?: () => void;
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  variant?: PillButtonVariant;
  size?: PillButtonSize;
  icon?: React.ReactNode;
  "aria-label"?: string;
};

const VARIANT_CLASSES: Record<PillButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
  outline:
    "border border-border/80 bg-background text-foreground hover:bg-muted hover:border-foreground/25",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  invert:
    "border border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md",
  ghost:
    "text-foreground hover:bg-muted/70 hover:text-foreground",
};

const SIZE_CLASSES: Record<PillButtonSize, string> = {
  sm: "h-9 px-4 text-xs font-semibold gap-1.5",
  default: "h-11 px-6 text-sm font-semibold gap-2",
  lg: "h-13 px-8 text-base font-bold gap-2.5",
};

/**
 * Single pill CTA Link with inline arrow — universal landing design token.
 */
export function PillButtonGroup({
  href,
  label,
  className,
  external = false,
  variant = "primary",
  size = "default",
  icon,
}: PillCtaProps) {
  const linkProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  const renderedIcon =
    icon !== undefined ? (
      icon
    ) : (
      <ArrowUpRight className="size-4 shrink-0" aria-hidden />
    );

  return (
    <Link
      href={href}
      {...linkProps}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all duration-150 outline-none whitespace-nowrap shrink-0",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      <span className="truncate">{label}</span>
      {renderedIcon}
    </Link>
  );
}

/**
 * Interactive pill button for actions/modals/forms with identical tokens.
 */
export function PillButton({
  onClick,
  label,
  children,
  className,
  type = "button",
  disabled = false,
  variant = "primary",
  size = "default",
  icon,
  "aria-label": ariaLabel,
}: PillButtonProps) {
  const content = children ?? label;
  const renderedIcon =
    icon !== undefined ? (
      icon
    ) : (
      <ArrowUpRight className="size-4 shrink-0" aria-hidden />
    );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all duration-150 outline-none cursor-pointer whitespace-nowrap shrink-0 disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        className,
      )}
    >
      <span className="truncate">{content}</span>
      {renderedIcon}
    </button>
  );
}
