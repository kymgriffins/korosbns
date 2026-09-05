"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/utils";

type TickerItem = {
  badge: string;
  badgeClass: string;
  text: string;
  href: string;
};

const TICKER_ITEMS: TickerItem[] = [
  {
    badge: "EDUCATION",
    badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    text: "📊 Education Sector: KSh 654B (PFM Act §25 allocation)",
    href: "/reports",
  },
  {
    badge: "BNS STUDIO",
    badgeClass: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20",
    text: "🎙️ Commission forensic podcasts & animations · Double Impact model",
    href: "/bns-studio#booking",
  },
  {
    badge: "WATCH REEL",
    badgeClass: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20",
    text: "📱 Calvina Praise breaks down the KES 12T Sovereign Debt",
    href: "/learn/stories",
  },
  {
    badge: "HIGHLIGHT",
    badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    text: "⚡ Controller of Budget: Q3 County Spending Disclosures published",
    href: "/reports",
  },
  {
    badge: "ART. 201",
    badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    text: "⚖️ \"Openness, accountability and public participation in all financial matters\"",
    href: "/learn",
  },
  {
    badge: "DEVOLUTION",
    badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    text: "🇰🇪 County Equitable Share: KSh 420B to 47 Counties (DoRA/CARA)",
    href: "/reports",
  },
  {
    badge: "CITIZEN AUDIT",
    badgeClass: "bg-primary/15 text-primary border border-primary/20",
    text: "🔍 Nelly Maina audits local dispensary funds in 4 counties",
    href: "/learn/stories",
  },
  {
    badge: "HEALTH",
    badgeClass: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20",
    text: "🏥 Health Sector Ceiling: KSh 146B under citizen parliamentary scrutiny",
    href: "/reports",
  },
  {
    badge: "STATUTE",
    badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    text: "💡 95% of Kenya's budget is locked before June — Intervene in February",
    href: "/learn/modules/budget-policy-statement",
  },
];

export function LandingHeroTicker() {
  return (
    <div className="w-full max-w-xl rounded-xl border border-border/70 bg-card/75 dark:bg-zinc-950/75 backdrop-blur-md shadow-xs overflow-hidden flex items-center">
      {/* Live Badge Anchor */}
      <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 border-r border-border/60 text-primary font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider select-none z-10">
        <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
        <span>WIRE</span>
      </div>

      {/* Ticker Stream */}
      <div className="relative w-full overflow-hidden">
        <Marquee pauseOnHover repeat={3} className="py-1.5 [--duration:45s] [--gap:1.75rem]">
          {TICKER_ITEMS.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="inline-flex items-center gap-2 group whitespace-nowrap text-xs font-mono transition-opacity hover:opacity-100 opacity-90"
            >
              <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider", item.badgeClass)}>
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
