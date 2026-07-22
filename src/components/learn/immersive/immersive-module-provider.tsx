"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { learningData } from "@/data/learning";
import { readProgress } from "@/lib/module-progress";
import type { CivicModule } from "@/types/learn";
import { Loader2 } from "lucide-react";

type ImmersiveModuleContextValue = {
  mod: CivicModule;
  completedOrders: Set<number>;
  refreshProgress: () => void;
};

const ImmersiveModuleContext = createContext<ImmersiveModuleContextValue | null>(null);

export function useImmersiveModule() {
  const ctx = useContext(ImmersiveModuleContext);
  if (!ctx) throw new Error("useImmersiveModule must be used within ImmersiveModuleProvider");
  return ctx;
}

export function ImmersiveModuleProvider({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const [mod, setMod] = useState<CivicModule | null>(null);
  const [completedOrders, setCompletedOrders] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const refreshProgress = () => {
    if (!mod) return;
    const p = readProgress(mod.slug, mod.order);
    const completed = new Set<number>();
    for (const step of mod.steps) {
      if (p.stepsCompleted[step.order]) completed.add(step.order);
    }
    setCompletedOrders(completed);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    learningData.modules
      .fetchBySlug(slug)
      .then((res) => {
        if (cancelled) return;
        if (!res) {
          setError(true);
          return;
        }
        setMod(res);
        const p = readProgress(res.slug, res.order);
        const completed = new Set<number>();
        for (const step of res.steps) {
          if (p.stepsCompleted[step.order]) completed.add(step.order);
        }
        setCompletedOrders(completed);
      })
      .catch(() => setError(true))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="learn-immersive fixed inset-0 z-50 flex items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !mod) {
    return (
      <div className="learn-immersive fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <p className="text-sm font-semibold">Module not found</p>
        <a href="/learn" className="text-sm text-primary font-medium">Back to Learn Hub</a>
      </div>
    );
  }

  return (
    <ImmersiveModuleContext.Provider value={{ mod, completedOrders, refreshProgress }}>
      <div className="learn-immersive fixed inset-0 z-50 flex flex-col overflow-hidden bg-background">
        {children}
      </div>
    </ImmersiveModuleContext.Provider>
  );
}
