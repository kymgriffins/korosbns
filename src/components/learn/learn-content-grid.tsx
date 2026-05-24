"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import type { LearnHubItem } from "@/lib/learn-hub";
import { isExternalLearnHref, learnItemHref } from "@/lib/learn-hub";
import { staggerContainer, fadeInUp } from "@/motion/variants";
import { useReducedMotionSafe } from "@/motion/hooks";
import { Button } from "@/ui/button";

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

  const body = (
    <>
      {item.thumbnail_url ? (
        <div className="relative aspect-video w-full bg-muted">
          <Image
            src={item.thumbnail_url}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 320px"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {item.content_type}
          {item.difficulty ? ` · ${item.difficulty}` : ""}
        </p>
        <h3 className="mt-1 line-clamp-2 text-base font-semibold">{item.title}</h3>
        {item.summary ? (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.summary}</p>
        ) : null}
        <div className="mt-auto pt-4">
          {external ? (
            <Button variant="secondary" size="sm" className="w-full" asChild>
              <a href={href} target="_blank" rel="noopener noreferrer">
                Open
                <ExternalLink className="ml-2 size-3.5" aria-hidden />
              </a>
            </Button>
          ) : (
            <Button variant="secondary" size="sm" className="w-full">
              Open
            </Button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <motion.div variants={fadeInUp}>
      {external ? (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
          {body}
        </article>
      ) : (
        <Link
          href={href}
          className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
        >
          {body}
        </Link>
      )}
    </motion.div>
  );
}
