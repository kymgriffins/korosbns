"use client";

import Link from "next/link";
import { ExternalLink, Film, GraduationCap, Loader2, Newspaper, BookOpen, FileText } from "lucide-react";
import type { LearnHubItem } from "@/lib/learn-hub";
import { isExternalLearnHref, learnItemHref } from "@/lib/learn-hub";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<string, typeof BookOpen> = {
  video: Film,
  article: Newspaper,
  story: GraduationCap,
  document: FileText,
  path: BookOpen,
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
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" aria-label="Loading" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="border-dashed border-border/60 bg-muted/15 shadow-none">
        <CardContent className="py-16 text-center text-sm text-muted-foreground">
          {emptyMessage ?? "Nothing published in this section yet."}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <LearnContentCard key={`${item.content_type}-${item.id}`} item={item} />
      ))}
    </div>
  );
}

function LearnContentCard({ item }: { item: LearnHubItem }) {
  const href = learnItemHref(item);
  const external = isExternalLearnHref(href);
  const Icon = TYPE_ICONS[item.content_type] ?? BookOpen;

  const body = (
    <Card className="group h-full overflow-hidden border-border/50 shadow-none transition-all hover:border-primary/30 hover:shadow-sm">
      {item.thumbnail_url ? (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.thumbnail_url}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-muted/80 to-muted/30">
          <Icon className="size-10 text-muted-foreground/35" />
        </div>
      )}
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {item.content_type}
          </span>
          {item.difficulty ? (
            <Badge variant="secondary" className="text-[10px] uppercase">
              {item.difficulty}
            </Badge>
          ) : null}
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-semibold tracking-tight">{item.title}</h3>
        {item.summary ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.summary}</p>
        ) : null}
        <div className="mt-4">
          {external ? (
            <Button variant="outline" size="sm" className="w-full rounded-full" asChild>
              <a href={href} target="_blank" rel="noopener noreferrer">
                Open
                <ExternalLink className="ml-1.5 size-3.5" />
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="w-full rounded-full" asChild>
              <Link href={href}>
                {item.content_type === "video" ? "Watch" : item.content_type === "article" ? "Read" : "Open"}
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (external) {
    return <article className={cn("h-full")}>{body}</article>;
  }

  return (
    <Link href={href} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
      {body}
    </Link>
  );
}
