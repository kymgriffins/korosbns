import { useQuery } from "@tanstack/react-query";
import { contentData } from "@/data/content";

export function useQuests() {
  return useQuery({
    queryKey: ["quests"],
    queryFn: () => contentData.quests.fetch(),
    staleTime: 60_000,
  });
}

export function useDailyQuests() {
  return useQuery({
    queryKey: ["quests", "daily"],
    queryFn: async () => {
      const all = await contentData.quests.fetch();
      return all.filter((q) => (q as any).daily !== false).slice(0, 3);
    },
    staleTime: 60_000,
  });
}
