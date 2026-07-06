"use client";

import Link from "next/link";
import {
  BookOpen,
  ExternalLink,
  Film,
  GraduationCap,
  Loader2,
  Newspaper,
  FileText,
  Target,
} from "lucide-react";
import { motion } from "motion/react";
import type { LearnHubItem } from "@/lib/learn-hub";
import { isExternalLearnHref, learnItemHref } from "@/lib/learn-hub";
import { staggerContainer, fadeInUp } from "@/motion/variants";
import { useReducedMotionSafe } from "@/motion/hooks";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LearnCardGrid, LearnEmptyState } from "@/components/learn/learn-ui-primitives";
import { cn } from "@/utils";

const TYPE_ICONS: Record<string, typeof BookOpen> = {
  video: Film,
  article: Newspaper,
  story: GraduationCap,
  document: FileText,
  path: BookOpen,
  quest: Target,
};

const TYPE_LABELS: Record<string, string> = {
  video: "Watch",
  article: "Read",
  story: "Read story",
  document: "Open",
  path: "Start path",
  quest: "Start quest",
};

const EMPTY_COPY: Record<string, { title: string; description: string }> = {
  articles: {
    title: "No articles yet",
    description: "Editorial explainers will appear here when published.",
  },
  stories: {
    title: "No stories yet",
    description: "Field narratives from across Kenya will show up here.",
  },
  quests: {
    title: "No quests available",
    description: "Daily challenges will return soon — check back.",
  },
  default: {
    title: "Nothing here yet",
    description: "Content for this section is on the way.",
  },
};

export function LearnContentGrid({
  items,
  loading,
  emptyMessage,
  listKey,
}: {
  items: LearnHubItem[];
  loading?: boolean;
  emptyMessage?: string;
  listKey?: string;
}) {
  const reduced = useReducedMotionSafe();
  const empty = EMPTY_COPY[listKey ?? ""] ?? EMPTY_COPY.default;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-8 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <LearnEmptyState
        icon={TYPE_ICONS[listKey ?? "article"] ?? BookOpen}
        title={emptyMessage ?? empty.title}
        description={empty.description}
      />
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial={reduced ? false : "hidden"}
      animate="visible"
    >
      <LearnCardGrid columns={2}>
        {items.map((item) => (
          <LearnContentCard key={`${item.content_type}-${item.id}`} item={item} />
        ))}
      </LearnCardGrid>
    </motion.div>
  );
}

function LearnContentCard({ item }: { item: LearnHubItem }) {
  const href = learnItemHref(item);
  const external = isExternalLearnHref(href);
  const Icon = TYPE_ICONS[item.content_type] ?? BookOpen;
  const actionLabel = TYPE_LABELS[item.content_type] ?? "Open";

  const body = (
    <>
      {item.thumbnail_url ? (
        <div className="aspect-video w-full overflow-hidden rounded-t-2xl bg-muted">
          <img
            src={item.thumbnail_url}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-t-2xl bg-gradient-to-br from-primary/8 to-muted">
          <Icon className="size-10 text-muted-foreground/35" aria-hidden />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
            {item.content_type}
          </span>
          {item.difficulty ? (
            <Badge variant="secondary" className="text-[10px] uppercase leading-none">
              {item.difficulty}
            </Badge>
          ) : null}
          {item.published_at ? (
            <span className="ml-auto text-[10px] text-muted-foreground">
              {new Date(item.published_at).toLocaleDateString()}
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug group-hover:text-primary">
          {item.title}
        </h3>
        {item.summary ? (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {item.summary}
          </p>
        ) : null}
        {item.tags?.length ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.slug}
                className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {tag.name}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-auto pt-4">
          {external ? (
            <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold" asChild>
              <a href={href} target="_blank" rel="noopener noreferrer">
                {actionLabel}
                <ExternalLink className="ml-1.5 size-3" aria-hidden />
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold" asChild>
              <Link href={href}>{actionLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <motion.article variants={fadeInUp} className="group h-full">
      {external ? (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card ring-1 ring-border/30 transition-all hover:border-primary/25 hover:shadow-sm">
          {body}
        </div>
      ) : (
        <Link
          href={href}
          className={cn(
            "flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card",
            "ring-1 ring-border/30 transition-all hover:border-primary/25 hover:shadow-sm",
          )}
        >
          {body}
        </Link>
      )}
    </motion.article>
  );
}
