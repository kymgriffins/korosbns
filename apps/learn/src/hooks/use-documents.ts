import { useQuery } from "@tanstack/react-query";
import { fetchDocumentsFromAPI, type FetchDocumentsResult } from "@/constants/documents";

// The document repository is large and the underlying fetch recursively crawls
// subfolders, so refetching from scratch on every visit is slow. Cache the result
// in React Query with a long stale window so navigating away and back is instant.
export function useLearnDocuments() {
  return useQuery<FetchDocumentsResult>({
    queryKey: ["learn-documents"],
    queryFn: () => fetchDocumentsFromAPI(),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
