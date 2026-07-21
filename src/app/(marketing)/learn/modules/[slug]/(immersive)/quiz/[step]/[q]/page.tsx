"use client";

import { useParams } from "next/navigation";
import { ImmersiveQuizScreen } from "@/components/learn/immersive/immersive-quiz-screen";

export default function ModuleQuizPage() {
  const params = useParams();
  const stepNumber = Math.max(1, parseInt(String(params.step), 10) || 1);
  const questionNumber = Math.max(1, parseInt(String(params.q), 10) || 1);
  return <ImmersiveQuizScreen stepNumber={stepNumber} questionNumber={questionNumber} />;
}
