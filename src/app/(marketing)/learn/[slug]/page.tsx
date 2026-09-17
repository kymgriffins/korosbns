import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { metaDescription, canonicalUrl } from "@/utils/metadata";
import type { TriviaSetApi } from "@/lib/api-client";
import { contentData } from "@/data/content";
import featuredFallback from "@/data/fallbacks/featured-projects.json";
import civicModulesFallback from "@/data/fallbacks/civic-modules.json";
import UnifiedReaderClientPage from "./client-page";

interface StoryData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  duration: string;
  cards: StoryCard[];
}

interface StoryCard {
  emoji?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  hook?: string;
  bg?: string;
  tinyLogo?: boolean;
  stat?: { value: string; label: string };
  note?: string;
  facts?: string[];
  pillars?: { emoji: string; title: string }[];
  risks?: { title: string; desc: string }[];
  services?: string[];
}

async function resolveContentSlug(slug: string) {
  try {
    const artData = await contentData.articles.fetchBySlug(slug);
    if (artData && Object.keys(artData).length > 0) return { type: "article" as const, data: artData };
  } catch {}
  try {
    const trivData = await contentData.trivia.fetchBySlug(slug);
    if (trivData && Object.keys(trivData).length > 0) return { type: "trivia" as const, data: trivData };
  } catch {}
  try {
    const storyData = await contentData.stories.fetchBySlug(slug);
    if (storyData) return { type: "story" as const, data: storyData };
  } catch {}
  return null;
}

export const dynamicParams = true;
export const revalidate = 3600; // ISR revalidate every hour

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const resolved = await resolveContentSlug(slug);

  const canonicalPath = `/learn/${slug}`;
  const canonical = canonicalUrl(canonicalPath);
  const ogImage = { url: "/logo.svg", width: 1200, height: 630 };

  if (resolved?.type === "article") {
    const artData = resolved.data;
    const artTitle = `${artData.title as string} | Budget Ndio Story`;
    const artDesc = (artData.summary as string) || `In-depth explainer on Kenya's ${slug.replace(/-/g, " ")} covering budget, Finance Bill, and fiscal policy.`;
    return {
      title: artTitle,
      description: metaDescription(artDesc),
      alternates: { canonical },
      openGraph: {
        title: artTitle,
        description: artDesc,
        url: canonical,
        type: "article",
        images: [ogImage],
      },
      twitter: {
        card: "summary_large_image",
        title: artTitle,
        description: artDesc,
        images: ["/logo.svg"],
      },
    };
  }

  if (resolved?.type === "trivia") {
    const trivData = resolved.data;
    const trivTitle = `${trivData.title as string} | Budget Trivia | Budget Ndio Story`;
    const trivDesc = `Interactive trivia on Kenya's budget and Finance Bill. Test your knowledge of public finance.`;
    return {
      title: trivTitle,
      description: metaDescription(trivDesc),
      alternates: { canonical },
      openGraph: {
        title: trivTitle,
        description: trivDesc,
        url: canonical,
        type: "article",
        images: [ogImage],
      },
      twitter: {
        card: "summary_large_image",
        title: trivTitle,
        description: trivDesc,
        images: ["/logo.svg"],
      },
    };
  }

  const fallbackTitle = `Learn: ${slug.replace(/-/g, " ")} | Budget Ndio Story`;
  const fallbackDesc = `Budget literacy content on ${slug.replace(/-/g, " ")} — Kenya's Finance Bill, fiscal policy, and public finance explained.`;
  return {
    title: fallbackTitle,
    description: metaDescription(fallbackDesc),
    alternates: { canonical },
    openGraph: {
      title: fallbackTitle,
      description: fallbackDesc,
      url: canonical,
      type: "article",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fallbackTitle,
      description: fallbackDesc,
      images: ["/logo.svg"],
    },
  };
}

export async function generateStaticParams() {
  // Fetch from Django or return empty for fallback: 'blocking'
  return []; 
}

export default async function UnifiedReaderPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;

  const norm = slug.toLowerCase().trim();
  const isProject =
    (featuredFallback.results || []).some(
      (p) =>
        (p.id || "").toLowerCase() === norm ||
        (p.slug || "").toLowerCase() === norm,
    ) ||
    (civicModulesFallback.results || []).some(
      (m) =>
        (m.id || "").toLowerCase() === norm ||
        (m.slug || "").toLowerCase() === norm,
    );

  if (isProject) {
    redirect(`/projects/${slug}`);
  }

  redirect("/projects");
}
