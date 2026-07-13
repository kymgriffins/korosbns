import type { Metadata } from "next";
import { ModuleDetailView } from "@/components/learn/module-detail-view";
import { learningData } from "@/data/learning";
import { canonicalUrl, metaDescription } from "@/utils/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const module = await learningData.modules.fetchBySlug(slug).catch(() => null);

  const titleBase = module?.title
    ? `${module.title} — Kenya Budget Learning`
    : slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

  const description = metaDescription(
    module?.description ||
      `Learn ${titleBase} with Budget Ndio Story — civic modules on Kenya's public finance, Finance Bill, and citizen participation.`,
  );

  const canonical = canonicalUrl(`/learn/modules/${slug}`);
  const image =
    module?.image_url && module.image_url.startsWith("http")
      ? module.image_url
      : "/logo.svg";

  const keywords = [
    module?.title,
    "Kenya budget learning",
    "civic education Kenya",
    "public finance Kenya",
    "Finance Bill explained",
    "budget literacy",
    "Budget Ndio Story",
    slug.replace(/-/g, " "),
  ].filter(Boolean) as string[];

  return {
    title: `${titleBase} | Budget Ndio Story`,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title: `${titleBase} | Budget Ndio Story`,
      description,
      url: canonical,
      type: "article",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titleBase} | Budget Ndio Story`,
      description,
      images: [image],
    },
  };
}

export default async function ModuleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const module = await learningData.modules.fetchBySlug(slug).catch(() => null);

  const jsonLd =
    module != null
      ? {
          "@context": "https://schema.org",
          "@type": "Course",
          name: module.title,
          description: module.description,
          url: canonicalUrl(`/learn/modules/${slug}`),
          provider: {
            "@type": "Organization",
            name: "Budget Ndio Story",
            url: "https://budgetndiostory.org",
          },
          educationalLevel: "Beginner",
          inLanguage: "en-KE",
          isAccessibleForFree: true,
          about: [
            "Kenya public finance",
            "National budget",
            "Civic education",
          ],
          ...(module.image_url
            ? { image: module.image_url }
            : {}),
        }
      : null;

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <ModuleDetailView />
    </>
  );
}
