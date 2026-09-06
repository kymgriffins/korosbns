import React from "react";

interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  imageUrl?: string;
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished = "2026-01-01T00:00:00Z",
  dateModified = "2026-06-01T00:00:00Z",
  authorName = "Budget Ndio Story Editorial Team",
  imageUrl = "https://budgetndiostory.org/logo.png",
}: ArticleJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    url: url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      "@type": "Organization",
      name: authorName,
      url: "https://budgetndiostory.org",
    },
    publisher: {
      "@type": "Organization",
      name: "Budget Ndio Story",
      logo: {
        "@type": "ImageObject",
        url: "https://budgetndiostory.org/logo.png",
      },
    },
    image: [imageUrl],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: Array<{ name: string; item: string }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface StudioServiceJsonLdProps {
  url?: string;
  title?: string;
  description?: string;
}

export function StudioServiceJsonLd({
  url = "https://budgetndiostory.org/bns-studio",
  title = "BNS Studios",
  description = "Commercial civic creative agency and impact production house. Commissioning broadcast podcast series, cinema field documentaries, 2D motion graphics, and civic explainers in Kenya.",
}: StudioServiceJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["ProfessionalService", "VideoProductionService"],
        "@id": `${url}#agency`,
        name: title,
        alternateName: ["Budget Ndio Story Studios", "BNS Impact Production", "BNS Studios Kenya"],
        url: url,
        logo: "https://budgetndiostory.org/logo.png",
        image: "https://budgetndiostory.org/og-image.jpg",
        description: description,
        email: "info@budgetndiostory.org",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Nairobi",
          addressCountry: "KE",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -1.2921,
          longitude: 36.8219,
        },
        parentOrganization: {
          "@type": "Organization",
          name: "Budget Ndio Story",
          url: "https://budgetndiostory.org",
        },
        areaServed: [
          { "@type": "Country", "name": "Kenya" },
          { "@type": "AdministrativeArea", "name": "East Africa" },
        ],
        serviceType: [
          "Video Production",
          "Documentary Filmmaking",
          "Podcast Production",
          "2D Motion Graphics & Animation",
          "Civic Explainer Videos",
          "Public Participation Facilitation",
          "Strategic Communications",
        ],
        knowsAbout: [
          "Public Finance Management",
          "Article 201 Constitution of Kenya",
          "Civic Media Production",
          "Investigative Audio Journalism",
          "Donor Impact Reporting",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "BNS Studios Commercial Production Spectrum",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Cinema & Field Documentaries",
                description:
                  "High-fidelity field cinematography, human interest civic investigations, and observational storytelling on public revenue across all 47 counties.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Audio Journalism & Podcast Series",
                description:
                  "Multi-mic studio recording, field soundscapes, and bilingual investigative debate series broadcast in English, Kiswahili, and Sheng.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Animation & Visual Data Design",
                description:
                  "2D character animation, kinetic typography, and motion infographics translating multi-trillion shilling balance sheets into digestible media.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Explainer Videos & Forensic Visual Memos",
                description:
                  "Step-by-step video dissections of national bills, county budget allocations, and public finance legislation.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Town Hall Convening & Citizen Barazas",
                description:
                  "Deliberative community town hall design, live streaming, and citizen-official dialogue facilitation.",
              },
            },
          ],
        },
        potentialAction: {
          "@type": "CommunicateAction",
          name: "Commission BNS Studios",
          target: `${url}#booking`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://budgetndiostory.org" },
          { "@type": "ListItem", position: 2, name: "Programmes", item: "https://budgetndiostory.org/programmes" },
          { "@type": "ListItem", position: 3, name: "BNS Studios", item: url },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface StudioProjectJsonLdProps {
  title: string;
  description: string;
  slug: string;
  contentType: string;
  clientName: string;
  datePublished: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  tags?: string[];
}

export function StudioProjectJsonLd({
  title,
  description,
  slug,
  contentType,
  clientName,
  datePublished,
  imageUrl,
  videoUrl,
  audioUrl,
  tags = [],
}: StudioProjectJsonLdProps) {
  const pageUrl = `https://budgetndiostory.org/bns-studio/${slug}`;
  const isVideo = Boolean(videoUrl) || contentType.toLowerCase().includes("video") || contentType.toLowerCase().includes("documentar");
  const isAudio = Boolean(audioUrl) || contentType.toLowerCase().includes("podcast") || contentType.toLowerCase().includes("audio");

  const creativeWorkType = isVideo ? "VideoObject" : isAudio ? "AudioObject" : "CreativeWork";

  const workEntity: Record<string, any> = {
    "@type": creativeWorkType,
    name: title,
    headline: title,
    description: description,
    url: pageUrl,
    datePublished: datePublished,
    creator: {
      "@type": "Organization",
      name: "BNS Studios",
      url: "https://budgetndiostory.org/bns-studio",
    },
    publisher: {
      "@type": "Organization",
      name: "Budget Ndio Story",
      url: "https://budgetndiostory.org",
    },
    sponsor: {
      "@type": "Organization",
      name: clientName,
    },
    genre: contentType,
    keywords: tags.join(", "),
  };

  if (imageUrl) {
    workEntity.thumbnailUrl = imageUrl;
    workEntity.image = imageUrl;
  }

  if (isVideo && videoUrl) {
    workEntity.contentUrl = videoUrl;
    workEntity.uploadDate = datePublished;
  }

  if (isAudio && audioUrl) {
    workEntity.contentUrl = audioUrl;
  }

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      workEntity,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://budgetndiostory.org" },
          { "@type": "ListItem", position: 2, name: "BNS Studios", item: "https://budgetndiostory.org/bns-studio" },
          { "@type": "ListItem", position: 3, name: "Portfolio", item: "https://budgetndiostory.org/bns-studio/work" },
          { "@type": "ListItem", position: 4, name: title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface StudioCollectionJsonLdProps {
  title: string;
  description: string;
  url: string;
  projects: Array<{
    title: string;
    slug: string;
    description: string;
    imageUrl?: string;
  }>;
}

export function StudioCollectionJsonLd({
  title,
  description,
  url,
  projects,
}: StudioCollectionJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description: description,
    url: url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://budgetndiostory.org/bns-studio/${p.slug}`,
        name: p.title,
        description: p.description,
        image: p.imageUrl,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default ArticleJsonLd;
