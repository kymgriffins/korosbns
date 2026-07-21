"use client";

import { useParams } from "next/navigation";
import { ImmersiveModuleProvider } from "@/components/learn/immersive/immersive-module-provider";

export default function ImmersiveModuleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const slug = String(params.slug ?? "");
  return <ImmersiveModuleProvider slug={slug}>{children}</ImmersiveModuleProvider>;
}
