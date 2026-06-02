import type { Metadata } from "next";
import { metaDescription, canonicalUrl } from "@/utils/metadata";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://app.budgetndiostory.org";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "Budget Ndio Story";


export function buildPageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  noIndex?: boolean;
}): Metadata {
  const normalizedDescription = metaDescription(description);
  const canonical = canonicalUrl(path);
  const ogImage = image || "/logo.svg";

  return {
    title,
    description: normalizedDescription,
    metadataBase: new URL(siteUrl),
    keywords: [
      "Finance Bill Kenya",
      "Appropriation Bill",
      "Kenya budget process",
      "parliamentary budget Kenya",
      "National Assembly finance",
      "Budget Ndio Story",
      "Kenya fiscal policy",
    ],
    alternates: { canonical },
    openGraph: {
      type: "article",
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
