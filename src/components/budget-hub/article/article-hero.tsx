import Image from "next/image";
import { MetadataRow } from "@/components/budget-hub/article/metadata-row";
import { formatHubDate } from "@/components/budget-hub/tokens/types";
import { Clock } from "lucide-react";

export type ArticleReaderData = {
  title: string;
  excerpt: string;
  heroImage?: string | null;
  category?: string | null;
  readTime?: string | null;
  publishedAt?: string | null;
  authorName?: string | null;
  authorImage?: string | null;
  authorHref?: string | null;
};

export function ArticleHero({ article }: { article: ArticleReaderData }) {
  const metadata = [
    article.category ? { label: article.category } : null,
    article.readTime
      ? { icon: <Clock className="size-3.5" />, label: article.readTime }
      : null,
    article.publishedAt
      ? { label: formatHubDate(article.publishedAt) }
      : null,
    article.authorName
      ? {
          label: article.authorName,
          href: article.authorHref ?? undefined,
        }
      : null,
  ].filter(Boolean) as {
    icon?: React.ReactNode;
    label: string;
    href?: string;
  }[];

  return (
    <header className="mx-auto max-w-[var(--bh-prose)] py-[var(--bh-section-y)]">
      {article.category ? (
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--bh-accent-warm)]">
          {article.category}
        </p>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-tight md:text-5xl md:leading-[1.1]">
        {article.title}
      </h1>
      {article.excerpt ? (
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
      ) : null}
      <MetadataRow items={metadata} className="mt-6" />
      {article.heroImage ? (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
          <Image
            src={article.heroImage}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 42rem"
            priority
          />
        </div>
      ) : null}
    </header>
  );
}
