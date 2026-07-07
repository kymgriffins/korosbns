import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { StudioHero } from "@/components/studio/StudioHero";
import { StudioServices } from "@/components/studio/StudioServices";
import { StudioPortfolio } from "@/components/studio/StudioPortfolio";
import { StudioBookingForm } from "@/components/studio/StudioBookingForm";
import { StudioContactCTA } from "@/components/studio/StudioContactCTA";

export const metadata: Metadata = buildPageMetadata({
  title: "BNS Studio | Budget Ndio Story",
  description:
    "BNS Studio offers professional videography, photography, studio rental, and post-production services in Kenya. Every booking supports civic education. Book a shoot today.",
  path: "/bns-studio",
});

export default function BNSStudioPage() {
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
      <StudioServices />
      <StudioPortfolio />
      <StudioBookingForm />
      <StudioContactCTA />
    </>
  );
}
