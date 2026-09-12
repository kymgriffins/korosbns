import terraTranscriptJson from "./project-terra-transcript.json";

export interface TranscriptSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

export interface ProjectTranscript {
  videoId: string;
  title: string;
  lead: string;
  organization: string;
  partner: string;
  language: string;
  full_transcript: string;
  segments: TranscriptSegment[];
}

export const projectTerraTranscript = terraTranscriptJson as ProjectTranscript;

export interface ProjectTerraPillar {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  body: string;
  keyQuestions: string[];
}

export interface AnalyticalMechanism {
  number: string;
  title: string;
  subtitle: string;
  definition: string;
  platformImpact: string;
  fiscalConsequence: string;
}

export const PROJECT_TERRA_METADATA = {
  id: "project-terra",
  slug: "terra",
  canonicalSlug: "project-terra",
  title: "Project TERRA",
  fullTitle: "Project TERRA: Technology, Equality, Regulatory Risk Assessment",
  acronym: "Technology, Equality, Regulatory Risk Assessment",
  timeframe: "2026 - 2027 (Two-Year Programme)",
  leadInvestigator: {
    name: "Dr. Lyla Latif",
    role: "Principal Investigator & Director",
    affiliation: "House of Fiscal Wisdom & University of Nairobi",
    bio: "Public finance and technology governance law specialist based in Nairobi, spearheading research on digital fiscal ontology, algorithmic bias in taxation, and African resource mobilization.",
  },
  institutionalHost: {
    name: "House of Fiscal Wisdom",
    role: "Institutional Host & Secretariat",
    location: "Nairobi, Kenya",
    url: "https://www.house-of-fiscal-wisdom.org",
    email: "director@house-of-fiscal-wisdom.org",
    coFounders: "Dr. Lyla Latif & Prof. Attiya Waris",
    description: "A Global Commission on Financing Development headquartered in Nairobi, positioning itself as an African institutional alternative to the Bretton Woods architecture.",
  },
  funder: {
    name: "Luminate",
    focus: "Governance, digital rights, and public accountability",
  },
  video: {
    id: "it8rOKSYKnc",
    embedUrl: "https://www.youtube-nocookie.com/embed/it8rOKSYKnc",
    watchUrl: "https://www.youtube.com/watch?v=it8rOKSYKnc",
    title: "Project Terra Documentary Announcement",
    durationSeconds: 109,
    durationFormatted: "01:49",
  },
  summary:
    "Project TERRA investigates how platform classification systems, rating algorithms, and open-ended data centre tax incentives systematically render African women workers invisible in public revenue systems. Rather than an accidental loophole, this invisibility is a structural artifact of how digital labor is defined, priced, and governed across the continent.",
  pillars: [
    {
      id: "pillar-1",
      title: "Algorithmic Gender Bias in Platform Labour",
      subtitle: "Erasing Care and Domestic Labour from the Fiscal Register",
      tag: "Labour & Fiscal Ontology",
      body: "Investigates how platform classification architectures, job allocation algorithms, and performance ratings replicate pre-digital gender disparities. By classifying domestic cleaners, carers, and service workers as 'independent platform users' rather than taxable employees, platforms harvest economic surplus while shifting all tax friction and social insurance burdens onto women workers who lack formal tax identities.",
      keyQuestions: [
        "How do dispatch algorithms penalize women with non-standard domestic care responsibilities?",
        "Why do African revenue authorities fail to levy employer withholding obligations on digital intermediation platforms?",
        "What data architectures would make women's platform labour legible for social protection without increasing punitive tax extraction?",
      ],
    },
    {
      id: "pillar-2",
      title: "Data Centre Fiscal Impact & Revenue Foregone",
      subtitle: "Auditing Tech Infrastructure Tax Holidays vs. Public Return",
      tag: "Infrastructure & Tax Justice",
      body: "Examines the multi-year corporate income tax holidays, zero-rated capital import exemptions, and subsidized energy/water concessions extended by African governments to hyperscale data center operators. The research quantifies total public revenue foregone against actual domestic economic spillovers, demonstrating how critical resources are diverted away from public services.",
      keyQuestions: [
        "What is the net fiscal return to the African public treasury per megawatt of data centre capacity?",
        "How do utility concessions to cloud multinationals impact municipal revenue mobilization and water rights?",
        "How can sovereign tax regimes capture economic rent from computational infrastructure hosted on African soil?",
      ],
    },
    {
      id: "pillar-3",
      title: "Proactive Regulatory Sandbox Design",
      subtitle: "The Kenya Data Centre Risk Assessment Sandbox Pilot",
      tag: "Governance & Accountability",
      body: "Inverts the traditional failed regulatory cycle-where rigid or captured laws are drafted after harm has already crystallized. The Kenya Data Centre Risk Assessment Sandbox establishes a live, empirical testing ground allowing regulators, parliamentarians, and civil society to stress-test fiscal accountability, resource consumption metrics, and labor standards before policy is codified into permanent legislation.",
      keyQuestions: [
        "Can regulatory sandboxes prevent regulatory capture by multinational tech lobbies?",
        "What audit telemetry is required to verify platform compliance in real time?",
        "How can African civil society groups co-govern regulatory sandbox testing environments?",
      ],
    },
  ] as ProjectTerraPillar[],
  analyticalMechanisms: [
    {
      number: "01",
      title: "Ontological Exclusion",
      subtitle: "Erasing the Worker as a Taxable Subject",
      definition:
        "Platforms construct workers not as legal employees with rights and tax obligations, but as external software users or independent micro-entities. This initial conceptual erasure pre-empts state fiscal jurisdiction before a single transaction occurs.",
      platformImpact:
        "Workers are stripped of statutory employment status, exempting platforms from pay-as-you-earn (PAYE) withholding.",
      fiscalConsequence:
        "The state loses direct employer-side tax revenue, and the worker remains an unrecorded ghost in fiscal databases.",
    },
    {
      number: "02",
      title: "Proxy Discrimination",
      subtitle: "Algorithmic Invisibility Encoded into Code",
      definition:
        "Automated rating metrics, completion rates, and response-time algorithms reproduce historical gender inequalities under the guise of mathematical neutrality.",
      platformImpact:
        "Women balancing unpaid domestic care work are deprioritized by automated matching algorithms, lowering their platform earnings.",
      fiscalConsequence:
        "Volatile, depressed earnings keep workers trapped beneath formal income tax thresholds, justifying continued state non-provision of benefits.",
    },
    {
      number: "03",
      title: "Classification Asymmetry",
      subtitle: "Shifting Compliance Overhead Downward",
      definition:
        "Platforms maintain absolute supervisory control over pricing, client communication, and route dispatch while legally claiming to be merely 'passive software intermediaries.'",
      platformImpact:
        "Platforms capture the financial surplus of the gig economy while delegating 100% of tax compliance risk to precarious laborers.",
      fiscalConsequence:
        "Revenue authorities face astronomical administrative costs trying to audit millions of informal individuals instead of withholding from the centralized platform.",
    },
    {
      number: "04",
      title: "Conditionality Misalignment",
      subtitle: "Administrative Hurdles That Exclude the Informal",
      definition:
        "Statutory compliance regimes require formal bank accounts, physical invoicing, electronic PIN registration, and complex filings designed for structured corporate firms.",
      platformImpact:
        "Informal and gig workers cannot fulfill cumbersome administrative prerequisites without incurring prohibitive accounting fees.",
      fiscalConsequence:
        "Workers are forced into an informal vacuum, unprotected by labor courts and excluded from national social security safety nets.",
    },
    {
      number: "05",
      title: "Feedback Amplification",
      subtitle: "Compounding Exclusion Across Successive Cycles",
      definition:
        "Because women workers are omitted from baseline tax registers, macroeconomic datasets report them as economically marginal or absent, validating further legislative neglect.",
      platformImpact:
        "Subsequent digital economy policies continue to treat platform domestic work as peripheral, reinforcing unregulated algorithm design.",
      fiscalConsequence:
        "A perpetual fiscal blindspot that narrows domestic revenue mobilization and increases state reliance on regressive consumption taxes (VAT).",
    },
  ] as AnalyticalMechanism[],
  caseStudies: [
    {
      title: "South Africa Domestic Platform Investigation",
      scale: "Largest on-demand home cleaning platform in South Africa",
      demographics: "Predominantly Black women workers serving urban households",
      finding:
        "Traces how algorithmically determined cancellation penalties, platform service deductions, and independent contractor classification leave workers in a fiscal vacuum-generating high platform commissions with zero social security or UIF contributions.",
    },
    {
      title: "East African Cross-Border Labor & Tech Corridor",
      scale: "Regional digital logistics and service platforms across Kenya & Uganda",
      demographics: "Urban informal workers transitioning to gig apps",
      finding:
        "Examines how platform multinational parent entities expatriate IP licensing fees offshore while domestic operations report paper losses, escaping both local corporate tax and worker withholding obligations.",
    },
  ],
  toolsAndOutputs: [
    {
      name: "Continental Data Centre Tracker",
      description: "Interactive geographic GIS map recording megawatts, cooling water draw, and tax concession packages across Africa.",
    },
    {
      name: "Revenue Foregone Simulator",
      description: "Open-source fiscal model calculating tax revenue lost to multinational infrastructure holidays vs. local job yield.",
    },
    {
      name: "Critical Mineral Fiscal Corridors",
      description: "Supply-chain tracing tool connecting copper, cobalt, and rare-earth extractives to global cloud server fabrication.",
    },
    {
      name: "Kenya Sandbox Risk Assessment Protocol",
      description: "Standardized evaluation framework for municipal and national regulators auditing platform algorithmic equity.",
    },
  ],
};
