"use client";

import React, { useEffect, useState } from "react";
import { OnboardingWizard } from "./onboarding-wizard";
import { AnonymousIdentityPicker } from "./anonymous-identity-picker";
import { BitmojiAvatar } from "./bitmoji-avatar";
import { StageDetailDrawer } from "./stage-detail-drawer";
import { ParticipationAlertsDrawer } from "./participation-alerts-drawer";
import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
import { Label } from "@/ui/label";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/ui/accordion";
import { toast } from "sonner";
import {
  Play, Flame, Trophy, User, Sparkles, BookOpen, AlertTriangle,
  ArrowRight, ShieldCheck, MapPin, Calendar, CheckCircle2,
  Bell, Volume2, Shield, Settings, Wifi, WifiOff, DownloadCloud, Copy, Send, MessageSquare,
  Home, HelpCircle, ChevronRight, Layers, Globe, FileCheck, Award
} from "lucide-react";
import { cn } from "@/utils";
import { useLearn } from "@/contexts/learn-context";
import { motion, AnimatePresence } from "motion/react";

// Translations dictionary for Global Language Toggle (EN / SW / Sheng)
const TRANSLATIONS = {
  EN: {
    dashboardTitle: "Civic Dashboard",
    dashboardSubtitle: "Track your budget learning journey and active county alerts.",
    stagesMastered: "Stages Mastered",
    sovereigns: "Sovereigns",
    streak: "Active Streak",
    roadmapTitle: "Map of the Budget Cycle",
    roadmapSubtitle: "Complete the 8 sequential stages to earn certificates & badges.",
    alertsTitle: "Participation Alerts",
    alertsSubtitle: "Hyper-local alerts matching your county and tracked documents.",
    profileTitle: "Citizen Profile",
    profileSubtitle: "Review your public credentials and participation logs.",
    settingsTitle: "App Settings",
    language: "App Language",
    resetBtn: "Reset All Progress",
    trackBtn: "Tracked Documents",
    cachedBadge: "📶 Cached",
    quickJump: "Quick Jump to Stage",
    cacheAll: "Offline Cache",
    consentText: "DPA 2019 Consent Verified",
    streakDays: "Day Streak",
    shengComingSoon: ""
  },
  SW: {
    dashboardTitle: "Mpanilio wa Uraia",
    dashboardSubtitle: "Fuatilia safari yako ya masomo ya bajeti na alerts za kaunti.",
    stagesMastered: "Hatua Zilizokamilika",
    sovereigns: "Sovereigns (SVG)",
    streak: "Mfululizo wa Siku",
    roadmapTitle: "Ramani ya Mzunguko wa Bajeti",
    roadmapSubtitle: "Kamilisha hatua zote 8 ili upate tuzo na beji.",
    alertsTitle: "Taarifa za Ushiriki",
    alertsSubtitle: "Taarifa za ushiriki kulingana na kaunti yako na hati unazofuatilia.",
    profileTitle: "Wasifu wa Mwananchi",
    profileSubtitle: "Angalia historia yako ya ushiriki na beji zako.",
    settingsTitle: "Mipangilio",
    language: "Lugha ya Programu",
    resetBtn: "Futa Maendeleo Yote",
    trackBtn: "Hati Zinazofuatiliwa",
    cachedBadge: "📶 Imehifadhiwa",
    quickJump: "Rukia Haraka Hatua",
    cacheAll: "Hifadhi Nje ya Mtandao",
    consentText: "Idhini ya DPA 2019 Imethibitishwa",
    streakDays: "Mfululizo wa Siku",
    shengComingSoon: ""
  },
  SH: {
    dashboardTitle: "Dashboard ya Mraia",
    dashboardSubtitle: "Fuatilia maworks zako za bajeti na alert za kaunti.",
    stagesMastered: "Ma-stage Umewai",
    sovereigns: "Sovereigns (SVG)",
    streak: "Streak ya Siku",
    roadmapTitle: "Mchoro ya Budget Cycle",
    roadmapSubtitle: "Maliza ma-stage zote 8 upate ma-badge na heshima.",
    alertsTitle: "Alerts za Ushiriki",
    alertsSubtitle: "Alerts za county yako na mambo za bajeti zenye unafuatilia.",
    profileTitle: "Profile ya Raia",
    profileSubtitle: "Check heshima zako na list ya memoranda umetuma.",
    settingsTitle: "Settings za App",
    language: "Lugha ya App",
    resetBtn: "Futa Maendeleo Yote [Sheng coming soon]",
    trackBtn: "Ma-doc Unafuatilia",
    cachedBadge: "📶 Imehifadhiwa [Sheng coming soon]",
    quickJump: "Rukia Stage Haraka [Sheng coming soon]",
    cacheAll: "Hifadhi Nje ya Mtandao [Sheng coming soon]",
    consentText: "Idhini ya DPA 2019 [Sheng coming soon]",
    streakDays: "Streak ya Siku",
    shengComingSoon: "[Sheng translation coming soon]"
  }
};

// 8 Stages Spec using the "One Journey, Two Tabs" step-based structure
const STAGES_DATA = [
  {
    id: 1,
    title: "Stage 1: Constitution",
    badge: "🛡️",
    badgeName: "DocNative",
    documentName: "Constitution of Kenya 2010",
    archive: "2010",
    link: "https://kenyalaw.org",
    status: "Published" as const,
    credits: "Credits: BNS Team",
    description: "Learn about the foundations of public finance in Kenya under Chapter Twelve of the Constitution, detailing transparency, equity, and citizen audit rights.",
    expectations: [
      "Decode your 5 core budget rights in Kenya.",
      "Understand Article 201 principles of public finance.",
      "Understand Article 35 guarantees for access to information.",
      "Learn how to audit county financial allocations."
    ],
    steps: [
      {
        id: 1,
        title: "1. Public Finance Principles",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage1_step1.mp3",
        transcript: "Hello citizens, welcome to Budget Ndio Story.\nToday we are looking at Chapter Twelve of the Kenyan Constitution.\nArticle 201 dictates that public finance shall be open and accountable.\nThis means you have the right to ask how county money is used.\nKeep watching to learn how to enforce your civic rights.",
        text: "The Kenyan Constitution sets the foundational framework for public finance under Chapter Twelve. Article 201 details that there shall be openness, accountability, and public participation in financial matters. It requires that the public finance system promote an equitable society where the burden of taxation is shared fairly. All public money must be used in a prudent and responsible manner.",
        trivia: [
          {
            type: "multiple-choice",
            question: "Which article of the Kenyan Constitution details the principles of public finance?",
            options: ["Article 201", "Article 217", "Article 221", "Article 35"],
            answer: 0,
            explanation: "Article 201 sets out the principles of public finance, including openness, accountability, and public participation."
          }
        ]
      },
      {
        id: 2,
        title: "2. Your Budget Rights",
        youtubeId: "wkPe3sWomoA",
        audioUrl: "/audio/stage1_step2.mp3",
        transcript: "In part 2, we dive deeper into your rights.\nArticle 35 provides that every citizen has the right of access to information.\nThis includes county budgets, plans, and audits.\nIf your county hides budget papers, they violate the constitution.",
        text: "Article 35 of the Constitution guarantees every citizen the right of access to information held by the state. In the context of budgeting, this means county governments are legally obligated to publish annual development plans, fiscal papers, and actual expenditure statements for citizen auditing. You do not need to be an expert to request these files.",
        trivia: [
          {
            type: "multiple-choice",
            question: "Article 35 of the Constitution guarantees citizens the right to what?",
            options: ["Access to information", "Free health care", "Equal wages", "Free primary education"],
            answer: 0,
            explanation: "Article 35 guarantees the right of access to information, which is key for civic budget auditing."
          }
        ]
      },
      {
        id: 3,
        title: "3. Legal Citations & Auditing",
        youtubeId: "FkgRz4v2Llk",
        audioUrl: "/audio/stage1_step3.mp3",
        transcript: "To finalize Stage 1, we look at the Controller of Budget.\nArticle 228 sets up this independent office to authorize withdrawals.\nNo county can withdraw funds without the COB's authorization.\nThis is a critical watchdog safeguard.",
        text: "Under Chapter Twelve, key regulatory organs are established to monitor public spending. Article 228 sets up the office of the Controller of Budget (COB), which is tasked with authorizing withdrawals from public funds and reporting budget implementation progress to Parliament quarterly. This provides an audit trail for citizens to inspect.",
        trivia: [
          {
            type: "multiple-choice",
            question: "Who oversees the implementation of county and national budgets by authorizing withdrawals?",
            options: ["Controller of Budget", "Central Bank Governor", "Senator", "County Governor"],
            answer: 0,
            explanation: "The Controller of Budget has the sole mandate to authorize withdrawals and submit quarterly implementation reports."
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Stage 2: Budget Policy Statement",
    badge: "⚖️",
    badgeName: "VertDecoder",
    documentName: "Budget Policy Statement (BPS)",
    archive: "2015",
    link: "https://www.treasury.go.ke",
    status: "Published" as const,
    credits: "Credits: Millicent Makini",
    description: "Reflect on Kenya's 2026 Budget Policy Statement (BPS), exploring national priorities, expenditure ceilings, division of revenue, and fiscal risk factors.",
    expectations: [
      "Decode the Budget's Secret: Understand the purpose and timeline of the BPS.",
      "Master the 5 Key Pillars: Explore the Bottom-Up economic priorities (BETA Agenda).",
      "Track the Trillion-Shilling Debt: Analyse expenditures, interest payments, and borrowing.",
      "Battle the Climate Risk: Understand fiscal risk factors.",
      "Share Your Policy Opinion: Reflect and propose your own solutions."
    ],
    steps: [
      {
        id: 1,
        title: "1. What is a Budget Policy Statement?",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage2_step1.mp3",
        transcript: "Let's explore the Budget Policy Statement.\nThe BPS outlines the broad strategic priorities and goals for the upcoming year.\nIt must be submitted to Parliament by 15th February in line with Section 25 of the PFM Act.\nIt establishes the expenditure ceilings for ministries and counties.",
        text: "The Budget Policy Statement (BPS) is a government policy document that sets out the broad strategic priorities and policy goals that should guide the national and county governments in preparing their budgets for the next financial year and over the medium term. The document is submitted to Parliament by the 15th of February every year in line with section 25 of the Public Finance Management (PFM) Act and contains macroeconomic forecasts, proposed expenditure ceilings, transfers to county governments, and medium-term debt limits. Once approved, it forms the basis for the national budget presented by April 30th.",
        trivia: [
          {
            type: "multiple-choice",
            question: "What is the main purpose of the Budget Policy Statement (BPS)?",
            options: [
              "To collect taxes from citizens",
              "To guide how national and county governments prepare their budgets",
              "To replace the national development plan",
              "To approve all government projects"
            ],
            answer: 1,
            explanation: "The BPS guides budget preparation by outlining macroeconomic frameworks and sector expenditure ceilings."
          },
          {
            type: "reflection",
            question: "Before learning about the BPS, how often did you think about how national budgets affect your daily life?",
            options: ["Very often", "Sometimes", "Rarely", "Never"],
            placeholder: "What areas of your life do you think government budgets influence the most? (e.g. transport, health, tax rates...)"
          },
          {
            type: "multiple-choice",
            question: "By law, the Budget Policy Statement must be submitted to Parliament by:",
            options: ["January 1", "February 15", "March 30", "April 30"],
            answer: 1,
            explanation: "Section 25 of the PFM Act mandates the Treasury to submit the BPS to Parliament by February 15th annually."
          }
        ]
      },
      {
        id: 2,
        title: "2. The 2026 BPS & Bottom-Up Pillars",
        youtubeId: "wkPe3sWomoA",
        audioUrl: "/audio/stage2_step2.mp3",
        transcript: "The 2026 BPS theme is 'Consolidating Gains Under the Bottom-Up economic agenda'.\nIt focuses on five main focus areas, also known as the pillars.\nThese include Agriculture, MSMEs, Healthcare, Housing, and the Digital Superhighway.\nLet's analyze how these sectors are funded.",
        text: "The theme of the BPS 2026 is, 'Consolidating Gains Under the Bottom-Up Economic Transformation Agenda for Inclusive and Sustainable Growth.' It seeks to accelerate development through focusing on Agriculture (crop diversification, fertilizer subsidies), and MSMEs (increasing credit access via Hustler Fund expansions and NYOTA linkages, setting up MSME hubs in all 47 counties for training).",
        trivia: [
          {
            type: "multiple-choice",
            question: "Which agenda guides the development priorities highlighted in the 2026 BPS?",
            options: ["Vision 2030 Growth Plan", "Bottom-Up Economic Transformation Agenda (BETA)", "East African Development Strategy", "National Industrial Policy"],
            answer: 1,
            explanation: "The 2026 BPS consolidates gains under the Bottom-Up Economic Transformation Agenda (BETA)."
          },
          {
            type: "reflection",
            question: "If you were designing an economic strategy for Kenya, which sector would you prioritise first and why?",
            options: ["Agriculture", "Small businesses (MSMEs)", "Healthcare", "Digital economy", "Infrastructure", "Education"],
            placeholder: "Explain briefly why this sector holds the highest importance for you."
          },
          {
            type: "multiple-choice",
            question: "You are a farmer benefiting from fertilizer subsidies and improved irrigation. What would likely happen if these programmes succeed?",
            options: ["Increased crop production", "Reduced food supply", "Higher unemployment in rural areas", "Less agricultural exports"],
            answer: 0,
            explanation: "Fertilizer subsidies and expanded irrigation are structured to boost food security by increasing crop production."
          },
          {
            type: "multiple-choice",
            question: "Many MSMEs struggle to access credit. Which BPS intervention aims to address this?",
            options: [
              "Expanding the Hustler Fund and credit guarantee scheme",
              "Increasing business licensing fees",
              "Limiting bank lending to small businesses",
              "Increasing corporate tax"
            ],
            answer: 0,
            explanation: "The BPS proposes increasing access to credit by expanding the Hustler Fund and MSME Credit Guarantee Schemes."
          },
          {
            type: "reflection",
            question: "Imagine you are a young entrepreneur starting a small business. Which support would make the biggest difference for you?",
            options: ["Affordable loans", "Business mentorship", "Digital skills training", "Access to markets"],
            placeholder: "Why does this specific support key benefit your business vision?"
          }
        ]
      },
      {
        id: 3,
        title: "3. Healthcare, Housing, and Digital Superhighway",
        youtubeId: "FkgRz4v2Llk",
        audioUrl: "/audio/stage2_step3.mp3",
        transcript: "Next, we cover Universal Health Coverage, Housing, and Digital expansion.\nThe government targets expanding SHA enrolment to 35 million people.\nIt also plans infrastructure investments in electric vehicles and fiber cable.\nLet's evaluate the spending targets.",
        text: "The BPS 2026 outlines UHC health targets (SHA enrollment of 35 million people, community health promoters support), Housing and Settlement (KMRC mortgage finance, affordable housing committees allocation), and Digital Superhighway (fiber cable expansion, public Wi-Fi hotspots, government services digitization). It also introduces a National Infrastructure Fund for long-term investments.",
        trivia: [
          {
            type: "multiple-choice",
            question: "When government spending is higher than its revenue, the difference is known as:",
            options: ["Fiscal surplus", "Fiscal deficit", "Monetary balance", "Public investment"],
            answer: 1,
            explanation: "A fiscal deficit represents the gap between total government spending and total revenues, which must be financed through debt."
          }
        ]
      },
      {
        id: 4,
        title: "4. Recent Economic Developments",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage2_step4.mp3",
        transcript: "Kenya's economy grew by around 5% in 2025.\nHowever, revenue collection fell below targets, causing deficit pressure.\nTo manage this, the government plans domestic revenue tax reforms.\nLet's review the debt interest costs.",
        text: "In 2025, Kenya's economy grew by around 5%, supported by services, agriculture, and industry. However, revenue collections fell below target, causing expenditure pressures. The government intends to implement domestic tax reforms and control recurrent spending to lower the deficit. GDP growth is projected at 5.3% in 2026/27.",
        trivia: [
          {
            type: "multiple-choice",
            question: "Interest payments on Kenya’s public debt are projected at over Ksh. 1 trillion. What challenge might this create?",
            options: [
              "Reduced funds for development and social services",
              "Lower tax collection",
              "Faster economic growth",
              "Reduced public borrowing"
            ],
            answer: 0,
            explanation: "Massive debt interest payments consume a huge portion of revenues, leaving fewer funds for essential social services like health and education."
          },
          {
            type: "reflection",
            question: "Why do you think citizens should understand government budgets, even if they are not economists?",
            placeholder: "Write one or two reasons (e.g. keeping leaders accountable, checking development projects...)"
          }
        ]
      },
      {
        id: 5,
        title: "5. Budget Projections & County Allocations",
        youtubeId: "wkPe3sWomoA",
        audioUrl: "/audio/stage2_step5.mp3",
        transcript: "For FY 2026/27, total revenue is projected at Ksh 3,588 Billion.\nTotal expenditure is projected at Ksh 4,737 Billion.\nThe allocation to county governments is proposed at Ksh 420 Billion.\nLet's inspect what county assemblies receive for service delivery.",
        text: "Total revenue for FY 2026/27 is forecasted at Ksh. 3,588.1 billion, with expenditures at Ksh. 4,737.5 billion. The BPS proposes allocating Ksh. 420 billion to county governments (a Ksh. 5 billion increase from 2025/26). Additional allocations include Community Health Promoters (Ksh. 3.2B), CAIPs industrial parks (Ksh. 3.25B), and mineral royalties share.",
        trivia: [
          {
            type: "multiple-choice",
            question: "The BPS proposes allocating KES. 420 billion to county governments. What is the main purpose of this transfer?",
            options: [
              "Funding local development and public services",
              "Repaying domestic loans",
              "Supporting foreign investments",
              "Honouring the constitution"
            ],
            answer: 0,
            explanation: "County revenue allocations are mandated to fund local devolved services like county roads, hospitals, and agriculture."
          }
        ]
      },
      {
        id: 6,
        title: "6. Specific Fiscal Risks",
        youtubeId: "FkgRz4v2Llk",
        audioUrl: "/audio/stage2_step6.mp3",
        transcript: "Every budget faces specific risks.\nThe BPS lists public debt pressure, State-Owned Enterprise liabilities, and climate disasters.\nDroughts and floods disrupt agriculture, which is the backbone of the economy.\nLet's discuss how we mitigate these risks.",
        text: "The BPS identifies specific fiscal risks: 1) Public Debt Risk, 2) Contingent Liabilities (State-Owned Enterprise debts, government guarantees), 3) Macroeconomic shortfalls, 4) Climate Change Risks (droughts and floods affecting food security), and 5) Devolution Risks (county pending bills).",
        trivia: [
          {
            type: "multiple-choice",
            question: "Which of the following is identified as a major fiscal risk in the BPS?",
            options: [
              "Rising public debt and interest payments",
              "Decreasing internet use",
              "Reduced population growth",
              "Lower rainfall every year"
            ],
            answer: 0,
            explanation: "Rising public debt levels and high interest payment pressures are listed as top fiscal risks to budget implementation."
          },
          {
            type: "reflection",
            question: "The BPS identifies climate change risks such as droughts and floods. How might these affect Kenya’s economy and public finances?",
            placeholder: "Think about impacts on agricultural productivity, infrastructure damage, and emergency relief costs."
          }
        ]
      },
      {
        id: 7,
        title: "7. Final Reflection & Policy Opinion",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage2_step7.mp3",
        transcript: "You have completed the Budget Policy Statement course!\nBefore we assent, Parliament wants one key strategic improvement.\nWhich sector would you strengthen most?\nSubmit your final opinion to earn your VertDecoder badge.",
        text: "Congratulations! You have completed Module 002. As a civic champion, your feedback matters. Reflect on the entire BPS strategic directions and choose the area you believe deserves the highest resource focus.",
        trivia: [
          {
            type: "reflection",
            question: "Imagine Parliament asks for one key improvement before approving the BPS. Which area would you strengthen most?",
            options: [
              "Agriculture and food security",
              "MSME development",
              "Healthcare",
              "Digital economy and youth innovation",
              "Infrastructure investment"
            ],
            placeholder: "Explain your choice in 2–3 sentences (e.g. food security lowers cost of living...)"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Stage 3: Division of Revenue Bill",
    badge: "🏛️",
    badgeName: "CountyCart",
    documentName: "Division of Revenue Bill",
    archive: "2016",
    link: "https://www.treasury.go.ke",
    status: "Gazetted" as const,
    credits: "Credits: BNS Team",
    description: "Analyze the Division of Revenue Bill (DoRB) dividing audited national taxes between the national administration and county assemblies.",
    expectations: [
      "Analyze the cake division ratio.",
      "Understand Equitable Share vs Conditional Grants.",
      "Track Senate mediation disputes."
    ],
    steps: [
      {
        id: 1,
        title: "1. Cake Division Principles",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage3_step1.mp3",
        transcript: "Welcome to Division of Revenue analysis.\nThis bill divides the national revenueケーキ between national and county governments.\nBy law, counties must get at least 15% of national audited revenues.",
        text: "The Division of Revenue Bill splits revenue raised nationally. Under Article 203 of the Constitution, several factors determine the share: national interest, public debt obligations, county needs, and developmental inequalities.",
        trivia: [
          {
            type: "multiple-choice",
            question: "The Division of Revenue Bill divides revenue between which two levels of government?",
            options: ["National and County Governments", "Judiciary and Executive", "Senate and National Assembly", "County and Ward"],
            answer: 0,
            explanation: "The Division of Revenue Bill divides funds between national and county levels of government."
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Stage 4: County Fiscal Strategy Paper",
    badge: "🔗",
    badgeName: "ChainStrat",
    documentName: "County Fiscal Strategy Paper (CFSP)",
    archive: "2018",
    link: "https://www.cog.go.ke",
    status: "Comment Open" as const,
    credits: "Credits: BNS Team",
    description: "Audit county expenditure ceilings and department allocations before appropriation acts legalize county withdrawals.",
    expectations: [
      "Understand county strategy papers.",
      "Review sector expenditure limits.",
      "Lobby county MCAs on local priorities."
    ],
    steps: [
      {
        id: 1,
        title: "1. County Ceilings",
        youtubeId: "wkPe3sWomoA",
        audioUrl: "/audio/stage4_step1.mp3",
        transcript: "Welcome to CFSP ceilings analysis.\nCFSP aligns county sector plans with national guidelines.\nWe must inspect if county priorities match development goals.",
        text: "The County Fiscal Strategy Paper sets out the framework for county budgeting. Sourced by County Treasuries, it specifies expenditure caps for local departments (Health, Roads, Agriculture) before the formal budget estimates are drafted.",
        trivia: [
          {
            type: "multiple-choice",
            question: "When should the CFSP be submitted to the County Assembly?",
            options: ["By 28th February", "By 30th April", "By 15th June", "By 1st January"],
            answer: 0,
            explanation: "PFM Act Section 117 mandates County Treasuries to submit the CFSP to the Assembly by February 28th."
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Stage 5: CIDP + Annual Development Plan",
    badge: "💰",
    badgeName: "AppropNative",
    documentName: "Annual Development Plan (ADP)",
    archive: "2019",
    link: "https://www.cog.go.ke",
    status: "Published" as const,
    credits: "Credits: BNS Team",
    description: "Track county 5-year master plans (CIDP) and inspect the yearly execution slices (ADP) to ensure priority projects are funded.",
    expectations: [
      "Differentiate CIDP from ADP.",
      "Verify local projects inclusion in plans.",
      "Audit ward-level public development priorities."
    ],
    steps: [
      {
        id: 1,
        title: "1. 5-Year Planning",
        youtubeId: "FkgRz4v2Llk",
        audioUrl: "/audio/stage5_step1.mp3",
        transcript: "Today we trace County Development Plans.\nCIDP is the 5-year master roadmap.\nNo project can get funding unless it sits in the CIDP.",
        text: "The County Integrated Development Plan (CIDP) defines county development aspirations for five years. The Annual Development Plan (ADP) pulls from the CIDP to specify active projects scheduled for funding and execution in the upcoming fiscal year.",
        trivia: [
          {
            type: "multiple-choice",
            question: "How many years does a County Integrated Development Plan (CIDP) cover?",
            options: ["5 years", "1 year", "10 years", "3 years"],
            answer: 0,
            explanation: "CIDPs are 5-year statutory master plans aligned with county election cycles."
          }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Stage 6: County Appropriation Bill",
    badge: "👁️",
    badgeName: "Watchdog",
    documentName: "County Appropriation Act",
    archive: "2020",
    link: "https://kenyalaw.org",
    status: "Closed" as const,
    credits: "Credits: BNS Team",
    description: "Verify the legal authorization acts passed by assemblies that allow the executive to spend public funds.",
    expectations: [
      "Review appropriation acts.",
      "Track supplementary budget changes.",
      "Audit administrative overhead adjustments."
    ],
    steps: [
      {
        id: 1,
        title: "1. Appropriation Law",
        youtubeId: "Ed9lP0-komE",
        audioUrl: "/audio/stage6_step1.mp3",
        transcript: "Welcome to Appropriation analysis.\nAppropriation acts give county ministries the legal power to spend.\nWithout it, operations freeze on 1st July.",
        text: "The County Appropriation Act legalizes the county budget. It authorizes withdrawal of public monies from the County Revenue Fund for specific programs approved during public budget hearings.",
        trivia: [
          {
            type: "multiple-choice",
            question: "What does the County Appropriation Act authorize?",
            options: [
              "Spending of public funds from the County Revenue Fund",
              "Introduction of new local taxes",
              "Appointment of county ministers",
              "Borrowing from international banks"
            ],
            answer: 0,
            explanation: "The Appropriation Act legally authorizes expenditure of approved public budget funds."
          }
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Stage 7: Controller of Budget Reports",
    badge: "📣",
    badgeName: "PartReady",
    documentName: "COB Implementation Reports",
    archive: "2021",
    link: "https://cob.go.ke",
    status: "Published" as const,
    credits: "Credits: BNS Team",
    description: "Review implementation reports tracking county absorption rates and checking if development funds were diverted.",
    expectations: [
      "Inspect quarterly audit reports.",
      "Understand budget absorption rates.",
      "Expose administrative travel diversions."
    ],
    steps: [
      {
        id: 1,
        title: "1. Audit and Absorption",
        youtubeId: "wkPe3sWomoA",
        audioUrl: "/audio/stage7_step1.mp3",
        transcript: "Let's review budget absorption rates.\nCOB reports verify if kaunti spent allocations.\nLow absorption means projects are delayed, hurting service.",
        text: "The Controller of Budget submits quarterly reports tracking budget execution. Absorption rate measures the percentage of budgeted funds actually spent. Low development absorption implies slow project implementation.",
        trivia: [
          {
            type: "multiple-choice",
            question: "How often does the Controller of Budget submit budget implementation reports?",
            options: ["Quarterly", "Annually", "Monthly", "Every two years"],
            answer: 0,
            explanation: "Article 228(6) mandates the Controller of Budget to submit budget reports every quarter."
          }
        ]
      }
    ]
  },
  {
    id: 8,
    title: "Stage 8: Public Participation Toolkit",
    badge: "🗺️",
    badgeName: "Cartographer",
    documentName: "Public Participation Guidelines",
    archive: "2022",
    link: "https://www.parliament.go.ke",
    status: "Published" as const,
    credits: "Credits: BNS Team",
    description: "Equip yourself with structured templates to submit written budget memoranda and drive changes in county plans.",
    expectations: [
      "Learn to draft written budget memoranda.",
      "Verify county assembly consultation logs.",
      "Mobilize citizen budget advocacy townhalls."
    ],
    steps: [
      {
        id: 1,
        title: "1. Advocacy Memoranda",
        youtubeId: "FkgRz4v2Llk",
        audioUrl: "/audio/stage8_step1.mp3",
        transcript: "To finalize, learn to build budget memos.\nA memo structured with observation and action carries weight.\nUse our templates to submit comments to your county.",
        text: "Written memoranda are the primary tools for formal public participation. Assemblies are legally required to compile public reviews and report how citizen feedback influenced the final budget laws.",
        trivia: [
          {
            type: "multiple-choice",
            question: "Under Article 201, public participation in financial matters is:",
            options: ["Mandatory", "Optional", "Only for urban areas", "Gated by registration fee"],
            answer: 0,
            explanation: "Article 201 mandates public participation as an essential value in all public finance systems."
          }
        ]
      }
    ]
  }
];

export function LearnPathsHome() {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { activeTab, setActiveTab } = useLearn();

  // Selected Stage for Detail Drawer
  const [selectedStage, setSelectedStage] = useState<any | null>(null);

  // Offline Simulation State
  const [isOffline, setIsOffline] = useState(false);
  const [cachedStages, setCachedStages] = useState<number[]>([]);

  // Participation Alert State
  const [showAlertDrawer, setShowAlertDrawer] = useState(false);

  // Load profile on mount
  useEffect(() => {
    const stored = localStorage.getItem("bns_user_profile");
    if (stored) {
      const parsed = JSON.parse(stored);
      const streakDays = checkStreak(parsed);
      const updated = { ...parsed, streakDays, lastActive: Date.now() };
      setProfile(updated);
      localStorage.setItem("bns_user_profile", JSON.stringify(updated));
    }
    
    const storedCache = localStorage.getItem("bns_cached_stages");
    if (storedCache) {
      setCachedStages(JSON.parse(storedCache));
    }
    setLoading(false);
  }, []);

  const checkStreak = (userProfile: any) => {
    if (!userProfile.lastActive) return 0;
    const lastActiveDate = new Date(userProfile.lastActive);
    const today = new Date();
    lastActiveDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    
    const diffTime = Math.abs(today.getTime() - lastActiveDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return userProfile.streakDays || 0;
    } else if (diffDays === 1) {
      return (userProfile.streakDays || 0) + 1;
    } else {
      return 0;
    }
  };

  const handleOnboardingComplete = (newProfile: any) => {
    setProfile(newProfile);
    setActiveTab("home");
    toast.success("Welcome aboard, Civic Champion!");
  };

  const handleUpdateProfile = (updated: any) => {
    setProfile(updated);
    localStorage.setItem("bns_user_profile", JSON.stringify(updated));
  };

  const handleToggleCache = (stageId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    let newCached = [...cachedStages];
    if (newCached.includes(stageId)) {
      newCached = newCached.filter(id => id !== stageId);
      toast.info("Removed stage from local cache.");
    } else {
      newCached.push(stageId);
      toast.success("Stage cached offline successfully!");
    }
    setCachedStages(newCached);
    localStorage.setItem("bns_cached_stages", JSON.stringify(newCached));
  };

  const handleResetProgress = () => {
    if (window.confirm("Reset all progress? This wipes profile & statistics.")) {
      localStorage.removeItem("bns_user_profile");
      localStorage.removeItem("bns_cached_stages");
      for (let i = 1; i <= 8; i++) {
        localStorage.removeItem(`stage_${i}_article`);
        localStorage.removeItem(`stage_${i}_quiz_attempts`);
        localStorage.removeItem(`stage_${i}_quiz_cooldown`);
        localStorage.removeItem(`stage_${i}_current_step`); // clear step progress
        for (let j = 0; j < 10; j++) {
          localStorage.removeItem(`stage_${i}_video_${j}`);
          localStorage.removeItem(`stage_${i}_chapter_${j}`);
          localStorage.removeItem(`stage_${i}_step_${j}_trivia_passed`);
        }
      }
      setProfile(null);
      setCachedStages([]);
      setSelectedStage(null);
      setActiveTab("home");
      toast.success("All profiles wiped.");
    }
  };

  // Get localized text matching user language setting
  const langKey = (profile?.language as "EN" | "SW" | "SH") || "EN";
  const text = TRANSLATIONS[langKey];

  // Leaderboard assembly sorting
  const leaderboard = [
    { name: "BudgetBreaker_Nairobi", svg: 850, stages: 8 },
    { name: "SovereignSeeker_Mombasa", svg: 720, stages: 6 },
    { name: "GavanaWatch_Kisumu", svg: 640, stages: 5 },
    { name: profile?.pseudoName || "You", svg: profile?.sovereigns || 0, stages: profile?.badges?.length || 0, isUser: true },
    { name: "MCA_Whisperer_Nakuru", svg: 310, stages: 3 },
    { name: "CitizenZero_Kiambu", svg: 150, stages: 1 }
  ].sort((a, b) => b.svg - a.svg).map((item, idx) => ({ ...item, rank: idx + 1 }));

  const currentStageNum = profile ? (profile.stageProgress ? Math.max(...profile.stageProgress) : 1) : 1;
  const currentStage = STAGES_DATA.find(s => s.id === currentStageNum) || STAGES_DATA[0];

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin size-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // If user is not onboarded, render AnonymousIdentityPicker
  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
        <AnonymousIdentityPicker onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen flex flex-col">
      {/* 📱 MOBILE VIEW (Guarded by md:hidden) */}
      <div className="w-full max-w-md mx-auto flex flex-col md:hidden relative pb-20 min-h-screen bg-background">
        
        {/* 📡 Offline Simulator Banner (Low-Connectivity UX) */}
        <div className={`w-full py-1.5 px-4 text-xs font-bold flex items-center justify-between border-b transition-colors ${isOffline ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'}`}>
          <div className="flex items-center gap-1.5">
            {isOffline ? <WifiOff className="size-4 animate-pulse" /> : <Wifi className="size-4" />}
            <span>{isOffline ? "Offline Sim Active" : "Online Mode"}</span>
          </div>
          <button
            onClick={() => {
              setIsOffline(!isOffline);
              toast.info(`Switched to ${!isOffline ? "Offline Sim" : "Online Mode"}`);
            }}
            className="underline text-[10px] font-extrabold uppercase hover:text-foreground/80"
          >
            Toggle Sim
          </button>
        </div>

        {/* Global Sheng translation warning banner */}
        {profile.language === "SH" && (
          <div className="w-full py-1 px-4 text-[10px] font-semibold bg-amber-500/15 border-b border-amber-500/20 text-amber-600 text-center">
            {text.shengComingSoon}
          </div>
        )}

        {/* Profile Header Summary */}
        <header className="px-4 py-3 border-b border-border bg-card flex justify-between items-center gap-3">
          {/* Logo */}
          <a href="/" className="shrink-0 flex items-center hover:opacity-80 transition-opacity" aria-label="Home">
            <img src="/logo.svg" alt="Budget Ndio Story" className="h-7 w-auto" />
          </a>

          {/* User Info */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <BitmojiAvatar gender={profile.gender} size="sm" className="shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xs font-black text-foreground truncate">{profile.breakName}</h1>
              <p className="text-[10px] text-muted-foreground truncate">{profile.county} · Lvl {Math.floor(profile.sovereigns / 100) + 1}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black flex items-center gap-1">
              <Sparkles className="size-3 fill-primary" />
              <span>{profile.sovereigns}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold" title={text.streak}>
              <Flame className="size-3 fill-orange-500" />
              <span>{profile.streakDays}d</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: CIVIC DASHBOARD (HOME) */}
            {activeTab === "home" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-black uppercase tracking-tight">{text.dashboardTitle}</h2>
                  <p className="text-xs text-muted-foreground">{text.dashboardSubtitle}</p>
                </div>

                {/* Progress Tracker Card */}
                <div className="p-4 rounded-2xl border border-border bg-card space-y-3 shadow-xs">
                  <div className="flex justify-between items-center text-xs font-bold text-foreground">
                    <span>Progress to Citizen Expert</span>
                    <span className="text-primary">{profile.badges?.length || 0} / 8 Stages Mastered</span>
                  </div>
                  <Progress value={((profile.badges?.length || 0) / 8) * 100} className="h-2 rounded-full" />
                  <p className="text-[10px] text-muted-foreground">Unlock all 8 badges by completing the trivia gates.</p>
                </div>

                {/* Hyper-local Participation Alert Callout */}
                <div className="p-4 rounded-xl border border-primary/25 bg-primary/5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-extrabold uppercase text-primary">
                      <Bell className="size-3" /> Participation Alert
                    </div>
                    <h3 className="text-xs font-bold">Memorandum Open for {profile.county}!</h3>
                    <p className="text-[10px] text-muted-foreground leading-normal">Submit citizen feedback on the CFSP document to represent your community.</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowAlertDrawer(true)}
                    className="rounded-xl font-bold shrink-0 text-xs gap-1"
                  >
                    Draft <ArrowRight className="size-3.5" />
                  </Button>
                </div>

                {/* Current Active Stage Card */}
                <div className="p-4 border border-border bg-card rounded-2xl space-y-3 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Current Stage</span>
                    <span className="text-[11px] text-primary font-bold">Stage {currentStage.id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currentStage.badge}</span>
                    <div>
                      <h4 className="text-sm font-black uppercase leading-tight">{currentStage.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{currentStage.documentName}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedStage(currentStage)}
                    className="w-full rounded-xl mt-2 font-bold"
                  >
                    Resume Learning
                  </Button>
                </div>
              </motion.div>
            )}

            {/* TAB 2: ROADMAP (LEARN) */}
            {activeTab === "learn" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-black uppercase tracking-tight">{text.roadmapTitle}</h2>
                  <p className="text-xs text-muted-foreground">{text.roadmapSubtitle}</p>
                </div>

                {/* Desktop Quick-Jump Stage Selector */}
                <div className="space-y-2">
                  <Label htmlFor="stageSelect" className="text-xs font-bold text-muted-foreground">{text.quickJump}</Label>
                  <select
                    id="stageSelect"
                    onChange={(e) => {
                      const selected = STAGES_DATA.find(s => s.id === parseInt(e.target.value));
                      if (selected) {
                        setSelectedStage(selected);
                      }
                    }}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-card text-xs focus-visible:outline-none"
                  >
                    <option value="">Select a stage...</option>
                    {STAGES_DATA.map((s) => {
                      const isCompleted = profile.badges?.includes(s.badge);
                      const isActive = profile.stageProgress?.includes(s.id);
                      return (
                        <option key={s.id} value={s.id}>
                          Stage {s.id}: {s.documentName} {isCompleted ? "✓" : isActive ? "▶" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Accordion Map Overview */}
                <Accordion type="single" collapsible className="w-full space-y-2 border-none">
                  <AccordionItem value="map-overview" className="border border-border bg-card rounded-xl overflow-hidden px-4">
                    <AccordionTrigger className="hover:no-underline py-3 text-xs font-bold flex items-center justify-between text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-foreground">
                        <Layers className="size-4 text-primary" />
                        <span>Overview: Map of the Budget Cycle</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="border-t border-border pt-3 pb-3">
                      <div className="grid grid-cols-2 gap-2">
                        {STAGES_DATA.map((s) => {
                          const done = profile.badges?.includes(s.badge);
                          const active = profile.stageProgress?.includes(s.id);
                          return (
                            <div key={s.id} className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${done ? 'border-primary/20 bg-primary/5' : active ? 'border-foreground/30 bg-card' : 'border-border opacity-40 bg-muted/20'}`}>
                              <span className="text-base">{s.badge}</span>
                              <div className="truncate">
                                <p className="font-bold truncate text-[10px] leading-tight">{s.badgeName}</p>
                                <p className="text-[9px] text-muted-foreground truncate">{s.documentName}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Vertical Visual Timeline (Roadmap) */}
                <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-border">
                  {STAGES_DATA.map((stage) => {
                    const isCompleted = profile.badges?.includes(stage.badge);
                    const isActive = profile.stageProgress?.includes(stage.id);
                    const isStageCached = cachedStages.includes(stage.id);
                    const offlineDisabled = isOffline && !isStageCached;

                    return (
                      <div
                        key={stage.id}
                        onClick={() => {
                          if (offlineDisabled) return;
                          setSelectedStage(stage);
                        }}
                        className={`relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                          isCompleted
                            ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                            : isActive
                            ? "bg-card border-foreground/35 hover:border-foreground shadow-xs"
                            : "bg-muted/15 border-border hover:bg-muted/30"
                        } ${offlineDisabled ? "opacity-30 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Circle Timeline Index */}
                          <div className={`size-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border z-10 ${
                            isCompleted
                              ? "bg-primary border-primary text-primary-foreground"
                              : isActive
                              ? "bg-card border-foreground text-foreground"
                              : "bg-muted border-border text-muted-foreground"
                          }`}>
                            {isCompleted ? stage.badge : stage.id}
                          </div>

                          <div>
                            <div className="flex items-center gap-1">
                              <h3 className="text-xs font-black uppercase tracking-tight">{stage.title}</h3>
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[150px] sm:max-w-xs">{stage.documentName}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${stage.status === 'Comment Open' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-muted border-border text-muted-foreground'}`}>
                                {stage.status}
                              </span>
                              {isStageCached && (
                                <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                  📶 Cached
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Cache controls */}
                        {!offlineDisabled && (
                          <button
                            onClick={(e) => handleToggleCache(stage.id, e)}
                            className={`p-2 rounded-lg border hover:bg-muted shrink-0 ${isStageCached ? 'border-blue-500/20 text-blue-600 bg-blue-500/5' : 'border-border text-muted-foreground'}`}
                          >
                            <DownloadCloud className="size-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 3: PARTICIPATION ALERTS */}
            {activeTab === "alerts" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-black uppercase tracking-tight">{text.alertsTitle}</h2>
                  <p className="text-xs text-muted-foreground">{text.alertsSubtitle}</p>
                </div>

                {/* Notification card matching county */}
                <div className="p-5 border border-border bg-card rounded-2xl space-y-4 shadow-xs">
                  <div className="flex justify-between items-start border-b border-border pb-3">
                    <div>
                      <h3 className="text-xs font-bold text-foreground">CFSP Comment Window Open</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{profile.county} County Assembly</p>
                    </div>
                    <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-bold px-2 py-0.5 rounded-full">
                      Comment Open
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-normal">
                    🚨 **County Fiscal Strategy Paper (CFSP) 2026/27** is open for comments. Act now to submit observation comments.
                  </p>

                  <div className="pt-2">
                    <Button
                      onClick={() => setShowAlertDrawer(true)}
                      className="w-full rounded-xl font-bold gap-1.5 h-10 text-xs"
                    >
                      Review → Draft → Submit
                    </Button>
                  </div>
                </div>

                {/* Submissions History Log */}
                <div className="space-y-3.5">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Logged Submissions</h3>
                  {profile.participationLogs?.length > 0 ? (
                    <div className="space-y-2.5">
                      {profile.participationLogs.map((log: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-xl border border-border bg-card space-y-2 text-xs shadow-xs">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-foreground leading-none">{log.documentName}</h4>
                            <span className="text-[9px] bg-primary/10 border border-primary/20 text-primary font-bold px-2 py-0.5 rounded-full">
                              {log.method}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground font-semibold">Submitted: {new Date(log.dateSubmitted).toLocaleString()}</p>
                          <div className="bg-muted/30 p-2.5 rounded-lg border border-border/50 font-mono text-[9px] leading-relaxed whitespace-pre-wrap truncate max-h-24">
                            {log.draftText}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-6 border border-dashed border-border rounded-xl">
                      No commentaries submitted yet. Tap the alert card above to draft one!
                    </p>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 4: CITIZEN PROFILE & SETTINGS */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-lg font-black uppercase tracking-tight">{text.profileTitle}</h2>
                  <p className="text-xs text-muted-foreground">{text.profileSubtitle}</p>
                </div>

                {/* Profile Card */}
                <div className="p-4 rounded-2xl border border-border bg-card space-y-4 shadow-xs">
                  <div className="flex items-center gap-3">
                    <BitmojiAvatar gender={profile.gender} size="md" />
                    <div>
                      <h3 className="text-xs font-black text-foreground">{profile.breakName}</h3>
                      <p className="text-[10px] text-muted-foreground font-bold leading-none mt-1">{profile.county} · Lvl {Math.floor(profile.sovereigns / 100) + 1}</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleResetProgress}
                    className="w-full rounded-xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/95 transition-all text-xs h-10"
                  >
                    Reset All Progress
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Mobile Stage Detail Drawer (only rendered on mobile) */}
        {selectedStage && (
          <div className="md:hidden">
            <StageDetailDrawer
              stage={selectedStage}
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onClose={() => setSelectedStage(null)}
              hasNext={selectedStage.id < 8}
              hasPrev={selectedStage.id > 1}
              onPrevStage={() => {
                const prev = STAGES_DATA.find(s => s.id === selectedStage.id - 1);
                if (prev) {
                  const isCompleted = profile.badges?.includes(prev.badge);
                  const isActive = profile.stageProgress?.includes(prev.id);
                  if (!isCompleted && !isActive) {
                    toast.error(`Stage ${prev.id} is locked.`);
                    return;
                  }
                  setSelectedStage(prev);
                }
              }}
              onNextStage={() => {
                const next = STAGES_DATA.find(s => s.id === selectedStage.id + 1);
                if (next) {
                  const isCompleted = profile.badges?.includes(next.badge);
                  const isActive = profile.stageProgress?.includes(next.id);
                  if (!isCompleted && !isActive) {
                    toast.error(`Stage ${next.id} is locked.`);
                    return;
                  }
                  setSelectedStage(next);
                }
              }}
            />
          </div>
        )}

        {/* Mobile Participation Alerts Drawer (only rendered on mobile) */}
        {showAlertDrawer && (
          <div className="md:hidden">
            <ParticipationAlertsDrawer
              profile={profile}
              onClose={() => {
                setShowAlertDrawer(false);
                const stored = localStorage.getItem("bns_user_profile");
                if (stored) setProfile(JSON.parse(stored));
              }}
              onUpdateProfile={handleUpdateProfile}
            />
          </div>
        )}

      </div>

      {/* 🖥️ DESKTOP VIEW (Guarded by hidden md:flex) */}
      <div className="hidden md:flex flex-1 w-full bg-background overflow-hidden h-screen">
        
        {selectedStage ? (
          /* A) Stage Selected View: 2-panel Stage Detail */
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <StageDetailDrawer
              stage={selectedStage}
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              onClose={() => setSelectedStage(null)}
              hasNext={selectedStage.id < 8}
              hasPrev={selectedStage.id > 1}
              onPrevStage={() => {
                const prev = STAGES_DATA.find(s => s.id === selectedStage.id - 1);
                if (prev) {
                  const isCompleted = profile.badges?.includes(prev.badge);
                  const isActive = profile.stageProgress?.includes(prev.id);
                  if (!isCompleted && !isActive) {
                    toast.error(`Stage ${prev.id} is locked.`);
                    return;
                  }
                  setSelectedStage(prev);
                }
              }}
              onNextStage={() => {
                const next = STAGES_DATA.find(s => s.id === selectedStage.id + 1);
                if (next) {
                  const isCompleted = profile.badges?.includes(next.badge);
                  const isActive = profile.stageProgress?.includes(next.id);
                  if (!isCompleted && !isActive) {
                    toast.error(`Stage ${next.id} is locked.`);
                    return;
                  }
                  setSelectedStage(next);
                }
              }}
            />
          </div>
        ) : (
          /* B) No Stage Selected View: Tab Content + Stats Panel */
          <div className="flex-1 grid grid-cols-[1fr_320px] h-full overflow-hidden">
            
            {/* Left: Tab Content (scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Tab: Home */}
              {activeTab === "home" && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {/* Premium Hero Banner */}
                  <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground space-y-3 overflow-hidden shadow-sm">
                    <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center p-8 pointer-events-none select-none">
                      <Sparkles className="size-48" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-white">Kenya Civic Journey</span>
                    <h2 className="text-2xl md:text-3xl font-black leading-tight max-w-xl">Master Your Civic Budget Rights &amp; Power</h2>
                    <p className="text-xs text-white/80 max-w-md">Learn where your taxes go, how budgets are formed, and draft your own comments to hold leaders accountable.</p>
                    <Button 
                      onClick={() => setActiveTab("learn")}
                      className="bg-white text-primary hover:bg-white/95 rounded-xl font-bold text-xs px-5 h-10 mt-2 shadow-sm"
                    >
                      Explore Learning Map
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Progress Card */}
                    <div className="p-5 border border-border bg-card rounded-2xl space-y-3.5 shadow-xs">
                      <h3 className="text-xs font-black uppercase text-muted-foreground tracking-wider">Overall Progress</h3>
                      <div className="flex justify-between items-baseline">
                        <span className="text-3xl font-black text-foreground">{profile.badges?.length || 0} / 8</span>
                        <span className="text-[10px] text-muted-foreground font-semibold">STAGES MASTERED</span>
                      </div>
                      <Progress value={((profile.badges?.length || 0) / 8) * 100} className="h-2 rounded-full" />
                    </div>

                    {/* Active Stage Resumer */}
                    <div className="p-5 border border-border bg-card rounded-2xl space-y-3.5 shadow-xs flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Active Stage</span>
                        <h4 className="text-sm font-bold text-foreground leading-tight flex items-center gap-1.5 mt-1">
                          <span className="text-lg">{currentStage.badge}</span>
                          {currentStage.title}
                        </h4>
                      </div>
                      <Button
                        onClick={() => setSelectedStage(currentStage)}
                        className="w-full rounded-xl font-bold mt-2 text-xs"
                      >
                        Resume Learning
                      </Button>
                    </div>
                  </div>

                  {/* Leaderboard */}
                  <div className="p-5 border border-border bg-card rounded-2xl space-y-4 shadow-xs">
                    <h3 className="text-xs font-black uppercase text-muted-foreground tracking-wider">Civic Leaderboard</h3>
                    <div className="space-y-2">
                      {leaderboard.slice(0, 3).map((item) => (
                        <div key={item.name} className={cn(
                          "flex items-center justify-between p-3 rounded-xl border text-xs",
                          item.isUser ? "bg-primary/5 border-primary/20" : "bg-muted/10 border-border/50"
                        )}>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-muted-foreground w-4">{item.rank}</span>
                            <span className={cn("font-bold text-xs", item.isUser ? "text-primary text-xs" : "text-foreground text-xs")}>{item.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-muted-foreground font-semibold">
                            <span>{item.stages} Badges</span>
                            <span className="text-foreground font-bold">{item.svg} SVG</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Learn (Roadmap) */}
              {activeTab === "learn" && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <div className="space-y-1">
                    <h2 className="text-xl font-black uppercase tracking-tight">{text.roadmapTitle}</h2>
                    <p className="text-xs text-muted-foreground">{text.roadmapSubtitle}</p>
                  </div>

                  {/* Premium Cards Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {STAGES_DATA.map((stage) => {
                      const isCompleted = profile.badges?.includes(stage.badge);
                      const isActive = profile.stageProgress?.includes(stage.id);
                      const isStageCached = cachedStages.includes(stage.id);
                      const offlineDisabled = isOffline && !isStageCached;

                      return (
                        <div
                          key={stage.id}
                          onClick={() => {
                            if (offlineDisabled) return;
                            setSelectedStage(stage);
                          }}
                          className={cn(
                            "relative flex flex-col justify-between p-5 rounded-2xl border transition-all select-none group cursor-pointer",
                            isCompleted
                              ? "bg-primary/4 border-primary/15 hover:bg-primary/8 shadow-xs"
                              : isActive
                              ? "bg-card border-foreground/30 hover:border-foreground shadow-sm"
                              : "bg-muted/10 border-border/80 hover:bg-muted/25",
                            offlineDisabled && "opacity-30 cursor-not-allowed"
                          )}
                        >
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="text-2xl p-2 rounded-xl bg-card border border-border/60 shadow-2xs group-hover:scale-105 transition-transform duration-200">{stage.badge}</span>
                              <div className="flex items-center gap-1.5">
                                {isStageCached && (
                                  <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-600 font-bold px-1.5 py-0.5 rounded-full">
                                    📶 Cached
                                  </span>
                                )}
                                {isCompleted ? (
                                  <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                    Completed
                                  </span>
                                ) : isActive ? (
                                  <span className="text-[9px] bg-primary/10 border border-primary/20 text-primary font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                    Active
                                  </span>
                                ) : (
                                  <span className="text-[9px] bg-muted border border-border text-muted-foreground font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                    Available
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-xs font-black uppercase tracking-tight">{stage.title}</h3>
                              <p className="text-[10px] text-muted-foreground mt-0.5 font-bold leading-normal">{stage.documentName}</p>
                              <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{stage.description}</p>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{stage.status}</span>
                            {!offlineDisabled && (
                              <button
                                onClick={(e) => handleToggleCache(stage.id, e)}
                                className={cn(
                                  "p-1.5 rounded-lg border hover:bg-muted transition-colors",
                                  isStageCached ? "border-blue-500/20 text-blue-600 bg-blue-500/5" : "border-border text-muted-foreground"
                                )}
                                title="Cache Stage Offline"
                              >
                                <DownloadCloud className="size-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab: Alerts */}
              {activeTab === "alerts" && (
                <div className="max-w-3xl mx-auto h-full flex flex-col overflow-hidden">
                  {showAlertDrawer ? (
                    <div className="flex-1 overflow-hidden h-full">
                      <ParticipationAlertsDrawer
                        profile={profile}
                        onClose={() => {
                          setShowAlertDrawer(false);
                          const stored = localStorage.getItem("bns_user_profile");
                          if (stored) setProfile(JSON.parse(stored));
                        }}
                        onUpdateProfile={handleUpdateProfile}
                      />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <h2 className="text-xl font-black uppercase tracking-tight">{text.alertsTitle}</h2>
                        <p className="text-xs text-muted-foreground">{text.alertsSubtitle}</p>
                      </div>

                      {/* Active Alert Card */}
                      <div className="p-6 border border-border bg-card rounded-2xl space-y-4 shadow-sm">
                        <div className="flex justify-between items-start border-b border-border pb-3">
                          <div>
                            <h3 className="text-sm font-black text-foreground">CFSP Comment Window Open</h3>
                            <p className="text-[10px] text-muted-foreground mt-0.5 font-bold">{profile.county} County Assembly</p>
                          </div>
                          <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Comment Open
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                          🚨 The **County Fiscal Strategy Paper (CFSP) 2026/27** is officially open for comments. Act now to submit observation comments directly to the assembly.
                        </p>

                        <div className="pt-2">
                          <Button
                            onClick={() => setShowAlertDrawer(true)}
                            className="rounded-xl font-bold h-11 text-xs gap-1.5"
                          >
                            Draft Budget Memorandum <ArrowRight className="size-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Logged Submissions */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Logged Submissions</h3>
                        {profile.participationLogs?.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4">
                            {profile.participationLogs.map((log: any, idx: number) => (
                              <div key={idx} className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs shadow-xs">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-bold text-foreground truncate max-w-[180px]">{log.documentName}</h4>
                                  <span className="text-[9px] bg-primary/10 border border-primary/20 text-primary font-bold px-2 py-0.5 rounded-full uppercase">
                                    {log.method}
                                  </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground font-semibold">Submitted: {new Date(log.dateSubmitted).toLocaleString()}</p>
                                <div className="bg-muted/30 p-3 rounded-lg border border-border/50 font-mono text-[9px] leading-relaxed whitespace-pre-wrap truncate max-h-24">
                                  {log.draftText}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground text-center py-8 border border-dashed border-border rounded-xl">
                            No commentaries submitted yet. Tap the alert card above to draft one!
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Profile */}
              {activeTab === "profile" && (
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="space-y-1">
                    <h2 className="text-xl font-black uppercase tracking-tight">{text.profileTitle}</h2>
                    <p className="text-xs text-muted-foreground">{text.profileSubtitle}</p>
                  </div>

                  {/* Profile Details Card */}
                  <div className="p-6 border border-border bg-card rounded-2xl space-y-4 shadow-sm flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <BitmojiAvatar gender={profile.gender} size="lg" className="border border-primary/20 shadow-xs rounded-full" />
                      <div>
                        <h3 className="text-base font-black text-foreground">{profile.breakName}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 font-bold">{profile.county} · Lvl {Math.floor(profile.sovereigns / 100) + 1}</p>
                      </div>
                    </div>
                    <Button onClick={handleResetProgress} variant="outline" className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5 font-bold text-xs h-10 px-4">
                      Reset All Progress
                    </Button>
                  </div>
                  
                  {/* Account Information */}
                  <div className="p-6 border border-border bg-card rounded-2xl space-y-4 shadow-sm">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Account Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground font-semibold">County:</span>
                        <p className="font-bold text-foreground mt-0.5">{profile.county}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-semibold">Ward:</span>
                        <p className="font-bold text-foreground mt-0.5">{profile.ward || "Not Specified"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-semibold">Language:</span>
                        <p className="font-bold text-foreground mt-0.5">{profile.language === 'SW' ? 'Kiswahili' : profile.language === 'SH' ? 'Sheng' : 'English'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground font-semibold">Phone:</span>
                        <p className="font-bold text-foreground mt-0.5">{profile.phone || "Not Linked"}</p>
                      </div>
                    </div>
                    <div className="border-t border-border pt-3 text-[9px] text-muted-foreground flex items-center gap-1.5 justify-center">
                      <ShieldCheck className="size-4 text-emerald-600" />
                      <span>{text.consentText} ({new Date(profile.consentTimestamp).toLocaleDateString()})</span>
                    </div>
                  </div>

                  {/* Unlocked Badges */}
                  <div className="p-6 border border-border bg-card rounded-2xl space-y-4 shadow-sm">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Unlocked Badges ({profile.badges?.length || 0}/8)</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {STAGES_DATA.map((stage) => {
                        const unlocked = profile.badges?.includes(stage.badge);
                        return (
                          <div
                            key={stage.id}
                            className={`p-2.5 rounded-xl border text-center space-y-1 shadow-xs ${unlocked ? 'bg-primary/5 border-primary/20' : 'bg-muted/10 border-border opacity-40'}`}
                          >
                            <div className="text-xl flex justify-center">{stage.badge}</div>
                            <p className="text-[9px] font-bold truncate">{stage.badgeName}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Global Settings & Language Selector */}
                  <div className="p-6 border border-border bg-card rounded-2xl space-y-4 shadow-sm">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{text.settingsTitle}</h3>
                    <div className="space-y-4">
                      {/* Language Selection */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                          <Globe className="size-4" />
                          <span>{text.language}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 bg-muted p-1 rounded-xl text-xs">
                          <button
                            onClick={() => handleUpdateProfile({ ...profile, language: "EN" })}
                            className={`py-1.5 font-bold rounded-lg ${profile.language === "EN" ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'}`}
                          >
                            English
                          </button>
                          <button
                            onClick={() => handleUpdateProfile({ ...profile, language: "SW" })}
                            className={`py-1.5 font-bold rounded-lg ${profile.language === "SW" ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'}`}
                          >
                            Kiswahili
                          </button>
                          <button
                            onClick={() => handleUpdateProfile({ ...profile, language: "SH" })}
                            className={`py-1.5 font-bold rounded-lg ${profile.language === "SH" ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'}`}
                          >
                            Sheng
                          </button>
                        </div>
                      </div>

                      {/* Notifications Toggle */}
                      <div className="flex items-center justify-between text-xs border-t border-border pt-3">
                        <div>
                          <h4 className="font-bold">Push Notifications</h4>
                          <p className="text-[10px] text-muted-foreground">Receive open comment alerts.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={profile.notifications}
                          onChange={(e) => handleUpdateProfile({ ...profile, notifications: e.target.checked })}
                          className="size-4"
                        />
                      </div>

                      {/* WhatsApp Fallback Toggle */}
                      <div className="flex items-center justify-between text-xs border-t border-border pt-3">
                        <div>
                          <h4 className="font-bold">SMS / WhatsApp alerts fallback</h4>
                          <p className="text-[10px] text-muted-foreground">Alert fallback if push notifications fail.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={profile.whatsappFallback}
                          onChange={(e) => handleUpdateProfile({ ...profile, whatsappFallback: e.target.checked })}
                          className="size-4"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Right: Persistent Stats Panel */}
            <aside className="w-80 border-l border-border bg-card/25 p-6 flex flex-col gap-6 overflow-y-auto select-none">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Good Morning</p>
                <h3 className="text-base font-black text-foreground flex items-center gap-2 mt-0.5">
                  <BitmojiAvatar gender={profile.gender} size="sm" />
                  {profile.breakName} 🔥
                </h3>
              </div>

              {/* Donut progress ring */}
              <div className="flex flex-col items-center justify-center p-4 border border-border bg-card/40 rounded-2xl gap-3">
                <div className="relative size-28 flex items-center justify-center">
                  <svg className="size-full -rotate-90">
                    <circle cx="56" cy="56" r="46" className="stroke-muted fill-none" strokeWidth="6" />
                    <circle cx="56" cy="56" r="46" className="stroke-primary fill-none transition-all duration-500" strokeWidth="6"
                      strokeDasharray="289"
                      strokeDashoffset={289 - (289 * (profile.badges?.length || 0)) / 8}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-black leading-none">{Math.round(((profile.badges?.length || 0) / 8) * 100)}%</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase mt-0.5 tracking-wider">Progress</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium text-center">Master all 8 stages to unlock your Citizen Certificate.</p>
              </div>

              {/* Stats Counters Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-orange-500/8 border border-orange-500/15 rounded-xl text-center">
                  <Flame className="size-5 fill-orange-500 text-orange-500 mx-auto" />
                  <span className="block text-sm font-black text-orange-600 mt-1">{profile.streakDays} Days</span>
                  <span className="text-[8px] font-black text-orange-500/80 uppercase tracking-wider mt-0.5">Streak</span>
                </div>
                <div className="p-3 bg-primary/8 border border-primary/15 rounded-xl text-center">
                  <Sparkles className="size-5 fill-primary text-primary mx-auto" />
                  <span className="block text-sm font-black text-primary mt-1">{profile.sovereigns} SVG</span>
                  <span className="text-[8px] font-black text-primary/80 uppercase tracking-wider mt-0.5">Sovereigns</span>
                </div>
              </div>

              {/* Badges Box */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Unlocked Badges ({profile.badges?.length || 0})</h4>
                {profile.badges?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map((b: string, i: number) => (
                      <span key={i} className="text-xl p-2 rounded-xl bg-card border border-border shadow-2xs" title={b}>{b}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-muted-foreground italic bg-muted/20 p-3 rounded-lg text-center border border-border/50">No badges unlocked yet. Start learning to earn badges!</p>
                )}
              </div>
            </aside>
          </div>
        )}
      </div>

    </div>
  );
}
