"use client";

import React, { useEffect, useState } from "react";
import { OnboardingWizard } from "./onboarding-wizard";
import { StageDetailDrawer } from "./stage-detail-drawer";
import { ParticipationAlertsDrawer } from "./participation-alerts-drawer";
import { Button } from "@/ui/button";
import { Progress } from "@/ui/progress";
import { toast } from "sonner";
import {
  Play, Flame, Trophy, User, Sparkles, BookOpen, AlertTriangle,
  ArrowRight, ShieldCheck, MapPin, Calendar, CheckCircle2,
  Bell, Volume2, Shield, Settings, Wifi, WifiOff, DownloadCloud, Copy, Send, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// The 8 Stages Spec
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
      { title: "Your participation window", content: "Public participation is mandated throughout the budget cycle. The main window opens during annual planning hearings in county sub-locations and wards." }
    ],
    videos: [
      { title: "Constitution Budget Intro", duration: "2:30", parts: 1 },
      { title: "Article 201 Deep Dive", duration: "3:15", parts: 2 }
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
      { title: "Your participation window", content: "Parliament must seek views from the public within 14 days of the BPS being tabled, usually in February." }
    ],
    videos: [
      { title: "What is the BPS?", duration: "2:15", parts: 1 },
      { title: "Analyzing Expenditure Ceilings", duration: "3:45", parts: 2 }
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
      { title: "Your participation window", content: "Senate and National Assembly committee hearings take place in March." }
    ],
    videos: [
      { title: "Dividing the Cake", duration: "3:00", parts: 1 },
      { title: "Conditional Grants vs Equitable Share", duration: "4:00", parts: 2 }
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
      { title: "Your participation window", content: "County Assembly comments open in late February or early March." }
    ],
    videos: [
      { title: "Sector Ceilings Explained", duration: "2:45", parts: 1 },
      { title: "Citizen Input on CFSP", duration: "3:30", parts: 2 }
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
      { title: "Your participation window", content: "Consultations take place in August/September every year at the ward level." }
    ],
    videos: [
      { title: "5-Year Planning (CIDP)", duration: "3:15", parts: 1 },
      { title: "Annual Development Plans (ADP)", duration: "2:50", parts: 2 }
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
      { title: "Your participation window", options: [], content: "County Assembly committee budget hearings take place in June." }
    ],
    videos: [
      { title: "Legalizing the Budget", duration: "2:00", parts: 1 },
      { title: "Supplementary Budgets", duration: "3:10", parts: 2 }
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
      { title: "Your participation window", content: "Published quarterly, useful for citizens to lobby county MCAs on delayed local projects." }
    ],
    videos: [
      { title: "Tracking Expenditures", duration: "3:30", parts: 1 },
      { title: "Identifying Absorption Rates", duration: "4:00", parts: 2 }
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
      { title: "Your participation window", content: "Ongoing throughout the planning cycle, especially vital during ward townhalls." }
    ],
    videos: [
      { title: "Advocacy Toolkit", duration: "2:30", parts: 1 },
      { title: "Mobilizing Communities", duration: "3:20", parts: 2 }
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
  const [activeTab, setActiveTab] = useState<"hub" | "leaderboard" | "profile" | "settings">("hub");

  // Selected Stage for Detail Modal
  const [selectedStage, setSelectedStage] = useState<any | null>(null);

  // Offline Simulation State
  const [isOffline, setIsOffline] = useState(false);
  const [cachedStages, setCachedStages] = useState<number[]>([]);

  // Participation Alert State
  const [showAlertDrawer, setShowAlertDrawer] = useState(false);

  // Load profile from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("bns_user_profile");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Simulate streak check on load
      const streakDays = checkStreak(parsed);
      const updated = { ...parsed, streakDays };
      setProfile(updated);
      localStorage.setItem("bns_user_profile", JSON.stringify(updated));
    }
    
    // Load cached stages
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
    
    // Normalize dates to midnight for comparison
    lastActiveDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    
    const diffTime = Math.abs(today.getTime() - lastActiveDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return userProfile.streakDays || 0;
    } else if (diffDays === 1) {
      // Active yesterday, increment streak!
      toast.success(`🔥 Streak Continued! You are on a ${userProfile.streakDays + 1} day streak.`);
      return (userProfile.streakDays || 0) + 1;
    } else {
      // Streak broken
      if (userProfile.streakDays > 0) {
        toast.error("😢 Oh no, your streak was broken. Start a new streak today!");
      }
      return 0;
    }
  };

  const handleOnboardingComplete = (newProfile: any) => {
    setProfile(newProfile);
    toast.success("Welcome aboard, Civic Champion! Onboarding complete.");
  };

  const handleUpdateProfile = (updated: any) => {
    setProfile(updated);
    localStorage.setItem("bns_user_profile", JSON.stringify(updated));
  };

  const handleToggleCache = (stageId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening details
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
    if (window.confirm("Are you sure you want to reset all progress? This will wipe your profile and statistics.")) {
      localStorage.removeItem("bns_user_profile");
      localStorage.removeItem("bns_cached_stages");
      // Clear all stage completions
      for (let i = 1; i <= 8; i++) {
        localStorage.removeItem(`stage_${i}_article`);
        localStorage.removeItem(`stage_${i}_quiz_attempts`);
        localStorage.removeItem(`stage_${i}_quiz_cooldown`);
        for (let j = 0; j < 3; j++) {
          localStorage.removeItem(`stage_${i}_video_${j}`);
          localStorage.removeItem(`stage_${i}_chapter_${j}`);
        }
      }
      setProfile(null);
      setCachedStages([]);
      setSelectedStage(null);
      setActiveTab("hub");
      toast.success("All progress and profiles reset.");
    }
  };

  // Mock Citizen Leaderboard
  const MOCK_LEADERBOARD = [
    { name: "BudgetBreaker_Nairobi", svg: 850, stages: 8, rank: 1 },
    { name: "SovereignSeeker_Mombasa", svg: 720, stages: 6, rank: 2 },
    { name: "GavanaWatch_Kisumu", svg: 640, stages: 5, rank: 3 },
    { name: profile?.pseudoName || "You", svg: profile?.sovereigns || 0, stages: profile?.badges?.length || 0, rank: 4, isUser: true },
    { name: "MCA_Whisperer_Nakuru", svg: 310, stages: 3, rank: 5 },
    { name: "CitizenZero_Kiambu", svg: 150, stages: 1, rank: 6 }
  ].sort((a, b) => b.svg - a.svg).map((item, idx) => ({ ...item, rank: idx + 1 }));

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

  // Main Dashboard
  return (
    <div className="w-full max-w-md mx-auto flex flex-col bg-background min-h-screen relative pb-20">
      
      {/* 📡 Offline Simulator Banner */}
      <div className={`w-full py-1.5 px-4 text-xs font-bold flex items-center justify-between border-b transition-colors ${isOffline ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'}`}>
        <div className="flex items-center gap-1.5">
          {isOffline ? (
            <>
              <WifiOff className="size-4 animate-pulse" />
              <span>Offline Mode (Kenya Reality Sim)</span>
            </>
          ) : (
            <>
              <Wifi className="size-4" />
              <span>Connected (Standard Mode)</span>
            </>
          )}
        </div>
        <button
          onClick={() => {
            setIsOffline(!isOffline);
            toast.info(`Switched to ${!isOffline ? "Offline Sim (Low-Connectivity)" : "Online Mode"}`);
          }}
          className="underline text-[10px] font-extrabold uppercase hover:text-foreground/80"
        >
          Toggle Sim
        </button>
      </div>

      {/* Profile summary banner in Hub */}
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

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold">
            <Flame className="size-3.5 fill-orange-500" />
            <span>{profile.streakDays}d</span>
          </div>
        </div>
      </header>

      {/* Main Tab Controller */}
      <div className="flex-1 p-4">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: ROADMAP (HUB) */}
          {activeTab === "hub" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Participation Alert Callout if county CFSP is open */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-extrabold uppercase text-primary">
                    <Bell className="size-3" /> Participation Alert
                  </div>
                  <h3 className="text-xs font-bold">Budget memorandum open for {profile.county}!</h3>
                  <p className="text-[11px] text-muted-foreground">Draft and submit feedback on the CFSP document to represent your community.</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowAlertDrawer(true)}
                  className="rounded-xl font-bold shrink-0 text-xs"
                >
                  Action <ArrowRight className="size-3.5" />
                </Button>
              </div>

              {/* Roadmap Header */}
              <div className="space-y-1">
                <h2 className="text-lg font-black uppercase tracking-tight">8-Stage Civic Track</h2>
                <p className="text-xs text-muted-foreground">Progress through the key documents that form Kenya's budget cycle. Master trivia to earn badges.</p>
              </div>

              {/* Vertical Roadmap Stages */}
              <div className="space-y-3 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-border">
                {STAGES_DATA.map((stage) => {
                  const isCompleted = profile.badges?.includes(stage.badge);
                  const isActive = profile.stageProgress?.includes(stage.id);
                  const isLocked = !isActive && !isCompleted;
                  const isCached = cachedStages.includes(stage.id);

                  // If offline and NOT cached, it behaves as locked / disabled
                  const offlineDisabled = isOffline && !isCached;

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
                          ? "bg-card border-foreground/30 hover:border-foreground cursor-pointer shadow-xs"
                          : "bg-muted/30 border-border opacity-60 cursor-not-allowed"
                      } ${offlineDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Circle timeline index / Badge */}
                        <div className={`size-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border z-10 ${
                          isCompleted
                            ? "bg-primary border-primary text-primary-foreground"
                            : isActive
                            ? "bg-card border-foreground text-foreground"
                            : "bg-muted border-border text-muted-foreground"
                        }`}>
                          {isCompleted ? stage.badge : stage.id}
                        </div>

                        <div>
                          <h3 className="text-xs font-black uppercase tracking-tight">{stage.title}</h3>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[150px] sm:max-w-xs">{stage.documentName}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${stage.status === 'Comment Open' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-muted border-border text-muted-foreground'}`}>
                              {stage.status}
                            </span>
                            {isCached && (
                              <span className="text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <DownloadCloud className="size-2.5" /> Cached
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Cache button for offline sim */}
                      {!isLocked && (
                        <button
                          onClick={(e) => handleToggleCache(stage.id, e)}
                          className={`p-2 rounded-lg border hover:bg-muted shrink-0 ${isCached ? 'border-blue-500/20 text-blue-600 bg-blue-500/5' : 'border-border text-muted-foreground'}`}
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

          {/* TAB 2: LEADERBOARD */}
          {activeTab === "leaderboard" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-black uppercase tracking-tight">Citizen Assembly</h2>
                <p className="text-xs text-muted-foreground">National leaderboard representing budget storytellers ranked by Sovereigns (SVG).</p>
              </div>

              <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
                <div className="divide-y divide-border">
                  {MOCK_LEADERBOARD.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-4 ${item.isUser ? 'bg-primary/10 border-y border-primary/20' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Rank */}
                        <div className={`size-6 rounded-full font-bold text-xs flex items-center justify-center ${
                          idx === 0
                            ? "bg-yellow-500/20 text-yellow-600"
                            : idx === 1
                            ? "bg-slate-500/20 text-slate-600"
                            : idx === 2
                            ? "bg-amber-700/20 text-amber-700"
                            : "text-muted-foreground"
                        }`}>
                          {item.rank}
                        </div>

                        <div>
                          <h4 className="text-xs font-bold">{item.name}</h4>
                          <p className="text-[9px] text-muted-foreground mt-0.5">{item.stages} Stages Mastered</p>
                        </div>
                      </div>

                      <span className="text-xs font-black text-primary">{item.svg} SVG</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: CITIZEN PROFILE */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-black uppercase tracking-tight">Citizen Profile</h2>
                <p className="text-xs text-muted-foreground">Manage your credentials, unlocked badges, and participation history.</p>
              </div>

              {/* Profile Card */}
              <div className="p-5 rounded-xl border border-border bg-card space-y-4 shadow-xs">
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
                    <span className="text-muted-foreground font-semibold">Phone (OTP):</span>
                    <p className="font-bold text-foreground mt-0.5">{profile.phone || "Not Linked"}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 text-[10px] text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5"><Shield className="size-3 text-primary" /> DPA 2019 Consent Granted</div>
                  <div>Consent Timestamp: {new Date(profile.consentTimestamp).toLocaleString()}</div>
                </div>
              </div>

              {/* Badges Earned */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Unlocked Badges ({profile.badges?.length || 0}/8)</h3>
                {profile.badges?.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {STAGES_DATA.map((stage) => {
                      const unlocked = profile.badges?.includes(stage.badge);
                      return (
                        <div
                          key={stage.id}
                          className={`p-3 rounded-lg border text-center space-y-1 shadow-xs ${unlocked ? 'bg-primary/5 border-primary/20' : 'bg-muted/10 border-border opacity-40'}`}
                        >
                          <div className="text-2xl">{stage.badge}</div>
                          <p className="text-[9px] font-bold truncate">{stage.badgeName}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Complete Trivia Gates to unlock badges.</p>
                )}
              </div>

              {/* Participation History */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Participation History</h3>
                {profile.participationLogs?.length > 0 ? (
                  <div className="space-y-2.5">
                    {profile.participationLogs.map((log: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-xl border border-border bg-card space-y-2 text-xs">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-foreground">{log.documentName}</h4>
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
                  <p className="text-xs text-muted-foreground">No public budget commentaries submitted yet.</p>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-lg font-black uppercase tracking-tight">Settings</h2>
                <p className="text-xs text-muted-foreground">Configure profile alerts, languages, and clean local progress logs.</p>
              </div>

              <div className="border border-border rounded-xl bg-card overflow-hidden divide-y divide-border shadow-xs text-xs">
                <div className="flex items-center justify-between p-4">
                  <div className="space-y-0.5">
                    <h4 className="font-bold">Push Notifications</h4>
                    <p className="text-muted-foreground text-[10px]">Alert on budget document upload updates.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.notifications}
                    onChange={(e) => handleUpdateProfile({ ...profile, notifications: e.target.checked })}
                    className="size-4"
                  />
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="space-y-0.5">
                    <h4 className="font-bold">WhatsApp alerts fallback</h4>
                    <p className="text-muted-foreground text-[10px]">Alert forward if push notifications fail.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.whatsappFallback}
                    onChange={(e) => handleUpdateProfile({ ...profile, whatsappFallback: e.target.checked })}
                    className="size-4"
                  />
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-bold">App Language</h4>
                  <div className="grid grid-cols-3 gap-2 bg-muted p-1 rounded-lg">
                    <button
                      onClick={() => handleUpdateProfile({ ...profile, language: "EN" })}
                      className={`py-1.5 text-xs font-bold rounded-md ${profile.language === "EN" ? 'bg-background text-foreground' : 'text-muted-foreground'}`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleUpdateProfile({ ...profile, language: "SW" })}
                      className={`py-1.5 text-xs font-bold rounded-md ${profile.language === "SW" ? 'bg-background text-foreground' : 'text-muted-foreground'}`}
                    >
                      Kiswahili
                    </button>
                    <button
                      onClick={() => handleUpdateProfile({ ...profile, language: "SH" })}
                      className={`py-1.5 text-xs font-bold rounded-md ${profile.language === "SH" ? 'bg-background text-foreground' : 'text-muted-foreground'}`}
                    >
                      Sheng
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  onClick={handleResetProgress}
                  variant="destructive"
                  className="w-full rounded-xl h-11 font-bold"
                >
                  Reset Profile & Wipes Progress
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* 📱 Mobile Fixed Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 h-16 border-t border-border bg-card z-30 flex items-center justify-around px-2 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab("hub")}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 ${activeTab === "hub" ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <BookOpen className="size-5" />
          <span className="text-[10px] font-bold mt-1">Hub</span>
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 ${activeTab === "leaderboard" ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Trophy className="size-5" />
          <span className="text-[10px] font-bold mt-1">Assembly</span>
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 ${activeTab === "profile" ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <User className="size-5" />
          <span className="text-[10px] font-bold mt-1">Profile</span>
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 ${activeTab === "settings" ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Settings className="size-5" />
          <span className="text-[10px] font-bold mt-1">Settings</span>
        </button>
      </nav>

      {/* 8-Stage Detail Drawer Modal */}
      {selectedStage && (
        <StageDetailDrawer
          stage={selectedStage}
          profile={profile}
          onClose={() => {
            setSelectedStage(null);
            // Refresh local state profile
            const stored = localStorage.getItem("bns_user_profile");
            if (stored) setProfile(JSON.parse(stored));
          }}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* Participation Alerts Drawer Modal */}
      {showAlertDrawer && (
        <ParticipationAlertsDrawer
          profile={profile}
          onClose={() => {
            setShowAlertDrawer(false);
            // Refresh local state profile
            const stored = localStorage.getItem("bns_user_profile");
            if (stored) setProfile(JSON.parse(stored));
          }}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
    </div>
  );
}
