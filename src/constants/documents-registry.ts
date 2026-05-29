import docRepoDump from "./docrepository-dump.json";

export interface GovernmentDocument {
  id: string;
  stageId: number;
  name: string; // File name
  title: string; // Pretty title
  folder: string;
  financialYear: string;
  year: number;
  type: string;
  pdfUrl: string;
  sourceUrl: string;
  sizeBytes: number;
  datePublished: string;
  issuingBody: string;
  description: string;
  historicalContext?: string;
  isCurrent: boolean;
  isAvailable: boolean;
  fallbackNote?: string;
}

// Stage map to folder names in the API repository
export const STAGE_FOLDER_MAP: Record<number, string[]> = {
  0: ["From The Team"],
  1: ["Constitution"],
  2: ["BPS 2010-2026"],
  3: ["FB 2010-2026", "ERE 2010-2026"],
  4: ["CFSP 2010-2026"],
  5: ["CIDP 2010-2026", "ADP 2010-2026", "ADP 2010-2026/Makueni ADP"],
  6: ["APP ACT 2010-2026", "CFA 2010-2026"],
  7: ["CBR 2010-2026", "BROP 2010-2026"],
};

// Constitution stage (Stage 1) timeline data
export const CONSTITUTION_HISTORICAL_DOCS: GovernmentDocument[] = [
  {
    id: "const-2010",
    stageId: 1,
    name: "Constitution-of-Kenya-2010.pdf",
    title: "Constitution of Kenya (2010)",
    folder: "Constitution",
    financialYear: "2010",
    year: 2010,
    type: "constitution",
    pdfUrl: "https://kenyalaw.org/kl/fileadmin/pdfdownloads/Constitution/Constitution-of-Kenya-2010.pdf",
    sourceUrl: "https://kenyalaw.org",
    sizeBytes: 1534096,
    datePublished: "2010-08-27",
    issuingBody: "Republic of Kenya",
    description: "The supreme law of Kenya, adopted after the August 2010 referendum. Chapter Twelve sets out public finance principles.",
    historicalContext: "Adopted by referendum August 4, 2010 (67% Yes vote). Replaced the 1963 Independence Constitution, devolving power to 47 counties.",
    isCurrent: true,
    isAvailable: true,
  },
  {
    id: "const-2005",
    stageId: 1,
    name: "wako-draft-2005.pdf",
    title: "Proposed Constitution (Wako Draft)",
    folder: "Constitution",
    financialYear: "2005",
    year: 2005,
    type: "constitution",
    pdfUrl: "https://kenyaconstitutionhistory.org/2005-draft.pdf",
    sourceUrl: "https://kenyalaw.org",
    sizeBytes: 980120,
    datePublished: "2005-11-21",
    issuingBody: "Attorney General Office",
    description: "Proposed Draft Constitution presented in 2005 by Attorney General Amos Wako.",
    historicalContext: "Rejected in a historic referendum on November 21, 2005 (58% No vs 42% Yes). The rejection led to political shifts.",
    isCurrent: false,
    isAvailable: false,
    fallbackNote: "PDF not available online. Visit source page to inspect archives.",
  },
  {
    id: "const-1997",
    stageId: 1,
    name: "1997-amendments.pdf",
    title: "Constitution of Kenya (Amendment Act)",
    folder: "Constitution",
    financialYear: "1997",
    year: 1997,
    type: "constitution",
    pdfUrl: "https://kenyalaw.org/1997-amendments.pdf",
    sourceUrl: "https://kenyalaw.org",
    sizeBytes: 340980,
    datePublished: "1997-11-01",
    issuingBody: "Parliament of Kenya",
    description: "Interim constitutional amendments passed before the 1997 general elections.",
    historicalContext: "Introduced IPPG (Inter-Parties Parliamentary Group) reforms, expanding the electoral commission and allowing minor political freedoms.",
    isCurrent: false,
    isAvailable: false,
    fallbackNote: "Available in physical law libraries. Replaced by the 2010 document.",
  },
  {
    id: "const-1991",
    stageId: 1,
    name: "1991-amendment.pdf",
    title: "Constitution of Kenya (Section 2A Repeal)",
    folder: "Constitution",
    financialYear: "1991",
    year: 1991,
    type: "constitution",
    pdfUrl: "https://kenyalaw.org/1991-amendment.pdf",
    sourceUrl: "https://kenyalaw.org",
    sizeBytes: 154090,
    datePublished: "1991-12-11",
    issuingBody: "Parliament of Kenya",
    description: "Amended the Constitution to repeal Section 2A.",
    historicalContext: "Officially repealed Section 2A, restoring multi-party democracy in Kenya after a decade of one-party rule.",
    isCurrent: false,
    isAvailable: false,
  },
  {
    id: "const-1982",
    stageId: 1,
    name: "1982-amendment.pdf",
    title: "Constitution of Kenya (Section 2A Insertion)",
    folder: "Constitution",
    financialYear: "1982",
    year: 1982,
    type: "constitution",
    pdfUrl: "https://kenyalaw.org/1982-amendment.pdf",
    sourceUrl: "https://kenyalaw.org",
    sizeBytes: 112090,
    datePublished: "1982-06-09",
    issuingBody: "Parliament of Kenya",
    description: "Amended the Constitution to make Kenya a one-party state by law.",
    historicalContext: "Inserted Section 2A, legally declaring KANU as the only authorized political party. Repealed in 1991.",
    isCurrent: false,
    isAvailable: false,
  },
  {
    id: "const-1969",
    stageId: 1,
    name: "1969-amendments.pdf",
    title: "Consolidated Constitution of 1969",
    folder: "Constitution",
    financialYear: "1969",
    year: 1969,
    type: "constitution",
    pdfUrl: "https://kenyalaw.org/1969-amendments.pdf",
    sourceUrl: "https://kenyalaw.org",
    sizeBytes: 1245000,
    datePublished: "1969-04-18",
    issuingBody: "Parliament of Kenya",
    description: "A consolidated version of the constitution incorporating multiple amendments since independence.",
    historicalContext: "Consolidated executive power, abolished regionalism (Majimbo), and phased out the bicameral parliamentary system.",
    isCurrent: false,
    isAvailable: false,
  },
  {
    id: "const-1964",
    stageId: 1,
    name: "1964-republic-constitution.pdf",
    title: "Republic of Kenya Constitution",
    folder: "Constitution",
    financialYear: "1964",
    year: 1964,
    type: "constitution",
    pdfUrl: "https://kenyalaw.org/1964-republic.pdf",
    sourceUrl: "https://kenyalaw.org",
    sizeBytes: 890120,
    datePublished: "1964-12-12",
    issuingBody: "Parliament of Kenya",
    description: "Amendments declaring Kenya a Republic within the Commonwealth.",
    historicalContext: "Abolished the dominion status. Jomo Kenyatta became the Executive President, replacing the Prime Minister post.",
    isCurrent: false,
    isAvailable: false,
  },
  {
    id: "const-1963",
    stageId: 1,
    name: "1963-independence-constitution.pdf",
    title: "Independence Constitution (Majimbo)",
    folder: "Constitution",
    financialYear: "1963",
    year: 1963,
    type: "constitution",
    pdfUrl: "https://kenyalaw.org/1963-independence.pdf",
    sourceUrl: "https://kenyalaw.org",
    sizeBytes: 2541800,
    datePublished: "1963-12-12",
    issuingBody: "Her Majesty Stationery Office",
    description: "The founding Independence Constitution of Kenya drafted at Lancaster House conferences.",
    historicalContext: "Established a parliamentary system with a Prime Minister (Jomo Kenyatta) and a bicameral house. Queen Elizabeth II remained Head of State.",
    isCurrent: false,
    isAvailable: false,
  },
];

// Stage 0: From The Team static files
export function getFromTheTeamDocs(): GovernmentDocument[] {
  return [{
    id: "fromtheteam-bps-2026-summary",
    stageId: 0,
    name: "BPS 2026 Summary From The Team.pdf",
    title: "BPS 2026 Summary — From The Team",
    folder: "From The Team",
    financialYear: "FY 2025/26",
    year: 2026,
    type: "fromtheteam",
    pdfUrl: "/BPS_2026_Summary_From_The_Team.pdf",
    sourceUrl: "https://budgetndiostory.org",
    sizeBytes: 0,
    datePublished: "2026-01-15",
    issuingBody: "Millicent Makina, Board Advisor",
    description: "A citizen-friendly summary of the Budget Policy Statement 2026 prepared under the guidance of Millicent Makina, Board Advisor at Budget Ndio Story. Covers revenue targets, spending priorities, and the BETA agenda in plain language.",
    isCurrent: true,
    isAvailable: true,
  }];
}

// Stage 8: Participation Toolkit static mock files
export const PARTICIPATION_TOOLKIT_DOCS: GovernmentDocument[] = [
  {
    id: "tool-memo-template",
    stageId: 8,
    name: "Public-Written-Submission-Template.docx",
    title: "Written Budget Memorandum Template",
    folder: "Participation Templates",
    financialYear: "2026",
    year: 2026,
    type: "toolkit",
    pdfUrl: "/docs/Public_Written_Submission_Template.docx",
    sourceUrl: "https://bnske.budgetndiostory.org",
    sizeBytes: 45600,
    datePublished: "2026-02-01",
    issuingBody: "Budget Ndio Story Toolkit",
    description: "A standard structured template to draft and submit written budget commentaries to your county assembly clerk.",
    isCurrent: true,
    isAvailable: true,
  },
  {
    id: "tool-participation-guide",
    stageId: 8,
    name: "County-Public-Participation-Guidelines.pdf",
    title: "County Public Participation Guidelines",
    folder: "Participation Guides",
    financialYear: "2026",
    year: 2026,
    type: "toolkit",
    pdfUrl: "/docs/County_Public_Participation_Guidelines.pdf",
    sourceUrl: "https://www.cog.go.ke",
    sizeBytes: 1540960,
    datePublished: "2026-01-15",
    issuingBody: "Council of Governors (CoG)",
    description: "Official guidelines mapping citizen engagement rules, timing windows, and county assembly petition rights.",
    isCurrent: true,
    isAvailable: true,
  },
];

// Flexible patterns to match doc names to calendar years
export function matchesFinancialYear(docName: string, year: number): boolean {
  const shortYear = year.toString().slice(-2); // "26" for 2026
  const prevYear = year - 1;
  const shortPrevYear = prevYear.toString().slice(-2); // "25" for 2026

  const patterns = [
    new RegExp(`\\b${year}\\b`),                                       // "2026"
    new RegExp(`FY\\s*${prevYear}[-_]${year}`, 'i'),                 // "FY 2025-2026"
    new RegExp(`FY\\s*${prevYear}[-_]${shortYear}`, 'i'),            // "FY 2025-26"
    new RegExp(`FY-?${prevYear}-?${shortYear}`, 'i'),                // "FY-2025-26"
    new RegExp(`\\b${prevYear}/${year}\\b`),                          // "2025/2026"
    new RegExp(`\\b${prevYear}/${shortYear}\\b`),                     // "2025/26"
    new RegExp(`\\b${shortPrevYear}[-_]${shortYear}\\b`),             // "25-26"
    new RegExp(`Financial Year.*${year}`, 'i'),                       // "Financial Year ending 2026"
  ];
  return patterns.some(pattern => pattern.test(docName));
}

// Extractor helper to get prettified financial year from doc name
export function extractFinancialYear(docName: string, defaultYear: number): string {
  const matchRange = docName.match(/(?:FY\s*)?(\d{4})[-/](\d{2,4})/i);
  if (matchRange) {
    const start = matchRange[1];
    const end = matchRange[2];
    const prettifiedEnd = end.length === 2 ? `20${end}` : end;
    return `FY ${start}/${prettifiedEnd.slice(-2)}`;
  }
  const matchSingle = docName.match(/\b(20\d{2})\b/);
  if (matchSingle) {
    const year = parseInt(matchSingle[1], 10);
    return `FY ${year - 1}/${matchSingle[1].slice(-2)}`;
  }
  return `FY ${defaultYear - 1}/${defaultYear.toString().slice(-2)}`;
}

// Infer issuing bodies based on folder and document names
export function inferIssuingBody(folderName: string, docName: string): string {
  const normalizedFolder = folderName.toUpperCase();
  const normalizedName = docName.toUpperCase();

  if (normalizedFolder.includes("FROM THE TEAM")) return "Millicent Makina, Board Advisor";
  if (normalizedFolder.includes("BPS")) return "National Treasury";
  if (normalizedFolder.includes("CBR")) return "Controller of Budget";
  if (normalizedFolder.includes("BROP")) return "National Treasury";
  if (normalizedFolder.includes("APP ACT")) return "Parliament of Kenya";
  if (normalizedFolder.includes("FB")) return "National Treasury";
  if (normalizedFolder.includes("ERE")) return "National Treasury / Parliament";
  
  if (normalizedFolder.includes("CFSP")) {
    if (normalizedName.includes("NAIROBI")) return "Nairobi City County Treasury";
    return "County Treasury";
  }
  if (normalizedFolder.includes("CFA")) {
    if (normalizedName.includes("NAIROBI")) return "Nairobi City County Assembly";
    return "County Assembly";
  }
  if (normalizedFolder.includes("ADP")) {
    if (normalizedName.includes("MAKUENI")) return "Makueni County Executive";
    return "County Executive";
  }
  if (normalizedFolder.includes("CIDP")) {
    return "County Planning Department";
  }
  return "National Government";
}

// Generate plain-language summaries based on type
export function generatePlainDescription(docName: string, stageId: number): string {
  switch (stageId) {
    case 0:
      return "A citizen-friendly summary of the Budget Policy Statement prepared by the Budget Ndio Story team.";
    case 2:
      return "Sets out Kenya's macroeconomic projections and sector expenditure ceilings for the upcoming budget preparation.";
    case 3:
      return "Splits revenue raised nationally between the National Government and the 47 County Assemblies (Equitable Share).";
    case 4:
      return "Outlines county development ceilings and spending guidelines for sector departments before main budget drafting.";
    case 5:
      return "Five-year county strategic master plan (CIDP) alongside the annual execution slice (ADP) listing active projects.";
    case 6:
      return "Legalizes the county budget allocations, authorizing assemblies to withdraw public funds from county revenue accounts.";
    case 7:
      return "Monitors actual county revenue absorption, highlighting slow projects or diversions in administrative spending.";
    case 8:
      return "Empowers citizens with written templates and advocacy guidelines to engage county assemblies during budget hearings.";
    default:
      return "Official government financial policy statement and planning document.";
  }
}

// Main filtering logic uniting live repository data and fallback data
export function getDocumentsForStage(
  stageId: number,
  year: number,
  selectedCounty: string,
  liveRepoDocs?: any[]
): GovernmentDocument[] {
  // Stage 0 special case — From The Team
  if (stageId === 0) {
    return getFromTheTeamDocs();
  }

  // Stage 1 special case
  if (stageId === 1) {
    return CONSTITUTION_HISTORICAL_DOCS;
  }
  // Stage 8 special case
  if (stageId === 8) {
    return PARTICIPATION_TOOLKIT_DOCS;
  }

  const folders = STAGE_FOLDER_MAP[stageId] || [];
  
  // Use live data if available, else fall back to local dump
  const sourceDocs = liveRepoDocs && liveRepoDocs.length > 0 ? liveRepoDocs : docRepoDump.documents;

  // Filter repo documents
  const matchedDocs = sourceDocs.filter((doc: any) => {
    const inFolder = folders.includes(doc.folder);
    if (!inFolder) return false;

    // Matches year
    const yearMatch = matchesFinancialYear(doc.name, year);
    if (!yearMatch) return false;

    // Personalization filtering for County stages (CFSP, CIDP/ADP, CFA/CROP)
    // CFSP, CFA, and ADP may contain county names in filename.
    // If county is selected and documents exist for it, filter them.
    if (stageId === 4 || stageId === 5 || stageId === 6) {
      const countyKey = selectedCounty.replace(/\s+/g, "").toLowerCase(); // "nairobi"
      const nameLower = doc.name.toLowerCase();
      const folderLower = doc.folder.toLowerCase();
      
      // If doc name has another county, exclude it
      if (selectedCounty) {
        if (countyKey === "nairobi") {
          // Keep if it has Nairobi or does not mention other counties
          const containsOtherCounty = nameLower.includes("makueni") || folderLower.includes("makueni");
          if (containsOtherCounty) return false;
        } else if (countyKey === "makueni") {
          // Keep if it has Makueni or does not mention Nairobi
          const containsOtherCounty = nameLower.includes("nairobi") || folderLower.includes("nairobi");
          if (containsOtherCounty) return false;
        }
      }
    }
    return true;
  });

  // If we filtered for county and got nothing, return all matched docs for that year as fallback references
  const finalMatched = matchedDocs.length > 0 ? matchedDocs : sourceDocs.filter((doc: any) => {
    return folders.includes(doc.folder) && matchesFinancialYear(doc.name, year);
  });

  return finalMatched.map((doc: any, index: number) => {
    const isCurrent = year === 2026;
    const sizeBytes = doc.size || 0;
    
    // Replace spaces and special characters for URLs
    const fullUrl = doc.url.startsWith("http") 
      ? doc.url 
      : `https://api.budgetndiostory.org${doc.url}`;

    // Clean up filename for pretty title
    const prettyTitle = doc.name
      .replace(/\.pdf$/i, "")
      .replace(/[-_]/g, " ")
      .replace(/\b[a-z]/g, (char: string) => char.toUpperCase());

    return {
      id: `${doc.folder.toLowerCase().replace(/[^a-z0-9]/g, "")}-${index}-${year}`,
      stageId,
      name: doc.name,
      title: prettyTitle,
      folder: doc.folder,
      financialYear: extractFinancialYear(doc.name, year),
      year,
      type: doc.folder.split(" ")[0].toLowerCase(),
      pdfUrl: fullUrl,
      sourceUrl: "https://treasury.go.ke",
      sizeBytes,
      datePublished: `${year}-02-28`, // Fallback published date
      issuingBody: inferIssuingBody(doc.folder, doc.name),
      description: generatePlainDescription(doc.name, stageId),
      isCurrent,
      isAvailable: true,
    };
  });
}
