"use client";

import { useMemo, useState } from "react";
import { ExternalLink, MapPin, Search } from "lucide-react";
import { COUNTIES } from "@/constants/counties";
import { Button } from "@/components/ui/button";

const CRA_HOME = "https://www.crakenya.org/";
const TREASURY_BOOKS = "https://www.treasury.go.ke/budget-books";
const COB_HOME = "https://cob.go.ke/";

/**
 * Lightweight county lens — links only to official CRA / Treasury / COB portals.
 * Never displays illustrative or unaudited equitable-share figures.
 */
export function CountyLensPanel({ fiscalYear }: { fiscalYear: string }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return COUNTIES;
    return COUNTIES.filter((c) => c.toLowerCase().includes(needle));
  }, [q]);

  return (
    <section className="rounded-3xl border border-border/50 bg-card/60 p-4 sm:p-5">
      <div className="flex items-start gap-2">
        <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        <div>
          <h3 className="font-heading text-sm font-bold">County lens</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            FY {fiscalYear} — browse Kenya&apos;s 47 counties and open official CRA / Treasury /
            Controller of Budget sources. Per-county equitable-share amounts are{" "}
            <span className="font-semibold text-foreground">not shown here</span> until Level-1
            audited figures are ingested.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm">
          <a href={CRA_HOME} target="_blank" rel="noopener noreferrer">
            CRA
            <ExternalLink className="ml-1.5 size-3.5" aria-hidden />
          </a>
        </Button>
        <Button asChild variant="outline" size="sm">
          <a href={TREASURY_BOOKS} target="_blank" rel="noopener noreferrer">
            Treasury books
            <ExternalLink className="ml-1.5 size-3.5" aria-hidden />
          </a>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <a href={COB_HOME} target="_blank" rel="noopener noreferrer">
            COB reports
            <ExternalLink className="ml-1.5 size-3.5" aria-hidden />
          </a>
        </Button>
      </div>

      <label className="relative mt-4 block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter counties…"
          className="w-full rounded-2xl border border-border/50 bg-background py-2 pl-9 pr-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>

      <ul className="mt-3 max-h-64 space-y-1 overflow-y-auto pr-1">
        {filtered.map((name) => (
          <li key={name}>
            <a
              href={CRA_HOME}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-muted/50"
            >
              <span className="font-medium">{name}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                CRA
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[10px] text-muted-foreground">
        Showing {filtered.length} of {COUNTIES.length} counties · no illustrative CRA numbers
      </p>
    </section>
  );
}
