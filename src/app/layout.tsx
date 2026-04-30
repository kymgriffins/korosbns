import FlareCursor from "@/components/global/flare-cursor";
import LoadingScreen from "@/components/global/loading-screen";
import Providers from "@/components/global/providers";
import { base, handwriting, heading } from "@/constants";
import "@/styles/globals.css";
import { cn, generateMetadata } from "@/utils";
import { Analytics } from "@vercel/analytics/next";

export const metadata = generateMetadata();

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.budgetndiostory.org";
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Budget Ndio Story",
  alternateName: "BNS",
  url: siteUrl,
  logo: `${siteUrl}/logo.svg`,
  description:
    "Budget Ndio Story is a youth-led initiative in Kenya that translates public budgets into accessible, actionable information to promote civic engagement and accountability.",
  sameAs: [
    "https://www.youtube.com/@budgetndiostory",
    "https://www.linkedin.com/company/budget-ndio-story/",
    "https://www.tiktok.com/@budget.ndio.story",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Budget Ndio Story",
  url: siteUrl,
  inLanguage: "en-KE",
  description:
    "A youth-led civic platform in Kenya making national and county budgets understandable and actionable.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-dvh bg-background text-foreground font-base antialiased overflow-x-hidden dark",
          base.variable,
          heading.variable,
          handwriting.variable,
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Providers>
          <LoadingScreen />
          <FlareCursor />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
