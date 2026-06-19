import { z } from "zod";

export const createCampaignSchema = z.object({
  title: z.string().min(5).max(120),
  description: z.string().min(10).max(500),
  type: z.enum(["weekly-buzzword", "story-challenge", "creator-spotlight"]),
  hashtag: z.string().min(2).max(50),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  buzzword: z.string().min(2).max(80).optional(),
});

export type CreateCampaignSchema = z.infer<typeof createCampaignSchema>;
