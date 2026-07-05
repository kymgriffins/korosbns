"use client";

import { motion } from "motion/react";
import { Newspaper, ExternalLink, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motionTokens } from "@/motion/motion-tokens";

const FEED_ITEMS = [
  {
    id: "1",
    date: "2026-06-15",
    title: "Treasury Releases KES 45.2B for County Allocations",
    category: "Disbursement",
    excerpt: "The National Treasury has disbursed KES 45.2 billion to all 47 counties for the fourth quarter of FY 2025/26.",
  },
  {
    id: "2",
    date: "2026-06-10",
    title: "Public Participation on FY 2026/27 Budget Opens",
    category: "Public Engagement",
    excerpt: "Citizens are invited to submit memoranda on the proposed budget estimates for the upcoming fiscal year.",
  },
  {
    id: "3",
    date: "2026-05-28",
    title: "Supplementary Budget I Tabled in Parliament",
    category: "Legislative",
    excerpt: "The first supplementary budget for FY 2025/26 has been tabled, proposing reallocation of KES 18.7 billion.",
  },
  {
    id: "4",
    date: "2026-05-15",
    title: "Auditor General Reports 78% Absorption Rate",
    category: "Oversight",
    excerpt: "The latest audit report shows a 78% budget absorption rate across national government ministries.",
  },
  {
    id: "5",
    date: "2026-04-28",
    title: "KES 12.8B Allocated for Drought Response",
    category: "Emergency",
    excerpt: "Emergency funds released for drought mitigation in 23 arid and semi-arid counties.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: motionTokens.enter.framer },
};

export function TreasuryFeed() {
  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Newspaper className="size-4 text-primary" />
            Treasury News Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {FEED_ITEMS.map((item, i) => (
              <motion.div key={item.id} variants={fadeItem}
                className="group cursor-pointer rounded-xl border border-border/40 p-4 transition-all hover:border-primary/20 hover:bg-muted/30 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <Badge variant="outline" className="text-micro border-border/40 text-muted-foreground">
                    {item.category}
                  </Badge>
                  <span className="text-micro text-muted-foreground shrink-0">
                    {new Date(item.date).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.excerpt}</p>
                <div className="flex items-center gap-1 mt-2 text-micro text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Read more</span>
                  <ArrowRight className="size-3" />
                </div>
              </motion.div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-4 text-xs text-muted-foreground">
            <ExternalLink className="size-3 mr-1" />
            View all treasury announcements
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
