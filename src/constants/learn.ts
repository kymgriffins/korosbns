export interface Video {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration?: string;
  thumbnail?: string;
  category?: 'bps' | 'explainer' | 'tutorial';
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category?: 'explainer' | 'analysis' | 'news';
  image?: string;
}

export const videos: Video[] = [
  {
    id: 'bps-2026-overview',
    title: 'Budget Policy Statement 2026 Overview',
    description: 'A comprehensive walkthrough of the BPS 2026 key priorities and fiscal framework.',
    youtubeId: 'A_EXLueEMlk',
    duration: '12:34',
    category: 'bps'
  },
  {
    id: 'beta-pillars-explained',
    title: 'The 5 BETA Pillars Explained',
    description: 'Deep dive into Agriculture, MSMEs, Healthcare, Housing, and Digital transformation pillars.',
    youtubeId: 'jLZe3iPSMfc',
    duration: '8:45',
    category: 'explainer'
  },
  {
    id: 'understanding-deficit',
    title: 'Understanding Kenya\'s Fiscal Deficit',
    description: 'What is a fiscal deficit and how is it financed? Simple explainer for young Kenyans.',
    youtubeId: 'KeNCrx6krl0',
    duration: '6:20',
    category: 'tutorial'
  },
  {
    id: 'county-budgets-101',
    title: 'County Budgets 101',
    description: 'How the national budget is shared with county governments and what it means for you.',
    youtubeId: 'SfPwtqUFyj4',
    duration: '9:15',
    category: 'explainer'
  }
];

export const articles: Article[] = [
  {
    id: 'bps-basics',
    title: 'Budget Policy Statement 2026: The Basics',
    excerpt: 'Everything you need to know about Kenya\'s Budget Policy Statement – what it is, why it matters, and key deadlines.',
    content: `# Budget Policy Statement 2026: The Basics

The Budget Policy Statement (BPS) is Kenya's annual fiscal roadmap that outlines the government's spending priorities for the upcoming financial year.

## What is the BPS?

The BPS is a policy document that sets out strategic priorities guiding how national and county governments prepare their annual budgets. It forms the basis for the Finance Bill and Appropriation Bill that Parliament eventually passes.

## Key Deadlines

- **February 15**: BPS submission to Parliament (PFM Act Section 25)
- **April 30**: National Budget presentation
- **June 30**: Finance Act enacted

## Why It Matters

The BPS determines how KES 4.74 trillion will be spent in FY 2026/27, affecting everything from healthcare to education, infrastructure to social services.

## Track the Process

Follow our interactive Learn module to understand each section of the BPS and test your knowledge with our quiz.`,
    author: 'Budget Ndio Story Team',
    date: '2026-01-15',
    readTime: '5 min read',
    category: 'explainer'
  },
  {
    id: 'beta-agenda-deep-dive',
    title: 'BETA Agenda: Bottom-Up Economic Transformation',
    excerpt: 'Explore the 5 pillars of Kenya\'s BETA agenda and how they shape the 2026 budget priorities.',
    content: `# BETA Agenda: Bottom-Up Economic Transformation

The 2026 Budget Policy Statement is themed around the BETA (Bottom-Up Economic Transformation Agenda) – the government's plan to transform Kenya's economy from the ground up.

## The 5 BETA Pillars

### 1. Agriculture 🌽
- Food security through crop diversification
- Modernizing agricultural value chains
- Expanding agricultural insurance
- Fertilizer subsidies and irrigation projects

### 2. MSMEs 🏪
- Hustler Fund expansion
- Credit guarantee schemes
- NYOTA linkages for youth-owned businesses
- MSME hubs in all 47 counties

### 3. Healthcare 🏥
- Universal Health Coverage via SHA
- Target: 35 million Kenyans enrolled
- Community health services expansion
- Digital health systems

### 4. Housing 🏘️
- Affordable housing through KMRC
- Low-cost housing projects nationwide
- Mortgage refinancing support

### 5. Digital 💻
- Fiber internet expansion
- E-government services
- Digital literacy programs

## Budget Impact

Each pillar receives targeted funding to drive inclusive growth and create opportunities for ordinary Kenyans.`,
    author: 'Budget Ndio Story Team',
    date: '2026-01-20',
    readTime: '8 min read',
    category: 'analysis'
  },
  {
    id: 'county-budget-guide',
    title: 'County Budgets: How the Equitable Share Works',
    excerpt: 'Understanding how KES 420 billion is allocated to county governments for devolved services.',
    content: `# County Budgets: How the Equitable Share Works

County governments receive KES 420 billion through the Equitable Share – the largest source of county funding.

## What is the Equitable Share?

The Equitable Share is constitutionally mandated (Article 203) to ensure counties have adequate resources to deliver devolved services.

## How It's Calculated

The formula considers:
- Population (45%)
- Poverty index (25%)
- Land area (20%)
- Fiscal responsibility (10%)

## What Counties Spend On

1. **Roads** – County road networks and maintenance
2. **Health** – County hospitals and health centers
3. **Water** – Water supply and sanitation
4. **Markets** – Trading facilities and infrastructure
5. **Local development** – Ward-specific projects

## Your County's Share

Use our interactive tools to compare how your county's allocation compares to others and track how it's being spent.`,
    author: 'Budget Ndio Story Team',
    date: '2026-02-01',
    readTime: '6 min read',
    category: 'explainer'
  },
  {
    id: 'fiscal-risks-2026',
    title: '5 Fiscal Risks That Could Derail the 2026 Budget',
    excerpt: 'The BPS identifies key risks – from rising debt to climate change – that could impact budget execution.',
    content: `# 5 Fiscal Risks That Could Derail the 2026 Budget

The Budget Policy Statement identifies five major fiscal risks that could impact budget execution.

## 1. Rising Public Debt ⚠️

**Risk**: Interest payments consuming an growing share of the budget
**Current**: KES 1.2 trillion in committed debt service
**Impact**: Less money available for development projects

## 2. Contingent Liabilities 🏢

**Risk**: State corporation guarantees may be called
**Exposure**: Several parastatals have government-backed loans
**Impact**: Unexpected budget pressure if guarantees are invoked

## 3. Macroeconomic Shocks 💹

**Risk**: Exchange rate volatility and inflation spikes
**Exposure**: Import-dependent economy
**Impact**: Revenue projections may fall short

## 4. Climate Change 🌍

**Risk**: Droughts and floods affecting agriculture revenue
**Impact**: Reduced tax collections and increased emergency spending

## 5. Devolution Pressures 🏛️

**Risk**: Counties demanding more funds
**Pressure**: Salary audits and pending bills
**Impact**: Potential budget reallocation

## What This Means for You

These risks mean budget priorities may shift during the year. Stay informed about supplementary budgets and reallocation requests.`,
    author: 'Budget Ndio Story Team',
    date: '2026-02-10',
    readTime: '7 min read',
    category: 'news'
  }
];

export const articleCategories = ['explainer', 'analysis', 'news'] as const;
export const videoCategories = ['bps', 'explainer', 'tutorial'] as const;
