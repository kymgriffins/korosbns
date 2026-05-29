"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchGamificationMe, type GamificationState } from "@/lib/gamification";
import { learnHubApi } from "@/lib/learn-hub";
import type { CivicModule } from "@/types/learn";
import { useAuth } from "@/contexts/auth-context";

export type LearnTab = "home" | "learn" | "alerts" | "profile";

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
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
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
}

const LearnContext = createContext<LearnContextType | undefined>(undefined);

export function LearnProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<LearnTab>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [gamification, setGamification] = useState<GamificationState | null>(null);
  const [activeLesson, setActiveLesson] = useState<ActiveLesson | null>(null);
  const [civicModules, setCivicModules] = useState<CivicModule[]>([]);
  const [modulesLoading, setModulesLoading] = useState(true);

  const totalStages = civicModules.length;

  const refreshGamification = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const state = await fetchGamificationMe();
      if (state) setGamification(state);
    } catch (err) {
      console.error("Failed to fetch gamification state", err);
    }
  }, [isLoggedIn]);

  const fetchCivicModules = useCallback(async () => {
    setModulesLoading(true);
    try {
      const data = await learnHubApi.stages();
      if (data?.results?.length) {
        setCivicModules(data.results);
      }
    } catch (err) {
      console.error("Failed to fetch civic modules", err);
    } finally {
      setModulesLoading(false);
    }
  }, []);

  const updateCurrentStep = useCallback((step: number) => {
    setActiveLesson((prev) => prev ? { ...prev, currentStep: step } : prev);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      void refreshGamification();
    } else {
      setGamification(null);
    }
  }, [isLoggedIn, refreshGamification]);

  useEffect(() => {
    void fetchCivicModules();
  }, [fetchCivicModules]);

  return (
    <LearnContext.Provider
      value={{
        activeTab,
        setActiveTab,
        sidebarOpen,
        setSidebarOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
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
