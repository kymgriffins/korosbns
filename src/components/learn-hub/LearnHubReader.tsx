"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ChevronDown } from "lucide-react";
import { TriviaQuiz } from "@/components/citizen/trivia-quiz";
import { ArticleReaderActions } from "@/components/citizen/article-reader-actions";
import { ModuleForum } from "@/components/forum/module-forum";
import { PageBreadcrumbs } from "@/components/global/page-breadcrumbs";
import { Routes } from "@/constants/routes";
import { renderArticleBody } from "@/lib/render-content";
import { contentData } from "@/data/content";
import { learnItemHref, type LearnHubItem as HubNavItem } from "@/lib/learn-hub";
import type { TriviaSetApi } from "@/lib/api-client";
import type { LearnHubItem } from "@/types/learn";
import { cn } from "@/utils";

type ReaderMode = "loading" | "error" | "article" | "story" | "trivia";

interface StoryCard {
  text?: string;
  content?: string;
  title?: string;
  subtitle?: string;
  stat?: { value: string; label: string };
  facts?: string[];
  note?: string;
}

interface StoryData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  duration: string;
  cards: StoryCard[];
}

function normalizeArticle(raw: unknown) {
  const r = (raw ?? {}) as Record<string, any>;
  const meta = (r.metadata ?? {}) as Record<string, any>;
  const readMinutes = meta.read_minutes ?? r.read_minutes;
  return {
    id: String(r.id ?? ""),
    title: String(r.title ?? ""),
    snippet: String(r.snippet ?? r.summary ?? ""),
    body: r.body as string | undefined,
    body_html: r.body_html as string | undefined,
    heroImage: (r.heroImage ?? meta.hero_image ?? r.cover_image_url ?? r.image_url ?? r.thumbnail_url ?? undefined) as string | undefined,
    category: (r.category ?? meta.category ?? undefined) as string | undefined,
    readTime: (r.readTime ?? (readMinutes ? `${readMinutes} min read` : undefined)) as string | undefined,
    publishedAt: (r.publishedAt ?? r.published_at ?? undefined) as string | undefined,
    updatedAt: (r.updatedAt ?? r.updated_at ?? undefined) as string | undefined,
    tags: Array.isArray(r.tags) ? (r.tags as Array<{ name?: string }>) : [],
    learningContext: (r.learningContext ?? r.learning_context ?? undefined) as
      | {
          prev_article_slug?: string;
          prev_section_title?: string;
          next_article_slug?: string;
          next_section_title?: string;
        }
      | undefined,
  };
}

export function LearnHubReader({
  slug,
  initialMode = "loading",
  initialArticle = null,
  initialTrivia = null,
  initialStory = null,
}: {
  slug: string;
  initialMode?: ReaderMode;
  initialArticle?: Record<string, unknown> | null;
  initialTrivia?: TriviaSetApi | null;
  initialStory?: StoryData | null;
}) {
  const [discussionOpen, setDiscussionOpen] = useState(false);
  const [keepReading, setKeepReading] = useState<LearnHubItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const items = await contentData.articles.fetch();
        if (!cancelled) {
          setKeepReading(
            items.filter((a) => a.slug !== slug && a.id !== slug).slice(0, 2),
          );
        }
      } catch {
        /* optional rail — ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (initialMode === "loading") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16" aria-busy="true">
        <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-4 w-full animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (initialMode === "error") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Not found
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight">
          This lesson doesn&apos;t exist yet
        </h1>
        <p className="mt-3 text-muted-foreground">
          Try the hub — reads, stories, and videos are all one search away.
        </p>
        <Link
          href="/learn"
          className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Learn
        </Link>
      </div>
    );
  }

  if (initialMode === "trivia" && initialTrivia) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-8">
        <PageBreadcrumbs
          items={[
            { label: "Learn", href: Routes.Learn },
            { label: "Quiz" },
          ]}
        />
        <p className="mt-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
          Quiz module
        </p>
        <h1 className="mb-8 mt-3 text-3xl font-extrabold tracking-tight">
          {(initialTrivia as { title?: string }).title ?? "Budget trivia"}
        </h1>
        <TriviaQuiz trivia={initialTrivia} />
      </div>
    );
  }

  if (initialMode === "story" && initialStory) {
    const story = initialStory;
    return (
      <article className="mx-auto max-w-3xl px-4 py-10 md:px-8">
        <PageBreadcrumbs
          items={[
            { label: "Learn", href: Routes.Learn },
            { label: "Stories", href: "/learn" },
            { label: story.title },
          ]}
        />
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Story · {story.duration}
        </p>
        <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
          {story.title}
        </h1>
        {story.subtitle ? (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {story.subtitle}
          </p>
        ) : null}

        <div className="mt-10 space-y-10">
          {story.cards.map((card, i) => (
            <section key={i} aria-label={`Part ${i + 1}`}>
              <p className="text-xs font-extrabold tracking-[0.2em] text-primary">
                {String(i + 1).padStart(2, "0")}
              </p>
              {card.title ? (
                <h2 className="mt-2 text-xl font-bold tracking-tight md:text-2xl">
                  {card.title}
                </h2>
              ) : null}
              {card.stat ? (
                <p className="mt-3 font-extrabold tracking-tight" style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)" }}>
                  {card.stat.value}
                  <span className="mt-1 block text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {card.stat.label}
                  </span>
                </p>
              ) : null}
              {card.text ?? card.content ?? card.subtitle ? (
                <p className="mt-3 text-base leading-relaxed text-foreground/85 md:text-lg">
                  {card.text ?? card.content ?? card.subtitle}
                </p>
              ) : null}
              {card.facts && card.facts.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {card.facts.map((fact, j) => (
                    <li key={j} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                      <span aria-hidden className="font-bold text-primary">·</span>
                      {fact}
                    </li>
                  ))}
                </ul>
              ) : null}
              {card.note ? (
                <p className="mt-3 border-l-2 border-primary pl-3 text-sm italic text-muted-foreground">
                  {card.note}
                </p>
              ) : null}
            </section>
          ))}
        </div>

        <footer className="mt-14 border-t border-border pt-8">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Keep learning
          </Link>
        </footer>
      </article>
    );
  }

  const article = normalizeArticle(initialArticle);
  const ctx = article.learningContext;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:px-8">
      <PageBreadcrumbs
        items={[
          { label: "Learn", href: Routes.Learn },
          { label: "Articles", href: "/learn" },
          { label: article.title },
        ]}
      />

      <header className="mt-6">
        {article.category ? (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {article.category}
          </p>
        ) : null}
        <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight md:text-4xl">
          {article.title}
        </h1>
        {article.snippet ? (
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {article.snippet}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {article.readTime ? <span>{article.readTime}</span> : null}
          {article.publishedAt ? (
            <span>
              {new Date(article.publishedAt).toLocaleDateString("en-KE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          ) : null}
        </div>
        <div className="mt-4">
          <ArticleReaderActions slug={slug} contentId={article.id || slug} />
        </div>
      </header>

      {article.heroImage ? (
        <figure className="mt-8 overflow-hidden rounded-2xl border border-border/30">
          <div className="relative aspect-[16/9]">
            <Image
              src={article.heroImage}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </figure>
      ) : null}

      <div className="mt-8 max-w-none">
        {renderArticleBody(article.body_html, article.body, article.snippet)}
      </div>

      {article.tags.length > 0 ? (
        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags.map((tag, i) => (
            <span
              key={`${tag.name}-${i}`}
              className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      ) : null}

      {(ctx?.prev_article_slug || ctx?.next_article_slug) && (
        <nav aria-label="Lesson navigation" className="mt-10 grid gap-3 sm:grid-cols-2">
          {ctx.prev_article_slug ? (
            <Link
              href={`/learn/${ctx.prev_article_slug}`}
              className="rounded-2xl border border-border/40 p-4 transition-colors hover:border-primary/50"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Previous
              </span>
              <span className="mt-1 block text-sm font-bold">
                {ctx.prev_section_title ?? "Previous lesson"}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {ctx.next_article_slug ? (
            <Link
              href={`/learn/${ctx.next_article_slug}`}
              className="rounded-2xl border border-border/40 p-4 text-right transition-colors hover:border-primary/50"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Next
              </span>
              <span className="mt-1 block text-sm font-bold">
                {ctx.next_section_title ?? "Next lesson"}
              </span>
            </Link>
          ) : null}
        </nav>
      )}

      <section className="mt-10 rounded-2xl border border-border/40">
        <button
          type="button"
          onClick={() => setDiscussionOpen((v) => !v)}
          aria-expanded={discussionOpen}
          className="flex w-full items-center justify-between gap-3 p-5 text-left"
        >
          <span>
            <span className="block text-base font-bold">Discuss this lesson</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Questions and field notes from fellow learners
            </span>
          </span>
          <ChevronDown
            className={cn("size-5 shrink-0 transition-transform", discussionOpen && "rotate-180")}
            aria-hidden
          />
        </button>
        {discussionOpen ? (
          <div className="border-t border-border/40 p-5">
            <ModuleForum moduleId={slug} />
          </div>
        ) : null}
      </section>

      {keepReading.length > 0 ? (
        <footer className="mt-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Keep reading
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {keepReading.map((item) => (
              <Link
                key={item.id}
                href={learnItemHref(item as unknown as HubNavItem)}
                className="group rounded-2xl border border-border/40 p-5 transition-colors hover:border-primary/50"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {(item.difficulty ?? "Guide") as string}
                </span>
                <span className="mt-1 line-clamp-2 block font-bold leading-snug">
                  {item.title}
                </span>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
                  Open <ArrowUpRight className="size-3.5" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </footer>
      ) : null}
    </article>
  );
}
