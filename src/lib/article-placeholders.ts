/** Rotating hero placeholders (same assets as deep-dive cards until API images ship). */
export const ARTICLE_PLACEHOLDER_IMAGES = [
  {
    src: "/images/explainer-formulation.png",
    accent: "from-blue-400/85 via-indigo-400/80 to-violet-500/75",
  },
  {
    src: "/images/explainer-approval.png",
    accent: "from-amber-400/85 via-orange-400/80 to-rose-500/75",
  },
  {
    src: "/images/explainer-implementation.png",
    accent: "from-emerald-400/85 via-teal-400/80 to-cyan-500/75",
  },
  {
    src: "/images/explainer-audit.png",
    accent: "from-rose-400/85 via-pink-400/80 to-fuchsia-500/75",
  },
] as const;

export function articlePlaceholderForIndex(index: number) {
  return ARTICLE_PLACEHOLDER_IMAGES[index % ARTICLE_PLACEHOLDER_IMAGES.length];
}

export function articlePlaceholderForSlug(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash + slug.charCodeAt(i)) % ARTICLE_PLACEHOLDER_IMAGES.length;
  }
  return articlePlaceholderForIndex(hash);
}
