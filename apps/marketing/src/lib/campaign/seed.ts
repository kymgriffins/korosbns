import { Campaign } from "@/lib/campaign/types";

const now = new Date();
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

export const CAMPAIGN_SEED: Campaign[] = [
  {
    id: "cmp_active_buzzword",
    slug: "budget-buzzword-april",
    title: "Budget Buzzword Challenge",
    description:
      "Post a short video using this week's budget buzzword. Best stories get featured on our channels.",
    type: "weekly-buzzword",
    buzzword: "CitizenBudgetPower",
    hashtag: "#BudgetNdioChallenge",
    status: "active",
    startsAt: addDays(now, -2).toISOString(),
    endsAt: addDays(now, 5).toISOString(),
    rewards: [
      { id: "rw1", label: "Featured Post", description: "Feature on BNS social channels", tier: "feature" },
      { id: "rw2", label: "Creator Pack", description: "Branded merch and shoutout", tier: "standard" },
    ],
    rules: {
      eligibility: ["Public account or public post link", "Age 16+", "One submission per person"],
      participationSteps: [
        "Create content around this week's buzzword",
        "Post and tag @BudgetNdioStory",
        "Submit your link through the campaign form",
      ],
      disallowedContent: ["Hate speech", "Spam or misleading claims", "Copyright violations"],
    },
    metrics: {
      views: 1240,
      submissions: 36,
      shares: 88,
      conversionRate: 12.4,
    },
    createdAt: addDays(now, -5).toISOString(),
  },
  {
    id: "cmp_upcoming_story",
    slug: "county-budget-story-challenge",
    title: "My County Budget Story",
    description:
      "Share a real community issue and connect it to budget action. Top entries win and get featured.",
    type: "story-challenge",
    hashtag: "#MyBudgetStory",
    status: "upcoming",
    startsAt: addDays(now, 3).toISOString(),
    endsAt: addDays(now, 10).toISOString(),
    rewards: [
      { id: "rw3", label: "Grand Prize", description: "Cash + media spotlight", tier: "grand" },
      { id: "rw4", label: "Feature Winner", description: "Featured story on the website", tier: "feature" },
    ],
    rules: {
      eligibility: ["Residents with valid social profiles", "Original content only"],
      participationSteps: [
        "Record a 30-60 second story",
        "Post with challenge hashtag",
        "Submit your post URL and contact details",
      ],
      disallowedContent: ["Personal attacks", "Political misinformation", "Reused content from past contests"],
    },
    metrics: {
      views: 0,
      submissions: 0,
      shares: 0,
      conversionRate: 0,
    },
    createdAt: now.toISOString(),
  },
];
