"use client";

import Wrapper from '@/components/global/wrapper';
import SectionBadge from '@/components/ui/section-badge';
import { motion } from 'motion/react';
import React from 'react';
import { landingSectionsContent } from "@/content";

const debtVsBudget = landingSectionsContent.wallOfLove.debtVsBudget as Array<{ year: string; budget: number; debt: number }>;
const debtServiceShare = landingSectionsContent.wallOfLove.debtServiceShare as Array<{ label: string; value: number }>;
const countyTransfers = landingSectionsContent.wallOfLove.countyTransfers as Array<{ year: string; value: number }>;

const chartMax = 11.5;
const shareMax = 40;
const transferMax = 420;

const BarPair = ({ year, budget, debt }: { year: string; budget: number; debt: number }) => (
    <div className="flex flex-col items-center gap-2">
        <div className="flex items-end gap-1 h-40">
            <motion.div
                initial={{ height: 0, opacity: 0.4 }}
                whileInView={{ height: `${(budget / chartMax) * 100}%`, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.75 }}
                className="w-4 md:w-5 rounded-t-sm bg-primary"
            />
            <motion.div
                initial={{ height: 0, opacity: 0.4 }}
                whileInView={{ height: `${(debt / chartMax) * 100}%`, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="w-4 md:w-5 rounded-t-sm bg-destructive"
            />
        </div>
        <span className="text-[10px] md:text-xs text-muted-foreground">{year}</span>
    </div>
);

const WallOfLove = () => {
    return (
        <section id="voices" className="w-full py-18 bg-background/50">
            <Wrapper>
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <SectionBadge title={landingSectionsContent.wallOfLove.badge} />
                    <h2 className="title mt-5 text-3xl md:text-5xl font-bold tracking-tight">
                        {landingSectionsContent.wallOfLove.title}
                    </h2>
                    <p className="desc mt-4 text-muted-foreground">
                        {landingSectionsContent.wallOfLove.description}
                    </p>
                </motion.div>

                <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <motion.article
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-2 rounded-3xl border border-foreground/10 bg-background/70 p-6 md:p-8"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg md:text-xl font-semibold">Debt vs Budget Growth (KES Trillion)</h3>
                            <div className="flex items-center gap-3 text-xs">
                                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-primary" />Budget</span>
                                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-destructive" />Debt</span>
                            </div>
                        </div>
                            <div className="rounded-2xl border border-foreground/10 bg-muted/20 p-4 md:p-5">
                            <div className="flex items-end justify-between gap-2 md:gap-4">
                                {debtVsBudget.map((point) => (
                                    <BarPair key={point.year} year={point.year} budget={point.budget} debt={point.debt} />
                                ))}
                            </div>
                        </div>
                    </motion.article>

                    <motion.article
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65 }}
                        className="rounded-3xl border border-foreground/10 bg-background/70 p-6"
                    >
                        <h3 className="text-lg font-semibold">Debt Service Share</h3>
                        <p className="text-xs text-muted-foreground mt-1">Share of ordinary revenue used for debt servicing (%)</p>
                        <div className="mt-5 space-y-4">
                            {debtServiceShare.map((item) => (
                                <div key={item.label}>
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span>{item.label}</span>
                                        <span className="font-medium">{item.value}%</span>
                                    </div>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(item.value / shareMax) * 100}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.7 }}
                                        className="h-3 rounded-md bg-primary"
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.article>

                    <motion.article
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-3 rounded-3xl border border-foreground/10 bg-background/70 p-6 md:p-8"
                    >
                        <h3 className="text-lg md:text-xl font-semibold">County Equitable Transfers Growth (KES Billion)</h3>
                        <div className="mt-6 grid grid-cols-5 gap-3 md:gap-5 items-end">
                            {countyTransfers.map((item) => (
                                <div key={item.year} className="flex flex-col items-center gap-2">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        whileInView={{ height: `${(item.value / transferMax) * 180}px` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8 }}
                                        className="w-full max-w-[70px] rounded-t-md bg-primary"
                                    />
                                    <span className="text-xs text-muted-foreground">{item.year}</span>
                                    <span className="text-[11px] md:text-xs font-medium">{item.value}B</span>
                                </div>
                            ))}
                        </div>
                    </motion.article>
                </div>
            </Wrapper>
        </section>
    );
};

export default WallOfLove;
