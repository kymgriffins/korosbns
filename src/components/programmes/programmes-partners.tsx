import Link from "next/link";
import { BNS_PARTNERS_NAMED } from "@/content";
import { SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { cn } from "@/utils";

export function ProgrammesPartners({ className }: { className?: string }) {
  const active = BNS_PARTNERS_NAMED.filter((p) => p.is_active);

  if (active.length === 0) return null;

  return (
    <section
      className={cn(SECTION_SHELL_PADDING, "border-t border-border/30 bg-background", className)}
      aria-labelledby="programmes-partners-heading"
    >
      <div className={SECTION_SHELL_INNER}>
        <h2
          id="programmes-partners-heading"
          className="mb-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          BNS Partners
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {active.map((partner) => (
            <li key={partner.id}>
              <Link
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-border/40 bg-muted/20 px-4 py-3 text-sm transition-colors hover:border-primary/30 hover:bg-muted/40"
              >
                <span className="font-semibold text-foreground">{partner.name}</span>
                {partner.role ? (
                  <span className="mt-1 block text-xs text-muted-foreground">{partner.role}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
