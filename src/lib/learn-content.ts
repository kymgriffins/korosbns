import type { TriviaSetApi } from "@/lib/api-client";
import { wrapNotionContent } from "@/lib/api-client";

export type HubStory = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  gradient: string;
  icon: string;
  action: string;
};

export type HubArticle = {
  id: string;
  contentId?: string;
  title: string;
  readTime: string;
  snippet: string;
  body: string;
  body_html: string;
  category?: string;
  sourceLabel?: string;
  updatedAt?: string;
  heroImage?: string | null;
};

export type StoryFlowCard = Record<string, unknown>;

export function mapApiStory(item: Record<string, unknown>): {
  story: HubStory;
  flow: StoryFlowCard[];
} {
  const storyId = String(item.slug || item.id);
  let flowCards: StoryFlowCard[] = [];
  try {
    const body = item.body;
    if (body) {
      flowCards =
        typeof body === "string" ? (JSON.parse(body) as StoryFlowCard[]) : (body as StoryFlowCard[]);
    }
  } catch {
    flowCards = [];
  }
  const meta = (item.metadata || {}) as Record<string, string>;
  return {
    story: {
      id: storyId,
      title: String(item.title || "Story"),
      subtitle: String(item.summary || meta.subtitle || "Civic explainer story"),
      duration: meta.duration || "2m 00s",
      gradient: meta.gradient || "from-fuchsia-600 via-violet-600 to-indigo-600",
      icon: meta.icon || "🔥",
      action: meta.action || "Play Story",
    },
    flow: flowCards,
  };
}

export function mapApiArticle(item: Record<string, unknown>): HubArticle {
  const meta = (item.metadata || {}) as Record<string, string>;
  const bodyHtml = wrapNotionContent(String(item.body_html || ""));
  const plainLen = String(item.body || item.summary || "").length;
  const hero =
    meta.hero_image ||
    meta.image ||
    (typeof item.cover_image === "string" ? item.cover_image : null) ||
    null;
  return {
    id: String(item.slug || item.id),
    contentId: item.id != null ? String(item.id) : undefined,
    title: String(item.title || "Article"),
    readTime: meta.readTime || `${Math.ceil(plainLen / 1000) + 3} min read`,
    snippet: String(item.summary || meta.snippet || "Explore this BNSKE budget analysis article."),
    body: String(item.body || ""),
    body_html: bodyHtml,
    category: meta.category || String(item.category || "Article"),
    sourceLabel: meta.sourceLabel || meta.source || "BNSKE",
    updatedAt:
      typeof item.updated_at === "string"
        ? item.updated_at
        : typeof item.published_at === "string"
          ? item.published_at
          : undefined,
    heroImage: hero,
  };
}

export function mapStoriesJsonFallback(data: {
  stories: HubStory[];
  story_flows: Record<string, StoryFlowCard[]>;
}): { stories: HubStory[]; flows: Record<string, StoryFlowCard[]> } {
  return { stories: data.stories, flows: { ...data.story_flows, "budget-trivia": [] } };
}

/** Swipe/browse cards — no correct answers exposed. */
export function triviaToBrowseCards(sets: TriviaSetApi[]): StoryFlowCard[] {
  const cards: StoryFlowCard[] = [];
  for (const set of sets) {
    for (const q of set.questions || []) {
      const options = q.options || [];
      cards.push({
        id: `trivia-${set.id}-${q.id}`,
        title: set.title,
        subtitle: `Question ${q.order || cards.length + 1}`,
        emoji: "❓",
        bg: "from-green-700 via-emerald-700 to-teal-900",
        content: q.question_text,
        facts: options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`),
        browseOnly: true,
      });
    }
  }
  if (cards.length) {
    cards.push({
      id: "trivia-complete",
      title: "Trivia browsed! 🏆",
      subtitle: "Sign in to score your answers",
      emoji: "🥳",
      bg: "from-amber-500 to-orange-500",
      content:
        "You've previewed budget trivia questions. Sign in with an active membership to submit scored attempts.",
      prompt: true,
    });
  }
  return cards;
}

export function triviaToQuizQuestions(set: TriviaSetApi) {
  return (set.questions || []).map((q) => ({
    id: q.id,
    question: q.question_text,
    options: q.options || [],
    correct: q.correct_index ?? 0,
    explanation: q.explanation || "",
  }));
}
