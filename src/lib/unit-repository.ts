import {
  fetchDocumentsFromAPI,
  type DocumentType,
  type FetchDocumentsResult,
} from "@/constants/documents";

/** Map learning unit abbreviation → doc repository folder name prefixes */
const UNIT_REPO_PREFIXES: Record<string, string[]> = {
  BPS: ["BPS"],
  BROP: ["BROP"],
  CFSP: ["CFSP"],
  ADP: ["ADP"],
  PBB: ["PBB"],
  CBR: ["CBR"],
  CFA: ["CFA"],
  FB: ["FB"],
  "APP ACT": ["APP ACT", "APP"],
  MTEF: ["MTEF"],
  DoRB: ["DoRB", "DOR"],
  CARB: ["CARB"],
  Estimates: ["FB", "PBB"],
};

export function repositoryPrefixesForUnit(
  abbreviation?: string | null,
  title?: string | null,
): string[] {
  if (abbreviation) {
    const key = abbreviation.trim().toUpperCase();
    for (const [abbr, prefixes] of Object.entries(UNIT_REPO_PREFIXES)) {
      if (abbr.toUpperCase() === key) return prefixes;
    }
    return [abbreviation.trim()];
  }
  if (title) {
    const upper = title.toUpperCase();
    if (upper.includes("BUDGET POLICY")) return ["BPS"];
    if (upper.includes("OUTLOOK")) return ["BROP"];
    if (upper.includes("FISCAL STRATEGY")) return ["CFSP"];
  }
  return [];
}

export function filterDocumentsForUnit(
  documents: DocumentType[],
  abbreviation?: string | null,
  title?: string | null,
): DocumentType[] {
  const prefixes = repositoryPrefixesForUnit(abbreviation, title);
  if (!prefixes.length) return [];
  return documents.filter((doc) =>
    prefixes.some(
      (p) =>
        doc.folderName.toUpperCase().startsWith(p.toUpperCase()) ||
        doc.title.toUpperCase() === p.toUpperCase(),
    ),
  );
}

export async function fetchUnitDocumentsServer(
  abbreviation?: string | null,
  title?: string | null,
): Promise<FetchDocumentsResult> {
  const result = await fetchDocumentsFromAPI();
  return {
    ...result,
    documents: filterDocumentsForUnit(result.documents, abbreviation, title),
  };
}
