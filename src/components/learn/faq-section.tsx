"use client";

import { motion } from "motion/react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import Container from "../global/container";

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
    a: "In 2026/27, Parliament approved KES 428 billion equitable share to counties (total county allocation KES 502 billion). This funds local services like roads, health, water, and markets in all 47 counties.",
  },
  {
    q: "What are the main fiscal risks?",
    a: "The BPS warns about: rising debt payments, state corporations needing bailouts, economic slowdowns, climate change (droughts/floods), and increased county demands.",
  },
];

export function FAQSection() {
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
            className="rounded-xl bg-muted/30 border border-border overflow-hidden"
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
