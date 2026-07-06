import { redirect } from "next/navigation";
import { contentData } from "@/data/content";
import type { Metadata } from "next";
import { metaDescription, canonicalUrl } from "@/utils/metadata";

async function resolveContentSlug(slug: string) {
  try {
    const art = await contentData.articles.fetchBySlug(slug);
    if (art && Object.keys(art).length > 0) return { type: "article" as const, data: art };
  } catch {}
  try {
    const triv = await contentData.trivia.fetchBySlug(slug);
    if (triv && Object.keys(triv).length > 0) return { type: "trivia" as const, data: triv };
  } catch {}
  try {
    const story = await contentData.stories.fetchBySlug(slug);
    if (story) return { type: "story" as const, data: story };
  } catch {}
  return null;
}

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await props.params;
  const resolved = await resolveContentSlug(slug);
  const canonicalPath = `/learn/${slug}`;
  const canonical = canonicalUrl(canonicalPath);
  const ogImage = { url: "/logo.svg", width: 1200, height: 630 };

  if (resolved?.type === "article") {
    const artTitle = `${resolved.data.title as string} | Budget Ndio Story`;
    const artDesc =
      (resolved.data.summary as string) ||
      `In-depth explainer on Kenya's ${slug.replace(/-/g, " ")}.`;
    return {
      title: artTitle,
      description: metaDescription(artDesc),
      alternates: { canonical },
      openGraph: { title: artTitle, description: artDesc, url: canonical, type: "article", images: [ogImage] },
    };
  }

  if (resolved?.type === "trivia") {
    const trivTitle = `${resolved.data.title as string} | Budget Trivia | Budget Ndio Story`;
    const trivDesc = `Interactive trivia on Kenya's budget and public finance.`;
    return {
      title: trivTitle,
      description: metaDescription(trivDesc),
      alternates: { canonical },
      openGraph: { title: trivTitle, description: trivDesc, url: canonical, type: "article", images: [ogImage] },
    };
  }

  const fallbackTitle = `Learn: ${slug.replace(/-/g, " ")} | Budget Ndio Story`;
  return {
    title: fallbackTitle,
    description: metaDescription(`Budget literacy content on ${slug.replace(/-/g, " ")}.`),
    alternates: { canonical },
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function UnifiedReaderRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resolved = await resolveContentSlug(slug);

  if (resolved?.type === "article") redirect(`/learn/${slug}/read`);
  if (resolved?.type === "trivia") redirect(`/learn/${slug}/quiz/1`);
  if (resolved?.type === "story") redirect(`/learn/${slug}/story/1`);
  redirect("/learn");
}
