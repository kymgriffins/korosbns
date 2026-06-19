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

export function extractPrefixFromFolderName(folderName: string): string | null {
  // Extract the prefix (e.g., "PBB", "BROP", "APP ACT") from folder name
  const normalized = folderName.replace(/\/+$/, "").trim();
  const match = normalized.match(/^(.+?)\s+\d{4}-\d{4}/);
  if (match) {
    return match[1].trim();
  }
  return null;
}

function toDocumentId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

export function getAllDocumentIds(): string[] {
  return Object.values(DOCUMENT_TYPE_MAP).map((entry) => entry.id);
}

export function getDocumentById(id: string): DocumentType | undefined {
  // Used by static metadata: resolve by URL slug (e.g. "pbb", "app-act")
  const slug = id.toLowerCase();
  const info = Object.values(DOCUMENT_TYPE_MAP).find((entry) => entry.id === slug);
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
): { id: string; title: string; fullName: string; description: string } {
  const normalizedFolderName = folderName.replace(/\/+$/, "").trim();
  const prefix = extractPrefixFromFolderName(normalizedFolderName) || normalizedFolderName;

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

  const fallbackTitle = prefix.replace(/\s+/g, " ").trim();
  return {
    id: toDocumentId(fallbackTitle),
    title: fallbackTitle,
    fullName: `${fallbackTitle} Documents`,
    description: `${fallbackTitle} repository documents`,
  };
}

// Transform API response to DocumentType list
export function transformRepositoryData(repositoryData: any): DocumentType[] {
  const documents: DocumentType[] = [];

  // Support both formats: { folders, documents } (old) and { path, items, count } (new route handler)
  let folders: any[];
  let docs: any[];
  let links: any[] = [];

  if (Array.isArray(repositoryData.items) && !Array.isArray(repositoryData.folders)) {
    // New format: { path, items, count, links } — split items by is_directory
    folders = repositoryData.items.filter((i: any) => i.is_directory);
    docs = repositoryData.items.filter((i: any) => !i.is_directory).map((item: any) => {
      // Derive parent folder path from item path
      const parts = item.path.split("/").filter(Boolean);
      parts.pop();
      const folder = parts.join("/");
      return {
        name: item.name,
        folder,
        url: `/api/docrepository?path=${encodeURIComponent(item.path)}`,
        size: item.size,
        modified: item.modified,
      };
    });
    // Collect links from the response
    if (Array.isArray(repositoryData.links)) {
      links = repositoryData.links.map((link: any) => ({
        id: link.id,
        title: link.title,
        url: `/api/docrepository/link/${encodeURIComponent(link.id)}?mode=view`,
        downloadUrl: `/api/docrepository/link/${encodeURIComponent(link.id)}?mode=download`,
        folder: link.folder_path || "",
        size: 0,
        modified: 0,
        isLink: true,
      }));
    }
  } else if (Array.isArray(repositoryData.folders) && Array.isArray(repositoryData.documents)) {
    // Old format: { folders, documents }
    folders = repositoryData.folders;
    docs = repositoryData.documents;
  } else {
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

  for (const folder of folders) {
    const docInfo = getDocumentInfoFromFolder(folder.name);

    const years = parseYearsFromFolderName(folder.name);
    const normalizedFolderPath = normalizeFolderPath(folder.path || "");

    // Filter documents that belong to this folder
    const folderFiles = docs
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

    // Filter links that belong to this folder
    const folderLinks = links
      .filter((link: any) => {
        const normalizedLinkFolder = normalizeFolderPath(link.folder || "");
        return (
          normalizedLinkFolder === normalizedFolderPath ||
          normalizedLinkFolder.startsWith(`${normalizedFolderPath}/`)
        );
      })
      .map((link: any) => ({
        name: link.title,
        size: link.size,
        url: link.url,
        downloadUrl: link.downloadUrl,
        modified: link.modified || 0,
      }));

    const allFiles = [...folderFiles, ...folderLinks];

    if (allFiles.length > 0) {
      documents.push({
        id: docInfo.id,
        title: docInfo.title,
        fullName: docInfo.fullName,
        description: docInfo.description,
        years,
        files: allFiles,
        folderName: folder.name,
      });
    }
  }

  // Handle root-level links (folder_path = "")
  const rootLinks = links
    .filter((link: any) => !link.folder || normalizeFolderPath(link.folder) === "")
    .map((link: any) => ({
      name: link.title,
      size: link.size,
      url: link.url,
      downloadUrl: link.downloadUrl,
      modified: link.modified || 0,
    }));

  if (rootLinks.length > 0) {
    documents.push({
      id: "external-links",
      title: "External Links",
      fullName: "External Links",
      description: "External document links and resources",
      years: [],
      files: rootLinks,
      folderName: "External Links",
    });
  }

  return documents;
}

export type FetchDocumentsResult = {
  documents: DocumentType[];
  error?: string;
};

const DOCUMENTS_CACHE_TTL_MS = 2 * 60 * 1000;
let cachedDocumentsResult: FetchDocumentsResult | null = null;
let cachedDocumentsAt = 0;
let inflightDocumentsPromise: Promise<FetchDocumentsResult> | null = null;

function getRepositoryFetchUrls(): string[] {
  const api = API_BASE_URL.replace(/\/+$/, "");
  const urls: string[] = [];

  // Prefer same-origin proxy (works from browser + RSC; avoids CORS and some TLS issues)
  if (typeof window !== "undefined") {
    urls.push("/api/docrepository/");
  } else {
    const siteBase =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`
        : "") ||
      "http://localhost:3000";
    urls.push(`${siteBase}/api/docrepository/`);
  }

  urls.push(
    `${api}/docrepository/`,
    `${api}/api/docrepository/`,
    `${api}/repository/`,
    `${api}/api/repository/`,
  );
  return urls;
}

async function fetchDocumentsFromApiOnce(): Promise<FetchDocumentsResult> {
  try {
    const endpoints = getRepositoryFetchUrls();
    let data: any = null;
    let lastStatusText = "";
    let lastStatusCode = 0;
    for (const endpoint of endpoints) {
      const response = await fetch(endpoint, {
        cache: "no-store",
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

    if (!data || (!Array.isArray(data.items) && (!Array.isArray(data.folders) || !Array.isArray(data.documents)))) {
      console.error("Document repository API returned invalid payload:", data);
      return {
        documents: [],
        error:
          "The document repository is temporarily unavailable. Please try again later.",
      };
    }

    // If using new format with items, recursively fetch subfolder contents
    if (Array.isArray(data.items) && !Array.isArray(data.folders)) {
      const dirs = data.items.filter((i: any) => i.is_directory);
      const allItems = [...data.items];

      // Fetch each subfolder's contents (limited depth to avoid excessive requests)
      const fetchSubfolder = async (dirPath: string, depth = 0) => {
        if (depth > 2) return;
        const endpoint = endpoints[0];
        try {
          const subRes = await fetch(
            `${endpoint}?path=${encodeURIComponent(dirPath)}`,
            { cache: "no-store" },
          );
          if (!subRes.ok) return;
          const subData = await subRes.json();
          if (Array.isArray(subData.items)) {
            for (const item of subData.items) {
              allItems.push(item);
              if (item.is_directory) {
                await fetchSubfolder(item.path, depth + 1);
              }
            }
          }
        } catch {
          // Skip failed subfolders silently
        }
      };

      await Promise.all(dirs.map((d: any) => fetchSubfolder(d.path)));
      data.items = allItems;
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
  if (
    cachedDocumentsResult &&
    Date.now() - cachedDocumentsAt < DOCUMENTS_CACHE_TTL_MS
  ) {
    return cachedDocumentsResult;
  }

  if (inflightDocumentsPromise) {
    return inflightDocumentsPromise;
  }

  inflightDocumentsPromise = fetchDocumentsFromApiOnce()
    .then((result) => {
      // Do not cache failures — otherwise a transient outage sticks for the whole runtime
      if (!result.error) {
        cachedDocumentsResult = result;
        cachedDocumentsAt = Date.now();
      }
      return result;
    })
    .finally(() => {
      inflightDocumentsPromise = null;
    });

  return inflightDocumentsPromise;
}
