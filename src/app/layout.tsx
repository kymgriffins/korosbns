import Script from "next/script";
import LoadingScreen from "@/components/global/loading-screen";
import Providers from "@/components/global/providers";
import { base, handwriting, heading } from "@/constants";
import "@/styles/globals.css";
import { cn, generateMetadata } from "@/utils";
import { Analytics } from "@vercel/analytics/next";

export const metadata = generateMetadata();

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://app.budgetndiostory.org";
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
      <head>
        <script
          type="application/ld+json"
          id="organization-schema"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          id="website-schema"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={cn(
          "min-h-dvh bg-surface-0 text-text-1 font-base antialiased overflow-x-hidden relative",
          base.variable,
          heading.variable,
          handwriting.variable,
        )}
      >
        {/* Cinematic Depth Architecture */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Layer 1: Base Fog */}
          <div className="absolute inset-0 bg-radial-gradient from-accent/5 to-transparent dark:from-accent/[0.03] dark:to-transparent" />
          
          {/* Layer 2: Ambient Noise (Sophisticated) */}
          <div className="absolute inset-0 bg-noise opacity-[0.02] mix-blend-overlay" />
          
          {/* Layer 3: Floating Highlights (Restrained) */}
          <div className="absolute top-[-20%] left-[10%] w-[50vw] h-[50vw] bg-accent/[0.03] blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[10%] w-[40vw] h-[40vw] bg-accent/[0.02] blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
        </div>

        <Providers>
          <LoadingScreen />
          <div className="relative z-10">
            {children}
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
