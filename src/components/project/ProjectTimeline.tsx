"use client";

import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { CheckCircle, Clock, Target } from "lucide-react";

type Milestone = {
  date: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "upcoming";
  image_url?: string;
};

const projectMilestones: Record<string, Milestone[]> = {
  "budget-literacy": [
    { date: "Q1 2024", title: "Curriculum Design", description: "Designed the first civic budget literacy curriculum covering the budget cycle, sector allocations, and parliamentary processes.", status: "completed" },
    { date: "Q2 2024", title: "First Module Launch", description: "Launched the inaugural 'Budget 101' interactive module reaching 5,000+ citizens in the first month.", status: "completed", image_url: "/images/towwnhallmay/129A3912.jpg" },
    { date: "Q3 2024", title: "Sector Deep-Dives", description: "Published sector-specific breakdowns for Education, Health, Infrastructure, and Agriculture budgets.", status: "completed" },
    { date: "Q1 2025", title: "School Partnerships", description: "Partnered with 15 universities and colleges to integrate budget literacy into civic education curricula.", status: "completed", image_url: "/images/towwnhallmay/129A3863.jpg" },
    { date: "Q3 2025", title: "Kiswahili Modules", description: "Launched Kiswahili-translated modules to reach non-English-speaking citizens across rural Kenya.", status: "completed" },
    { date: "Q1 2026", title: "Gamified Learning", description: "Introduced XP points, streaks, and leaderboards to make budget learning engaging for youth.", status: "completed" },
    { date: "Q2 2026", title: "AI Tutor Pilot", description: "Testing an AI-powered budget tutor that answers citizen questions in real-time in English and Kiswahili.", status: "in_progress" },
    { date: "Q4 2026", title: "National Rollout", description: "Expand programme to all 47 counties with localized budget content and community facilitators.", status: "upcoming" },
  ],
  "county-budget-tracking": [
    { date: "Q2 2024", title: "County Research", description: "Began research into county budget allocation patterns across all 47 counties.", status: "completed" },
    { date: "Q3 2024", title: "Pilot Counties", description: "Launched pilot tracking in 5 counties: Nairobi, Kisumu, Mombasa, Nakuru, and Uasin Gishu.", status: "completed", image_url: "/images/towwnhallmay/129A3923.jpg" },
    { date: "Q1 2025", title: "County Toolkits", description: "Developed standardized county budget analysis toolkits for citizen use.", status: "completed" },
    { date: "Q2 2025", title: "20-County Expansion", description: "Expanded tracking coverage to 20 counties through partnerships with civil society organizations.", status: "completed", image_url: "/images/towwnhallmay/129A4056.jpg" },
    { date: "Q4 2025", title: "Public Dashboard", description: "Launched a public-facing dashboard showing real-time county allocations and expenditure data.", status: "completed" },
    { date: "Q1 2026", title: "Devolution Reports", description: "Published comparative devolution reports highlighting county performance and resource allocation trends.", status: "completed" },
    { date: "Q2 2026", title: "All 47 Counties", description: "Scaling hyper-local budget tracking to all 47 counties with community-based monitors.", status: "in_progress" },
    { date: "Q3 2026", title: "Automated Alerts", description: "Deploy automated SMS and WhatsApp alerts for county budget changes and public participation windows.", status: "upcoming" },
  ],
  "public-participation": [
    { date: "Q3 2024", title: "Platform Conception", description: "Identified the gap in citizen awareness of public participation windows in the budget process.", status: "completed" },
    { date: "Q1 2025", title: "MVP Launch", description: "Launched the Public Participation Hub MVP with alerts for national budget hearings.", status: "completed" },
    { date: "Q2 2025", title: "Finance Bill 2025", description: "Guided 2,000+ citizens through submitting memoranda on the Finance Bill 2025 via the platform.", status: "completed", image_url: "/images/towwnhallmay/129A4094.jpg" },
    { date: "Q3 2025", title: "County Integration", description: "Expanded to include county-level public participation windows across all 47 counties.", status: "completed" },
    { date: "Q4 2025", title: "Memorandum Templates", description: "Created simplified memorandum templates in English and Kiswahili for easy citizen submissions.", status: "completed" },
    { date: "Q1 2026", title: "SMS Alerts", description: "Launched SMS-based notifications for citizens without smartphone access.", status: "completed" },
    { date: "Q2 2026", title: "AI Memorandum Assistant", description: "Building an AI assistant that helps citizens draft and submit memoranda in their preferred language.", status: "in_progress" },
    { date: "Q4 2026", title: "National Scale", description: "Target 100,000+ citizen submissions through the platform for FY2027/28 budget cycle.", status: "upcoming" },
  ],
};

const defaultMilestones: Milestone[] = [
  { date: "Q1 2024", title: "Project Inception", description: "Budget Ndio Story launched as a youth-led initiative to translate Kenya's national budget into accessible civic narratives.", status: "completed" },
  { date: "Q2 2024", title: "First Budget Breakdown", description: "Published the first comprehensive breakdown of the FY2024/25 budget, reaching over 10,000 citizens across social media.", status: "completed" },
  { date: "Q3 2024", title: "Learning Platform MVP", description: "Launched the civic education platform with interactive modules covering the budget cycle, Finance Bill analysis, and county allocations.", status: "completed" },
  { date: "Q3 2025", title: "Multilingual Content", description: "Launched Kiswahili and Sheng content tracks to reach younger and non-English-speaking audiences across Kenya.", status: "completed" },
  { date: "Q1 2026", title: "Gamification & Leaderboards", description: "Introduced gamified learning with XP points, streaks, and leaderboard competitions to increase civic engagement among youth.", status: "completed" },
  { date: "Q2 2026", title: "County Budget Toolkits", description: "Developing hyper-local budget toolkits for all 47 counties, enabling citizens to track county-level allocations and expenditures.", status: "in_progress" },
  { date: "Q3 2026", title: "AI Budget Assistant", description: "Building an AI-powered chatbot to answer citizen questions about the budget in real-time.", status: "in_progress" },
  { date: "2027", title: "Sustainability & Scale", description: "Establish BNS as a self-sustaining social enterprise reaching 1M+ Kenyans.", status: "upcoming" },
];

type Props = {
  limit?: number;
  projectId?: string;
};

export function ProjectTimeline({ limit, projectId }: Props) {
  const milestones = projectId && projectMilestones[projectId]
    ? projectMilestones[projectId]
    : defaultMilestones;
  const items = limit ? milestones.slice(0, limit) : milestones;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative"
    >
      <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/60 md:left-1/2 md:-translate-x-px" />

      {items.map((milestone, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          className="relative pl-14 pb-12 md:pl-0 md:even:pr-14 md:odd:pl-14 md:w-1/2 md:odd:ml-0 md:even:ml-auto md:odd:text-right"
        >
          <div
            className={`absolute left-2.5 top-1 size-7 rounded-full flex items-center justify-center md:left-auto md:odd:right-[-14px] md:even:left-[-14px] ${
              milestone.status === "completed"
                ? "bg-primary text-primary-foreground"
                : milestone.status === "in_progress"
                  ? "bg-amber-500 text-white"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {milestone.status === "completed" ? (
              <CheckCircle className="size-4" />
            ) : milestone.status === "in_progress" ? (
              <Clock className="size-4" />
            ) : (
              <Target className="size-4" />
            )}
          </div>

          <div className="space-y-2">
            <span
              className={`inline-block text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                milestone.status === "completed"
                  ? "bg-primary/10 text-primary"
                  : milestone.status === "in_progress"
                    ? "bg-amber-500/10 text-amber-600"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {milestone.date}
            </span>
            <h3 className="font-semibold text-lg">{milestone.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {milestone.description}
            </p>
            {milestone.image_url && (
              <div className="mt-3 rounded-xl overflow-hidden border border-border/40">
                <img
                  src={milestone.image_url}
                  alt={milestone.title}
                  className="w-full h-40 object-cover"
                />
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
