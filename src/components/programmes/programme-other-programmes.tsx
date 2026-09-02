import Link from "next/link";
import { PROGRAMMES, programmeHref, type ProgrammeSlug } from "@/content";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

type Props = {
  currentSlug: ProgrammeSlug;
  className?: string;
};

/** Minimal cross-links — secondary to the active programme page. */
export function ProgrammeOtherProgrammes({ currentSlug, className }: Props) {
  const others = PROGRAMMES.filter((p) => p.slug !== currentSlug);

  if (others.length === 0) return null;

  return (
    <section
      className={cn("border-t border-border/30 py-8 md:py-10", className)}
      aria-labelledby="other-programmes-heading"
    >
      <div className={SECTION_SHELL_INNER}>
        <h2
          id="other-programmes-heading"
          className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Other programmes
        </h2>
        <nav aria-label="Other programmes">
          <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            {others.map((programme) => (
              <li key={programme.slug}>
                <Link
                  href={programmeHref(programme.slug)}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {programme.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
