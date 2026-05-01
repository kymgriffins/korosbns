"use client";

import { cn } from "@/utils";
import Image from "next/image";
import {
    ArrowRight,
    BarChart3,
    BookOpen,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    Folder,
    HelpCircle,
    Mail,
    RefreshCcw,
    Send,
    Target,
  Trophy,
    X,
    XCircle,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Balancer from "react-wrap-balancer";
import { toast } from "sonner";
import Container from "../global/container";
import { deepDiveCards } from "@/lib/learn-deep-dives";
import Wrapper from "../global/wrapper";
import { Button } from "../ui/button";

import { API_BASE_URL } from "@/lib/api-config";


const faqItems = [
  {
    q: "What is the Budget Policy Statement (BPS)?",
    a: "The BPS is a yearly government document that sets out Kenya's spending priorities. It's like a preview of the national budget - showing where money will come from and where it'll go.",
  },
  {
    q: "When is the BPS released?",
    a: "By law (PFM Act), the BPS must be submitted to Parliament by February 15th every year. The final budget comes later on April 30th.",
  },
  {
    q: "What's the difference between BPS and the national budget?",
    a: "Think of BPS as the blueprint or trailer, and the national budget as the full movie. BPS sets the priorities and direction, while the budget is the actual detailed spending plan.",
  },
  {
    q: "What is BETA?",
    a: "BETA = Bottom-Up Economic Transformation Agenda. It's Kenya's plan to grow the economy by focusing on agriculture, small businesses, healthcare, housing, and digital transformation.",
  },
  {
    q: "Why does Kenya borrow so much?",
    a: "Kenya spends more than it collects in taxes (fiscal deficit). The gap is filled through borrowing - both from foreign sources and domestic (like treasury bonds). This helps fund development but also increases debt costs.",
  },
  {
    q: "How much goes to county governments?",
    a: "In 2026/27, counties get KES 420 billion through the equitable share. This funds local services like roads, health, water, and markets in all 47 counties.",
  },
  {
    q: "What are the main fiscal risks?",
    a: "The BPS warns about: rising debt payments, state corporations needing bailouts, economic slowdowns, climate change (droughts/floods), and increased county demands.",
  },
];

const moduleInfo = {
  module: "Module 002",
  title: "Reflecting on Kenya's 2026 Budget Policy Statement (BPS)",
  credits: "Millicent Makini",
};

const hubStories = [
  {
    id: "lets-decode",
    title: "Let's Decode",
    subtitle: "Bold social-style explainers with punchy hooks",
    duration: "2m 30s",
    gradient: "from-fuchsia-600 via-violet-600 to-indigo-600",
    icon: "🔥",
    action: "Play Story",
  },
  {
    id: "citizen-street",
    title: "Citizen Street",
    subtitle: "Real-life day-to-day budget impact story",
    duration: "2m 10s",
    gradient: "from-amber-500 via-orange-500 to-rose-500",
    icon: "🏙️",
    action: "Open",
  },
  {
    id: "future-lab",
    title: "Future Lab",
    subtitle: "Neon data-cards, goals, and risk radar",
    duration: "2m 00s",
    gradient: "from-blue-600 via-sky-500 to-cyan-500",
    icon: "🧪",
    action: "Explore",
  },
  {
    id: "civic-compass-v2",
    title: "Civic Compass V2",
    subtitle: "7-page motion story on wise constitutional leadership",
    duration: "2m 20s",
    gradient: "from-blue-700 via-indigo-700 to-slate-900",
    icon: "🗳️",
    action: "Start V2",
  },
  {
    id: "budget-trivia",
    title: "Trivia Time",
    subtitle: "Test your history on Kenya's Cabinet Secretaries & Budgets",
    duration: "1m 30s",
    gradient: "from-green-600 via-emerald-600 to-teal-700",
    icon: "🎭",
    action: "Play Trivia",
  },
];

const hubArticles = [
  {
    id: "guide-2026",
    title: "Beginner Guide: Understanding BPS 2026",
    readTime: "7 min read",
    snippet: "A plain-language article on how the Budget Policy Statement shapes spending.",
  },
  {
    id: "counties-breakdown",
    title: "County Budgets: What KES 420B Means",
    readTime: "6 min read",
    snippet: "How county allocations translate into roads, health, markets, and water services.",
  },
  {
    id: "debt-deficit-explained",
    title: "Debt and Deficit Explained Simply",
    readTime: "8 min read",
    snippet: "Why deficits happen, what borrowing does, and what risks to watch in each cycle.",
  },
];

const deepDiveModules = deepDiveCards;

const decodeStoryCards = [
  {
    id: "intro",
    title: "Let's Decode the Budget! 🔓",
    subtitle: "Kenya's Money Blueprint",
    hook: "Hook: This one decision touches your rent, food, and transport.",
    emoji: "🚪",
    bg: "from-indigo-500 via-purple-500 to-pink-500",
    content:
      "Ever wonder how the government plans to spend YOUR money? Every year, Kenya releases a secret blueprint called the Budget Policy Statement (BPS)! 🗺️",
    facts: [
      "📋 Sets spending priorities for the year",
      "🏦 Guides both national & county budgets",
      "📅 Due by February 15th",
      "💵 Forms the April national budget",
    ],
  },
  {
    id: "what-is-bps",
    title: "What is a BPS Actually? 🤔",
    subtitle: "Think of it like...",
    emoji: "💡",
    bg: "from-amber-500 to-orange-500",
    content:
      "It's NOT the actual budget - it's the PREVIEW! Like a movie trailer before the full film. 🎬",
    stat: { value: "Feb 15", label: "📅Deadline (PFM Act)" },
  },
  {
    id: "beta-intro",
    title: "Meet BETA! 🌟",
    subtitle: "The Big Plan for Kenya",
    hook: "Hook: Five pillars, one national game plan.",
    emoji: "🚀",
    bg: "from-cyan-500 to-blue-500",
    content:
      "BETA = Bottom-Up Economic Transformation Agenda. That's government speak for 'let's grow Kenya from the ground up!' 🌱",
    pillars: [
      { emoji: "🌽", title: "Agriculture", desc: "Food for everyone!" },
      { emoji: "🔥", title: "Hustlers", desc: "Small business boost" },
      { emoji: "🩺", title: "Healthcare", desc: "Health for all" },
      { emoji: "🏠", title: "Housing", desc: "Roof over heads" },
      { emoji: "📱", title: "Digital", desc: "Internet for Kenya" },
    ],
  },
  {
    id: "agri",
    title: "Farm Life! 🌾",
    subtitle: "From Farm to Table",
    emoji: "🧑‍🌾",
    bg: "from-green-500 to-emerald-500",
    content:
      "Kenya wants to grow MORE food! Think better seeds, Irrigation everywhere, and livestock that won't get sick. 🥩",
    facts: [
      "💊 Cheaper fertilizer",
      "💧 Big irrigation projects",
      "💉 Livestock vaccines",
      "🏭 Better storage",
    ],
  },
  {
    id: "msme",
    title: "Hustler Energy! ⚡",
    subtitle: "Small Biz Big Dreams",
    emoji: "💪",
    bg: "from-pink-500 to-rose-500",
    content:
      "MSMEs = Micro, Small & Medium Enterprises. That's YOUR aunt's duka, the matatu guy, the tailor on the corner! They need cheaper loans! 💰",
    facts: [
      "💵 Bigger Hustler Fund",
      "🏦 Credit guarantees",
      "📍 Hubs in all 47 counties",
      "📈 Business growth",
    ],
  },
  {
    id: "health",
    title: "Health for All! 🏥",
    subtitle: "No One Left Behind",
    emoji: "❤️",
    bg: "from-red-500 to-pink-500",
    content:
      "SHA = Social Health Authority. The goal? 35 MILLION Kenyans with health cover! That's almost everyone! 🙌",
    facts: [
      "👩‍⚕️ Community health workers",
      "🏗️ New clinics",
      "💻 Digital health records",
      "💊 Free medicine",
    ],
  },
  {
    id: "numbers-intro",
    title: "The Big Numbers! 💰",
    subtitle: "Let's Talk Billions",
    hook: "Hook: The size of the gap decides tomorrow's taxes.",
    emoji: "😱",
    bg: "from-violet-600 to-purple-600",
    content:
      "Buckle up! Here's what the 2026/27 budget looks like in KENYAN SHILLINGS...",
  },
  {
    id: "revenue",
    title: "Money In! 📈",
    subtitle: "Where It Comes From",
    emoji: "💵",
    bg: "from-emerald-500 to-teal-500",
    content:
      "Total revenue the government expects to collect. Taxes, duties, everything!",
    stat: { value: "KES 3.59T", label: "💰Total Revenue" },
  },
  {
    id: "expenditure",
    title: "Money Out! 🛒",
    subtitle: "Where It Goes",
    emoji: "🛍️",
    bg: "from-orange-500 to-amber-500",
    content: "Total planned spending. Roads, salaries, projects - everything!",
    stat: { value: "KES 4.74T", label: "💸Total Spending" },
  },
  {
    id: "deficit",
    title: "The Gap! 😬",
    subtitle: "Spending More Than You Have",
    emoji: "📉",
    bg: "from-red-600 to-rose-600",
    content:
      "When you spend more than you earn = deficit. Kenya borrows to fill the gap!",
    stat: { value: "KES 1.15T", label: "🚨The Gap!" },
    note: "🤝 KES 225B foreign + KES 924B domestic",
  },
  {
    id: "debt",
    title: "Debt Alarm! 🚨",
    subtitle: "Already Committed?",
    emoji: "😰",
    bg: "from-yellow-500 to-orange-500",
    content:
      "-interest on old loans. This money is GONE before anything else! Can't use it for roads or schools.",
    stat: { value: "KES 1.2T", label: "⚠️Already Committed" },
  },
  {
    id: "counties",
    title: "Going Local! 🗺️",
    subtitle: "Counties Get Cash",
    emoji: "🏛️",
    bg: "from-blue-500 to-indigo-500",
    content:
      "47 counties get a slice for local roads, health centers, markets!",
    stat: { value: "KES 420B", label: "💵To Counties" },
    services: ["🛣️Roads", "🏥Health", "💧Water", "🏪Markets", "🎪Events"],
  },
  {
    id: "risks",
    title: "Watch Out! ⚠️",
    subtitle: "Budget Danger Zones",
    hook: "Hook: These risks can flip a good budget fast.",
    emoji: "⚡",
    bg: "from-gray-700 to-gray-900",
    content: "Things that could mess up the budget:",
    risks: [
      { title: "📈 Debt spiral", desc: "More borrowing = more interest" },
      { title: "🏦 SOE bailouts", desc: "State company losses" },
      { title: "📉 Economy slow", desc: "Less tax collected" },
      { title: "🌧️ Climate", desc: "Droughts + floods" },
      { title: "📢 Counties", desc: "More demands" },
    ],
  },
  {
    id: "quiz-prompt",
    title: "Ready to Quiz? 🎯",
    subtitle: "Test Your Knowledge",
    emoji: "🏆",
    bg: "from-amber-500 via-orange-500 to-red-500",
    content: "You made it! Let's see how much you remember. 🎮",
    prompt: true,
  },
];

const citizenStreetCards = [
  {
    id: "street-intro",
    title: "Morning in Githurai ☀️",
    subtitle: "Budget meets daily life",
    hook: "Hook: Budget policy quietly prices your entire day.",
    emoji: "🚐",
    bg: "from-orange-500 via-amber-500 to-yellow-500",
    content:
      "You wake up, board a matatu, buy breakfast, and head to work. Every one of those costs is shaped by taxes, fuel policy, and county planning.",
    facts: ["🚌 Transport", "🍞 Food prices", "💡 Electricity", "🏥 Health access"],
  },
  {
    id: "fare",
    title: "Matatu Fare Shock 😵",
    subtitle: "Fuel costs ripple everywhere",
    emoji: "⛽",
    bg: "from-red-500 to-orange-500",
    content:
      "When fuel levies rise, transport operators adjust fares. That pushes up market delivery costs and eventually your lunch bill.",
    stat: { value: "KES +20-80", label: "🚨Typical fare jump band" },
  },
  {
    id: "market",
    title: "Soko Realities 🧺",
    subtitle: "Why unga and mboga shift",
    emoji: "🥬",
    bg: "from-green-500 to-emerald-500",
    content:
      "Food inflation is not random. Fertilizer subsidies, irrigation investment, and transport costs decide what your basket looks like.",
    services: ["🌽 Subsidies", "🚚 Logistics", "💧 Irrigation", "📦 Storage"],
  },
  {
    id: "clinic",
    title: "Clinic Queue Story 🏥",
    subtitle: "County money at work",
    emoji: "🩺",
    bg: "from-rose-500 to-pink-500",
    content:
      "Local clinics depend on county allocation quality. Better prioritization means more drugs, staff, and shorter queues.",
    stat: { value: "KES 420B", label: "🏛️County equitable share" },
  },
  {
    id: "street-risk",
    title: "Street Risk Radar ⚠️",
    subtitle: "What can break the plan",
    emoji: "🌧️",
    bg: "from-slate-700 to-slate-900",
    content: "On the ground, these risks hit first:",
    risks: [
      { title: "📉 Slow growth", desc: "Jobs and household income tighten" },
      { title: "⛽ Energy spikes", desc: "Transport and food costs climb" },
      { title: "🌊 Climate shocks", desc: "Supply chains and farm output dip" },
      { title: "🏥 Service pressure", desc: "Demand rises faster than facilities" },
    ],
  },
  {
    id: "quiz-prompt",
    title: "Street Checkpoint 🎯",
    subtitle: "Ready for the quiz?",
    emoji: "✅",
    bg: "from-amber-500 via-orange-500 to-red-500",
    content: "You now see how policy hits normal life. Let's test it fast.",
    prompt: true,
  },
];

const futureLabCards = [
  {
    id: "lab-intro",
    title: "Welcome to Future Lab 🧪",
    subtitle: "Mission: decode 2026 budget",
    hook: "Hook: Good allocations create momentum, bad ones create drag.",
    emoji: "🧠",
    bg: "from-cyan-500 via-blue-600 to-indigo-700",
    content:
      "Think of the budget as a control panel. Each lever affects growth, services, and resilience. Your job is to read the signals before the headlines do.",
  },
  {
    id: "growth-engine",
    title: "Growth Engine 🚀",
    subtitle: "Where expansion should come from",
    emoji: "📈",
    bg: "from-emerald-500 to-teal-600",
    content:
      "If agriculture, MSMEs, and digital sectors scale together, employment and tax revenues become more stable over time.",
    pillars: [
      { emoji: "🌾", title: "Agriculture", desc: "Food and export stability" },
      { emoji: "🏪", title: "MSMEs", desc: "Fast local job creation" },
      { emoji: "📶", title: "Digital", desc: "Efficiency and inclusion" },
    ],
  },
  {
    id: "allocation-dashboard",
    title: "Allocation Dashboard 🖥️",
    subtitle: "Money in vs money out",
    emoji: "🧮",
    bg: "from-violet-600 to-purple-700",
    content:
      "The critical question is not only how much is spent, but what share goes to productive investment versus locked obligations.",
    facts: [
      "💰 Revenue: KES 3.59T",
      "🛒 Spend: KES 4.74T",
      "📉 Deficit: KES 1.15T",
      "🚨 Debt service pressure",
    ],
  },
  {
    id: "resilience",
    title: "Resilience Layer 🛡️",
    subtitle: "Can systems absorb shocks?",
    emoji: "🌍",
    bg: "from-blue-500 to-sky-600",
    content:
      "Climate, exchange rates, and global prices can all stress fiscal plans. Strong local systems reduce the damage.",
    services: ["💧 Water systems", "🌾 Food buffers", "🏥 Health readiness", "📊 Data response"],
  },
  {
    id: "risk-matrix",
    title: "Risk Matrix 🚨",
    subtitle: "Priority watchlist",
    emoji: "🛰️",
    bg: "from-gray-700 to-black",
    content: "Four red flags to watch this cycle:",
    risks: [
      { title: "💳 Debt rollover", desc: "Refinancing gets costlier" },
      { title: "🏢 SOE liabilities", desc: "Potential bailout burdens" },
      { title: "📉 Revenue underperformance", desc: "Targets miss reality" },
      { title: "🌦️ Climate variability", desc: "Agriculture and prices swing" },
    ],
  },
  {
    id: "quiz-prompt",
    title: "Systems Check 🎯",
    subtitle: "Test your analyst instincts",
    emoji: "🧩",
    bg: "from-indigo-600 via-violet-600 to-fuchsia-600",
    content: "You finished the lab run. Ready for your final check?",
    prompt: true,
  },
];

const civicCompassV2Cards = [
  {
    id: "v2-intro",
    title: "Civic Compass V2",
    subtitle: "Choose leadership that protects tomorrow",
    hook: "Hook: One vote can defend the constitution or weaken it.",
    emoji: "🧭",
    bg: "from-slate-900 via-indigo-900 to-black",
    content:
      "A wise leader does not just promise projects. They protect institutions, follow the constitution, and keep power accountable to citizens.",
    facts: [
      "🗳️ Your vote shapes systems, not just slogans",
      "⚖️ Law-abiding leadership builds trust",
      "🏛️ Institutions outlive campaign seasons",
      "🧑‍🤝‍🧑 Democracy needs active citizens",
    ],
  },
  {
    id: "v2-vetting-mindset",
    title: "Before You Elect, Vet",
    subtitle: "Leadership is a public trust",
    emoji: "🔍",
    bg: "from-zinc-900 via-slate-900 to-blue-900",
    content:
      "Treat every candidate like a serious job applicant. Review values, track record, integrity, and respect for lawful process before trusting them with public power.",
    facts: [
      "📁 Check delivery record and consistency",
      "🧾 Follow known sources of campaign funding",
      "🤝 Watch how they treat critics and media",
      "📚 Verify policy depth, not just charisma",
    ],
  },
  {
    id: "v2-constitution",
    title: "Constitution First",
    subtitle: "No one is above the law",
    emoji: "⚖️",
    bg: "from-indigo-900 via-blue-900 to-slate-950",
    content:
      "Wise leaders work within constitutional limits: respecting courts, Parliament, county mandates, and independent oversight institutions.",
    pillars: [
      { emoji: "🏛️", title: "Separation of powers", desc: "No office should overreach" },
      { emoji: "👩‍⚖️", title: "Independent judiciary", desc: "Rights need fair adjudication" },
      { emoji: "📜", title: "Rule of law", desc: "Law guides decisions, not impulse" },
      { emoji: "🧾", title: "Public accountability", desc: "Audit trails and open reporting" },
    ],
  },
  {
    id: "v2-democracy-check",
    title: "Democracy Is Daily Work",
    subtitle: "Beyond election day",
    emoji: "🕊️",
    bg: "from-slate-900 via-blue-900 to-indigo-950",
    content:
      "Democracy survives when leaders accept scrutiny, respect dissent, and protect civil liberties. Silence and fear are warning signs, not stability.",
    risks: [
      { title: "🚫 Attacking oversight", desc: "Weakens corruption checks" },
      { title: "🧨 Divisive rhetoric", desc: "Turns citizens against each other" },
      { title: "📵 Restricting civic voice", desc: "Reduces public participation" },
      { title: "🫥 Dodging transparent reporting", desc: "Hides performance failures" },
    ],
  },
  {
    id: "v2-citizen-scorecard",
    title: "Citizen Vetting Scorecard",
    subtitle: "Simple test before support",
    emoji: "✅",
    bg: "from-blue-900 via-indigo-900 to-slate-950",
    content:
      "Use this quick scorecard to compare candidates. If someone fails most tests, they should not get your mandate.",
    services: [
      "Respects constitutional limits",
      "Publishes clear policy plans",
      "Has clean integrity record",
      "Responds to scrutiny calmly",
      "Builds unity across communities",
    ],
    tinyLogo: true,
  },
  {
    id: "v2-collective-action",
    title: "Vote, Then Monitor",
    subtitle: "Mandate + follow-through",
    emoji: "📣",
    bg: "from-zinc-900 via-indigo-900 to-slate-900",
    content:
      "Electing wise leaders is the first step. Keep monitoring budgets, laws, procurement, and service delivery so constitutional promises become lived reality.",
    facts: [
      "📝 Track campaign promises quarterly",
      "🏥 Follow local service outcomes",
      "📊 Demand open performance data",
      "🧭 Stay issue-focused, not personality-focused",
    ],
  },
  {
    id: "v2-credits",
    title: "Built by the Dev Team",
    subtitle: "Design-forward civic storytelling",
    emoji: "🛠️",
    bg: "from-black via-slate-900 to-indigo-900",
    content:
      "This V2 story is crafted in appreciation of the dev team: motion, interaction, and clarity working together to strengthen democratic civic education.",
    stat: { value: "DEVTEAM", label: "Credits: Design + Engineering + Content" },
    note: "Thank you for shipping civic tech that helps citizens choose wise, lawful leadership.",
  },
];

const storyFlows = {
  "lets-decode": decodeStoryCards,
  "citizen-street": citizenStreetCards,
  "future-lab": futureLabCards,
  "civic-compass-v2": civicCompassV2Cards,
  "budget-trivia": [], // Dynamic
} as const;
type StoryFlowId = keyof typeof storyFlows;

const quizQuestions = [
  {
    question:
      "By when must the Budget Policy Statement be submitted to Parliament?",
    options: ["January 1st", "February 15th", "March 30th", "April 30th"],
    correct: 1,
    explanation:
      "Section 25 of the Public Finance Management Act sets February 15th as the deadline.",
  },
  {
    question: "Which pillar focuses on affordable housing through KMRC?",
    options: ["Agriculture", "MSMEs", "Housing & Settlement", "Digital"],
    correct: 2,
    explanation:
      "Housing & Settlement focuses on affordable housing through the Kenya Mortgage Refinance Company (KMRC).",
  },
  {
    question: "What is Kenya's projected fiscal deficit for FY 2026/27?",
    options: ["KES 500B", "KES 1.15T", "KES 2T", "KES 3T"],
    correct: 1,
    explanation:
      "The projected fiscal deficit is KES 1.15 trillion, financed through KES 225.5B foreign and KES 924B domestic borrowing.",
  },
  {
    question: "What is the main fiscal risk from rising debt?",
    options: [
      "Less tax collection",
      "Less for services",
      "Faster growth",
      "Lower inflation",
    ],
    correct: 1,
    explanation:
      "When debt interest payments rise, less money is available for actual services like roads, healthcare, and education.",
  },
  {
    question: "How much goes to county governments via equitable share?",
    options: ["KES 200B", "KES 320B", "KES 420B", "KES 500B"],
    correct: 2,
    explanation:
      "KES 420 billion is allocated to county governments for devolved services like roads, health, water, and markets.",
  },
];

const surveyQuestions = [
  {
    question: "How clear did this story make the 2026 budget for you?",
    options: ["Very clear", "Somewhat clear", "Neutral", "Still confusing"],
  },
  {
    question: "Which story format did you enjoy most?",
    options: ["Let's Decode", "Citizen Street", "Future Lab", "I liked all of them"],
  },
  {
    question: "What should we improve next?",
    options: ["More visuals/emoji", "Simpler terms", "More local examples", "Shorter pages"],
  },
];

function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Container animation="fadeUp" delay={0.3} className="space-y-4">
      <h2 className="text-xl font-bold">FAQ: Budget Basics</h2>
      <div className="space-y-2">
        {faqItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
          >
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full p-4 flex items-center justify-between gap-3 text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="size-4 text-primary shrink-0" />
                <span className="text-sm font-medium">{item.q}</span>
              </div>
              <motion.div
                animate={{ rotate: openFaq === idx ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="size-4 text-foreground/50" />
              </motion.div>
            </button>
            <motion.div
              initial={false}
              animate={{
                height: openFaq === idx ? "auto" : 0,
                opacity: openFaq === idx ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="px-4 pb-4 text-sm text-foreground/70 pl-8">
                {item.a}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    const payload = {
      email,
      first_name: email.split("@")[0],
      source: "learn_page",
    };

    console.log("Newsletter subscribe (learn_page) payload:", payload);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/newsletter/subscribe/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      console.log(
        "Newsletter subscribe (learn_page) response:",
        res.status,
        data,
      );
      if (
        res.ok &&
        (data.status === "success" || data.status === "already_subscribed")
      ) {
        setSubscribed(true);
      } else {
        toast.error(data.message || "Failed to subscribe");
      }
    } catch (error) {
      console.error("Newsletter subscribe (learn_page) error:", error);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 rounded-2xl bg-gradient-to-r from-primary/20 to-teal-500/20 border border-primary/30"
      >
        <CheckCircle className="size-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">You're Subscribed!</h3>
        <p className="text-foreground/60">You'll receive budget updates.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-2xl bg-white/5 border border-white/10"
    >
      <div className="text-center mb-6">
        <Mail className="size-10 text-primary mx-auto mb-3" />
        <h3 className="text-xl font-bold">Stay Updated</h3>
        <p className="text-sm text-foreground/60">
          Get budget insights delivered.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-sm"
          required
        />
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="px-4 rounded-xl"
        >
          {loading ? (
            <RefreshCcw className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </motion.div>
  );
}

type AppState = "hub" | "article" | "quiz" | "complete" | "survey" | "survey-complete";
const STORY_WATCHED_STORAGE_KEY = "bns_story_watched";
const GAMIFICATION_ID_STORAGE_KEY = "bns_gamification_id";

type GamificationState = {
  points: number;
  level: number;
  streak_days: number;
};

export default function Learn() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [appState, setAppState] = useState<AppState>("hub");
  const [selectedStoryId, setSelectedStoryId] = useState<StoryFlowId>("lets-decode");
  const [articleIndex, setArticleIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [readyForQuiz, setReadyForQuiz] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [triviaCards, setTriviaCards] = useState<any[]>([]);
  const [surveyIndex, setSurveyIndex] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<number, number>>({});
  const [watchedStories, setWatchedStories] = useState<Record<string, boolean>>({});
  const [currentFlowCards, setCurrentFlowCards] = useState<any[]>([]);
  const [gamification, setGamification] = useState<GamificationState | null>(null);
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/youtube")
      .then((res) => res.json())
      .then((data) => {
        if (data.videos) setYoutubeVideos(data.videos);
      })
      .catch((err) => console.error("Failed to load YouTube videos:", err));
  }, []);

  // Fetch trivia from backend
  useEffect(() => {
    const fetchTrivia = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/trivia/`);
        if (!response.ok) throw new Error("Failed to fetch trivia");
        const data = await response.json();
        
        const mappedTrivia = data.map((t: any) => ({
          id: `trivia-${t.id}`,
          title: t.category_display || "Budget Trivia",
          subtitle: `Year: ${t.year || "Historical"}`,
          emoji: "❓",
          bg: "from-green-700 via-emerald-700 to-teal-900",
          content: t.question,
          facts: [
            `✅ Answer: ${t.answer}`,
            `ℹ️ Context: ${t.context || "No extra info"}`
          ]
        }));

        // Add a final card to the trivia cards
        mappedTrivia.push({
          id: "trivia-complete",
          title: "Trivia Complete! 🏆",
          subtitle: "You're a budget expert!",
          emoji: "🥳",
          bg: "from-amber-500 to-orange-500",
          content: "You've gone through the historical budget trivia. Keep exploring to learn more about Kenya's fiscal history!",
          prompt: true
        });

        setTriviaCards(mappedTrivia);
      } catch (err) {
        console.error("Error fetching trivia:", err);
      }
    };
    fetchTrivia();
  }, []);

  const getGamificationId = () => {
    if (typeof window === "undefined") return "guest";
    const existing = window.localStorage.getItem(GAMIFICATION_ID_STORAGE_KEY);
    if (existing) return existing;
    const generated = `device-${crypto.randomUUID()}`;
    window.localStorage.setItem(GAMIFICATION_ID_STORAGE_KEY, generated);
    return generated;
  };

  const gamificationFetch = async (path: string, init?: RequestInit) => {
    const identifier = getGamificationId();
    return fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "X-Gamification-Id": identifier,
        ...(init?.headers || {}),
      },
    });
  };

  const refreshGamification = async () => {
    try {
      const response = await gamificationFetch("/api/gamification/me/");
      if (!response.ok) return;
      const data = await response.json();
      setGamification({
        points: data.points ?? 0,
        level: data.level ?? 1,
        streak_days: data.streak_days ?? 0,
      });
    } catch (error) {
      console.error("Failed to fetch gamification state:", error);
    }
  };

  const awardPoints = async (payload: {
    eventType: "story_complete" | "quiz_complete" | "challenge_submit" | "streak_bonus";
    points: number;
    objectId?: string;
    idempotencyKey: string;
    metadata?: Record<string, unknown>;
  }) => {
    try {
      const response = await gamificationFetch("/api/gamification/events/", {
        method: "POST",
        body: JSON.stringify({
          event_type: payload.eventType,
          points: payload.points,
          object_id: payload.objectId || "",
          idempotency_key: payload.idempotencyKey,
          metadata: payload.metadata || {},
        }),
      });
      if (!response.ok) return;
      const data = await response.json();
      if (typeof data.points === "number") {
        setGamification({
          points: data.points,
          level: data.level ?? 1,
          streak_days: data.streak_days ?? 0,
        });
      }
    } catch (error) {
      console.error("Failed to award points:", error);
    }
  };

  const handleStoryStart = (id: StoryFlowId) => {
    setSelectedStoryId(id);
    if (id === "budget-trivia" && triviaCards.length > 0) {
      setCurrentFlowCards(triviaCards);
    } else if (id !== "budget-trivia") {
      setCurrentFlowCards(storyFlows[id]);
    }
    markStoryWatched(id);
    setAppState("article");
    setArticleIndex(0);
  };

  const currentStoryCards = currentFlowCards.length > 0 ? currentFlowCards : storyFlows[selectedStoryId];
  const currentCard = currentStoryCards[articleIndex];
  const isQuizPrompt = Boolean(currentCard && "prompt" in currentCard && currentCard.prompt);
  const isLastCard = articleIndex === currentStoryCards.length - 1;
  const totalCards = currentStoryCards.filter(
    (c) => !("prompt" in c && c.prompt),
  ).length;
  const readingProgress = Math.round((articleIndex / totalCards) * 100);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const bgShift = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const blobOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.3, 0.5, 0.3, 0.1],
  );

  const handleNext = () => {
    if (articleIndex < currentStoryCards.length - 1) {
      setArticleIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (articleIndex > 0) {
      setArticleIndex((i) => i - 1);
    }
  };

  const markStoryWatched = (storyId: StoryFlowId) => {
    setWatchedStories((prev) => {
      if (prev[storyId]) return prev;
      const next = { ...prev, [storyId]: true };
      try {
        window.localStorage.setItem(STORY_WATCHED_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage failures in private mode or restricted environments.
      }
      void awardPoints({
        eventType: "story_complete",
        points: 10,
        objectId: storyId,
        idempotencyKey: `story_complete:${storyId}`,
        metadata: { source: "learn_story" },
      });
      return next;
    });
  };

  const sortedHubStories = useMemo(() => {
    return [...hubStories].sort((a, b) => {
      const aWatched = watchedStories[a.id] ? 1 : 0;
      const bWatched = watchedStories[b.id] ? 1 : 0;
      return aWatched - bWatched;
    });
  }, [watchedStories]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORY_WATCHED_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, boolean>;
      setWatchedStories(parsed);
    } catch {
      // Ignore invalid/missing local storage data.
    }
  }, []);

  useEffect(() => {
    void refreshGamification();
  }, []);

  useEffect(() => {
    const storyParam = searchParams.get("story");
    if (!storyParam) return;

    if (storyParam in storyFlows) {
      const storyId = storyParam as StoryFlowId;
      setSelectedStoryId(storyId);
      if (storyId === "budget-trivia" && triviaCards.length > 0) {
        setCurrentFlowCards(triviaCards);
      } else if (storyId !== "budget-trivia") {
        setCurrentFlowCards(storyFlows[storyId]);
      }
      markStoryWatched(storyId);
      setAppState("article");
      setArticleIndex(0);
    }
  }, [searchParams, triviaCards]);

  useEffect(() => {
    if (appState !== "article") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setAppState("hub");
        setArticleIndex(0);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [appState]);

  const startQuiz = () => {
    setAppState("quiz");
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswer(null);
    setShowFeedback(false);
  };

  const handleQuizAnswer = (idx: number) => {
    setQuizAnswer(idx);
    setShowFeedback(true);
    if (idx === quizQuestions[quizIndex].correct) {
      setQuizScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((i) => i + 1);
      setQuizAnswer(null);
      setShowFeedback(false);
    } else {
      void awardPoints({
        eventType: "quiz_complete",
        points: 20,
        objectId: selectedStoryId,
        idempotencyKey: `quiz_complete:${selectedStoryId}:${new Date().toISOString().slice(0, 10)}`,
        metadata: { score: quizScore, total: quizQuestions.length },
      });
      setAppState("complete");
    }
  };

  const handlePrevQuestion = () => {
    if (quizIndex > 0) {
      setQuizIndex((i) => i - 1);
      setQuizAnswer(null);
      setShowFeedback(false);
    }
  };

  const getTitle = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct === 100)
      return {
        title: "Budget Master 🏆",
        subtitle: "Perfect Score! You've mastered the BPS.",
      };
    if (pct >= 80)
      return {
        title: "Budget Chief 👑",
        subtitle: "Excellent! You lead with knowledge.",
      };
    if (pct >= 60)
      return {
        title: "Budget Analyst 📊",
        subtitle: "Good! You understand the budget.",
      };
    return {
      title: "Budget Apprentice 📚",
      subtitle: "Keep learning! The budget awaits.",
    };
  };

  const resultTitle = getTitle(quizScore, quizQuestions.length);
  const finalPct = Math.round((quizScore / quizQuestions.length) * 100);
  const surveyCompletedCount = Object.keys(surveyAnswers).length;

  if (appState === "complete") {
    const emoji =
      finalPct === 100
        ? "🏆"
        : finalPct >= 80
          ? "👑"
          : finalPct >= 60
            ? "🎯"
            : "🌱";
    return (
      <section className="fixed inset-0 z-[100] bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: "50%", y: "50%", scale: 0 }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              className="absolute text-2xl"
            >
              {["🎉", "⭐", "💫", "✨", "🎊"][i % 5]}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full relative z-10"
        >
          <motion.div
            initial={{ y: 20, rotate: 0 }}
            animate={{ y: 0, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
            className="text-8xl mb-6"
          >
            {emoji}
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {resultTitle.title}
          </h1>
          <p className="text-lg text-white/60 mb-6">{resultTitle.subtitle}</p>

          <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
            <div className="text-5xl font-bold text-white mb-2">
              {quizScore}/{quizQuestions.length}
            </div>
            <p className="text-sm text-white/50">questions correct</p>
            <div className="mt-4 h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${finalPct}%` }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400"
              />
            </div>
            <p className="text-xs text-white/50 mt-2">{finalPct}% score</p>
          </div>

          <Button
            size="lg"
            className="hidden md:inline-flex w-full h-12 rounded-xl bg-white text-gray-900 hover:bg-white/90"
            onClick={() => {
              setAppState("hub");
              setArticleIndex(0);
            }}
          >
            Back to Hub <ArrowRight className="ml-2" />
          </Button>
        </motion.div>
      </section>
    );
  }

  if (appState === "quiz") {
    const q = quizQuestions[quizIndex];
    const progress = ((quizIndex + 1) / quizQuestions.length) * 100;

    return (
      <section className="fixed inset-0 z-[100] bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex flex-col overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 180] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-purple-600/20 blur-3xl"
          />
        </div>

        <div className="relative z-10 flex items-center px-4 py-3">
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", damping: 20 }}
              />
            </div>
            <div className="ml-2 px-2 py-1 rounded-full bg-white/20 text-xs font-medium text-white">
              {quizIndex + 1}/{quizQuestions.length}
            </div>
          </div>
          <button
            type="button"
            aria-label="Cancel quiz and return to hub"
            onClick={() => setAppState("hub")}
            className="ml-2 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="size-4 text-white" />
          </button>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center p-6">
          <motion.div
            key={quizIndex}
            initial={{ x: 100, opacity: 0, scale: 0.9 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -100, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="w-full max-w-md"
          >
            <div className="text-sm text-white/50 mb-2">
              Question {quizIndex + 1}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-8">
              {q.question}
            </h2>

            <div className="space-y-3">
              {q.options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleQuizAnswer(idx)}
                  disabled={showFeedback}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3",
                    showFeedback &&
                      idx === q.correct &&
                      "border-green-500 bg-green-500/20 text-green-400",
                    showFeedback &&
                      quizAnswer === idx &&
                      idx !== q.correct &&
                      "border-red-500 bg-red-500/20 text-red-400",
                    !showFeedback &&
                      "border-white/20 bg-white/5 hover:border-white/50 hover:bg-white/10",
                  )}
                >
                  <span
                    className={cn(
                      "w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold shrink-0",
                      showFeedback && idx === q.correct
                        ? "bg-green-500 border-green-500 text-black"
                        : showFeedback &&
                            quizAnswer === idx &&
                            idx !== q.correct
                          ? "bg-red-500 border-red-500 text-white"
                          : "border-white/30 text-white/70",
                    )}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm">{opt}</span>
                </motion.button>
              ))}
            </div>

            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "mt-6 p-4 rounded-xl",
                  quizAnswer === q.correct
                    ? "bg-green-500/20 border border-green-500/30 text-green-400"
                    : "bg-red-500/20 border border-red-500/30 text-red-400",
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  {quizAnswer === q.correct ? (
                    <CheckCircle className="size-5" />
                  ) : (
                    <XCircle className="size-5" />
                  )}
                  <span className="font-bold">
                    {quizAnswer === q.correct ? "Correct! 🎉" : "Not quite 😅"}
                  </span>
                </div>
                <p className="text-sm text-white/70">{q.explanation}</p>
              </motion.div>
            )}
          </motion.div>
          <div className="pointer-events-none absolute inset-0 z-20 flex">
            <button
              type="button"
              aria-label="Previous quiz question"
              data-testid="quiz-tap-left"
              className="pointer-events-auto h-full w-1/2 bg-transparent"
              onClick={handlePrevQuestion}
            />
            <button
              type="button"
              aria-label="Next quiz question"
              data-testid="quiz-tap-right"
              className="pointer-events-auto h-full w-1/2 bg-transparent"
              onClick={() => {
                if (showFeedback) handleNextQuestion();
              }}
            />
          </div>
        </div>

        <div className="relative z-10 p-4 text-center text-xs text-white/70">
          Tap left/right to navigate
        </div>
      </section>
    );
  }

  if (appState === "survey-complete") {
    return (
      <section className="fixed inset-0 z-[100] bg-gradient-to-br from-indigo-900 via-violet-900 to-black flex items-center justify-center p-6 overflow-hidden">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur p-8 text-center"
        >
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-3xl font-bold text-white mb-2">Survey complete</h2>
          <p className="text-white/70 mb-6">
            Thanks for the feedback. This helps us improve future stories.
          </p>
          <div className="text-sm text-white/80 mb-6">
            Responses submitted: {surveyCompletedCount}/{surveyQuestions.length}
          </div>
          <Button
            className="hidden md:inline-flex w-full h-11 bg-white text-gray-900 hover:bg-white/90"
            onClick={() => {
              setAppState("hub");
              setSurveyIndex(0);
              setSurveyAnswers({});
            }}
          >
            Back to Learn Hub
          </Button>
        </motion.div>
      </section>
    );
  }

  if (appState === "survey") {
    const currentSurvey = surveyQuestions[surveyIndex];
    const progress = ((surveyIndex + 1) / surveyQuestions.length) * 100;
    const selected = surveyAnswers[surveyIndex];

    return (
      <section className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-indigo-900 to-black flex flex-col overflow-hidden">
        <div className="relative z-10 flex items-center px-4 py-3">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", damping: 22 }}
            />
          </div>
          <div className="ml-3 px-2 py-1 rounded-full bg-white/20 text-xs font-medium text-white">
            {surveyIndex + 1}/{surveyQuestions.length}
          </div>
          <button
            onClick={() => setAppState("hub")}
            className="ml-2 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="size-4 text-white" />
          </button>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center p-6">
          <motion.div
            key={surveyIndex}
            initial={{ x: 90, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -90, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 18, stiffness: 180 }}
            className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur p-6"
          >
            <div className="text-xs uppercase tracking-wider text-cyan-300 font-semibold mb-2">
              Story Survey
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{currentSurvey.question}</h3>
            <div className="mb-6 flex justify-center">
              <Image
                src="/images/survey/bnssurvey1.jpeg"
                alt="Survey"
                width={200}
                height={300}
                className="rounded-lg object-contain max-h-32"
              />
            </div>
            <div className="space-y-3">
              {currentSurvey.options.map((option, idx) => (
                <button
                  key={option}
                  onClick={() =>
                    setSurveyAnswers((prev) => ({
                      ...prev,
                      [surveyIndex]: idx,
                    }))
                  }
                  className={cn(
                    "w-full p-3 rounded-xl text-left border transition-colors",
                    selected === idx
                      ? "border-cyan-300 bg-cyan-400/20 text-white"
                      : "border-white/20 bg-white/5 text-white/90 hover:bg-white/10",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 p-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="hidden md:inline-flex h-11 border-white/30 bg-black/20 text-white hover:bg-white/10"
            disabled={surveyIndex === 0}
            onClick={() => setSurveyIndex((v) => Math.max(0, v - 1))}
          >
            <ChevronLeft className="size-4 mr-1" />
            Previous
          </Button>
          <Button
            className="h-11 bg-white text-gray-900 hover:bg-white/90 disabled:opacity-40"
            disabled={selected === undefined}
            onClick={() => {
              if (surveyIndex < surveyQuestions.length - 1) {
                setSurveyIndex((v) => v + 1);
              } else {
                setAppState("survey-complete");
              }
            }}
          >
            {surveyIndex < surveyQuestions.length - 1 ? "Next" : "Finish Survey"}
            <ArrowRight className="size-4 ml-1" />
          </Button>
        </div>
      </section>
    );
  }

  if (appState === "article") {
    const stat = currentCard && "stat" in currentCard ? currentCard.stat : undefined;
    const note = currentCard && "note" in currentCard ? currentCard.note : undefined;
    const pillars = currentCard && "pillars" in currentCard ? currentCard.pillars : undefined;
    const risks = currentCard && "risks" in currentCard ? currentCard.risks : undefined;
    const facts = currentCard && "facts" in currentCard ? currentCard.facts : undefined;
    const services = currentCard && "services" in currentCard ? currentCard.services : undefined;
    const tinyLogo = currentCard && "tinyLogo" in currentCard ? currentCard.tinyLogo : undefined;
    const hasStat = Boolean(stat);
    const hasPillars = Boolean(pillars?.length);
    const hasRisks = Boolean(risks?.length);
    const hasFacts = Boolean(facts?.length);
    const hasServices = Boolean(services?.length);
    const bgGradient = currentCard?.bg || "from-primary to-teal-500";
    const cardBgClass = `bg-gradient-to-br ${bgGradient}`;

    return (
      <section className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden">
        {/* Static background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-1/3 -left-1/3 w-[90%] h-[90%] rounded-full opacity-25 ${cardBgClass}`} />
          <div className={`absolute -bottom-1/3 -right-1/3 w-[75%] h-[75%] rounded-full opacity-20 ${cardBgClass}`} />
        </div>

        {/* Progress bar */}
        <div className="relative z-10 flex items-center px-4 py-3">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${readingProgress}%` }}
              transition={{ type: "spring", damping: 20 }}
            />
          </div>
          <div className="ml-3 px-2 py-1 rounded-full bg-white/20 text-xs font-medium">
            {articleIndex + 1}/{currentStoryCards.length}
          </div>
          <button
            onClick={() => {
              setAppState("hub");
              setArticleIndex(0);
            }}
            className="ml-2 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="size-4 text-white" />
          </button>
        </div>
        {/* Swipeable card area */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedStoryId}-${articleIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-md"
            >
              {/* Flashcard */}
              <div
                className={cn(
                  "relative p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl overflow-hidden",
                  cardBgClass,
                )}
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="mb-3 text-6xl sm:text-7xl"
                >
                  {currentCard?.emoji}
                </motion.div>
                {tinyLogo && (
                  <div className="absolute top-4 right-4 rounded-full border border-white/20 bg-black/35 p-1 backdrop-blur-sm">
                    <Image src="/logo.svg" alt="Budget Ndio Story logo" width={12} height={12} />
                  </div>
                )}

                {/* Title */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl sm:text-3xl font-bold text-white mb-1"
                >
                  {currentCard?.title}
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-white/70 text-sm mb-4"
                >
                  {currentCard?.subtitle}
                </motion.p>

                {currentCard?.hook && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.18 }}
                    className="inline-flex mb-4 rounded-full border border-white/30 bg-black/20 px-3 py-1 text-[11px] font-semibold text-white/90"
                  >
                    {currentCard.hook}
                  </motion.div>
                )}

                {/* Content */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/90 text-base sm:text-lg mb-6 leading-relaxed"
                >
                  {currentCard?.content}
                </motion.p>

                {/* Stat display */}
                {hasStat && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center mb-4"
                  >
                    <div className="text-3xl sm:text-4xl font-bold text-white">
                      {stat?.value}
                    </div>
                    <div className="text-white/70 text-sm">
                      {stat?.label}
                    </div>
                    {note && (
                      <div className="text-white/50 text-xs mt-2">
                        {note}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Facts grid */}
                {hasFacts && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="grid grid-cols-2 gap-2"
                  >
                    {facts?.map((fact: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="bg-white/15 rounded-xl px-3 py-2 text-xs text-white/90"
                      >
                        {fact}
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Pillars grid */}
                {hasPillars && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-2"
                  >
                    {pillars?.map((p: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="flex items-center gap-3 bg-white/15 rounded-xl px-3 py-2"
                      >
                        <span className="text-xl">{p.emoji}</span>
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm">
                            {p.title}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Risks list */}
                {hasRisks && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-2"
                  >
                    {risks?.map((r: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="flex items-center gap-3 bg-red-500/30 rounded-xl px-3 py-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-red-500/50 flex items-center justify-center text-xs font-bold text-white">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="text-white text-sm">{r.title}</div>
                          <div className="text-white/50 text-xs">{r.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Services tags */}
                {hasServices && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="flex flex-wrap gap-2"
                  >
                    {services?.map((s: string, i: number) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="bg-white/20 rounded-full px-3 py-1 text-sm text-white"
                      >
                        {s}
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {/* Quiz prompt */}
                {isQuizPrompt && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4"
                  >
                    <Button
                      className="w-full h-14 rounded-xl text-lg font-medium bg-white text-gray-900 hover:bg-white/90"
                      onClick={() => startQuiz()}
                    >
                      <Target className="mr-2" /> Start Quiz
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-xl mt-3 border-white/30 text-white hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                    >
                      Keep Reading <ArrowRight className="ml-2" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 z-20 flex">
            <button
              type="button"
              aria-label="Previous story card"
              data-testid="story-tap-left"
              className="pointer-events-auto h-full w-1/2 bg-transparent"
              onClick={handlePrev}
            />
            <button
              type="button"
              aria-label="Next story card"
              data-testid="story-tap-right"
              className="pointer-events-auto h-full w-1/2 bg-transparent"
              onClick={handleNext}
            />
          </div>

        </div>

        <div className="relative z-10 p-4 text-center text-xs text-white/70">
          Tap left/right to navigate
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-background overflow-x-hidden overflow-y-visible flex flex-col pt-14 sm:pt-20"
    >
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"
          style={{ opacity: blobOpacity }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"
          style={{ opacity: blobOpacity }}
        />
      </div>

      <Wrapper className="relative z-10 w-full flex-1 flex flex-col justify-between py-4 sm:py-6">
        <div className="flex-1 flex flex-col py-2 sm:py-4">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12 w-full min-w-0">
            <Container animation="fadeUp" delay={0.02} className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-indigo-900/70 to-slate-900 p-5 sm:p-6">
                <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-primary/25 blur-3xl" />
                <div className="pointer-events-none absolute -left-12 -bottom-12 size-36 rounded-full bg-cyan-400/20 blur-3xl" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/80">
                    <BookOpen className="size-3.5" />
                    Learn Hub
                  </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/35 bg-amber-400/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-100">
                    <Trophy className="size-3.5" />
                    {gamification?.points ?? 0} points
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/35 bg-cyan-400/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-cyan-100">
                    Lv {gamification?.level ?? 1}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300/35 bg-emerald-400/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-100">
                    {gamification?.streak_days ?? 0} day streak
                  </span>
                </div>
                  <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    Learn budget stories faster, with visual explainers
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-white/75 sm:text-base">
                    Swipe story cards, open deep dives, and use practical citizen checklists to understand how public money decisions affect real services.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/85">
                      4 story formats
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/85">
                      3 deep dives
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/85">
                      Quiz + survey
                    </span>
                  </div>
                </div>
              </div>
            </Container>

            <Container animation="fadeUp" delay={0.04} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Stories</h2>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground/55">
                  Swipe horizontally
                </span>
              </div>
              <div className="overflow-x-auto pb-2 [scrollbar-width:thin]">
                <div className="flex gap-4 w-max pr-2">
                  {sortedHubStories.map((story) => (
                    <motion.button
                      key={story.id}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const storyId = story.id as StoryFlowId;
                        setSelectedStoryId(storyId);
                        markStoryWatched(storyId);
                        setAppState("article");
                        setArticleIndex(0);
                        router.push(`/learn?story=${storyId}`, { scroll: false });
                      }}
                      className={cn(
                        "w-[290px] sm:w-[340px] text-left rounded-[26px] border border-white/20 p-5 text-white",
                        "bg-gradient-to-br",
                        story.gradient,
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="text-3xl">{story.icon}</span>
                        <div className="flex flex-col items-end gap-1.5">
                          <span
                            className={cn(
                              "text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-1",
                              watchedStories[story.id]
                                ? "bg-emerald-500/25 text-emerald-100"
                                : "bg-amber-500/25 text-amber-100",
                            )}
                          >
                            {watchedStories[story.id] ? "Watched" : "New"}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full bg-black/20 px-2 py-1">
                            {story.duration}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mt-5 leading-tight">
                        {story.title}
                      </h3>
                      <p className="text-sm text-white/80 mt-2">
                        {story.subtitle}
                      </p>
                      <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold rounded-full bg-black/25 px-3 py-1.5">
                        {story.action} <ArrowRight className="size-3.5" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </Container>

            {youtubeVideos.length > 0 && (
              <Container animation="fadeUp" delay={0.1} className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-red-500">▶</span> Budget Videos
                  </h2>
                  <Link 
                    href="https://youtube.com/@budgetndiostory" 
                    target="_blank" 
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View Channel
                  </Link>
                </div>
                <div className="overflow-x-auto pb-4 [scrollbar-width:thin]">
                  <div className="flex gap-4 w-max pr-2">
                    {youtubeVideos.map((video) => (
                      <Link
                        key={video.id}
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        className="group relative block w-[280px] sm:w-[320px] rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-primary/50 transition-all"
                      >
                        <div className="relative aspect-video w-full overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg">
                            <span className="text-white ml-1">▶</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {video.title}
                          </h3>
                          <p className="text-xs text-foreground/50 mt-2">
                            {new Date(video.published).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Container>
            )}

            <Container animation="fadeUp" delay={0.15} className="space-y-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                  <BarChart3 className="size-3.5" />
                  Deep Dive
                </div>
                <h2 className="text-xl font-bold">Guided explainer cards</h2>
                <p className="text-sm text-foreground/65">
                  One complete BPS explainer plus two docs-guided drafts (CFSP and BROP) sourced from repository standards.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {deepDiveModules.map((module, index) => (
                    <Link key={module.id} href={module.href} className="group block min-w-0">
                      <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        whileHover={{ y: -2 }}
                        className="relative overflow-hidden rounded-[24px] bg-white/[0.055] shadow-[0_12px_40px_rgba(0,0,0,0.28)]"
                      >
                        <div className="relative m-2 h-44 overflow-hidden rounded-[22px]">
                          <Image
                            src={module.image}
                            alt={module.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 320px, 360px"
                          />
                          <div className={cn("absolute inset-0 bg-linear-to-br", module.accent)} />
                          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,8,12,0.72)_18%,rgba(8,8,12,0.16)_72%)]" />
                          <div className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-black shadow-[0_6px_18px_rgba(0,0,0,0.28)]">
                            <ArrowRight className="size-3.5" />
                          </div>
                        </div>

                        <div className="min-w-0 px-4 pb-4 pt-3 sm:px-4 sm:pb-4 sm:pt-3.5">
                          <h3 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight break-words">
                            {module.title}
                          </h3>
                          <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-foreground/70 break-words">
                            {module.subtitle}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
              </div>
              <div className="pt-2">
                <Link
                  href="/learn/deep-dives"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/15 px-4 py-2 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/25"
                >
                  See More Deep Dives
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </Container>

            <Container animation="fadeUp" delay={0.2} className="space-y-4">
              <h2 className="text-xl font-bold">Document Repository</h2>
              <Link
                href="/learn/repository"
                className="group block rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 hover:border-primary/30 transition-all overflow-hidden"
              >
                <motion.div whileHover={{ y: -2 }} className="relative">
                  <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-primary/20 blur-3xl" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Folder className="size-5 text-primary" />
                    </div>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      Featured Access
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg sm:text-xl font-bold group-hover:text-primary transition-colors">
                    Explore the full Budget Document Repository
                  </h3>
                  <p className="mt-2 text-sm text-foreground/65 max-w-2xl">
                    We keep Learn focused on stories and deep dives. Browse all budget folders and files in one
                    dedicated repository view.
                  </p>
                  <div className="mt-4 hidden md:block">
                    <div className="relative h-48">
                      <div className="absolute top-0 left-0 rounded-full bg-black/35 border border-white/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/80">
                        Loading folders...
                      </div>
                      <div className="lr-folder lr-folder-a">
                        <div className="lr-shell">
                          <div className="lr-layer lr-l4" />
                          <div className="lr-layer lr-l3" />
                          <div className="lr-layer lr-l2" />
                          <div className="lr-layer lr-l1" />
                        </div>
                      </div>
                      <div className="lr-folder lr-folder-b">
                        <div className="lr-shell">
                          <div className="lr-layer lr-l4" />
                          <div className="lr-layer lr-l3" />
                          <div className="lr-layer lr-l2" />
                          <div className="lr-layer lr-l1" />
                        </div>
                      </div>
                      <div className="lr-folder lr-folder-c">
                        <div className="lr-shell">
                          <div className="lr-layer lr-l4" />
                          <div className="lr-layer lr-l3" />
                          <div className="lr-layer lr-l2" />
                          <div className="lr-layer lr-l1" />
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-0 inline-flex items-center gap-1.5 rounded-full bg-black/35 border border-white/20 px-2.5 py-1 text-[10px] text-white/80">
                        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="size-1.5 rounded-full bg-amber-300 animate-pulse [animation-delay:180ms]" />
                        <span className="size-1.5 rounded-full bg-cyan-300 animate-pulse [animation-delay:320ms]" />
                        preparing preview
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Open Repository <ArrowRight className="size-4" />
                  </div>
                </motion.div>
              </Link>
            </Container>

            <Container animation="fadeUp" delay={0.25} className="space-y-4">
              <h2 className="text-xl font-bold">Quick Answers</h2>
              <Link
                href="/faq"
                className="group block p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <motion.div whileHover={{ y: -2 }}>
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <HelpCircle className="size-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary">
                        FAQ: Budget Questions
                      </h3>
                      <p className="text-xs text-foreground/60">
                        Common questions about the BPS explained
                      </p>
                    </div>
                    <ArrowRight className="size-4 text-foreground/30 group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              </Link>
            </Container>

            <Container animation="fadeUp" delay={0.4} className="py-8">
              <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-teal-500/20 border border-primary/20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:24px_24px]" />
                <div className="relative z-10 text-center space-y-4">
                  <p className="text-xs uppercase tracking-wider text-primary font-semibold">
                    Story Feedback
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Take the Story Survey
                  </h2>
                  <p className="text-sm text-foreground/60 max-w-md mx-auto">
                    3 quick questions in the same story vibe to shape what we build next.
                  </p>
                  <Button
                    size="lg"
                    className="h-11 px-6 rounded-xl text-sm font-medium"
                    onClick={() => {
                      setSurveyIndex(0);
                      setSurveyAnswers({});
                      setAppState("survey");
                    }}
                  >
                    Start Survey <ArrowRight className="size-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Container>

            <Container
              animation="fadeUp"
              delay={0.5}
              className="max-w-3xl mx-auto w-full pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-foreground/30 px-4"
            >
              <p className="text-[10px] font-medium">
                © 2026 Budget Ndio Story.
              </p>
              <div className="flex items-center gap-4 text-[9px] font-medium uppercase tracking-wider">
                <a
                  href="mailto:info@budgetndiostory.com"
                  className="hover:text-foreground"
                >
                  Email
                </a>
                <a href="#" className="hover:text-foreground">
                  Privacy
                </a>
                <a href="#" className="hover:text-foreground">
                  Terms
                </a>
              </div>
            </Container>
          </div>
        </div>
      </Wrapper>
      <style jsx>{`
        .lr-folder {
          position: absolute;
          width: 190px;
          height: 132px;
          perspective: 1300px;
        }
        .lr-shell {
          position: relative;
          width: 100%;
          height: 100%;
          animation: lrFloat 5.1s ease-in-out infinite;
        }
        .lr-folder-a {
          right: 5%;
          top: 0;
        }
        .lr-folder-b {
          right: 22%;
          top: 36px;
        }
        .lr-folder-c {
          right: -1%;
          top: 72px;
        }
        .lr-folder-b .lr-shell {
          animation-delay: 0.4s;
        }
        .lr-folder-c .lr-shell {
          animation-delay: 0.8s;
        }
        .lr-layer {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          transform-origin: bottom center;
          transition: transform 450ms ease;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .lr-l4 {
          background: linear-gradient(to bottom, #2a2d37, #16171d);
          transform: rotateX(-7deg);
        }
        .lr-l3 {
          inset: 5px;
          background: linear-gradient(to bottom, rgba(56, 189, 248, 0.22), rgba(14, 116, 144, 0.12));
          transform: rotateX(-13deg);
        }
        .lr-l2 {
          inset: 9px;
          background: linear-gradient(to bottom, rgba(251, 191, 36, 0.36), rgba(217, 119, 6, 0.3));
          transform: rotateX(-20deg);
        }
        .lr-l1 {
          inset: 13px;
          background: linear-gradient(to bottom, #fbbf24, #d97706);
          box-shadow: inset 0 18px 34px rgba(251, 191, 36, 0.24), 0 14px 24px rgba(0, 0, 0, 0.3);
          transform: rotateX(-29deg);
        }
        .group:hover .lr-l3 {
          transform: rotateX(-20deg);
        }
        .group:hover .lr-l2 {
          transform: rotateX(-30deg);
        }
        .group:hover .lr-l1 {
          transform: rotateX(-39deg) translateY(1px);
        }
        @keyframes lrFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }
      `}</style>
    </section>
  );
}
