import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ArticleReaderActions } from "@/components/citizen/article-reader-actions";
import { PageBreadcrumbs } from "@/components/global/page-breadcrumbs";
import { Routes } from "@/constants/routes";
import { articlePlaceholderForSlug } from "@/lib/article-placeholders";
import {
  fetchArticleBySlugServer,
  fetchArticleSlugsServer,
} from "@/lib/server-content";
import { buildPageMetadata } from "@/utils/page-metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await fetchArticleSlugsServer();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await fetchArticleBySlugServer(slug);
    if (!article) {
      return buildPageMetadata({
        title: "Article not found | Budget Ndio Story",
        description: "This article could not be found.",
        path: `/articles/${slug}`,
        noIndex: true,
      });
    }
    return buildPageMetadata({
      title: `${article.title} | Budget Ndio Story`,
      description: article.snippet,
      path: `/articles/${slug}`,
      image: article.heroImage,
    });
  } catch {
    return buildPageMetadata({
      title: "Article | Budget Ndio Story",
      description: "Budget literacy article from Budget Ndio Story.",
      path: `/articles/${slug}`,
    });
  }
}

export default async function ArticleReaderPage({ params }: Props) {
  const { slug } = await params;
  let article: Awaited<ReturnType<typeof fetchArticleBySlugServer>> = null;

  try {
    article = await fetchArticleBySlugServer(slug);
  } catch {
    throw new Error("Failed to load article");
  }

  if (!article) notFound();

  const placeholder = articlePlaceholderForSlug(slug);
  const heroSrc = article.heroImage || placeholder.src;

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background pt-4 sm:pt-6">
      <div className="mx-auto w-full max-w-3xl px-4 pb-24 sm:px-6">
        <PageBreadcrumbs
          items={[
            { label: "Home", href: Routes.Home },
            { label: "Articles", href: Routes.Articles },
            { label: article.title },
          ]}
        />

        <div className="relative mb-8 h-48 overflow-hidden rounded-[24px] border border-border sm:h-56">
          <Image
            src={heroSrc}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${placeholder.accent}`} />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,12,0.75)_20%,transparent_70%)]" />
        </div>

        <article className="space-y-8">
          <header className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                  {article.category || "Article"} · {article.sourceLabel || "BNSKE"}
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  {article.title}
                </h1>
                <p className="text-xl leading-relaxed text-muted-foreground">{article.snippet}</p>
                <p className="text-sm text-muted-foreground">{article.readTime}</p>
                {article.updatedAt ? (
                  <p className="text-xs font-medium text-muted-foreground/80">
                    Last updated {new Date(article.updatedAt).toLocaleDateString()}
                  </p>
                ) : null}
              </div>
              <ArticleReaderActions
                slug={slug}
                contentId={article.contentId || slug}
              />
            </div>
          </header>

          <hr className="border-border" />

          {article.body_html ? (
            <div
              className="notion-content prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.body_html }}
            />
          ) : (
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
              {article.body || article.snippet}
            </div>
          )}

          <footer className="mt-16 border-t border-border pt-8">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">Keep reading</p>
                <p className="text-xs text-muted-foreground">More budget explainers from the API.</p>
              </div>
              <Link
                href={Routes.Articles}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-foreground px-6 text-sm font-bold text-background transition-all hover:bg-foreground/90"
              >
                All articles <ArrowRight className="size-4" />
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </section>
  );
}
