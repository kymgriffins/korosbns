import { withFallback } from "@/data/adapter";
import { citizenApi } from "@/lib/api-client";

export type StudioService = {
  name: string;
  description: string;
  price: string;
  features: string[];
};

export type StudioPortfolioItem = {
  id: string;
  title: string;
  category: string;
  media_type: "image" | "video";
  image_url: string;
  video_url?: string;
  video_platform?: "youtube" | "vimeo" | "cloudinary" | "other";
  description: string;
};

export type StudioTestimonial = {
  id: string;
  client_name: string;
  role: string;
  content: string;
  rating: number;
  avatar_url: string;
};

const defaultFeatures: Record<string, string[]> = {
  Videography: ["4K/HD recording", "Professional audio", "Multi-camera setup", "Same-day edit option"],
  Photography: ["High-resolution RAW", "Professional lighting", "Edited gallery", "Print-ready files"],
  "Studio Rental": ["Continuous/ flash lighting", "Backdrop system", "Changing room", "Audio equipment"],
  "Post-Production": ["DaVinci Resolve / Premiere Pro", "Color grading", "Motion graphics", "Sound mixing"],
};

const DEFAULT_SERVICES: StudioService[] = [
  { name: "Videography", description: "Professional video production for events, commercials, and documentaries.", price: "From KES 15,000", features: defaultFeatures.Videography },
  { name: "Photography", description: "High-quality photography for portraits, events, and product shoots.", price: "From KES 8,000", features: defaultFeatures.Photography },
  { name: "Studio Rental", description: "Fully equipped studio space for your creative projects.", price: "KES 3,000/hr", features: defaultFeatures["Studio Rental"] },
  { name: "Post-Production", description: "Professional editing, color grading, and motion graphics.", price: "From KES 10,000", features: defaultFeatures["Post-Production"] },
];

const DEFAULT_PORTFOLIO: StudioPortfolioItem[] = [
  { id: "1", title: "Budget Literacy Campaign", category: "Videography", media_type: "video", image_url: "/placeholder.svg?height=400&width=600", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", video_platform: "youtube", description: "Youth engagement video series" },
  { id: "2", title: "County Budget Forum", category: "Photography", media_type: "image", image_url: "/placeholder.svg?height=400&width=600", description: "Public participation event coverage" },
  { id: "3", title: "Studio Session Reel", category: "Videography", media_type: "video", image_url: "/placeholder.svg?height=400&width=600", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", video_platform: "youtube", description: "Behind the scenes" },
  { id: "4", title: "Portrait Collection", category: "Photography", media_type: "image", image_url: "/placeholder.svg?height=400&width=600", description: "Professional headshots" },
  { id: "5", title: "Documentary Shoot", category: "Videography", media_type: "video", image_url: "/placeholder.svg?height=400&width=600", video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ", video_platform: "youtube", description: "Community impact story" },
  { id: "6", title: "Product Photography", category: "Photography", media_type: "image", image_url: "/placeholder.svg?height=400&width=600", description: "Commercial product shoot" },
];

const DEFAULT_TESTIMONIALS: StudioTestimonial[] = [
  { id: "1", client_name: "James M.", role: "Project Lead", content: "BNS Studio delivered exceptional quality. The team was professional and the final product exceeded expectations.", rating: 5, avatar_url: "" },
  { id: "2", client_name: "Sarah W.", role: "Event Organizer", content: "The studio space is top-notch. Perfect for our production needs with all the equipment we required.", rating: 5, avatar_url: "" },
  { id: "3", client_name: "David O.", role: "Content Creator", content: "Post-production work was incredible. Fast turnaround without compromising on quality.", rating: 4, avatar_url: "" },
];

export const studioData = {
  fetchServices: () =>
    withFallback<StudioService[]>(
      "studio",
      async () => {
        const raw = await citizenApi.getStudioServices();
        return raw.map((s: { title: string; description: string; price: string }) => ({
          name: s.title,
          description: s.description,
          price: s.price,
          features: defaultFeatures[s.title] || [],
        }));
      },
      DEFAULT_SERVICES
    ),
  fetchPortfolio: () =>
    withFallback<StudioPortfolioItem[]>(
      "studio-portfolio",
      async () => {
        const raw = await citizenApi.getStudioPortfolio();
        return raw.map((p: { id: string; title: string; category: string; media_type: string; image_url: string; video_url?: string; video_platform?: string; description: string }) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          media_type: p.media_type === "video" ? "video" as const : "image" as const,
          image_url: p.image_url,
          video_url: p.video_url || undefined,
          video_platform: (p.video_platform || "youtube") as "youtube" | "vimeo" | "cloudinary" | "other",
          description: p.description,
        }));
      },
      DEFAULT_PORTFOLIO
    ),
  fetchTestimonials: () =>
    withFallback<StudioTestimonial[]>(
      "studio-testimonials",
      async () => {
        const raw = await citizenApi.getStudioTestimonials();
        return raw.map((t: { id: string; client_name: string; client_role: string; content: string; rating: number; image_url: string }) => ({
          id: t.id,
          client_name: t.client_name,
          role: t.client_role,
          content: t.content,
          rating: t.rating,
          avatar_url: t.image_url,
        }));
      },
      DEFAULT_TESTIMONIALS
    ),
};
