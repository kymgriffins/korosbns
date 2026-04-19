export const documentTypes = [
    {
        id: "adp",
        title: "ADP",
        fullName: "Annual Development Plan",
        description: "Annual Development Plan documents from 2010-2026",
        years: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        folderId: "1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1"
    },
    {
        id: "agr",
        title: "AGR",
        fullName: "Agriculture",
        description: "Agriculture budget reports and allocations",
        years: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        folderId: "1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1"
    },
    {
        id: "app-act",
        title: "APP ACT",
        fullName: "Appropriation Act",
        description: "Appropriation Act budget documents",
        years: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        folderId: "1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1"
    },
    {
        id: "bps",
        title: "BPS",
        fullName: "Budget Policy Statement",
        description: "Budget Policy Statement framework",
        years: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        folderId: "1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1"
    },
    {
        id: "brop",
        title: "BROP",
        fullName: "Budget Review and Outlook Papers",
        description: "Budget Review and Outlook Papers",
        years: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        folderId: "1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1"
    },
    {
        id: "cbr",
        title: "CBR",
        fullName: "County Budget Reviews",
        description: "County Budget Reviews",
        years: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        folderId: "1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1"
    },
    {
        id: "cfa",
        title: "CFA",
        fullName: "Controller and Auditor General",
        description: "Controller and Auditor General Reports",
        years: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        folderId: "1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1"
    },
    {
        id: "cfsp",
        title: "CFSP",
        fullName: "County Fiscal Strategy Papers",
        description: "County Fiscal Strategy Papers",
        years: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        folderId: "1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1"
    },
    {
        id: "cidp",
        title: "CIDP",
        fullName: "County Integrated Development Plans",
        description: "County Integrated Development Plans",
        years: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        folderId: "1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1"
    },
    {
        id: "ere",
        title: "ERE",
        fullName: "Economic Recovery Expenditure",
        description: "Economic Recovery Expenditure reports",
        years: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        folderId: "1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1"
    },
    {
        id: "fb",
        title: "FB",
        fullName: "Fiscal Budget",
        description: "Fiscal Budget documents and analyses",
        years: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        folderId: "1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1"
    },
    {
        id: "pbb",
        title: "PBB",
        fullName: "Programme-Based Budgeting",
        description: "Programme-Based Budgeting reports",
        years: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        folderId: "1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1"
    }
] as const;

export type DocumentType = typeof documentTypes[number];

export const getDocumentById = (id: string): DocumentType | undefined => {
    return documentTypes.find(doc => doc.id === id.toLowerCase());
};

export const getAllDocumentIds = () => {
    return documentTypes.map(doc => doc.id);
};