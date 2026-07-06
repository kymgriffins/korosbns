"use client";

import Link from "next/link";
import { Flame, MessageSquare, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { Routes } from "@/constants/routes";
import { learnTabToHref } from "@/lib/learn-nav";
import type { LearnHubItem } from "@/lib/learn-hub";
import { learnItemHref, isExternalLearnHref } from "@/lib/learn-hub";
import { fadeInUp } from "@/motion/variants";
import { useReducedMotionSafe } from "@/motion/hooks";
import { Button } from "@/components/ui/button";
import { LearnPanel, LearnSection } from "@/components/learn/learn-ui-primitives";

type Props = {
  continueItems?: LearnHubItem[];
  dailyQuest?: LearnHubItem | null;
  trending?: LearnHubItem[];
};

function SidebarBlock({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotionSafe();
  return (
    <motion.div variants={fadeInUp} initial={reduced ? false : "hidden"} animate="visible">
      <LearnPanel padding="sm">
        <LearnSection title={title} hint={hint}>
          {children}
        </LearnSection>
      </LearnPanel>
    </motion.div>
  );
}

export function LearnSidebar({ continueItems = [], dailyQuest, trending = [] }: Props) {
  return (
    <>
      <SidebarBlock title="Continue learning" hint="Principle: Purpose">
        {continueItems.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Start a path or article to see progress here.
          </p>
        ) : (
          <ul className="space-y-2">
            {continueItems.slice(0, 3).map((item) => {
              const href = learnItemHref(item);
              const external = isExternalLearnHref(href);
              return (
                <li key={`${item.content_type}-${item.id}`}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <Link href={href} className="text-sm font-medium text-primary hover:underline">
                      {item.title}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </SidebarBlock>

      <SidebarBlock title="Daily quest" hint="Principle: Craft">
        <div className="flex items-center gap-2 text-amber-600">
          <Flame className="size-4" aria-hidden />
          <span className="text-xs font-medium">Today&apos;s challenge</span>
        </div>
        {dailyQuest ? (
          <div className="mt-2">
            <p className="text-sm font-semibold">{dailyQuest.title}</p>
            {dailyQuest.summary ? (
              <p className="mt-1 text-xs text-muted-foreground">{dailyQuest.summary}</p>
            ) : null}
            <Button asChild size="sm" className="mt-3 w-full rounded-xl">
              <Link href={learnItemHref(dailyQuest)}>Start quest</Link>
            </Button>
          </div>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">No active quest right now.</p>
        )}
      </SidebarBlock>

      <SidebarBlock title="Trending" hint="Principle: Clarity">
        <div className="flex items-center gap-2 text-primary">
          <TrendingUp className="size-4" aria-hidden />
          <span className="text-xs font-medium">Popular now</span>
        </div>
        <ul className="mt-2 space-y-2">
          {trending.slice(0, 4).map((item) => (
            <li key={`${item.content_type}-${item.id}`}>
              <Link href={learnItemHref(item)} className="text-sm hover:text-primary">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href={Routes.LearnArticles}
          className="mt-3 inline-block text-xs font-semibold text-primary"
        >
          Browse all articles
        </Link>
      </SidebarBlock>

      <SidebarBlock title="Community" hint="Principle: Familiarity">
        <div className="flex items-center gap-2 text-primary">
          <MessageSquare className="size-4" aria-hidden />
          <span className="text-xs font-medium">Citizen forum</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Join the discussion about Kenya&apos;s budget and public finance.
        </p>
        <Link
          href={learnTabToHref("forum")}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary"
        >
          Visit forum
        </Link>
      </SidebarBlock>
    </>
  );
}
