import React from "react";
import type { Metadata } from "next";
import { canonicalUrl } from "@/utils/metadata";
import { ReportsHubClient } from "@/components/reports-bulletin/reports-hub-client";
import { REPORTS_BULLETIN_DATA } from "@/data/reports-bulletin";

export const metadata: Metadata = {
  title: "Kenya National Budget Reports & Citizen Intelligence Bulletin | Budget Ndio Story",
  description:
    "Authoritative analysis of Kenya's KES 4.82 Trillion National Budget, KRA ordinary revenue (KES 2.99T), public debt servicing (KES 1.20T), and county devolution allocations in Kakamega, Kilifi, Nakuru, and Wajir.",
  keywords: [
    "Kenya national budget 2026",
    "National Treasury Kenya budget",
    "Kenya budget breakdown KES 4.82 trillion",
    "County budget allocations Kenya",
    "Kakamega county budget execution",
    "Kilifi county blue economy budget",
    "Nakuru county revenue and CAIPs",
    "Wajir county equalisation fund",
    "Kenya public debt servicing 2026",
    "Education sector capitation Kenya",
    "CRA 3rd basis formula",
    "Budget Ndio Story reports",
  ],
  alternates: { canonical: canonicalUrl("/reports") },
  openGraph: {
    title: "Kenya National Budget Reports & Citizen Intelligence Bulletin | Budget Ndio Story",
    description:
      "Comprehensive, audited analysis of Kenya's KES 4.82T National Budget and focus county scorecards for Kakamega, Kilifi, Nakuru, and Wajir.",
    url: "/reports",
    type: "website",
    images: [
      {
        url: "https://budgetndiostory.org/images/media/main%20media%20image.jpg",
        width: 1200,
        height: 630,
        alt: "Kenya National Budget Reports Bulletin",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kenya National Budget Reports & Citizen Intelligence Bulletin",
    description:
      "Audited breakdown of Kenya's KES 4.82T national budget, debt servicing, and county devolution.",
    images: ["https://budgetndiostory.org/images/media/main%20media%20image.jpg"],
  },
};

export default function ReportsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://budgetndiostory.org/reports",
        "url": "https://budgetndiostory.org/reports",
        "name": "Kenya National Budget Reports Bulletin",
        "description": "Comprehensive verified reports and question resolution on Kenya's KES 4.82T national budget and 47 county devolution allocations.",
        "publisher": {
          "@type": "Organization",
          "name": "Budget Ndio Story",
          "url": "https://budgetndiostory.org",
          "logo": "https://budgetndiostory.org/logo.png"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": REPORTS_BULLETIN_DATA.indexedQuestions.slice(0, 6).map((q) => ({
          "@type": "Question",
          "name": q.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.answer
          }
        }))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReportsHubClient />
    </>
  );
}
