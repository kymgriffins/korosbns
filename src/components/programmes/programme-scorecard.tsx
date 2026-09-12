import Image from "next/image";
import Link from "next/link";
import {
  PROGRAMME_CARD_BLURBS,
  programmeHref,
  type ProgrammeBlock,
} from "@/content";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { cn } from "@/utils";

type ProgrammeScorecardProps = {
  programme: ProgrammeBlock;
  className?: string;
  priority?: boolean;
  compact?: boolean;
};

/**
 * Programme entry - flat still + caption, matching partner landing language.
 * No card chrome (border / radius / shadow / bg-card).
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
        "group flex h-full flex-col gap-3 outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden bg-muted",
          compact ? "aspect-[4/3]" : "aspect-[16/10] sm:aspect-[2/1]",
        )}
      >
        <Image
          src={programme.visual.hero}
          alt={programme.visual.heroAlt}
          fill
          priority={priority}
          className="object-cover object-center"
          sizes={compact ? "320px" : "(max-width: 768px) 100vw, 50vw"}
        />
      </div>

      <div className={cn("flex flex-1 flex-col gap-2", !compact && "gap-3")}>
        <p className={cn(T.eyebrow, "text-muted-foreground")}>{programme.name}</p>
        <p
          className={cn(
            "font-heading font-bold leading-snug text-foreground",
            compact ? "text-sm md:text-base" : "text-base md:text-lg",
          )}
        >
          {scorecardLine}
        </p>
        {programme.highlight && !compact ? (
          <p className={cn(T.caption, "leading-relaxed text-muted-foreground")}>
            {programme.highlight}
          </p>
        ) : null}
        <span
          className={cn(
            "mt-auto inline-flex items-center text-sm font-medium text-foreground transition-colors group-hover:text-primary",
            compact ? "pt-1" : "pt-2",
          )}
        >
          View programme
          <span aria-hidden className="ml-1">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
