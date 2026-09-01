import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/utils";

type PillButtonGroupProps = {
  href: string;
  label: string;
  className?: string;
  external?: boolean;
};

/**
 * Marwa-style CTA: pill label button + circular arrow companion.
 */
export function PillButtonGroup({
  href,
  label,
  className,
  external = false,
}: PillButtonGroupProps) {
  const linkProps = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <Link
        href={href}
        {...linkProps}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background",
          "transition-colors hover:bg-foreground/90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        )}
      >
        {label}
      </Link>
      <Link
        href={href}
        {...linkProps}
        aria-label={label}
        className={cn(
          "inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background",
          "transition-colors hover:bg-foreground/90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        )}
      >
        <ArrowUpRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
