import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  PROGRAMMES,
  PROGRAMME_CARD_BLURBS,
  programmeHref,
  type ProgrammeSlug,
} from "@/content";
import { SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { cn } from "@/utils";

type Props = {
  currentSlug: ProgrammeSlug;
  className?: string;
};

/** Keep-reading cards — secondary to the active programme page. */
export function ProgrammeOtherProgrammes({ currentSlug, className }: Props) {
  const others = PROGRAMMES.filter((p) => p.slug !== currentSlug);

  if (others.length === 0) return null;

  return (
    <section
      className={cn("border-t border-border/30", SECTION_SHELL_PADDING, className)}
      aria-labelledby="other-programmes-heading"
    >
      <div className={SECTION_SHELL_INNER}>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          Keep reading
        </p>
        <h2
          id="other-programmes-heading"
          className="mt-2 text-2xl font-extrabold tracking-tight text-foreground md:text-3xl"
        >
          Other programmes
        </h2>
        <nav aria-label="Other programmes">
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((programme) => (
              <li key={programme.slug}>
                <Link
                  href={programmeHref(programme.slug)}
                  className="group block h-full rounded-2xl border border-border/40 bg-card p-5 transition-colors hover:border-primary/50"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {programme.eyebrow}
                  </p>
                  <p className="mt-1 text-base font-bold text-foreground">
                    {programme.name}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {PROGRAMME_CARD_BLURBS[programme.slug]}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline">
                    Explore
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
