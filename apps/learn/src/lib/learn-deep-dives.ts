import { API_BASE_URL } from "@/lib/api-config";

export type DeepDiveArticle = {
  slug: string;
  title: string;
  summary: string;
  sourceLabel: string;
  html: string;
  updatedAt?: string;
  category?: string;
};

const FALLBACK_ARTICLES: Record<string, DeepDiveArticle> = {
  "budget-formulation": {
    slug: "budget-formulation",
    title: "Beyond the Bill: A Young Person’s Guide to Kenya’s Budget",
    summary: "Young people cannot lead unless they are informed. Discover why the BPS matters more than the Finance Bill.",
    sourceLabel: "Formulation",
    category: "The Process",
    html: `
      <div class="notion-content">
        <p class="text-xs text-foreground/50 mb-6 font-medium uppercase tracking-widest">By James Maingi Mutinda & Nelly Maina</p>
        
        <p>Good morning, good afternoon, and good evening. Welcome to <strong>Budget Ndio Story</strong>, where we make public money make sense.</p>
        
        <div class="notion-callout bg-primary/5 border-primary/20">
          <p><strong>"Young people cannot lead unless they are informed. They cannot influence unless they have knowledge."</strong> If we want to change the course of this country, we have to move beyond opinions and build substantial capacity on national issues.</p>
        </div>

        <p>Recently, we sat down to unpack what is happening in the budget, in policy, and in current affairs. As a young person in Kenya, what questions should you ask? We invited <strong>Tom Ogoda</strong> (TISA) and <strong>Millicent Makina</strong> (Board Advisor & Senior Analyst) to help us find out.</p>

        <h3>The Road Trip Analogy: Why You’re Shouting at the Wrong Time</h3>
        
        <div class="notion-callout bg-amber-500/10 border-amber-500/30">
          <p>Picture this: You and your friends are planning a road trip. You decide where to go, where to sleep (a 5-star hotel or a <em>kibanda</em>), and where to eat. Throughout this planning, you make no comments. But at the end of the trip, the bill comes, and suddenly you are shouting.</p>
          <p><strong>In this analogy, the Finance Bill is that final bill. The planning phase you ignored is the budgeting process (BPS).</strong></p>
        </div>

        <h3>📺 Video Briefing: Understanding the BPS</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
          <div class="aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <iframe class="w-full h-full border-0" src="https://www.youtube-nocookie.com/embed/Ed9lP0-komE" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          </div>
          <div class="aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <iframe class="w-full h-full border-0" src="https://www.youtube-nocookie.com/embed/wkPe3sWomoA" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          </div>
          <div class="aspect-video overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <iframe class="w-full h-full border-0" src="https://www.youtube-nocookie.com/embed/FkgRz4v2Llk" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          </div>
        </div>

        <h3>The Four Stages of Kenya’s Budget (And Where You Fit In)</h3>
        <p>The process follows a strict calendar, but most citizens only tune in at the very end. Here is the breakdown:</p>
        <ol>
          <li><strong>Formulation (Aug - Feb):</strong> Where the budget is prepared. Setting guidelines and sector ceilings.</li>
          <li><strong>Approval (April - June):</strong> Where the budget is discussed and approved (Finance Bill season).</li>
          <li><strong>Implementation (July onwards):</strong> Where the money is actually spent.</li>
          <li><strong>Audit:</strong> Where the books are reviewed to check for accountability.</li>
        </ol>
        
        <p>Most young people tune in during stage two (the Finance Bill drama). But the real power lies in <strong>Stage 1: Formulation</strong>. As Millicent put it: <em>“Don’t wait until the salt is in the pot to say you don’t take salt.”</em></p>

        <div class="notion-callout bg-blue-500/10 border-blue-500/30">
          <p><strong>What is the Budget Policy Statement (BPS)?</strong> Released around Feb 14th, it answers: How did the economy perform? How much money is available? And what are the government's priorities (BETA)?</p>
        </div>

        <h3>Why "Ceilings" and "Macroeconomics" Matter</h3>
        <p>Tom Ogoda simplified the jargon:</p>
        <ul>
          <li><strong>Ceiling:</strong> Think of it as the highest possible amount a ministry is allowed to spend. It’s not final, but it guides all planning.</li>
          <li><strong>Macroeconomics:</strong> The big picture—how global trends, inflation, and GDP affect your wallet.</p>
        </ul>

        <h3>The "Noise" Trap</h3>
        <p>Tom issued a stark warning: <em>“If you try to engage after the BPS is passed, the ministry calls it ‘noise.’ Look at the Finance Bill 2024. If not for the storming of Parliament, it would have passed anyway. The revenue measures were already locked in the BPS.”</em></p>

        <div class="notion-callout bg-rose-500/10 border-rose-500/30">
          <p><strong>Warning:</strong> By the time you see announcements on TV, it’s often too late to change the big things. The BPS is where the ingredients are added to the pot.</p>
        </div>

        <h3>Manifesto for Informed Influence</h3>
        <ul>
          <li><strong>Demand Summaries:</strong> We need the BPS translated into local dialects, Sheng, and simplified Swahili.</li>
          <li><strong>Engage Early:</strong> The <em>Sector Working Groups</em> meet between August and December. That is when you ask: Why this and not that?</li>
          <li><strong>Track Policies:</strong> Don’t just look at numbers. If a plan had 5 goals last year and only 3 now, ask what happened to the other two.</li>
        </ul>

        <h3>The Weekly Attention Grabbers</h3>
        <p>Before closing, our experts shared what caught their eye this week:</p>
        <ul>
          <li><strong>Tom:</strong> Millions lost via CDF and e-Citizen—and the confrontational attitude of leadership regarding accountability.</li>
          <li><strong>Millicent:</strong> The ongoing standoff over the Division of Revenue for counties between the Senate and Council of Governors.</li>
        </ul>

        <div class="notion-cta">
          <h4>📣 Take Action</h4>
          <p>Submit your memo on the BPS to the Clerk of the National Assembly by <strong>February 20th</strong>. </a>. You can also send a copy to us at <a href="mailto:info@budgetndiostory.org">info@budgetndiostory.org</a> and we'll track it in our collective advocacy report.</p>
        </div>
      </div>
    `,
  },
  "budget-approval": {
    slug: "budget-approval",
    title: "Phase 2: Approval (The Checkpoint)",
    summary: "Parliament's role in vetting the budget and where you come in.",
    sourceLabel: "Approval",
    category: "The Process",
    html: `
      <div class="notion-content">
        <p>Once the Treasury drafts the budget, it goes to the "People's Representatives"—Parliament. They have the power to slash spending or reallocate funds based on public needs.</p>

        <div class="notion-callout bg-amber-500/10 border-amber-500/30">
          <p><strong>⚠️ Demystifying Jargon:</strong> When you hear <strong>"Appropriation Bill,"</strong> just think "The Spending Permit." Without this bill being signed by the President by June 30th, the government cannot legally spend a single cent.</p>
        </div>

        <h3>📺 Video Overview: The Approval Stage</h3>
        <div class="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5 my-8">
          <iframe class="w-full h-full border-0" src="https://www.youtube-nocookie.com/embed/Ed9lP0-komE" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>

        <h3>1. Public Participation: The "Noise" Window</h3>
        <p>By law, the Budget and Appropriations Committee must hold public hearings. In March and April, teams travel across all 47 counties to hear what Kenyans want.</p>
        
        <h3>2. The "Accountability Trail"</h3>
        <p>Watch out for <strong>Supplementary Budgets</strong>. Often, the government asks for more money mid-year. If not checked, this is where "hidden" spending often happens.</p>

        <div class="notion-cta">
          <h4>📍 How to Participate</h4>
          <ul>
            <li><strong>Venues:</strong> Check the Daily Nation or Standard newspapers in March for hearing locations in your county.</li>
            <li><strong>Online:</strong> You can follow live sessions on Parliament TV or submit digital petitions via the official portal.</li>
          </ul>
        </div>
      </div>
    `,
  },
  "budget-implementation": {
    slug: "budget-implementation",
    title: "Phase 3: Implementation (The Action)",
    summary: "From the CS speech to the ground—how money actually reaches your community.",
    sourceLabel: "Implementation",
    category: "The Process",
    html: `
      <div class="notion-content">
        <p>This is the longest phase (July to June). The National Treasury releases funds to Ministries and Counties. But does it actually arrive?</p>

        <h3>📺 Video Overview: Bringing the Budget to the Ground</h3>
        <div class="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5 my-8">
          <iframe class="w-full h-full border-0" src="https://www.youtube-nocookie.com/embed/Ed9lP0-komE" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>

        <h3>1. The Absorption Rate Trap</h3>
        <p>A Ministry might be allocated KES 10B, but if their <strong>Absorption Rate</strong> is only 60%, KES 4B stays unspent due to inefficiency, while your roads remain unfinished.</p>

        <div class="notion-callout bg-emerald-500/10 border-emerald-500/30">
          <p><strong>🌱 Localize it:</strong> Your neighborhood road is likely funded by the <strong>County Budget</strong>. Look for your <strong>CIDP (County Integrated Development Plan)</strong>. It affects you more directly than the National Budget!</p>
        </div>

        <h3>2. Pending Bills: The Economy Killer</h3>
        <p>When the government takes services from small businesses but doesn't pay on time, it creates "Pending Bills." High pending bills mean less cash in the local economy and fewer jobs for youth.</p>
        
        <h3>3. The Role of the Controller of Budget (CoB)</h3>
        <p>The CoB acts as the "Bouncer." They only allow money to leave the Central Bank if it was approved by Parliament. Check their quarterly reports to see how much your County has actually spent.</p>
      </div>
    `,
  },
  "budget-audit-evaluation": {
    slug: "budget-audit-evaluation",
    title: "Phase 4: Audit & Evaluation (The Scorecard)",
    summary: "The post-mortem. Finding out if the money was stolen or used as promised.",
    sourceLabel: "Audit",
    category: "The Process",
    html: `
      <div class="notion-content">
        <p>After the year ends, the <strong>Auditor General</strong> steps in to check the books. This is where we find out if the KES 100 spent on a desk actually bought a desk.</p>

        <h3>📺 Video Overview: Accountability & Audit</h3>
        <div class="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-white/5 my-8">
          <iframe class="w-full h-full border-0" src="https://www.youtube-nocookie.com/embed/Ed9lP0-komE" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>

        <h3>1. The Auditor General's Report</h3>
        <p>Look for terms like "Unqualified Opinion" (The books are clean) vs. "Adverse Opinion" (Significant money is missing or unaccounted for).</p>

        <div class="notion-callout bg-rose-500/10 border-rose-500/30">
          <p><strong>📉 The Pocketbook Reality:</strong> Audit findings are the basis for the next year's budget. If a project failed the audit, citizens should use that data to demand better allocations in the next Formulation phase.</p>
        </div>

        <h3>2. Measuring "Value for Money"</h3>
        <p>Did the "Hustler Fund" actually grow small businesses? Did the "Fertilizer Subsidy" lower your unga price? Evaluation is about asking: <em>"Was it worth it?"</em></p>

        <div class="notion-cta">
          <h4>📊 Citizen Scorecard</h4>
          <p>Join local social audit groups to track projects in your ward. Use the <strong>Budget Ndio Story</strong> repository to compare planned vs. actual outcomes.</p>
        </div>
      </div>
    `,
  },
};

const toHtml = (content: string) => {
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  if (hasHtml) return content;
  return content
    .split(/\n{2,}/)
    .map((chunk) => `<p>${chunk.replace(/\n/g, "<br />")}</p>`)
    .join("");
};

export async function fetchDeepDiveArticle(slug: string): Promise<DeepDiveArticle> {
  const fallback = FALLBACK_ARTICLES[slug];

  try {
    const response = await fetch(`${API_BASE_URL}/api/deep-dives/${slug}/`, {
      next: { revalidate: 60 },
    });
    if (response.ok) {
      const data = await response.json();
      return {
        slug,
        title: String(data.title || fallback?.title || slug),
        summary: String(data.summary || fallback?.summary || ""),
        sourceLabel: String(data.source_doc_type || fallback?.sourceLabel || "Learn"),
        html: toHtml(String(data.content_html || fallback?.html || "")),
        updatedAt: typeof data.updated_at === "string" ? data.updated_at : undefined,
        category: typeof data.category === "string" ? data.category : fallback?.category,
      };
    }
  } catch {
    /* use curated fallback only when API is unreachable */
  }

  if (fallback) return fallback;

  return {
    slug,
    title: "Not Found",
    summary: "Article not found",
    sourceLabel: "Unknown",
    html: "<p>Content not found.</p>",
  };
}

export const deepDiveCards = [
  {
    id: "budget-formulation",
    title: "1. Formulation (The Blueprint)",
    subtitle: "How the government decides spending priorities before they are final.",
    href: "/deep-dives/budget-formulation",
    image: "/images/explainer-formulation.png",
    accent: "from-blue-400/85 via-indigo-400/80 to-violet-500/75",
  },
  {
    id: "budget-approval",
    title: "2. Approval (The Checkpoint)",
    subtitle: "The window for public participation and Parliament's final vote.",
    href: "/deep-dives/budget-approval",
    image: "/images/explainer-approval.png",
    accent: "from-amber-400/85 via-orange-400/80 to-rose-500/75",
  },
  {
    id: "budget-implementation",
    title: "3. Implementation (The Action)",
    subtitle: "Tracking money from the Treasury to your local community projects.",
    href: "/deep-dives/budget-implementation",
    image: "/images/explainer-implementation.png",
    accent: "from-emerald-400/85 via-teal-400/80 to-cyan-500/75",
  },
  {
    id: "budget-audit-evaluation",
    title: "4. Audit & Evaluation (The Scorecard)",
    subtitle: "Checking the receipts. Did the money go where it was promised?",
    href: "/deep-dives/budget-audit-evaluation",
    image: "/images/explainer-audit.png",
    accent: "from-rose-400/85 via-pink-400/80 to-fuchsia-500/75",
  },
] as const;
