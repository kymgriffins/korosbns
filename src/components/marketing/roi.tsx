"use client";

import React from "react";
import { motion } from "motion/react";
import Wrapper from "../global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { TrendingUp, ShieldCheck, Database, Landmark } from "lucide-react";
import { cn } from "@/utils";
import { landingSectionsContent } from "@/content";

const roiIconMap: Record<string, React.ComponentType<{ className?: string }>> = { ShieldCheck, Database, Landmark, TrendingUp };

const roiItems = landingSectionsContent.roi.items as Array<{ title: string; description: string; icon: string; color: string; bg: string }>;

const ROI = () => {
    return (
        <section id="roi" className="w-full py-16 lg:py-24 bg-foreground/[0.02] border-y border-border/50">
            <Wrapper>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <SectionBadge title={landingSectionsContent.roi.badge} />
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-bold tracking-tight mt-6"
                        >
                            {landingSectionsContent.roi.title}
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-muted-foreground mt-6 leading-relaxed"
                        >
                            {landingSectionsContent.roi.description}
                        </motion.p>

                        <div className="mt-8">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                <div className="size-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                                    <TrendingUp className="size-5 text-white" />
                                </div>
                                <p className="text-sm font-medium">
                                    {landingSectionsContent.roi.ctaText}
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
                                        {(() => { const Icon = roiIconMap[item.icon as string] || TrendingUp; return <Icon className="size-6" />; })()}
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
