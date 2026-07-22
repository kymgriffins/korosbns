"use client";

import Link from "next/link";
import { Award } from "lucide-react";
import { ImmersiveChrome } from "./immersive-chrome";
import { useImmersiveModule } from "./immersive-module-provider";

export function ImmersiveMasteryScreen() {
  const { mod } = useImmersiveModule();

  return (
    <>
      <ImmersiveChrome backHref="/learn?tab=learn" title="Module complete" subtitle={mod.title} />
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="text-6xl mb-4">{mod.badge || "🎉"}</div>
        <h1 className="text-2xl font-semibold tracking-tight">{mod.title}</h1>
        <p className="mt-2 max-w-sm text-[15px] text-muted-foreground">
          You finished every step. Your progress is saved.
        </p>
        {mod.badgeName ? (
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-[13px] font-semibold text-emerald-700">
            <Award className="size-4" />
            {mod.badgeName} unlocked
          </span>
        ) : null}
        <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
          <Link
            href="/learn?tab=learn"
            className="immersive-primary-action flex items-center justify-center bg-primary text-primary-foreground"
          >
            Back to modules
          </Link>
          <Link
            href={`/learn/modules/${mod.slug}/read/1`}
            className="immersive-primary-action flex items-center justify-center border border-border bg-card"
          >
            Review module
          </Link>
        </div>
      </div>
    </>
  );
}
