"use client";

import { BookOpen, FileBarChart, FileText, Landmark, Newspaper, Scale, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GALLERY_ITEMS = [
  {
    icon: FileText,
    title: "Budget Summary",
    desc: "Consolidated overview of revenue, expenditure, and fiscal aggregates",
    color: "hsl(221 83% 53%)",
  },
  {
    icon: FileBarChart,
    title: "Sector Allocations",
    desc: "Detailed breakdown of national resource distribution by sector",
    color: "hsl(142 76% 36%)",
  },
  {
    icon: Landmark,
    title: "Revenue Report",
    desc: "Tax collections, appropriations-in-aid, and external grants analysis",
    color: "hsl(47 95% 48%)",
  },
  {
    icon: Scale,
    title: "Debt Statement",
    desc: "Borrowing plan, interest obligations, and fiscal sustainability metrics",
    color: "hsl(346 77% 50%)",
  },
  {
    icon: BookOpen,
    title: "County Allocations",
    desc: "Equitable share distribution across all 47 counties",
    color: "hsl(173 80% 40%)",
  },
  {
    icon: Users,
    title: "Social Programs",
    desc: "Spending on education, health, social protection, and youth initiatives",
    color: "hsl(12 76% 61%)",
  },
  {
    icon: Newspaper,
    title: "Economic Survey",
    desc: "Macroeconomic indicators and development expenditure highlights",
    color: "hsl(24 95% 53%)",
  },
  {
    icon: FileText,
    title: "Appropriation Bill",
    desc: "Legal authorization for government spending from the consolidated fund",
    color: "hsl(173 80% 40%)",
  },
];

export function GallerySection() {
  return (
    <section id="gallery" className="scroll-mt-24">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            Budget Documents Gallery
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Key budget documents and reports for the fiscal year
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {GALLERY_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-lg border bg-card p-4 transition-all hover:border-primary/30 cursor-default"
                >
                  <div
                    className="mb-3 flex size-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon className="size-5" style={{ color: item.color }} />
                  </div>
                  <h4 className="text-xs font-semibold mb-1">{item.title}</h4>
                  <p className="text-[10px] leading-relaxed text-muted-foreground">{item.desc}</p>
                  <div
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
