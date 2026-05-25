"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchGamificationMe, type GamificationState } from "@/lib/gamification";
import { useAuth } from "@/contexts/auth-context";

export type LearnTab = "home" | "learn" | "alerts" | "profile";

interface ActiveModule {
  id: string;
  title: string;
  category?: string;
  progress: number;
}

export interface ActiveLesson {
  stageId: number;
  stageTitle: string;
  stageBadge: string;
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
  activeModule: ActiveModule | null;
  setActiveModule: (module: ActiveModule | null) => void;
  activeLesson: ActiveLesson | null;
  setActiveLesson: (lesson: ActiveLesson | null) => void;
}

const LearnContext = createContext<LearnContextType | undefined>(undefined);

export function LearnProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<LearnTab>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [gamification, setGamification] = useState<GamificationState | null>(null);
  const [activeModule, setActiveModule] = useState<ActiveModule | null>(null);
  const [activeLesson, setActiveLesson] = useState<ActiveLesson | null>(null);

  const refreshGamification = async () => {
    if (!isLoggedIn) return;
    try {
      const state = await fetchGamificationMe();
      if (state) setGamification(state);
    } catch (err) {
      console.error("Failed to fetch gamification state", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      void refreshGamification();
      setActiveModule({
        id: "national-estimates-2024-25",
        title: "National Estimates (2024/25)",
        category: "Budget Estimates",
        progress: 40,
      });
    } else {
      setGamification(null);
      setActiveModule(null);
    }
  }, [isLoggedIn]);

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
        activeModule,
        setActiveModule,
        activeLesson,
        setActiveLesson,
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
