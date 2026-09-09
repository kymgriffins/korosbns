export type GlossaryCategory =
  | "national"
  | "county"
  | "debt-fiscal"
  | "oversight"
  | "legal";

export interface GlossaryEntry {
  slug: string;
  term: string;
  shortDefinition: string;
  fullExplanation: string;
  category: GlossaryCategory;
  legalBasis?: string;
  relatedSlugs?: string[];
  swahiliContext?: string;
}

export const GLOSSARY_CATEGORIES: { id: GlossaryCategory | "all"; label: string; count?: number }[] = [
  { id: "all", label: "All Terms" },
  { id: "national", label: "National Budget" },
  { id: "county", label: "Devolution & Counties" },
  { id: "debt-fiscal", label: "Debt & Fiscal Policy" },
  { id: "oversight", label: "Audits & Oversight" },
  { id: "legal", label: "Constitutional & Legal" },
];

export const BUDGET_GLOSSARY: GlossaryEntry[] = [
  {
    slug: "absorption-rate",
    term: "Absorption Rate",
    shortDefinition: "The percentage of allocated budget funds that an agency or county actually spends within a financial year.",
    fullExplanation:
      "Absorption rate measures operational efficiency. If a county allocates KES 5 billion for development projects like hospitals and water systems but only disburses KES 2.5 billion by June 30, its development absorption rate is 50%. Low absorption often reflects procurement bottlenecks, delayed exchequer releases, or planning deficiencies.",
    category: "oversight",
    legalBasis: "PFM Act 2012 Section 166",
    relatedSlugs: ["development-expenditure", "controller-of-budget"],
  },
  {
    slug: "annual-development-plan",
    term: "Annual Development Plan (ADP)",
    shortDefinition: "A county's 1-year operational plan extracting annual priority projects from the 5-year CIDP.",
    fullExplanation:
      "The ADP is prepared by the County Executive and tabled in the County Assembly by September 1 each year. It identifies specific development programs, targets, cost estimates, and key performance indicators for the upcoming fiscal year. Without an approved ADP, a county budget cannot be legally grounded.",
    category: "county",
    legalBasis: "PFM Act 2012 Section 126",
    relatedSlugs: ["county-integrated-development-plan", "county-fiscal-strategy-paper"],
  },
  {
    slug: "appropriation-act",
    term: "Appropriation Act / Bill",
    shortDefinition: "The law passed by Parliament or a County Assembly formally authorizing the government to spend public money.",
    fullExplanation:
      "No public money can be withdrawn from the Consolidated Fund or County Revenue Fund without an Appropriation Act. The executive submits budget estimates, Parliament deliberates and amends them, and then enacts the Appropriation Bill into law, creating legally binding expenditure votes.",
    category: "legal",
    legalBasis: "Constitution of Kenya Article 221 & 222",
    relatedSlugs: ["consolidated-fund", "supplementary-budget"],
    swahiliContext: "Sheria ya Matumizi ya Fedha za Umma",
  },
  {
    slug: "article-201-principles",
    term: "Article 201 Principles",
    shortDefinition: "The mandatory constitutional standards that govern all public finance in Kenya.",
    fullExplanation:
      "Article 201 dictates that public finance must promote openness, accountability, public participation, and fair tax burdens. Revenue and expenditure must be shared equitably between generations, public money must be used prudently and responsibly, and financial reporting must be clear and timely.",
    category: "legal",
    legalBasis: "Constitution of Kenya Article 201",
    relatedSlugs: ["public-participation", "fiscal-responsibility-principles"],
  },
  {
    slug: "auditor-general",
    term: "Auditor-General (OAG)",
    shortDefinition: "The independent constitutional authority auditing all public accounts of national, county, and statutory entities.",
    fullExplanation:
      "Within 6 months after the end of each financial year, the Auditor-General audits and submits reports to Parliament and County Assemblies on the accounts of national and county governments, courts, commissions, and state corporations. The OAG verifies whether public funds were applied lawfully and effectively.",
    category: "oversight",
    legalBasis: "Constitution of Kenya Article 229; Public Audit Act 2015",
    relatedSlugs: ["controller-of-budget", "pending-bills"],
    swahiliContext: "Mkaguzi Mkuu wa Hesabu za Serikali",
  },
  {
    slug: "beta-agenda",
    term: "BETA (Bottom-Up Economic Transformation Agenda)",
    shortDefinition: "Kenya's current medium-term economic blueprint prioritizing 5 primary sectors.",
    fullExplanation:
      "BETA is the government's economic agenda focused on Agriculture, Micro, Small and Medium Enterprises (MSMEs), Affordable Housing, Universal Health Coverage (UHC), and the Digital Superhighway and Creative Economy. Budget Policy Statements and annual ministerial allocations are weighted toward these pillars.",
    category: "national",
    relatedSlugs: ["budget-policy-statement", "medium-term-expenditure-framework"],
  },
  {
    slug: "budget-policy-statement",
    term: "Budget Policy Statement (BPS)",
    shortDefinition: "The national executive's macroeconomic blueprint published by February 15 setting budget ceilings.",
    fullExplanation:
      "The BPS is Kenya's early budget roadmap. Prepared by the National Treasury, it outlines macro-fiscal projections, estimated total revenue, borrowing ceilings, vertical division of revenue between national and county governments, and sector-by-sector allocation limits before detailed ministry estimates are published.",
    category: "national",
    legalBasis: "PFM Act 2012 Section 25",
    relatedSlugs: ["division-of-revenue-act", "appropriation-act"],
  },
  {
    slug: "commission-on-revenue-allocation",
    term: "Commission on Revenue Allocation (CRA)",
    shortDefinition: "Constitutional body recommending the basis for sharing revenue between national and county governments.",
    fullExplanation:
      "The CRA is an independent commission established to make non-partisan recommendations concerning the basis for the equitable sharing of revenue between national and county governments, and among the 47 county governments based on population, poverty index, land area, and fiscal effort.",
    category: "oversight",
    legalBasis: "Constitution of Kenya Article 215 & 216",
    relatedSlugs: ["equitable-share", "division-of-revenue-act"],
  },
  {
    slug: "conditional-grants",
    term: "Conditional Grants",
    shortDefinition: "Transfers to county governments with legally earmarked restrictions on how funds may be used.",
    fullExplanation:
      "Unlike the unconditional Equitable Share, conditional grants must be spent on specific designated projects or national priorities (such as donor-funded health initiatives, leasing of medical technology, county emergency responses, or development of rural roads).",
    category: "county",
    legalBasis: "Constitution of Kenya Article 202(2)",
    relatedSlugs: ["equitable-share", "county-allocation-of-revenue-act"],
  },
  {
    slug: "consolidated-fund",
    term: "Consolidated Fund",
    shortDefinition: "The primary national bank account into which all general public revenues are deposited.",
    fullExplanation:
      "Established under Article 206, the Consolidated Fund is the central repository of national public funds. No money can be withdrawn from this fund except to meet expenditure charged upon it by the Constitution (such as debt repayment and judges' salaries) or authorized by an Appropriation Act.",
    category: "national",
    legalBasis: "Constitution of Kenya Article 206",
    relatedSlugs: ["statutory-transfers", "controller-of-budget"],
    swahiliContext: "Hazina Kuu ya Serikali",
  },
  {
    slug: "contingencies-fund",
    term: "Contingencies Fund",
    shortDefinition: "A national emergency reserve fund to finance urgent and unforeseen expenditures.",
    fullExplanation:
      "Managed by the Cabinet Secretary for the National Treasury, this fund allows government to respond swiftly to sudden emergencies (such as national disasters, severe droughts, or epidemics) before seeking retroactive approval through a supplementary appropriation bill.",
    category: "national",
    legalBasis: "Constitution of Kenya Article 208",
    relatedSlugs: ["supplementary-budget"],
  },
  {
    slug: "controller-of-budget",
    term: "Controller of Budget (OCOB)",
    shortDefinition: "The independent constitutional watchdog authorizing all withdrawals of public funds.",
    fullExplanation:
      "The Controller of Budget oversees the implementation of budgets for both national and county governments. Crucially, the Controller has the veto power to refuse any withdrawal from the Consolidated Fund or County Revenue Funds if the expenditure is not backed by an approved law or exceeds authorized ceilings.",
    category: "oversight",
    legalBasis: "Constitution of Kenya Article 228",
    relatedSlugs: ["consolidated-fund", "auditor-general"],
  },
  {
    slug: "county-allocation-of-revenue-act",
    term: "County Allocation of Revenue Act (CARA)",
    shortDefinition: "The annual law specifying exactly how much money each of the 47 counties receives.",
    fullExplanation:
      "Enacted by Parliament every year following the Division of Revenue Act, CARA breaks down the total county equitable share and conditional grants into specific shilling figures for each of Kenya's 47 individual counties using the CRA revenue-sharing formula.",
    category: "county",
    legalBasis: "Constitution of Kenya Article 218(1)(b)",
    relatedSlugs: ["division-of-revenue-act", "equitable-share"],
  },
  {
    slug: "county-fiscal-strategy-paper",
    term: "County Fiscal Strategy Paper (CFSP)",
    shortDefinition: "The county equivalent of the national BPS, setting departmental expenditure ceilings.",
    fullExplanation:
      "The County Treasury submits the CFSP to the County Assembly by February 28 each year. It links county development objectives from the CIDP and ADP to concrete revenue forecasts and sets broad expenditure ceilings for county departments (Health, Agriculture, Roads, Trade).",
    category: "county",
    legalBasis: "PFM Act 2012 Section 117",
    relatedSlugs: ["budget-policy-statement", "annual-development-plan"],
  },
  {
    slug: "county-integrated-development-plan",
    term: "County Integrated Development Plan (CIDP)",
    shortDefinition: "A 5-year strategic blueprint outlining a county's overall development agenda.",
    fullExplanation:
      "Prepared every 5 years coinciding with the term of the county government, the CIDP coordinates spatial, economic, and institutional planning. It is the master document from which Annual Development Plans and annual county budgets must legally be derived.",
    category: "county",
    legalBasis: "County Governments Act 2012 Section 108",
    relatedSlugs: ["annual-development-plan", "county-fiscal-strategy-paper"],
  },
  {
    slug: "debt-service-ratio",
    term: "Debt Service to Revenue Ratio",
    shortDefinition: "The share of tax revenues swallowed by paying interest and principal on public debt.",
    fullExplanation:
      "A key indicator of fiscal distress. When debt service exceeds 60% of ordinary tax revenue, over 60 cents of every tax shilling collected goes to lenders before a single shilling can be spent on medicine, teachers, police, or capital infrastructure.",
    category: "debt-fiscal",
    relatedSlugs: ["fiscal-deficit", "public-debt-ceiling"],
  },
  {
    slug: "development-expenditure",
    term: "Development Expenditure",
    shortDefinition: "Spending allocated to constructing and expanding capital assets and public infrastructure.",
    fullExplanation:
      "Development spending creates long-term value: schools, irrigation schemes, roads, hospitals, and dams. The PFM Act mandates that both national and county governments must allocate at least 30% of their total budgets to development expenditure over the medium term.",
    category: "national",
    legalBasis: "PFM Act 2012 Section 15(2)(a) & Section 107(2)(b)",
    relatedSlugs: ["recurrent-expenditure", "absorption-rate"],
  },
  {
    slug: "division-of-revenue-act",
    term: "Division of Revenue Act (DORA)",
    shortDefinition: "The annual law dividing national revenues vertically between the national and county governments.",
    fullExplanation:
      "Introduced in the National Assembly each year alongside the BPS, DORA resolves the vertical division of nationally raised revenue: how many billions go to the National Government and how many billions are assigned to County Governments as the equitable share.",
    category: "national",
    legalBasis: "Constitution of Kenya Article 218(1)(a)",
    relatedSlugs: ["equitable-share", "county-allocation-of-revenue-act"],
  },
  {
    slug: "equalisation-fund",
    term: "Equalisation Fund",
    shortDefinition: "A special fund receiving 0.5% of national revenue to bring marginalized areas up to national standards.",
    fullExplanation:
      "Created under Article 204 of the Constitution, the fund is intended to run for 20 years to provide basic services—water, roads, health facilities, and electricity—to historically marginalized counties and communities identified by the Commission on Revenue Allocation.",
    category: "county",
    legalBasis: "Constitution of Kenya Article 204",
    relatedSlugs: ["equitable-share", "commission-on-revenue-allocation"],
  },
  {
    slug: "equitable-share",
    term: "Equitable Share",
    shortDefinition: "The unconditional constitutional transfer of national revenue given to county governments.",
    fullExplanation:
      "The Constitution guarantees county governments an equitable share of not less than 15% of all revenue collected by the national government, calculated on the basis of the most recent audited accounts approved by the National Assembly. Unlike conditional grants, counties decide how to budget this money.",
    category: "county",
    legalBasis: "Constitution of Kenya Article 203(2)",
    relatedSlugs: ["division-of-revenue-act", "county-allocation-of-revenue-act"],
    swahiliContext: "Gawio Halali la Mapato ya Kaunti",
  },
  {
    slug: "finance-bill",
    term: "Finance Bill & Finance Act",
    shortDefinition: "The annual bill proposing changes to tax laws, excise duties, and levies to finance the budget.",
    fullExplanation:
      "Submitted to Parliament by the Cabinet Secretary for the National Treasury by April 30. It sets out the government's revenue-raising measures: income tax, value-added tax (VAT), excise duty, and import duties. Once debated, amended, and signed into law by the President, it becomes the Finance Act.",
    category: "national",
    legalBasis: "Constitution Article 221; PFM Act Section 40",
    relatedSlugs: ["appropriation-act", "fiscal-deficit"],
    swahiliContext: "Mswada wa Fedha",
  },
  {
    slug: "fiscal-deficit",
    term: "Fiscal Deficit",
    shortDefinition: "The gap between what government spends and what it collects in ordinary revenue.",
    fullExplanation:
      "When expenditures and net lending exceed revenue and grants, the difference is a fiscal deficit. Governments finance this gap through borrowing—either from foreign lenders (concessional loans, commercial Eurobonds) or domestically (Treasury bills and bonds issued through the Central Bank).",
    category: "debt-fiscal",
    legalBasis: "PFM Act 2012 Section 15(2)",
    relatedSlugs: ["public-debt-ceiling", "debt-service-ratio"],
  },
  {
    slug: "fiscal-responsibility-principles",
    term: "Fiscal Responsibility Principles",
    shortDefinition: "Statutory rules in the PFM Act governing public spending, debt limits, and wage ceilings.",
    fullExplanation:
      "Both national and county governments are bound by law to observe key rules: at least 30% of expenditure on development; wages and benefits not exceeding 35% of revenue; borrowing used only to finance development (never recurrent consumption); and prudent management of fiscal risks.",
    category: "legal",
    legalBasis: "PFM Act 2012 Section 15 (National) & Section 107 (Counties)",
    relatedSlugs: ["development-expenditure", "recurrent-expenditure"],
  },
  {
    slug: "medium-term-expenditure-framework",
    term: "Medium Term Expenditure Framework (MTEF)",
    shortDefinition: "A rolling 3-year budgeting system aligning strategic policy priorities with multi-year budgets.",
    fullExplanation:
      "Rather than planning one isolated year at a time, MTEF links policies, planning, and budgets over a 3-year rolling horizon. The current budget year forms the base, while the outer two years provide projections, giving ministries predictability for multi-year capital projects.",
    category: "national",
    relatedSlugs: ["budget-policy-statement", "program-based-budgeting"],
  },
  {
    slug: "own-source-revenue",
    term: "Own-Source Revenue (OSR)",
    shortDefinition: "Revenues collected directly by county governments from local fees, rates, and licenses.",
    fullExplanation:
      "Counties are empowered to levy property rates, entertainment taxes, parking charges, market stall fees, single business permits, and natural resource royalties. OSR complements the equitable share, giving counties financial autonomy to fund local development.",
    category: "county",
    legalBasis: "Constitution of Kenya Article 209(3)",
    relatedSlugs: ["equitable-share", "county-fiscal-strategy-paper"],
    swahiliContext: "Mapato ya Ndani ya Kaunti",
  },
  {
    slug: "parliamentary-budget-office",
    term: "Parliamentary Budget Office (PBO)",
    shortDefinition: "Non-partisan economic research unit providing analytical budget support to Members of Parliament.",
    fullExplanation:
      "Modeled after the US Congressional Budget Office, the PBO provides independent, non-partisan analysis of the economy, macroeconomic forecasts, budget policy statements, and proposed legislation to Parliamentary committees (such as the Budget and Appropriations Committee).",
    category: "oversight",
    legalBasis: "PFM Act 2012 Section 10",
    relatedSlugs: ["budget-policy-statement", "public-participation"],
  },
  {
    slug: "pending-bills",
    term: "Pending Bills",
    shortDefinition: "Unpaid invoices and contractor claims carried over into a new financial year without settlement.",
    fullExplanation:
      "Pending bills occur when public entities contract goods, services, or civil works but fail to pay vendors before the financial year closes on June 30. Excessive pending bills strangle private businesses, cause bankruptcies, and distort official deficit figures. The PFM regulations require pending bills to be treated as a first charge on the subsequent year's budget.",
    category: "oversight",
    legalBasis: "PFM Regulations 2015 Regulation 41(2)",
    relatedSlugs: ["auditor-general", "controller-of-budget"],
  },
  {
    slug: "program-based-budgeting",
    term: "Program-Based Budgeting (PBB)",
    shortDefinition: "Budgeting focused on measurable outputs and outcomes rather than generic accounting line-items.",
    fullExplanation:
      "Under PBB, public funds are grouped into programs and sub-programs with clearly defined objectives, key performance indicators (KPIs), baseline numbers, and multi-year targets (e.g., 'Primary Healthcare Program — immunize 95% of infants'), enabling citizens to evaluate value for money.",
    category: "national",
    legalBasis: "PFM Act 2012 Section 38",
    relatedSlugs: ["medium-term-expenditure-framework"],
  },
  {
    slug: "public-debt-ceiling",
    term: "Public Debt Ceiling & Debt Anchor",
    shortDefinition: "The statutory limit set by Parliament on total public borrowing to ensure debt sustainability.",
    fullExplanation:
      "In 2023, Kenya transitioned from a fixed numerical debt ceiling (KES 10 trillion) to a medium-term debt anchor set at 55% of Gross Domestic Product (GDP) in present value terms. The anchor binds the National Treasury to consolidate fiscal deficits whenever debt breaches this threshold.",
    category: "debt-fiscal",
    legalBasis: "PFM Act 2012 Section 50; PFM Amendment 2023",
    relatedSlugs: ["fiscal-deficit", "debt-service-ratio"],
  },
  {
    slug: "public-participation",
    term: "Public Participation",
    shortDefinition: "The mandatory process of involving citizens in government decision-making and budget approvals.",
    fullExplanation:
      "Articles 10, 118, 174, and 201 of the Constitution mandate open citizen engagement in formulating policies, tax laws, and budgets. The executive and legislature must conduct accessible public hearings and consider citizen input before passing the BPS, Finance Bill, and Appropriation Act.",
    category: "legal",
    legalBasis: "Constitution of Kenya Articles 10, 118, 196, 201",
    relatedSlugs: ["article-201-principles", "budget-policy-statement"],
  },
  {
    slug: "recurrent-expenditure",
    term: "Recurrent Expenditure",
    shortDefinition: "Operational government spending on salaries, pensions, debt interest, and daily administrative running costs.",
    fullExplanation:
      "Recurrent expenditure consumes the largest share of public revenue. It funds civil service wages, police fuel, hospital medical supplies, university capitation, and ongoing administrative overhead. Because it does not build new capital assets, the PFM Act seeks to limit its growth relative to revenue.",
    category: "national",
    legalBasis: "PFM Act 2012 Section 15(2)",
    relatedSlugs: ["development-expenditure", "statutory-transfers"],
  },
  {
    slug: "statutory-transfers",
    term: "Statutory Transfers (Consolidated Fund Services)",
    shortDefinition: "Non-discretionary payments that must be settled by law before any other government spending.",
    fullExplanation:
      "Also known as Consolidated Fund Services (CFS). These include public debt interest and redemptions, pensions for retired civil servants, constitutional commissioners' remuneration, and judicial salaries. Parliament cannot reduce or reject these votes, as they are guaranteed by the Constitution.",
    category: "national",
    legalBasis: "Constitution of Kenya Article 228(5) & Article 206",
    relatedSlugs: ["consolidated-fund", "debt-service-ratio"],
  },
  {
    slug: "supplementary-budget",
    term: "Supplementary Budget",
    shortDefinition: "Mid-year legislative revision to amend approved allocations, accommodate emergencies, or regularize spending.",
    fullExplanation:
      "When revenue underperforms or unforeseen emergencies arise, the National Treasury submits a Supplementary Appropriation Bill to Parliament. Article 223 permits spending before parliamentary approval under strict conditions, provided authorization is sought within two months of withdrawal.",
    category: "national",
    legalBasis: "Constitution of Kenya Article 223 (National) & Article 224 (Counties)",
    relatedSlugs: ["appropriation-act", "contingencies-fund"],
  },
  {
    slug: "treasury-single-account",
    term: "Treasury Single Account (TSA)",
    shortDefinition: "A unified structure of government bank accounts providing complete real-time visibility over public cash.",
    fullExplanation:
      "Maintained at the Central Bank of Kenya, TSA consolidates balances from thousands of disparate ministry and agency bank accounts into a single pool. This prevents scenarios where government borrows expensive commercial funds while ministries hold dormant surplus balances.",
    category: "oversight",
    relatedSlugs: ["consolidated-fund", "controller-of-budget"],
  },
];
