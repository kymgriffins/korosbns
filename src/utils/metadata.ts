import { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://budgetndiostory.org";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "Budget Ndio Story";

const META_DESC_MIN = 25;
const META_DESC_MAX = 160;

export const DEFAULT_META_DESCRIPTION =
  "Budget Ndio Story is a youth-led Kenyan initiative turning national and county budgets into clear, actionable stories for civic engagement and accountability.";

/** Keeps meta descriptions within SEO-friendly 25–160 character bounds. */
export function metaDescription(
  description: string,
  fallback: string = DEFAULT_META_DESCRIPTION,
): string {
  const trimmed = description.trim().replace(/\s+/g, " ");
  if (trimmed.length >= META_DESC_MIN && trimmed.length <= META_DESC_MAX) {
    return trimmed;
  }
  if (trimmed.length < META_DESC_MIN) {
    const prefix = trimmed.length > 0 ? `${trimmed} — ` : "";
    const combined = `${prefix}${fallback}`;
    return combined.length <= META_DESC_MAX
      ? combined
      : combined.slice(0, META_DESC_MAX).trimEnd();
  }
  const cut = trimmed.slice(0, META_DESC_MAX);
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace >= META_DESC_MIN) {
    return `${cut.slice(0, lastSpace).trimEnd()}.`;
  }
  return cut.trimEnd();
}

export function defaultMetadata(path: string = "/"): Metadata {
  return {
    alternates: { canonical: canonicalUrl(path) },
    openGraph: { url: canonicalUrl(path) },
  };
}

const siteUrlObj = new URL(siteUrl);

export function canonicalUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const lastSegment = normalized.split("/").pop() || "";
  const hasExtension = lastSegment.includes(".");
  const endsWithSlash = normalized.endsWith("/");
  const isApi = normalized.startsWith("/api");

  let formattedPath = normalized;
  if (!endsWithSlash && !hasExtension && !isApi) {
    formattedPath = `${normalized}/`;
  }
  return new URL(formattedPath, siteUrl).toString();
}


export const generateMetadata = ({
  title = `${appName} | Youth-Led Budget Literacy in Kenya`,
  description = DEFAULT_META_DESCRIPTION,
  image = "/logo.svg",
  path = "/",
  icons = [
    {
      rel: "apple-touch-icon",
      url: "/logo.svg",
    },
    {
      rel: "icon",
      url: "/logo.svg",
    },
  ],
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string | null;
  path?: string;
  icons?: Metadata["icons"];
  noIndex?: boolean;
} = {}): Metadata => {
  const normalizedDescription = metaDescription(description);
  const canonical = canonicalUrl(path);
  return {
    title,
    description: normalizedDescription,
    metadataBase: siteUrlObj,
    applicationName: appName,
    keywords: [
      "Budget Ndio Story",
      "Kenya budget literacy",
      "youth civic engagement Kenya",
      "budget accountability",
      "public finance Kenya",
      "county budget transparency",
      "fiscal policy explainers",
      "Finance Bill 2026 Kenya",
      "Appropriation Bill Kenya",
      "Kenya parliamentary budget process",
      "National Assembly budget debate",
      "Kenya Division of Revenue Bill",
      "County Allocation of Revenue Bill",
      "Kenya fiscal responsibility",
      "budget tracking Kenya",
      "public participation budget Kenya",
    ],
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "en_KE",
      url: canonical,
      siteName: appName,
      title,
      description: normalizedDescription,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: `${appName} preview`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: normalizedDescription,
      images: image ? [image] : undefined,
    },
    category: "Civic Education",
    other: {
      "msvalidate.01": "907A93A128DFE576C08F0D8843996E83",
      "google-site-verification": "",
    },
    icons,
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
};
