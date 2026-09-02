import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  PROGRAMME_CARD_BLURBS,
  programmeHref,
  type ProgrammeBlock,
} from "@/content";
import { cn } from "@/utils";

type ProgrammeScorecardProps = {
  programme: ProgrammeBlock;
  className?: string;
  priority?: boolean;
  compact?: boolean;
};

/**
 * Programme scorecard — surfaces key programme intel, not blog-style image overlays.
 */
export function ProgrammeScorecard({
  programme,
  className,
  priority = false,
  compact = false,
}: ProgrammeScorecardProps) {
  const href = programmeHref(programme.slug);
  const scorecardLine = PROGRAMME_CARD_BLURBS[programme.slug];

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-border/40 bg-card",
        "transition-colors hover:border-primary/40 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-muted",
          compact ? "aspect-[16/9]" : "aspect-[16/10] sm:aspect-[2/1]",
        )}
      >
        <Image
          src={programme.visual.hero}
          alt={programme.visual.heroAlt}
          fill
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes={compact ? "320px" : "(max-width: 768px) 100vw, 50vw"}
        />
      </div>

      <div className={cn("flex flex-1 flex-col", compact ? "gap-2 p-4" : "gap-3 p-5 md:p-6")}>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {programme.name}
        </p>
        <p
          className={cn(
            "font-heading font-bold leading-snug text-foreground",
            compact ? "text-sm" : "text-base md:text-lg",
          )}
        >
          {scorecardLine}
        </p>
        {programme.highlight && !compact ? (
          <p className="border-l-2 border-primary/30 pl-3 text-sm leading-relaxed text-muted-foreground">
            {programme.highlight}
          </p>
        ) : null}
        <span
          className={cn(
            "mt-auto inline-flex items-center gap-1 text-xs font-semibold text-foreground",
            compact ? "pt-1" : "pt-2",
          )}
        >
          View programme
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
