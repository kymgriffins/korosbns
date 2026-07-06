"use client";

import { useParams } from "next/navigation";
import { ImmersiveReadScreen } from "@/components/learn/immersive/immersive-read-screen";

export default function ModuleReadPage() {
  const params = useParams();
  const stepNumber = Math.max(1, parseInt(String(params.step), 10) || 1);
  return <ImmersiveReadScreen stepNumber={stepNumber} />;
}
