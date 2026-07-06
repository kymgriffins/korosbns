import "@/styles/learn-immersive.css";
import { contentData } from "@/data/content";
import { redirect } from "next/navigation";
import type { TriviaSetApi } from "@/lib/api-client";
import { ImmersiveStandaloneQuiz } from "@/components/learn/immersive/immersive-standalone-quiz";

export default async function SlugQuizPage({
  params,
}: {
  params: Promise<{ slug: string; q: string }>;
}) {
  const { slug, q } = await params;
  let trivia: TriviaSetApi | null = null;
  try {
    trivia = (await contentData.trivia.fetchBySlug(slug)) as TriviaSetApi | null;
  } catch {
    trivia = null;
  }

  if (!trivia?.questions?.length) redirect("/learn");

  const questionNumber = Math.max(1, Math.min(parseInt(q, 10) || 1, trivia.questions.length));
  const sorted = [...trivia.questions].sort((a, b) => a.order - b.order);

  return (
    <ImmersiveStandaloneQuiz
      slug={slug}
      title={trivia.title}
      questions={sorted}
      questionNumber={questionNumber}
    />
  );
}
