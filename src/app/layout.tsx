import LoadingScreen from "@/components/global/loading-screen";
import Providers from "@/components/global/providers";
import WhatsAppSupport from "@/components/global/whatsapp-support";
import CookieConsentWrapper from "@/components/global/cookie-consent-wrapper";
import { base, heading } from "@/constants";
import "@/styles/globals.css";
import { cn, generateMetadata } from "@/utils";
import { SiteAnalytics } from "@/components/analytics/site-analytics";
import type { Viewport } from "next";
import Script from "next/script";

export const metadata = generateMetadata();

export const viewport: Viewport = {
  themeColor: "#020817",
  width: "device-width",
  initialScale: 1,
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://budgetndiostory.org";
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

const studioSchema = {
  "@context": "https://schema.org",
  "@type": ["ProfessionalService", "VideoProductionService"],
  name: "BNS Studios",
  alternateName: ["Budget Ndio Story Studios", "BNS Impact Production"],
  parentOrganization: {
    "@type": "Organization",
    name: "Budget Ndio Story",
    url: siteUrl,
  },
  description:
    "Kenya's premier commercial civic creative agency and impact production house. Commissioning broadcast podcast series, cinema field documentaries, 2D motion graphics, explainer videos, and civic town halls across Kenya and East Africa.",
  url: `${siteUrl}/bns-studio`,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/og-image.jpg`,
  email: "info@budgetndiostory.org",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
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
            "High-fidelity field cinematography, human interest investigations, and observational storytelling across 47 counties.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Audio Journalism & Podcast Series",
          description:
            "Multi-mic studio recording, field soundscapes, and bilingual investigative debate series.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Animation & Visual Data Design",
          description:
            "2D character animation, kinetic typography, and motion infographics.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Explainer Videos & Forensic Visual Memos",
          description:
            "Step-by-step video dissections of national bills and budget allocations.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Town Hall Convening & Citizen Barazas",
          description:
            "Deliberative community town hall design, live streaming, and dialogue facilitation.",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://bnske.budgetndiostory.org" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(studioSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
                { "@type": "ListItem", position: 2, name: "BNS Studios", item: `${siteUrl}/bns-studio` },
                { "@type": "ListItem", position: 3, name: "Work", item: `${siteUrl}/work` },
                { "@type": "ListItem", position: 4, name: "Programmes", item: `${siteUrl}/programmes` },
                { "@type": "ListItem", position: 5, name: "Learn", item: `${siteUrl}/learn` },
                { "@type": "ListItem", position: 6, name: "Reports", item: `${siteUrl}/reports` },
                { "@type": "ListItem", position: 7, name: "About", item: `${siteUrl}/about` },
              ],
            }),
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-dvh bg-background text-foreground font-base antialiased overflow-x-clip",
          base.variable,
          heading.variable,
        )}
      >
        <Providers>
          <LoadingScreen />
          <WhatsAppSupport />
          {children}
          <CookieConsentWrapper />
        </Providers>
        <SiteAnalytics />
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "wugt5any7z");`}
        </Script>
        <Script id="register-sw" strategy="afterInteractive">
          {`if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`}
        </Script>
      </body>
    </html>
  );
}
