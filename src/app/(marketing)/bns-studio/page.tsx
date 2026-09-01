import React from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/utils/page-metadata";
import { BNSStudioPageClient } from "@/components/studio/BNSStudioPageClient";
import { getProgramme } from "@/constants/programmes-content";

const studios = getProgramme("studios")!;

export const metadata: Metadata = buildPageMetadata({
  title: studios.seoTitle,
  description: studios.seoDescription,
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
            name: "Budget Ndio Story — Impact Production",
            description: studios.seoDescription,
            url: "https://budgetndiostory.org/bns-studio",
            email: "info@budgetndiostory.org",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Nairobi",
              addressCountry: "KE",
            },
            parentOrganization: {
              "@type": "Organization",
              name: "Budget Ndio Story",
            },
          }),
        }}
      />
      <BNSStudioPageClient />
    </>
  );
}
