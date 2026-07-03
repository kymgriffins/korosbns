"use client";

import { useState } from 'react'
import { cn } from "@/utils";
import {
    HelpCircle, ChevronDown, ArrowRight, FileText, Building2, TrendingUp, 
    AlertTriangle, DollarSign, Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import Wrapper from "@/components/global/wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqCategories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle, count: 10 },
  { id: 'basics', label: 'Budget Basics', icon: FileText, count: 3 },
  { id: 'eta', label: 'BETA Agenda', icon: TrendingUp, count: 1 },
  { id: 'debt', label: 'Debt & Borrowing', icon: Wallet, count: 2 },
  { id: 'counties', label: 'Counties', icon: Building2, count: 1 },
  { id: 'risks', label: 'Fiscal Risks', icon: AlertTriangle, count: 2 },
]

const faqItems = [
  { 
    q: "What is the Budget Policy Statement (BPS)?", 
    a: "The BPS is a yearly government document that sets out Kenya's spending priorities. It's like a preview of the national budget - showing where money will come from and where it'll go.",
    category: 'basics'
  },
  { 
    q: "When is the BPS released?", 
    a: "By law (PFM Act), the BPS must be submitted to Parliament by February 15th every year. The final budget comes later on April 30th.",
    category: 'basics'
  },
  { 
    q: "What's the difference between BPS and the national budget?", 
    a: "Think of BPS as the blueprint or trailer, and the national budget as the full movie. BPS sets the priorities and direction, while the budget is the actual detailed spending plan.",
    category: 'basics'
  },
  { 
    q: "What is BETA?", 
    a: "BETA = Bottom-Up Economic Transformation Agenda. It's Kenya's plan to grow the economy by focusing on agriculture, small businesses, healthcare, housing, and digital transformation.",
    category: 'eta'
  },
  { 
    q: "Why does Kenya borrow so much?", 
    a: "Kenya spends more than it collects in taxes (fiscal deficit). The gap is filled through borrowing - both from foreign sources and domestic (like treasury bonds). This helps fund development but also increases debt costs.",
    category: 'debt'
  },
  { 
    q: "What is the fiscal deficit?", 
    a: "When government spending exceeds revenue, that's a fiscal deficit. Kenya's FY2026/27 deficit is KES 1,146.2 billion (5.5% of GDP) — up from KES 933.3 billion in FY2025/26 — financed through borrowing.",
    category: 'debt'
  },
  { 
    q: "How much goes to county governments?", 
    a: "In FY2026/27, Parliament approved KES 428 billion equitable share to counties (KES 415B in FY2025/26). Total county allocation is KES 502 billion including conditional grants. This funds local services like roads, health, water, and markets in all 47 counties.",
    category: 'counties'
  },
  { 
    q: "What are the main fiscal risks?", 
    a: "The BPS warns about: rising debt payments, state corporations needing bailouts, economic slowdowns, climate change (droughts/floods), and increased county demands.",
    category: 'risks'
  },
  { 
    q: "How does the budget affect me?", 
    a: "Every shilling in the budget affects public services you use: roads, schools, hospitals, security, and more. Understanding the budget helps you hold leaders accountable.",
    category: 'basics'
  },
  { 
    q: "Are there climate risks in the budget?", 
    a: "Yes! The BPS identifies climate change as a major fiscal risk. Droughts can reduce agricultural output and hydroelectric power, while floods can damage infrastructure. These affect tax revenue and increase emergency spending.",
    category: 'risks'
  },
]

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  
  const filteredItems = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory)
  
  return (
    <section className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col pt-20 pb-12">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full" 
        />
      </div>

      <Wrapper className="relative z-10 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Side Menu */}
          <div className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-2">
              <div className="hidden lg:block p-4 rounded-2xl bg-muted/30 border border-border">
                <h2 className="text-sm font-semibold text-foreground/60 mb-3 uppercase tracking-wider">Categories</h2>
                <div className="space-y-1">
                  {faqCategories.map((cat) => {
                    const Icon = cat.icon
                    return (
                      <button
                        key={cat.id}
                        onClick={() => { setActiveCategory(cat.id); setOpenFaq(null); }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                          activeCategory === cat.id 
                            ? "bg-primary text-white" 
                            : "text-foreground/70 hover:bg-muted/30 hover:text-foreground"
                        )}
                      >
                        <Icon className="size-4" />
                        <span className="flex-1 text-sm font-medium">{cat.label}</span>
                        <span className={cn(
                          "text-xs px-1.5 py-0.5 rounded-full",
                          activeCategory === cat.id 
                            ? "bg-muted/70" 
                            : "bg-muted/50"
                        )}>
                          {cat.count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
              
              {/* Mobile category dropdown */}
              <div className="lg:hidden">
                <select 
                  value={activeCategory}
                  onChange={(e) => { setActiveCategory(e.target.value); setOpenFaq(null); }}
                  className="w-full p-3 rounded-xl bg-muted/30 border border-border text-sm"
                >
                  {faqCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="flex-1 min-w-0 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-2xl sm:text-4xl font-bold font-heading tracking-tight">
                Frequently Asked <span className="text-primary">Questions</span>
              </h1>
              <p className="text-sm text-foreground/60 mt-2">
                {filteredItems.length} question{filteredItems.length !== 1 ? 's' : ''} about Kenya's budget
              </p>
            </motion.div>

            <div className="space-y-3">
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-xl bg-muted/30 border border-border overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="size-5 text-primary shrink-0" />
                      <span className="text-sm sm:text-base font-medium">{item.q}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: openFaq === idx ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="size-5 text-foreground/50 shrink-0" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: openFaq === idx ? 'auto' : 0,
                      opacity: openFaq === idx ? 1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 pl-12 sm:pl-13 text-sm text-foreground/70">{item.a}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-teal-500/20 border border-primary/20 overflow-hidden text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:24px_24px]" />
              <div className="relative z-10 space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold">Still have questions?</h2>
                <p className="text-sm text-foreground/60 max-w-md mx-auto">
                  Dive deeper into the Budget Policy Statement with our interactive learning module.
                </p>
                <Link href="/learn">
                  <Button size="lg" className="h-11 px-6 rounded-xl text-sm font-medium">
                    Start Learning <ArrowRight className="size-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="max-w-3xl mx-auto w-full pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-foreground/30 px-4">
              <p className="text-[10px] font-medium">© 2026 Budget Ndio Story.</p>
              <div className="flex items-center gap-4 text-[9px] font-medium uppercase tracking-wider">
                <a href="mailto:info@budgetndiostory.com" className="hover:text-foreground">Email</a>
                <a href="/privacy" className="hover:text-foreground">Privacy</a>
                <a href="/terms" className="hover:text-foreground">Terms</a>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}