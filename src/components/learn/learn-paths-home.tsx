"use client";

import React, { useEffect, useState } from "react";
import { OnboardingWizard } from "./onboarding-wizard";
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
  Home, HelpCircle, ChevronRight, Layers, Globe
} from "lucide-react";
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

// 8 Stages Spec with Real YouTube Video IDs and 4 Chapters
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
    chapters: [
      { title: "Public Finance Principles", content: "The Kenyan Constitution sets the foundational framework for public finance under Chapter Twelve. Article 201 details that there shall be openness, accountability, and public participation in financial matters. It requires that the public finance system promote an equitable society where the burden of taxation is shared fairly." },
      { title: "Why it matters to [Selected County]", content: "In [Selected County], constitutional guidelines protect citizens from arbitrary tax increases and guarantee that the county assembly must invite residents to submit views on how resources are shared." },
      { title: "Your participation window", content: "Public participation is mandated throughout the budget cycle. The main window opens during annual planning hearings in county sub-locations and wards." },
      { title: "Key Citations", content: "Article 201 (principles of public finance), Article 228 (Controller of Budget), Article 35 (access to information)." }
    ],
    videos: [
      { title: "Stage 1: Constitution — Part 1: Your 5 Budget Rights", duration: "2:30", parts: 1, youtubeId: "A_EXLueEMlk", transcript: "Hello citizens, welcome to Budget Ndio Story.\nToday we are looking at Chapter Twelve of the Kenyan Constitution.\nArticle 201 dictates that public finance shall be open and accountable.\nThis means you have the right to ask how county money is used.\nKeep watching to learn how to enforce your civic rights." },
      { title: "Stage 1: Constitution — Part 2: Public Finance Mandates", duration: "3:12", parts: 2, youtubeId: "jLZe3iPSMfc", transcript: "In part 2, we dive deeper into Article 221.\nThis article details the national budget estimates process.\nThe National Treasury must submit estimates to Parliament by 30th April.\nCitizens have a right to review this and make representations." }
    ],
    questions: [
      { question: "Which article of the Kenyan Constitution details the principles of public finance?", options: ["Article 201", "Article 217", "Article 221", "Article 35"], answer: 0 },
      { question: "Article 35 of the Constitution guarantees citizens the right to what?", options: ["Access to information", "Free health care", "Equal wages", "Free primary education"], answer: 0 },
      { question: "Who oversees the implementation of the national and county budgets?", options: ["Controller of Budget", "Central Bank Governor", "Senator", "County Governor"], answer: 0 }
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
    chapters: [
      { title: "Strategic Priorities", content: "The BPS outlines the broad strategic priorities and policy goals that guide the national budget for the upcoming fiscal year. Prepared by the National Treasury, it establishes spending ceilings for different sectors." },
      { title: "Why it matters to [Selected County]", content: "BPS decisions directly impact the amount of money allocated to [Selected County] through the equitable share and conditional grants." },
      { title: "Your participation window", content: "Parliament must seek views from the public within 14 days of the BPS being tabled, usually in February." },
      { title: "Key Citations", content: "PFM Act Section 25 (Budget Policy Statement tabling and content guidelines)." }
    ],
    videos: [
      { title: "Stage 2: BPS — Part 1: What is the BPS?", duration: "2:15", parts: 1, youtubeId: "KeNCrx6krl0", transcript: "Today we talk about the Budget Policy Statement or BPS.\nThe National Treasury prepares the BPS to set spending ceilings.\nThese ceilings dictate how much each ministry gets.\nIf health is a priority, it is shown in the BPS sector ceilings." },
      { title: "Stage 2: BPS — Part 2: Analyzing Expenditure Ceilings", duration: "3:45", parts: 2, youtubeId: "SfPwtqUFyj4", transcript: "The BPS also lays out the macro-fiscal framework.\nIt evaluates inflation, tax projections, and borrowing limits.\nCitizens must inspect whether allocations match national development goals." }
    ],
    questions: [
      { question: "When is the BPS usually tabled in Parliament?", options: ["By 15th February", "By 30th April", "By 30th June", "By 1st January"], answer: 0 },
      { question: "What is the main purpose of the Budget Policy Statement?", options: ["To set overall ceiling and expenditure priorities", "To collect taxes", "To auditing county expenditures", "To allocate funds directly to wards"], answer: 0 },
      { question: "Who prepares the Budget Policy Statement?", options: ["National Treasury", "Controller of Budget", "Senate Committee", "Governor Council"], answer: 0 }
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
    chapters: [
      { title: "National vs County Division", content: "The Division of Revenue Bill divides revenue raised nationally between the national government and county governments. This is key to fiscal decentralization." },
      { title: "Why it matters to [Selected County]", content: "Sets the baseline funding for [Selected County]'s public services. If county allocations drop, local services face cuts." },
      { title: "Your participation window", content: "Senate and National Assembly committee hearings take place in March." },
      { title: "Key Citations", content: "Article 217 (Division of revenue allocation criteria), PFM Act Section 191." }
    ],
    videos: [
      { title: "Stage 3: DoRB — Part 1: Dividing the Budget Cake", duration: "3:00", parts: 1, youtubeId: "Ed9lP0-komE", transcript: "Let us learn about the Division of Revenue Bill.\nThis bill divides the national revenue between national and county governments.\nBy law, counties must get at least 15% of national audited revenues.\nOften they get more, but disputes constantly happen." },
      { title: "Stage 3: DoRB — Part 2: Equitable Share Guidelines", duration: "4:00", parts: 2, youtubeId: "A_EXLueEMlk", transcript: "We must distinguish between Equitable Share and Conditional Grants.\nEquitable share has no strings attached, counties spend on local priorities.\nConditional grants must be spent on specific projects, like referral hospitals." }
    ],
    questions: [
      { question: "The Division of Revenue Bill divides revenue between which two levels of government?", options: ["National and County Governments", "Judiciary and Executive", "Senate and National Assembly", "County and Ward"], answer: 0 },
      { question: "Which house of Parliament resolves county allocation disputes?", options: ["Senate", "National Assembly", "County Assemblies", "Supreme Court"], answer: 0 },
      { question: "What is the minimum constitutional percentage of national revenue allocated to counties?", options: ["15%", "5%", "30%", "50%"], answer: 0 }
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
    chapters: [
      { title: "County Sector Ceilings", content: "The county equivalent of the BPS, setting sector expenditure ceilings for county ministries such as health, agriculture, and infrastructure." },
      { title: "Why it matters to [Selected County]", content: "Determines if agriculture, health, or roads gets more funding in [Selected County] for the upcoming fiscal year." },
      { title: "Your participation window", content: "County Assembly comments open in late February or early March." },
      { title: "Key Citations", content: "PFM Act Section 117 (County Fiscal Strategy Paper submission and ceilings guidelines)." }
    ],
    videos: [
      { title: "Stage 4: CFSP — Part 1: Sector Ceilings Explained", duration: "2:45", parts: 1, youtubeId: "jLZe3iPSMfc", transcript: "Welcome to County Fiscal Strategy Paper tutorial.\nThe CFSP aligns county priorities with BPS macro ceilings.\nEach department gets an expenditure limit.\nMCAs must approve these ceilings before detailed ministries budget drafts." },
      { title: "Stage 4: CFSP — Part 2: Citizen Input on CFSP", duration: "3:30", parts: 2, youtubeId: "KeNCrx6krl0", transcript: "Public participation on CFSP is crucial.\nIt is the moment to object if administrative overheads are too high.\nYour county must publicize hearings at least 7 days in advance." }
    ],
    questions: [
      { question: "When should the CFSP be submitted to the County Assembly?", options: ["By 28th February", "By 30th April", "By 15th June", "By 1st January"], answer: 0 },
      { question: "Who prepares the County Fiscal Strategy Paper?", options: ["County Treasury", "Governor", "MCA representative", "Controller of Budget"], answer: 0 },
      { question: "The CFSP aligns county budgets with which national document?", options: ["Budget Policy Statement", "County Integrated Plan", "Appropriations Bill", "Revenue Allocation Act"], answer: 0 }
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
    chapters: [
      { title: "Master Planning vs Annual Slices", content: "The County Integrated Development Plan (CIDP) is a 5-year master plan. The Annual Development Plan (ADP) is the annual implementation slice." },
      { title: "Why it matters to [Selected County]", content: "Projects like dams, markets, or hospitals in [Selected County] must be in the CIDP to receive funding." },
      { title: "Your participation window", content: "Consultations take place in August/September every year at the ward level." },
      { title: "Key Citations", content: "County Governments Act Section 108 (County Integrated Development Plan), PFM Act Section 104." }
    ],
    videos: [
      { title: "Stage 5: CIDP — Part 1: Five-Year Development Goals", duration: "3:15", parts: 1, youtubeId: "SfPwtqUFyj4", transcript: "Today we analyze the County Integrated Development Plan or CIDP.\nCIDPs last for five years and represent the governor's manifesto.\nIf a local school needs building, it must be captured in the CIDP first.\nWithout it, subsequent annual budgets cannot legalise allocations." },
      { title: "Stage 5: CIDP — Part 2: Annual Development Plans", duration: "2:50", parts: 2, youtubeId: "Ed9lP0-komE", transcript: "Annual Development Plans act as the yearly implementation check.\nEach ADP is pulled from the 5-year CIDP.\nIt specifies which projects are scheduled for execution this specific year." }
    ],
    questions: [
      { question: "How many years does a County Integrated Development Plan (CIDP) cover?", options: ["5 years", "1 year", "10 years", "3 years"], answer: 0 },
      { question: "When is the ADP submitted to the County Assembly?", options: ["By 1st September", "By 30th June", "By 31st December", "By 15th February"], answer: 0 },
      { question: "True or False: A project can receive county funding even if it is not in the CIDP.", options: ["False", "True"], answer: 0 }
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
    chapters: [
      { title: "Spending Authorization", content: "The legal act passed by the County Assembly authorizing the county executive to spend public funds from the County Revenue Fund." },
      { title: "Why it matters to [Selected County]", content: "Legally locks in the budget allocations for [Selected County] projects and ministries." },
      { title: "Your participation window", content: "County Assembly committee budget hearings take place in June." },
      { title: "Key Citations", content: "Article 224 (county appropriation bills), PFM Act Section 129." }
    ],
    videos: [
      { title: "Stage 6: Appropriation — Part 1: Legalizing the Budget", duration: "2:00", parts: 1, youtubeId: "A_EXLueEMlk", transcript: "Now we explore the County Appropriation Act.\nEven after MCAs review the budget, spending cannot start without this law.\nIt gives county ministries the legal power to withdraw funds.\nWithout it, county operations shut down on 1st July." },
      { title: "Stage 6: Appropriation — Part 2: Supplementary Budgets", duration: "3:10", parts: 2, youtubeId: "jLZe3iPSMfc", transcript: "Supplementary budgets are introduced if emergency funds are needed.\nThey adjust allocations up to 10% without assembly approvals initially.\nWatchdog citizens must track if supplementals bypass priority sectors." }
    ],
    questions: [
      { question: "What does the County Appropriation Act authorize?", options: ["Spending of public funds from the County Revenue Fund", "Introduction of new local taxes", "Appointment of county ministers", "Borrowing from international banks"], answer: 0 },
      { question: "Who must assent to the County Appropriation Bill to make it law?", options: ["County Governor", "Speaker of Senate", "County Commissioner", "MCA Chairman"], answer: 0 },
      { question: "What bill is introduced if a county needs to adjust expenditures mid-year?", options: ["Supplementary Appropriation Bill", "County Finance Bill", "Division of Revenue Bill", "Audit Correction Bill"], answer: 0 }
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
    chapters: [
      { title: "Expenditure Auditing", content: "Quarterly reports detailing how much budget the national and county governments actually withdrew and spent." },
      { title: "Why it matters to [Selected County]", content: "Exposes whether [Selected County] spent money on wages and administrative travel rather than development projects." },
      { title: "Your participation window", content: "Published quarterly, useful for citizens to lobby county MCAs on delayed local projects." },
      { title: "Key Citations", content: "Article 228(4) (Controller of Budget authorization mandates), Article 228(6) (quarterly implementation reporting)." }
    ],
    videos: [
      { title: "Stage 7: COB — Part 1: Tracking Expenditures", duration: "3:30", parts: 1, youtubeId: "KeNCrx6krl0", transcript: "Let us learn about Controller of Budget Reports.\nThe COB publishes quarterly implementation reports.\nThese documents trace actual spending against initial budgets.\nThey show if development money was diverted to administration." },
      { title: "Stage 7: COB — Part 2: Absorption Rates", duration: "4:00", parts: 2, youtubeId: "SfPwtqUFyj4", transcript: "Absorption rate evaluates county budget performance.\nIf health department spent only 10% of its allocation by Q3, absorption is poor.\nThis indicates execution delays that hurt service delivery." }
    ],
    questions: [
      { question: "How often does the Controller of Budget submit budget implementation reports?", options: ["Quarterly", "Annually", "Monthly", "Every two years"], answer: 0 },
      { question: "What is the main role of the Controller of Budget?", options: ["To oversee budget implementation and authorize withdrawals", "To collect county taxes", "To draft the Finance Bill", "To represent MCAs in court"], answer: 0 },
      { question: "What does a low absorption rate in development spending indicate?", options: ["County is slow in implementing development projects", "Tax collection is high", "Staff salaries are unpaid", "Auditing has failed"], answer: 0 }
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
    chapters: [
      { title: "Advocacy and Townhalls", content: "Practical guidelines, methods, and templates for citizens to structure comments and engage county officials during budget hearings." },
      { title: "Why it matters to [Selected County]", content: "Equips [Selected County] residents with the exact tools to submit written memoranda and lobby effectively." },
      { title: "Your participation window", content: "Ongoing throughout the planning cycle, especially vital during ward townhalls." },
      { title: "Key Citations", content: "Article 10 (national values including public participation), PFM Act Section 207 (public participation regulations)." }
    ],
    videos: [
      { title: "Stage 8: Toolkit — Part 1: Advocacy Guidelines", duration: "2:30", parts: 1, youtubeId: "Ed9lP0-komE", transcript: "Welcome to the Public Participation Toolkit.\nTo lobby effectively, you must write a budget memorandum.\nA memorandum states observation, legal basis, and requested action.\nThis format forces budget assemblies to capture inputs in reports." },
      { title: "Stage 8: Toolkit — Part 2: Mobilizing Communities", duration: "3:20", parts: 2, youtubeId: "A_EXLueEMlk", transcript: "Citizen mobilization at ward townhalls makes budget feedback impactful.\nEnsure you register attendance at county meetings.\nThe attendance sheet is a legal proof of consultation." }
    ],
    questions: [
      { question: "Under Article 201, public participation in financial matters is:", options: ["Mandatory", "Optional", "Only for urban areas", "Gated by registration fee"], answer: 0 },
      { question: "Which of these is a valid way for a citizen to submit feedback on a budget?", options: ["Written memorandum or attending town halls", "Submitting a secret letter", "Posting a complaint on personal blogs only", "Withholding local taxes"], answer: 0 },
      { question: "True or False: County assemblies are legally required to publish public notice of budget hearings.", options: ["True", "False"], answer: 0 }
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
        for (let j = 0; j < 4; j++) {
          localStorage.removeItem(`stage_${i}_video_${j}`);
          localStorage.removeItem(`stage_${i}_chapter_${j}`);
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

  // If user is not onboarded, render OnboardingWizard (Module 1)
  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-muted/20">
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col bg-background min-h-screen relative pb-20">
      
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
      <header className="p-4 border-b border-border bg-card flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
            {profile.breakName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-sm font-black text-foreground">{profile.breakName}</h1>
            <p className="text-[10px] text-muted-foreground">{profile.county} County · Level {Math.floor(profile.sovereigns / 100) + 1}</p>
          </div>
        </div>

        {/* Sovereigns points */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black flex items-center gap-1">
            <Sparkles className="size-3.5 fill-primary" />
            <span>{profile.sovereigns} SVG</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold" title={text.streak}>
            <Flame className="size-3.5 fill-orange-500" />
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
                      const isCompleted = profile.badges?.includes(selected.badge);
                      const isActive = profile.stageProgress?.includes(selected.id);
                      if (!isCompleted && !isActive) {
                        toast.error(`Stage ${selected.id} is locked. Complete previous stages first.`);
                        return;
                      }
                      setSelectedStage(selected);
                    }
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-card text-xs focus-visible:outline-none"
                >
                  <option value="">Select an unlocked stage...</option>
                  {STAGES_DATA.map((s) => {
                    const isCompleted = profile.badges?.includes(s.badge);
                    const isActive = profile.stageProgress?.includes(s.id);
                    const locked = !isCompleted && !isActive;
                    return (
                      <option key={s.id} value={s.id} disabled={locked}>
                        Stage {s.id}: {s.documentName} {locked ? "🔒" : ""}
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
                  const isLocked = !isActive && !isCompleted;
                  const isStageCached = cachedStages.includes(stage.id);
                  const offlineDisabled = isOffline && !isStageCached;

                  return (
                    <div
                      key={stage.id}
                      onClick={() => {
                        if (isLocked || offlineDisabled) return;
                        setSelectedStage(stage);
                      }}
                      className={`relative flex items-center justify-between p-4 rounded-xl border transition-all ${
                        isCompleted
                          ? "bg-primary/5 border-primary/20 hover:bg-primary/10 cursor-pointer"
                          : isActive
                          ? "bg-card border-foreground/35 hover:border-foreground cursor-pointer shadow-xs"
                          : "bg-muted/30 border-border opacity-60 cursor-not-allowed"
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
                            {isLocked && <span className="text-[10px]">🔒</span>}
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
                      {!isLocked && (
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
                        <p className="text-[10px] text-muted-foreground">Submitted: {new Date(log.dateSubmitted).toLocaleString()}</p>
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
                  <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-black">
                    {profile.breakName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{profile.breakName}</h3>
                    <p className="text-xs text-muted-foreground">{profile.pseudoName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs border-t border-border pt-4">
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
              <div className="space-y-2">
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

              {/* Global Settings & Language Toggle */}
              <div className="space-y-3.5">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{text.settingsTitle}</h3>
                
                <div className="border border-border rounded-2xl bg-card overflow-hidden divide-y divide-border shadow-xs text-xs">
                  {/* Language Selector */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground font-bold">
                      <Globe className="size-4" />
                      <span>{text.language}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 bg-muted p-1 rounded-xl">
                      <button
                        onClick={() => handleUpdateProfile({ ...profile, language: "EN" })}
                        className={`py-1.5 text-xs font-bold rounded-lg ${profile.language === "EN" ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'}`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => handleUpdateProfile({ ...profile, language: "SW" })}
                        className={`py-1.5 text-xs font-bold rounded-lg ${profile.language === "SW" ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'}`}
                      >
                        Kiswahili
                      </button>
                      <button
                        onClick={() => handleUpdateProfile({ ...profile, language: "SH" })}
                        className={`py-1.5 text-xs font-bold rounded-lg ${profile.language === "SH" ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'}`}
                      >
                        Sheng
                      </button>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="flex items-center justify-between p-4">
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

                  {/* WhatsApp Fallback */}
                  <div className="flex items-center justify-between p-4">
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

              {/* Reset Progress */}
              <div className="pt-2">
                <Button
                  onClick={handleResetProgress}
                  variant="destructive"
                  className="w-full rounded-xl h-11 font-bold text-xs"
                >
                  {text.resetBtn}
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Detail stage drawer wrapper with sequential stage transitions */}
      {selectedStage && (
        <StageDetailDrawer
          stage={selectedStage}
          profile={profile}
          onClose={() => {
            setSelectedStage(null);
            // Reload local profile state
            const stored = localStorage.getItem("bns_user_profile");
            if (stored) setProfile(JSON.parse(stored));
          }}
          onUpdateProfile={handleUpdateProfile}
          hasPrev={selectedStage.id > 1}
          hasNext={selectedStage.id < STAGES_DATA.length}
          onPrevStage={() => {
            const prev = STAGES_DATA.find(s => s.id === selectedStage.id - 1);
            if (prev) setSelectedStage(prev);
          }}
          onNextStage={() => {
            const next = STAGES_DATA.find(s => s.id === selectedStage.id + 1);
            if (next) setSelectedStage(next);
          }}
        />
      )}

      {/* Participation Alerts Drawer Modal */}
      {showAlertDrawer && (
        <ParticipationAlertsDrawer
          profile={profile}
          onClose={() => {
            setShowAlertDrawer(false);
            const stored = localStorage.getItem("bns_user_profile");
            if (stored) setProfile(JSON.parse(stored));
          }}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
}
