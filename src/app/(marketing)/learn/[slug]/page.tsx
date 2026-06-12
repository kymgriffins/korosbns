import type { Metadata } from "next";
import { metaDescription, canonicalUrl } from "@/utils/metadata";
import { fetchArticleBySlug, fetchTrivia, resolveContentSlug } from "@/lib/services/content-service";
import UnifiedReaderClientPage from "./client-page";

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
export const revalidate = 3600; // ISR revalidate every hour
export const fallback = 'blocking';

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const resolved = await resolveContentSlug(slug);

  if (resolved?.type === "article") {
    const artData = resolved.data;
    return {
      title: `${artData.title as string} | Budget Ndio Story`,
      description: metaDescription(
        (artData.summary as string) || `In-depth explainer on Kenya's ${slug.replace(/-/g, " ")} covering budget, Finance Bill, and fiscal policy.`
      ),
      alternates: { canonical: canonicalUrl(`/learn/${slug}`) },
      openGraph: {
        title: `${artData.title as string} | Budget Ndio Story`,
        description: (artData.summary as string) || `Kenya budget explainer: ${slug.replace(/-/g, " ")}`,
        url: canonicalUrl(`/learn/${slug}`),
      },
    };
  }

  if (resolved?.type === "trivia") {
    const trivData = resolved.data;
    return {
      title: `${trivData.title as string} | Budget Trivia | Budget Ndio Story`,
      description: metaDescription(`Interactive trivia on Kenya's budget and Finance Bill. Test your knowledge of public finance.`),
      alternates: { canonical: canonicalUrl(`/learn/${slug}`) },
    };
  }

  return {
    title: `Learn: ${slug.replace(/-/g, " ")} | Budget Ndio Story`,
    description: metaDescription(`Budget literacy content on ${slug.replace(/-/g, " ")} — Kenya's Finance Bill, fiscal policy, and public finance explained.`),
    alternates: { canonical: canonicalUrl(`/learn/${slug}`) },
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

  let initialMode: "loading" | "error" | "article" | "story" | "trivia" = "loading";
  let initialArticle: any = null;
  let initialTrivia: any = null;
  let initialStory: any = null;

  const resolved = await resolveContentSlug(slug);

  if (resolved?.type === "article") {
    initialArticle = resolved.data;
    initialMode = "article";
  } else if (resolved?.type === "trivia") {
    initialTrivia = resolved.data;
    initialMode = "trivia";
  } else if (resolved?.type === "story") {
    const foundStory = resolved.data;
    let parsedCards: StoryCard[] = [];
    try {
      parsedCards = typeof foundStory.body === "string" 
        ? JSON.parse(foundStory.body) 
        : (foundStory.body as StoryCard[] || []);
    } catch {
      parsedCards = [];
    }

    const metadata = (foundStory.metadata as Record<string, string>) || {};
    
    initialStory = {
      id: foundStory.id,
      title: foundStory.title,
      subtitle: foundStory.summary,
      icon: metadata.icon || "📖",
      duration: metadata.duration || "2 min",
      cards: parsedCards
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
