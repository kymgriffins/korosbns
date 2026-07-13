"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import bnsConfig from "@/constants/bnsConfig.json";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import {
  LandingContent,
  LandingSection,
  LandingSectionHeader,
} from "@/layouts/landing-section";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  WhatsAppIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/ui/social-icons";
import { cn } from "@/utils";

type SocialPlatform = {
  id: string;
  name: string;
  handle: string;
  url: string;
  stat: string;
  cta: string;
  accent: string;
  icon: React.ComponentType<{ className?: string }>;
};

const PLATFORM_META: Record<
  string,
  Omit<SocialPlatform, "id" | "name" | "url">
> = {
  x: {
    handle: "@budgetndiostory",
    stat: "Policy takes & threads",
    cta: "Follow",
    accent: "bg-foreground text-background",
    icon: XIcon,
  },
  twitter: {
    handle: "@budgetndiostory",
    stat: "Policy takes & threads",
    cta: "Follow",
    accent: "bg-foreground text-background",
    icon: XIcon,
  },
  youtube: {
    handle: "@budgetndiostory",
    stat: "Budget Mtaani series",
    cta: "Subscribe",
    accent: "bg-red-600 text-white",
    icon: YouTubeIcon,
  },
  tiktok: {
    handle: "@budget.ndio.story",
    stat: "1.2M+ content views",
    cta: "Follow",
    accent: "bg-foreground text-background",
    icon: TikTokIcon,
  },
  instagram: {
    handle: "@budgetndiostory",
    stat: "Reels & field stories",
    cta: "Follow",
    accent: "bg-gradient-to-br from-amber-500 via-rose-500 to-violet-600 text-white",
    icon: InstagramIcon,
  },
  linkedin: {
    handle: "Budget Ndio Story",
    stat: "Org & partnership news",
    cta: "Follow",
    accent: "bg-sky-700 text-white",
    icon: LinkedInIcon,
  },
  facebook: {
    handle: "Budget Ndio Story",
    stat: "Community updates",
    cta: "Follow",
    accent: "bg-blue-600 text-white",
    icon: FacebookIcon,
  },
  whatsapp: {
    handle: "+254 790 631 623",
    stat: "Usually replies in minutes",
    cta: "Chat",
    accent: "bg-emerald-600 text-white",
    icon: WhatsAppIcon,
  },
};

function buildPlatforms(): SocialPlatform[] {
  const fromConfig = (bnsConfig.platforms ?? [])
    .filter((p) => p.type === "social" && p.url)
    .map((p) => {
      const key = p.name.toLowerCase();
      const meta = PLATFORM_META[key];
      if (!meta) return null;
      return {
        id: key,
        name: p.name === "X" ? "X" : p.name,
        url: p.url,
        ...meta,
      } satisfies SocialPlatform;
    })
    .filter(Boolean) as SocialPlatform[];

  if (fromConfig.length > 0) return fromConfig;

  return Object.entries(PLATFORM_META)
    .filter(([key]) => key !== "twitter")
    .map(([key, meta]) => ({
      id: key,
      name: key === "x" ? "X" : key.charAt(0).toUpperCase() + key.slice(1),
      url: "#",
      ...meta,
    }));
}

function SocialExpandTile({
  platform,
  expanded,
  onExpand,
}: {
  platform: SocialPlatform;
  expanded: boolean;
  onExpand: () => void;
}) {
  const Icon = platform.icon;

  return (
    <Link
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onExpand}
      onFocus={onExpand}
      aria-label={`${platform.cta} ${platform.name} ${platform.handle}`}
      className={cn(
        "group relative flex min-h-16 items-center overflow-hidden rounded-2xl border border-border/70 bg-card transition-[flex-grow,background-color,border-color] duration-300 ease-out",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "flex-1 basis-0 hover:border-foreground/20",
        expanded && "flex-[2.4] border-foreground/25 bg-muted/30",
      )}
    >
      <div className="flex w-full items-center gap-3 px-3 py-3 sm:px-4">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300",
            platform.accent,
            expanded && "scale-105",
          )}
        >
          <Icon className="size-4" />
        </span>

        {/* Desktop: reveal on expand. Mobile list is separate. */}
        <div
          className={cn(
            "min-w-0 flex-1 overflow-hidden transition-all duration-300",
            expanded ? "max-w-[14rem] opacity-100" : "max-w-0 opacity-0",
          )}
        >
          <p className="truncate text-sm font-bold leading-tight">
            {platform.handle}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {platform.stat}
          </p>
        </div>

        <span
          className={cn(
            "ml-auto inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground transition-all duration-300",
            expanded
              ? "translate-x-0 opacity-100"
              : "pointer-events-none translate-x-2 opacity-0",
          )}
        >
          {platform.cta}
          <ExternalLink className="size-2.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function SocialsSection() {
  const platforms = buildPlatforms();
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <LandingSection>
      <LandingSectionHeader
        eyebrow="Stay connected"
        title={
          <>
            Find us where{" "}
            <span className={T.highlight}>you already scroll</span>
          </>
        }
        description="Hover a channel to see the handle and what we post — then follow in one click."
      />

      <LandingContent>
        {/* Desktop expanding row */}
        <div
          className="hidden gap-2 md:flex"
          onMouseLeave={() => setActiveId(null)}
        >
          {platforms.map((platform) => (
            <SocialExpandTile
              key={platform.id}
              platform={platform}
              expanded={activeId === platform.id}
              onExpand={() => setActiveId(platform.id)}
            />
          ))}
        </div>

        {/* Mobile: static compact list — no hover animation */}
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:hidden">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <li key={platform.id}>
                <Link
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-3 py-3 transition-colors hover:border-foreground/20"
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl",
                      platform.accent,
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold leading-tight">
                      {platform.handle}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {platform.stat}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {platform.cta}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </LandingContent>
    </LandingSection>
  );
}

export default SocialsSection;
