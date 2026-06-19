import { citizenApi } from "@/lib/api-client";
import type { UserProfileApi, SocialLinkApi } from "@/lib/api-client";

export function updateProfile(body: Partial<UserProfileApi>) {
  return citizenApi.patchMe(body);
}

export function fetchNotifications(status?: string) {
  return citizenApi.getNotifications(status);
}

export function fetchBookmarks() {
  return citizenApi.getBookmarks();
}

export function toggleBookmark(contentType: string, contentId: string) {
  return citizenApi.toggleBookmark(contentType, contentId);
}

export function recordShare(body: {
  content_type: string;
  content_id: string;
  channel: string;
  target_url?: string;
}) {
  return citizenApi.recordShare(body);
}

export function fetchSocialLinks() {
  return citizenApi.getSocialLinks();
}

export function upsertSocialLink(body: SocialLinkApi) {
  return citizenApi.upsertSocialLink(body);
}

export function deleteSocialLink(platform: string) {
  return citizenApi.deleteSocialLink(platform);
}

export function submitTriviaAttempt(
  id: string,
  answers: Record<string, number>,
  leaderboardOptIn = false,
) {
  return citizenApi.submitTriviaAttempt(id, answers, leaderboardOptIn);
}

export function fetchTriviaLeaderboard(id: string) {
  return citizenApi.getTriviaLeaderboard(id);
}
