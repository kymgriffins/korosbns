import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { citizenApi } from "@/lib/api-client";
import type { UserProfileApi, SocialLinkApi } from "@/lib/api-client";

export function useNotifications(status?: string) {
  return useQuery({
    queryKey: ["notifications", status],
    queryFn: () => citizenApi.getNotifications(status),
  });
}

export function useBookmarks() {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => citizenApi.getBookmarks(),
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      contentType,
      contentId,
    }: {
      contentType: string;
      contentId: string;
    }) => citizenApi.toggleBookmark(contentType, contentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
  });
}

export function useRecordShare() {
  return useMutation({
    mutationFn: (body: {
      content_type: string;
      content_id: string;
      channel: string;
      target_url?: string;
    }) => citizenApi.recordShare(body),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Partial<UserProfileApi>) => citizenApi.patchMe(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}

export function useSocialLinks() {
  return useQuery({
    queryKey: ["social-links"],
    queryFn: () => citizenApi.getSocialLinks(),
  });
}

export function useUpsertSocialLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: SocialLinkApi) => citizenApi.upsertSocialLink(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
    },
  });
}

export function useDeleteSocialLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (platform: string) => citizenApi.deleteSocialLink(platform),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-links"] });
    },
  });
}

export function useSubmitTriviaAttempt() {
  return useMutation({
    mutationFn: ({
      id,
      answers,
      leaderboardOptIn,
    }: {
      id: string;
      answers: Record<string, number>;
      leaderboardOptIn?: boolean;
    }) => citizenApi.submitTriviaAttempt(id, answers, leaderboardOptIn),
  });
}
