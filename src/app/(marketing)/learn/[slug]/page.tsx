import type { Metadata } from "next";
import { citizenApi } from "@/lib/api-client";
import { metaDescription } from "@/utils/metadata";
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
  try {
    const artData = await citizenApi.getArticle(slug);
    if (artData && artData.title) {
      return {
        title: `${artData.title as string} | Budget Ndio Story`,
        description: metaDescription(
          (artData.summary as string) || `In-depth explainer on Kenya's ${slug.replace(/-/g, " ")} covering budget, Finance Bill, and fiscal policy.`
        ),
        alternates: { canonical: `/learn/${slug}` },
        openGraph: {
          title: `${artData.title as string} | Budget Ndio Story`,
          description: (artData.summary as string) || `Kenya budget explainer: ${slug.replace(/-/g, " ")}`,
          url: `/learn/${slug}`,
        },
      };
    }
  } catch {
    /* fallback */
  }
  try {
    const trivData = await citizenApi.getTrivia(slug);
    if (trivData && trivData.title) {
      return {
        title: `${trivData.title as string} | Budget Trivia | Budget Ndio Story`,
        description: metaDescription(`Interactive trivia on Kenya's budget and Finance Bill. Test your knowledge of public finance.`),
        alternates: { canonical: `/learn/${slug}` },
      };
    }
  } catch {
    /* fallback */
  }
  return {
    title: `Learn: ${slug.replace(/-/g, " ")} | Budget Ndio Story`,
    description: metaDescription(`Budget literacy content on ${slug.replace(/-/g, " ")} — Kenya's Finance Bill, fiscal policy, and public finance explained.`),
    alternates: { canonical: `/learn/${slug}` },
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

  // 1. Try Article
  try {
    const artData = await citizenApi.getArticle(slug);
    if (artData && artData.id) {
      initialArticle = artData;
      initialMode = "article";
    }
  } catch {
    // Fall through
  }

  // 2. Try Trivia
  if (initialMode === "loading") {
    try {
      const trivData = await citizenApi.getTrivia(slug);
      if (trivData && trivData.id) {
        initialTrivia = trivData;
        initialMode = "trivia";
      }
    } catch {
      // Fall through
    }
  }

  // 3. Try Story
  if (initialMode === "loading") {
    try {
      const storiesRes = await citizenApi.getStories();
      const foundStory = storiesRes.results.find((s) => s.id === slug);
      if (foundStory) {
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
      }
    } catch {
      // Fall through
    }
  }

  if (initialMode === "loading") {
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
