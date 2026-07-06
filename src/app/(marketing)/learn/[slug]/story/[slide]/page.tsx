import "@/styles/learn-immersive.css";
import { contentData } from "@/data/content";
import { redirect } from "next/navigation";
import { ImmersiveStorySlide, type StoryCardData } from "@/components/learn/immersive/immersive-story-slide";

export default async function StorySlidePage({
  params,
}: {
  params: Promise<{ slug: string; slide: string }>;
}) {
  const { slug, slide } = await params;
  let storyRaw: Record<string, unknown> | null = null;
  try {
    storyRaw = (await contentData.stories.fetchBySlug(slug)) as Record<string, unknown> | null;
  } catch {
    storyRaw = null;
  }

  if (!storyRaw) redirect("/learn");

  let cards: StoryCardData[] = [];
  try {
    cards =
      typeof storyRaw.body === "string"
        ? JSON.parse(storyRaw.body)
        : ((storyRaw.body as StoryCardData[]) ?? []);
  } catch {
    cards = [];
  }

  if (!cards.length) redirect("/learn");

  const slideNumber = Math.max(1, Math.min(parseInt(slide, 10) || 1, cards.length));
  const metadata = (storyRaw.metadata as Record<string, string>) ?? {};

  return (
    <ImmersiveStorySlide
      slug={slug}
      storyTitle={String(storyRaw.title ?? "Story")}
      storyIcon={metadata.icon || "📖"}
      cards={cards}
      slideNumber={slideNumber}
    />
  );
}
