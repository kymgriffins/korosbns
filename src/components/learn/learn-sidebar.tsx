"use client";

import Link from "next/link";
import { Flame, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { Routes } from "@/constants/routes";
import type { LearnHubItem } from "@/lib/learn-hub";
import { learnItemHref, isExternalLearnHref } from "@/lib/learn-hub";
import { fadeInUp } from "@/motion/variants";
import { useReducedMotionSafe } from "@/motion/hooks";
import { Button } from "@/ui/button";

type Props = {
  continueItems?: LearnHubItem[];
  dailyQuest?: LearnHubItem | null;
  trending?: LearnHubItem[];
};

export function LearnSidebar({ continueItems = [], dailyQuest, trending = [] }: Props) {
  const reduced = useReducedMotionSafe();

  return (
    <aside className="space-y-4 lg:sticky lg:top-48 lg:self-start">
      <motion.section
        variants={fadeInUp}
        initial={reduced ? false : "hidden"}
        animate="visible"
        className="rounded-2xl border border-border bg-card p-4"
      >
        <h2 className="text-sm font-bold">Continue learning</h2>
        {continueItems.length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Start a path or article to see your progress here.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
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
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial={reduced ? false : "hidden"}
        animate="visible"
        className="rounded-2xl border border-border bg-card p-4"
      >
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <Flame className="size-4 text-orange-500" aria-hidden />
          Daily quest
        </h2>
        {dailyQuest ? (
          <div className="mt-3">
            <p className="text-sm font-medium">{dailyQuest.title}</p>
            {dailyQuest.summary ? (
              <p className="mt-1 text-xs text-muted-foreground">{dailyQuest.summary}</p>
            ) : null}
            <Button asChild size="sm" className="mt-3 w-full">
              <Link href={learnItemHref(dailyQuest)}>Start quest</Link>
            </Button>
          </div>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">No active quest right now.</p>
        )}
      </motion.section>

      <motion.section
        variants={fadeInUp}
        initial={reduced ? false : "hidden"}
        animate="visible"
        className="rounded-2xl border border-border bg-card p-4"
      >
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <TrendingUp className="size-4 text-primary" aria-hidden />
          Trending
        </h2>
        <ul className="mt-3 space-y-2">
          {trending.slice(0, 4).map((item) => (
            <li key={`${item.content_type}-${item.id}`}>
              <Link href={learnItemHref(item)} className="text-sm hover:text-primary">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={Routes.LearnArticles} className="mt-3 inline-block text-xs font-semibold text-primary">
          Browse all articles
        </Link>
      </motion.section>
    </aside>
  );
}
