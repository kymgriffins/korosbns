"use client";

import { useParams } from "next/navigation";
import { LearnHubReader } from "@/components/learn-hub/LearnHubReader";
import type { TriviaSetApi } from "@/lib/api-client";

type ReaderMode = "loading" | "error" | "article" | "story" | "trivia";

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

interface StoryData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  duration: string;
  cards: StoryCard[];
}

/** Route adapter (same slug) — delegates to the new learn-hub reader. */
export default function UnifiedReaderClientPage({
  initialMode = "loading",
  initialArticle = null,
  initialTrivia = null,
  initialStory = null,
}: {
  initialMode?: ReaderMode;
  initialArticle?: Record<string, unknown> | null;
  initialTrivia?: TriviaSetApi | null;
  initialStory?: StoryData | null;
}) {
  const params = useParams();
  const raw = params.slug;
  const slug = typeof raw === "string" ? raw : Array.isArray(raw) ? (raw[0] ?? "") : "";

  return (
    <LearnHubReader
      slug={slug}
      initialMode={initialMode}
      initialArticle={initialArticle}
      initialTrivia={initialTrivia}
      initialStory={initialStory}
    />
  );
}
