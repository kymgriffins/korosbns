"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/utils";

type TickerItem = {
  topic: string;
  text: string;
  href: string;
};

const TICKER_ITEMS: TickerItem[] = [
  {
    topic: "Education Sector",
    text: "KSh 654B allocated under PFM Act §25",
    href: "/reports",
  },
  {
    topic: "BNS Studio",
    text: "Commission forensic podcasts & data animations",
    href: "/bns-studio#booking",
  },
  {
    topic: "Watch Reel",
    text: "Calvina Praise breaks down the KES 12T Sovereign Debt",
    href: "/learn/stories",
  },
  {
    topic: "Controller of Budget",
    text: "Q3 County Spending Disclosures published",
    href: "/reports",
  },
  {
    topic: "Article 201",
    text: "Openness, accountability and public participation in all financial matters",
    href: "/learn",
  },
  {
    topic: "Devolution Share",
    text: "KSh 420B to 47 Counties under DoRA/CARA",
    href: "/reports",
  },
  {
    topic: "Citizen Audit",
    text: "Nelly Maina audits local dispensary funds in 4 counties",
    href: "/learn/stories",
  },
  {
    topic: "Health Ceiling",
    text: "KSh 146B under citizen parliamentary scrutiny",
    href: "/reports",
  },
];

export function LandingHeroTicker({ className }: { className?: string } = {}) {
  return (
    <div
      className={cn(
        "w-full min-w-0 max-w-xl flex items-center gap-2.5 overflow-hidden rounded-full border border-border/60 bg-muted/40 dark:bg-zinc-900/50 py-1.5 pl-3 pr-2 backdrop-blur-xs transition-colors hover:border-border",
        className
      )}
    >
      {/* Subtle Live Pulse Dot (no obstructive pinned labels) */}
      <span className="relative flex size-2 shrink-0 items-center justify-center">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose-400 opacity-75" />
        <span className="relative inline-flex size-1.5 rounded-full bg-rose-500" />
      </span>

      {/* Full-width Unobstructed Marquee Stream */}
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <Marquee
          pauseOnHover
          repeat={3}
          className="py-0.5 w-full min-w-0 max-w-full overflow-hidden [--duration:85s] [--gap:2.25rem]"
        >
          {TICKER_ITEMS.map((item, idx) => (
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
