import type { Metadata } from "next";
import { metaDescription, canonicalUrl } from "@/utils/metadata";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://budgetndiostory.org";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "Budget Ndio Story";


export const DEFAULT_PAGE_KEYWORDS = [
  "Budget Ndio Story",
  "BNS Studios",
  "Kenya budget literacy",
  "video production company Nairobi",
  "podcast studio Kenya",
  "documentary production Nairobi",
  "2D animation studio Kenya",
  "civic media agency Kenya",
  "Finance Bill Kenya",
  "Appropriation Bill",
  "Kenya budget process",
  "county budget transparency",
  "parliamentary budget Kenya",
  "National Assembly finance",
  "Kenya fiscal policy",
];

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  keywords,
  type = "website",
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
}): Metadata {
  const normalizedDescription = metaDescription(description);
  const canonical = canonicalUrl(path);
  const ogImage = image || "/og-image.jpg";
  const mergedKeywords = keywords && keywords.length > 0
    ? Array.from(new Set([...keywords, ...DEFAULT_PAGE_KEYWORDS]))
    : DEFAULT_PAGE_KEYWORDS;

  return {
    title,
    description: normalizedDescription,
    metadataBase: new URL(siteUrl),
    keywords: mergedKeywords,
    alternates: { canonical },
    openGraph: {
      type,
      locale: "en_KE",
      url: canonical,
      siteName: appName,
      title,
      description: normalizedDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: normalizedDescription,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
