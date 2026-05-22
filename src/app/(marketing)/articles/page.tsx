import type { Metadata } from "next";
import Link from "next/link";
import { PageBreadcrumbs } from "@/components/global/page-breadcrumbs";
import { ArticleCard } from "@/components/citizen/article-card";
import { Routes } from "@/constants/routes";
import { fetchArticleListServer } from "@/lib/server-content";
import { buildPageMetadata } from "@/utils/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Articles | Budget Ndio Story",
  description:
    "Budget explainers and analysis from the BNSKE content API — civic education articles for young Kenyans.",
  path: "/articles",
});

export default async function ArticlesPage() {
  let articles: Awaited<ReturnType<typeof fetchArticleListServer>> = [];
  let error = "";

  try {
    articles = await fetchArticleListServer();
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not load articles.";
  }

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background pt-4 sm:pt-6">
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        <PageBreadcrumbs
          items={[
            { label: "Home", href: Routes.Home },
            { label: "Articles" },
          ]}
        />

        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold sm:text-4xl">Articles</h1>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            Standalone budget explainers only. Chapters inside a learning module (e.g. BPS 2026 sections)
            are read from{" "}
            <Link href={Routes.Learn} className="text-primary hover:underline">
              Learn → open a unit folder
            </Link>
            , not listed here.
          </p>
        </div>

        {error ? (
          <p className="text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        {!error && articles.length === 0 ? (
          <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
            <p className="text-muted-foreground">
              No standalone articles yet. BPS and other course chapters live under Learn units.
            </p>
            <Link href={Routes.Learn} className="mt-4 inline-block text-sm text-primary hover:underline">
              Browse the Learn hub →
            </Link>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
