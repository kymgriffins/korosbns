"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Clock, BookOpen, Newspaper, FileText, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Routes } from "@/constants/routes";
import { SectionHeader, SectionShell } from "@/layouts/section-shell";
import { staggerContainer, fadeInUp } from "@/motion/variants";

interface BlogCard { title: string; description: string; category: string; readTime: string; href: string; icon: React.ElementType; }

const featuredArticles: BlogCard[] = [
  { title: "Understanding Kenya's National Budget", description: "A beginner-friendly breakdown of how Kenya's national budget works.", category: "Budget 101", readTime: "8 min read", href: `${Routes.Learn}/articles/budget-101`, icon: BookOpen },
  { title: "County Allocation of Revenue Bills", description: "How funds are distributed across Kenya's 47 counties.", category: "Policy", readTime: "6 min read", href: `${Routes.Learn}/articles/county-allocations`, icon: FileText },
  { title: "Tracking Public Projects Near You", description: "Use our tools to monitor government projects in your area.", category: "Civic Tech", readTime: "5 min read", href: Routes.Learn, icon: Video },
  { title: "Kenya's Debt Story Explained", description: "What you need to know about Kenya's public debt.", category: "Economy", readTime: "10 min read", href: `${Routes.Learn}/articles/debt-explained`, icon: Newspaper },
];

const categoryColors: Record<string, string> = {
  "Budget 101": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Policy: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "Civic Tech": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Economy: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export default function IntroBlogViews() {
  return (
    <SectionShell className="overflow-hidden bg-background">
      <SectionHeader
        eyebrow="From Our Blog"
        title={<>Learn how <span className="font-heading italic text-primary">budgets</span> shape your world</>}
        description="Short reads that turn complex fiscal policy into clear, actionable knowledge."
      />
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {featuredArticles.map((article) => {
          const Icon = article.icon;
          return (
            <motion.div key={article.title} variants={fadeInUp} className="group relative">
              <Link href={article.href} className="block h-full">
                <div className="relative flex h-full flex-col rounded-2xl border border-border/40 bg-card p-6 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/5">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10"><Icon className="size-6 text-primary" /></div>
                  <Badge variant="secondary" className={`mb-3 w-fit rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${categoryColors[article.category] || "bg-muted text-muted-foreground"}`}>{article.category}</Badge>
                  <h3 className="mb-2 text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors">{article.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-foreground/60 flex-1">{article.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-foreground/40"><Clock className="size-3.5" />{article.readTime}</span>
                    <span className="flex size-8 items-center justify-center rounded-full bg-foreground/5 text-foreground/40 transition-all group-hover:bg-primary group-hover:text-primary-foreground"><ArrowRight className="size-4" /></span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5 }} className="mt-12 text-center">
        <Link href={Routes.Learn}><Button variant="outline" size="lg" className="gap-2 rounded-full px-8 py-6 text-base font-bold"><BookOpen className="size-5" />Browse All Articles<ArrowRight className="size-5" /></Button></Link>
      </motion.div>
    </SectionShell>
  );
}
