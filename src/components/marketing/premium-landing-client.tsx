"use client";

import React from "react";
import dynamic from "next/dynamic";
import LandingHero from "@/components/marketing/landing-hero";

const CloudinaryGallery = dynamic(
  () => import("@/components/marketing/cloudinary-gallery"),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-muted animate-pulse" />,
  }
);

const LandingTikTokVideo = dynamic(
  () => import("@/components/marketing/landing-tiktok-video"),
  {
    ssr: false,
    loading: () => <div className="h-[640px] w-full bg-muted animate-pulse" />,
  }
);

const LandingYoutube = dynamic(
  () => import("@/components/marketing/landing-youtube"),
  {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-muted animate-pulse" />,
  }
);

const PartnersMarquee = dynamic(
  () => import("@/components/marketing/partners-marquee"),
  {
    ssr: false,
    loading: () => <div className="h-32 w-full bg-muted animate-pulse" />,
  }
);

const LandingTeam = dynamic(
  () => import("@/components/marketing/landing-team"),
  {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-background animate-pulse" />,
  }
);

const TimelineSection = dynamic(
  () => import("@/components/shadcn-space/blocks/timeline-01"),
  {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-muted animate-pulse" />,
  }
);

const BNSStudioSection = dynamic(
  () => import("@/components/marketing/bns-studio-section").then((m) => ({ default: m.BNSStudioSection })),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-muted animate-pulse" />,
  }
);

const ServicesSection = dynamic(
  () => import("@/components/shadcn-space/blocks/services-02/services"),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-muted animate-pulse" />,
  }
);

const TestimonialsSection = dynamic(
  () => import("@/components/shadcn-space/blocks/testimonial-01/testimonial"),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-muted animate-pulse" />,
  }
);

const BlogSection = dynamic(
  () => import("@/components/shadcn-space/blocks/blog-01/blog"),
  {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-muted animate-pulse" />,
  }
);

const NewsletterPopup = dynamic(
  () => import("@/components/marketing/newsletter-popup"),
  { ssr: false }
);

import type { ServiceItem } from "@/components/shadcn-space/blocks/services-02/services";

const bnsServices: ServiceItem[] = [
  {
    heading: "Budget Analysis",
    descp: "We break down complex national and county budgets into clear, accessible narratives that empower citizens to understand where public money is going and hold leaders accountable.",
    image: "/images/explainer-formulation.png"
  },
  {
    heading: "Civic Education",
    descp: "We create engaging learning content — videos, articles, and interactive modules — that builds fiscal literacy and helps Kenyans understand their role in the budget process.",
    image: "/images/community-pulse.png"
  },
  {
    heading: "Data Visualization",
    descp: "We transform dry budget figures into compelling visual stories — infographics, charts, and interactive dashboards — making fiscal data understandable at a glance.",
    image: "/images/dashboard.png"
  },
  {
    heading: "Public Engagement",
    descp: "We facilitate citizen participation in budget processes through forums, surveys, and digital tools that amplify community voices and influence policy decisions.",
    image: "/images/towwnhallmay/129A3923.jpg"
  }
];

export default function PremiumLandingClient() {
  return (
    <>
      <LandingHero />
      <CloudinaryGallery />
      <LandingTikTokVideo />
      <LandingYoutube />
      <PartnersMarquee />
      <LandingTeam />
      <TimelineSection />
      <ServicesSection data={bnsServices} />
      <TestimonialsSection />
      <BlogSection />
      <BNSStudioSection />
      <NewsletterPopup />
    </>
  );
}
