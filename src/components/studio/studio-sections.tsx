"use client";

import { useEffect, useState } from "react";
import { StudioServices } from "@/components/studio/StudioServices";
import { StudioPortfolio } from "@/components/studio/StudioPortfolio";
import { StudioTestimonials } from "@/components/studio/StudioTestimonials";
import { studioData, type StudioService, type StudioPortfolioItem, type StudioTestimonial } from "@/data/studio";

export function StudioSections() {
  const [services, setServices] = useState<StudioService[] | undefined>(undefined);
  const [portfolio, setPortfolio] = useState<StudioPortfolioItem[] | undefined>(undefined);
  const [testimonials, setTestimonials] = useState<StudioTestimonial[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [s, p, t] = await Promise.all([
        studioData.fetchServices(),
        studioData.fetchPortfolio(),
        studioData.fetchTestimonials(),
      ]);
      setServices(s);
      setPortfolio(p);
      setTestimonials(t);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading studio content...</p>
      </div>
    );
  }

  return (
    <>
      <StudioServices services={services} />
      <StudioPortfolio items={portfolio} />
      <StudioTestimonials testimonials={testimonials} />
    </>
  );
}
