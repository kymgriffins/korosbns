# Budget Ndio Story — Programmes & Projects Content & Motion Inventory

> **Purpose of this Document**:  
> Complete text, card, metric, and media inventory across the master landing page (`/programmes`), the 4 individual desk pages (`/programmes/connect`, `/programmes/mashinani`, `/programmes/wanahabari-lab`, `/programmes/studios`), and all connected project dossiers (`/bns-studio/[slug]`, `/bns-project/terra`).  
> Use this document to:
> 1. Script motion choreography, scroll triggers, kinetic typography, and transitions.
> 2. Identify and remove chunky, redundant, or unused sections.
> 3. Streamline card hierarchies, interactive stages, and mobile viewing flows.

---

## Table of Contents
1. [Architecture Overview & Page Routing](#1-architecture-overview--page-routing)
2. [Master Landing Page (`/programmes`)](#2-master-landing-page-programmes)
3. [Desk 01: BNS Connect (`/programmes/connect`)](#3-desk-01-bns-connect-programmesconnect)
4. [Desk 02: BNS Mashinani (`/programmes/mashinani`)](#4-desk-02-bns-mashinani-programmesmashinani)
5. [Desk 03: Wanahabari Lab (`/programmes/wanahabari-lab`)](#5-desk-03-wanahabari-lab-programmeswanahabari-lab)
6. [Desk 04: BNS Studios (`/programmes/studios`)](#6-desk-04-bns-studios-programmesstudios)
7. [Connected Projects & Deep Dossiers (Layer 3)](#7-connected-projects--deep-dossiers-layer-3)
8. [Cross-Programme Shared Components & Bridges](#8-cross-programme-shared-components--bridges)
9. [Motion Scripting & De-Cluttering Recommendations](#9-motion-scripting--de-cluttering-recommendations)

---

## 1. Architecture Overview & Page Routing

The platform follows a **3-layer CMS hierarchy**:

```
Layer 1: Master Programmes Landing (/programmes)
 │── Top Sovereign Telemetry HUD
 │── Hero Headline & Sovereign Audit Ledger (Art. 201, KSh 4.82T, 4 Focus Counties)
 │── Desk 01: BNS Connect Summary Spread
 │── Desk 02: BNS Mashinani Summary Spread
 │── Desk 03: Wanahabari Lab Summary Spread
 │── Desk 04: BNS Studios Summary Spread (21:9 Cinema Midnight)
 │── Public Evidence Archive / Interactive Projects Loop (Filters & Search)
 └── Editorial Partner / Citizen CTA Band
        │
        ├──> Layer 2: Programme Detail Pages (/programmes/[slug])
        │     ├── /programmes/connect (National Desk)
        │     │    ├── Breadcrumbs & Telemetry HUD
        │     │    ├── Header & 4 Key Metrics (4.8T, Under 35, Mobile Explainers, Art. 201)
        │     │    ├── "Opening · The Download Folder Problem" (Prose & Youth Voice Quote)
        │     │    ├── Interactive TransformationStage (The 400-Page PDF -> Distillation -> 60s Cards)
        │     │    ├── ProgrammeProjectGrid (Connect Projects grouped by Content Type)
        │     │    ├── Application Footer & Desk Dispatch
        │     │    └── ProgrammeChapterBridge (Next: Mashinani)
        │     │
        │     ├── /programmes/mashinani (County Desk)
        │     │    ├── Breadcrumbs & Telemetry HUD
        │     │    ├── Header & 4 Key Metrics (4 Counties, Embed Method, Scorecards, Partners)
        │     │    ├── "County Baraza Quote & Groundwork Photo-Essay"
        │     │    ├── "Method · Offline First" (Prose & Signboard Strategy)
        │     │    ├── Interactive FieldNotebookSpread (Kaloleni, Subukia, Tarbaj Cases)
        │     │    ├── ProgrammeProjectGrid (Mashinani Projects grouped by Content Type)
        │     │    ├── Editorial CTA Band (County Shilling Action)
        │     │    └── ProgrammeChapterBridge (Next: Wanahabari Lab)
        │     │
        │     ├── /programmes/wanahabari-lab (Newsroom Desk)
        │     │    ├── Breadcrumbs & Telemetry HUD
        │     │    ├── Header & 4 Key Metrics (Quarterly, 120-200 Bench, Evidence Reading, Filed Drafts)
        │     │    ├── "Scene · The June Spectacle" (Briefcase Theatre vs 364 Days)
        │     │    ├── "Curriculum · Three Crafts" (Read Release, Off-Cycle Money, Package)
        │     │    ├── Interactive ForensicLightTable (Hospitality, Ghost Road, Medical Supplies)
        │     │    ├── ProgrammeProjectGrid (Wanahabari Projects grouped by Content Type)
        │     │    ├── Cohort Intake Card Footer
        │     │    └── ProgrammeChapterBridge (Next: Studios)
        │     │
        │     └── /programmes/studios (Production Desk)
        │          ├── Breadcrumbs & Telemetry HUD
        │          ├── Header & 4 Key Metrics (Mission Enterprise, Surplus Reinvested, 3 Disciplines, Portal)
        │          ├── NarrativeScrollytellingCanvas (3 Beats: Donor Trap, High Craft, Double Impact)
        │          ├── ScrollGallery (9 Kinetic Production Surfaces)
        │          ├── CinemaTimelineStage (8 Commercial Production Formats Spectrum)
        │          ├── ProgrammeProjectGrid (Studios Projects grouped by Content Type)
        │          ├── Commercial Intake Callout Band (Commission Booking)
        │          └── ProgrammeChapterBridge (Next: Connect)
        │
        └──> Layer 3: Dedicated Case Studies, Transcripts & Dossiers
              ├── /bns-project/terra (Flagship 2-Year HOFW Research Dossier & Full Transcript)
              ├── /bns-studio/cabri-digital-pfm-reforms (Continental Bilingual Documentary)
              ├── /bns-studio/illicit-financial-flows-benin-cabo-verde (Forensic Briefing)
              ├── /bns-studio/budget-sasa-ni-delivery-explainer (Treasury Explainer Series)
              ├── /bns-studio/budget-ndio-story-podcast (Season 1 Studio Audio Series)
              ├── /bns-studio/nakuru-citizen-baraza (Town Hall Broadcast & Live Notes)
              ├── /bns-studio/finance-bill-motion-explainer (2D Animated Bill Breakdown)
              ├── /bns-studio/mashinani-field-documentary (18-Min Grassroots Audit Film)
              ├── /bns-studio/cra-formula-research-spotlight (Multimedia CRA Technical Digest)
              ├── /bns-studio/budget-tiktok-vertical-series (20-Episode Vertical Series)
              ├── /bns-studio/wajir-community-listening (Arid Lands Ward Dialogue Sessions)
              ├── /bns-studio/bps-2026-reading-coverage (Same-Day Newsroom B-Roll Kit)
              └── /bns-studio/stakeholder-forum-production (TISA Multi-Camera Convening)
```

---

## 2. Master Landing Page (`/programmes`)

**File Path**: `src/components/programmes/programmes-landing.tsx`

### 2.1 Persistent Top HUD
- **Active Desk Indicator**: `FOUR OPERATIONAL DESKS`
- **Focus Area**: `NATIONAL TO DEVOLVED GRASSROOTS`
- **Badge Label**: `SOVEREIGN STANDARD`

### 2.2 Master Hero Section
- **Headline**:
  > "Follow the public shilling from Treasury to the **grassroots**."
- **Lede Narrative**:
  > "Kenya’s national budget crosses KSh 4.82 Trillion. Budget Ndio Story deploys 4 specialized, non-replicated operational desks to audit allocations, mobilize digital youth, ground rural barazas, and produce cinematic media."
- **Buttons / CTAs**:
  - Primary: `Explore Evidence Archive` (`/work`)
  - Secondary: `Explore The 4 Desks` (`#desk-01`)
- **Sovereign Audit Ledger Metrics**:
  - `KSh 4.82T` — **National Budget**: Treasury to ministry line audits
  - `04 Counties` — **Grassroots Hubs**: Kilifi, Nakuru, Wajir, Kakamega
  - `120+` — **Reporters Trained**: Forensic newsroom cohorts
  - `Article 201` — **Constitutional Mandate**: Openness in public finance

---

### 2.3 Desk 01 Section: BNS Connect
- **Eyebrow**: `Desk 01 · BNS Connect` | `Youth Digital Mobilization`
- **Title**:
  > "Translating 400-page accounting sheets into 60-second mobile power."
- **Hero Image**: `/images/cohort1 groundworks/129A3964.jpg`
  - **Badge**: `Nairobi Youth Baraza`
  - **Caption**: "Auditing national debt amortization tables against real-time Ministry disbursements."
- **Narrative Copy**:
  - *Paragraph 1*: "When Treasury drops the annual Budget Policy Statement, accountability historically vanished inside 400-page PDF tables written in impenetrable bureaucratic jargon. Parliamentary committees debated behind closed doors while millions of young taxpayers were locked out of the conversation."
  - *Paragraph 2*: "BNS Connect flips this dynamic. We ingest raw exchequer tables, debt amortization schedules, and tax bills, distilling them into rapid-fire 60-second video explainers, swipeable TikTok carousels, and verified WhatsApp infographics."
  - *Paragraph 3*: "Young Kenyans nationwide track national budget allocations directly on their screens, turning passive reading into targeted public participation submissions to the National Assembly."
- **Pullquote**:
  > “We don’t summarize the budget for archives. We translate the data into immediate leverage for citizen action.”  
  > *— BNS Digital Desk, Nairobi*
- **Feature Checkpoints**:
  - `Direct integration with our TikTok & Reels format`
  - `80-page citizen memorandum submitted to Finance Committee`
- **CTA**: `Open BNS Connect Dossier` (`/programmes/connect`)

---

### 2.4 Desk 02 Section: BNS Mashinani
- **Eyebrow**: `Desk 02 · BNS Mashinani` | `The Devolved Grassroots Engine`
- **Title**:
  > "Taking budget tracking from Nairobi boardrooms to the village baraza."
- **Pullquote**:
  > “In the village, the budget isn’t numbers in a book — it is whether the dispensary has medicine and whether the borehole actually pumps clean water.”  
  > *— Subukia Ward Community Baraza, Nakuru County*
- **Narrative Copy**:
  - *Paragraph 1*: "Fiscal devolution was designed to place resources into the hands of local communities. Yet 78% of rural Kenyans report never seeing a ward development breakdown before projects are approved."
  - *Paragraph 2*: "BNS Mashinani deploys embedded civic field leads across Kakamega, Kilifi, Nakuru, and Wajir. We train residents with waterproof audit scorecards to cross-check county gazette budgets against actual physical contractor work."
  - *Paragraph 3*: "Through weekly vernacular radio broadcasts and open-air barazas under village trees, we empower farmers, youth groups, and artisanal fisherfolk to challenge ghost allocations before completion certificates are rubber-stamped."
- **Supporting Image**: `/images/towwnhallmay/129A3863.jpg`
  - **Badge**: `Kilifi County Field Baraza`
  - **Caption**: "Artisanal fisherfolk cross-referencing blue economy devolved funds with actual landing site infrastructure."
- **CTA & Indicator**:
  - Button: `Open BNS Mashinani Dossier` (`/programmes/mashinani`)
  - Indicator: `800K+ Vernacular Listeners` (Radio broadcast reach)

---

### 2.5 Desk 03 Section: Wanahabari Lab
- **Eyebrow**: `Desk 03 · Wanahabari Lab` | `The 364-Day Investigative Newsroom`
- **Title**:
  > "The budget speech is theatre. The real story begins the morning after."
- **Lede**:
  > "Kenyan commercial media concentrates 90% of fiscal reportage on Budget Day in June. Wanahabari Lab equips investigative reporters to track exchequer requisitions and forensic procurement for the other 364 days."
- **Two Concrete Case Inquiry Cards**:
  - **Case Inquiry 01 · County Health Diversions**:
    - *Headline*: "Uncovering KSh 1.84 Billion in locked maternity wings."
    - *Body*: "When county health allocations were diverted to pay recurrent supplier debts, Wanahabari fellows scraped Controller of Budget quarterly releases, matched them to local contractor records, and co-published the findings in national print dailies."
  - **Case Inquiry 02 · Consolidated Fund Services**:
    - *Headline*: "Exposing KSh 1,203 Billion public debt interest appetite."
    - *Body*: "Our fellowship analyzed sovereign amortization tables to demonstrate that out of every KSh 100 collected by KRA, KSh 64 was swallowed by debt servicing before a single development grant left the exchequer account."
- **Newsroom Photography**: `/images/productionA`
  - **Badge**: `Newsroom Fellowship Cohort`
  - **Caption**: "Fellows cross-referencing exchequer requisition tables with Auditor-General audit queries."
- **CTA & Stats**:
  - Button: `Open Wanahabari Lab Dossier` (`/programmes/wanahabari-lab`)
  - Label: `120+ Reporters Trained Annually Across Kenya`

---

### 2.6 Desk 04 Section: BNS Studios (Midnight 21:9 Widescreen)
- **Eyebrow**: `Desk 04 · BNS Studios` | `Commercial Creative Craft`
- **Title**:
  > "Commercial creative craft that bankrolls citizen budget audits."
- **Lede**:
  > "We operate an independent, top-tier creative production studio producing podcasts, documentaries, 2D animations, and street campaigns for leading civic institutions."
- **Cinema Metrics Bar**:
  - `EN / FR` — Bilingual Productions
  - `Dual Impact` — Craft Supporting Civic Work
  - `4 Counties` — Embedded Grassroots Oversight
  - `21:9` — Cinematic Master Reels
- **The Double Impact Covenant**:
  > "Rather than relying solely on donor cycles, BNS Studios sells premium storytelling, motion design, and video production to commercial and development partners. Operating surplus is channeled directly into printing grassroots scorecards and funding investigative fellowships across our focus counties."
- **CTA**: `Open BNS Studios Dossier` (`/programmes/studios`)

---

### 2.7 Flagship Evidence Stream / Projects Loop (`ProgrammesProjectsLoop`)
- **Eyebrow**: `Public Evidence Archive · All 4 Desks` | `{count} Verified Productions`
- **Title**:
  > "The work in motion. Screenings, barazas, animations, and audits."
- **Description**:
  > "Swipe or search to inspect civic evidence. Click any project to open its dedicated case study or research dossier."
- **Live Search & Filter Bar**:
  - Search Input: placeholder `"Search projects (e.g. Terra, Treasury, Podcast, Nakuru)..."`
  - Filter Tabs:
    1. `All Productions` (Total: 13)
    2. `Desk 01 · Connect` (3)
    3. `Desk 02 · Mashinani` (3)
    4. `Desk 03 · Wanahabari` (3)
    5. `Desk 04 · Studios` (4)
- **Interactive States**:
  - *No Query State*: Horizontal kinetic infinite-scroll `Marquee` with pause on hover.
  - *Query Active State*: 3-column responsive grid with empty state fallback (`"No productions found matching..."`).
- **Project Card Structure** (13 total items):
  - Thumbnail poster with 16:10 / 16:9 ratio
  - Top Badge: Desk pill (`01 BNS Connect`, `02 BNS Mashinani`, `03 Wanahabari Lab`, `04 BNS Studios`)
  - Content Type Pill: Icon + Format name (`Explainer Videos`, `Documentaries`, `Podcasts`, `Animations`, `Town Halls`, `Listening Sessions`, `Research Spotlights`)
  - Partner Organisation Tag
  - Project Title & Year
  - Action link: `Inspect ->`

---

### 2.8 Editorial Closing CTA Band
- **Eyebrow**: `The Sovereign Standard`
- **Title**:
  > "Follow the public shilling. Reclaim civic power."
- **Description**:
  > "Join over 1.4 million Kenyans auditing national debt, tracking county disbursements, and enforcing Article 201."
- **Actions**:
  - Primary: `Explore All Evidence` (`/work`)
  - Secondary: `Direct Partnership` (`/contact`)

---

## 3. Desk 01: BNS Connect (`/programmes/connect`)

**File Path**: `src/components/programmes/scrollytelling/connect-scrollytelling.tsx`

### 3.1 Header & Meta
- **Telemetry HUD**: `BNS CONNECT` | `NATIONAL TREASURY & PARLIAMENT` | `NATIONAL DESK`
- **Breadcrumb**: `<- All programmes` (`/programmes`)
- **Pills**: `National desk · Youth distribution` | `From Treasury tables to the feed`
- **Headline**:
  > "The budget lands as a PDF. **We put it back on the phone.**"
- **Lede**:
  > "When the National Treasury publishes a dense Budget Policy Statement, public attention usually dies in the download folder. BNS Connect turns verified budget lines into explainers, debt meters, and youth memorandums built for mobile screens."
- **4 Key Ledger Metrics**:
  1. `KSh 4.8T` — **Scale we watch**: FY2026/27 national budget (Treasury)
  2. `Under 35` — **Who we write for**: Youth-first formats nationwide
  3. `Mobile explainers` — **Flagship format**: English · Kiswahili · Sheng
  4. `Article 201` — **Standard**: Openness in public finance

---

### 3.2 Narrative Section: "The Download Folder Problem"
- **Eyebrow**: `Opening · The download folder problem`
- **Title**:
  > "Secrecy no longer needs a locked vault. A four-hundred-page PDF will do."
- **Prose**:
  - "Every June, Parliament debates a national budget that crosses into the trillions of shillings. The documents that explain where that money is meant to go — Budget Estimates, the Medium-Term Debt Strategy, the Finance Bill — arrive dense, technical, and easy to abandon after page twelve."
  - "A generation that lives on mobile feeds will not wait for a seminar to decode a PAYE deduction. Connect meets them where attention already is: short verified explainers, live trackers, and an annual Youth Budget Survey that keeps pressure on after the Budget Day headlines fade."
- **Pullquote**:
  > “When you understand the debt repayment schedule, you stop looking at broken roads as bad luck and start asking which line item moved.”  
  > *— Youth Tracker voice, Nairobi hub*
- **Sticky Photographic Feature**:
  - Image: `/images/cohort1 groundworks/129A3964.jpg`
  - Badge: `Tracker assembly`
  - Caption: "Fellows cross-checking published Treasury tables against ministry disbursement claims."

---

### 3.3 Interactive Stage: `TransformationStage`
**File Path**: `src/components/motion/transformation-stage.tsx`

Three tabbed states demonstrating the conversion of dense fiscal data into mobile intelligence:

#### Tab 01: `01 · The 400-Page PDF`
- **Badge**: `The Bureaucratic Smoke Screen`
- **Headline**: "Where public money disappears into legalistic fog."
- **Body**: "The National Treasury publishes the Budget Policy Statement as an unsearchable 400-page scanned PDF. Complex line-item codes hide multi-billion shilling reallocations behind terminology like 'MTEF Ceiling Rationalization'."
- **Stats Table**:
  - Average Document Length: `412 Pages`
  - Target Citizen Readership: `< 0.04% of Taxpayers`
  - Public Scrutiny Window: `14 Days before Vote`
- **Simulated Opaque Document Box**:
  - `Sub-Program 042: External Debt Amortization (Semi-Concessional)`
  - `Ceiling Adjustment Factor: +14.28% over Medium-Term Envelope`
  - `Head 88219/001: Bilateral FX Hedge Reserves · KSh 148,291,000,000`
  - `[CRITICAL DISCREPANCY: Healthcare allocation reduced by KSh 12.4B to service short-term Treasury Bills]`
  - Footer: `Page 284 of 412 · Result: 0 Citizen Resistance`

#### Tab 02: `02 · The BNS Distillation`
- **Badge**: `The BNS Dissection Engine`
- **Headline**: "Collapsing 400 pages into 3 verified fiscal signals."
- **Body**: "Within 4 hours of the Treasury release, our civic data desk scripts ingest the PDF tables, run automated OCR discrepancy checks, and correlate line items against actual ministry health, education, and debt obligations."
- **Metrics**:
  - Ingestion Time: `4 Hours` (From release to verified ledger)
  - Accuracy Rate: `100%` (Verified against Hansard)
- **Pipeline Stepper**:
  1. `Raw Treasury PDF (400+ Pages)` -> OCR parsed & table schema normalized
  2. `BNS Discrepancy Scraper` -> Extracts debt service vs social sector cuts
  3. `60s Mobile Cards & Reels` -> Syndicated to youth on TikTok & Reels

#### Tab 03: `03 · 60s Citizen Power`
- **Badge**: `The 60-Second Citizen Result`
- **Headline**: "Demystified, actionable, and ready for public participation."
- **Body**: "Instead of drowning in numbers, citizens swipe through bilingual cards on their phones that directly explain how fuel prices, tax rates, and medicine budgets are impacted—with a single button to submit a formal objection to Parliament."
- **3 Actionable Cards**:
  - **Card 01 (#FuelVAT)**: "Where the 16% Fuel Tax actually goes" | 68% of collected fuel levy diverted to sovereign debt repayment. | `640K Views · 14K Shares`
  - **Card 02 (#HealthCut)**: "Dispensary Medicine Cut in Your County" | KSh 3.4B slashed from rural health centers while travel per diems rose by 22%. | `520K Views · 8.2K Objections`
  - **Card 03 (#Memorandum)**: "Citizen Submission to Parliament" | Over 3,200 verified youth voices packaged into an 80-page formal petition delivered to National Assembly. | `Formally Tabled in Hansard`

---

### 3.4 ProgrammeProjectGrid: BNS Connect Outputs
Displays projects matching `programmeSlug: "connect"`, grouped by Content Type:
1. **Explainer Videos**:
   - *Budget Sasa ni Delivery* (National Treasury / 2025)
2. **Animations**:
   - *Finance Bill Motion Graphics* (House of Fiscal Wisdom / 2024)
3. **Social Media Series**:
   - *Budget Mtaani TikTok Series* (BNS Youth Tracker Network / 2025)

---

### 3.5 Footer & Bridge
- **Intake Card**:
  - Title: "Become a Budget Tracker — or bring your campus circle with you."
  - Description: "Whether you organise a regional budget reading club or produce fiscal explainers, Connect offers vetted datasets, visual toolkits, and pathways into parliamentary briefings."
  - Primary CTA: `Apply as a Budget Tracker` (`/contact?intent=budget-tracker`)
  - Secondary CTA: `View Connect evidence` (`/work?programme=connect`)
- **Metadata Sidebar**:
  - Desk Email: `connect@budgetndiostory.org`
  - Weekly Dispatch: `Thursday 16:00 EAT`
  - Tag: `Open civic data standard`
- **Chapter Bridge**: Links to **Desk 02 · Mashinani**

---

## 4. Desk 02: BNS Mashinani (`/programmes/mashinani`)

**File Path**: `src/components/programmes/scrollytelling/mashinani-scrollytelling.tsx`

### 4.1 Header & Meta
- **Telemetry HUD**: `BNS MASHINANI` | `KAKAMEGA · KILIFI · NAKURU · WAJIR` | `COUNTY DESK`
- **Breadcrumb**: `<- All programmes` (`/programmes`)
- **Pills**: `County desk · Full-cycle embed` | `Four places, not forty-seven flyovers`
- **Headline**:
  > "Kakamega. Kilifi. Nakuru. Wajir. **Stay long enough to matter.**"
- **Lede**:
  > "Mashinani does not tour Kenya with a camera and a checklist. Teams settle into four counties for the budget cycle — fiscal strategy paper to execution report — and ask whether the promise on paper matches the borehole, the maternity wing, or the feeder road on the ground."
- **4 Key Ledger Metrics**:
  1. `Four` — **Focus counties**: Kakamega · Kilifi · Nakuru · Wajir
  2. `Embed` — **Method**: Full budget cycle presence
  3. `Scorecards` — **Public products**: Trackers · Promise vs Delivery
  4. `Partners` — **Posture**: Accountability without adversary theatre

---

### 4.2 Field Voice Quote Section
- **Big Kinetic Quote**:
  > “In the village, the budget is not a book. It is whether the dispensary has medicine and whether the borehole actually pumps.”
- **Citation**: `Field voice · Coastal hub` | `Documented at a citizen hearing`
- **Photo Canvas**:
  - Image: `/images/towwnhallmay/129A3863.jpg`
  - Badge: `County baraza`
  - Caption: "Residents and officials in the same room — with documentation that outlives the meeting."

---

### 4.3 Narrative Section: "Method · Offline First"
- **Eyebrow**: `Method · Offline first`
- **Title**:
  > "A dashboard is useless when the power is out."
- **Description**:
  > "Why Mashinani pairs document checks with laminated ward scorecards, signboard inspections, and vernacular radio — not only apps."
- **Prose**:
  - "National transparency platforms often assume fluent English literacy and reliable broadband. The communities most affected by delayed or diverted county projects frequently have neither."
  - "Mashinani works offline-first where it must: waterproof ward scorecards, contractor signboard checklists, and community radio briefings alongside digital trackers. The goal is the same in every county — match the gazette line to the physical site, then publish what can be verified."

---

### 4.4 Interactive Stage: `FieldNotebookSpread`
**File Path**: `src/components/motion/field-notebook-spread.tsx`

Allows user to toggle across three real field cases in focus counties:

#### Case 01: `Kilifi County` (Kaloleni Ward)
- **Project**: `Solar borehole and water kiosk`
- **Status**: `STATUS: COMMUNITY FOLLOW-UP`
- **What Monitors Saw**:
  > "County progress notes described the site as nearly commissioned. Field monitors found a dry shaft, missing inverter hardware, and a disconnected holding tank — photographed and dated for the public dossier."
- **What Happened Next**:
  > "Community withheld completion sign-off at a ward baraza until the contractor returned with working solar pumping equipment. Attendance and photo evidence archived."
- **Method Kit**: `Signboard checklist · Site photos · Baraza summary`

#### Case 02: `Nakuru County` (Subukia Ward)
- **Project**: `Dispensary maternity wing`
- **Status**: `STATUS: ASSEMBLY BRIEF FILED`
- **What Monitors Saw**:
  > "A facility listed as ready for service was roofed but unfinished — no plumbing, no staff housing, weeds at the entrance. Monitors compared the physical state to the county's published progress language."
- **What Happened Next**:
  > "Youth monitors tabled a photo dossier with the County Assembly health conversation and published a citizen-readable summary within days of the baraza."
- **Method Kit**: `Photo dossier · Hansard-ready brief · Public summary`

#### Case 03: `Wajir County` (Tarbaj Ward)
- **Project**: `Rural feeder road grading`
- **Status**: `STATUS: SITE CHECK + RADIO NOTE`
- **What Monitors Saw**:
  > "Heavy equipment appeared briefly, then left an impassable stretch that blocked clinic access for pastoral households. Elders convened a tree-shade baraza; monitors recorded claims against what the road still looked like."
- **What Happened Next**:
  > "Vernacular radio carried the community account; county roads officials were pressed to return the contractor. Mashinani kept the paper trail public rather than inventing completion kilometres."
- **Method Kit**: `Listening circle · Radio note · Follow-up visit`

- **Common Method Kit Callout**:
  - `Tools used`: Illustrative checklist
  - `Budget figures`: Cited only when published
  - `Unavailable lines`: Labelled, never invented
  - `Waterproof scorecard standard`: Laminated checklists traveling farther than apps alone

---

### 4.5 ProgrammeProjectGrid: BNS Mashinani Outputs
Displays projects matching `programmeSlug: "mashinani"`:
1. **Town Hall Design & Facilitation**:
   - *Nakuru Citizen Budget Baraza* (Nakuru County Government / 2025)
2. **Documentaries**:
   - *Mashinani: Promise vs Delivery* (BNS Youth Tracker Network / 2025)
3. **Community Listening Sessions**:
   - *Wajir Community Listening Sessions* (BNS Youth Tracker Network / 2025)

---

### 4.6 Editorial CTA Band & Bridge
- **Eyebrow**: `County desk`
- **Title**: "Follow the shilling where you live."
- **Description**: "Audit ward project signboards, read verified scorecards, and host community barazas with BNS Mashinani."
- **Buttons**:
  - Primary: `Explore county evidence` (`/work?programme=mashinani`)
  - Secondary: `Request a field workshop` (`/contact`)
- **Chapter Bridge**: Links to **Desk 03 · Wanahabari Lab**

---

## 5. Desk 03: Wanahabari Lab (`/programmes/wanahabari-lab`)

**File Path**: `src/components/programmes/scrollytelling/wanahabari-scrollytelling.tsx`

### 5.1 Header & Meta
- **Telemetry HUD**: `WANAHABARI LAB` | `YEAR-ROUND BUDGET JOURNALISM` | `NEWSROOM DESK`
- **Breadcrumb**: `<- All programmes` (`/programmes`)
- **Pills**: `Newsroom desk · Quarterly labs` | `EAST AFRICA PRESS BENCH` | `JOURNALISTS · CREATORS · SIDE BY SIDE`
- **Headline**:
  > "Budget Day is theatre. **The story starts the morning after.**"
- **Lede**:
  > "Kenyan newsrooms still crowd June. Wanahabari Lab trains reporters and digital creators for the rest of the fiscal calendar — when Controller of Budget releases, supplementary votes, and pending bills decide what actually reaches wards."
- **4 Key Ledger Metrics**:
  1. `Quarterly Labs` — **Cadence**: Anchored to the fiscal calendar
  2. `120–200 / year` — **Bench size**: Journalists and creators
  3. `Evidence reading` — **Core craft**: OCOB · Hansard · published tables
  4. `Filed drafts` — **Output**: Stories + toolkit, same day

---

### 5.2 Narrative Section: "The June Spectacle"
- **Eyebrow**: `Scene · The June spectacle`
- **Title**:
  > "Cameras follow the briefcase. Spending happens after the credits roll."
- **Prose**:
  - "Every June, television anchors dress for Budget Day, newspapers print commemorative inserts, and camera crews trail the Cabinet Secretary into Parliament. For twenty-four hours the nation argues tax."
  - "By early July, coverage thins. Quarterly releases, late-night supplementary budgets, and pending-bill settlements move with far less scrutiny. Wanahabari Lab exists because newsrooms need a bench that can read those documents — and still write for the front page and the feed."
- **Pullquote**:
  > “The budget story does not end on Budget Day. That is when the spending begins. Journalists must stay in the room for the other three hundred and sixty-four.”  
  > *— Wanahabari Lab alumni voice*
- **Sticky Newsroom Photo**:
  - Image: `/images/productionA`
  - Badge: `Lab session`
  - Caption: "Reporters and creators cross-referencing published Treasury and audit tables."

---

### 5.3 Curriculum: Three Practical Crafts
- **Eyebrow**: `Curriculum · Three crafts`
- **Title**: "What a one-day Lab actually teaches."
- **Description**: "No jargon dump. Three practical pillars journalists can take back to a newsroom the same week."
- **3 Pillars**:
  1. **Parse public finance documents fast** (`Read the release`):
     - "Fellows practise turning Controller of Budget and Treasury tables into searchable notes — without inventing figures when a cell is blank or a PDF is locked."
  2. **Pending bills and contingent claims** (`Follow the off-cycle money`):
     - "How to report obligations that sit beside the headline budget — with source discipline and legal caution, not rumour."
  3. **Front page, broadcast, and feed** (`Package for the desk`):
     - "Turning forensic notes into headlines, packages, and bilingual social cuts that still cite the underlying document."

---

### 5.4 Interactive Stage: `ForensicLightTable`
**File Path**: `src/components/motion/forensic-light-table.tsx`

Allows user to toggle between cases and use an interactive `"Reveal method detail"` unredacting switch:

#### Case 01: `hospitality-travel`
- **Headline**: “How to read a hospitality vote without inventing the scandal”
- **Publication**: `Lab craft note` | `Cohort method`
- **Document Focus**: County executive hospitality and travel requisitions in published OCOB tables
- **First Move**: Compare claimed workshop attendance to public travel records — then report only what both sources support.
- **Redacted / Revealed Lab Detail**:
  > "Fellows practise lining up published vote lines with airline and attendance evidence. Where a figure is missing or redacted, the Lab labels it unavailable instead of guessing a billion-shilling headline."
- **Craft Note**: "Source discipline before the splash. Blank cells stay blank until a public document fills them."

#### Case 02: `road-maintenance`
- **Headline**: “The ghost highway story starts with a site visit, not a rumour”
- **Publication**: `Lab craft note` | `Cohort method`
- **Document Focus**: Periodic road maintenance vouchers and contract notices on the public record
- **First Move**: Walk the corridor, photograph milestones, then return to the voucher language — never the reverse.
- **Redacted / Revealed Lab Detail**:
  > "Reporters learn to hold a contract claim against what the road still looks like. Completion language without heavy equipment on site becomes a question for officials, not an invented kilometre count."
- **Craft Note**: "Field notes and published vouchers travel together. Neither alone is enough for a front page."

#### Case 03: `medical-supplies`
- **Headline**: “Rural dispensary delays: follow the framework contract”
- **Publication**: `Lab craft note` | `Cohort method`
- **Document Focus**: Essential medical supplies framework contracts versus KEMSA catalogue prices
- **First Move**: Build a price comparison table from published catalogues, then interview the clinic that waited.
- **Redacted / Revealed Lab Detail**:
  > "The Lab trains mark-up analysis only against public price lists. Markup percentages that cannot be sourced stay off the page — even when the clinic story is urgent."
- **Craft Note**: "Human delay plus document trail. One without the other is advocacy, not journalism."

---

### 5.5 ProgrammeProjectGrid: Wanahabari Lab Outputs
Displays projects matching `programmeSlug: "wanahabari-lab"`:
1. **Research Spotlights**:
   - *Illicit Financial Flows & Sovereign Resource Governance* (House of Fiscal Wisdom / 2026 / Led by Dr. Lyla Latif)
   - *CRA Third Basis Formula Spotlight* (Committee on Fiscal Studies / 2025)
2. **Explainer Videos**:
   - *Budget Policy Statement 2026 Coverage Newsroom Kit* (National Treasury / 2026)

---

### 5.6 Footer & Bridge
- **Intake Card**:
  - Title: "Join the next Wanahabari Lab cohort."
  - Description: "Open to practising print, broadcast, and independent digital journalists and creators covering governance and public finance in Kenya."
  - Buttons: `Submit Lab application` (`/contact?intent=wanahabari-lab`) | `Review Lab evidence` (`/work?programme=wanahabari-lab`)
- **Sidebar**:
  - Label: `Wanahabari Lab admissions`
  - Cohorts: `Quarterly intakes`
  - Format: `One-day intensive + toolkit`
  - Note: `Journalists and creators welcome`
- **Chapter Bridge**: Links to **Desk 04 · Studios**

---

## 6. Desk 04: BNS Studios (`/programmes/studios`)

**File Path**: `src/components/programmes/scrollytelling/studios-scrollytelling.tsx`

### 6.1 Header & Meta
- **Telemetry HUD**: `BNS STUDIOS` | `CRAFT COMMISSIONS & CIVIC SURPLUS` | `PRODUCTION DESK`
- **Breadcrumb**: `<- All programmes` (`/programmes`)
- **Pills**: `Production desk · Commissioned craft` | `Client delivery with civic surplus`
- **Headline**:
  > "High-craft media. **A civic surplus attached.**"
- **Lede**:
  > "Commission podcasts, documentaries, motion graphics, and town halls from a studio that is fluent in public finance — and routes a portion of surplus into Budget Ndio Story's civic programmes."
- **4 Key Ledger Metrics**:
  1. `Mission enterprise` — **Model**: Craft that funds scrutiny
  2. `Surplus reinvested` — **Covenant**: Into BNS programmes
  3. `3 core` (Audio · Docs · Motion) — **Disciplines**
  4. `Open Studio ->` (`/bns-studio`) — **Portal**: Intake and theatre

---

### 6.2 NarrativeScrollytellingCanvas: Three Editorial Beats
**Component**: `NarrativeScrollytellingCanvas` (Pinned media on right, scrolling narrative beats on left)

#### Beat 1: `donor-trap`
- **Eyebrow**: `Why Studios exists`
- **Title**: "Civic scrutiny should not vanish when a grant year ends."
- **Paragraphs**:
  - "Too many accountability projects live on twelve-month funding cycles. When priorities pivot, the cameras pack up and the scorecards stop printing."
  - "BNS Studios is the production house that sells podcasts, documentaries, motion graphics, and town-hall broadcasts to governments, partners, companies, and CSOs — so civic work is not wholly hostage to a single donor calendar."
  - "A portion of Studios operating surplus funds Budget Ndio Story programmes: national tracking, county embeds, and newsroom labs. That covenant is the point of the desk."
- **Quote**:
  > “If your budget scrutiny depends only on the next grant approval, your watchdog is on a leash.”  
  > *— BNS Studios, Nairobi*
- **Metric**: `Surplus` (Portion reinvested in civic programmes)
- **Image**: BNS Production Crew (`CRAFT + CIVIC SURPLUS`)

#### Beat 2: `high-craft`
- **Eyebrow**: `The craft standard`
- **Title**: "We do not ship shelfware PDFs. We produce media people finish."
- **Paragraphs**:
  - "Opacity thrives when truth is boring. Dry reports compete with WhatsApp rumours — and rumours usually win."
  - "Studios treats fiscal stories like cinema and radio: bilingual sound, motion that clarifies rather than decorates, and cuts short enough for a feed without stripping the source citation."
  - "Flagship explainers such as Budget Sasa ni Delivery are built from published Treasury tables. Reach is measured; figures are never invented for shareability."
- **Quote**:
  > “Nobody shares a procurement audit PDF on TikTok. Turn the same facts into a verified reel, and people stay.”  
  > *— Nelly Maina, Host, Budget Ndio Story Podcast*
- **Metric**: `Provenance` (Every on-screen figure needs a public table)
- **Image**: Nelly with The Mic (`PODCAST & AUDIO`)

#### Beat 3: `double-impact`
- **Eyebrow**: `The commission letter`
- **Title**: "Your film or forum also bankrolls the next scorecard."
- **Paragraphs**:
  - "When a development partner, county, or coalition commissions a documentary, podcast season, or multi-camera town hall, they receive broadcast-quality delivery — and help keep civic programmes running after the invoice clears."
  - "That is the double job of Studios: craft for the client's audience, surplus for Connect, Mashinani, and Wanahabari Lab."
  - "Editorial independence stays non-negotiable. We will not invent budget numbers to flatter a brief, and we label unavailable figures as unavailable."
- **Metric**: `2×` (Client delivery + civic fuel)
- **Image**: Hall production at stakeholder forum (`TOWN HALL & BROADCAST`)

---

### 6.3 Expanding ScrollGallery: Nine Production Surfaces
**Component**: `ScrollGallery` in `src/components/motion/scroll-gallery.tsx`
- **Eyebrow**: `PRODUCTION SUITE`
- **Headline**: "Nine craft surfaces. One civic job."
- **Subheadline**: "Scroll to expand the production suite — audio, cinema, motion, and live convenings that keep public-finance stories watchable."
- **Nine Items**:
  1. **Acoustic Audio Engineering** (`Audio` | `PODCAST DESK`): Dolby broadcast mastering & sound design (`/images/studio/studio_audio_mic.jpg`)
  2. **Frontline Audio Scrutiny** (`Field Audio` | `VOX POP & PODCASTS`): Investigative recordings & vox pops
  3. **Narrative & Writers Room** (`Scripting` | `WRITERS ROOM`): Translating 400-page fiscal debt amortizations (`/images/studio/studio_convening_pencils.png`)
  4. **2D & Cel Motion Graphics** (`Animation` | `MOTION GRAPHICS`): Bite-sized data reels with 82% completion rates (`/images/studio/studio_motion_vfx.jpg`)
  5. **4K Anamorphic Cinema Unit** (`Cinema Master` | `FLAGSHIP MASTER`): Investigative documentaries shot in 21:9 (`/images/studio/studio_cinema_cam.jpg`)
  6. **Multi-Camera Town Hall** (`Live Broadcast` | `NATIONAL BROADCAST`): Broadcast-grade live event staging (`/images/hall/129A4248.jpg`)
  7. **On-Set Lighting & Direction** (`Set Direction` | `FIELD UNIT`): Behind-the-scenes grassroots documentary coverage
  8. **Studio Interview Portfolios** (`Interviews` | `EXECUTIVE INTERVIEWS`): High-contrast leadership & policy dialogues
  9. **County Baraza Media Feeds** (`Public Screenings` | `47 COUNTIES`): Screening fiscal audits in rural grassroots forums

---

### 6.4 Interactive CinemaTimelineStage: 8 Commercial Formats
**Component**: `CinemaTimelineStage` in `src/components/motion/cinema-timeline-stage.tsx`
- **Formats Spectrum**:
  1. `Short-Form Video Reels` (60–90 sec)
  2. `Deep-Dive Documentary` (15–45 min)
  3. `Studio Podcast` (30–60 min)
  4. `Motion Graphics & Cel Animation` (2–5 min)
  5. `Town Hall & Citizen Baraza` (2–4 hours)
  6. `Rapid Response Field Units` (24–48 hr turnaround)
  7. `Executive Portfolios` (Broadcast interviews)
  8. `Strategic Advocacy Campaigns` (Multi-week)
- **Sovereign Covenant Callout**:
  - `The Double-Impact Reinvestment Covenant`
  - "A portion of operating surplus from commercial client commissions is reinvested to fund grassroots audit scorecards and newsroom fellowships in our focus counties."

---

### 6.5 ProgrammeProjectGrid: BNS Studios Outputs
Displays projects matching `programmeSlug: "studios"`:
1. **Documentaries**:
   - *Digital PFM Reform Stories: Continental Country Experiences* (CABRI / 2026 / Bilingual EN-FR)
   - *Project TERRA: Technology, Equality, Regulatory Risk Assessment* (House of Fiscal Wisdom & Luminate / 2026)
   - *National Stakeholder Forum Production* (TISA Kenya / 2025)
2. **Podcast & Audio**:
   - *Budget Ndio Story Podcast Season 1* (TISA Kenya / 2025)

---

### 6.6 Commercial Intake Callout Band & Bridge
- **Eyebrow**: `Commission BNS Studios`
- **Title**: "Commission the craft. Fuel the civic work."
- **Body**: "Whether you need a podcast season, a nationwide town-hall broadcast, or motion graphics that explain a reform without inventing figures — Studios delivers verified broadcast quality."
- **Buttons**: `Commission the Studio` (`/bns-studio`) | `Explore Production Archive` (`/work`)
- **Chapter Bridge**: Loops back to **Desk 01 · Connect**

---

## 7. Connected Projects & Deep Dossiers (Layer 3)

These are the destination pages where projects link from `/programmes` and `/programmes/[slug]`.

### 7.1 Project TERRA (`/bns-project/terra`)
**File**: `src/content/projects/index.ts` & `src/app/(marketing)/bns-project/terra/page.tsx`
- **Canonical Slug**: `project-terra`
- **Title**: "Project TERRA: Technology, Equality, Regulatory Risk Assessment"
- **Principal Investigator**: Dr. Lyla Latif (House of Fiscal Wisdom & University of Nairobi)
- **Institutional Host**: House of Fiscal Wisdom (Nairobi, Kenya)
- **Funder**: Luminate (Governance, digital rights, and public accountability)
- **Timeframe**: 2026–2027 (Two-Year Pan-African Programme)
- **Video Announcement**: YouTube ID `it8rOKSYKnc` (01:49)
- **Executive Summary**:
  > "Project TERRA investigates how platform classification systems, rating algorithms, and open-ended data centre tax incentives systematically render African women workers invisible in public revenue systems. Rather than an accidental loophole, this invisibility is a structural artifact of how digital labor is defined, priced, and governed across the continent."
- **3 Research Pillars**:
  1. *Algorithmic Gender Bias in Platform Labour*: Erasing Care and Domestic Labour from the Fiscal Register.
  2. *Data Centre Fiscal Impact & Revenue Foregone*: Auditing Tech Infrastructure Tax Holidays vs. Public Return.
  3. *Proactive Regulatory Sandbox Design*: The Kenya Data Centre Risk Assessment Sandbox Pilot.
- **5 Analytical Mechanisms**:
  - `01 Ontological Exclusion`: Platforms construct workers as external software users, pre-empting state fiscal jurisdiction.
  - `02 Proxy Discrimination`: Automated rating metrics deprioritize women with unpaid domestic care obligations.
  - `03 Classification Asymmetry`: Platforms capture gig surplus while delegating 100% of tax compliance risk downward.
  - `04 Conditionality Misalignment`: Formal bank account and e-invoicing prerequisites force gig workers into informal vacuums.
  - `05 Feedback Amplification`: Exclusion from tax registers validates further legislative neglect and regressive VAT reliance.
- **2 Empirical Field Case Studies**:
  - *South Africa Domestic Platform Investigation*: Largest on-demand home cleaning platform in SA.
  - *East African Cross-Border Labor & Tech Corridor*: IP licensing expatriation across Kenya & Uganda.
- **4 Tools & Outputs**:
  - Continental Data Centre Tracker (GIS map of MW & water draw)
  - Revenue Foregone Simulator (Tax holiday losses vs job yield)
  - Critical Mineral Fiscal Corridors (Copper/cobalt supply chain tracing)
  - Kenya Sandbox Risk Assessment Protocol (Regulator evaluation framework)

---

### 7.2 Continental Bilingual Documentary: CABRI Digital PFM Reforms
**Route**: `/bns-studio/cabri-digital-pfm-reforms`
- **Title**: "Digital PFM Reform Stories: Continental Country Experiences"
- **Partner**: Collaborative Africa Budget Reform Initiative (CABRI)
- **Focus**: 10 African Ministries of Finance (Kenya, Rwanda, South Africa, Ghana, Namibia, Malawi, Benin, Côte d'Ivoire, CAR, Tunisia)
- **Player**: Bilingual dual-track player (English: `kWpY4K1uI20` [19:41], French: `GPebC3wHTus` [12:14])
- **Outputs**: Comparative Digital PFM Architecture Matrix, Public Procurement Transparency Tracker

---

### 7.3 Illicit Financial Flows & Sovereign Resource Governance
**Route**: `/bns-studio/illicit-financial-flows-benin-cabo-verde`
- **Title**: "Illicit Financial Flows & Sovereign Resource Governance"
- **Partner**: House of Fiscal Wisdom
- **Lead**: Dr. Lyla Latif
- **Focus**: Benin & Cabo Verde maritime extractive agreements and transfer mispricing
- **Outputs**: Extractive Contract Misinvoicing Taxonomy, Citizen Contract Oversight Checklist

---

### 7.4 National Budget Explainer: Budget Sasa ni Delivery
**Route**: `/bns-studio/budget-sasa-ni-delivery-explainer`
- **Partner**: National Treasury Kenya
- **Format**: Presenter-led explainer + 4 vertical social cut-downs
- **Impact**: 480K+ views in 90 days across YouTube and social

---

### 7.5 Studio Podcast Season 1
**Route**: `/bns-studio/budget-ndio-story-podcast`
- **Host**: Nelly Maina
- **Format**: 8 full episodes (35–45 min) + Audiogram social clips
- **Distribution**: Spotify RSS + Learn Hub companion notes

---

### 7.6 Nakuru Citizen Budget Baraza
**Route**: `/bns-studio/nakuru-citizen-baraza`
- **Partner**: Nakuru County Government
- **Format**: Tri-camera broadcast, simultaneous translation, 48-hour citizen summary
- **Reach**: 340 in-room participants, 2.1K livestream peak

---

### 7.7 Finance Bill Motion Graphics
**Route**: `/bns-studio/finance-bill-motion-explainer`
- **Format**: 3 animated chapters (3–4 min each)
- **Impact**: 1.2M impressions during Finance Bill debate

---

### 7.8 Mashinani: Promise vs Delivery Documentary
**Route**: `/bns-studio/mashinani-field-documentary`
- **Format**: 18-minute grassroots field film shot in Kakamega and Kilifi
- **Screenings**: 4 county forum openers

---

### 7.9 CRA Third Basis Formula Spotlight
**Route**: `/bns-studio/cra-formula-research-spotlight`
- **Partner**: Committee on Fiscal Studies (University of Nairobi)
- **Format**: Animated data walkthrough + 12-page visual brief

---

### 7.10 Budget Mtaani TikTok Series
**Route**: `/bns-studio/budget-tiktok-vertical-series`
- **Format**: 20 vertical episodes (45–90 sec)
- **Impact**: 3.4M views, 28% completion rate

---

### 7.11 Wajir Community Listening Sessions
**Route**: `/bns-studio/wajir-community-listening`
- **Format**: 4 ward circle recordings, Swahili & Somali summaries, photo essay

---

### 7.12 Budget Policy Statement 2026 Coverage
**Route**: `/bns-studio/bps-2026-reading-coverage`
- **Format**: 36-hour sprint newsroom kit (explainer, 12 b-roll clips, slide deck)

---

### 7.13 National Stakeholder Forum Production
**Route**: `/bns-studio/stakeholder-forum-production`
- **Partner**: TISA Kenya
- **Format**: Multi-camera coverage, 6 interview cuts, archive footage

---

## 8. Cross-Programme Shared Components & Bridges

### 8.1 `ProgrammeChapterBridge` (`src/components/programmes/programme-chapter-bridge.tsx`)
Connects each programme to the next in a circular arc:
- `connect` -> `mashinani` ("From the national feed to four counties")
- `mashinani` -> `wanahabari-lab` ("When communities need a newsroom that stays")
- `wanahabari-lab` -> `studios` ("Craft that keeps the civic work solvent")
- `studios` -> `connect` ("Back to the national feed")

### 8.2 `ProgrammeProjectGrid` (`src/components/programmes/programme-project-grid.tsx`)
- Renders directly on all 4 programme detail pages.
- Filters `studiosEvidenceData.getProjectsByProgramme(slug)`.
- Automatically groups projects into clean sections by `StudioContentType`.
- Provides clickable direct routing to `/bns-studio/[slug]` or `/bns-project/terra`.

---

## 9. Motion Scripting & De-Cluttering Recommendations

When prompting an animation or front-end motion agent, use the following directives:

### 9.1 Sections to Remove or Condense ("Chunky & Unused")
1. **Redundant Repetitive Copy**:
   - *Eliminated*: The old 1,000-word reach essays on Connect and Mashinani have already been deleted. Keep them out.
   - *Recommendation*: In `TransformationStage`, keep Tab 01 concise—do not add simulated multi-page PDF scrolling; the 4-line OCR snippet is sufficient.
2. **Double Headers**:
   - Avoid having both a large page header and an identical section header right beneath it.
3. **Empty Card Borders / Boxy Shadows**:
   - Use borderless or thin hairline borders (`border-border/40`) with muted gradient backgrounds rather than elevated shadows.

### 9.2 Motion Scripting Architecture
1. **TelemetryHUD**:
   - Keep sticky/pinned at `top-16` or `top-20` on desktop, collapse to a discreet hairline bar on mobile.
   - Pulse animation on live indicators (`size-1.5 bg-emerald-500 animate-pulse`).
2. **Header Masked Reveals**:
   - Animate `h1` lines with staggered `y: [20, 0]` and `opacity: [0, 1]` with `delay: 0.05` to `0.25s`.
3. **Parallax Image Blocks**:
   - Apply subtle scroll speed factors (`speed={-0.2}` to `-0.35`) for desktop only; disable on touch viewports (`(hover: none)`) to prevent jank.
4. **TransformationStage (Connect)**:
   - Use `AnimatePresence mode="wait"` for switching between `problem`, `transformation`, and `solution`.
   - Add micro-animations to the pipeline arrows (`ArrowRight`) on tab 2.
5. **FieldNotebookSpread (Mashinani)**:
   - County toggle pills (`Kilifi`, `Nakuru`, `Wajir`) should trigger smooth cross-fades (`opacity: 0 -> 1`, `y: 8 -> 0`).
6. **ForensicLightTable (Wanahabari Lab)**:
   - The redaction toggle (`isUnredacted`) applies a blur transition (`blur-[3px] -> blur-0`) simulating document disclosure.
7. **NarrativeScrollytellingCanvas (Studios)**:
   - Pin the media player/poster on the right side (`sticky top-28`) while narrative text beats scroll smoothly on the left.
8. **ScrollGallery (Studios)**:
   - Kinetic 3x3 expanding grid that responds to scroll depth, scaling tiles from `0.85` to `1.0` as they enter the viewport.
