import "@/styles/learn-immersive.css";
import { contentData } from "@/data/content";
import { redirect } from "next/navigation";
import { ImmersiveArticleReader, type ImmersiveArticleData } from "@/components/learn/immersive/immersive-article-reader";

function normalizeArticle(raw: Record<string, unknown>): ImmersiveArticleData {
  const meta = (raw.metadata ?? {}) as Record<string, unknown>;
  const readMinutes = meta.read_minutes ?? raw.read_minutes;
  return {
    id: String(raw.id ?? ""),
    title: String(raw.title ?? ""),
    snippet: String(raw.snippet ?? raw.summary ?? ""),
    body: raw.body as string | undefined,
    body_html: raw.body_html as string | undefined,
    heroImage: (raw.heroImage ?? meta.hero_image ?? raw.cover_image_url ?? raw.image_url) as string | undefined,
    category: (raw.category ?? meta.category) as string | undefined,
    readTime: readMinutes ? `${readMinutes} min read` : undefined,
    publishedAt: (raw.published_at ?? raw.publishedAt) as string | undefined,
    author: (raw.author ?? null) as ImmersiveArticleData["author"],
    learningContext: (raw.learning_context ?? raw.learningContext) as ImmersiveArticleData["learningContext"],
  };
}

export default async function ArticleReadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let raw: Record<string, unknown> | null = null;
  try {
    const data = await contentData.articles.fetchBySlug(slug);
    if (data && Object.keys(data).length > 0) raw = data as Record<string, unknown>;
  } catch {
    raw = null;
  }

  if (!raw) redirect("/learn");

  return <ImmersiveArticleReader slug={slug} article={normalizeArticle(raw)} />;
}
