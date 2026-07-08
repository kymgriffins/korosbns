import type { Metadata } from "next";
import { metaDescription, canonicalUrl } from "@/utils/metadata";
import type { TriviaSetApi } from "@/lib/api-client";
import { resolveBudgetHubContentById } from "@/lib/budget-hub-content-resolver";
import UnifiedReaderClientPage from "../../[slug]/client-page";

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

export const dynamicParams = true;
export const revalidate = 3600;
export const fallback = "blocking";

export async function generateMetadata(
  props: { params: Promise<{ contentId: string }> },
): Promise<Metadata> {
  const { contentId } = await props.params;
  const resolved = await resolveBudgetHubContentById(contentId);

  const canonical = canonicalUrl(`/learn/content/${contentId}`);
  const ogImage = { url: "/logo.svg", width: 1200, height: 630 };

  if (resolved?.type === "article") {
    const artData = resolved.data;
    const title = `${artData.title as string} | Budget Hub | Budget Ndio Story`;
    const desc =
      (artData.summary as string) ||
      "Budget Hub editorial explainer on Kenya's public finance.";
    return {
      title,
      description: metaDescription(desc),
      alternates: { canonical },
      openGraph: { title, description: desc, url: canonical, type: "article", images: [ogImage] },
      twitter: { card: "summary_large_image", title, description: desc, images: ["/logo.svg"] },
    };
  }

  const fallbackTitle = `Budget Hub Content | Budget Ndio Story`;
  const fallbackDesc =
    "Budget literacy content on Kenya's Finance Bill, fiscal policy, and public finance explained.";
  return {
    title: fallbackTitle,
    description: metaDescription(fallbackDesc),
    alternates: { canonical },
    openGraph: { title: fallbackTitle, description: fallbackDesc, url: canonical, type: "article", images: [ogImage] },
    twitter: { card: "summary_large_image", title: fallbackTitle, description: fallbackDesc, images: ["/logo.svg"] },
  };
}

export default async function BudgetHubContentByIdPage(
  props: { params: Promise<{ contentId: string }> },
) {
  const { contentId } = await props.params;
  const resolved = await resolveBudgetHubContentById(contentId);

  let initialMode: "loading" | "error" | "article" | "story" | "trivia" = "loading";
  let initialArticle: Record<string, unknown> | null = null;
  let initialTrivia: TriviaSetApi | null = null;
  let initialStory: StoryData | null = null;

  if (resolved?.type === "article") {
    initialArticle = resolved.data;
    initialMode = "article";
  } else if (resolved?.type === "trivia") {
    initialTrivia = resolved.data as TriviaSetApi;
    initialMode = "trivia";
  } else if (resolved?.type === "story") {
    const foundStory = resolved.data as Record<string, unknown>;
    let parsedCards: StoryCard[] = [];
    try {
      const storyBody = foundStory.body;
      parsedCards = typeof storyBody === "string"
        ? JSON.parse(storyBody)
        : (storyBody as StoryCard[] || []);
    } catch {
      parsedCards = [];
    }

    const metadata = (foundStory.metadata as Record<string, string>) || {};

    initialStory = {
      id: String(foundStory.id ?? ""),
      title: String(foundStory.title ?? ""),
      subtitle: String(foundStory.summary ?? ""),
      icon: metadata.icon || "📖",
      duration: metadata.duration || "2 min",
      cards: parsedCards,
    };
    initialMode = "story";
  } else {
    initialMode = "error";
  }

  return (
    <UnifiedReaderClientPage
      initialMode={initialMode}
      initialArticle={initialArticle}
      initialTrivia={initialTrivia}
      initialStory={initialStory}
    />
  );
}
