"use client";

import { useQuery } from "@tanstack/react-query";
import { learnHubApi, type LearningStageApi } from "@/lib/learn-hub";

export type StageData = {
  id: string;
  order: number;
  title: string;
  badge: string;
  badgeName: string;
  documentName: string;
  archive: string;
  link: string;
  status: string;
  credits: string;
  description: string;
  expectations: string[];
  steps: StepData[];
};

export type StepData = {
  id: string;
  title: string;
  youtubeId: string;
  audioUrl: string;
  transcript: string;
  text: string;
  trivia: Array<{
    type: "multiple-choice" | "reflection";
    question: string;
    options?: string[];
    answer?: number;
    explanation?: string;
  }>;
  takeaways: Array<{
    type: string;
    title: string;
    text: string;
  }>;
};

function extractYoutubeId(url: string): string {
  if (!url) return "";
  const match = url.match(/(?:v=|\/)([\w-]{11})/);
  return match ? match[1] : url;
}

function mapApiStage(api: LearningStageApi): StageData {
  return {
    id: api.slug || api.id,
    order: api.order,
    title: api.title,
    badge: api.badge_icon || "📘",
    badgeName: api.badge_name || "",
    documentName: api.document_name || "",
    archive: api.archive || "",
    link: api.link || "",
    status: api.status || "Published",
    credits: api.credits || "",
    description: api.description || "",
    expectations: api.expectations || [],
    steps: (api.steps || []).map((s) => ({
      id: s.id,
      title: s.title,
      youtubeId: extractYoutubeId(s.youtube_url),
      audioUrl: s.audio_url || "",
      transcript: s.transcript || "",
      text: s.text || "",
      trivia: (s.trivia || []).map((t) => ({
        type: t.type as "multiple-choice" | "reflection",
        question: t.question,
        options: t.options || [],
        answer: t.answer,
        explanation: t.explanation || "",
      })),
      takeaways: (s.takeaways || []).map((t) => ({
        type: t.type || "info",
        title: t.title || "",
        text: t.text || "",
      })),
    })),
  };
}

export function useStages() {
  return useQuery({
    queryKey: ["learn", "stages"],
    queryFn: async () => {
      const resp = await learnHubApi.stages();
      return (resp.results || []).map(mapApiStage);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useStage(slug: string) {
  return useQuery({
    queryKey: ["learn", "stage", slug],
    queryFn: async () => {
      const api = await learnHubApi.stage(slug);
      return mapApiStage(api);
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 60,
  });
}
