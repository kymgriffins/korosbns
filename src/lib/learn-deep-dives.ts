const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.budgetndiostory.org"
).replace(/\/+$/, "");

export type DeepDiveArticle = {
  slug: string;
  title: string;
  summary: string;
  sourceLabel: string;
  html: string;
  updatedAt?: string;
};

const FALLBACK_ARTICLES: Record<string, DeepDiveArticle> = {
  bps: {
    slug: "bps",
    title: "Budget Policy Statement (BPS) Deep Dive",
    summary:
      "A complete guided explainer on priorities, fiscal strategy, and citizen-facing outcomes in the BPS cycle.",
    sourceLabel: "BPS",
    html: `
      <p>The BPS sets the national fiscal direction before the full budget. This guide focuses on policy intent, ceilings, and delivery outcomes.</p>
      <h2>How to read the BPS quickly</h2>
      <ul>
        <li>Start with macro assumptions and fiscal outlook.</li>
        <li>Track sector priorities and ceilings.</li>
        <li>Compare promises against past execution trends.</li>
      </ul>
    `,
  },
  "cfsp-guidelines": {
    slug: "cfsp-guidelines",
    title: "CFSP Guidelines (Docs-Aligned Draft)",
    summary:
      "A structured draft guide from County Fiscal Strategy Paper folders in the repository, designed for iterative expansion.",
    sourceLabel: "CFSP",
    html: `
      <p>This draft is generated from <strong>CFSP</strong> repository folder guidance and is meant to be refined as new files are synced.</p>
      <h2>Reader checklist</h2>
      <ul>
        <li>County revenue assumptions and realism.</li>
        <li>Sector priorities and trade-offs.</li>
        <li>Public participation references and implementation accountability.</li>
      </ul>
    `,
  },
  "brop-guidelines": {
    slug: "brop-guidelines",
    title: "BROP Guidelines (Docs-Aligned Draft)",
    summary:
      "A structured draft guide from Budget Review and Outlook Papers to support trend comparison and accountability review.",
    sourceLabel: "BROP",
    html: `
      <p>This draft is derived from <strong>BROP</strong> repository folder standards and should be expanded through WYSIWYG-authored updates.</p>
      <h2>Reader checklist</h2>
      <ul>
        <li>Prior-year performance vs planned outcomes.</li>
        <li>Revenue and expenditure variance analysis.</li>
        <li>Outlook risks and corrective actions.</li>
      </ul>
    `,
  },
};

const toHtml = (content: string) => {
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  if (hasHtml) return content;
  return content
    .split(/\n{2,}/)
    .map((chunk) => `<p>${chunk.replace(/\n/g, "<br />")}</p>`)
    .join("");
};

export async function fetchDeepDiveArticle(slug: string): Promise<DeepDiveArticle> {
  const fallback = FALLBACK_ARTICLES[slug];

  // BPS has a dedicated handcrafted page.
  if (slug === "bps") {
    return fallback;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/deep-dives/${slug}/`, {
      next: { revalidate: 600 },
    });
    if (!response.ok || !fallback) {
      return fallback;
    }
    const data = await response.json();
    if (!data || typeof data !== "object") {
      return fallback;
    }

    return {
      slug,
      title: String(data.title || fallback.title),
      summary: String(data.summary || fallback.summary),
      sourceLabel: String(data.source_doc_type || fallback.sourceLabel),
      html: toHtml(String(data.content_html || fallback.html)),
      updatedAt: typeof data.updated_at === "string" ? data.updated_at : undefined,
    };
  } catch {
    return fallback;
  }
}

export const deepDiveCards = [
  {
    id: "bps",
    title: "BPS Master Deep Dive",
    subtitle: "Complete and production-ready explainer mapped to Budget Policy Statement content.",
    href: "/learn/bps",
    image: "/images/gradient.svg",
    accent: "from-cyan-400/85 via-sky-400/80 to-blue-500/75",
  },
  {
    id: "cfsp-guidelines",
    title: "CFSP Guidelines Draft",
    subtitle: "Docs-repository guided structure for County Fiscal Strategy Papers.",
    href: "/learn/deep-dives/cfsp-guidelines",
    image: "/images/project.svg",
    accent: "from-orange-400/85 via-rose-400/80 to-fuchsia-500/75",
  },
  {
    id: "brop-guidelines",
    title: "BROP Guidelines Draft",
    subtitle: "Docs-repository guided structure for Budget Review and Outlook Papers.",
    href: "/learn/deep-dives/brop-guidelines",
    image: "/images/invoices.svg",
    accent: "from-violet-400/85 via-indigo-400/80 to-blue-500/75",
  },
] as const;

