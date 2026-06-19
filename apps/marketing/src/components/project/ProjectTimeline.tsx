"use client";

import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { CheckCircle, Clock, Target } from "lucide-react";

type Milestone = {
  date: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "upcoming";
};

const milestones: Milestone[] = [
  {
    date: "Q1 2024",
    title: "Project Inception",
    description:
      "Budget Ndio Story launched as a youth-led initiative to translate Kenya's national budget into accessible civic narratives.",
    status: "completed",
  },
  {
    date: "Q2 2024",
    title: "First Budget Breakdown",
    description:
      "Published the first comprehensive breakdown of the FY2024/25 budget, reaching over 10,000 citizens across social media.",
    status: "completed",
  },
  {
    date: "Q3 2024",
    title: "Learning Platform MVP",
    description:
      "Launched the civic education platform with interactive modules covering the budget cycle, Finance Bill analysis, and county allocations.",
    status: "completed",
  },
  {
    date: "Q1 2025",
    title: "Community Expansion",
    description:
      "Expanded reach to 20+ counties through partnerships with civil society organizations and county government liaison offices.",
    status: "completed",
  },
  {
    date: "Q2 2025",
    title: "Public Participation Integration",
    description:
      "Integrated public participation alerts and guides, enabling citizens to submit memoranda on the Finance Bill directly through the platform.",
    status: "completed",
  },
  {
    date: "Q3 2025",
    title: "Multilingual Content",
    description:
      "Launched Kiswahili and Sheng content tracks to reach younger and non-English-speaking audiences across Kenya.",
    status: "completed",
  },
  {
    date: "Q4 2025",
    title: "BNS Studio Launch",
    description:
      "Opened BNS Studio for videography, photography, and post-production services to fund operations and expand storytelling capacity.",
    status: "completed",
  },
  {
    date: "Q1 2026",
    title: "Gamification & Leaderboards",
    description:
      "Introduced gamified learning with XP points, streaks, and leaderboard competitions to increase civic engagement among youth.",
    status: "completed",
  },
  {
    date: "Q2 2026",
    title: "County Budget Toolkits",
    description:
      "Developing hyper-local budget toolkits for all 47 counties, enabling citizens to track county-level allocations and expenditures.",
    status: "in_progress",
  },
  {
    date: "Q3 2026",
    title: "AI Budget Assistant",
    description:
      "Building an AI-powered chatbot to answer citizen questions about the budget in real-time — in English, Kiswahili, and Sheng.",
    status: "in_progress",
  },
  {
    date: "Q4 2026",
    title: "Civic Data Dashboard",
    description:
      "Launching a public data dashboard with real-time visualizations of national and county budget execution, procurement, and audit reports.",
    status: "upcoming",
  },
  {
    date: "2027",
    title: "Sustainability & Scale",
    description:
      "Establish BNS as a self-sustaining social enterprise with a membership model, studio revenue, and grant-funded civic programs reaching 1M+ Kenyans.",
    status: "upcoming",
  },
];

type Props = {
  limit?: number;
};

export function ProjectTimeline({ limit }: Props) {
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
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
