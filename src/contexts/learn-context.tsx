"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchGamificationMe, type GamificationState } from "@/lib/gamification";
import { learningData } from "@/data/learning";
import type { CivicModule } from "@/types/learn";
import { useAuth } from "@/contexts/auth-context";

export type LearnTab = "home" | "learn" | "alerts" | "documents" | "profile" | "forum";

export interface ActiveLesson {
  stageId: string;
  stageTitle: string;
  stageBadge: string;
  stageOrder: number;
  currentStep: number;
  totalSteps: number;
  completedStepIds: number[];
  stepTitles: { id: number; title: string }[];
}

interface LearnContextType {
  activeTab: LearnTab;
  setActiveTab: (tab: LearnTab) => void;
  rightDrawerOpen: boolean;
  setRightDrawerOpen: (open: boolean) => void;
  gamification: GamificationState | null;
  refreshGamification: () => Promise<void>;
  activeLesson: ActiveLesson | null;
  setActiveLesson: (lesson: ActiveLesson | null) => void;
  civicModules: CivicModule[];
  fetchCivicModules: () => Promise<void>;
  updateCurrentStep: (step: number) => void;
  totalStages: number;
  modulesLoading: boolean;
  modulesError: string | null;
  modulesCached: boolean;
  refreshModules: () => Promise<void>;
}

const LearnContext = createContext<LearnContextType | undefined>(undefined);

export function LearnProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<LearnTab>("home");
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [gamification, setGamification] = useState<GamificationState | null>(null);
  const [activeLesson, setActiveLesson] = useState<ActiveLesson | null>(null);
  const [civicModules, setCivicModules] = useState<CivicModule[]>([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [modulesError, setModulesError] = useState<string | null>(null);

  const totalStages = civicModules.length;
  const [modulesCached, setModulesCached] = useState(false);
  const [gamificationCached, setGamificationCached] = useState(false);

  const refreshGamification = useCallback(async (force = false) => {
    if (!isLoggedIn) return;
    if (!force && gamificationCached) return;
    try {
      const state = await fetchGamificationMe();
      if (state) {
        setGamification(state);
        setGamificationCached(true);
      }
    } catch {
      // gamification fetch failed silently
    }
  }, [isLoggedIn, gamificationCached]);

  const fetchCivicModules = useCallback(async (force = false) => {
    if (!force && modulesCached) return;
    setModulesLoading(true);
    setModulesError(null);
    try {
      const results = await learningData.modules.fetch();
      setCivicModules(results);
      setModulesCached(true);
    } catch (err) {
      setCivicModules([]);
      setModulesError(err instanceof Error ? err.message : "Failed to load learning modules");
    } finally {
      setModulesLoading(false);
    }
  }, [modulesCached]);

  const refreshModules = useCallback(async () => {
    setModulesCached(false);
    await fetchCivicModules(true);
  }, [fetchCivicModules]);

  const updateCurrentStep = useCallback((step: number) => {
    setActiveLesson((prev) => prev ? { ...prev, currentStep: step } : prev);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      void refreshGamification();
    } else {
      setGamification(null);
      setGamificationCached(false);
    }
  }, [isLoggedIn, refreshGamification]);

  useEffect(() => {
    void fetchCivicModules(true);
  }, [isLoggedIn, fetchCivicModules]);

  return (
    <LearnContext.Provider
      value={{
        activeTab,
        setActiveTab,
        rightDrawerOpen,
        setRightDrawerOpen,
        gamification,
        refreshGamification,
        activeLesson,
        setActiveLesson,
        civicModules,
        fetchCivicModules,
        updateCurrentStep,
        totalStages,
        modulesLoading,
        modulesError,
        modulesCached,
        refreshModules,
      }}
    >
      {children}
    </LearnContext.Provider>
  );
}

export function useLearn() {
  const context = useContext(LearnContext);
  if (context === undefined) {
    throw new Error("useLearn must be used within a LearnProvider");
  }
  return context;
}
