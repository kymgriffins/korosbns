export type CampaignStatus = "upcoming" | "active" | "completed";

export type CampaignType = "weekly-buzzword" | "story-challenge" | "creator-spotlight";

export interface CampaignReward {
  id: string;
  label: string;
  description: string;
  tier: "feature" | "standard" | "grand";
}

export interface CampaignRules {
  eligibility: string[];
  participationSteps: string[];
  disallowedContent: string[];
}

export interface CampaignMetrics {
  views: number;
  submissions: number;
  shares: number;
  conversionRate: number;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: CampaignType;
  buzzword?: string;
  hashtag: string;
  status: CampaignStatus;
  startsAt: string;
  endsAt: string;
  rewards: CampaignReward[];
  rules: CampaignRules;
  metrics: CampaignMetrics;
  createdAt: string;
}

export interface CreateCampaignInput {
  title: string;
  description: string;
  type: CampaignType;
  hashtag: string;
  startsAt: string;
  endsAt: string;
  buzzword?: string;
}
