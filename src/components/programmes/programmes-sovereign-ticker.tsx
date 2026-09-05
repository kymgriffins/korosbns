"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/utils";

export type SovereignTickerItem = {
  topic: string;
  text: string;
  href: string;
};

export const SOVEREIGN_TICKER_ITEMS: SovereignTickerItem[] = [
  {
    topic: "Article 201 Standard",
    text: "Openness, accountability and public participation in all financial matters",
    href: "/learn",
  },
  {
    topic: "Desk 01 · Policy",
    text: "Auditing KES 4.82T National Budget & Sovereign Debt",
    href: "/programmes#desk-01",
  },
  {
    topic: "Desk 02 · County",
    text: "KES 420B Devolution tracking across 47 Counties",
    href: "/programmes#desk-02",
  },
  {
    topic: "Desk 03 · Wanahabari",
    text: "120+ Journalists trained in forensic fiscal reporting",
    href: "/programmes#desk-03",
  },
  {
    topic: "Desk 04 · BNS Studio",
    text: "Commercial media commissions funding watchdog audits",
    href: "/bns-studio",
  },
  {
    topic: "Sovereign Debt",
    text: "KES 64 of every KES 100 collected is swallowed by debt servicing before services",
    href: "/reports",
  },
  {
    topic: "Commission BNS",
    text: "Commission forensic explainers & podcasts · Double Impact revenue model",
    href: "/bns-studio#booking",
  },
  {
    topic: "Citizen Audit",
    text: "Nelly Maina & Calvina Praise tracking county dispensaries & public funds",
    href: "/learn/stories",
  },
];

export function ProgrammesSovereignTicker({ className }: { className?: string } = {}) {
  return (
    <div
      className={cn(
        "w-full min-w-0 max-w-full flex items-center gap-2.5 overflow-hidden rounded-full border border-border/60 bg-muted/40 dark:bg-zinc-900/50 py-1.5 pl-3 pr-2 backdrop-blur-xs transition-colors hover:border-border",
        className
      )}
    >
      {/* Subtle Live Emerald Pulse Dot */}
      <span className="relative flex size-2 shrink-0 items-center justify-center">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
      </span>

      {/* Full-width Unobstructed Marquee Stream */}
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <Marquee
          pauseOnHover
          repeat={3}
          className="py-0.5 w-full min-w-0 max-w-full overflow-hidden [--duration:85s] [--gap:2.25rem]"
        >
          {SOVEREIGN_TICKER_ITEMS.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="inline-flex items-center gap-1.5 group/item whitespace-nowrap text-xs text-foreground/90 hover:text-primary transition-colors shrink-0"
            >
              <span className="font-semibold text-foreground tracking-tight">
                {item.topic}
              </span>
              <span className="text-muted-foreground">
                — {item.text}
              </span>
              <ArrowUpRight className="size-3 text-muted-foreground/60 group-hover/item:text-primary transition-colors inline shrink-0" />
            </Link>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-background/90 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-background/90 to-transparent" />
      </div>
    </div>
  );
}
