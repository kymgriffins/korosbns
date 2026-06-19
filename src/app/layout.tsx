import FlareCursor from "@/components/global/flare-cursor";
import LoadingScreen from "@/components/global/loading-screen";
import Providers from "@/components/global/providers";
import WhatsAppSupport from "@/components/global/whatsapp-support";
import { base, handwriting, heading } from "@/constants";
import "@/styles/globals.css";
import { cn, generateMetadata } from "@/utils";
import { Analytics } from "@vercel/analytics/next";
import type { Viewport } from "next";
import Script from "next/script";

export const metadata = generateMetadata();

export const viewport: Viewport = {
  themeColor: "#020817",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
  "@type": "LocalBusiness",
  name: "BNS Studio",
  parentOrganization: {
    "@type": "Organization",
    name: "Budget Ndio Story",
  },
  description:
    "Professional videography, photography, studio rental, and post-production services in Kenya.",
  url: `${siteUrl}/bns-studio`,
  telephone: "+254700000000",
  email: "studio@budgetndiostory.org",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  priceRange: "KES 5,000 - 100,000",
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
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
                { "@type": "ListItem", "position": 2, "name": "Learn", "item": `${siteUrl}/learn` },
                { "@type": "ListItem", "position": 3, "name": "About", "item": `${siteUrl}/about` },
                { "@type": "ListItem", "position": 4, "name": "FAQ", "item": `${siteUrl}/faq` },
              ],
            }),
          }}
        />
      </head>
      <body
        className={cn(
          "min-h-dvh bg-background text-foreground font-base antialiased overflow-x-hidden",
          base.variable,
          heading.variable,
          handwriting.variable,
        )}
      >
        <Providers>
          <LoadingScreen />
          <FlareCursor />
          <WhatsAppSupport />
          {children}
        </Providers>
        <Analytics />
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
