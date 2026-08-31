import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canonicalUrl } from "@/utils/metadata";
import { getAllReports, getReportBySlug } from "@/data/reports-bulletin";
import { ReportDetailView } from "@/components/reports-bulletin/report-detail-view";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const reports = getAllReports();
  return reports.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const report = getReportBySlug(slug);
  if (!report) {
    return {
      title: "Report Not Found | Budget Ndio Story",
      description: "The requested budget report could not be found.",
    };
  }

  return {
    title: report.seoTitle,
    description: report.seoDescription,
    keywords: [
      report.title,
      report.category,
      report.county,
      report.programme,
      "Kenya National Treasury",
      "Kenya national budget 2026",
      "County budget allocation Kenya",
      "Budget Ndio Story",
    ],
    alternates: { canonical: canonicalUrl(`/reports/${report.slug}`) },
    openGraph: {
      title: report.seoTitle,
      description: report.seoDescription,
      url: `/reports/${report.slug}`,
      type: "article",
      publishedTime: report.publishedDate,
      modifiedTime: report.updatedDate,
      authors: [report.author],
      images: [
        {
          url: "https://budgetndiostory.org/images/media/main%20media%20image.jpg",
          width: 1200,
          height: 630,
          alt: report.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: report.seoTitle,
      description: report.seoDescription,
      images: ["https://budgetndiostory.org/images/media/main%20media%20image.jpg"],
    },
  };
}

export default async function ReportDossierPage({ params }: PageProps) {
  const { slug } = await params;
  const report = getReportBySlug(slug);
  if (!report) {
    notFound();
  }

  const allReports = getAllReports();
  const relatedReports = allReports.filter((r) => r.slug !== slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://budgetndiostory.org/reports/${report.slug}#article`,
        "isPartOf": {
          "@type": "WebPage",
          "@id": `https://budgetndiostory.org/reports/${report.slug}`
        },
        "headline": report.title,
        "description": report.seoDescription,
        "datePublished": `${report.publishedDate}T08:00:00+03:00`,
        "dateModified": `${report.updatedDate}T12:00:00+03:00`,
        "mainEntityOfPage": `https://budgetndiostory.org/reports/${report.slug}`,
        "author": {
          "@type": "Organization",
          "name": report.author,
          "url": "https://budgetndiostory.org"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Budget Ndio Story",
          "url": "https://budgetndiostory.org",
          "logo": {
            "@type": "ImageObject",
            "url": "https://budgetndiostory.org/logo.png"
          }
        },
        "image": "https://budgetndiostory.org/images/media/main%20media%20image.jpg"
      },
      {
        "@type": "FAQPage",
        "@id": `https://budgetndiostory.org/reports/${report.slug}#faq`,
        "mainEntity": report.faqs.map((f) => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://budgetndiostory.org/reports/${report.slug}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://budgetndiostory.org"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Reports Bulletin",
            "item": "https://budgetndiostory.org/reports"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": report.eyebrow,
            "item": `https://budgetndiostory.org/reports/${report.slug}`
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReportDetailView report={report} relatedReports={relatedReports} />
    </>
  );
}
