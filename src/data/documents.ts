import { withFallback } from "@/data/adapter";
import type {
  DocumentType,
  DocumentFile,
  FetchDocumentsResult,
} from "@/constants/documents";
import {
  fetchDocumentsFromAPI,
} from "@/constants/documents";

export type {
  DocumentType,
  DocumentFile,
  FetchDocumentsResult,
};

const DEFAULT_DOCUMENTS: DocumentType[] = [];

let _documents: DocumentType[] = [...DEFAULT_DOCUMENTS];

function sortByNameAZ(docs: DocumentType[]): DocumentType[] {
  return [...docs].sort((a, b) => a.title.localeCompare(b.title));
}

export const documentData = {
  get: (): DocumentType[] => _documents,
  set: (items: DocumentType[]) => {
    _documents = sortByNameAZ(items);
  },
  fetch: (): Promise<FetchDocumentsResult> =>
    withFallback(
      "documents",
      async () => {
        const result = await fetchDocumentsFromAPI();
        if (result.error) throw new Error(result.error);
        _documents = sortByNameAZ(result.documents);
        return result;
      },
      () => ({ documents: _documents }),
    ),
};

export function extractYearFromName(name: string): number | null {
  const match = name.match(/\b(20\d{2})\b/);
  if (match) return parseInt(match[1], 10);
  const fyMatch = name.match(/(?:^|\s)FY\s*(\d{4})[-/](\d{2,4})/i);
  if (fyMatch)
    return parseInt(
      fyMatch[2].length === 2 ? `20${fyMatch[2]}` : fyMatch[2],
      10,
    );
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "\u2014";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatDate(timestamp: number): string {
  if (!timestamp) return "\u2014";
  return new Date(timestamp * 1000).toLocaleDateString();
}

export type FlatFile = {
  id: string;
  name: string;
  size: number;
  url: string;
  downloadUrl: string;
  modified: number;
  folderName: string;
  docType: string | null;
  year: number | null;
  county: string | null;
};
