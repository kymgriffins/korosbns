import { Metadata } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.budgetndiostory.org";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "Budget Ndio Story";

export const generateMetadata = ({
  title = `${appName} | Youth-Led Budget Literacy in Kenya`,
  description = `Budget Ndio Story is a youth-led Kenyan initiative translating national and county budgets into clear, actionable stories for civic engagement and accountability.`,
  image = "/logo.svg",
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
  icons?: Metadata["icons"];
  noIndex?: boolean;
} = {}): Metadata => ({
  title,
  description,
  metadataBase: new URL(siteUrl),
  applicationName: appName,
  keywords: [
    "Budget Ndio Story",
    "Kenya budget literacy",
    "youth civic engagement Kenya",
    "budget accountability",
    "public finance Kenya",
    "county budget transparency",
    "fiscal policy explainers",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: appName,
    title,
    description,
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
    description,
    images: image ? [image] : undefined,
  },
  category: "Civic Education",
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
});
