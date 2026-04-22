export type DocumentFile = {
    name: string;
    size: number;
    url: string;
    modified: number;
};

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
const DOCUMENT_TYPE_MAP: Record<string, { id: string; title: string; fullName: string; description: string }> = {
    "PBB": {
        id: "pbb",
        title: "PBB",
        fullName: "Programme-Based Budgeting",
        description: "Programme-Based Budgeting reports"
    },
    "ADP": {
        id: "adp",
        title: "ADP",
        fullName: "Annual Development Plan",
        description: "Annual Development Plan documents"
    },
    "CBR": {
        id: "cbr",
        title: "CBR",
        fullName: "County Budget Reviews",
        description: "County Budget Reviews"
    },
    "BPS": {
        id: "bps",
        title: "BPS",
        fullName: "Budget Policy Statement",
        description: "Budget Policy Statement framework"
    },
    "BROP": {
        id: "brop",
        title: "BROP",
        fullName: "Budget Review and Outlook Papers",
        description: "Budget Review and Outlook Papers"
    },
    "CFA": {
        id: "cfa",
        title: "CFA",
        fullName: "Controller and Auditor General",
        description: "Controller and Auditor General Reports"
    },
    "CFSP": {
        id: "cfsp",
        title: "CFSP",
        fullName: "County Fiscal Strategy Papers",
        description: "County Fiscal Strategy Papers"
    },
    "APP ACT": {
        id: "app-act",
        title: "APP ACT",
        fullName: "Appropriation Act",
        description: "Appropriation Act budget documents"
    },
    "FB": {
        id: "fb",
        title: "FB",
        fullName: "Fiscal Budget",
        description: "Fiscal Budget documents and analyses"
    },
    "AGR": {
        id: "agr",
        title: "AGR",
        fullName: "Agriculture",
        description: "Agriculture budget reports and allocations"
    },
    "ERE": {
        id: "ere",
        title: "ERE",
        fullName: "Economic Recovery Expenditure",
        description: "Economic Recovery Expenditure reports"
    },
    "CIDP": {
        id: "cidp",
        title: "CIDP",
        fullName: "County Integrated Development Plans",
        description: "County Integrated Development Plans"
    }
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
    const info = DOCUMENT_TYPE_MAP[id.toLowerCase()];
    if (info) {
        return {
            ...info,
            years: [], // Empty years for static generation, will be populated client-side
            files: [],
            folderName: `${info.title} 2010-2026` // Fallback folder name
        };
    }
    return undefined;
}

// Parse folder name to get document type info
function getDocumentInfoFromFolder(folderName: string): { id: string; title: string; fullName: string; description: string } | null {
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
    
    if (!repositoryData?.files) {
        return documents;
    }
    
    for (const folder of repositoryData.files) {
        if (folder.type !== 'folder') continue;
        
        const docInfo = getDocumentInfoFromFolder(folder.name);
        if (!docInfo) continue;
        
        const years = parseYearsFromFolderName(folder.name);
        const baseUrl = "http://api.budgetndiostory.org";
        
        const files: DocumentFile[] = (folder.files || []).map((file: any) => ({
            name: file.name,
            size: file.size,
            url: file.url.startsWith('http') ? file.url : `${baseUrl}${file.url}`,
            modified: file.modified
        }));
        
        documents.push({
            id: docInfo.id,
            title: docInfo.title,
            fullName: docInfo.fullName,
            description: docInfo.description,
            years,
            files,
            folderName: folder.name.replace(/\/$/, '') // Remove trailing slash
        });
    }
    
    return documents;
}

// Fetch documents from the API
export async function fetchDocumentsFromAPI(): Promise<DocumentType[]> {
    try {
        const response = await fetch('http://api.budgetndiostory.org/docrepository/', {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return transformRepositoryData(data);
    } catch (error) {
        console.error('Failed to fetch documents from API:', error);
        return [];
    }
}