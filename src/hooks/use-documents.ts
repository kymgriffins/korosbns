import { useQuery } from "@tanstack/react-query";
import { documentData, type FetchDocumentsResult } from "@/data/documents";

export function useLearnDocuments() {
  return useQuery<FetchDocumentsResult>({
    queryKey: ["learn-documents"],
    queryFn: () => documentData.fetch(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
