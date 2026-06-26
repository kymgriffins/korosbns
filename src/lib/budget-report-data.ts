import type {
  BudgetReportProfile,
  ChapterReportData,
} from "@/types/budget-report";

const PLACEHOLDER_IMAGE = /placehold\.co/i;

/** Prefer live API `metadata.report`; no client-side fallback figures. */
export function resolveReportProfile(
  metadata?: Record<string, unknown> | null,
): BudgetReportProfile | null {
  const report = metadata?.report as BudgetReportProfile | undefined;
  if (report?.fiscal_year && report.kpis?.length) return report;
  return null;
}

export function resolveChapterReport(
  data?: Record<string, unknown> | ChapterReportData | null,
): ChapterReportData {
  if (!data) return {};
  if ("kpis" in data || "chart" in data || "callouts" in data) {
    return data as ChapterReportData;
  }
  const nested = (data as Record<string, unknown>).report;
  return (nested as ChapterReportData) ?? {};
}

export function parseArticleBlocks(text: string): Array<
  | { type: "heading"; content: string }
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string }
> {
  if (!text?.trim()) return [];

  const blocks: ReturnType<typeof parseArticleBlocks> = [];
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*\/?>/gi;

  const cleaned = text.replace(imgRegex, (_, src, alt) => {
    if (src && !PLACEHOLDER_IMAGE.test(src)) {
      blocks.push({ type: "image", src, alt: alt || "Chart" });
    }
    return "\n\n";
  });

  const paragraphs = cleaned.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

  for (const para of paragraphs) {
    if (para.match(/^[A-Z][A-Z\s/&]{2,}:?$/) || para.startsWith("WHAT THIS MEANS FOR YOU")) {
      blocks.push({ type: "heading", content: para.replace(/:$/, "") });
      continue;
    }
    if (para.includes("\n- ") || para.includes("\n• ")) {
      const items = para
        .split("\n")
        .map((l) => l.replace(/^[-•]\s*/, "").trim())
        .filter(Boolean);
      blocks.push({ type: "list", items });
      continue;
    }
    blocks.push({ type: "paragraph", content: para });
  }

  return blocks;
}

export function filterRealImageUrls(urls?: string[]): string[] {
  return (urls ?? []).filter((url) => url && !PLACEHOLDER_IMAGE.test(url));
}

export type {
  BudgetKpi,
  BudgetChartPoint,
  BudgetComparisonRow,
  BudgetCallout,
  BudgetChartConfig,
} from "@/types/budget-report";
