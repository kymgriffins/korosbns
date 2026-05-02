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
    title: "Phase 1: Formulation (The Blueprint)",
    summary: "How the government decides where your money goes before the first shilling is spent.",
    sourceLabel: "Formulation",
    category: "The Process",
    html: `
      <div class="notion-content">
        <p>Budget formulation is where the "Big Plan" happens. Between August and February, the National Treasury and Ministries sit down to draft the <strong>Budget Policy Statement (BPS)</strong>.</p>
        
        <div class="notion-callout bg-blue-500/10 border-blue-500/30">
          <p><strong>💡 The Pocketbook Impact:</strong> This phase decides if your bread will cost more or if the local clinic will finally get that new X-ray machine. If you wait until June to speak up, you're already 4 months late.</p>
        </div>

        <h3>1. The "Big Three" Fiscal Pillars</h3>
        <ul>
          <li><strong>Revenue Targets:</strong> Kenya aims to collect approx. <strong>KES 3.6 Trillion</strong> in FY 2026/27. Most comes from taxes (KRA), but the "Tax Burden" is currently growing faster than the average household income.</li>
          <li><strong>The Debt Ratio:</strong> For every KES 100 collected by KRA, nearly <strong>KES 60</strong> is earmarked for debt servicing (interest + principal). This leaves only KES 40 for everything else.</li>
          <li><strong>The Deficit:</strong> We plan to spend KES 4.7T but only earn KES 3.6T. The <strong>KES 1.1T Gap</strong> is filled by borrowing from local banks and foreign lenders.</li>
        </ul>

        <h3>2. Sector Focus: What's in it for you?</h3>
        <p>Instead of looking at billions, look at the <strong>Per Capita Spend</strong> (per Kenyan):</p>
        <table class="notion-table">
          <thead>
            <tr><th>Sector</th><th>Total Allocation</th><th>Impact Per Kenyan</th></tr>
          </thead>
          <tbody>
            <tr><td>Education</td><td>KES 650B</td><td>Approx. KES 12,000/year</td></tr>
            <tr><td>Health</td><td>KES 140B</td><td>Approx. KES 2,600/year</td></tr>
            <tr><td>Agriculture</td><td>KES 60B</td><td>Approx. KES 1,100/year</td></tr>
          </tbody>
        </table>

        <h3>3. The Calendar: Your Window of Influence</h3>
        <p><strong>February 15th:</strong> The BPS is submitted. This is the <em>most critical</em> window for citizens to lobby for changes in sector ceilings.</p>
        
        <div class="notion-cta">
          <h4>📣 Take Action</h4>
          <p>Submit your memo on the BPS to the Clerk of the National Assembly by <strong>February 20th</strong>. Email: <a href="mailto:clerk@parliament.go.ke">clerk@parliament.go.ke</a></p>
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
  if (!fallback) {
    // If slug is not in fallbacks, return a dummy or error.
    return {
       slug, title: "Not Found", summary: "Article not found", sourceLabel: "Unknown", html: "<p>Content not found.</p>"
    };
  }

  // For now, always use fallbacks for these 4 new ones to ensure "Notion" quality.
  if (Object.keys(FALLBACK_ARTICLES).includes(slug)) {
    return fallback;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/deep-dives/${slug}/`, {
      next: { revalidate: 600 },
    });
    if (!response.ok) return fallback;
    const data = await response.json();
    return {
      slug,
      title: String(data.title || fallback.title),
      summary: String(data.summary || fallback.summary),
      sourceLabel: String(data.source_doc_type || fallback.sourceLabel),
      html: toHtml(String(data.content_html || fallback.html)),
      updatedAt: typeof data.updated_at === "string" ? data.updated_at : undefined,
    };
  } catch {
    return fallback;
  }
}

export const deepDiveCards = [
  {
    id: "budget-formulation",
    title: "1. Formulation (The Blueprint)",
    subtitle: "How the government decides spending priorities before they are final.",
    href: "/learn/deep-dives/budget-formulation",
    image: "/images/gradient.svg",
    accent: "from-blue-400/85 via-indigo-400/80 to-violet-500/75",
  },
  {
    id: "budget-approval",
    title: "2. Approval (The Checkpoint)",
    subtitle: "The window for public participation and Parliament's final vote.",
    href: "/learn/deep-dives/budget-approval",
    image: "/images/project.svg",
    accent: "from-amber-400/85 via-orange-400/80 to-rose-500/75",
  },
  {
    id: "budget-implementation",
    title: "3. Implementation (The Action)",
    subtitle: "Tracking money from the Treasury to your local community projects.",
    href: "/learn/deep-dives/budget-implementation",
    image: "/images/invoices.svg",
    accent: "from-emerald-400/85 via-teal-400/80 to-cyan-500/75",
  },
  {
    id: "budget-audit-evaluation",
    title: "4. Audit & Evaluation (The Scorecard)",
    subtitle: "Checking the receipts. Did the money go where it was promised?",
    href: "/learn/deep-dives/budget-audit-evaluation",
    image: "/images/analytics.svg",
    accent: "from-rose-400/85 via-pink-400/80 to-fuchsia-500/75",
  },
] as const;
