import { withFallback } from "@/data/adapter";
import { citizenApi } from "@/lib/api-client";
import type {
  StudioServiceApi,
  StudioPortfolioItemApi,
  StudioTestimonialApi,
} from "@/types/notes";
import {
  BNS_STUDIO_PAGE_SERVICES,
  type StudioContentType,
  type StudioOrganizationType,
} from "@/constants/bns-studio-content";
import { studiosEvidenceData } from "@/data/studios-evidence";

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

const DEFAULT_SERVICES: StudioService[] = BNS_STUDIO_PAGE_SERVICES.map(
  (service) => ({
    name: service.name,
    description: service.description,
    price: service.price,
    features: service.features,
    contentType: service.contentType,
    bestFor: service.bestFor,
  }),
);

const DEFAULT_PORTFOLIO: StudioPortfolioItem[] = studiosEvidenceData
  .getAllProjects()
  .map((project) => ({
    id: project.id,
    title: project.title,
    category: project.contentType,
    media_type: "image" as const,
    image_url: project.media.posterUrl,
    description: project.briefChallenge,
    impactMetric: project.impactEvidence.primaryMetric,
    organizationName: project.organization.name,
    organizationType: project.organization.sector,
    year: project.year,
  }));

const DEFAULT_TESTIMONIALS: StudioTestimonial[] = [];

export const studioData = {
  fetchServices: () =>
    withFallback<StudioService[]>(
      "studio",
      async () => {
        const raw = await citizenApi.getStudioServices();
        return raw.map((service: StudioServiceApi) => ({
          name: service.name,
          description: service.description,
          price: service.price,
          features: service.features,
        }));
      },
      () => DEFAULT_SERVICES,
    ),
  fetchPortfolio: () =>
    withFallback<StudioPortfolioItem[]>(
      "studio-portfolio",
      async () => {
        const raw = await citizenApi.getStudioPortfolio();
        return raw.map((item: StudioPortfolioItemApi) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          media_type: item.media_type,
          image_url: item.image_url,
          video_url: item.video_url,
          video_platform: item.video_platform,
          description: item.description,
        }));
      },
      () => DEFAULT_PORTFOLIO,
    ),
  fetchTestimonials: () =>
    withFallback<StudioTestimonial[]>(
      "studio-testimonials",
      async () => {
        const raw = await citizenApi.getStudioTestimonials();
        return raw.map((testimonial: StudioTestimonialApi) => ({
          id: testimonial.id,
          client_name: testimonial.client_name,
          role: testimonial.role,
          content: testimonial.content,
          rating: testimonial.rating,
          avatar_url: testimonial.avatar_url,
        }));
      },
      () => DEFAULT_TESTIMONIALS,
    ),
};
