import type { BadgeData, CertificateData, ProgressRow } from "./learn";

export type GamificationState = {
  points: number;
  level: number;
  streak_days: number;
  badges: BadgeData[];
  certificates: CertificateData[];
  recent_progress: ProgressRow[];
  total_progress: number;
};

export type LeaderboardEntry = {
  rank: number;
  name: string | null;
  points: number;
  level: number;
  streak_days: number;
  badge_count: number;
};

export type ChallengeData = {
  id: string;
  title: string;
  description?: string;
  challenge_type: string;
  status?: string;
  points_reward: number;
  badge_reward_slug?: string | null;
  badge_reward_name?: string | null;
  is_completed?: boolean;
  starts_at: string;
  ends_at: string;
};

export type ReferralData = {
  code: string;
  share_url: string;
  referrals_count: number;
};

export type GamificationEventPayload = {
  event_type: string;
  points?: number;
  object_id?: string;
  idempotency_key: string;
  metadata?: Record<string, unknown>;
};
