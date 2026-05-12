import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { deepDiveCards, fetchDeepDiveArticle } from "@/lib/learn-deep-dives";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return deepDiveCards.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchDeepDiveArticle(slug);
  return {
    title: `${article.title} | Budget Ndio Story`,
    description: article.summary,
  };
}

export default async function DeepDiveArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await fetchDeepDiveArticle(slug);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-surface-0 pt-12 sm:pt-16">
      <div className="mx-auto w-full max-w-3xl px-4 pb-24 sm:px-6">
        <Link
          href="/learn"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-text-3 transition-colors hover:text-accent"
        >
          <ArrowLeft className="size-4" />
          Back to Learn Hub
        </Link>

        <article className="space-y-8">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-soft border border-border-default px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
              {article.category || "Deep Dive"} · {article.sourceLabel}
            </div>
            <h1 className="g-headline">
              {article.title}
            </h1>
            <p className="g-subheadline">
              {article.summary}
            </p>
            {article.updatedAt && (
               <div className="text-xs text-text-3 font-medium">
                  Last updated {new Date(article.updatedAt).toLocaleDateString()}
               </div>
            )}
          </header>

          <hr className="border-border-default" />

          <div
            className="editorial-content max-w-none"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />

          <footer className="mt-16 pt-8 border-t border-border-default">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-text-1">Next Step</p>
                <p className="text-xs text-text-3">Keep exploring the budget cycle.</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/learn"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-text-1 px-6 text-sm font-bold text-surface-0 transition-all hover:bg-text-1/90"
                >
                  Return to Hub <ArrowRight className="size-4" />
                </Link>
                <a
                  href="https://api.budgetndiostory.org/docrepository/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-border-default px-6 text-sm font-bold text-text-1 transition-all hover:bg-surface-2/10"
                >
                  Raw Docs
                </a>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </section>
  );
}

