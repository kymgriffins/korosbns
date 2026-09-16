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
                            <p className="max-w-md text-sm font-medium leading-relaxed text-foreground/80">
                                {landingSectionsContent.roi.ctaText}
                            </p>
                        </div>
                    </div>

                    <div className="divide-y divide-border/50 border-y border-border/50">
                        {roiItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group py-6"
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
                                        <h3 className="text-lg font-bold transition-colors group-hover:text-primary">{item.title}</h3>
                                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
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
