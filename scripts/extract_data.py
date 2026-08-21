import json
import os

hub_stories = [
  {
    "id": "lets-decode",
    "title": "Let's Decode",
    "subtitle": "Bold social-style explainers with punchy hooks",
    "duration": "2m 30s",
    "gradient": "from-fuchsia-600 via-violet-600 to-indigo-600",
    "icon": "🔥",
    "action": "Play Story"
  },
  {
    "id": "citizen-street",
    "title": "Citizen Street",
    "subtitle": "Real-life day-to-day budget impact story",
    "duration": "2m 10s",
    "gradient": "from-amber-500 via-orange-500 to-rose-500",
    "icon": "🏙️",
    "action": "Open"
  },
  {
    "id": "future-lab",
    "title": "Future Lab",
    "subtitle": "Neon data-cards, goals, and risk radar",
    "duration": "2m 00s",
    "gradient": "from-blue-600 via-sky-500 to-cyan-500",
    "icon": "🧪",
    "action": "Explore"
  },
  {
    "id": "civic-compass-v2",
    "title": "Civic Compass V2",
    "subtitle": "7-page motion story on wise constitutional leadership",
    "duration": "2m 20s",
    "gradient": "from-blue-700 via-indigo-700 to-slate-900",
    "icon": "🗳️",
    "action": "Start V2"
  },
  {
    "id": "budget-trivia",
    "title": "Trivia Time",
    "subtitle": "Test your history on Kenya's Cabinet Secretaries & Budgets",
    "duration": "1m 30s",
    "gradient": "from-green-600 via-emerald-600 to-teal-700",
    "icon": "🎭",
    "action": "Play Trivia"
  }
]

decode_story_cards = [
  {
    "id": "intro",
    "title": "Let's Decode the Budget! 🔓",
    "subtitle": "Kenya's Money Blueprint",
    "hook": "Hook: This one decision touches your rent, food, and transport.",
    "emoji": "🚪",
    "bg": "from-indigo-500 via-purple-500 to-pink-500",
    "content": "Ever wonder how the government plans to spend YOUR money? Every year, Kenya releases a secret blueprint called the Budget Policy Statement (BPS)! 🗺️",
    "facts": [
      "📋 Sets spending priorities for the year",
      "🏦 Guides both national & county budgets",
      "📅 Due by February 15th",
      "💵 Forms the April national budget"
    ]
  },
  {
    "id": "what-is-bps",
    "title": "What is a BPS Actually? 🤔",
    "subtitle": "Think of it like...",
    "emoji": "💡",
    "bg": "from-amber-500 to-orange-500",
    "content": "It's NOT the actual budget - it's the PREVIEW! Like a movie trailer before the full film. 🎬",
    "stat": { "value": "Feb 15", "label": "📅Deadline (PFM Act)" }
  },
  {
    "id": "beta-intro",
    "title": "Meet BETA! 🚀",
    "subtitle": "The Big Plan for Kenya",
    "hook": "Hook: Five pillars, one national game plan.",
    "emoji": "🚀",
    "bg": "from-cyan-500 to-blue-500",
    "content": "BETA = Bottom-Up Economic Transformation Agenda. That's government speak for 'let's grow Kenya from the ground up!' 🌱",
    "pillars": [
      { "emoji": "🌽", "title": "Agriculture", "desc": "Food for everyone!" },
      { "emoji": "🔥", "title": "Hustlers", "desc": "Small business boost" },
      { "emoji": "🩺", "title": "Healthcare", "desc": "Health for all" },
      { "emoji": "🏠", "title": "Housing", "desc": "Roof over heads" },
      { "emoji": "📱", "title": "Digital", "desc": "Internet for Kenya" }
    ]
  },
  {
    "id": "agri",
    "title": "Farm Life! 🌾",
    "subtitle": "From Farm to Table",
    "emoji": "🧑‍🌾",
    "bg": "from-green-500 to-emerald-500",
    "content": "Kenya wants to grow MORE food! Think better seeds, Irrigation everywhere, and livestock that won't get sick. 🥩",
    "facts": [
      "💊 Cheaper fertilizer",
      "💧 Big irrigation projects",
      "💉 Livestock vaccines",
      "🏭 Better storage"
    ]
  },
  {
    "id": "msme",
    "title": "Hustler Energy! ⚡",
    "subtitle": "Small Biz Big Dreams",
    "emoji": "💪",
    "bg": "from-pink-500 to-rose-500",
    "content": "MSMEs = Micro, Small & Medium Enterprises. That's YOUR aunt's duka, the matatu guy, the tailor on the corner! They need cheaper loans! 💰",
    "facts": [
      "💵 Bigger Hustler Fund",
      "🏦 Credit guarantees",
      "📍 Hubs in all 47 counties",
      "📈 Business growth"
    ]
  },
  {
    "id": "health",
    "title": "Health for All! 🏥",
    "subtitle": "No One Left Behind",
    "emoji": "❤️",
    "bg": "from-red-500 to-pink-500",
    "content": "SHA = Social Health Authority. The goal? 35 MILLION Kenyans with health cover! That's almost everyone! 🙌",
    "facts": [
      "👩‍⚕️ Community health workers",
      "🏗️ New clinics",
      "💻 Digital health records",
      "💊 Free medicine"
    ]
  },
  {
    "id": "numbers-intro",
    "title": "The Big Numbers! 💰",
    "subtitle": "Let's Talk Billions",
    "hook": "Hook: The size of the gap decides tomorrow's taxes.",
    "emoji": "😱",
    "bg": "from-violet-600 to-purple-600",
    "content": "Buckle up! Here's what the 2026/27 budget looks like in KENYAN SHILLINGS..."
  },
  {
    "id": "revenue",
    "title": "Money In! 📈",
    "subtitle": "Where It Comes From",
    "emoji": "💵",
    "bg": "from-emerald-500 to-teal-500",
    "content": "Total revenue the government expects to collect. Taxes, duties, everything!",
    "stat": { "value": "KES 3.59T", "label": "💰Total Revenue" }
  },
  {
    "id": "expenditure",
    "title": "Money Out! 🛒",
    "subtitle": "Where It Goes",
    "emoji": "🛍️",
    "bg": "from-orange-500 to-amber-500",
    "content": "Total planned spending. Roads, salaries, projects - everything!",
    "stat": { "value": "KES 4.74T", "label": "💸Total Spending" }
  },
  {
    "id": "deficit",
    "title": "The Gap! 😬",
    "subtitle": "Spending More Than You Have",
    "emoji": "📉",
    "bg": "from-red-600 to-rose-600",
    "content": "When you spend more than you earn = deficit. Kenya borrows to fill the gap!",
    "stat": { "value": "KES 1.15T", "label": "🚨The Gap!" },
    "note": "🤝 KES 225B foreign + KES 924B domestic"
  },
  {
    "id": "debt",
    "title": "Debt Alarm! 🚨",
    "subtitle": "Already Committed?",
    "emoji": "😰",
    "bg": "from-yellow-500 to-orange-500",
    "content": "-interest on old loans. This money is GONE before anything else! Can't use it for roads or schools.",
    "stat": { "value": "KES 1.2T", "label": "⚠️Already Committed" }
  },
  {
    "id": "counties",
    "title": "Going Local! 🗺️",
    "subtitle": "Counties Get Cash",
    "emoji": "🏛️",
    "bg": "from-blue-500 to-indigo-500",
    "content": "47 counties get a slice for local roads, health centers, markets!",
    "stat": { "value": "KES 420B", "label": "💵To Counties" },
    "services": ["🛣️Roads", "🏥Health", "💧Water", "🏪Markets", "🎪Events"]
  },
  {
    "id": "risks",
    "title": "Watch Out! ⚠️",
    "subtitle": "Budget Danger Zones",
    "hook": "Hook: These risks can flip a good budget fast.",
    "emoji": "⚡",
    "bg": "from-gray-700 to-gray-900",
    "content": "Things that could mess up the budget:",
    "risks": [
      { "title": "📈 Debt spiral", "desc": "More borrowing = more interest" },
      { "title": "🏦 SOE bailouts", "desc": "State company losses" },
      { "title": "📉 Economy slow", "desc": "Less tax collected" },
      { "title": "🌧️ Climate", "desc": "Droughts + floods" },
      { "title": "📢 Counties", "desc": "More demands" }
    ]
  },
  {
    "id": "quiz-prompt",
    "title": "Ready to Quiz? 🎯",
    "subtitle": "Test Your Knowledge",
    "emoji": "🏆",
    "bg": "from-amber-500 via-orange-500 to-red-500",
    "content": "You made it! Let's see how much you remember. 🎮",
    "prompt": True
  }
]

citizen_street_cards = [
  {
    "id": "street-intro",
    "title": "Morning in Githurai ☀️",
    "subtitle": "Budget meets daily life",
    "hook": "Hook: Budget policy quietly prices your entire day.",
    "emoji": "🚐",
    "bg": "from-orange-500 via-amber-500 to-yellow-500",
    "content": "You wake up, board a matatu, buy breakfast, and head to work. Every one of those costs is shaped by taxes, fuel policy, and county planning.",
    "facts": ["🚌 Transport", "🍞 Food prices", "💡 Electricity", "🏥 Health access"]
  },
  {
    "id": "fare",
    "title": "Matatu Fare Shock 😵",
    "subtitle": "Fuel costs ripple everywhere",
    "emoji": "⛽",
    "bg": "from-red-500 to-orange-500",
    "content": "When fuel levies rise, transport operators adjust fares. That pushes up market delivery costs and eventually your lunch bill.",
    "stat": { "value": "KES +20-80", "label": "🚨Typical fare jump band" }
  },
  {
    "id": "market",
    "title": "Soko Realities 🧺",
    "subtitle": "Why unga and mboga shift",
    "emoji": "🥬",
    "bg": "from-green-500 to-emerald-500",
    "content": "Food inflation is not random. Fertilizer subsidies, irrigation investment, and transport costs decide what your basket looks like.",
    "services": ["🌽 Subsidies", "🚚 Logistics", "💧 Irrigation", "📦 Storage"]
  },
  {
    "id": "clinic",
    "title": "Clinic Queue Story 🏥",
    "subtitle": "County money at work",
    "emoji": "🩺",
    "bg": "from-rose-500 to-pink-500",
    "content": "Local clinics depend on county allocation quality. Better prioritization means more drugs, staff, and shorter queues.",
    "stat": { "value": "KES 420B", "label": "🏛️County equitable share" }
  },
  {
    "id": "street-risk",
    "title": "Street Risk Radar ⚠️",
    "subtitle": "What can break the plan",
    "emoji": "🌧️",
    "bg": "from-slate-700 to-slate-900",
    "content": "On the ground, these risks hit first:",
    "risks": [
      { "title": "📉 Slow growth", "desc": "Jobs and household income tighten" },
      { "title": "⛽ Energy spikes", "desc": "Transport and food costs climb" },
      { "title": "🌊 Climate shocks", "desc": "Supply chains and farm output dip" },
      { "title": "🏥 Service pressure", "desc": "Demand rises faster than facilities" }
    ]
  },
  {
    "id": "quiz-prompt",
    "title": "Street Checkpoint 🎯",
    "subtitle": "Ready for the quiz?",
    "emoji": "✅",
    "bg": "from-amber-500 via-orange-500 to-red-500",
    "content": "You now see how policy hits normal life. Let's test it fast.",
    "prompt": True
  }
]

future_lab_cards = [
  {
    "id": "lab-intro",
    "title": "Welcome to Future Lab 🧪",
    "subtitle": "Mission: decode 2026 budget",
    "hook": "Hook: Good allocations create momentum, bad ones create drag.",
    "emoji": "🧠",
    "bg": "from-cyan-500 via-blue-600 to-indigo-700",
    "content": "Think of the budget as a control panel. Each lever affects growth, services, and resilience. Your job is to read the signals before the headlines do."
  },
  {
    "id": "growth-engine",
    "title": "Growth Engine 🚀",
    "subtitle": "Where expansion should come from",
    "emoji": "📈",
    "bg": "from-emerald-500 to-teal-600",
    "content": "If agriculture, MSMEs, and digital sectors scale together, employment and tax revenues become more stable over time.",
    "pillars": [
      { "emoji": "🌾", "title": "Agriculture", "desc": "Food and export stability" },
      { "emoji": "🏪", "title": "MSMEs", "desc": "Fast local job creation" },
      { "emoji": "📶", "title": "Digital", "desc": "Efficiency and inclusion" }
    ]
  },
  {
    "id": "allocation-dashboard",
    "title": "Allocation Dashboard 🖥️",
    "subtitle": "Money in vs money out",
    "emoji": "🧮",
    "bg": "from-violet-600 to-purple-700",
    "content": "The critical question is not only how much is spent, but what share goes to productive investment versus locked obligations.",
    "facts": [
      "💰 Revenue: KES 3.59T",
      "🛒 Spend: KES 4.74T",
      "📉 Deficit: KES 1.15T",
      "🚨 Debt service pressure"
    ]
  },
  {
    "id": "resilience",
    "title": "Resilience Layer 🛡️",
    "subtitle": "Can systems absorb shocks?",
    "emoji": "🌍",
    "bg": "from-blue-500 to-sky-600",
    "content": "Climate, exchange rates, and global prices can all stress fiscal plans. Strong local systems reduce the damage.",
    "services": ["💧 Water systems", "🌾 Food buffers", "🏥 Health readiness", "📊 Data response"]
  },
  {
    "id": "risk-matrix",
    "title": "Risk Matrix 🚨",
    "subtitle": "Priority watchlist",
    "emoji": "🛰️",
    "bg": "from-gray-700 to-black",
    "content": "Four red flags to watch this cycle:",
    "risks": [
      { "title": "💳 Debt rollover", "desc": "Refinancing gets costlier" },
      { "title": "🏢 SOE liabilities", "desc": "Potential bailout burdens" },
      { "title": "📉 Revenue underperformance", "desc": "Targets miss reality" },
      { "title": "🌦️ Climate variability", "desc": "Agriculture and prices swing" }
    ]
  },
  {
    "id": "quiz-prompt",
    "title": "Systems Check 🎯",
    "subtitle": "Test your analyst instincts",
    "emoji": "🧩",
    "bg": "from-indigo-600 via-violet-600 to-fuchsia-600",
    "content": "You finished the lab run. Ready for your final check?",
    "prompt": True
  }
]

civic_compass_v2_cards = [
  {
    "id": "v2-intro",
    "title": "Civic Compass V2",
    "subtitle": "Choose leadership that protects tomorrow",
    "hook": "Hook: One vote can defend the constitution or weaken it.",
    "emoji": "🧭",
    "bg": "from-slate-900 via-indigo-900 to-black",
    "content": "A wise leader does not just promise projects. They protect institutions, follow the constitution, and keep power accountable to citizens.",
    "facts": [
      "🗳️ Your vote shapes systems, not just slogans",
      "⚖️ Law-abiding leadership builds trust",
      "🏛️ Institutions outlive campaign seasons",
      "🧑‍🤝‍🧑 Democracy needs active citizens"
    ]
  },
  {
    "id": "v2-vetting-mindset",
    "title": "Before You Elect, Vet",
    "subtitle": "Leadership is a public trust",
    "emoji": "🔍",
    "bg": "from-zinc-900 via-slate-900 to-blue-900",
    "content": "Treat every candidate like a serious job applicant. Review values, track record, integrity, and respect for lawful process before trusting them with public power.",
    "facts": [
      "📁 Check delivery record and consistency",
      "🧾 Follow known sources of campaign funding",
      "🤝 Watch how they treat critics and media",
      "📚 Verify policy depth, not just charisma"
    ]
  },
  {
    "id": "v2-constitution",
    "title": "Constitution First",
    "subtitle": "No one is above the law",
    "emoji": "⚖️",
    "bg": "from-indigo-900 via-blue-900 to-slate-950",
    "content": "Wise leaders work within constitutional limits: respecting courts, Parliament, county mandates, and independent oversight institutions.",
    "pillars": [
      { "emoji": "🏛️", "title": "Separation of powers", "desc": "No office should overreach" },
      { "emoji": "👩‍⚖️", "title": "Independent judiciary", "desc": "Rights need fair adjudication" },
      { "emoji": "📜", "title": "Rule of law", "desc": "Law guides decisions, not impulse" },
      { "emoji": "🧾", "title": "Public accountability", "desc": "Audit trails and open reporting" }
    ]
  },
  {
    "id": "v2-democracy-check",
    "title": "Democracy Is Daily Work",
    "subtitle": "Beyond election day",
    "emoji": "🕊️",
    "bg": "from-slate-900 via-blue-900 to-indigo-950",
    "content": "Democracy survives when leaders accept scrutiny, respect dissent, and protect civil liberties. Silence and fear are warning signs, not stability.",
    "risks": [
      { "title": "🚫 Attacking oversight", "desc": "Weakens corruption checks" },
      { "title": "🧨 Divisive rhetoric", "desc": "Turns citizens against each other" },
      { "title": "📵 Restricting civic voice", "desc": "Reduces public participation" },
      { "title": "🫥 Dodging transparent reporting", "desc": "Hides performance failures" }
    ]
  },
  {
    "id": "v2-citizen-scorecard",
    "title": "Citizen Vetting Scorecard",
    "subtitle": "Simple test before support",
    "emoji": "✅",
    "bg": "from-blue-900 via-indigo-900 to-slate-950",
    "content": "Use this quick scorecard to compare candidates. If someone fails most tests, they should not get your mandate.",
    "services": [
      "Respects constitutional limits",
      "Publishes clear policy plans",
      "Has clean integrity record",
      "Responds to scrutiny calmly",
      "Builds unity across communities"
    ],
    "tinyLogo": True
  },
  {
    "id": "v2-collective-action",
    "title": "Vote, Then Monitor",
    "subtitle": "Mandate + follow-through",
    "emoji": "📣",
    "bg": "from-zinc-900 via-indigo-900 to-slate-900",
    "content": "Electing wise leaders is the first step. Keep monitoring budgets, laws, procurement, and service delivery so constitutional promises become lived reality.",
    "facts": [
      "📝 Track campaign promises quarterly",
      "🏥 Follow local service outcomes",
      "📊 Demand open performance data",
      "🧭 Stay issue-focused, not personality-focused"
    ]
  },
  {
    "id": "v2-credits",
    "title": "Built by the Dev Team",
    "subtitle": "Design-forward civic storytelling",
    "emoji": "🛠️",
    "bg": "from-black via-slate-900 to-indigo-900",
    "content": "This V2 story is crafted in appreciation of the dev team: motion, interaction, and clarity working together to strengthen democratic civic education.",
    "stat": { "value": "DEVTEAM", "label": "Credits: Design + Engineering + Content" },
    "note": "Thank you for shipping civic tech that helps citizens choose wise, lawful leadership."
  }
]

hub_articles = [
  {
    "id": "guide-2026",
    "title": "Beginner Guide: Understanding BPS 2026",
    "readTime": "7 min read",
    "snippet": "A plain-language article on how the Budget Policy Statement shapes spending."
  },
  {
    "id": "counties-breakdown",
    "title": "County Budgets: What KES 420B Means",
    "readTime": "6 min read",
    "snippet": "How county allocations translate into roads, health, markets, and water services."
  },
  {
    "id": "debt-deficit-explained",
    "title": "Debt and Deficit Explained Simply",
    "readTime": "8 min read",
    "snippet": "Why deficits happen, what borrowing does, and what risks to watch in each cycle."
  }
]

stories_data = {
  "stories": hub_stories,
  "story_flows": {
    "lets-decode": decode_story_cards,
    "citizen-street": citizen_street_cards,
    "future-lab": future_lab_cards,
    "civic-compass-v2": civic_compass_v2_cards
  }
}

articles_data = {
  "articles": hub_articles
}

# Create constants folder if not exists
os.makedirs("d:/M7/BudgetNdioStory/korosbns/src/constants", exist_ok=True)

with open("d:/M7/BudgetNdioStory/korosbns/src/constants/stories.json", "w", encoding="utf-8") as f:
    json.dump(stories_data, f, indent=2, ensure_ascii=False)

with open("d:/M7/BudgetNdioStory/korosbns/src/constants/articles.json", "w", encoding="utf-8") as f:
    json.dump(articles_data, f, indent=2, ensure_ascii=False)

print("JSON files successfully written.")
