import { CAMPAIGN_SEED } from "@/lib/campaign/seed";
import { Campaign, CampaignStatus, CreateCampaignInput } from "@/lib/campaign/types";

let campaigns: Campaign[] = [...CAMPAIGN_SEED];

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const getStatus = (startsAt: Date, endsAt: Date): CampaignStatus => {
  const now = new Date();
  if (now < startsAt) return "upcoming";
  if (now > endsAt) return "completed";
  return "active";
};

export function listCampaigns(status?: CampaignStatus) {
  if (!status) return campaigns;
  return campaigns.filter((item) => item.status === status);
}

export function getCampaignBySlug(slug: string) {
  return campaigns.find((item) => item.slug === slug);
}

export function createCampaign(input: CreateCampaignInput) {
  const startsAt = new Date(input.startsAt);
  const endsAt = new Date(input.endsAt);

  const campaign: Campaign = {
    id: crypto.randomUUID(),
    slug: toSlug(input.title),
    title: input.title,
    description: input.description,
    type: input.type,
    buzzword: input.buzzword,
    hashtag: input.hashtag,
    status: getStatus(startsAt, endsAt),
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
    rewards: [],
    rules: {
      eligibility: [],
      participationSteps: [],
      disallowedContent: [],
    },
    metrics: {
      views: 0,
      submissions: 0,
      shares: 0,
      conversionRate: 0,
    },
    createdAt: new Date().toISOString(),
  };

  campaigns = [campaign, ...campaigns];
  return campaign;
}
