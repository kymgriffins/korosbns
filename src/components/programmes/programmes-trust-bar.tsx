"use client";

import Link from "next/link";
import { ShieldCheck, Award, Building2 } from "lucide-react";
import { BNS_PARTNERS_NAMED } from "@/content";

export function ProgrammesTrustBar() {
  return (
    <section className="w-full border-b border-border/40 bg-card/30 py-8 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 md:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" aria-hidden />
          <span>Trusted Civic & Fiscal Accountability Partners</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {BNS_PARTNERS_NAMED.map((partner) => (
            <Link
              key={partner.id}
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 rounded-xl border border-border/40 bg-card/60 px-4 py-2 text-xs font-medium text-foreground/80 transition-all hover:border-primary/40 hover:text-primary hover:shadow-sm"
            >
              <Building2 className="size-4 shrink-0 text-primary/70 group-hover:text-primary" />
              <span>{partner.name}</span>
            </Link>
          ))}
          <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary">
            <Award className="size-4 shrink-0" />
            <span>Independent & Non-Partisan</span>
          </div>
        </div>
      </div>
    </section>
  );
}
