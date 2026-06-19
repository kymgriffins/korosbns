import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { ArticleCard } from "@/components/citizen/article-card";
import { Routes } from "@/constants/routes";
import { fetchArticleListServer } from "@/lib/server-content";

export async function StandaloneArticlesStrip() {
  let articles: Awaited<ReturnType<typeof fetchArticleListServer>> = [];
  try {
    articles = await fetchArticleListServer();
  } catch {
    return null;
  }

  if (articles.length === 0) return null;

  return (
    <section className="space-y-4 pt-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <BookOpen className="size-5 text-primary" />
          Standalone explainers
        </h2>
        <Link href={Routes.Articles} className="text-xs font-semibold text-primary hover:underline">
          View all
        </Link>
      </div>
      <p className="text-sm text-foreground/60">
        Editorial articles outside a learning module. Course chapters (e.g. BPS sections) live inside
        their unit folder only.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {articles.slice(0, 4).map((article, index) => (
          <ArticleCard key={article.id} article={article} index={index} />
        ))}
      </div>
      {articles.length > 4 ? (
        <Link
          href={Routes.Articles}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          {articles.length - 4} more articles <ArrowRight className="size-4" />
        </Link>
      ) : null}
    </section>
  );
}
