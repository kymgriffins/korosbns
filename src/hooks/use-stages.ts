"use client";

import { useCallback, useEffect, useState } from "react";
import { STAGES_DATA, type StageData } from "@/constants/stages-data";
import { mapCivicModulesToStages, mergeStagesWithFallback } from "@/lib/civic-stages";
import { USE_LOCAL_CIVIC_FALLBACK } from "@/lib/civic-fallback";
import { learnHubApi } from "@/lib/learn-hub";

export function useStages() {
  const [stages, setStages] = useState<StageData[]>(USE_LOCAL_CIVIC_FALLBACK ? STAGES_DATA : []);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"api" | "local" | "empty">("local");
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await learnHubApi.civicModules();
      const mapped = mapCivicModulesToStages(response.results ?? []);
      setStages(mergeStagesWithFallback(mapped, USE_LOCAL_CIVIC_FALLBACK ? STAGES_DATA : []));
      setSource(mapped.length > 0 ? "api" : USE_LOCAL_CIVIC_FALLBACK ? "local" : "empty");
    } catch (err) {
      setStages(USE_LOCAL_CIVIC_FALLBACK ? STAGES_DATA : []);
      setSource(USE_LOCAL_CIVIC_FALLBACK ? "local" : "empty");
      setError(err instanceof Error ? err.message : "Failed to load civic modules");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { stages, loading, source, error, refresh };
}
