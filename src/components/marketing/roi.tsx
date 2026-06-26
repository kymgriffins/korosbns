"use client";

import React from "react";
import { motion } from "motion/react";
import Wrapper from "../global/wrapper";
import SectionBadge from "@/ui/section-badge";
import { TrendingUp, ShieldCheck, Database, Landmark } from "lucide-react";
import { cn } from "@/utils";

const roiItems = [
    {
        title: "Democratic Stability",
        description: "Channeling youth frustration away from chaotic protests into constructive, policy-based dialogue and sustainable civic engagement.",
        icon: ShieldCheck,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        title: "Data Intelligence",
        description: "Exclusive access to real-time sentiment analysis and priority mapping from over 5 million young Kenyans across all 47 counties.",
        icon: Database,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "Institutional Legacy",
        description: "Positioning your organization as the primary architect of Kenya's next generation of informed and responsible civic leadership.",
        icon: Landmark,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
    }
];

const ROI = () => {
    return (
        <section id="roi" className="w-full py-16 lg:py-24 bg-foreground/[0.02] border-y border-white/5">
            <Wrapper>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <SectionBadge title="Strategic Value" />
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold tracking-tight mt-6"
                        >
                            The Return on <br />
                            <span className="text-primary">Investment</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-muted-foreground mt-6 leading-relaxed"
                        >
                            Beyond social impact, Budget Ndio Story provides strategic value for partners looking to build a stable, data-driven democratic future.
                        </motion.p>

                        <div className="mt-8">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                <div className="size-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                                    <TrendingUp className="size-5 text-white" />
                                </div>
                                <p className="text-sm font-medium">
                                    Join the movement and write the story of Kenya&apos;s fiscal future together.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {roiItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all group"
                            >
                                <div className="flex gap-5">
                                    <div className={cn(
                                        "size-12 rounded-xl flex items-center justify-center shrink-0",
                                        item.bg,
                                        item.color
                                    )}>
                                        <item.icon className="size-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </Wrapper>
        </section>
    );
};

export default ROI;
