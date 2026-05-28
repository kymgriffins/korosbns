export interface StageData {
  id: number;
  slug?: string;
  moduleId?: string;
  title: string;
  badge: string;
  badgeName: string;
  documentName: string;
  archive: string;
  link: string;
  status: string;
  credits: string;
  description: string;
  expectations: string[];
  steps: StepData[];
}

export interface StepData {
  id: number;
  chapterId?: string;
  triviaId?: string | null;
  takeaways?: Array<{ type: "info" | "warning"; title: string; text: string }>;
  isCompleted?: boolean;
  isLocked?: boolean;
  title: string;
  youtubeId: string;
  audioUrl: string;
  transcript: string;
  text: string;
  trivia: TriviaData[];
}

interface TriviaData {
  id?: string;
  type: "multiple-choice" | "reflection";
  question: string;
  options?: string[];
  answer?: number;
  explanation?: string;
  placeholder?: string;
}

export const STAGES_DATA: StageData[] = [
  {
    id: 1,
    title: "Stage 1: Constitution",
    badge: "🛡️",
    badgeName: "DocNative",
    documentName: "Constitution of Kenya 2010",
    archive: "2010",
    link: "https://kenyalaw.org",
    status: "Published",
    credits: "Credits: BNS Team",
    description:
      "Learn about the foundations of public finance in Kenya under Chapter Twelve of the Constitution, detailing transparency, equity, and citizen audit rights.",
    expectations: [
      "Decode your 5 core budget rights in Kenya.",
      "Understand Article 201 principles of public finance.",
      "Understand Article 35 guarantees for access to information.",
      "Learn how to audit county financial allocations.",
    ],
    steps: [
      {
        id: 1,
        title: "1. Public Finance Principles",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage1_step1.mp3",
        transcript:
          "Hello citizens, welcome to Budget Ndio Story.\nToday we are looking at Chapter Twelve of the Kenyan Constitution.\nArticle 201 dictates that public finance shall be open and accountable.\nThis means you have the right to ask how county money is used.\nKeep watching to learn how to enforce your civic rights.",
        text: "The Kenyan Constitution sets the foundational framework for public finance under Chapter Twelve. Article 201 details that there shall be openness, accountability, and public participation in financial matters. It requires that the public finance system promote an equitable society where the burden of taxation is shared fairly. All public money must be used in a prudent and responsible manner.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "Which article of the Kenyan Constitution details the principles of public finance?",
            options: ["Article 201", "Article 217", "Article 221", "Article 35"],
            answer: 0,
            explanation:
              "Article 201 sets out the principles of public finance, including openness, accountability, and public participation.",
          },
        ],
      },
      {
        id: 2,
        title: "2. Your Budget Rights",
        youtubeId: "wkPe3sWomoA",
        audioUrl: "/audio/stage1_step2.mp3",
        transcript:
          "In part 2, we dive deeper into your rights.\nArticle 35 provides that every citizen has the right of access to information.\nThis includes county budgets, plans, and audits.\nIf your county hides budget papers, they violate the constitution.",
        text: "Article 35 of the Constitution guarantees every citizen the right of access to information held by the state. In the context of budgeting, this means county governments are legally obligated to publish annual development plans, fiscal papers, and actual expenditure statements for citizen auditing. You do not need to be an expert to request these files.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "Article 35 of the Constitution guarantees citizens the right to what?",
            options: [
              "Access to information",
              "Free health care",
              "Equal wages",
              "Free primary education",
            ],
            answer: 0,
            explanation:
              "Article 35 guarantees the right of access to information, which is key for civic budget auditing.",
          },
        ],
      },
      {
        id: 3,
        title: "3. Legal Citations & Auditing",
        youtubeId: "FkgRz4v2Llk",
        audioUrl: "/audio/stage1_step3.mp3",
        transcript:
          "To finalize Stage 1, we look at the Controller of Budget.\nArticle 228 sets up this independent office to authorize withdrawals.\nNo county can withdraw funds without the COB's authorization.\nThis is a critical watchdog safeguard.",
        text: "Under Chapter Twelve, key regulatory organs are established to monitor public spending. Article 228 sets up the office of the Controller of Budget (COB), which is tasked with authorizing withdrawals from public funds and reporting budget implementation progress to Parliament quarterly. This provides an audit trail for citizens to inspect.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "Who oversees the implementation of county and national budgets by authorizing withdrawals?",
            options: [
              "Controller of Budget",
              "Central Bank Governor",
              "Senator",
              "County Governor",
            ],
            answer: 0,
            explanation:
              "The Controller of Budget has the sole mandate to authorize withdrawals and submit quarterly implementation reports.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Stage 2: Budget Policy Statement",
    badge: "⚖️",
    badgeName: "VertDecoder",
    documentName: "Budget Policy Statement (BPS)",
    archive: "2015",
    link: "https://www.treasury.go.ke",
    status: "Published",
    credits: "Credits: Millicent Makini",
    description:
      "Reflect on Kenya's 2026 Budget Policy Statement (BPS), exploring national priorities, expenditure ceilings, division of revenue, and fiscal risk factors.",
    expectations: [
      "Decode the Budget's Secret: Understand the purpose and timeline of the BPS.",
      "Master the 5 Key Pillars: Explore the Bottom-Up economic priorities (BETA Agenda).",
      "Track the Trillion-Shilling Debt: Analyse expenditures, interest payments, and borrowing.",
      "Battle the Climate Risk: Understand fiscal risk factors.",
      "Share Your Policy Opinion: Reflect and propose your own solutions.",
    ],
    steps: [
      {
        id: 1,
        title: "1. What is a Budget Policy Statement?",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage2_step1.mp3",
        transcript:
          "Let's explore the Budget Policy Statement.\nThe BPS outlines the broad strategic priorities and goals for the upcoming year.\nIt must be submitted to Parliament by 15th February in line with Section 25 of the PFM Act.\nIt establishes the expenditure ceilings for ministries and counties.",
        text: "The Budget Policy Statement (BPS) is a government policy document that sets out the broad strategic priorities and policy goals that should guide the national and county governments in preparing their budgets for the next financial year and over the medium term. The document is submitted to Parliament by the 15th of February every year in line with section 25 of the Public Finance Management (PFM) Act and contains macroeconomic forecasts, proposed expenditure ceilings, transfers to county governments, and medium-term debt limits. Once approved, it forms the basis for the national budget presented by April 30th.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "What is the main purpose of the Budget Policy Statement (BPS)?",
            options: [
              "To collect taxes from citizens",
              "To guide how national and county governments prepare their budgets",
              "To replace the national development plan",
              "To approve all government projects",
            ],
            answer: 1,
            explanation:
              "The BPS guides budget preparation by outlining macroeconomic frameworks and sector expenditure ceilings.",
          },
          {
            type: "reflection",
            question:
              "Before learning about the BPS, how often did you think about how national budgets affect your daily life?",
            options: ["Very often", "Sometimes", "Rarely", "Never"],
            placeholder:
              "What areas of your life do you think government budgets influence the most? (e.g. transport, health, tax rates...)",
          },
          {
            type: "multiple-choice",
            question:
              "By law, the Budget Policy Statement must be submitted to Parliament by:",
            options: ["January 1", "February 15", "March 30", "April 30"],
            answer: 1,
            explanation:
              "Section 25 of the PFM Act mandates the Treasury to submit the BPS to Parliament by February 15th annually.",
          },
        ],
      },
      {
        id: 2,
        title: "2. The 2026 BPS & Bottom-Up Pillars",
        youtubeId: "wkPe3sWomoA",
        audioUrl: "/audio/stage2_step2.mp3",
        transcript:
          "The 2026 BPS theme is 'Consolidating Gains Under the Bottom-Up economic agenda'.\nIt focuses on five main focus areas, also known as the pillars.\nThese include Agriculture, MSMEs, Healthcare, Housing, and the Digital Superhighway.\nLet's analyze how these sectors are funded.",
        text: "The theme of the BPS 2026 is, 'Consolidating Gains Under the Bottom-Up Economic Transformation Agenda for Inclusive and Sustainable Growth.' It seeks to accelerate development through focusing on Agriculture (crop diversification, fertilizer subsidies), and MSMEs (increasing credit access via Hustler Fund expansions and NYOTA linkages, setting up MSME hubs in all 47 counties for training).",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "Which agenda guides the development priorities highlighted in the 2026 BPS?",
            options: [
              "Vision 2030 Growth Plan",
              "Bottom-Up Economic Transformation Agenda (BETA)",
              "East African Development Strategy",
              "National Industrial Policy",
            ],
            answer: 1,
            explanation:
              "The 2026 BPS consolidates gains under the Bottom-Up Economic Transformation Agenda (BETA).",
          },
          {
            type: "reflection",
            question:
              "If you were designing an economic strategy for Kenya, which sector would you prioritise first and why?",
            options: [
              "Agriculture",
              "Small businesses (MSMEs)",
              "Healthcare",
              "Digital economy",
              "Infrastructure",
              "Education",
            ],
            placeholder:
              "Explain briefly why this sector holds the highest importance for you.",
          },
          {
            type: "multiple-choice",
            question:
              "You are a farmer benefiting from fertilizer subsidies and improved irrigation. What would likely happen if these programmes succeed?",
            options: [
              "Increased crop production",
              "Reduced food supply",
              "Higher unemployment in rural areas",
              "Less agricultural exports",
            ],
            answer: 0,
            explanation:
              "Fertilizer subsidies and expanded irrigation are structured to boost food security by increasing crop production.",
          },
          {
            type: "multiple-choice",
            question:
              "Many MSMEs struggle to access credit. Which BPS intervention aims to address this?",
            options: [
              "Expanding the Hustler Fund and credit guarantee scheme",
              "Increasing business licensing fees",
              "Limiting bank lending to small businesses",
              "Increasing corporate tax",
            ],
            answer: 0,
            explanation:
              "The BPS proposes increasing access to credit by expanding the Hustler Fund and MSME Credit Guarantee Schemes.",
          },
          {
            type: "reflection",
            question:
              "Imagine you are a young entrepreneur starting a small business. Which support would make the biggest difference for you?",
            options: [
              "Affordable loans",
              "Business mentorship",
              "Digital skills training",
              "Access to markets",
            ],
            placeholder:
              "Why does this specific support key benefit your business vision?",
          },
        ],
      },
      {
        id: 3,
        title: "3. Healthcare, Housing, and Digital Superhighway",
        youtubeId: "FkgRz4v2Llk",
        audioUrl: "/audio/stage2_step3.mp3",
        transcript:
          "Next, we cover Universal Health Coverage, Housing, and Digital expansion.\nThe government targets expanding SHA enrolment to 35 million people.\nIt also plans infrastructure investments in electric vehicles and fiber cable.\nLet's evaluate the spending targets.",
        text: "The BPS 2026 outlines UHC health targets (SHA enrollment of 35 million people, community health promoters support), Housing and Settlement (KMRC mortgage finance, affordable housing committees allocation), and Digital Superhighway (fiber cable expansion, public Wi-Fi hotspots, government services digitization). It also introduces a National Infrastructure Fund for long-term investments.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "When government spending is higher than its revenue, the difference is known as:",
            options: [
              "Fiscal surplus",
              "Fiscal deficit",
              "Monetary balance",
              "Public investment",
            ],
            answer: 1,
            explanation:
              "A fiscal deficit represents the gap between total government spending and total revenues, which must be financed through debt.",
          },
        ],
      },
      {
        id: 4,
        title: "4. Recent Economic Developments",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage2_step4.mp3",
        transcript:
          "Kenya's economy grew by around 5% in 2025.\nHowever, revenue collection fell below targets, causing deficit pressure.\nTo manage this, the government plans domestic revenue tax reforms.\nLet's review the debt interest costs.",
        text: "In 2025, Kenya's economy grew by around 5%, supported by services, agriculture, and industry. However, revenue collections fell below target, causing expenditure pressures. The government intends to implement domestic tax reforms and control recurrent spending to lower the deficit. GDP growth is projected at 5.3% in 2026/27.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "Interest payments on Kenya's public debt are projected at over Ksh. 1 trillion. What challenge might this create?",
            options: [
              "Reduced funds for development and social services",
              "Lower tax collection",
              "Faster economic growth",
              "Reduced public borrowing",
            ],
            answer: 0,
            explanation:
              "Massive debt interest payments consume a huge portion of revenues, leaving fewer funds for essential social services like health and education.",
          },
          {
            type: "reflection",
            question:
              "Why do you think citizens should understand government budgets, even if they are not economists?",
            placeholder:
              "Write one or two reasons (e.g. keeping leaders accountable, checking development projects...)",
          },
        ],
      },
      {
        id: 5,
        title: "5. Budget Projections & County Allocations",
        youtubeId: "wkPe3sWomoA",
        audioUrl: "/audio/stage2_step5.mp3",
        transcript:
          "For FY 2026/27, total revenue is projected at Ksh 3,588 Billion.\nTotal expenditure is projected at Ksh 4,737 Billion.\nThe allocation to county governments is proposed at Ksh 420 Billion.\nLet's inspect what county assemblies receive for service delivery.",
        text: "Total revenue for FY 2026/27 is forecasted at Ksh. 3,588.1 billion, with expenditures at Ksh. 4,737.5 billion. The BPS proposes allocating Ksh. 420 billion to county governments (a Ksh. 5 billion increase from 2025/26). Additional allocations include Community Health Promoters (Ksh. 3.2B), CAIPs industrial parks (Ksh. 3.25B), and mineral royalties share.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "The BPS proposes allocating KES. 420 billion to county governments. What is the main purpose of this transfer?",
            options: [
              "Funding local development and public services",
              "Repaying domestic loans",
              "Supporting foreign investments",
              "Honouring the constitution",
            ],
            answer: 0,
            explanation:
              "County revenue allocations are mandated to fund local devolved services like county roads, hospitals, and agriculture.",
          },
        ],
      },
      {
        id: 6,
        title: "6. Specific Fiscal Risks",
        youtubeId: "FkgRz4v2Llk",
        audioUrl: "/audio/stage2_step6.mp3",
        transcript:
          "Every budget faces specific risks.\nThe BPS lists public debt pressure, State-Owned Enterprise liabilities, and climate disasters.\nDroughts and floods disrupt agriculture, which is the backbone of the economy.\nLet's discuss how we mitigate these risks.",
        text: "The BPS identifies specific fiscal risks: 1) Public Debt Risk, 2) Contingent Liabilities (State-Owned Enterprise debts, government guarantees), 3) Macroeconomic shortfalls, 4) Climate Change Risks (droughts and floods affecting food security), and 5) Devolution Risks (county pending bills).",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "Which of the following is identified as a major fiscal risk in the BPS?",
            options: [
              "Rising public debt and interest payments",
              "Decreasing internet use",
              "Reduced population growth",
              "Lower rainfall every year",
            ],
            answer: 0,
            explanation:
              "Rising public debt levels and high interest payment pressures are listed as top fiscal risks to budget implementation.",
          },
          {
            type: "reflection",
            question:
              "The BPS identifies climate change risks such as droughts and floods. How might these affect Kenya's economy and public finances?",
            placeholder:
              "Think about impacts on agricultural productivity, infrastructure damage, and emergency relief costs.",
          },
        ],
      },
      {
        id: 7,
        title: "7. Final Reflection & Policy Opinion",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage2_step7.mp3",
        transcript:
          "You have completed the Budget Policy Statement course!\nBefore we assent, Parliament wants one key strategic improvement.\nWhich sector would you strengthen most?\nSubmit your final opinion to earn your VertDecoder badge.",
        text: "Congratulations! You have completed Module 002. As a civic champion, your feedback matters. Reflect on the entire BPS strategic directions and choose the area you believe deserves the highest resource focus.",
        trivia: [
          {
            type: "reflection",
            question:
              "Imagine Parliament asks for one key improvement before approving the BPS. Which area would you strengthen most?",
            options: [
              "Agriculture and food security",
              "MSME development",
              "Healthcare",
              "Digital economy and youth innovation",
              "Infrastructure investment",
            ],
            placeholder:
              "Explain your choice in 2-3 sentences (e.g. food security lowers cost of living...)",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Stage 3: Infrastructure Fund",
    badge: "🏗️",
    badgeName: "InfraFund",
    documentName: "National Infrastructure Fund Reports",
    archive: "2026",
    link: "https://www.treasury.go.ke",
    status: "Published",
    credits: "Credits: BNS Team",
    description:
      "Explore Kenya's National Infrastructure Fund for long-term investments in transport, energy, water, and digital infrastructure, and understand how infrastructure spending drives economic growth.",
    expectations: [
      "Understand the purpose and scope of the National Infrastructure Fund.",
      "Analyze infrastructure spending priorities across transport, energy, and water.",
      "Learn how infrastructure investments connect to county development.",
      "Evaluate the impact of infrastructure on economic growth and service delivery.",
    ],
    steps: [
      {
        id: 1,
        title: "1. What is the National Infrastructure Fund?",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage3_step1.mp3",
        transcript:
          "Let's explore the National Infrastructure Fund.\nThis fund was established to finance long-term capital projects.\nIt covers transport corridors, energy plants, water systems, and digital infrastructure.\nUnderstanding this fund helps you track county development projects.",
        text: "The National Infrastructure Fund is a dedicated financing mechanism established to support long-term capital investments in Kenya's infrastructure. It prioritizes projects in transport (roads, railways, ports), energy (power generation, rural electrification), water and sanitation (dams, piped water), and digital infrastructure (fiber optic expansion, public Wi-Fi). The fund is capitalised through annual budget allocations, development partner contributions, and infrastructure bonds. County governments access portions of the fund for devolved infrastructure projects such as county roads, water schemes, and markets.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "What is the primary purpose of the National Infrastructure Fund?",
            options: [
              "To finance long-term capital infrastructure projects",
              "To pay government salaries",
              "To service public debt",
              "To fund recurrent expenditure",
            ],
            answer: 0,
            explanation:
              "The National Infrastructure Fund is designed to finance long-term capital investments in transport, energy, water, and digital infrastructure.",
          },
        ],
      },
      {
        id: 2,
        title: "2. Infrastructure Spending Priorities",
        youtubeId: "wkPe3sWomoA",
        audioUrl: "/audio/stage3_step2.mp3",
        transcript:
          "Let's examine how infrastructure funds are allocated.\nTransport gets the largest share for roads and railways.\nEnergy follows with investments in renewable power.\nWater and sanitation are critical for county development.",
        text: "Infrastructure spending is prioritised based on national development plans and county needs. Transport infrastructure receives the largest allocation, focusing on upgrading major highways, maintaining rural access roads, and expanding the Standard Gauge Railway. Energy sector investments target geothermal, solar, and wind power to increase the national grid capacity. Water and sanitation projects aim to increase access to clean water in both urban and rural areas, with county governments implementing piped water schemes and borehole drilling programs funded through the infrastructure budget.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "Which sector typically receives the largest share of infrastructure funding?",
            options: [
              "Transport infrastructure",
              "Digital infrastructure",
              "Water and sanitation",
              "Energy",
            ],
            answer: 0,
            explanation:
              "Transport infrastructure receives the highest allocation to fund roads, railways, and port upgrades across the country.",
          },
          {
            type: "reflection",
            question:
              "Think about the infrastructure in your county. Which project would make the biggest difference to your community?",
            options: [
              "Road construction",
              "Water supply",
              "Electricity connection",
              "Market construction",
              "Internet access",
            ],
            placeholder:
              "Describe how this infrastructure project would improve daily life in your area.",
          },
        ],
      },
      {
        id: 3,
        title: "3. Infrastructure & County Development",
        youtubeId: "FkgRz4v2Llk",
        audioUrl: "/audio/stage3_step3.mp3",
        transcript:
          "Infrastructure drives county economic growth.\nBetter roads mean farmers can transport goods to markets.\nReliable electricity attracts businesses and creates jobs.\nWater projects improve health and reduce poverty.",
        text: "Infrastructure investment is a key driver of county-level economic development. Improved road networks reduce transport costs for farmers and businesses, enabling access to wider markets. Reliable electricity supply attracts manufacturing and service industries, creating local employment opportunities. Water infrastructure projects reduce the burden of water collection, improve public health outcomes, and support agricultural productivity. When citizens understand infrastructure budgets, they can advocate for equitable distribution of projects across wards and hold county governments accountable for timely project completion.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "How does road infrastructure improvement directly benefit farmers in counties?",
            options: [
              "Reduces transport costs to access wider markets",
              "Increases the cost of farm inputs",
              "Limits access to urban areas",
              "Reduces agricultural productivity",
            ],
            answer: 0,
            explanation:
              "Better roads lower transport costs, allowing farmers to reach larger markets and earn better prices for their produce.",
          },
          {
            type: "reflection",
            question:
              "Having learned about infrastructure funding, what would you ask your county government about their infrastructure spending?",
            placeholder:
              "Think about specific projects in your ward or sub-county that need attention.",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Stage 4: County Budget Process",
    badge: "🏛️",
    badgeName: "CountyWatch",
    documentName: "County Integrated Development Plan (CIDP)",
    archive: "2026",
    link: "https://www.cog.go.ke",
    status: "Published",
    credits: "Credits: BNS Team",
    description:
      "Understand how county budgets are formulated, the CIDP cycle, and how citizens can track county development plans, annual budgets, and project implementation at the ward level.",
    expectations: [
      "Understand the CIDP cycle and how county budgets are planned.",
      "Learn how to access county budget documents.",
      "Track county projects and expenditure in your ward.",
      "Identify how to participate in county budget hearings.",
    ],
    steps: [
      {
        id: 1,
        title: "1. The CIDP Cycle",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage4_step1.mp3",
        transcript:
          "Every county government must prepare a CIDP every five years.\nThis plan outlines all development projects across every ward.\nThe CIDP is the foundation for annual county budgets.\nCitizens can review the CIDP to see what their county plans to build.",
        text: "The County Integrated Development Plan (CIDP) is a five-year plan that every county government is required to prepare under the County Governments Act. It sets the development priorities, programs, and projects for the county, broken down by sector and ward. The CIDP guides annual budgeting - every project in the county budget must trace back to the CIDP. Citizens who understand their county's CIDP can effectively track whether promised projects are actually funded and delivered.",
        trivia: [
          {
            type: "multiple-choice",
            question: "How often must a County Integrated Development Plan (CIDP) be prepared?",
            options: ["Every year", "Every five years", "Every ten years", "Every two years"],
            answer: 1,
            explanation:
              "The CIDP is a five-year strategic plan that guides county development priorities and annual budgeting.",
          },
        ],
      },
      {
        id: 2,
        title: "2. County Annual Budget Process",
        youtubeId: "wkPe3sWomoA",
        audioUrl: "/audio/stage4_step2.mp3",
        transcript:
          "Each county prepares an annual budget based on the CIDP.\nThe County Treasury drafts the budget by February.\nThe County Assembly reviews and approves it by June.\nCitizens can submit memoranda during the public participation phase.",
        text: "The county annual budget process follows a timeline set by the PFM Act. By February, the County Treasury prepares the budget estimates based on the CIDP and the County Fiscal Strategy Paper (CFSP). The County Assembly reviews the estimates, holds public hearings, and must approve the budget by June 30th. Citizens have the right to submit memoranda and appear before assembly committees to advocate for their priorities. Understanding this timeline allows you to know exactly when to engage.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "By what date must the County Assembly approve the annual county budget?",
            options: ["April 30th", "June 30th", "August 31st", "December 31st"],
            answer: 1,
            explanation:
              "The PFM Act requires the County Assembly to approve the annual budget by June 30th before the start of the new financial year.",
          },
          {
            type: "reflection",
            question:
              "If your ward's priority project was missing from the county budget, what steps would you take to raise this with the county government?",
            placeholder:
              "Think about approaching the MCA, writing a memorandum, or organizing with other residents.",
          },
        ],
      },
      {
        id: 3,
        title: "3. Tracking County Projects",
        youtubeId: "FkgRz4v2Llk",
        audioUrl: "/audio/stage4_step3.mp3",
        transcript:
          "Once the budget is approved, tracking implementation is key.\nCounty governments must publish quarterly budget reports.\nThe Controller of Budget also publishes county reports.\nYou can cross-check reported projects against actual work on the ground.",
        text: "After the budget is approved, county governments are required to publish quarterly budget implementation reports showing how much money has been spent on each project. The Controller of Budget issues independent reports comparing actual spending against budgeted amounts. Citizens can use these reports as a checklist: visit project sites, verify if the stated amounts match visible work, and report discrepancies to relevant oversight bodies. This is the essence of social audit.",
        trivia: [
          {
            type: "multiple-choice",
            question: "Which independent office publishes reports on actual county spending?",
            options: [
              "Controller of Budget",
              "County Governor",
              "Central Bank of Kenya",
              "Ethics and Anti-Corruption Commission",
            ],
            answer: 0,
            explanation:
              "The Controller of Budget publishes independent quarterly reports on actual national and county government spending.",
          },
        ],
      },
    ],
  },
  {
    id: 5,
    title: "Stage 5: Finance Bill & Taxation",
    badge: "📊",
    badgeName: "TaxWise",
    documentName: "Finance Bill & Tax Laws",
    archive: "2026",
    link: "https://www.kra.go.ke",
    status: "Published",
    credits: "Credits: BNS Team",
    description:
      "Demystify the Finance Bill process, understand how taxes fund public services, analyze the difference between national and county revenue, and learn how citizens can influence tax policy.",
    expectations: [
      "Understand what a Finance Bill is and why it matters.",
      "Learn the difference between national and county taxation.",
      "Analyze how tax policies affect households and businesses.",
      "Learn how to submit memoranda on tax proposals.",
    ],
    steps: [
      {
        id: 1,
        title: "1. What is the Finance Bill?",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage5_step1.mp3",
        transcript:
          "The Finance Bill is the government's annual tax proposal.\nIt is presented to Parliament alongside the Budget.\nIt proposes changes to tax rates, new taxes, and tax exemptions.\nThe bill goes through public participation before being passed into law.",
        text: "The Finance Bill is the legislative vehicle through which the government implements its tax policy proposals for each financial year. It is typically introduced in Parliament shortly after the Budget Speech and contains amendments to tax laws including income tax, VAT, excise duty, and customs tariffs. The bill undergoes first reading, public participation, committee review, second reading, and finally presidential assent. Citizens and businesses can submit memoranda to the relevant parliamentary committee with their views on proposed tax changes.",
        trivia: [
          {
            type: "multiple-choice",
            question: "What is the main purpose of the Finance Bill?",
            options: [
              "To propose changes to tax laws",
              "To approve county budgets",
              "To set interest rates",
              "To appoint government officials",
            ],
            answer: 0,
            explanation:
              "The Finance Bill is the government's primary instrument for proposing annual tax policy changes.",
          },
        ],
      },
      {
        id: 2,
        title: "2. National vs County Revenue",
        youtubeId: "wkPe3sWomoA",
        audioUrl: "/audio/stage5_step2.mp3",
        transcript:
          "Revenue is shared between national and county governments.\nNational government collects income tax, VAT, and corporation tax.\nCounties collect property rates, parking fees, and business permits.\nThe Division of Revenue Bill determines how much counties receive.",
        text: "Kenya operates a devolved revenue system. The national government collects the largest share of revenue through income tax (PAYEE), Value Added Tax (VAT at 16%), corporation tax (30%), and excise duty. County governments raise revenue through property rates, single business permits, parking fees, and other local charges. The Division of Revenue Bill, passed annually by Parliament, determines how much of the nationally collected revenue is allocated to county governments. The Commission on Revenue Allocation (CRA) makes recommendations on this sharing formula.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "Which commission recommends how national revenue is shared among counties?",
            options: [
              "Commission on Revenue Allocation (CRA)",
              "Electoral Commission (IEBC)",
              "Ethics Commission (EACC)",
              "Public Service Commission (PSC)",
            ],
            answer: 0,
            explanation:
              "The Commission on Revenue Allocation (CRA) makes recommendations on the formula for sharing national revenue among counties.",
          },
          {
            type: "reflection",
            question:
              "Do you think taxes in Kenya are fair? What would you change about the tax system?",
            placeholder:
              "Think about VAT on basic goods, income tax bands, or digital services tax.",
          },
        ],
      },
      {
        id: 3,
        title: "3. How to Engage on Tax Policy",
        youtubeId: "FkgRz4v2Llk",
        audioUrl: "/audio/stage5_step3.mp3",
        transcript:
          "Citizens can submit memoranda on the Finance Bill.\nYou can also attend public hearings by the Finance Committee.\ntax justice networks help citizens understand tax proposals.\nYour voice can shape tax policy that affects millions.",
        text: "Public participation in tax policy happens primarily through submission of memoranda to the National Assembly's Finance and Planning Committee when the Finance Bill is under review. Citizens can also participate in public hearings organized by the committee in various counties. Civil society organizations like the Tax Justice Network Africa provide simplified explanations of Finance Bill proposals to help citizens understand the implications. The Budget and Appropriations Committee also holds public hearings on the overall budget. Engaging in these processes ensures tax policies reflect the needs of ordinary Kenyans.",
        trivia: [
          {
            type: "multiple-choice",
            question: "Which parliamentary committee reviews the Finance Bill?",
            options: [
              "Finance and Planning Committee",
              "Health Committee",
              "Justice and Legal Affairs Committee",
              "Education Committee",
            ],
            answer: 0,
            explanation:
              "The Finance and Planning Committee of the National Assembly reviews the Finance Bill and receives public memoranda.",
          },
          {
            type: "reflection",
            question:
              "If you could propose one tax change to make the system more fair for ordinary Kenyans, what would it be and why?",
            placeholder:
              "Consider VAT on essential goods, tax relief for low-income earners, or digital services tax.",
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: "Stage 6: Public Participation",
    badge: "🗣️",
    badgeName: "VoiceAgent",
    documentName: "Public Participation Guidelines",
    archive: "2026",
    link: "https://www.parliament.go.ke",
    status: "Published",
    credits: "Credits: BNS Team",
    description:
      "Master the art of public participation in Kenya's budget process. Learn when and how to submit memoranda, speak at public hearings, and use constitutional tools to influence budget decisions.",
    expectations: [
      "Understand your constitutional right to public participation.",
      "Learn the key moments for public input in the budget cycle.",
      "Practice drafting effective memoranda.",
      "Identify the right committees and officials to engage.",
    ],
    steps: [
      {
        id: 1,
        title: "1. Your Right to Participate",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage6_step1.mp3",
        transcript:
          "Article 1 of the Constitution states all sovereign power belongs to the people.\nArticle 10 lists public participation as a national value.\nThe PFM Act requires county governments to involve citizens.\nIf they don't, you can challenge the budget in court.",
        text: "Public participation is a constitutional principle in Kenya, enshrined in Article 10 of the Constitution as a national value and principle of governance. The PFM Act explicitly requires both national and county governments to facilitate public participation in the budget process. The Constitution of Kenya (Article 201) also mandates that public finance shall be used in a way that is open and accountable, including public participation. The courts have consistently held that budgets passed without meaningful public participation can be challenged and annulled.",
        trivia: [
          {
            type: "multiple-choice",
            question: "Which Article of the Constitution lists public participation as a national value?",
            options: ["Article 10", "Article 35", "Article 201", "Article 228"],
            answer: 0,
            explanation:
              "Article 10 of the Constitution lists public participation as one of the national values and principles of governance.",
          },
        ],
      },
      {
        id: 2,
        title: "2. When to Participate",
        youtubeId: "wkPe3sWomoA",
        audioUrl: "/audio/stage6_step2.mp3",
        transcript:
          "The budget cycle has clear participation windows.\nCounty Fiscal Strategy Paper hearings happen by February.\nBudget estimates hearings happen by May.\nFinance Bill memoranda are due in June.\nKnow these dates to make your voice count.",
        text: "Public participation in the budget cycle happens at several key points: 1) County Fiscal Strategy Paper (CFSP) - public hearings by February, setting the county's revenue and spending priorities. 2) Budget estimates - public hearings by May on the detailed county budget. 3) Finance Bill - submissions by June on tax proposals. 4) CIDP review - every five years. 5) Annual Development Plan - public input before June each year. Knowing these windows allows you to prepare and submit well-considered input at the right time.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "During which month do County Fiscal Strategy Paper (CFSP) hearings typically take place?",
            options: ["February", "June", "September", "December"],
            answer: 0,
            explanation:
              "CFSP public hearings typically take place in February, setting the county's spending priorities for the coming year.",
          },
          {
            type: "reflection",
            question:
              "What budget issue in your county would you raise if you had the chance to speak at a public hearing?",
            placeholder:
              "Consider roads, water, healthcare facilities, or youth programs in your ward.",
          },
        ],
      },
      {
        id: 3,
        title: "3. How to Draft an Effective Memorandum",
        youtubeId: "FkgRz4v2Llk",
        audioUrl: "/audio/stage6_step3.mp3",
        transcript:
          "A good memorandum is clear, factual, and solution-oriented.\nState who you are and the issue you're addressing.\nProvide evidence and suggest specific changes.\nSubmit on time to the right committee.",
        text: "An effective budget memorandum should: 1) Identify yourself and your interest (citizen, group, business). 2) State clearly which item or policy you are addressing (e.g., Ward A road allocation). 3) Provide evidence or reasoning for your position (e.g., 'the road is impassable during rain, affecting 500 farmers'). 4) Suggest a specific change (e.g., 'increase allocation from Ksh 2M to Ksh 5M'). 5) Reference the relevant law or policy. 6) Submit to the correct committee before the deadline. Memoranda can be submitted individually or through community groups for greater impact.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "What is the most effective way to structure a budget memorandum?",
            options: [
              "State the issue clearly with evidence and a specific suggestion",
              "Submit a general complaint without specifics",
              "Only criticize without offering alternatives",
              "Copy a template without personalizing it",
            ],
            answer: 0,
            explanation:
              "An effective memorandum clearly states the issue, provides supporting evidence, and suggests specific changes or allocations.",
          },
          {
            type: "reflection",
            question:
              "Draft a short memorandum to your county assembly about a budget priority in your ward. What would your key ask be?",
            placeholder:
              "Example: 'I request the allocation for Ward X water project be increased from Ksh 1M to Ksh 3M to serve 2,000 households.'",
          },
        ],
      },
    ],
  },
  {
    id: 7,
    title: "Stage 7: Budget Implementation",
    badge: "📋",
    badgeName: "OversightPro",
    documentName: "Budget Implementation Reports",
    archive: "2026",
    link: "https://www.treasury.go.ke",
    status: "Published",
    credits: "Credits: BNS Team",
    description:
      "Track how budgets are actually implemented, understand absorption rates, monitor procurement processes, and use oversight tools to ensure budget promises become real projects.",
    expectations: [
      "Understand budget implementation and absorption rates.",
      "Learn how procurement and tendering work.",
      "Monitor project implementation in your ward.",
      "Use oversight reports to hold governments accountable.",
    ],
    steps: [
      {
        id: 1,
        title: "1. Understanding Budget Absorption",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage7_step1.mp3",
        transcript:
          "Budget absorption is the percentage of allocated funds actually spent.\nLow absorption means money was budgeted but not used.\nThis can delay projects and deny citizens services.\nCounties with low absorption lose development opportunities.",
        text: "Budget absorption rate refers to the percentage of allocated funds that a government entity actually spends within a financial year. Low absorption is a chronic problem in many counties, with some spending less than 50% of their development budget. Causes include delayed procurement, political interference, capacity gaps, and unrealistic budgeting. When funds are not absorbed, critical projects stall or are abandoned. Citizens can track absorption rates through quarterly Controller of Budget reports and demand explanations from their county governments for poor performance.",
        trivia: [
          {
            type: "multiple-choice",
            question: "What does a low budget absorption rate indicate?",
            options: [
              "Allocated funds were not spent on planned projects",
              "The county collected more revenue than expected",
              "The budget was too high",
              "Projects were completed ahead of schedule",
            ],
            answer: 0,
            explanation:
              "A low absorption rate means allocated funds were not spent, leading to stalled projects and unmet development targets.",
          },
        ],
      },
      {
        id: 2,
        title: "2. Procurement & Tendering",
        youtubeId: "wkPe3sWomoA",
        audioUrl: "/audio/stage7_step2.mp3",
        transcript:
          "Government procurement follows strict rules under the PPRA.\nAll tenders above a threshold must be advertised publicly.\nThe tender process must be fair, transparent, and competitive.\nCitizens can observe tender openings and request procurement records.",
        text: "Public procurement in Kenya is governed by the Public Procurement and Asset Disposal Act (PPADA). All government entities must follow competitive bidding processes for contracts above specified thresholds. Tenders must be advertised in at least one newspaper of national circulation and on the entity's website. The Public Procurement Regulatory Authority (PPRA) oversees compliance and maintains a portal where all tender information is published. Citizens have the right to inspect procurement records and challenge irregular awards through the Public Procurement Administrative Review Board.",
        trivia: [
          {
            type: "multiple-choice",
            question: "Which body regulates public procurement in Kenya?",
            options: [
              "Public Procurement Regulatory Authority (PPRA)",
              "Kenya Revenue Authority (KRA)",
              "Ethics and Anti-Corruption Commission (EACC)",
              "Controller of Budget (COB)",
            ],
            answer: 0,
            explanation:
              "The Public Procurement Regulatory Authority (PPRA) oversees compliance with procurement laws and manages the public procurement portal.",
          },
          {
            type: "reflection",
            question:
              "What would you do if you suspected a county tender was awarded irregularly?",
            placeholder:
              "Consider reporting to PPRA, the county assembly, or using citizen monitoring groups.",
          },
        ],
      },
      {
        id: 3,
        title: "3. Oversight & Accountability",
        youtubeId: "FkgRz4v2Llk",
        audioUrl: "/audio/stage7_step3.mp3",
        transcript:
          "Multiple oversight bodies monitor budget implementation.\nThe Auditor General audits all county accounts annually.\nThe County Assembly's oversight committee reviews spending.\nCitizen oversight is the most powerful accountability tool.",
        text: "Budget oversight in Kenya involves multiple institutions: 1) The Auditor General audits all national and county government accounts annually and produces reports on financial management. 2) The Controller of Budget reports quarterly on budget implementation. 3) County Assembly oversight committees review spending and summon county officials. 4) The Ethics and Anti-Corruption Commission investigates financial misconduct. 5) Civil society organizations and citizen budget groups track implementation at the local level. The most effective oversight combines these institutional mechanisms with active citizen monitoring of projects in their own communities.",
        trivia: [
          {
            type: "multiple-choice",
            question: "Who is responsible for auditing all county government accounts?",
            options: [
              "The Auditor General",
              "The County Governor",
              "The Controller of Budget",
              "The County Assembly",
            ],
            answer: 0,
            explanation:
              "The Auditor General is constitutionally mandated to audit and report on the accounts of all national and county governments annually.",
          },
          {
            type: "reflection",
            question:
              "How would you organize your community to monitor a county road construction project in your ward?",
            placeholder:
              "Think about forming a project monitoring committee, regular site visits, and reporting findings to the county assembly.",
          },
        ],
      },
    ],
  },
  {
    id: 8,
    title: "Stage 8: Audit & Evaluation",
    badge: "🎓",
    badgeName: "CivicExpert",
    documentName: "Audit Reports & Citizen Scorecard",
    archive: "2026",
    link: "https://www.oagkenya.go.ke",
    status: "Published",
    credits: "Credits: BNS Team",
    description:
      "Complete your civic journey by learning how to analyze audit reports, use citizen scorecards to evaluate government performance, and become a certified Civic Expert with the tools to lead accountability efforts in your community.",
    expectations: [
      "Understand audit reports and how to read them.",
      "Learn how to create and use citizen scorecards.",
      "Master the complete budget cycle from planning to audit.",
      "Earn your Civic Expert badge and certificate.",
    ],
    steps: [
      {
        id: 1,
        title: "1. Reading Audit Reports",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage8_step1.mp3",
        transcript:
          "The Auditor General produces three main opinions.\nUnqualified means the accounts are fairly presented.\nQualified means there are some issues.\nAdverse or disclaimer means serious problems exist.\nEvery citizen should know how to read these reports.",
        text: "The Auditor General's report on a county's financial statements typically includes one of four opinions: 1) Unqualified/clean opinion - the financial statements are fairly presented. 2) Qualified opinion - there are some material misstatements but not pervasive. 3) Adverse opinion - the financial statements are materially misstated. 4) Disclaimer of opinion - the Auditor General could not obtain sufficient evidence. Audit reports also highlight specific issues such as irregular procurement, unexplained expenditures, and pending bills. Citizens can access all audit reports through the Office of the Auditor General's website.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "What does an 'adverse opinion' in an audit report mean?",
            options: [
              "Financial statements are materially misstated",
              "Everything is fine",
              "The audit could not be completed",
              "Minor issues were found",
            ],
            answer: 0,
            explanation:
              "An adverse opinion means the Auditor General has found that financial statements contain material misstatements that affect their overall accuracy.",
          },
        ],
      },
      {
        id: 2,
        title: "2. Citizen Scorecards",
        youtubeId: "wkPe3sWomoA",
        audioUrl: "/audio/stage8_step2.mp3",
        transcript:
          "Citizen scorecards are simple tools to rate government performance.\nYou evaluate specific services like roads or healthcare.\nScorecards can be compiled and presented to county officials.\nThey give citizens a structured way to demand better services.",
        text: "Citizen scorecards are participatory monitoring tools that allow communities to evaluate the quality, accessibility, and responsiveness of public services in their area. A typical scorecard rates services (water, health, roads, education) on criteria such as availability, timeliness, cost, and satisfaction. Community members collectively score each service, identify problems, and propose solutions. The compiled scorecard is then presented to service providers and county officials during feedback meetings. This approach has been used effectively by organizations like Social Development Network (SODNET) and the National Taxpayers Association (NTA) in Kenya.",
        trivia: [
          {
            type: "multiple-choice",
            question: "What is the primary purpose of a citizen scorecard?",
            options: [
              "To evaluate public service quality and demand accountability",
              "To collect taxes from citizens",
              "To replace government monitoring systems",
              "To register voters",
            ],
            answer: 0,
            explanation:
              "Citizen scorecards enable communities to evaluate public services, identify gaps, and present evidence-based feedback to service providers.",
          },
          {
            type: "reflection",
            question:
              "Design a simple scorecard for a service in your county (e.g., road maintenance, water supply, or health center). What criteria would you use?",
            placeholder:
              "Consider criteria like accessibility, cost, waiting time, quality, and staff responsiveness.",
          },
        ],
      },
      {
        id: 3,
        title: "3. Graduation: Civic Expert Certification",
        youtubeId: "FkgRz4v2Llk",
        audioUrl: "/audio/stage8_step3.mp3",
        transcript:
          "Congratulations! You have completed all 8 stages.\nYou now understand the complete budget cycle.\nFrom the Constitution to audit, you can track every shilling.\nYou are now a certified Civic Expert. Go make a difference!",
        text: "You have completed the complete Budget Ndio Story civic education journey. You now understand: the Constitutional foundations of public finance (Stage 1), how the Budget Policy Statement sets national priorities (Stage 2), infrastructure planning and funding (Stage 3), the county budget process from CIDP to implementation (Stage 4), taxation and the Finance Bill (Stage 5), public participation rights and tools (Stage 6), budget implementation and procurement oversight (Stage 7), and finally audit and citizen evaluation (Stage 8). You have earned all 8 badges and the Civic Expert credential. Use your knowledge to hold leaders accountable and advocate for transparent, equitable budgeting in your community.",
        trivia: [
          {
            type: "multiple-choice",
            question:
              "How many stages have you completed to earn the Civic Expert certification?",
            options: ["4", "6", "8", "10"],
            answer: 2,
            explanation:
              "Completing all 8 stages of the Budget Ndio Story journey earns you the Civic Expert badge and certification.",
          },
          {
            type: "reflection",
            question:
              "Reflect on your civic journey. What is the most important thing you have learned about Kenya's budget process, and how will you use this knowledge in your community?",
            placeholder:
              "Share your commitment to budget tracking, public participation, or community organizing.",
          },
        ],
      },
    ],
  },
];

export const getStageTakeaway = (stageId: number, stepId: number) => {
  if (stageId === 1) {
    if (stepId === 1)
      return {
        type: "info" as const,
        title: "Key Principle",
        text: "Article 201 mandates that the public finance system must promote an equitable society and be open to public participation.",
      };
    if (stepId === 2)
      return {
        type: "info" as const,
        title: "Access to Info",
        text: "Article 35 gives you the right to access county budgets and plans. Transparency is a legal requirement, not a favor.",
      };
    if (stepId === 3)
      return {
        type: "warning" as const,
        title: "Independent Watchdog",
        text: "The Controller of Budget (COB) must approve all withdrawals from public funds, preventing unauthorized spending.",
      };
  }
  if (stageId === 2) {
    if (stepId === 1)
      return {
        type: "info" as const,
        title: "Critical Date",
        text: "By law, the Treasury must submit the BPS to Parliament by February 15th annually to guide the national budget.",
      };
    if (stepId === 2)
      return {
        type: "info" as const,
        title: "BETA Pillars",
        text: "The 2026 BPS prioritizes Agriculture and MSMEs through Hustler Fund expansion and county-level training hubs.",
      };
    if (stepId === 3)
      return {
        type: "info" as const,
        title: "UHC Target",
        text: "The Universal Health Coverage goal is to enroll 35 million Kenyans into the Social Health Authority (SHA).",
      };
    if (stepId === 4)
      return {
        type: "warning" as const,
        title: "Debt Ceiling Impact",
        text: "With over KES 1 Trillion in debt interest, development budgets are squeezed, requiring strict fiscal discipline.",
      };
  }
  if (stageId === 4) {
    if (stepId === 1)
      return {
        type: "info" as const,
        title: "Five-Year Plan",
        text: "The CIDP is a five-year blueprint that guides all county development projects and annual budget allocations.",
      };
    if (stepId === 2)
      return {
        type: "info" as const,
        title: "Budget Deadline",
        text: "County budgets must be approved by June 30th. Citizens should engage during the CFSP hearings in February.",
      };
    if (stepId === 3)
      return {
        type: "warning" as const,
        title: "Track & Verify",
        text: "Quarterly Controller of Budget reports allow citizens to cross-check actual spending against budgeted amounts.",
      };
  }
  if (stageId === 5) {
    if (stepId === 1)
      return {
        type: "info" as const,
        title: "Annual Tax Bill",
        text: "The Finance Bill is presented annually and proposes all tax changes for the coming financial year.",
      };
    if (stepId === 2)
      return {
        type: "info" as const,
        title: "Revenue Sharing",
        text: "The Commission on Revenue Allocation recommends the formula for sharing national revenue among the 47 counties.",
      };
    if (stepId === 3)
      return {
        type: "warning" as const,
        title: "Your Tax Voice",
        text: "Citizens can submit memoranda on tax proposals to the Finance and Planning Committee of Parliament.",
      };
  }
  if (stageId === 6) {
    if (stepId === 1)
      return {
        type: "info" as const,
        title: "Constitutional Right",
        text: "Public participation is a national value under Article 10. Budgets passed without it can be challenged in court.",
      };
    if (stepId === 2)
      return {
        type: "info" as const,
        title: "Know the Dates",
        text: "CFSP hearings in February, budget hearings in May, Finance Bill submissions in June - mark your calendar.",
      };
    if (stepId === 3)
      return {
        type: "warning" as const,
        title: "Effective Memoranda",
        text: "A clear memorandum with evidence and specific suggestions has far more impact than a general complaint.",
      };
  }
  if (stageId === 7) {
    if (stepId === 1)
      return {
        type: "warning" as const,
        title: "Watch Absorption",
        text: "Low budget absorption means allocated funds weren't spent. Many counties spend less than 50% on development.",
      };
    if (stepId === 2)
      return {
        type: "info" as const,
        title: "Open Procurement",
        text: "The PPRA oversees public procurement. All tenders above a threshold must be publicly advertised and competitively bid.",
      };
    if (stepId === 3)
      return {
        type: "info" as const,
        title: "Multiple Watchdogs",
        text: "Auditor General, Controller of Budget, County Assembly committees, and citizens all provide budget oversight.",
      };
  }
  if (stageId === 8) {
    if (stepId === 1)
      return {
        type: "info" as const,
        title: "Read the Opinion",
        text: "Audit opinions range from unqualified (clean) to adverse (serious problems). Every citizen should know how to read them.",
      };
    if (stepId === 2)
      return {
        type: "info" as const,
        title: "Scorecard Power",
        text: "Citizen scorecards give communities a structured way to evaluate services and demand accountability from officials.",
      };
    if (stepId === 3)
      return {
        type: "info" as const,
        title: "Civic Expert",
        text: "You now understand the full budget cycle from Constitution to audit. You are certified to lead accountability efforts.",
      };
  }
  return null;
};
