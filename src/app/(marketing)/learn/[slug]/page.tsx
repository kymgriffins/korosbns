import { citizenApi } from "@/lib/api-client";
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

export async function generateStaticParams() {
  const slugs: { slug: string }[] = [];

  // Fetch articles
  try {
    const articlesRes = await citizenApi.getArticles();
    if (articlesRes && Array.isArray(articlesRes.results)) {
      articlesRes.results.forEach((item: any) => {
        if (item.slug || item.id) {
          slugs.push({ slug: String(item.slug || item.id) });
        }
      });
    }
  } catch (err) {
    console.error("Failed to fetch articles for static params", err);
  }

  // Fetch trivia
  try {
    const triviaRes = await citizenApi.getTriviaList();
    if (triviaRes && Array.isArray(triviaRes.results)) {
      triviaRes.results.forEach((item: any) => {
        if (item.id) {
          slugs.push({ slug: String(item.id) });
        }
      });
    }
  } catch (err) {
    console.error("Failed to fetch trivia for static params", err);
  }

  // Fetch stories
  try {
    const storiesRes = await citizenApi.getStories();
    if (storiesRes && Array.isArray(storiesRes.results)) {
      storiesRes.results.forEach((item: any) => {
        if (item.id) {
          slugs.push({ slug: String(item.id) });
        }
      });
    }
  } catch (err) {
    console.error("Failed to fetch stories for static params", err);
  }

  return slugs;
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
