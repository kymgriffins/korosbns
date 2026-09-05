"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/utils";

export type SovereignTickerItem = {
  badge: string;
  badgeClass: string;
  text: string;
  href: string;
};

export const SOVEREIGN_TICKER_ITEMS: SovereignTickerItem[] = [
  {
    badge: "ART. 201",
    badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    text: "⚖️ \"Openness, accountability and public participation in all financial matters\"",
    href: "/learn",
  },
  {
    badge: "DESK 01 · POLICY",
    badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    text: "📊 National Policy Desk: Auditing KES 4.82T National Budget & Sovereign Debt",
    href: "/programmes#desk-01",
  },
  {
    badge: "DESK 02 · COUNTY",
    badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    text: "🏥 County Grassroots Desk: KES 420B Devolution tracking across 47 Counties",
    href: "/programmes#desk-02",
  },
  {
    badge: "DESK 03 · WANAHABARI",
    badgeClass: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20",
    text: "📰 Wanahabari Desk: 120+ Journalists trained in forensic fiscal reporting",
    href: "/programmes#desk-03",
  },
  {
    badge: "DESK 04 · STUDIO",
    badgeClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20",
    text: "🎬 BNS Studio Desk: Commercial commissions funding sovereign watchdog audits",
    href: "/bns-studio",
  },
  {
    badge: "SOVEREIGN DEBT",
    badgeClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20",
    text: "⚡ Out of every KES 100 collected, KES 64 is swallowed by debt servicing before services",
    href: "/reports",
  },
  {
    badge: "COMMISSION BNS",
    badgeClass: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20",
    text: "🎙️ Commission forensic explainers & podcasts · Double Impact revenue model",
    href: "/bns-studio#booking",
  },
  {
    badge: "CITIZEN AUDIT",
    badgeClass: "bg-primary/15 text-primary border border-primary/20",
    text: "🔍 Nelly Maina & Calvina Praise tracking county dispensaries & public funds",
    href: "/learn/stories",
  },
];

export function ProgrammesSovereignTicker({ className }: { className?: string } = {}) {
  return (
    <div
      className={cn(
        "w-full min-w-0 max-w-full rounded-xl border border-border/70 bg-card/75 dark:bg-zinc-950/75 backdrop-blur-md shadow-xs overflow-hidden flex items-center",
        className
      )}
    >
      {/* Live Sovereign Badge Anchor */}
      <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/10 border-r border-border/60 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider select-none z-10">
        <span className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <span>SOVEREIGN</span>
      </div>

      {/* Marquee Ticker Stream */}
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <Marquee
          pauseOnHover
          repeat={3}
          className="py-1.5 w-full min-w-0 max-w-full overflow-hidden [--duration:95s] [--gap:1.75rem]"
        >
          {SOVEREIGN_TICKER_ITEMS.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="inline-flex items-center gap-2 group whitespace-nowrap text-xs font-mono transition-opacity hover:opacity-100 opacity-90 shrink-0"
            >
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0",
                  item.badgeClass
                )}
              >
                {item.badge}
              </span>
              <span className="text-foreground/90 group-hover:text-primary transition-colors">
                {item.text}
              </span>
              <ArrowUpRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors inline shrink-0" />
            </Link>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card/90 to-transparent" />
      </div>
    </div>
  );
}
