"use client";

import { useParams } from "next/navigation";
import { ImmersiveWatchScreen } from "@/components/learn/immersive/immersive-watch-screen";

export default function ModuleWatchPage() {
  const params = useParams();
  const stepNumber = Math.max(1, parseInt(String(params.step), 10) || 1);
  return <ImmersiveWatchScreen stepNumber={stepNumber} />;
}
