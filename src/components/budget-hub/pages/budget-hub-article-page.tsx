"use client";

import { ArticleReader } from "@/components/budget-hub/article/article-reader";
import type { ArticleReaderData } from "@/components/budget-hub/article/article-hero";
import { Routes } from "@/constants/routes";

export type BudgetHubArticleInput = {
  id: string;
  title: string;
  snippet: string;
  body?: string;
  body_html?: string;
  heroImage?: string;
  category?: string;
  readTime?: string;
  publishedAt?: string;
  author?: {
    name?: string;
    image?: string;
    slug?: string;
  } | null;
};

export function normalizeBudgetHubArticle(
  raw: BudgetHubArticleInput,
): { article: ArticleReaderData; body?: string; bodyHtml?: string } {
  return {
    article: {
      title: raw.title,
      excerpt: raw.snippet,
      heroImage: raw.heroImage,
      category: raw.category,
      readTime: raw.readTime,
      publishedAt: raw.publishedAt,
      authorName: raw.author?.name,
      authorImage: raw.author?.image,
      authorHref: raw.author?.slug
        ? Routes.LearnAuthor(raw.author.slug)
        : undefined,
    },
    body: raw.body,
    bodyHtml: raw.body_html,
  };
}

export function BudgetHubArticlePage({
  article,
}: {
  article: BudgetHubArticleInput;
}) {
  const normalized = normalizeBudgetHubArticle(article);
  return (
    <ArticleReader
      article={normalized.article}
      body={normalized.body}
      bodyHtml={normalized.bodyHtml}
    />
  );
}
