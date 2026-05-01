export type DocumentFile = {
  name: string;
  size: number;
  url: string;
  downloadUrl: string;
  modified: number;
};

import { API_BASE_URL } from "@/lib/api-config";


export type DocumentType = {
  id: string;
  title: string;
  fullName: string;
  description: string;
  years: string[];
  files: DocumentFile[];
  folderName: string; // Full folder name from API (e.g., "PBB 2010-2026")
};

// Mapping from folder name prefix to document type info
const DOCUMENT_TYPE_MAP: Record<
  string,
  { id: string; title: string; fullName: string; description: string }
> = {
  PBB: {
    id: "pbb",
    title: "PBB",
    fullName: "Programme-Based Budgeting",
    description: "Programme-Based Budgeting reports",
  },
  ADP: {
    id: "adp",
    title: "ADP",
    fullName: "Annual Development Plan",
    description: "Annual Development Plan documents",
  },
  CBR: {
    id: "cbr",
    title: "CBR",
    fullName: "County Budget Reviews",
    description: "County Budget Reviews",
  },
  BPS: {
    id: "bps",
    title: "BPS",
    fullName: "Budget Policy Statement",
    description: "Budget Policy Statement framework",
  },
  BROP: {
    id: "brop",
    title: "BROP",
    fullName: "Budget Review and Outlook Papers",
    description: "Budget Review and Outlook Papers",
  },
  CFA: {
    id: "cfa",
    title: "CFA",
    fullName: "Controller and Auditor General",
    description: "Controller and Auditor General Reports",
  },
  CFSP: {
    id: "cfsp",
    title: "CFSP",
    fullName: "County Fiscal Strategy Papers",
    description: "County Fiscal Strategy Papers",
  },
  "APP ACT": {
    id: "app-act",
    title: "APP ACT",
    fullName: "Appropriation Act",
    description: "Appropriation Act budget documents",
  },
  FB: {
    id: "fb",
    title: "FB",
    fullName: "Fiscal Budget",
    description: "Fiscal Budget documents and analyses",
  },
  AGR: {
    id: "agr",
    title: "AGR",
    fullName: "Agriculture",
    description: "Agriculture budget reports and allocations",
  },
  ERE: {
    id: "ere",
    title: "ERE",
    fullName: "Economic Recovery Expenditure",
    description: "Economic Recovery Expenditure reports",
  },
  CIDP: {
    id: "cidp",
    title: "CIDP",
    fullName: "County Integrated Development Plans",
    description: "County Integrated Development Plans",
  },
};

function parseYearsFromFolderName(folderName: string): string[] {
  // Extract year range from folder name like "PBB 2010-2026" or "BROP 2010-2026/"
  const match = folderName.match(/(\d{4})-(\d{4})/);
  if (match) {
    const startYear = parseInt(match[1], 10);
    const endYear = parseInt(match[2], 10);
    const years: string[] = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year.toString());
    }
    return years;
  }
  return [];
}

function extractPrefixFromFolderName(folderName: string): string | null {
  // Extract the prefix (e.g., "PBB", "BROP", "APP ACT") from folder name
  const match = folderName.match(/^([A-Z\s]+)\s+\d{4}-\d{4}/);
  if (match) {
    return match[1].trim();
  }
  return null;
}

export function getAllDocumentIds(): string[] {
  return Object.keys(DOCUMENT_TYPE_MAP);
}

export function getDocumentById(id: string): DocumentType | undefined {
  // This will be used by the static page generation - return basic info without files
  const normalizedId = id.toUpperCase();
  const info = DOCUMENT_TYPE_MAP[normalizedId];
  if (info) {
    return {
      ...info,
      years: [], // Empty years for static generation, will be populated client-side
      files: [],
      folderName: `${info.title} 2010-2026`, // Fallback folder name
    };
  }
  return undefined;
}

// Parse folder name to get document type info
function getDocumentInfoFromFolder(
  folderName: string,
): { id: string; title: string; fullName: string; description: string } | null {
  const prefix = extractPrefixFromFolderName(folderName);
  if (!prefix) return null;

  // Try exact match first
  if (DOCUMENT_TYPE_MAP[prefix]) {
    return DOCUMENT_TYPE_MAP[prefix];
  }

  // Try case-insensitive match
  for (const [key, value] of Object.entries(DOCUMENT_TYPE_MAP)) {
    if (key.toLowerCase() === prefix.toLowerCase()) {
      return value;
    }
  }

  return null;
}

// Transform API response to DocumentType list
export function transformRepositoryData(repositoryData: any): DocumentType[] {
  const documents: DocumentType[] = [];

  if (!repositoryData?.folders || !repositoryData?.documents) {
    return documents;
  }

  const baseUrl = API_BASE_URL;
  const normalizeFolderPath = (path: string) =>
    path.replace(/^\/+|\/+$/g, "").trim();
  const toAbsoluteUrl = (path: string) =>
    path.startsWith("http") ? path : `${baseUrl}${path}`;
  const getDownloadUrl = (viewUrl: string) => {
    const separator = viewUrl.includes("?") ? "&" : "?";
    return `${viewUrl}${separator}download=1`;
  };

  for (const folder of repositoryData.folders) {
    const docInfo = getDocumentInfoFromFolder(folder.name);
    if (!docInfo) continue;

    const years = parseYearsFromFolderName(folder.name);
    const normalizedFolderPath = normalizeFolderPath(folder.path || "");
    
    // Filter documents that belong to this folder
    const folderFiles = repositoryData.documents
      .filter((doc: any) => {
        const normalizedDocFolder = normalizeFolderPath(doc.folder || "");
        return (
          normalizedDocFolder === normalizedFolderPath ||
          normalizedDocFolder.startsWith(`${normalizedFolderPath}/`)
        );
      })
      .map((doc: any) => {
        const viewUrl = toAbsoluteUrl(doc.url);
        return {
          name: doc.name,
          size: doc.size,
          url: viewUrl,
          downloadUrl: getDownloadUrl(viewUrl),
          modified: doc.modified || 0,
        };
      });

    if (folderFiles.length > 0) {
      documents.push({
        id: docInfo.id,
        title: docInfo.title,
        fullName: docInfo.fullName,
        description: docInfo.description,
        years,
        files: folderFiles,
        folderName: folder.name,
      });
    }
  }

  return documents;
}

export type FetchDocumentsResult = {
  documents: DocumentType[];
  error?: string;
};

let cachedDocumentsResult: FetchDocumentsResult | null = null;
let inflightDocumentsPromise: Promise<FetchDocumentsResult> | null = null;

async function fetchDocumentsFromApiOnce(): Promise<FetchDocumentsResult> {
  try {
    const endpoints = [
      `${API_BASE_URL}/docrepository/`,
      `${API_BASE_URL}/api/docrepository/`,
    ];
    let data: any = null;
    let lastStatusText = "";
    let lastStatusCode = 0;
    for (const endpoint of endpoints) {
      const response = await fetch(endpoint, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });
      if (!response.ok) {
        lastStatusCode = response.status;
        lastStatusText = response.statusText;
        continue;
      }
      data = await response.json();
      break;
    }

    if (!data) {
      console.error(
        "Document repository API returned non-ok status for all endpoints:",
        lastStatusCode,
        lastStatusText,
      );
      return {
        documents: [],
        error:
          "The document repository is temporarily unavailable. Please try again later.",
      };
    }

    if (!data || !Array.isArray(data.folders) || !Array.isArray(data.documents)) {
      console.error("Document repository API returned invalid payload:", data);
      return {
        documents: [],
        error:
          "The document repository is temporarily unavailable. Please try again later.",
      };
    }
    return {
      documents: transformRepositoryData(data),
    };
  } catch (error) {
    const maybeCause = (error as { cause?: { code?: string; reason?: string } })?.cause;
    const isTlsAltNameIssue = maybeCause?.code === "ERR_TLS_CERT_ALTNAME_INVALID";
    if (isTlsAltNameIssue) {
      console.warn(
        "Document repository TLS certificate mismatch for configured API base URL; serving fallback empty documents.",
      );
    } else {
      console.error("Failed to fetch documents from API:", error);
    }
    return {
      documents: [],
      error:
        "The document repository is temporarily unavailable. Please try again later.",
    };
  }
}

// Fetch documents from the API (deduplicated per server runtime)
export async function fetchDocumentsFromAPI(): Promise<FetchDocumentsResult> {
  if (cachedDocumentsResult) {
    return cachedDocumentsResult;
  }

  if (inflightDocumentsPromise) {
    return inflightDocumentsPromise;
  }

  inflightDocumentsPromise = fetchDocumentsFromApiOnce()
    .then((result) => {
      cachedDocumentsResult = result;
      return result;
    })
    .finally(() => {
      inflightDocumentsPromise = null;
    });

  return inflightDocumentsPromise;
}
