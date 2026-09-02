import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/utils";

type PillCtaProps = {
  href: string;
  label: string;
  className?: string;
  external?: boolean;
};

/**
 * Single pill CTA with inline arrow — one tap target, not two buttons.
 */
export function PillButtonGroup({
  href,
  label,
  className,
  external = false,
}: PillCtaProps) {
  const linkProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={href}
      {...linkProps}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground",
        "transition-colors hover:bg-primary/90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
    >
      {label}
      <ArrowUpRight className="size-4 shrink-0" aria-hidden />
    </Link>
  );
}
