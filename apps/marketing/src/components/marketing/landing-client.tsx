"use client";

import React from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/marketing/hero";

// Lazy-load below-the-fold dynamic animation modules (no-SSR on client)
const FramerStickyScroll = dynamic(
  () => import("@/components/marketing/framer-sticky-scroll"),
  {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-black animate-pulse" />,
  }
);

const HorizontalCycleSlider = dynamic(
  () => import("@/components/marketing/horizontal-cycle-slider"),
  {
    ssr: false,
    loading: () => <div className="h-screen w-full bg-black animate-pulse" />,
  }
);

const AlertsSimulator = dynamic(
  () => import("@/components/marketing/alerts-simulator"),
  {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-black animate-pulse" />,
  }
);

const ArticlesPromoMarquee = dynamic(
  () => import("@/components/marketing/articles-promo-marquee"),
  { ssr: false }
);

const Cta = dynamic(
  () => import("@/components/marketing/cta"),
  { ssr: false }
);

const NewsletterPopup = dynamic(
  () => import("@/components/marketing/newsletter-popup"),
  { ssr: false }
);

export default function LandingClient() {
  return (
    <>
      <Hero />
      <ArticlesPromoMarquee />
      <FramerStickyScroll />
      <HorizontalCycleSlider />
      <AlertsSimulator />
      <Cta />
      <NewsletterPopup />
    </>
  );
}
