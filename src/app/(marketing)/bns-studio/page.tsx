import React from "react";
import { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { StudioHero } from "@/components/studio/StudioHero";
import { StudioServices } from "@/components/studio/StudioServices";
import { StudioPortfolio } from "@/components/studio/StudioPortfolio";
import { StudioTestimonials } from "@/components/studio/StudioTestimonials";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { StudioContactCTA } from "@/components/studio/StudioContactCTA";

export const metadata: Metadata = buildPageMetadata({
  title: "BNS Studio | Budget Ndio Story",
  description:
    "BNS Studio offers professional videography, photography, studio rental, and post-production services in Kenya. Every booking supports civic education. Book a shoot today.",
  path: "/bns-studio",
});

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

type ApiService = { id: string; title: string; description: string; icon: string; price: string; order: number };
type ApiPortfolio = { id: string; title: string; description: string; media_type: string; image_url: string; video_url: string; category: string; order: number };
type ApiTestimonial = { id: string; client_name: string; client_role: string; content: string; rating: number; image_url: string; order: number };

const defaultFeatures: Record<string, string[]> = {
  Videography: ["4K/HD recording", "Professional audio", "Multi-camera setup", "Same-day edit option"],
  Photography: ["High-resolution RAW", "Professional lighting", "Edited gallery", "Print-ready files"],
  "Studio Rental": ["Continuous/ flash lighting", "Backdrop system", "Changing room", "Audio equipment"],
  "Post-Production": ["DaVinci Resolve / Premiere Pro", "Color grading", "Motion graphics", "Sound mixing"],
};

export default async function BNSStudioPage() {
  const [services, portfolio, testimonials] = await Promise.all([
    fetchJson<ApiService[]>("/api/v1/studio/services/"),
    fetchJson<ApiPortfolio[]>("/api/v1/studio/portfolio/"),
    fetchJson<ApiTestimonial[]>("/api/v1/studio/testimonials/"),
  ]);

  const mappedServices = services?.map((s) => ({
    name: s.title,
    description: s.description,
    price: s.price,
    features: defaultFeatures[s.title] || [],
  }));

  const mappedPortfolio = portfolio?.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    media_type: p.media_type === "video" ? "video" as const : "image" as const,
    image_url: p.image_url,
    video_url: p.video_url || undefined,
    description: p.description,
  }));

  const mappedTestimonials = testimonials?.map((t) => ({
    id: t.id,
    client_name: t.client_name,
    role: t.client_role,
    content: t.content,
    rating: t.rating,
    avatar_url: t.image_url,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "BNS Studio",
            description:
              "Professional videography, photography, studio rental, and post-production services in Kenya.",
            url: "https://budgetndiostory.org/bns-studio",
            telephone: "+254700000000",
            email: "studio@budgetndiostory.org",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Nairobi",
              addressCountry: "KE",
            },
            parentOrganization: {
              "@type": "Organization",
              name: "Budget Ndio Story",
            },
            priceRange: "KES 5,000 - 100,000",
          }),
        }}
      />
      <StudioHero />
      <StudioServices services={mappedServices} />
      <StudioPortfolio items={mappedPortfolio} />
      <StudioTestimonials testimonials={mappedTestimonials} />
      <StudioBookingForm />
      <StudioContactCTA />
    </>
  );
}
