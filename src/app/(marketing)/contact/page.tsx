import { Suspense } from "react";
import type { Metadata } from "next";
import ContactPageLayout from "@/layouts/ContactPage";
import { CONTACT_INTENT_COPY, PROGRAMMES_CLOSING } from "@/constants/programmes-content";
import { canonicalUrl } from "@/utils/metadata";

type PageProps = {
  searchParams: Promise<{ intent?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { intent: raw } = await searchParams;
  const intentKey = raw?.trim().toLowerCase() ?? "";
  if (intentKey === "partner") {
    return {
      title: PROGRAMMES_CLOSING.seoTitle,
      description: PROGRAMMES_CLOSING.seoDescription,
      alternates: { canonical: canonicalUrl("/contact") },
      openGraph: {
        title: PROGRAMMES_CLOSING.seoTitle,
        description: PROGRAMMES_CLOSING.seoDescription,
        url: "/contact",
      },
    };
  }
  const intent = CONTACT_INTENT_COPY[intentKey];
  if (intent) {
    return {
      title: `${intent.title} | Budget Ndio Story`,
      description: intent.blurb,
      alternates: { canonical: canonicalUrl("/contact") },
      openGraph: {
        title: `${intent.title} | Budget Ndio Story`,
        description: intent.blurb,
        url: "/contact",
      },
    };
  }
  return {
    title: "Contact | Budget Ndio Story",
    description:
      "Get in touch with the Budget Ndio Story team. Share your views on Kenya's Finance Bill, Appropriation Bill, or parliamentary budget process.",
    keywords: [
      "contact Budget Ndio Story",
      "Kenya budget questions",
      "Finance Bill inquiry",
      "public participation budget",
      "civic engagement Kenya",
    ],
    alternates: { canonical: canonicalUrl("/contact") },
    openGraph: {
      title: "Contact | Budget Ndio Story",
      description:
        "Reach out to the Budget Ndio Story team about Kenya's budget, Finance Bill, and civic education initiatives.",
      url: "/contact",
    },
  };
}

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactPageLayout />
    </Suspense>
  );
}
