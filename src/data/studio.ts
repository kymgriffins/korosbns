import { withFallback } from "@/data/adapter";
import { citizenApi } from "@/lib/api-client";
import type { StudioServiceApi, StudioPortfolioItemApi, StudioTestimonialApi } from "@/types/notes";
import {
  BNS_STUDIO_PAGE_SERVICES,
  BNS_STUDIO_EVIDENCE,
  type StudioContentType,
  type StudioOrganizationType,
} from "@/constants/bns-studio-content";
import { BNS_MEDIA_IMAGES, BNS_COMMUNITY_IMAGES } from "@/constants/bns-media-images";

export type StudioService = {
  name: string;
  description: string;
  price: string;
  features: string[];
  contentType?: StudioContentType;
  bestFor?: string;
};

export type StudioPortfolioItem = {
  id: string;
  title: string;
  category: string;
  media_type: "image" | "video";
  image_url: string;
  video_url?: string;
  video_platform?: "youtube" | "vimeo" | "cloudinary" | "other";
  description?: string;
  impactMetric?: string;
  organizationName?: string;
  organizationType?: StudioOrganizationType;
  year?: string;
};

export type StudioTestimonial = {
  id: string;
  client_name: string;
  role?: string;
  content: string;
  rating: number;
  avatar_url?: string;
};

const DEFAULT_SERVICES: StudioService[] = BNS_STUDIO_PAGE_SERVICES.map((s) => ({
  name: s.name,
  description: s.description,
  price: s.price,
  features: s.features,
  contentType: s.contentType,
  bestFor: s.bestFor,
}));

const DEFAULT_PORTFOLIO: StudioPortfolioItem[] = BNS_STUDIO_EVIDENCE.map((item) => ({
  id: item.id,
  title: item.title,
  category: item.contentType,
  media_type: "image" as const,
  image_url: item.image_url,
  description: item.summary,
  impactMetric: item.impactMetric,
  organizationName: item.organizationName,
  organizationType: item.organizationType,
  year: item.year,
}));

const DEFAULT_TESTIMONIALS: StudioTestimonial[] = [
  { id: "1", client_name: "James M.", role: "Project Lead", content: "BNS Studio delivered exceptional quality.", rating: 5, avatar_url: BNS_MEDIA_IMAGES.productionA },
  { id: "2", client_name: "Sarah W.", role: "Event Organizer", content: "The studio space is top-notch.", rating: 5, avatar_url: BNS_COMMUNITY_IMAGES.forumB },
  { id: "3", client_name: "David O.", role: "Content Creator", content: "Post-production work was incredible.", rating: 4, avatar_url: BNS_MEDIA_IMAGES.productionB },
];

export const studioData = {
  fetchServices: () =>
    withFallback<StudioService[]>(
      "studio",
      async () => {
        const raw = await citizenApi.getStudioServices();
        return raw.map((s: StudioServiceApi) => ({
          name: s.name,
          description: s.description,
          price: s.price,
          features: s.features,
        }));
      },
      () => DEFAULT_SERVICES
    ),
  fetchPortfolio: () =>
    withFallback<StudioPortfolioItem[]>(
      "studio-portfolio",
      async () => {
        const raw = await citizenApi.getStudioPortfolio();
        return raw.map((p: StudioPortfolioItemApi) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          media_type: p.media_type,
          image_url: p.image_url,
          video_url: p.video_url,
          video_platform: p.video_platform,
          description: p.description,
        }));
      },
      () => DEFAULT_PORTFOLIO
    ),
  fetchTestimonials: () =>
    withFallback<StudioTestimonial[]>(
      "studio-testimonials",
      async () => {
        const raw = await citizenApi.getStudioTestimonials();
        return raw.map((t: StudioTestimonialApi) => ({
          id: t.id,
          client_name: t.client_name,
          role: t.role,
          content: t.content,
          rating: t.rating,
          avatar_url: t.avatar_url,
        }));
      },
      () => DEFAULT_TESTIMONIALS
    ),
};
