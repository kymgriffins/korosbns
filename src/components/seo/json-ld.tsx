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

export default ArticleJsonLd;
