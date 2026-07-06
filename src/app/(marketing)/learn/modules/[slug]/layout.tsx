"use client";

import "@/styles/learn-immersive.css";
import { ImmersiveModuleProvider } from "@/components/learn/immersive/immersive-module-provider";
import { useParams } from "next/navigation";

export default function ModuleImmersiveLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const slug = params.slug as string;
  return <ImmersiveModuleProvider slug={slug}>{children}</ImmersiveModuleProvider>;
}
