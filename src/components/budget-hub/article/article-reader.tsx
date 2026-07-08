"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Routes } from "@/constants/routes";
import { BudgetHubPage } from "@/components/budget-hub/layout/budget-hub-page";
import { ReadingProgress } from "@/components/budget-hub/article/reading-progress";
import { ArticleHero, type ArticleReaderData } from "@/components/budget-hub/article/article-hero";
import { ArticleBody } from "@/components/budget-hub/article/article-body";
import { NewsletterSection } from "@/components/budget-hub/sections/newsletter-section";

export function ArticleReader({
  article,
  body,
  bodyHtml,
}: {
  article: ArticleReaderData;
  body?: string;
  bodyHtml?: string;
}) {
  return (
    <article className="budget-hub">
      <ReadingProgress />
      <BudgetHubPage>
        <Link
          href={Routes.Learn}
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Budget Hub
        </Link>
        <ArticleHero article={article} />
        <ArticleBody body={body} bodyHtml={bodyHtml} snippet={article.excerpt} />
      </BudgetHubPage>
      <NewsletterSection />
    </article>
  );
}
