import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { deepDiveCards, fetchDeepDiveArticle } from "@/lib/learn-deep-dives";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return deepDiveCards
    .filter((item) => item.id !== "bps")
    .map((item) => ({ slug: item.id }));
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
    <section className="relative min-h-screen w-full overflow-hidden bg-background pt-16 sm:pt-20">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -bottom-20 -right-20 size-72 rounded-full bg-violet-500/10 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-4xl px-4 pb-20 sm:px-6">
        <Link
          href="/learn/deep-dives"
          className="mb-6 inline-flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to Deep Dives
        </Link>

        <article className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            {article.sourceLabel} Docs Guide
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">{article.title}</h1>
          <p className="mt-3 text-sm text-foreground/70 sm:text-base">{article.summary}</p>

          <div
            className="prose prose-invert mt-7 max-w-none prose-p:text-foreground/80 prose-li:text-foreground/80 prose-headings:text-foreground"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://api.budgetndiostory.org/docrepository/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/5"
            >
              Open Docs Repository
            </a>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Return to Learn Hub <ArrowRight className="size-4" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}

