"use client";

import Link from "next/link";
import { ExternalLink, Film, GraduationCap, Loader2, Newspaper, BookOpen, FileText } from "lucide-react";
import { motion } from "motion/react";
import type { LearnHubItem } from "@/lib/learn-hub";
import { isExternalLearnHref, learnItemHref } from "@/lib/learn-hub";
import { staggerContainer, fadeInUp } from "@/motion/variants";
import { useReducedMotionSafe } from "@/motion/hooks";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { cn } from "@/utils";

const TYPE_ICONS: Record<string, typeof BookOpen> = {
  video: Film,
  article: Newspaper,
  story: GraduationCap,
  document: FileText,
  path: BookOpen,
};

const TYPE_GRADIENTS: Record<string, string> = {
  video: "from-muted to-muted/50",
  article: "from-muted to-muted/50",
  story: "from-muted to-muted/50",
  document: "from-muted to-muted/50",
  path: "from-muted to-muted/50",
};

export function LearnContentGrid({
  items,
  loading,
  emptyMessage,
}: {
  items: LearnHubItem[];
  loading?: boolean;
  emptyMessage?: string;
}) {
  const reduced = useReducedMotionSafe();

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-8 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-card py-12 text-center text-sm text-muted-foreground">
        {emptyMessage ?? "Nothing published in this section yet."}
      </p>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      variants={staggerContainer}
      initial={reduced ? false : "hidden"}
      animate="visible"
    >
      {items.map((item) => (
        <LearnContentCard key={`${item.content_type}-${item.id}`} item={item} />
      ))}
    </motion.div>
  );
}

function LearnContentCard({ item }: { item: LearnHubItem }) {
  const href = learnItemHref(item);
  const external = isExternalLearnHref(href);
  const Icon = TYPE_ICONS[item.content_type] ?? BookOpen;
  const gradient = TYPE_GRADIENTS[item.content_type] ?? "from-primary/10 to-primary/5";

  const body = (
    <>
      {item.thumbnail_url ? (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={item.thumbnail_url}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className={cn("flex aspect-video w-full items-center justify-center bg-gradient-to-br", gradient)}>
          <Icon className="size-10 text-muted-foreground/40" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {item.content_type}
          </span>
          {item.difficulty && (
            <Badge variant="secondary" className="text-[10px] uppercase leading-none px-1.5 py-0.5">
              {item.difficulty}
            </Badge>
          )}
          {item.published_at && (
            <span className="ml-auto text-[10px] text-muted-foreground">
              {new Date(item.published_at).toLocaleDateString()}
            </span>
          )}
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-tight">{item.title}</h3>
        {item.summary ? (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.summary}</p>
        ) : null}
        {item.tags?.length ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag.slug} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">
                {tag.name}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-auto pt-3">
          {external ? (
            <Button variant="outline" size="sm" className="w-full text-xs font-bold rounded-lg" asChild>
              <a href={href} target="_blank" rel="noopener noreferrer">
                Open
                <ExternalLink className="ml-1.5 size-3" aria-hidden />
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full text-xs font-bold rounded-lg" asChild>
              <Link href={href}>
                {item.content_type === "video" ? "Watch" : item.content_type === "article" ? "Read" : "Open"}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <motion.div variants={fadeInUp} className="group">
      {external ? (
        <article className="flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/40">
          {body}
        </article>
      ) : (
        <Link
          href={href}
          className="flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/40"
        >
          {body}
        </Link>
      )}
    </motion.div>
  );
}
