"use client";

import Link from "next/link";
import Image from "next/image";
import { ImmersiveChrome } from "./immersive-chrome";
import { ImmersiveBottomBar } from "./immersive-bottom-bar";
import { renderArticleBody } from "@/lib/render-content";
import { Routes } from "@/constants/routes";

export type ImmersiveArticleData = {
  id: string;
  title: string;
  snippet: string;
  body?: string;
  body_html?: string;
  heroImage?: string;
  category?: string;
  readTime?: string;
  publishedAt?: string;
  author?: { name?: string; image?: string; slug?: string; role?: string } | null;
  learningContext?: {
    next_article_slug?: string;
    next_section_title?: string;
    prev_article_slug?: string;
    prev_section_title?: string;
  };
};

export function ImmersiveArticleReader({
  slug,
  article,
}: {
  slug: string;
  article: ImmersiveArticleData;
}) {
  const ctx = article.learningContext;

  return (
    <div className="learn-immersive fixed inset-0 z-50 flex flex-col bg-background">
      <ImmersiveChrome
        backHref={Routes.LearnArticles}
        title={article.category || "Article"}
        subtitle={article.readTime}
      />
      <div className="flex-1 overflow-y-auto">
        {article.heroImage ? (
          <div className="relative mx-4 mt-2 aspect-[2/1] overflow-hidden rounded-[var(--immersive-radius)] bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.heroImage} alt="" className="size-full object-cover" />
          </div>
        ) : null}
        <article className="mx-auto max-w-2xl px-5 py-6">
          <h1 className="text-[length:var(--immersive-title)] font-semibold leading-tight tracking-tight">
            {article.title}
          </h1>
          <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground">{article.snippet}</p>
          {article.author?.name ? (
            <p className="mt-4 flex items-center gap-2 text-[14px] text-muted-foreground">
              {article.author.image ? (
                <Image src={article.author.image} alt="" width={28} height={28} className="size-7 rounded-full object-cover" />
              ) : null}
              <span className="font-medium text-foreground">{article.author.name}</span>
              {article.publishedAt ? (
                <span>· {new Date(article.publishedAt).toLocaleDateString()}</span>
              ) : null}
            </p>
          ) : null}
          <div className="immersive-prose mt-8 max-w-none">
            {renderArticleBody(article.body_html, article.body, article.snippet)}
          </div>
        </article>
      </div>
      <ImmersiveBottomBar
        prevHref={ctx?.prev_article_slug ? `/learn/${ctx.prev_article_slug}/read` : undefined}
        nextHref={
          ctx?.next_article_slug
            ? `/learn/${ctx.next_article_slug}/read`
            : Routes.LearnArticles
        }
        nextLabel={ctx?.next_article_slug ? "Next section" : "All articles"}
      />
    </div>
  );
}
