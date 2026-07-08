import type { LearnHubItem } from "@/types/learn";
import type { CivicModule } from "@/types/learn";

export type HubContentItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  imageUrl?: string | null;
  category?: string | null;
  readTime?: string | null;
  publishedAt?: string | null;
  authorName?: string | null;
  authorImage?: string | null;
  href: string;
};

export type MetadataItem = {
  icon?: React.ReactNode;
  label: string;
  href?: string;
};

export function learnHubItemToCard(item: LearnHubItem): HubContentItem {
  const slug = item.slug ?? item.id;
  const tag = item.tags?.[0]?.name;
  return {
    id: item.id,
    slug,
    title: item.title ?? "Untitled",
    excerpt: item.summary ?? "",
    imageUrl: item.thumbnail_url ?? null,
    category: tag ?? item.content_type ?? null,
    readTime: item.lesson_count
      ? `${item.lesson_count} lessons`
      : item.difficulty ?? null,
    publishedAt: item.published_at ?? null,
    authorName: null,
    authorImage: null,
    href: `/learn/${slug}`,
  };
}

export function moduleToJourneyCard(module: CivicModule): HubContentItem {
  const stepCount = module.steps?.length ?? 0;
  return {
    id: module.id,
    slug: module.slug,
    title: module.title,
    excerpt: module.description ?? "",
    imageUrl: module.image_url ?? module.author?.image ?? null,
    category: module.badgeName ?? "Learning journey",
    readTime: stepCount ? `${stepCount} steps` : null,
    publishedAt: module.fiscal_year_label ?? null,
    authorName: module.author?.name ?? null,
    authorImage: module.author?.image ?? null,
    href: `/learn/modules/${module.slug}`,
  };
}

export function formatHubDate(value?: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
